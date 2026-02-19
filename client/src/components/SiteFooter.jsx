import { CONTRACT_URL } from '../config/network';

const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-surface/40 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center justify-between text-[10px] uppercase tracking-widest font-bold text-secondary">
        <span>TextileTrace • Transparent Supply Chain</span>
        <div className="flex flex-wrap gap-4">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">GitHub</a>
          {CONTRACT_URL && (
            <a href={CONTRACT_URL} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">Smart Contract</a>
          )}
          <a href="/PROJECT_DOCUMENTATION.html" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">Docs</a>
          <a href="mailto:contact@textiletrace.com" className="hover:text-gold transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
