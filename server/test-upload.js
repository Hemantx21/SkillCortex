import express from 'express';
import uploadRoutes from './routes/upload.js';

const app = express();
app.use('/api/upload', uploadRoutes);

// Minimal but real PDF with extractable text
const minimalPdf = (text) => {
  const content = `BT /F1 18 Tf 72 720 Td (${text}) Tj ET`;
  const stream = Buffer.from(content, 'binary');
  const objs = [
    '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj',
    '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj',
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R>>endobj',
    `4 0 obj<</Length ${stream.length}>>stream\n${content}\nendstream\nendobj`,
    'trailer<</Root 1 0 R>>',
  ];
  return Buffer.from(`%PDF-1.4\n${objs.join('\n')}\n%%EOF`, 'binary');
};

const server = app.listen(0, async () => {
  const port = server.address().port;
  const base = `http://localhost:${port}/api/upload/resume`;
  let ok = 0, fail = 0;

  try {
    // 1) PDF
    let fd = new FormData();
    fd.append('resume', new Blob([minimalPdf('Hello SkillCortex resume PDF')], { type: 'application/pdf' }), 'resume.pdf');
    let r = await fetch(base, { method: 'POST', body: fd });
    let j = await r.json();
    console.log('PDF       ->', r.status, '| text:', JSON.stringify((j.text || '').slice(0, 44)));
    r.status === 200 && j.text.includes('SkillCortex') ? ok++ : fail++;

    // 2) TXT
    fd = new FormData();
    fd.append('resume', new Blob(['Name: Ajahar Husain\nSkills: React, Node.js'], { type: 'text/plain' }), 'resume.txt');
    r = await fetch(base, { method: 'POST', body: fd });
    j = await r.json();
    console.log('TXT       ->', r.status, '| text:', JSON.stringify((j.text || '').slice(0, 44)));
    r.status === 200 && j.text.includes('Ajahar') ? ok++ : fail++;

    // 3) Unsupported format
    fd = new FormData();
    fd.append('resume', new Blob(['nope'], { type: 'application/octet-stream' }), 'resume.exe');
    r = await fetch(base, { method: 'POST', body: fd });
    j = await r.json();
    console.log('EXE(reject)->', r.status, '| msg:', j.message);
    r.status === 400 ? ok++ : fail++;

    console.log(`\nRESULT: ${ok} passed, ${fail} failed`);
  } catch (err) {
    console.error('TEST ERROR:', err.message);
  } finally {
    server.close();
    process.exit(fail ? 1 : 0);
  }
});