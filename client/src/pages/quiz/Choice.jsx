import { CheckCircle2 } from 'lucide-react';
export default function Choice({ i, o, sel, lock, correct, setSel }) {
  const isSel = sel === i;
  let cls = 'bg-white border-[#E6E2E0] hover:border-[#4F4945]';
  if (lock && i === correct) cls = 'bg-[#F4F2F1] border-[#2E2C2A]';
  else if (lock && isSel) cls = 'bg-[#FEE2E2] border-[#E5A08A]';
  else if (isSel) cls = 'bg-[#2E2C2A] text-white border-[#2E2C2A]';
  return (
    <button disabled={lock} onClick={() => setSel(i)} className={`w-full text-left p-4 rounded-2xl border font-medium text-[14.5px] flex gap-3 items-start ${cls}`}>
      <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] font-bold shrink-0 bg-[#F4F2F1]">{String.fromCharCode(65 + i)}</span>
      <span className="flex-1">{typeof o === 'string' ? o : o.text}</span>
      {lock && i === correct && <CheckCircle2 className="w-5 h-5 text-[#2E2C2A] shrink-0" />}
    </button>
  );
}


