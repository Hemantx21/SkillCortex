import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Video, Mic, MicOff, RefreshCw, User, Bot } from 'lucide-react';

/**
 * AIAvatar - HeyGem.ai integration component
 * HeyGem.ai: https://github.com/suifeng9203/HeyGem.ai
 * Open-source alternative to HeyGen for AI avatar/video generation.
 */

const HEYGEM_BASE = import.meta.env.VITE_HEYGEM_API_URL || 'http://127.0.0.1:8383';

export default function AIAvatar({
  className = '',
  isSpeaking = false,
  avatarUrl,
  voiceId,
  onError,
}) {
  const [status, setStatus] = useState('idle');
  const [videoUrl, setVideoUrl] = useState(avatarUrl);
  const waveformRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (avatarUrl) setVideoUrl(avatarUrl);
  }, [avatarUrl]);

  useEffect(() => {
    if (!isSpeaking) return;
    const bars = 20;
    const container = waveformRef.current;
    if (!container) return;
    let frame;
    const animate = () => {
      for (let i = 0; i < bars; i++) {
        const bar = container.children[i];
        if (bar) {
          const h = 4 + Math.random() * 26;
          bar.style.height = `${h}px`;
          bar.style.opacity = 0.4 + Math.random() * 0.6;
        }
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [isSpeaking]);

  const handleGenerateVideo = async () => {
    try {
      setStatus('speaking');
    } catch (err) {
      console.error('HeyGem video synthesis failed', err);
      setStatus('error');
      onError?.(err);
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="absolute inset-0 rounded-full bg-[#F4F2F1]/40 blur-3xl animate-pulse" />

      <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border border-[#E6E2E0] bg-[#F4F2F1] shadow-soft">
        {videoUrl ? (
          <motion.img
            src={videoUrl}
            alt="AI Interviewer"
            className="w-full h-full object-cover"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center bg-[#4F4945]/5">
              <Bot className="w-16 h-16 text-[#2E2C2A]" />
            </div>
            <div
              ref={waveformRef}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-1 h-[40px]"
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-[#2E2C2A] rounded-full transition-all duration-100"
                  style={{
                    height: isSpeaking ? `${6 + Math.random() * 20}px` : '4px',
                    opacity: isSpeaking ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
          </>
        )}
        {isSpeaking && (
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-[10px] animate-pulse">
            <Mic className="w-4 h-4" />
          </div>
        )}
        {status === 'listening' && (
          <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full bg-[#2E2C2A] text-white flex items-center justify-center text-[10px] animate-pulse">
            <Mic className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 text-[11px] font-semibold tracking-wide uppercase">
        {status === 'speaking' ? 'AJ is speaking' : status === 'listening' ? 'Listening...' : 'Ready'}
      </div>

      {!avatarUrl && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleGenerateVideo}
            className="px-3 py-1.5 bg-[#2E2C2A] text-white text-[11px] font-bold rounded-full hover:bg-[#2E2C2A] transition-colors"
            disabled={status === 'error'}
          >
            {status === 'error' ? 'Error' : 'Generate Avatar'}
          </button>
          <button className="px-3 py-1.5 bg-[#E6E2E0] text-[#2E2C2A] font-bold text-[11px] rounded-full hover:bg-[#F4F2F1] transition-colors">
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-2 text-[11px] text-[#EF4444] font-medium">
          HeyGem server unavailable â€” using fallback avatar
        </div>
      )}
    </div>
  );
}

