import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HRTable from './HRTable';

const SEED = [
  { _id: 'j1', title: 'Frontend Developer', company: 'Acme', location: 'Remote', requirements: ['React', 'CSS'], description: 'Build UI.', status: 'open', hrRef: 'hr-1' },
  { _id: 'j2', title: 'Backend Developer', company: 'Acme', location: 'Bengaluru', requirements: ['Node.js'], description: 'Build APIs.', status: 'open', hrRef: 'hr-1' },
];

let db = [];
function installMock(log) {
  db = SEED.map((j) => ({ ...j, requirements: [...j.requirements] }));
  const orig = { get: axios.get, post: axios.post, patch: axios.patch, delete: axios.delete };
  axios.get = async (url) => {
    log('GET ' + url + ' -> ' + db.length + ' jobs');
    if (url === '/api/jobs') return { data: db.map((j) => ({ ...j })) };
    throw new Error('unexpected GET ' + url);
  };
  axios.post = async (url, body) => {
    const created = { ...body, _id: 'j' + Date.now(), status: 'open', hrRef: 'hr-1' };
    db = [created, ...db];
    log('POST ' + url + ' title=' + body.title);
    return { data: created };
  };
  axios.patch = async (url, body) => {
    const id = url.split('/')[3];
    db = db.map((j) => (j._id === id ? { ...j, status: body.status } : j));
    log('PATCH ' + url + ' status=' + body.status);
    return { data: { ok: true } };
  };
  axios.delete = async (url) => {
    const id = url.split('/').pop();
    db = db.filter((j) => j._id !== id);
    log('DELETE ' + url + ' -> ' + db.length + ' left');
    return { data: { ok: true } };
  };
  return () => { Object.assign(axios, orig); };
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitFor(fn, timeout = 4000) {
  const t0 = Date.now();
  for (;;) {
    try { const v = fn(); if (v) return v; } catch (e) { void e; }
    if (Date.now() - t0 > timeout) throw new Error('waitFor timeout');
    await wait(100);
  }
}

function qAll(root, sel) { return Array.from(root.querySelectorAll(sel)); }

export default function HRTableSmoke() {
  const hostRef = useRef(null);
  const [lines, setLines] = useState(['mock axios installed, mounting HRTable...']);
  const push = (s) => setLines((p) => [...p, s]);

  useEffect(() => {
    let dead = false;
    const restore = installMock((s) => { if (!dead) push(s); });
    (async () => {
      try {
        const root = hostRef.current;
        push('STEP 1: wait for seeded postings');
        await waitFor(() => qAll(root, 'h4').length >= 2 && true);
        push('PASS render: ' + qAll(root, 'h4').map((h) => h.textContent).join(' | '));

        push('STEP 2: post a new job via modal');
        const postBtn = await waitFor(() => qAll(root, 'button').find((b) => /Post new job/i.test(b.textContent)));
        postBtn.click();
        await waitFor(() => root.querySelector('input[name="title"]'));
        const native = (el, v) => {
          const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
          Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
          el.dispatchEvent(new Event('input', { bubbles: true }));
        };
        native(root.querySelector('[name="title"]'), 'Smoke QA Engineer');
        native(root.querySelector('[name="company"]'), 'Acme');
        native(root.querySelector('[name="description"]'), 'Smoke test posting.');
        await wait(150);
        qAll(root, 'button[type="submit"]').pop().click();
        await waitFor(() => root.textContent.includes('Job posted successfully'));
        push('PASS post: success banner shown');

        push('STEP 3: open View details');
        await wait(1300);
        const viewBtn = await waitFor(() => qAll(root, 'button').find((b) => b.textContent.trim() === 'View'));
        viewBtn.click();
        await waitFor(() => root.textContent.includes('View job details'));
        push('PASS view: details modal opened');
        const dlgClose = qAll(root, 'button').find((b) => b.textContent.trim() === 'Close' && b.closest('.fixed'));
        if (dlgClose) dlgClose.click();
        await wait(200);

        push('STEP 4: toggle Open/Close');
        const toggleBtn = await waitFor(() => qAll(root, 'button').find((b) => /^(Open|Close)$/.test(b.textContent.trim()) && !b.closest('.fixed')));
        const before = toggleBtn.textContent.trim();
        toggleBtn.click();
        await waitFor(() => {
          const cur = qAll(root, 'button').find((b) => /^(Open|Close)$/.test(b.textContent.trim()) && !b.closest('.fixed'));
          return cur && cur.textContent.trim() !== before;
        });
        push('PASS toggle: ' + before + ' flipped');

        push('STEP 5: delete via confirm modal');
        const delBtn = await waitFor(() => qAll(root, 'button').find((b) => /Delete$/.test(b.textContent.trim()) && !b.closest('.fixed')));
        const countBefore = qAll(root, 'h4').length;
        delBtn.click();
        await waitFor(() => root.textContent.includes('Delete this posting'));
        qAll(root, 'button').find((b) => b.textContent.includes('Delete posting')).click();
        await waitFor(() => qAll(root, 'h4').length === countBefore - 1);
        push('PASS delete: card removed');
        push('ALL SMOKE STEPS PASSED (no server used)');
      } catch (e) {
        push('FAIL: ' + (e?.message || String(e)));
      }
    })();
    return () => { dead = true; restore(); };
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F2F1] p-6">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-[20px] font-extrabold text-[#2E2C2A]">HRTable smoke (mocked axios, no server)</h1>
        <p className="text-[13px] text-[#9E9894] mb-3">Dev only. Exercises post / view / open-close / delete.</p>
        <div className="bg-[#2E2C2A] text-[#D5EAE0] rounded-[14px] p-4 text-[12.5px] font-mono whitespace-pre-wrap mb-4 max-h-[220px] overflow-auto">
          {lines.join('\n')}
        </div>
        <div ref={hostRef} className="border border-dashed border-[#4F4945] rounded-[16px] overflow-hidden">
          <HRTable user={{ id: 'hr-1' }} />
        </div>
      </div>
    </div>
  );
}


