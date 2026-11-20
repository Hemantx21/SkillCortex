import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Globe, Code, Package, Shield, Rocket, Link, Github, LayoutDashboard } from 'lucide-react';
import { SectionHead, Pill } from '../components/ui';

const RESOURCES = [
  { id: 'vercel', name: 'Vercel', description: 'Frontend cloud for React frameworks. Free tier includes hobby projects with automatic SSL, global CDN, and preview deployments.', category: 'Hosting', tags: ['Frontend', 'React', 'Next.js', 'CI/CD'], freeTier: 'Hobby - Free', link: 'https://vercel.com', icon: <Rocket className="w-5 h-5" /> },
  { id: 'mongodb', name: 'MongoDB Atlas', description: 'Fully managed cloud database. Free shared cluster with 512 MB storage.', category: 'Database', tags: ['NoSQL', 'Database', 'Cloud'], freeTier: 'Shared - Free', link: 'https://mongodb.com/atlas', icon: <Package className="w-5 h-5" /> },
  { id: 'github', name: 'GitHub', description: 'Code hosting and collaboration. Free for public and private repositories.', category: 'Code Hosting', tags: ['Git', 'CI/CD', 'Collaboration'], freeTier: 'Free for individuals', link: 'https://github.com', icon: <Github className="w-5 h-5" /> },
  { id: 'netlify', name: 'Netlify', description: 'Web hosting and serverless functions. Free tier includes 100 GB bandwidth.', category: 'Hosting', tags: ['Frontend', 'Serverless', 'CI/CD'], freeTier: 'Starter - Free', link: 'https://netlify.com', icon: <Code className="w-5 h-5" /> },
  { id: 'gemini', name: 'Google Gemini API', description: 'Generative AI model access. Used by SkillCortex for AI interviews.', category: 'AI / ML', tags: ['LLM', 'Generative AI', 'API'], freeTier: 'Free tier (rate limited)', link: 'https://ai.google.dev', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'cloudflare', name: 'Cloudflare Pages', description: 'Frontend hosting with global edge network.', category: 'Hosting', tags: ['Frontend', 'Edge', 'CDN'], freeTier: 'Free', link: 'https://pages.cloudflare.com', icon: <Shield className="w-5 h-5" /> },
  { id: 'figma', name: 'Figma', description: 'Interface design and prototyping.', category: 'Design', tags: ['UI/UX', 'Prototyping', 'Design System'], freeTier: 'Starter - Free', link: 'https://figma.com', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'unsplash', name: 'Unsplash', description: 'High-resolution free stock photos.', category: 'Media', tags: ['Images', 'Photos', 'Stock'], freeTier: 'Free', link: 'https://unsplash.com', icon: <Globe className="w-5 h-5" /> },
  { id: 'lucide', name: 'Lucide React', description: 'Open-source icons. Used throughout SkillCortex.', category: 'Icons', tags: ['Icons', 'React'], freeTier: 'MIT License - Free', link: 'https://lucide.dev', icon: <Code className="w-5 h-5" /> },
  { id: 'framer', name: 'Framer Motion', description: 'Motion library for React. Used by SkillCortex for animations.', category: 'Animation', tags: ['Animation', 'React'], freeTier: 'MIT License - Free', link: 'https://www.framer.com/motion/', icon: <Rocket className="w-5 h-5" /> },
  { id: 'tailwind', name: 'Tailwind CSS', description: 'Utility-first CSS framework.', category: 'Styling', tags: ['CSS', 'Framework'], freeTier: 'MIT License - Free', link: 'https://tailwindcss.com', icon: <Code className="w-5 h-5" /> },
  { id: 'socketio', name: 'Socket.io', description: 'Real-time communication. Used by SkillCortex for interview signaling.', category: 'Real-time', tags: ['WebSocket', 'Real-time'], freeTier: 'MIT License - Free', link: 'https://socket.io', icon: <Link className="w-5 h-5" /> },
];

const CATEGORIES = ['All', ...new Set(RESOURCES.map((r) => r.category))];

export default function Resources() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = RESOURCES.filter(
    (r) => (category === 'All' || r.category === category) && r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#F4F2F1] min-h-screen">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-[1280px] mx-auto px-5 lg:px-8 py-12">
        <section className="mb-10">
          <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.4 }}>
            <div className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#2E2C2A] mb-2">Free Developer Resources</div>
            <h1 className="text-[36px] md:text-[44px] font-extrabold tracking-tight text-[#2E2C2A] leading-tight">Build your stack for free</h1>
            <p className="text-[#9E9894] text-[15px] mt-3 max-w-2xl leading-relaxed">
              A curated list of SaaS, PaaS, IaaS and other offerings with free developer tiers.
              Inspired by <a href="https://github.com/ripienaar/free-for-dev" className="text-[#2E2C2A] hover:underline" target="_blank" rel="noopener noreferrer">free-for-dev</a>.
            </p>
          </motion.div>
          <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }} className="mt-8 flex flex-wrap gap-3 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9894]" />
              <input type="text" placeholder="Search tools..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6E2E0] bg-white text-[#2E2C2A] focus:border-[#2E2C2A] focus:outline-none focus:ring-1 focus:ring-[#2E2C2A] text-[13px]" />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="pl-4 pr-10 py-2.5 rounded-xl border border-[#E6E2E0] bg-white text-[#2E2C2A] focus:border-[#2E2C2A] focus:outline-none focus:ring-1 focus:ring-[#2E2C2A] text-[13px] cursor-pointer">
              <option><Filter className="w-4 h-4 mr-2" /> All Categories</option>
              {CATEGORIES.slice(1).map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </motion.div>
        </section>
        <SectionHead eyebrow="Curated tools" title="Free tiers you can use today" sub="Pick the right tools for your interview prep, resume hosting, or recruitment stack." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((resource) => (
            <motion.div key={resource.id} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.4, delay: Math.random() * 0.2 }} className="group relative bg-white border border-[#E6E2E0] rounded-[20px] p-5 hover:border-[#2E2C2A]/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#F4F2F1] flex items-center justify-center text-[#2E2C2A] group-hover:bg-[#2E2C2A] group-hover:text-white transition-colors">{resource.icon}</div>
                <Pill tone="dark" className="text-[10px]">Free</Pill>
              </div>
              <h3 className="font-bold text-[#2E2C2A] text-[14px] mb-1 leading-tight group-hover:text-[#2E2C2A] transition-colors">{resource.name}</h3>
              <p className="text-[#9E9894] text-[12.5px] mb-3 leading-relaxed line-clamp-2">{resource.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {resource.tags.map((tag) => (<span key={tag} className="text-[10px] font-semibold bg-[#F4F2F1] text-[#9E9894] px-2 py-0.5 rounded-md">{tag}</span>))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#F4F2F1]">
                <span className="text-[11px] font-bold text-[#2E2C2A]">{resource.freeTier}</span>
                <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#2E2C2A] font-bold text-[12px] hover:underline">Visit <Link className="w-3 h-3" /></a>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
              <Globe className="w-16 h-16 text-[#E6E2E0] mb-4" />
              <h3 className="text-[#2E2C2A] font-bold text-[16px] mb-2">No resources found</h3>
              <p className="text-[#9E9894] text-[13px]">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
        <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.6 }} className="mt-12 pt-8 border-t border-[#F4F2F1] text-center text-[#9E9894] text-[13px]">
          <p>Curated for SkillCortex users. Inspired by <a href="https://github.com/ripienaar/free-for-dev" className="text-[#2E2C2A] hover:underline" target="_blank" rel="noopener noreferrer">free-for-dev</a> — 140k+ stars, 1600+ contributors.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}


