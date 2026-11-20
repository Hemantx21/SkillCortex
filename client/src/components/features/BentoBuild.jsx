import { motion } from 'framer-motion';

export function BentoBuild({ items, className = '' }) {
  return (
    <section className={`relative max-w-[1280px] mx-auto px-5 lg:px-8 py-16 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => {
          const spanCols = item.cols || 1;
          const spanRows = item.rows || 1;
          return (
            <motion.div
              key={item.id || item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`group relative col-span-${spanCols} row-span-${spanRows} rounded-[20px] bg-white border border-[#E6E2E0] p-6 sm:p-8 shadow-sm hover:shadow-[0_12px_40px_-8px_rgba(99,102,241,0.35)] hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
            >
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full bg-indigo-400/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {item.badge && (
                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm">
                  {item.badge}
                </span>
              )}
              {item.icon && <div className="w-10 h-10 rounded-xl bg-[#F4F2F1] text-[#2E2C2A] flex items-center justify-center mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-300">{item.icon}</div>}
              <h3 className="text-[16px] font-bold text-[#2E2C2A] mb-2">{item.title}</h3>
              <p className="text-[13px] text-[#9E9894] leading-relaxed">{item.desc}</p>
              {item.action && (
                <a
                  href={item.action.href || '#'}
                  className="mt-5 inline-flex items-center gap-1 text-[12px] font-bold text-[#2E2C2A] uppercase tracking-wider"
                >
                  {item.action.label} -&gt;
                </a>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

