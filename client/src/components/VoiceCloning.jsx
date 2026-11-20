import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Speaker, Bot, Play } from 'lucide-react';

/**
 * VoiceCloning - OmniVoice integration component
 * OmniVoice: https://github.com/k2-fsa/OmniVoice
 * High-quality voice cloning TTS for 600+ languages.
 */

const OMNIVOICE_BASE = import.meta.env.VITE_OMNIVOICE_API_URL || 'http://127.0.0.1:8000';

export default function VoiceCloning({
  text,
  voiceId = 'default',
  languageId = 'en',
  autoPlay = false,
  onPlaybackEnd,
  onError,
  className = '',
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);
  const synthesisRef = useRef(null);
  const utteranceRef = useRef(null);
  const audioRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    setIsSupported(!!(window.speechSynthesis || window.AudioContext));
  }, []);

  useEffect(() => {
    if (autoPlay && text && isSupported) {
      speak(text);
    }
    return () => {
      stop();
    };
  }, [autoPlay, text, isSupported]);

  useEffect(() => {
    return () => {
      if (synthesisRef.current) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const speak = useCallback(async (txt) => {
    if (!txt) return;
    setError(null);
    setIsPlaying(true);
    try {
      const res = await fetch(`${OMNIVOICE_BASE}/v1/invoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speaker: voiceId,
          text: txt,
          format: 'wav',
          language_id: languageId,
          topP: 0.7,
          max_new_tokens: 1024,
          chunk_length: 100,
          repetition_penalty: 1.2,
          temperature: 0.7,
          need_asr: false,
          streaming: false,
          is_fixed_seed: 0,
          is_norm: 0,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const audioUrl = data.audio_url;
        if (audioUrl) {
          playAudioUrl(audioUrl);
          return;
        }
      }
      speakBrowser(txt);
    } catch (err) {
      console.warn('OmniVoice API unavailable, falling back to browser TTS', err);
      speakBrowser(txt);
    }
  }, [voiceId, languageId]);

  const speakBrowser = (txt) => {
    if (!window.speechSynthesis) {
      setError('Browser speech synthesis not available');
      setIsPlaying(false);
      onError?.('Browser speech synthesis not available');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(txt);
    utterance.lang = languageId;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang.startsWith(languageId) || v.lang === languageId);
    if (matchingVoice) utterance.voice = matchingVoice;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      onPlaybackEnd?.();
    };
    utterance.onerror = (event) => {
      console.error('Speech synthesis error', event);
      setError('Speech synthesis error');
      setIsPlaying(false);
      onError?.(event.error);
    };
    utteranceRef.current = utterance;
    synthesisRef.current = window.speechSynthesis;
    window.speechSynthesis.speak(utterance);
  };

  const playAudioUrl = (url) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        onPlaybackEnd?.();
      };
      audioRef.current.onerror = () => {
        setError('Audio playback failed');
        setIsPlaying(false);
        onError?.('Audio playback failed');
      };
    } else {
      audioRef.current.src = url;
    }
    audioRef.current.play().catch((err) => {
      console.error('Audio play failed', err);
      speakBrowser(text);
    });
    setIsPlaying(true);
  };

  const stop = useCallback(() => {
    setIsPlaying(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const waveformBars = Array.from({ length: 12 });

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {isPlaying && (
        <div className="flex items-end gap-1 h-[20px]">
          {waveformBars.map((_, i) => (
            <div
              key={i}
              className="w-1.5 bg-[#2E2C2A] rounded-full transition-all duration-[100ms]"
              style={{
                height: `${4 + Math.random() * 16}px`,
                opacity: 0.4 + Math.random() * 0.6,
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => {
          if (isPlaying) stop();
          else if (text) speak(text);
        }}
        disabled={!isSupported || !text}
        className={`p-2.5 rounded-full transition-all ${isPlaying ? 'bg-[#EF4444] text-white' : 'bg-[#F4F2F1] text-[#2E2C2A] hover:bg-[#F4F2F1]'}`}
        title={isPlaying ? 'Stop' : 'Play'}
      >
        {isPlaying ? (
          <MicOff className="w-4 h-4" />
        ) : isSupported ? (
          <Play className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </button>

      {!isSupported && (
        <span className="text-[11px] text-[#EF4444] font-medium">TTS not supported</span>
      )}

      {error && (
        <span className="text-[11px] text-[#EF4444] font-medium">{error}</span>
      )}
    </div>
  );
}

