
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Sparkles, Image as ImageIcon, MessageSquare, 
  ArrowLeft, Copy, RotateCcw, Check, Menu, X, Info, Search,
  Zap, Compass, Target, Layers, Eye, Repeat, Trophy, Shield
} from 'lucide-react';
import { AppView, AIModel, PromptState, Template, Example } from './types';
import { AI_OPTIONS, TEXT_CATEGORIES, IMAGE_TYPES, COURSE_MODULES, TEMPLATES, EXAMPLES } from './constants';

const mobileTransition = { type: "spring" as const, damping: 30, stiffness: 250 };

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [view, setView] = useState<AppView>('hero');
  const [selectedAI, setSelectedAI] = useState<AIModel | null>(null);
  const [promptState, setPromptState] = useState<PromptState | null>(null);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.className = theme;
    const setHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleStartFlow = (type: 'text' | 'image') => {
    setPromptState({ type, selectedAI: 'ChatGPT', category: '', details: {}, generatedPrompt: '' });
    setView('ai-select');
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAI = (ai: AIModel) => {
    setSelectedAI(ai);
    if (promptState) {
      setPromptState({ ...promptState, selectedAI: ai });
      setView(promptState.type === 'text' ? 'text-module' : 'image-module');
    }
    window.scrollTo({ top: 0 });
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-[100dvh] flex flex-col transition-colors duration-500 overflow-x-hidden ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] rounded-full blur-[120px] opacity-[0.1] bg-cyan-500 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[80vw] h-[80vw] rounded-full blur-[120px] opacity-[0.1] bg-purple-500 transform -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a]/80' : 'bg-white/80'} backdrop-blur-md border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/5'} pt-[env(safe-area-inset-top)]`}>
        <div className="max-w-7xl mx-auto px-5 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setView('hero'); setIsMenuOpen(false); }}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-premium rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={18} />
            </div>
            <span className={`text-lg font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              Studio <span className="text-gradient">AI</span>
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={() => setView('templates')} className="text-sm font-bold opacity-60 hover:opacity-100 transition-all">Templates</button>
            <button onClick={() => setView('examples')} className="text-sm font-bold opacity-60 hover:opacity-100 transition-all">Exemplos</button>
            <button onClick={() => setView('course')} className="text-sm font-bold opacity-60 hover:opacity-100 transition-all">Curso</button>
            <button onClick={toggleTheme} className="p-2.5 rounded-xl border-2 transition-all">
              {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
            </button>
          </nav>

          <div className="flex lg:hidden items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg border bg-white/5 border-white/10">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 active:scale-90 transition-transform">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden border-b overflow-hidden absolute w-full left-0 z-[90] ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10 shadow-2xl' : 'bg-white border-black/5 shadow-lg'}`}
            >
              <div className="p-6 flex flex-col gap-4 font-bold text-lg">
                <button onClick={() => { setView('templates'); setIsMenuOpen(false); }} className="text-left py-2">Templates</button>
                <button onClick={() => { setView('examples'); setIsMenuOpen(false); }} className="text-left py-2">Exemplos</button>
                <button onClick={() => { setView('course'); setIsMenuOpen(false); }} className="text-left py-2">Curso IA</button>
                <hr className="opacity-10" />
                <button onClick={() => handleStartFlow('text')} className="w-full py-4 rounded-xl bg-gradient-premium text-white">Criar Texto</button>
                <button onClick={() => handleStartFlow('image')} className="w-full py-4 rounded-xl border-2 border-cyan-500 text-cyan-500">Criar Imagem</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow pt-24 md:pt-32 pb-12 relative z-10 w-full flex flex-col items-center ios-safe-bottom">
        <AnimatePresence mode="wait">
          {view === 'hero' && <HeroView key="hero" onStart={handleStartFlow} />}
          {view === 'ai-select' && <AISelectView key="ai" onSelect={handleSelectAI} onBack={() => setView('hero')} theme={theme} />}
          {view === 'text-module' && <TextModuleView key="text" selectedAI={selectedAI!} onComplete={(p) => { setPromptState({...promptState!, generatedPrompt: p}); setView('result'); }} onBack={() => setView('ai-select')} theme={theme} />}
          {view === 'image-module' && <ImageModuleView key="image" selectedAI={selectedAI!} onComplete={(p) => { setPromptState({...promptState!, generatedPrompt: p}); setView('result'); }} onBack={() => setView('ai-select')} theme={theme} />}
          {view === 'result' && <ResultView key="res" promptState={promptState!} onCopy={copyToClipboard} copied={copied} onRestart={() => setView('hero')} theme={theme} />}
          {view === 'course' && <CourseView key="cour" onBack={() => setView('hero')} theme={theme} />}
          {view === 'templates' && <TemplatesView key="temp" onCopy={copyToClipboard} copied={copied} onBack={() => setView('hero')} theme={theme} />}
          {view === 'examples' && <ExamplesView key="ex" onBack={() => setView('hero')} theme={theme} />}
        </AnimatePresence>
      </main>
    </div>
  );
};

// --- Subcomponents Otimizados ---

const HeroView: React.FC<{ onStart: (t: 'text' | 'image') => void }> = ({ onStart }) => (
  <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={mobileTransition} className="max-w-6xl w-full px-6 text-center py-8">
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
      <Sparkles size={12} /> Studio Profissional
    </div>
    <h1 className="text-4xl md:text-8xl font-black mb-6 tracking-tighter leading-[1.1]">
      Ideias em <br /><span className="text-gradient">Prompts Reais</span>
    </h1>
    <p className="text-sm md:text-xl mb-12 max-w-xl mx-auto opacity-60 leading-relaxed font-medium">
      Engenharia de prompts de alto nível para 2026.
    </p>
    <div className="flex flex-col md:flex-row gap-4 justify-center px-4">
      <button onClick={() => onStart('text')} className="w-full md:w-auto px-10 py-5 rounded-2xl bg-gradient-premium text-white font-black text-lg active:scale-95 transition-transform shadow-xl">Criar Texto</button>
      <button onClick={() => onStart('image')} className="w-full md:w-auto px-10 py-5 rounded-2xl border-2 border-white/10 bg-white/5 font-black text-lg active:scale-95 transition-transform">Criar Imagem</button>
    </div>
  </motion.section>
);

const AISelectView: React.FC<{ onSelect: (ai: AIModel) => void, onBack: () => void, theme: string }> = ({ onSelect, onBack, theme }) => (
  <motion.section initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={mobileTransition} className="w-full max-w-4xl px-6">
    <button onClick={onBack} className="flex items-center gap-2 mb-8 opacity-40 font-bold uppercase text-[10px] tracking-widest"><ArrowLeft size={16}/> Voltar</button>
    <h2 className="text-3xl font-black mb-8">Qual IA você usará?</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {AI_OPTIONS.map(ai => (
        <button key={ai.name} onClick={() => onSelect(ai.name as AIModel)} className={`p-5 rounded-[2rem] border-2 text-left transition-all active:scale-95 flex flex-col gap-4 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
          <div className={`w-12 h-12 rounded-2xl ${ai.color} flex items-center justify-center text-2xl shadow-lg`}>{ai.icon}</div>
          <span className="text-sm font-bold">{ai.name}</span>
        </button>
      ))}
    </div>
  </motion.section>
);

const TextModuleView: React.FC<{ selectedAI: AIModel, onComplete: (p: string) => void, onBack: () => void, theme: string }> = ({ selectedAI, onComplete, onBack, theme }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ category: '', objective: '', audience: '', tone: 'Profissional', detail: 'Equilibrado' });

  const finish = () => {
    let b = `Atue como um [${data.category.toUpperCase()}] sênior. Objetivo: ${data.objective}. `;
    if (data.category.includes('Emails')) b += `Foque em linha de assunto chamativa e CTA clara. `;
    b += `Público: ${data.audience}. Tom: ${data.tone}. Tamanho: ${data.detail}. Otimizado para ${selectedAI}.`;
    onComplete(b);
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={mobileTransition} className="w-full max-w-2xl px-6">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 opacity-40"><ArrowLeft /></button>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(s => <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${step >= s ? 'w-8 bg-cyan-500' : 'w-3 bg-white/10'}`} />)}
        </div>
      </div>
      <div className="min-h-[300px]">
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEXT_CATEGORIES.map(c => (
              <button key={c.id} onClick={() => { setData({...data, category: c.name}); setStep(2); }} className={`p-4 rounded-2xl border-2 text-left flex items-center gap-4 active:scale-95 transition-transform ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                <div className="p-3 bg-gradient-premium rounded-xl text-white"><MessageSquare size={18}/></div>
                <span className="font-bold text-xs">{c.name}</span>
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-black italic">Qual o seu objetivo?</h3>
            <textarea autoFocus className="w-full h-40 p-6 rounded-2xl border-2 bg-transparent border-white/10 outline-none focus:border-cyan-500 text-lg resize-none" placeholder="Ex: Um e-mail para vender curso..." onChange={(e) => setData({...data, objective: e.target.value})} />
            <button onClick={() => setStep(3)} disabled={!data.objective} className="py-4 rounded-xl bg-gradient-premium font-black disabled:opacity-30">Continuar</button>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-black italic">Para quem é o texto?</h3>
            <input autoFocus className="w-full p-6 rounded-2xl border-2 bg-transparent border-white/10 outline-none focus:border-cyan-500 text-lg" placeholder="Ex: Meus clientes VIP..." onChange={(e) => setData({...data, audience: e.target.value})} />
            <button onClick={() => setStep(4)} disabled={!data.audience} className="py-4 rounded-xl bg-gradient-premium font-black">Próximo</button>
          </div>
        )}
        {step === 4 && (
          <div className="grid grid-cols-2 gap-3">
            {['Sério', 'Divertido', 'Persuasivo', 'Técnico'].map(t => (
              <button key={t} onClick={() => { setData({...data, tone: t}); setStep(5); }} className="p-5 rounded-xl border-2 border-white/10 bg-white/5 font-bold">{t}</button>
            ))}
          </div>
        )}
        {step === 5 && (
          <div className="grid grid-cols-1 gap-3">
            {['Curto', 'Equilibrado', 'Detalhado'].map(d => (
              <button key={d} onClick={() => { setData({...data, detail: d}); finish(); }} className="p-6 rounded-xl border-2 border-white/10 bg-white/5 font-bold text-left">{d}</button>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

const ImageModuleView: React.FC<{ selectedAI: AIModel, onComplete: (p: string) => void, onBack: () => void, theme: string }> = ({ selectedAI, onComplete, onBack, theme }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ subject: '', style: 'Fotorealista' });

  const complete = () => {
    let p = `${data.style} image of ${data.subject}, 8k resolution, highly detailed, professional photography style. `;
    if (selectedAI === 'Midjourney') p += ` --v 6.0`;
    onComplete(p);
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl px-6">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={onBack} className="p-2 opacity-40"><ArrowLeft /></button>
        <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Image Maker</span>
      </div>
      {step === 1 && (
        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-black italic">O que deseja ver?</h3>
          <textarea autoFocus className="w-full h-40 p-6 rounded-2xl border-2 bg-transparent border-white/10 outline-none focus:border-cyan-500 text-lg resize-none" placeholder="Ex: Um astronauta em Marte..." onChange={(e) => setData({...data, subject: e.target.value})} />
          <button onClick={() => setStep(2)} disabled={!data.subject} className="py-4 rounded-xl bg-gradient-premium font-black">Próximo</button>
        </div>
      )}
      {step === 2 && (
        <div className="grid grid-cols-2 gap-3">
          {['Fotorealista', 'Cinematográfico', 'Cyberpunk', 'Arte Digital', 'Vaporwave', 'Pintura'].map(s => (
            <button key={s} onClick={() => { setData({...data, style: s}); complete(); }} className="p-5 rounded-xl border-2 border-white/10 bg-white/5 font-bold">{s}</button>
          ))}
        </div>
      )}
    </motion.section>
  );
};

const ResultView: React.FC<{ promptState: PromptState, onCopy: (p: string) => void, copied: boolean, onRestart: () => void, theme: string }> = ({ promptState, onCopy, copied, onRestart, theme }) => (
  <motion.section initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl px-6">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-black">Prompt Master ✨</h2>
    </div>
    <div className={`p-8 rounded-[2.5rem] border shadow-2xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
      <div className={`p-6 rounded-2xl border-2 font-medium text-lg italic mb-10 ${theme === 'dark' ? 'bg-black/30 border-white/5 text-zinc-300' : 'bg-zinc-50 border-black/5'}`}>
        "{promptState.generatedPrompt}"
      </div>
      <div className="flex flex-col gap-4">
        <button onClick={() => onCopy(promptState.generatedPrompt)} className={`py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-colors ${copied ? 'bg-emerald-500' : 'bg-gradient-premium'}`}>
          {copied ? <Check size={24} /> : <Copy size={24} />}
          {copied ? 'Copiado!' : 'Copiar Prompt Master'}
        </button>
        <button onClick={onRestart} className="py-5 rounded-2xl border-2 border-white/10 font-black text-lg flex items-center justify-center gap-2">
          <RotateCcw size={20} /> Recomeçar
        </button>
      </div>
    </div>
  </motion.section>
);

const TemplatesView: React.FC<{ onCopy: (p: string) => void, copied: boolean, onBack: () => void, theme: string }> = ({ onCopy, copied, onBack, theme }) => {
  const [filter, setFilter] = useState<'all' | 'text' | 'image'>('all');
  const [search, setSearch] = useState('');
  
  const filtered = useMemo(() => {
    return TEMPLATES.filter(t => {
      const matchType = filter === 'all' || t.type === filter;
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.preview.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [filter, search]);

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-7xl px-6">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <button onClick={onBack} className="flex items-center gap-2 opacity-40 uppercase text-[10px] font-black"><ArrowLeft size={14} /> Home</button>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
            <input 
              type="text" placeholder="Buscar 100 templates..." 
              className={`w-full md:w-64 pl-12 pr-4 py-3 rounded-2xl border-2 bg-transparent outline-none focus:border-cyan-500 transition-all ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}`}
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={`p-1 rounded-xl flex border-2 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-zinc-100 border-black/5'}`}>
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${filter === 'all' ? 'bg-cyan-500 text-white' : 'opacity-40'}`}>Tudo</button>
            <button onClick={() => setFilter('text')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${filter === 'text' ? 'bg-cyan-500 text-white' : 'opacity-40'}`}>Texto</button>
            <button onClick={() => setFilter('image')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${filter === 'image' ? 'bg-cyan-500 text-white' : 'opacity-40'}`}>Imagem</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map(t => (
            <motion.div 
              key={t.id} layout initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 rounded-3xl border-2 flex flex-col justify-between gap-6 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}
            >
              <div>
                <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center text-white ${t.type === 'text' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                  {t.type === 'text' ? <MessageSquare size={18} /> : <ImageIcon size={18} />}
                </div>
                <h4 className="font-black text-lg mb-1 leading-tight">{t.title}</h4>
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{t.preview}</p>
              </div>
              <button onClick={() => onCopy(t.prompt)} className="w-full py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase active:bg-cyan-500 transition-colors">Copiar</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {filtered.length === 0 && (
        <div className="py-20 text-center opacity-40 font-bold italic">Nenhum template encontrado para "{search}"</div>
      )}
    </motion.section>
  );
};

// Re-using simplified Course and Examples views from previous optimized version
const CourseView: React.FC<{ onBack: () => void, theme: string }> = ({ onBack, theme }) => {
  const [active, setActive] = useState(1);
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl px-6">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 opacity-40 font-bold uppercase text-[10px] tracking-widest"><ArrowLeft size={14} /> Voltar</button>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {COURSE_MODULES.map(m => (
            <button key={m.id} onClick={() => setActive(m.id)} className={`p-5 rounded-2xl text-left border-2 flex items-center gap-4 shrink-0 min-w-[200px] lg:min-w-0 transition-all ${active === m.id ? 'border-cyan-500 bg-cyan-500/5' : 'border-transparent opacity-40'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active === m.id ? 'bg-cyan-500 text-white' : 'bg-white/10'}`}>{m.icon}</div>
              <div><div className="text-[9px] font-black uppercase text-cyan-500">Módulo 0{m.id}</div><div className="font-bold text-xs">{m.title}</div></div>
            </button>
          ))}
        </div>
        <div className={`lg:w-2/3 p-8 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-xl'}`}>
          <h3 className="text-2xl font-black mb-6">{COURSE_MODULES.find(m => m.id === active)?.title}</h3>
          <div className="space-y-6">
            {COURSE_MODULES.find(m => m.id === active)?.content.map((c, i) => (
              <div key={i} className="flex gap-4 font-medium opacity-80 leading-relaxed"><div className="mt-2 w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />{c}</div>
            ))}
          </div>
          <button onClick={() => active < COURSE_MODULES.length ? setActive(active + 1) : onBack()} className="mt-12 w-full py-4 rounded-xl bg-white text-black font-black uppercase text-xs active:scale-95 transition-transform shadow-lg">Continuar</button>
        </div>
      </div>
    </motion.section>
  );
};

const ExamplesView: React.FC<{ onBack: () => void, theme: string }> = ({ onBack, theme }) => (
  <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl px-6">
    <button onClick={onBack} className="mb-8 flex items-center gap-2 opacity-40 font-black uppercase text-[10px] tracking-widest"><ArrowLeft size={14}/> Voltar</button>
    <div className="space-y-12">
      {EXAMPLES.map((ex, i) => (
        <div key={ex.id} className={`p-8 rounded-[3rem] border shadow-xl relative ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-black/5'}`}>
          <h4 className="text-xl font-black mb-8 flex items-center gap-3"><div className="w-2 h-8 bg-gradient-premium rounded-full" /> {ex.title}</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3 opacity-40">
              <span className="text-[10px] font-black uppercase text-rose-500">Comum</span>
              <div className="p-5 rounded-2xl border border-white/5 italic text-sm">"{ex.before}"</div>
            </div>
            <div className="space-y-3 relative">
              <span className="text-[10px] font-black uppercase text-cyan-500">Studio Master</span>
              <div className="p-5 rounded-2xl border-2 border-cyan-500/30 font-bold text-sm bg-cyan-500/5 italic">"{ex.after}"</div>
              <div className="absolute -top-6 -right-4 px-4 py-2 bg-gradient-premium rounded-xl text-[8px] font-black text-white shadow-xl">{ex.improvement}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

export default App;
