export const recruiterCandidates = [
  { id: 1, name: 'Ajahar Husain', initials: 'AH', role: 'Full Stack Developer', tech: 88, comm: 82, integrity: 96, status: 'Completed', rec: 'Recommended', summary: 'Strong React and Node.js knowledge with good project understanding.' },
  { id: 2, name: 'Sana Khan', initials: 'SK', role: 'Frontend Developer', tech: 81, comm: 88, integrity: 98, status: 'Completed', rec: 'Recommended', summary: 'Excellent communication, solid hooks and performance fundamentals.' },
  { id: 3, name: 'Rohit Verma', initials: 'RV', role: 'Backend Developer', tech: 76, comm: 69, integrity: 91, status: 'In Interview', rec: 'Borderline', summary: 'Good API design, needs depth on scaling and SQL optimisation.' },
  { id: 4, name: 'Ishita Rao', initials: 'IR', role: 'Full Stack Developer', tech: 68, comm: 74, integrity: 84, status: 'Scheduled', rec: 'On Hold', summary: 'Promising fundamentals, inconsistent depth under follow-ups.' },
  { id: 5, name: 'Kabir Singh', initials: 'KS', role: 'Java Developer', tech: 90, comm: 71, integrity: 93, status: 'Completed', rec: 'Strong Hire', summary: 'Deep Java and Spring knowledge, crisp problem solving.' },
];

export const transcripts = [
  { who: 'AI', text: 'Tell me about a challenging backend feature you shipped recently.' },
  { who: 'You', text: 'I built a rate-limited notification service in Node.js with BullMQ. The challenge was duplicate delivery during retries.' },
  { who: 'AI', text: 'Good. How did you guarantee idempotency across workers?' },
  { who: 'You', text: 'I used Redis-backed idempotency keys with TTL and a DB unique constraint as the final guard.' },
  { who: 'AI', text: 'Strong answer. How would this design change at 10x throughput?' },
];

export const resumeProfile = {
  skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
  projects: ['Realtime collaboration board', 'Notification service with BullMQ', 'E-commerce search with Postgres FTS'],
  experience: '2 years — Full Stack Developer',
  education: 'B.Tech, Computer Science',
  strengths: ['Frontend ownership', 'API design', 'Debugging under pressure'],
};
