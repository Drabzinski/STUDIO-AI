
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Moon, Sparkles, Image as ImageIcon, MessageSquare, 
  ArrowLeft, Copy, RotateCcw, Check, Menu, X, Search,
  Zap, Compass, Target, Layers, Eye, Repeat, Trophy, Shield,
  Play, Loader2, Send, Cpu
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AppView, AIModel, PromptState } from './types';
import { AI_OPTIONS, TEXT_CATEGORIES, COURSE_MODULES, TEMPLATES, EXAMPLES } from './constants';

const springConfig = { type: "spring" as const, damping: 25, stiffness: 200 };

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [view, setView] = useState<AppView>('hero');
  const [selectedAI, setSelectedAI] = useState<AIModel | null>(null);
  const [promptState, setPromptState] = useState<PromptState | null>(null);
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // IA States
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    document.documentElement.className = theme;
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleStartFlow = (type: 'text' | 'image') => {
    setPromptState({ type, selectedAI: 'ChatGPT', category: '', details: {}, generatedPrompt: '' });
    setAiResponse(null);
    setAiImageUrl(null);
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

  const executeWithGemini = async () => {
    if (!promptState?.generatedPrompt) return;
    setIsAiLoading(true);
    setAiResponse(null);
    setAiImageUrl(null);

    try {
      // Cria a instância do AI usando a chave do processo
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      if (promptState.type === 'text') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: promptState.generatedPrompt,
        });
        setAiResponse(response.text || "Sem resposta da IA.");
      } else {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: promptState.generatedPrompt }] },
        });
        
        const candidate = response.candidates?.[0];
        if (candidate) {
          for (const part of candidate.content.parts) {
            if (part.inlineData) {
              setAiImageUrl(`data:image/png;base64,${part.inlineData.data}`);
            } else if (part.text) {
              setAiResponse(part.text);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Erro na IA:", error);
      setAiResponse(`Erro: ${error.message || "Falha na conexão"}. Verifique se a API_KEY está configurada no Vercel.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-700 ${theme === 'dark' ? 'bg-[#000] text-white' : 'bg-[#f8faff] text-zinc-900'}`}>
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-[0.15] bg-cyan-500 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-[0.15] bg-purple-600 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <header className={`fixed top-0 left-0 right-0 z-[100] border-b backdrop-blur-xl transition-colors duration-500 ${theme === 'dark' ? 'bg-black/60 border-white/5' : 'bg-white/70 border-black/5'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setView('hero'); setIsMenuOpen(false); }}>
            <div className="w-10 h-10 bg-gradient-premium rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.3)] group-hover:scale-110 transition-transform">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight">STUDIO <span className="text-gradient">AI</span></span>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {['Templates', 'Exemplos', 'Curso'].map((item) => (
              <button 
                key={item}
                onClick={() => setView(item.toLowerCase() as AppView)} 
                className="text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-cyan-400 transition-all"
              >
                {item}
              </button>
            ))}
            <div className="h-6 w-px bg-white/10 mx-2" />
            <button onClick={toggleTheme} className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all">
              {theme === 'dark' ? <Sun size={18} className="text-cyan-400" /> : <Moon size={18} />}
            </button>
          </nav>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-white">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-20 relative z-10 w-full flex flex-col items-center px-6">
        <AnimatePresence mode="wait">
          {view === 'hero' && <HeroView key="hero" onStart={handleStartFlow} />}
          {view === 'ai-select' && <AISelectView key="ai" onSelect={handleSelectAI} onBack={() => setView('hero')} theme={theme} />}
          {view === 'text-module' && <TextModuleView key="text" selectedAI={selectedAI!} onComplete={(p) => { setPromptState({...promptState!, generatedPrompt: p}); setView('result'); }} onBack={() => setView('ai-select')} theme={theme} />}
          {view === 'image-module' && <ImageModuleView key="image" selectedAI={selectedAI!} onComplete={(p) => { setPromptState({...promptState!, generatedPrompt: p}); setView('result'); }} onBack={() => setView('ai-select')} theme={theme} />}
          {view === 'result' && (
            <ResultView 
              key="res" 
              promptState={promptState!} 
              onCopy={copyToClipboard} 
              copied={copied} 
              onRestart={() => setView('hero')} 
              theme={theme}
              onExecute={executeWithGemini}
              isLoading={isAiLoading}
              response={aiResponse}
              imageUrl={aiImageUrl}
            />
          )}
          {view === 'course' && <CourseView key="cour" onBack={() => setView('hero')} theme={theme} />}
          {view === 'templates' && <TemplatesView key="temp" onCopy={copyToClipboard} copied={copied} onBack={() => setView('hero')} theme={theme} />}
          {view === 'examples' && <ExamplesView key="ex" onBack={() => setView('hero')} theme={theme} />}
        </AnimatePresence>
      </main>
    </div>
  );
};

// --- Subcomponents ---

const HeroView: React.FC<{ onStart: (t: 'text' | 'image') => void }> = ({ onStart }) => (
  <motion.section initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={springConfig} className="max-w-4xl text-center">
    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-[0_0_30px_rgba(0,242,255,0.1)]">
      <Zap size={14} fill="currentColor" /> Nova Geração de Prompts
    </div>
    <h1 className="text-5xl md:text-9xl font-black mb-8 tracking-tighter leading-none">
      Crie o <br /><span className="text-gradient">Impossível</span>
    </h1>
    <p className="text-lg md:text-2xl mb-16 max-w-2xl mx-auto opacity-50 font-medium leading-relaxed">
      A plataforma definitiva para engenharia de prompts. <br className="hidden md:block" /> Do conceito à execução em segundos.
    </p>
    <div className="flex flex-col sm:flex-row gap-5 justify-center">
      <button onClick={() => onStart('text')} className="group px-12 py-6 rounded-2xl bg-gradient-premium text-white font-black text-xl hover:shadow-[0_0_40px_rgba(0,242,255,0.4)] transition-all flex items-center justify-center gap-3">
        <MessageSquare size={24} /> Criar Texto
      </button>
      <button onClick={() => onStart('image')} className="px-12 py-6 rounded-2xl border-2 border-white/10 hover:bg-white/5 font-black text-xl transition-all flex items-center justify-center gap-3">
        <ImageIcon size={24} /> Criar Imagem
      </button>
    </div>
  </motion.section>
);

const AISelectView: React.FC<{ onSelect: (ai: AIModel) => void, onBack: () => void, theme: string }> = ({ onSelect, onBack, theme }) => (
  <motion.section initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={springConfig} className="w-full max-w-5xl">
    <button onClick={onBack} className="flex items-center gap-2 mb-10 opacity-30 font-bold uppercase text-xs tracking-widest hover:opacity-100 transition-opacity"><ArrowLeft size={18}/> Voltar</button>
    <h2 className="text-4xl font-black mb-12">Escolha seu <span className="text-cyan-400">Motor de IA</span></h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
      {AI_OPTIONS.map(ai => (
        <button 
          key={ai.name} 
          onClick={() => onSelect(ai.name as AIModel)} 
          className="group relative p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] text-left transition-all hover:border-cyan-500/50 hover:bg-cyan-500/5 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className={`w-16 h-16 rounded-3xl ${ai.color} flex items-center justify-center text-3xl mb-6 shadow-2xl group-hover:scale-110 transition-transform`}>{ai.icon}</div>
          <span className="text-lg font-black">{ai.name}</span>
          <p className="text-[10px] opacity-30 mt-2 font-bold uppercase tracking-widest">Otimizar agora</p>
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
    b += `Público: ${data.audience}. Tom: ${data.tone}. Formato: ${data.detail}. Otimizado para ${selectedAI}.`;
    onComplete(b);
  };

  return (
    <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl glass p-12 rounded-[3rem]">
      <div className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><ArrowLeft size={20} /></button>
        <div className="flex gap-2">
          {[1,2,3,4,5].map(s => <div key={s} className={`h-2 rounded-full transition-all duration-500 ${step >= s ? 'w-10 bg-cyan-400' : 'w-4 bg-white/10'}`} />)}
        </div>
      </div>

      <div className="min-h-[400px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <h3 className="col-span-full text-2xl font-black mb-4">Selecione o <span className="text-cyan-400">Nicho</span></h3>
              {TEXT_CATEGORIES.map(c => (
                <button key={c.id} onClick={() => { setData({...data, category: c.name}); setStep(2); }} className="p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-left transition-all flex items-center gap-5">
                  <div className="p-3 bg-gradient-premium rounded-xl text-white">{c.icon}</div>
                  <span className="font-black text-sm">{c.name}</span>
                </button>
              ))}
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-8">
              <h3 className="text-3xl font-black italic">Qual o seu <span className="text-cyan-400">Objetivo</span>?</h3>
              <textarea 
                autoFocus 
                className="w-full h-48 p-8 rounded-[2rem] border-2 bg-transparent border-white/10 outline-none focus:border-cyan-500 text-xl resize-none placeholder:opacity-20" 
                placeholder="Ex: Escrever um e-mail de vendas para meu novo software..." 
                onChange={(e) => setData({...data, objective: e.target.value})} 
              />
              <button onClick={() => setStep(3)} disabled={!data.objective} className="py-6 rounded-2xl bg-gradient-premium font-black text-xl shadow-xl disabled:opacity-20 transition-all">Continuar</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-8">
              <h3 className="text-3xl font-black italic">Quem é o seu <span className="text-cyan-400">Público</span>?</h3>
              <input 
                autoFocus 
                className="w-full p-8 rounded-[2rem] border-2 bg-transparent border-white/10 outline-none focus:border-cyan-500 text-xl placeholder:opacity-20" 
                placeholder="Ex: Empreendedores de 20 a 35 anos..." 
                onChange={(e) => setData({...data, audience: e.target.value})} 
              />
              <button onClick={() => setStep(4)} disabled={!data.audience} className="py-6 rounded-2xl bg-gradient-premium font-black text-xl transition-all">Definir Tom</button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-2 gap-4">
              <h3 className="col-span-full text-3xl font-black italic mb-4">Escolha o <span className="text-cyan-400">Tom</span></h3>
              {['Sério', 'Divertido', 'Persuasivo', 'Técnico', 'Amigável', 'Luxuoso'].map(t => (
                <button key={t} onClick={() => { setData({...data, tone: t}); setStep(5); }} className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10 font-black text-lg transition-all">{t}</button>
              ))}
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-4">
              <h3 className="text-3xl font-black italic mb-8">Tamanho e <span className="text-cyan-400">Formato</span></h3>
              {['Curto (WhatsApp)', 'Médio (Email)', 'Longo (Artigo)'].map(d => (
                <button key={d} onClick={() => { setData({...data, detail: d}); finish(); }} className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-cyan-400 hover:bg-cyan-400/10 font-black text-left transition-all">{d}</button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

// Reusing ImageModuleView with similar premium adjustments...
const ImageModuleView: React.FC<{ selectedAI: AIModel, onComplete: (p: string) => void, onBack: () => void, theme: string }> = ({ selectedAI, onComplete, onBack, theme }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ subject: '', style: 'Fotorealista' });

  const complete = () => {
    let p = `${data.style} of ${data.subject}, ultra detailed, 8k, cinematic lighting. `;
    if (selectedAI === 'Midjourney') p += ` --v 6 --ar 16:9`;
    onComplete(p);
  };

  return (
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl glass p-12 rounded-[3rem]">
      <div className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><ArrowLeft size={20} /></button>
        <div className="flex gap-2">
          {[1,2].map(s => <div key={s} className={`h-2 rounded-full transition-all duration-500 ${step >= s ? 'w-16 bg-cyan-400' : 'w-4 bg-white/10'}`} />)}
        </div>
      </div>
      {step === 1 ? (
        <div className="flex flex-col gap-8">
          <h3 className="text-3xl font-black italic">O que você <span className="text-cyan-400">visualiza</span>?</h3>
          <textarea 
            autoFocus 
            className="w-full h-48 p-8 rounded-[2rem] border-2 bg-transparent border-white/10 outline-none focus:border-cyan-500 text-xl resize-none placeholder:opacity-20" 
            placeholder="Ex: Um tigre de cristal flutuando sobre uma galáxia de neon..." 
            onChange={(e) => setData({...data, subject: e.target.value})} 
          />
          <button onClick={() => setStep(2)} disabled={!data.subject} className="py-6 rounded-2xl bg-gradient-premium font-black text-xl transition-all">Escolher Estilo</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {['Fotorealista', '3D Render', 'Anime', 'Cyberpunk', 'Arte a Óleo', 'Sketch'].map(s => (
            <button key={s} onClick={() => { setData({...data, style: s}); complete(); }} className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:border-cyan-500 font-black text-lg transition-all">{s}</button>
          ))}
        </div>
      )}
    </motion.section>
  );
};

const ResultView: React.FC<{ 
  promptState: PromptState, 
  onCopy: (p: string) => void, 
  copied: boolean, 
  onRestart: () => void, 
  theme: string,
  onExecute: () => void,
  isLoading: boolean,
  response: string | null,
  imageUrl: string | null
}> = ({ promptState, onCopy, copied, onRestart, theme, onExecute, isLoading, response, imageUrl }) => (
  <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl">
    <div className="glass p-12 rounded-[3.5rem] mb-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
        <Cpu size={120} />
      </div>
      
      <h2 className="text-sm font-black uppercase tracking-[0.4em] text-cyan-400 mb-8 flex items-center gap-3">
        <div className="w-8 h-px bg-cyan-400" /> Prompt Criado com Sucesso
      </h2>

      <div className="p-10 rounded-[2.5rem] bg-black/40 border-2 border-white/5 font-medium text-2xl italic leading-relaxed mb-12 shadow-inner relative group">
        "{promptState.generatedPrompt}"
        <button onClick={() => onCopy(promptState.generatedPrompt)} className="absolute top-4 right-4 p-3 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10">
          {copied ? <Check className="text-green-400" /> : <Copy size={20} />}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <button onClick={() => onCopy(promptState.generatedPrompt)} className="py-6 rounded-[1.5rem] bg-white text-black font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
          {copied ? <Check size={24} /> : <Copy size={24} />}
          {copied ? 'Copiado!' : 'Copiar Prompt'}
        </button>
        
        <button 
          onClick={onExecute} 
          disabled={isLoading}
          className="py-6 rounded-[1.5rem] bg-gradient-premium text-white font-black text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(0,242,255,0.4)] disabled:opacity-50 transition-all group"
        >
          {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Play className="group-hover:translate-x-1 transition-transform" size={24} />}
          {isLoading ? 'IA Processando...' : 'Executar no Gemini'}
        </button>
      </div>

      <button onClick={onRestart} className="mt-8 w-full py-4 opacity-30 hover:opacity-100 transition-opacity font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
        <RotateCcw size={14} /> Começar do Zero
      </button>
    </div>

    {/* OUTPUT AREA */}
    <AnimatePresence>
      {(response || imageUrl || isLoading) && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="glass p-12 rounded-[3.5rem] border-cyan-500/20 shadow-[0_0_100px_rgba(0,242,255,0.05)]"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-cyan-400 animate-ping' : 'bg-green-400'}`} />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">Motor de Resposta Gemini</span>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center gap-8 opacity-40">
              <div className="relative">
                <Loader2 className="animate-spin text-cyan-400" size={64} />
                <div className="absolute inset-0 blur-xl bg-cyan-400/20 rounded-full" />
              </div>
              <p className="text-xl font-black italic animate-pulse">Engenhando sua resposta...</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {imageUrl ? (
                <div className="rounded-[2.5rem] overflow-hidden border-8 border-white/5 shadow-2xl group cursor-zoom-in">
                  <img src={imageUrl} alt="IA Result" className="w-full h-auto group-hover:scale-105 transition-transform duration-700" />
                </div>
              ) : (
                <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5">
                  <p className="text-xl leading-relaxed font-medium whitespace-pre-wrap text-zinc-300">
                    {response}
                  </p>
                  <button onClick={() => onCopy(response || '')} className="mt-8 px-6 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2">
                    <Copy size={14} /> Copiar Resultado
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  </motion.section>
);

// Course, Templates and Examples components with minor premium polish
const CourseView: React.FC<{ onBack: () => void, theme: string }> = ({ onBack, theme }) => {
  const [active, setActive] = useState(1);
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-6xl">
      <button onClick={onBack} className="mb-10 flex items-center gap-2 opacity-30 font-black uppercase text-xs tracking-widest hover:opacity-100 transition-opacity"><ArrowLeft size={16} /> Voltar</button>
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/3 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-6 scrollbar-hide">
          {COURSE_MODULES.map(m => (
            <button 
              key={m.id} 
              onClick={() => setActive(m.id)} 
              className={`p-6 rounded-[1.5rem] text-left border-2 flex items-center gap-5 shrink-0 min-w-[280px] lg:min-w-0 transition-all ${active === m.id ? 'border-cyan-500 bg-cyan-500/5 shadow-[0_0_30px_rgba(0,242,255,0.1)]' : 'border-white/5 opacity-40 hover:opacity-100'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${active === m.id ? 'bg-cyan-500 text-white' : 'bg-white/5'}`}>{m.icon}</div>
              <div>
                <div className="text-[10px] font-black uppercase text-cyan-500 tracking-tighter mb-1">Módulo 0{m.id}</div>
                <div className="font-black text-sm">{m.title}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="lg:w-2/3 glass p-12 rounded-[3.5rem] shadow-2xl relative border-white/10 min-h-[500px]">
          <h3 className="text-4xl font-black mb-10 leading-none">{COURSE_MODULES.find(m => m.id === active)?.title}</h3>
          <div className="space-y-8">
            {COURSE_MODULES.find(m => m.id === active)?.content.map((c, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 font-medium text-lg opacity-70 leading-relaxed"
              >
                <div className="mt-2.5 w-3 h-3 rounded-full bg-cyan-500 shrink-0 shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
                {c}
              </motion.div>
            ))}
          </div>
          <button 
            onClick={() => active < COURSE_MODULES.length ? setActive(active + 1) : onBack()} 
            className="mt-16 w-full py-6 rounded-[1.5rem] bg-white text-black font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            {active < COURSE_MODULES.length ? 'Próxima Aula' : 'Finalizar Curso'}
          </button>
        </div>
      </div>
    </motion.section>
  );
};

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
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-7xl">
      <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <button onClick={onBack} className="flex items-center gap-2 opacity-30 uppercase text-xs font-black tracking-widest hover:opacity-100 transition-opacity"><ArrowLeft size={16} /> Home</button>
        
        <div className="flex flex-col md:flex-row gap-5 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 group-focus-within:text-cyan-400 transition-all" size={20} />
            <input 
              type="text" placeholder="Buscar 100+ templates..." 
              className="w-full md:w-80 pl-16 pr-6 py-4 rounded-[1.5rem] border-2 bg-white/[0.03] border-white/5 outline-none focus:border-cyan-500 transition-all font-medium"
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="p-1.5 rounded-[1.5rem] flex border-2 border-white/5 bg-white/[0.02]">
            {['all', 'text', 'image'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)} 
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-gradient-premium text-white shadow-lg' : 'opacity-30 hover:opacity-100'}`}
              >
                {f === 'all' ? 'Tudo' : f === 'text' ? 'Texto' : 'Imagem'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map(t => (
            <motion.div 
              key={t.id} layout initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="group p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.02] flex flex-col justify-between gap-8 hover:border-cyan-500/30 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all">
                {t.type === 'text' ? <MessageSquare size={80} /> : <ImageIcon size={80} />}
              </div>
              
              <div>
                <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center text-white ${t.type === 'text' ? 'bg-cyan-500 shadow-[0_0_20px_rgba(0,242,255,0.3)]' : 'bg-purple-600 shadow-[0_0_20px_rgba(112,0,255,0.3)]'}`}>
                  {t.type === 'text' ? <MessageSquare size={20} /> : <ImageIcon size={20} />}
                </div>
                <h4 className="font-black text-xl mb-2 leading-tight group-hover:text-cyan-400 transition-colors">{t.title}</h4>
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{t.preview}</p>
              </div>
              
              <button 
                onClick={() => onCopy(t.prompt)} 
                className="w-full py-4 rounded-[1.2rem] border-2 border-white/5 group-hover:border-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-all text-[11px] font-black uppercase tracking-widest"
              >
                {copied ? 'Copiado!' : 'Copiar Template'}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

const ExamplesView: React.FC<{ onBack: () => void, theme: string }> = ({ onBack, theme }) => (
  <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl">
    <button onClick={onBack} className="mb-12 flex items-center gap-2 opacity-30 font-black uppercase text-xs tracking-widest hover:opacity-100 transition-opacity"><ArrowLeft size={16}/> Home</button>
    <div className="space-y-12">
      <h2 className="text-5xl font-black mb-16 italic leading-none">A Prova de <span className="text-cyan-400">Poder</span></h2>
      {EXAMPLES.map((ex, i) => (
        <div key={ex.id} className="glass p-12 rounded-[3.5rem] relative group border-white/10 hover:border-cyan-500/20 transition-all overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-150 transition-all duration-1000">
            <Trophy size={200} />
          </div>
          
          <h4 className="text-3xl font-black mb-12 flex items-center gap-5">
            <div className="w-3 h-12 bg-gradient-premium rounded-full" /> {ex.title}
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-4 opacity-30 hover:opacity-50 transition-opacity">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-500 bg-rose-500/10 px-4 py-1.5 rounded-full">O Comum</span>
              <div className="p-8 rounded-[2rem] border-2 border-white/5 bg-black/40 italic text-xl">"{ex.before}"</div>
            </div>
            
            <div className="space-y-4 relative group/item">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-400 bg-cyan-400/10 px-4 py-1.5 rounded-full">Studio Master</span>
              <div className="p-8 rounded-[2rem] border-2 border-cyan-500/50 bg-cyan-500/5 font-bold text-xl italic shadow-[0_0_50px_rgba(0,242,255,0.1)]">"{ex.after}"</div>
              <div className="absolute -top-6 -right-4 px-6 py-3 bg-gradient-premium rounded-2xl text-[10px] font-black text-white shadow-2xl rotate-3 group-hover/item:rotate-0 transition-transform">
                {ex.improvement}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </motion.section>
);

export default App;
