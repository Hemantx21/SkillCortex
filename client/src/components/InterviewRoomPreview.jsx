import { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Sparkles, Radio, BarChart3, Volume2 } from 'lucide-react';
const BARS = [0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.35, 0.75, 0.55, 0.95, 0.45];



export default function InterviewRoomPreview() {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [barHeights, setBarHeights] = useState(BARS);

  useEffect(() => {
    const id = setInterval(() => {
      setBarHeights((h) => h.map(() => 0.3 + Math.random() * 0.7));
    }, 220);
    return () => clearInterval(id);
  }, []);

  const transcript = [
    { role: 'ai', text: "Tell me about a time you optimized a slow API endpoint." },
    { role: 'you', text: "I profiled the query, added an index, and cached hot reads in Redis — latency dropped 60%." },
    { role: 'ai', text: "Nice. How would you validate that improvement in production?" },
  ];

  return (
    <div className="relative w-full max-w-[560px] ml-4 lg:ml-12">
      {/* floating accent blobs */}
      <div className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-indigo-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 w-40 h-40 rounded-full bg-purple-400/20 blur-3xl" />

      <div className="relative bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_30px_80px_-20px_rgba(99,102,241,0.35)] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E6E2E0]/60 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 to-purple-50/80">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-[12.5px] font-bold text-[#2E2C2A]">Live interview room</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10.5px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Radio className="w-3 h-3" /> LIVE
            </span>
            <span className="text-[10.5px] font-semibold text-[#9E9894]">03:42</span>
          </div>
        </div>

      {/* Body */}
      <div className="p-5 grid grid-cols-[96px_1fr] gap-4">
        {/* Avatar + score */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-8 h-8" />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <span className="text-[11px] font-bold text-[#2E2C2A]">AJ Assistant</span>
          <span className="text-[10px] text-green-600 font-semibold">Speaking…</span>
          <div className="mt-1 w-14 h-14 relative">
            <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#E6E2E0" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="94" strokeDashoffset="28" strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-[#2E2C2A]">82</span>
          </div>
          <span className="text-[9.5px] text-[#9E9894] font-semibold">Score</span>
        </div>

        {/* Transcript + waveform */}
        <div className="flex flex-col gap-3">
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {transcript.map((t, i) => (
              <div key={i} className={`text-[12.5px] leading-relaxed ${t.role === 'ai' ? 'text-[#2E2C2A]' : 'text-[#4F4945] italic'}`}>
                <span className={`font-bold mr-1 ${t.role === 'ai' ? 'text-indigo-600' : 'text-[#2E2C2A]'}`}>
                  {t.role === 'ai' ? 'AJ:' : 'You:'}
                </span>
                {t.text}
              </div>
            ))}
          </div>
          {/* Waveform */}
          <div className="flex items-end gap-1 h-8 px-1">
            {barHeights.map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-full bg-gradient-to-t from-indigo-500 to-purple-400 transition-all duration-200"
                style={{ height: `${h * 100}%` }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 text-[10.5px] text-[#9E9894]">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Confidence: High · Pace: Good</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 py-3 border-t border-[#E6E2E0]/60 flex items-center justify-center gap-2.5 bg-white/60">
        <button onClick={() => setMicOn((v) => !v)} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${micOn ? 'bg-white border-[#E6E2E0] text-[#2E2C2A] hover:border-indigo-300' : 'bg-red-50 border-red-200 text-red-600'}`}>
          {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>
        <button onClick={() => setCamOn((v) => !v)} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${camOn ? 'bg-white border-[#E6E2E0] text-[#2E2C2A] hover:border-indigo-300' : 'bg-red-50 border-red-200 text-red-600'}`}>
          {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center border border-[#E6E2E0] bg-white text-[#2E2C2A] hover:border-indigo-300 transition-all">
          <Volume2 className="w-4 h-4" />
        </button>
        <button className="px-4 h-10 rounded-full bg-red-500 text-white text-[12px] font-bold flex items-center gap-1.5 shadow-md hover:bg-red-600 transition-colors">
          <PhoneOff className="w-3.5 h-3.5" /> End
        </button>
      </div>
      </div>

    </div>
  );
}