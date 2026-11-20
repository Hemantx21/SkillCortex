import { useState, useEffect, useRef, useCallback } from 'react';
import { motion as Motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useTabSwitchLimit from '../hooks/useTabSwitchLimit';
import axios from 'axios';
import { Mic, MicOff, FileText, Clock3, StopCircle, CheckCircle2, AlertTriangle, Camera, CameraOff, Sparkles, Volume2, Send } from 'lucide-react';

export default function InterviewSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();
  const { job, resume, applicationId } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationMessage, setEvaluationMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(600);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [interviewError, setInterviewError] = useState('');
  const [answerDraft, setAnswerDraft] = useState('');
  const [liveCaption, setLiveCaption] = useState('');
  const [heardAnswer, setHeardAnswer] = useState('');
  const [answerFeedback, setAnswerFeedback] = useState('');
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const interimTranscriptRef = useRef('');
  const messagesRef = useRef([]);
  const startedRef = useRef(false);
  const endingRef = useRef(false);
  const answerSendingRef = useRef(false);
  const pendingAnswerIdsRef = useRef(new Map());
  const speakQuestionRef = useRef(() => {});

  const speakQuestion = useCallback((question) => {
    if (!question || !window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    recognitionRef.current?.stop();
    setIsListening(false);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.lang = 'en-US';
    utterance.rate = 0.96;
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith('en'));
    const preferredFemaleVoice = englishVoices.find((voice) => /female|woman|samantha|ava|victoria|karen|susan|zira|aria|jenny|michelle|sara|hazel|sonia|natasha|google.*english/i.test(voice.name));
    utterance.voice = preferredFemaleVoice || englishVoices[0] || null;
    utteranceRef.current = utterance;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setInterviewError('Audio playback failed. Read the question and type or record your answer.');
    };
    window.speechSynthesis.speak(utterance);
  }, []);
  speakQuestionRef.current = speakQuestion;

  const startInterview = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setInterviewError('');
    setIsTyping(true);
    try {
      const response = await axios.post('/api/interview/generate', {
        resume,
        jobRole: job.title,
        jobRequirements: Array.isArray(job.requirements) ? job.requirements : [job.requirements].filter(Boolean),
        difficulty: location.state?.level || 'Intermediate',
        previousMessages: messagesRef.current,
      }, { headers: { Authorization: `Bearer ${token}` } });
      const firstQuestion = response.data?.text?.trim();
      if (!firstQuestion) throw new Error('The interviewer returned an empty question.');
      setMessages((current) => [...current, { role: 'assistant', content: firstQuestion }]);
      speakQuestion(firstQuestion);
    } catch (error) {
      startedRef.current = false;
      console.error('Interview start failed:', error);
      setInterviewError(error.response?.data?.message || 'The interviewer is temporarily unavailable. Please try again.');
    } finally {
      setIsTyping(false);
    }
  }, [job, location.state, resume, speakQuestion, token]);

  const handleEndInterview = useCallback(async ({ outcome = 'completed', endReason = '' } = {}) => {
    if (endingRef.current) return;
    endingRef.current = true;
    setInterviewComplete(true);
    setIsListening(false);
    setIsSpeaking(false);
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
    setIsEvaluating(true);
    try {
      const response = await axios.post('/api/interview/evaluate', {
        jobId: job._id,
        applicationId,
        jobTitle: job.title,
        jobRequirements: Array.isArray(job.requirements) ? job.requirements : [job.requirements].filter(Boolean),
        interviewOutcome: outcome,
        interviewEndReason: endReason,
        transcript: messages,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setEvaluationMessage(response.data?.message || 'Your interview transcript has been submitted for review.');
    } catch (error) {
      console.error('Interview evaluation failed:', error);
      setEvaluationMessage(error.response?.data?.message || 'Interview ended. Review is temporarily unavailable.');
    } finally {
      setIsEvaluating(false);
    }
  }, [applicationId, job, messages, token]);

  const { switchCount: tabSwitchCount } = useTabSwitchLimit(
    !authLoading && Boolean(user && job && resume) && !interviewComplete,
    () => handleEndInterview({ outcome: 'candidate_quit', endReason: 'tab_switch_limit' }),
  );

  const continueInterview = useCallback(async () => {
    setInterviewError('');
    setIsTyping(true);
    try {
      const response = await axios.post('/api/interview/generate', {
        resume,
        jobRole: job.title,
        jobRequirements: Array.isArray(job.requirements) ? job.requirements : [job.requirements].filter(Boolean),
        difficulty: location.state?.level || 'Intermediate',
        previousMessages: messagesRef.current,
      }, { headers: { Authorization: `Bearer ${token}` } });
      const question = response.data?.text?.trim();
      if (!question) throw new Error('Empty interviewer question');
      setMessages((current) => [...current, { role: 'assistant', content: question }]);
      speakQuestion(question);
    } catch (error) {
      console.error('Unable to continue interview:', error);
      setInterviewError(error.response?.data?.message || 'The interviewer is temporarily unavailable. Please try again.');
    } finally {
      setIsTyping(false);
    }
  }, [job, location.state, resume, speakQuestion, token]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const setupMedia = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access is not available in this browser.');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraAvailable(true);
    } catch (err) {
      console.error('Camera access unavailable:', err);
      setCameraAvailable(false);
    }
  }, []);

  const handleSendAnswer = useCallback(async (transcript) => {
    if (!transcript || !transcript.trim()) return;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    const currentQuestion = [...messagesRef.current].reverse().find((message) => message.role === 'assistant')?.content;
    if (!currentQuestion || answerSendingRef.current || endingRef.current) return;
    answerSendingRef.current = true;
    const userMsg = { role: 'user', content: transcript };
    const conversation = [...messagesRef.current, userMsg];
    messagesRef.current = conversation;
    setHeardAnswer(transcript.trim());
    setAnswerFeedback('');
    setLiveCaption(transcript.trim());
    setMessages(conversation);
    setIsListening(false);
    setIsTyping(true);
    setInterviewError('');
    try {
      const answer = transcript.trim();
      let answerId = pendingAnswerIdsRef.current.get(answer);
      if (!answerId) {
        answerId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        pendingAnswerIdsRef.current.set(answer, answerId);
      }
      const response = await axios.post('/api/interview/respond', {
        resume,
        jobRole: job.title,
        jobRequirements: Array.isArray(job.requirements) ? job.requirements : [job.requirements].filter(Boolean),
        difficulty: location.state?.level || 'Intermediate',
        previousMessages: conversation,
        question: currentQuestion,
        answer,
        answerId,
      }, { headers: { Authorization: `Bearer ${token}` } });
      const result = response.data || {};
      pendingAnswerIdsRef.current.delete(answer);
      const { score = null, feedback = 'Answer recorded.' } = result;
      setAnswerFeedback(feedback);
      const answerReview = { role: 'feedback', content: feedback, score };
      const nextMessages = [...conversation, answerReview];
      let nextQuestion = result.nextQuestion?.trim();
      if (!nextQuestion) {
        const followUp = await axios.post('/api/interview/generate', {
          resume,
          jobRole: job.title,
          jobRequirements: Array.isArray(job.requirements) ? job.requirements : [job.requirements].filter(Boolean),
          difficulty: location.state?.level || 'Intermediate',
          previousMessages: conversation,
        });
        nextQuestion = followUp.data?.text?.trim();
      }
      if (nextQuestion) nextMessages.push({ role: 'assistant', content: nextQuestion });
      messagesRef.current = nextMessages;
      setMessages(nextMessages);
      setAnswerDraft('');
      if (nextQuestion) speakQuestionRef.current(nextQuestion);
      else setInterviewError('Your answer was recorded, but the interviewer could not prepare a follow-up. Please retry.');
    } catch (error) {
      pendingAnswerIdsRef.current.delete(transcript.trim());
      console.error('Interview follow-up failed:', error);
      setAnswerFeedback('I received your answer, but could not get AI feedback yet. Please retry.');
      setInterviewError(error.response?.data?.message || 'The interviewer is temporarily unavailable. Please retry when ready.');
    } finally {
      answerSendingRef.current = false;
      setIsTyping(false);
    }
  }, [job, location.state, resume, token]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setInterviewError('Voice input is not supported in this browser.');
      return;
    }
    if (isTyping || isSpeaking || interviewComplete) return;
    if (isListening) {
      recognitionRef.current.stop();
      return;
    }
    setInterviewError('');
    finalTranscriptRef.current = '';
    interimTranscriptRef.current = '';
    setLiveCaption('');
    try { recognitionRef.current.start(); }
    catch (error) {
      setInterviewError(error.name === 'NotAllowedError' || error.name === 'SecurityError'
        ? 'Microphone access was blocked. Allow microphone access in your browser, then try again.'
        : 'Microphone could not start. Check browser permissions and try again.');
    }
  };

  useEffect(() => {
    if (!authLoading && !user) navigate('/login', { replace: true });
    else if (!authLoading && user?.role !== 'candidate') navigate(user.role === 'hr' ? '/profile' : '/admin', { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (authLoading || !user) return;
    if (!job || !resume) {
      navigate('/interview-setup', { replace: true });
      return;
    }
    startInterview();
  }, [authLoading, user, job, resume, navigate, startInterview]);

  useEffect(() => {
    if (authLoading || !user || !job || !resume) return undefined;
    const videoElement = videoRef.current;
    setupMedia();
    window.speechSynthesis.cancel();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceAvailable(false);
      return () => videoElement?.srcObject?.getTracks().forEach((track) => track.stop());
    }
    setVoiceAvailable(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => {
      setInterviewError('');
      setIsListening(true);
    };
    recognition.onresult = (event) => {
      let interim = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (result.isFinal) finalTranscriptRef.current += `${result[0].transcript} `;
        else interim += result[0].transcript;
      }
      interimTranscriptRef.current = interim;
      setLiveCaption(`${finalTranscriptRef.current}${interim}`.trim());
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => recognition.stop(), 2000);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setInterviewError('Microphone access was blocked. Allow microphone access in your browser, then try again.');
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setInterviewError('Voice recognition stopped. Tap the microphone to retry or type your answer.');
      }
    };
    recognition.onnomatch = () => setInterviewError('I could not recognize that answer. Please try again or type it.');
    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
      const answer = (finalTranscriptRef.current || interimTranscriptRef.current).trim();
      finalTranscriptRef.current = '';
      interimTranscriptRef.current = '';
      if (answer && !endingRef.current) handleSendAnswer(answer);
      else if (!endingRef.current) setInterviewError('No speech was detected. Tap the microphone to try again or type your answer.');
    };
    recognitionRef.current = recognition;
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      recognition.stop();
      if (videoElement?.srcObject) videoElement.srcObject.getTracks().forEach((track) => track.stop());
    };
  }, [authLoading, user, job, resume, setupMedia, handleSendAnswer]);

  useEffect(() => {
    if (interviewComplete) return undefined;
    if (timeLeft <= 0) {
      handleEndInterview();
      return undefined;
    }
    const timerId = setInterval(() => setTimeLeft((remaining) => remaining - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, interviewComplete, handleEndInterview]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!applicationId || !job?._id || !token || interviewComplete) return undefined;
    const handlePageHide = (event) => {
      if (event.persisted || endingRef.current) return;
      endingRef.current = true;
      fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          jobId: job._id,
          applicationId,
          jobTitle: job.title,
          jobRequirements: Array.isArray(job.requirements) ? job.requirements : [job.requirements].filter(Boolean),
          interviewOutcome: 'candidate_quit',
          interviewEndReason: 'left_interview',
          transcript: messages.slice(-16).map(({ role, content }) => ({ role, content: content.slice(0, 3000) })),
        }),
        keepalive: true,
      }).then((response) => {
        if (!response.ok) console.error('Could not save interview exit scorecard:', response.status);
      }).catch((error) => console.error('Could not save interview exit scorecard:', error));
    };
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, [applicationId, interviewComplete, job, messages, token]);

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F4F2F1]"><div role="status" className="flex items-center gap-3 text-sm font-medium text-[#6B6561]"><span className="size-5 animate-spin rounded-full border-2 border-[#E6E2E0] border-t-[#E35013]" />Preparing your interview...</div></div>;
  }
  if (!user) return null;

  const assistantTurns = messages.filter((message) => message.role === 'assistant');
  const currentQuestion = assistantTurns.at(-1)?.content || '';

  return (
    <div className="min-h-screen bg-[#F4F2F1] pb-20">
      <header className="sticky top-0 z-30 border-b border-[#E6E2E0] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#E35013]"><Sparkles className="size-3.5" />Live interview</div>
            <h1 className="mt-0.5 truncate text-base font-semibold text-[#2E2C2A] sm:text-lg">{job?.title || 'Interview session'}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-sm font-semibold tabular-nums ${timeLeft < 60 ? 'border-red-200 bg-red-50 text-red-700' : 'border-[#E6E2E0] bg-[#FAF9F8] text-[#4F4945]'}`}><Clock3 className="size-4" />{formatTime(timeLeft)}</div>
            {!interviewComplete && <button type="button" onClick={() => handleEndInterview({ outcome: 'candidate_quit', endReason: 'candidate_ended' })} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#2E2C2A] px-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#4F4945] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E35013]"><StopCircle className="size-4" /><span className="hidden sm:inline">End interview</span><span className="sm:hidden">End</span></button>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-7">
        {tabSwitchCount > 0 && tabSwitchCount < 3 && !interviewComplete && <div role="alert" className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-900">You have switched away from the interview {tabSwitchCount} of 3 times. The interview ends after 3 switches.</div>}
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.8fr)]">
          <section aria-label="Interview video and controls" className="overflow-hidden rounded-xl border border-[#303331] bg-[#202422] shadow-[0_16px_40px_-28px_rgba(20,24,22,0.7)]">
            <div className="relative aspect-video min-h-[300px] max-h-[68vh] overflow-hidden bg-[#252A27] sm:min-h-[420px]">
              <video ref={videoRef} autoPlay playsInline muted className={`absolute inset-0 size-full object-cover ${cameraAvailable ? 'scale-x-[-1]' : 'hidden'}`} />
              {!cameraAvailable && <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white"><span className="mb-4 flex size-14 items-center justify-center rounded-xl bg-white/10">{cameraAvailable ? <Camera className="size-6" /> : <CameraOff className="size-6 text-white/65" />}</span><p className="font-semibold">Camera preview unavailable</p><p className="mt-1 max-w-sm text-sm text-white/60">You can continue the interview using voice input.</p></div>}
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md bg-black/55 px-3 py-2 text-xs font-semibold text-white backdrop-blur"><span className={`size-2 rounded-full ${isListening || isSpeaking ? 'animate-pulse bg-[#E35013]' : 'bg-[#8BBF9A]'}`} />{isSpeaking ? 'Interviewer speaking' : isListening ? 'Listening to your answer' : 'Interview in progress'}</div>
              <div className="absolute bottom-4 left-4 rounded-md bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">{user?.name || 'Candidate'}</div>
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="rounded-md bg-black/55 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur">{cameraAvailable ? 'Camera ready' : 'Camera off'}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-4 py-4 sm:px-5">
              <div className="flex items-center gap-2 text-sm text-white/65"><span className={`size-2 rounded-full ${voiceAvailable ? 'bg-[#8BBF9A]' : 'bg-[#E3A189]'}`} />{voiceAvailable ? 'Voice input supported' : 'Voice input unavailable'}</div>
              <button type="button" onClick={startListening} disabled={interviewComplete || isTyping || isSpeaking || !voiceAvailable} aria-pressed={isListening} className={`flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-55 ${isListening ? 'bg-[#E35013] text-white' : 'bg-white text-[#2E2C2A] hover:bg-[#F4F2F1]'}`}>
                {isListening ? <Mic className="size-4 animate-pulse" /> : <MicOff className="size-4" />}{isListening ? 'Finish and send answer' : isSpeaking ? 'Question speaking' : 'Answer by voice'}
              </button>
            </div>
          </section>

          <aside className="flex min-h-[520px] flex-col overflow-hidden rounded-xl border border-[#E6E2E0] bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-[#E6E2E0] px-4 py-4 sm:px-5">
              <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#E35013]">Question {assistantTurns.length || 1}</p><h2 className="mt-0.5 font-semibold text-[#2E2C2A]">Listen, then answer</h2></div>
              <span className={`flex size-9 items-center justify-center rounded-lg ${isSpeaking ? 'bg-[#FBE9E1] text-[#C94410]' : 'bg-[#F4F2F1] text-[#4F4945]'}`}>{isSpeaking ? <Volume2 className="size-4 animate-pulse" /> : <Sparkles className="size-4" />}</span>
            </div>

            {interviewError && <div role="alert" className="mx-4 mt-4 flex items-start gap-2 rounded-lg border border-[#E6E2E0] bg-[#FAF9F8] p-3 text-sm text-[#6B6561] sm:mx-5"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#9A7540]" /><span className="flex-1">{interviewError}</span><button type="button" onClick={messages.length === 0 ? startInterview : continueInterview} disabled={isTyping} className="shrink-0 font-semibold text-[#4F4945] underline underline-offset-2 disabled:opacity-50">Continue interview</button></div>}

            {(isListening || heardAnswer) && (
              <section aria-live="polite" aria-atomic="true" className="mx-4 mt-4 rounded-lg border border-[#D8D2CE] bg-[#FAF9F8] p-3.5 sm:mx-5">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#6B6561]">
                  {isListening ? <Mic className="size-3.5 animate-pulse text-[#E35013]" /> : <CheckCircle2 className="size-3.5 text-[#538568]" />}
                  {isListening ? 'Live caption · listening' : isTyping ? 'Answer received · getting feedback' : 'I heard you say'}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#2E2C2A]">{isListening ? liveCaption || 'Speak now; your words will appear here.' : heardAnswer}</p>
                {answerFeedback && <p className="mt-2 border-t border-[#E6E2E0] pt-2 text-sm leading-relaxed text-[#4F4945]"><span className="font-semibold">AI feedback: </span>{answerFeedback}</p>}
              </section>
            )}

            <form onSubmit={(event) => {
              event.preventDefault();
              const answer = answerDraft.trim();
              if (!answer || isTyping || isSpeaking || isListening || interviewComplete) return;
              recognitionRef.current?.stop();
              handleSendAnswer(answer);
            }} className="mx-4 mt-4 space-y-2 sm:mx-5">
              <label htmlFor="interview-answer" className="text-sm font-semibold text-[#4F4945]">Your answer</label>
              <textarea id="interview-answer" value={answerDraft} onChange={(event) => setAnswerDraft(event.target.value)} rows={3} disabled={isTyping || isSpeaking || isListening || interviewComplete} placeholder="Type your answer here, or use voice input below..." className="w-full resize-y rounded-lg border border-[#E6E2E0] bg-white p-3 text-sm leading-relaxed text-[#2E2C2A] outline-none focus:border-[#E35013] focus:ring-2 focus:ring-[#E35013]/15 disabled:bg-[#FAF9F8]" />
              <button type="submit" disabled={!answerDraft.trim() || isTyping || isSpeaking || isListening || interviewComplete || !currentQuestion} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#2E2C2A] px-4 text-sm font-semibold text-white hover:bg-[#4F4945] disabled:cursor-not-allowed disabled:opacity-50"><Send className="size-4" />Send answer</button>
            </form>

            <div className="flex flex-1 flex-col p-5 sm:p-6" aria-live="polite">
              {isTyping && !currentQuestion ? <div role="status" className="flex flex-1 flex-col items-center justify-center text-center"><span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#F4F2F1] text-[#6B6561]"><Volume2 className="size-5 animate-pulse" /></span><p className="font-semibold text-[#2E2C2A]">Connecting to interviewer</p></div> : currentQuestion ? (
                <Motion.div key={currentQuestion} initial={{ y: 8 }} animate={{ y: 0 }} className="flex flex-1 flex-col justify-center">
                  <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[#817B77]"><Sparkles className="size-4 text-[#E35013]" />Interviewer</div>
                  <p className="text-xl font-medium leading-relaxed text-[#2E2C2A] sm:text-2xl">{currentQuestion}</p>
                  <button type="button" onClick={() => speakQuestion(currentQuestion)} disabled={!currentQuestion || interviewComplete || isSpeaking} className="mt-6 inline-flex min-h-10 w-fit items-center gap-2 rounded-lg border border-[#E6E2E0] px-3.5 text-sm font-semibold text-[#4F4945] transition-colors hover:bg-[#FAF9F8] disabled:opacity-45"><Volume2 className="size-4 text-[#E35013]" />Repeat question</button>
                </Motion.div>
              ) : <div role="status" className="flex flex-1 items-center justify-center text-center text-sm text-[#817B77]">The interviewer is ready when you are.</div>}

              {isListening && <div aria-live="polite" className="mt-4 flex items-center gap-2 rounded-lg border border-[#E6E2E0] bg-[#FAF9F8] p-4 text-sm font-medium text-[#6B6561]"><Mic className="size-4 animate-pulse text-[#C94410]" />Listening</div>}

              <div className="mt-auto border-t border-[#E6E2E0] pt-5">
                <div className="flex items-start gap-3 rounded-lg bg-[#FAF9F8] p-3.5"><span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${isListening ? 'bg-[#FBE9E1] text-[#C94410]' : 'bg-white text-[#6B6561]'}`}>{isListening ? <Mic className="size-4 animate-pulse" /> : <MicOff className="size-4" />}</span><p className="text-sm leading-relaxed text-[#6B6561]">{isListening ? 'Listening to your response. Pause when you finish, or tap “Finish and send answer” to submit now.' : voiceAvailable ? 'Tap “Answer by voice” after the interviewer asks a question, or type your answer below.' : 'Voice input is not supported in this browser. Type your answer below to continue.'}</p></div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#817B77]"><span className="inline-flex items-center gap-1.5">{cameraAvailable ? <Camera className="size-3.5 text-[#538568]" /> : <CameraOff className="size-3.5 text-[#9E9894]" />}{cameraAvailable ? 'Camera connected' : 'Camera unavailable'}</span><span className="inline-flex items-center gap-1.5">{voiceAvailable ? <Mic className="size-3.5 text-[#538568]" /> : <MicOff className="size-3.5 text-[#9E9894]" />}{voiceAvailable ? 'Voice recognition supported' : 'Voice unsupported'}</span></div>
              </div>
            </div>
          </aside>
        </div>

        {interviewComplete && <Motion.section initial={{ y: 10 }} animate={{ y: 0 }} className="mt-4 flex flex-col gap-3 rounded-xl border border-[#BFD9C8] bg-[#F1F8F3] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#39734B]"><CheckCircle2 className="size-5" /></span><div><h2 className="font-semibold text-[#284F34]">Interview complete</h2><p className="mt-0.5 text-sm text-[#52715A]">{isEvaluating ? 'Preparing your review...' : evaluationMessage || 'Your session has ended.'}</p></div></div><button type="button" onClick={() => navigate('/')} className="min-h-10 rounded-lg border border-[#BFD9C8] bg-white px-4 text-sm font-semibold text-[#284F34] hover:bg-[#F8FCF9]">Finish</button></Motion.section>}
      </main>
    </div>
  );
}
