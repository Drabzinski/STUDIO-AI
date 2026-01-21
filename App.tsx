
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Sparkles, Image as ImageIcon, MessageSquare, 
  ChevronRight, ArrowLeft, Copy, RotateCcw, Check, Plus, 
  Zap, Eye, Smartphone, Menu, X, Star, Lightbulb, Info
} from 'lucide-react';
import { AppView, AIModel, PromptState, Template, Example } from './types';
import { AI_OPTIONS, TEXT_CATEGORIES, IMAGE_TYPES, COURSE_MODULES, TEMPLATES, EXAMPLES } from './constants';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [view, setView] = useState<AppView>('hero');
  const [selectedAI, setSelectedAI] = useState<AIModel | null>(null);
  const [promptState, setPromptState] = useState<PromptState | null>(null);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.className = theme;
    // Fix Safari height issues
    const setHeight = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
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
  };

  const handleSelectAI = (ai: AIModel) => {
    setSelectedAI(ai);
    if (promptState) {
      setPromptState({ ...promptState, selectedAI: ai });
      setView(promptState.type === 'text' ? 'text-module' : 'image-module');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderHeader = () => (
    <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a]/90' : 'bg-white/90'} backdrop-blur-xl border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/5'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => setView('hero')}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-premium rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="text-white" size={18} />
          </div>
          <span className={`text-lg md:text-xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Studio <span className="text-gradient">AI</span>
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          <button onClick={() => setView('templates')} className={`text-sm font-bold transition-all ${view === 'templates' ? 'text-cyan-500' : 'opacity-60 hover:opacity-100'}`}>Templates</button>
          <button onClick={() => setView('examples')} className={`text-sm font-bold transition-all ${view === 'examples' ? 'text-cyan-500' : 'opacity-60 hover:opacity-100'}`}>Exemplos</button>
          <button onClick={() => setView('course')} className={`text-sm font-bold transition-all ${view === 'course' ? 'text-cyan-500' : 'opacity-60 hover:opacity-100'}`}>Curso</button>
          <button onClick={toggleTheme} className={`p-2.5 rounded-xl border-2 transition-all active:scale-95 ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-black/5 text-black'}`}>
            {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-indigo-600" />}
          </button>
        </nav>

        <div className="flex lg:hidden items-center gap-2">
          <button onClick={toggleTheme} className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden border-b overflow-hidden absolute w-full left-0 z-[55] ${theme === 'dark' ? 'bg-[#0a0a0a] border-white/10 shadow-2xl' : 'bg-white border-black/5 shadow-lg'}`}
          >
            <div className="p-6 flex flex-col gap-4">
              <button onClick={() => { setView('templates'); setIsMenuOpen(false); }} className="text-left font-bold text-lg">Biblioteca de Templates</button>
              <button onClick={() => { setView('examples'); setIsMenuOpen(false); }} className="text-left font-bold text-lg">Showcase de Exemplos</button>
              <button onClick={() => { setView('course'); setIsMenuOpen(false); }} className="text-left font-bold text-lg">Mini Curso de IA</button>
              <hr className="opacity-10" />
              <button onClick={() => { handleStartFlow('text'); }} className="w-full py-4 rounded-xl bg-gradient-premium text-white font-bold">Gerar Texto Profissional</button>
              <button onClick={() => { handleStartFlow('image'); }} className="w-full py-4 rounded-xl border-2 border-cyan-500 text-cyan-500 font-bold">Gerar Imagem Artística</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-zinc-50 text-zinc-900'}`}>
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[80%] h-[80%] rounded-full blur-[140px] opacity-[0.15] bg-cyan-500"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.15, 1], x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute -bottom-[10%] -left-[10%] w-[80%] h-[80%] rounded-full blur-[140px] opacity-[0.15] bg-purple-500"
        ></motion.div>
      </div>

      {renderHeader()}

      <main className="flex-grow pt-20 md:pt-32 pb-20 relative z-10 w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          {view === 'hero' && <HeroView theme={theme} onStart={handleStartFlow} />}
          {view === 'ai-select' && <AISelectView theme={theme} onSelect={handleSelectAI} onBack={() => setView('hero')} />}
          {view === 'text-module' && <TextModuleView theme={theme} selectedAI={selectedAI!} onComplete={(p) => { setPromptState({...promptState!, generatedPrompt: p}); setView('result'); }} onBack={() => setView('ai-select')} />}
          {view === 'image-module' && <ImageModuleView theme={theme} selectedAI={selectedAI!} onComplete={(p) => { setPromptState({...promptState!, generatedPrompt: p}); setView('result'); }} onBack={() => setView('ai-select')} />}
          {view === 'result' && <ResultView theme={theme} promptState={promptState!} onCopy={copyToClipboard} copied={copied} onRestart={() => setView('hero')} />}
          {view === 'course' && <CourseView theme={theme} onBack={() => setView('hero')} />}
          {view === 'templates' && <TemplatesView theme={theme} onCopy={copyToClipboard} copied={copied} onBack={() => setView('hero')} />}
          {view === 'examples' && <ExamplesView theme={theme} onBack={() => setView('hero')} />}
        </AnimatePresence>
      </main>

      <footer className={`py-8 border-t ${theme === 'dark' ? 'border-white/5 text-zinc-500' : 'border-black/5 text-zinc-400'}`}>
        <div className="max-w-7xl mx-auto px-6 text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-40">
          IA na Prática Studio © 2026
        </div>
      </footer>
    </div>
  );
};

// --- Subcomponents ---

const HeroView: React.FC<{ theme: 'dark' | 'light', onStart: (t: 'text' | 'image') => void }> = ({ theme, onStart }) => {
  const words = ["resultados reais", "prompts de elite", "arte deslumbrante", "copy magnética"];
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setWordIdx(p => (p + 1) % words.length), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl mx-auto px-4 md:px-6 text-center py-12 md:py-20"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-8 md:mb-10 shadow-lg`}
      >
        <Sparkles size={14} /> Studio Profissional de IA
      </motion.div>
      
      <h1 className={`text-4xl md:text-8xl font-black mb-6 md:mb-8 leading-[1.1] md:leading-[1] tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
        Ideias em<br />
        <AnimatePresence mode="wait">
          <motion.span 
            key={wordIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="text-gradient block mt-2"
          >
            {words[wordIdx]}
          </motion.span>
        </AnimatePresence>
      </h1>
      
      <p className={`text-sm md:text-xl mb-10 md:mb-14 max-w-2xl mx-auto font-medium leading-relaxed opacity-60 px-4`}>
        Pare de "tentar" falar com a IA. Utilize engenharia de prompts <br className="hidden md:block" /> 
        de alto nível, testada para os modelos mais potentes de 2026.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 px-4">
        <button 
          onClick={() => onStart('text')}
          className="w-full md:w-auto px-10 py-5 rounded-2xl bg-gradient-premium text-white font-black text-lg shadow-[0_20px_40px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <MessageSquare size={22} /> Criar Texto
        </button>
        <button 
          onClick={() => onStart('image')}
          className={`w-full md:w-auto px-10 py-5 rounded-2xl font-black text-lg border-2 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-black/5 text-black shadow-sm'}`}
        >
          <ImageIcon size={22} /> Criar Imagem
        </button>
      </div>
    </motion.section>
  );
};

const AISelectView: React.FC<{ theme: 'dark' | 'light', onSelect: (ai: AIModel) => void, onBack: () => void }> = ({ theme, onSelect, onBack }) => (
  <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl mx-auto px-4 md:px-6">
    <button onClick={onBack} className="flex items-center gap-2 mb-8 opacity-50 hover:opacity-100 transition-all font-bold uppercase text-[10px] tracking-widest"><ArrowLeft size={16} /> Voltar</button>
    <h2 className="text-3xl md:text-5xl font-black mb-8 md:mb-10 text-center md:text-left">Onde usará o prompt?</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
      {AI_OPTIONS.map(ai => (
        <button 
          key={ai.name} 
          onClick={() => onSelect(ai.name as AIModel)}
          className={`group p-5 md:p-8 rounded-[2rem] border-2 text-left transition-all hover:scale-[1.03] active:scale-95 flex flex-col gap-4
            ${theme === 'dark' ? 'bg-zinc-900 border-white/5 hover:border-cyan-500/50' : 'bg-white border-black/5 hover:border-cyan-500/50 shadow-sm'}`}
        >
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${ai.color} flex items-center justify-center text-2xl md:text-3xl shadow-lg group-hover:rotate-6 transition-transform`}>{ai.icon}</div>
          <span className="text-sm md:text-xl font-bold">{ai.name}</span>
        </button>
      ))}
    </div>
  </motion.section>
);

const TextModuleView: React.FC<{ theme: 'dark' | 'light', selectedAI: AIModel, onComplete: (p: string) => void, onBack: () => void }> = ({ theme, selectedAI, onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ category: '', objective: '', audience: '', tone: 'Profissional', detail: 'Equilibrado' });

  const generatePrompt = () => {
    let b = `Atue como um [${data.category.toUpperCase()}] sênior. Objetivo: ${data.objective}. `;
    if (data.category.includes('Emails')) b += `Foque em um assunto magnético e CTA clara. `;
    if (data.category.includes('Marketing')) b += `Use gatilhos de escassez e copywriting persuasivo. `;
    if (data.category.includes('Estudos')) b += `Use a técnica Feynman para explicar. `;
    b += `Público: ${data.audience}. Tom: ${data.tone}. Tamanho: ${data.detail}. Otimize para ${selectedAI}.`;
    onComplete(b);
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <button onClick={onBack} className="p-2 opacity-50"><ArrowLeft size={18}/></button>
        <div className="flex gap-1 md:gap-1.5">
          {[1,2,3,4,5].map(s => (
            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-8 md:w-10 bg-cyan-500' : 'w-3 md:w-4 bg-zinc-800'}`} />
          ))}
        </div>
      </div>
      <div className="min-h-[350px]">
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEXT_CATEGORIES.map(c => (
              <button key={c.id} onClick={() => { setData({...data, category: c.name}); setStep(2); }} className={`p-4 md:p-6 rounded-2xl border-2 text-left flex items-center gap-4 transition-all active:scale-95 ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
                <div className="p-3 bg-gradient-premium rounded-xl text-white">{c.icon}</div>
                <span className="font-bold text-sm md:text-lg">{c.name}</span>
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div>
            <h3 className="text-xl md:text-3xl font-black mb-6 italic">O que deseja criar?</h3>
            <textarea 
              autoFocus
              className={`w-full h-44 md:h-52 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 outline-none focus:border-cyan-500 transition-all text-base md:text-xl font-medium resize-none ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-black/10 text-black'}`}
              placeholder="Ex: Um e-mail de vendas irresistível..."
              onChange={(e) => setData({...data, objective: e.target.value})}
            />
            <button onClick={() => setStep(3)} disabled={!data.objective} className="mt-6 w-full py-4 md:py-5 rounded-2xl bg-gradient-premium text-white font-black text-lg shadow-xl disabled:opacity-30">Próximo</button>
          </div>
        )}
        {step === 3 && (
          <div>
            <h3 className="text-xl md:text-3xl font-black mb-6 italic">Para quem é o texto?</h3>
            <input 
              autoFocus
              className={`w-full p-6 md:p-8 rounded-2xl border-2 outline-none focus:border-cyan-500 text-base md:text-xl font-medium ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-black/10 text-black'}`}
              placeholder="Ex: Alunos, Clientes, Chefe..."
              onChange={(e) => setData({...data, audience: e.target.value})}
            />
            <button onClick={() => setStep(4)} disabled={!data.audience} className="mt-6 w-full py-4 md:py-5 rounded-2xl bg-gradient-premium text-white font-black text-lg shadow-xl">Próximo</button>
          </div>
        )}
        {step === 4 && (
          <div className="grid grid-cols-2 gap-3">
            {['Sério', 'Divertido', 'Persuasivo', 'Técnico', 'Empático', 'Urgente'].map(t => (
              <button key={t} onClick={() => { setData({...data, tone: t}); setStep(5); }} className={`p-4 md:p-6 rounded-2xl border-2 font-black text-sm md:text-lg transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-black/5'}`}>{t}</button>
            ))}
          </div>
        )}
        {step === 5 && (
          <div className="grid grid-cols-1 gap-3">
            {['Curto e Grosso', 'Equilibrado', 'Detalhado e Completo'].map(d => (
              <button key={d} onClick={() => { setData({...data, detail: d}); generatePrompt(); }} className={`p-6 md:p-8 rounded-2xl border-2 text-left font-black text-base md:text-xl ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-black/5'}`}>{d}</button>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

const ImageModuleView: React.FC<{ theme: 'dark' | 'light', selectedAI: AIModel, onComplete: (p: string) => void, onBack: () => void }> = ({ theme, selectedAI, onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ type: '', subject: '', style: 'Fotorealista', light: 'Luz do Dia' });

  const complete = () => {
    let p = `${data.style} of ${data.subject}, ${data.light}, 8k, highly detailed, masterwork. `;
    if (selectedAI === 'Midjourney') p += ` --v 6.0 --ar 16:9`;
    onComplete(p);
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-2xl mx-auto px-4 md:px-6">
      <div className="mb-8 md:mb-12 flex items-center justify-between">
        <button onClick={onBack} className="p-2 opacity-50"><ArrowLeft size={18}/></button>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 text-center flex-1">Gerador Visual Elite</span>
      </div>
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {IMAGE_TYPES.map(t => (
            <button key={t.id} onClick={() => { setData({...data, type: t.name}); setStep(2); }} className={`p-4 md:p-6 rounded-2xl border-2 text-left flex items-center gap-4 transition-all active:scale-95 ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}>
              <div className="p-3 bg-gradient-premium rounded-xl text-white">{t.icon}</div>
              <span className="font-bold text-sm md:text-lg">{t.name}</span>
            </button>
          ))}
        </div>
      )}
      {step === 2 && (
        <div>
          <h3 className="text-xl md:text-3xl font-black mb-6 italic">O que deve aparecer?</h3>
          <textarea 
            autoFocus
            className={`w-full h-44 md:h-52 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 outline-none focus:border-cyan-500 text-base md:text-xl font-medium resize-none transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-black/10 text-black'}`}
            placeholder="Ex: Um robô de óculos em Marte..."
            onChange={(e) => setData({...data, subject: e.target.value})}
          />
          <button onClick={() => setStep(3)} disabled={!data.subject} className="mt-6 w-full py-4 md:py-5 rounded-2xl bg-gradient-premium text-white font-black text-lg shadow-2xl transition-all disabled:opacity-30">Próximo</button>
        </div>
      )}
      {step === 3 && (
        <div className="grid grid-cols-2 gap-3">
          {['Cyberpunk', 'Arte Digital', 'Vaporwave', 'Pintura', 'Cinematográfico', 'Neon'].map(s => (
            <button key={s} onClick={() => { setData({...data, style: s}); complete(); }} className={`p-4 md:p-6 rounded-2xl border-2 font-black text-sm md:text-lg transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-black/5'}`}>{s}</button>
          ))}
        </div>
      )}
    </motion.section>
  );
};

const ResultView: React.FC<{ theme: 'dark' | 'light', promptState: PromptState, onCopy: (p: string) => void, copied: boolean, onRestart: () => void }> = ({ theme, promptState, onCopy, copied, onRestart }) => (
  <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl mx-auto px-4 md:px-6">
    <div className="text-center mb-8 md:mb-12">
      <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-500 text-[10px] font-black uppercase mb-3 border border-cyan-500/20">Studio AI: Entrega Final</div>
      <h2 className="text-3xl md:text-5xl font-black">Pronto para uso ✨</h2>
    </div>
    
    <div className={`p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border shadow-2xl relative ${theme === 'dark' ? 'bg-zinc-900/80 border-white/10' : 'bg-white border-black/5 shadow-lg'}`}>
      <div className={`p-6 md:p-10 rounded-2xl md:rounded-[2rem] border-2 font-medium text-base md:text-2xl leading-relaxed italic relative mb-8 md:mb-10 ${theme === 'dark' ? 'bg-black/30 border-white/5 text-zinc-300' : 'bg-zinc-50 border-black/5 text-zinc-700'}`}>
        "{promptState.generatedPrompt}"
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 md:gap-5">
        <button 
          onClick={() => onCopy(promptState.generatedPrompt)} 
          className={`flex-[3] py-5 md:py-6 rounded-2xl font-black text-base md:text-xl transition-all shadow-xl flex items-center justify-center gap-3 ${copied ? 'bg-emerald-500 text-white' : 'bg-gradient-premium text-white active:scale-95'}`}
        >
          {copied ? <Check size={24} /> : <Copy size={24} />}
          {copied ? 'Copiado!' : 'Copiar Prompt Master'}
        </button>
        <button onClick={onRestart} className={`flex-1 py-5 md:py-6 rounded-2xl border-2 font-black text-base md:text-xl flex items-center justify-center transition-all active:scale-95 ${theme === 'dark' ? 'border-white/10 text-white' : 'border-black/10 text-black'}`}>
          <RotateCcw size={24} />
        </button>
      </div>

      <div className="mt-8 md:mt-10 p-5 md:p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex items-start gap-4">
         <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-500 hidden sm:block"><Info size={20} /></div>
         <div>
            <h5 className="font-bold text-xs md:text-sm mb-1">Dica de Especialista:</h5>
            <p className="text-[10px] md:text-xs opacity-60 leading-relaxed italic">"Cole no {promptState.selectedAI} e se o resultado não for 100%, peça: 'Ajuste [item] para ser mais [estilo]'. A IA adora diálogos!"</p>
         </div>
      </div>
    </div>
  </motion.section>
);

const CourseView: React.FC<{ theme: 'dark' | 'light', onBack: () => void }> = ({ theme, onBack }) => {
  const [active, setActive] = useState(1);
  const progress = (active / COURSE_MODULES.length) * 100;

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto px-4 md:px-6">
      <div className="mb-10 text-center md:text-left">
        <button onClick={onBack} className="mb-4 inline-flex items-center gap-2 opacity-50 font-bold uppercase text-[10px] tracking-[0.2em]"><ArrowLeft size={14} /> Voltar</button>
        <h2 className="text-3xl md:text-6xl font-black mb-6">Guia para <span className="text-gradient">Leigos</span></h2>
        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden mb-2">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-premium shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
        </div>
        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest text-center">Fase {active} de {COURSE_MODULES.length}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        {/* Module Picker - Mobile Responsive Scroll */}
        <div className="lg:w-1/3 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 snap-x scrollbar-hide">
          {COURSE_MODULES.map(m => (
            <button 
              key={m.id} 
              onClick={() => setActive(m.id)} 
              className={`p-5 md:p-6 rounded-2xl text-left border-2 transition-all flex items-center gap-4 shrink-0 snap-center min-w-[200px] lg:min-w-0
                ${active === m.id ? 'border-cyan-500 bg-cyan-500/5 shadow-lg' : 'border-transparent opacity-40'}`}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg ${active === m.id ? 'bg-cyan-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                {m.icon}
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-widest text-cyan-500">Módulo 0{m.id}</div>
                <div className="font-bold text-xs md:text-base">{m.title}</div>
              </div>
            </button>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`lg:w-2/3 p-8 md:p-14 rounded-[2.5rem] md:rounded-[4rem] border shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-xl'}`}
          >
            <h3 className="text-2xl md:text-5xl font-black mb-8 leading-tight">{COURSE_MODULES.find(m => m.id === active)?.title}</h3>
            <div className="space-y-6 md:space-y-8 mb-10 md:mb-12">
              {COURSE_MODULES.find(m => m.id === active)?.content.map((c, i) => (
                <div key={i} className="flex gap-4 md:gap-6 items-start font-medium text-base md:text-2xl opacity-80 leading-relaxed">
                  <div className="mt-2.5 w-3 h-3 rounded-full bg-gradient-premium shrink-0" />
                  {c}
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-8 border-t border-white/5">
              <button 
                onClick={() => active < COURSE_MODULES.length ? setActive(active + 1) : onBack()} 
                className="w-full py-4 md:py-5 rounded-2xl bg-white text-black font-black uppercase text-xs md:text-sm tracking-widest shadow-2xl active:scale-95 transition-all"
              >
                {active < COURSE_MODULES.length ? 'Próximo Passo' : 'Entendido!'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

const TemplatesView: React.FC<{ theme: 'dark' | 'light', onCopy: (p: string) => void, copied: boolean, onBack: () => void }> = ({ theme, onCopy, copied, onBack }) => {
  const [filter, setFilter] = useState<'all' | 'text' | 'image'>('all');
  const filtered = useMemo(() => TEMPLATES.filter(t => filter === 'all' || t.type === filter), [filter]);

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-7xl mx-auto px-4 md:px-6">
      <div className="mb-10 flex flex-col items-center text-center">
        <button onClick={onBack} className="mb-4 flex items-center gap-2 opacity-50 font-bold uppercase text-[10px] tracking-widest"><ArrowLeft size={14} /> Home</button>
        <h2 className="text-3xl md:text-7xl font-black tracking-tighter mb-6">Acervo de <span className="text-gradient">Prompts</span></h2>
        <div className={`p-1.5 rounded-2xl flex border-2 ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-zinc-100 border-black/5'}`}>
          <button onClick={() => setFilter('all')} className={`px-4 md:px-6 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase transition-all ${filter === 'all' ? 'bg-cyan-500 text-white' : 'opacity-40'}`}>Tudo</button>
          <button onClick={() => setFilter('text')} className={`px-4 md:px-6 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase transition-all ${filter === 'text' ? 'bg-cyan-500 text-white' : 'opacity-40'}`}>Texto</button>
          <button onClick={() => setFilter('image')} className={`px-4 md:px-6 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase transition-all ${filter === 'image' ? 'bg-cyan-500 text-white' : 'opacity-40'}`}>Imagem</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map(t => (
            <motion.div 
              key={t.id} 
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`p-6 md:p-8 rounded-[2.5rem] border-2 flex flex-col justify-between transition-all group ${theme === 'dark' ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-black/5 shadow-sm'}`}
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center text-white shadow-lg ${t.type === 'text' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                  {t.type === 'text' ? <MessageSquare size={20} /> : <ImageIcon size={20} />}
                </div>
                <h4 className="font-black text-xl mb-2 leading-tight">{t.title}</h4>
                <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-6">{t.preview}</p>
              </div>
              <button onClick={() => onCopy(t.prompt)} className="w-full py-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-cyan-500 hover:border-cyan-500 hover:text-white">Copiar Prompt</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

const ExamplesView: React.FC<{ theme: 'dark' | 'light', onBack: () => void }> = ({ theme, onBack }) => (
  <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl mx-auto px-4 md:px-6">
    <div className="text-center mb-12">
       <button onClick={onBack} className="mb-6 mx-auto flex items-center gap-2 opacity-50 font-bold uppercase text-[10px] tracking-widest"><ArrowLeft size={14} /> Voltar</button>
       <h2 className="text-3xl md:text-7xl font-black mb-4 italic tracking-tighter">O Poder da <span className="text-gradient">Precisão</span></h2>
    </div>
    
    <div className="space-y-12 md:space-y-20">
      {EXAMPLES.map((ex, idx) => (
        <motion.div 
          key={ex.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`p-8 md:p-20 rounded-[3rem] md:rounded-[4rem] border shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-lg'}`}
        >
          <div className="absolute top-4 right-8 text-[4rem] md:text-[10rem] font-black opacity-[0.03] italic">0{idx + 1}</div>
          <h4 className="text-xl md:text-4xl font-black mb-10 flex items-center gap-4">
            <div className="w-2 md:w-3 h-8 md:h-12 bg-gradient-premium rounded-full" />
            {ex.title}
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-2"><X size={14} /> Antes (Comum)</span>
              <div className={`p-6 md:p-8 rounded-[1.5rem] border italic font-medium opacity-50 text-sm md:text-xl leading-relaxed ${theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-zinc-100 border-black/5'}`}>
                "{ex.before}"
              </div>
            </div>
            
            <div className="space-y-4 relative">
              <span className="text-[10px] font-black uppercase text-cyan-500 tracking-widest flex items-center gap-2"><Check size={14} /> Depois (Studio)</span>
              <div className={`p-6 md:p-8 rounded-[1.5rem] border-2 border-cyan-500/30 font-black text-sm md:text-2xl leading-relaxed ${theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
                "{ex.after}"
              </div>
              <div className="absolute -top-3 -right-3 md:-top-10 md:-right-10 px-4 md:px-8 py-2 md:py-4 bg-gradient-premium rounded-2xl text-[8px] md:text-xs font-black uppercase text-white shadow-2xl z-20">
                {ex.improvement}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

export default App;
