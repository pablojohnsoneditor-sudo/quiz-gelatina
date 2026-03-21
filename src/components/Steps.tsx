import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QuizState, Step } from '../types';
import { ChevronLeft, Check, ArrowRight, Star, Play, Pause, Lock, ChevronDown, ShieldCheck, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface StepProps {
  step: Step;
  state: QuizState;
  onNext: (data?: any) => void;
  onBack: () => void;
}

const QUOTES_DEP: Record<string, string[]> = {
  vergonha: [
    "Voltei a me olhar no espelho e sorrir!",
    "Finalmente uso as roupas que ficavam guardadas!",
    "Parei de fugir das fotos — que libertação!",
    "Me sinto bonita de novo, não acredito!"
  ],
  saude: [
    "Minha energia voltou do zero ao máximo!",
    "Não sinto mais aquele cansaço constante!",
    "Voltei a fazer tudo que amava sem dor!",
    "Me sinto 10 anos mais jovem por dentro!"
  ],
  relac: [
    "Voltei a sair e me sentir confiante!",
    "Meu relacionamento melhorou muito!",
    "Não me escondo mais nas fotos em grupo!",
    "Finalmente me sinto bem em qualquer lugar!"
  ],
  rotina: [
    "Resultado real sem mudar minha rotina!",
    "Simples de fazer e funcionou de verdade!",
    "Em 2 minutos por dia — inacreditável!",
    "Finalmente algo que encaixa na minha vida!"
  ]
};

const PERFIS_DEP = [
  {
    nome:   "Giovanna",
    idade:  29,
    cidade: "São Paulo, SP",
    img:    "https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/AeD1.png"
  },
  {
    nome:   "Sandra",
    idade:  48,
    cidade: "Rio de Janeiro, RJ",
    img:    "https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/AeD2.png"
  },
  {
    nome:   "Claudia",
    idade:  34,
    cidade: "Belo Horizonte, MG",
    img:    "https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/AeD3.png"
  },
  {
    nome:   "Patricia",
    idade:  27,
    cidade: "Curitiba, PR",
    img:    "https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/AeD4.png"
  }
];

const MARCADORES_POS: Record<string, { top: string; left: string } | null> = {
  papada:     { top: "17%", left: "50%" },
  bracos:     { top: "33%", left: "27%" },
  cintura:    { top: "48%", left: "35%" },
  barriga:    { top: "44%", left: "50%" },
  gluteos:    { top: "58%", left: "38%" },
  culotes:    { top: "52%", left: "62%" },
  coxas:      { top: "75%", left: "55%" },
  corpo_todo: null
};

function calcKgDep(meta: number, index: number) {
  const bases = [0.30, 0.35, 0.32, 0.38];
  const kg = Math.round((meta || 10) * bases[index]);
  return Math.min(Math.max(kg, 3), (meta || 10));
}

function getDepoimentos(S: QuizState) {
  const dor  = S.situacao_emocional || "vergonha";
  const meta = (S.peso_atual - S.peso_desejado) || 10;
  const quotes = QUOTES_DEP[dor] || QUOTES_DEP["vergonha"];

  return PERFIS_DEP.map((p, i) => ({
    nome:   p.nome,
    idade:  p.idade,
    cidade: p.cidade,
    img:    p.img,
    kg:     calcKgDep(meta, i),
    quote:  quotes[i]
  }));
}

const HighlightText: React.FC<{ text: string }> = ({ text }) => {
  if (!text || typeof text !== 'string') return null;
  
  const keywords = [
    'Gelatina Mounjaro', 'fome', 'gordura', 'emagrecimento', 'emagrecer',
    'protocolo', 'ritual', 'método', 'resultado', 'resultados', 'corpo', 'peso', 'meta',
    'GLP-1', 'metabolismo', 'queima', 'queimar', '7 dias', '30 dias'
  ];
  
  // Use lookarounds to ensure whole word matches, including accented characters
  // This prevents breaking words in the middle and ensures correct spacing
  const pattern = new RegExp(`((?<![a-zA-ZÀ-Ú0-9])(?:${keywords.join('|')})(?![a-zA-ZÀ-Ú0-9])|(?<![a-zA-ZÀ-Ú0-9])[A-ZÀ-Ú]{2,}(?![a-zA-ZÀ-Ú0-9])|\\d+(?:[.,]\\d+)?(?:kg|%)?)`, 'gi');
  
  const parts = text.split(pattern);
  
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        const isMatch = keywords.some(k => k.toLowerCase() === part.toLowerCase()) || 
                       /^[A-ZÀ-Ú]{2,}$/.test(part) || 
                       /^\d+(?:[.,]\d+)?(?:kg|%)?$/.test(part);
        if (isMatch) {
          return (
            <em key={i} style={{ color: '#E53935', fontStyle: 'italic' }}>{part}</em>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

export const IntroStep: React.FC<StepProps> = ({ step, onNext }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center text-center space-y-6"
  >
    <img src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/FAIXA%20%20GM.png" alt="Logo" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} referrerPolicy="no-referrer" data-img-id="logo" />
    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
      <HighlightText text={step.headline} />
    </h1>
    <img src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png" alt="Hero" style={{ width: 'min(290px, 78vw)', height: 'auto', display: 'block', margin: '0 auto', objectFit: 'contain' }} referrerPolicy="no-referrer" data-img-id="hero" />
    <p className="text-gray-600 text-sm px-4">
      <HighlightText text={step.subtext} />
    </p>
    <button 
      onClick={() => onNext()}
      className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg hover:scale-105 transition-transform"
    >
      {step.cta_text}
    </button>
    <div className="flex flex-col space-y-2 text-xs text-gray-500">
      <span>✓ Análise 100% gratuita</span>
      <span>✓ Método natural e seguro</span>
    </div>
  </motion.div>
);

export const QuestionSingle: React.FC<StepProps> = ({ step, state, onNext }) => {
  const questionText = step.question.replace('{nome}', state.nome || 'Amiga');
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900">
          <HighlightText text={questionText} />
        </h2>
        {step.subtext && <p className="text-sm text-gray-500"><HighlightText text={step.subtext} /></p>}
      </div>
      <div className="grid gap-3">
        {step.options.map((opt: any) => (
          <button
            key={opt.value}
            onClick={() => onNext({ [step.saves_to]: opt.value })}
            className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-[#E53935] hover:bg-red-50 transition-all text-left group"
          >
            <span className="text-2xl mr-4">{opt.emoji}</span>
            <div className="flex-1">
              <div className="font-bold text-gray-800">{opt.label}</div>
              {opt.sublabel && <div className="text-xs text-gray-500">{opt.sublabel}</div>}
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#E53935]" />
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export const QuestionImageGrid: React.FC<StepProps> = ({ step, onNext }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col space-y-6"
  >
    <div className="text-center space-y-2">
      <h2 className="text-xl font-bold text-gray-900">
        <HighlightText text={step.question} />
      </h2>
      {step.subtext && <p className="text-sm text-gray-500"><HighlightText text={step.subtext} /></p>}
    </div>
    <div className="grid grid-cols-2 gap-4">
      {step.options.map((opt: any) => (
        <button
          key={opt.value}
          onClick={() => onNext({ [step.saves_to]: opt.value })}
          className="relative group overflow-hidden rounded-2xl border-2 border-transparent hover:border-[#E53935] transition-all"
        >
          <img src={opt.image} alt={opt.label} className="w-full aspect-[3/4] object-cover rounded-lg" referrerPolicy="no-referrer" data-img-id={opt.img_id} />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <span className="text-white font-bold text-sm">{opt.label}</span>
          </div>
        </button>
      ))}
    </div>
  </motion.div>
);

export const InputText: React.FC<StepProps> = ({ step, onNext }) => {
  const [value, setValue] = React.useState('');
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900">
          <HighlightText text={step.question} />
        </h2>
        {step.subtext && <p className="text-sm text-gray-500"><HighlightText text={step.subtext} /></p>}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={step.placeholder}
        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E53935] outline-none transition-all"
      />
      <button
        disabled={!value.trim()}
        onClick={() => onNext({ [step.saves_to]: value })}
        className="w-full bg-[#E53935] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
      >
        Continuar
      </button>
    </motion.div>
  );
};

export const LoadingAnimated: React.FC<StepProps> = ({ step, state, onNext }) => {
  const [progress, setProgress] = React.useState(0);
  const [currentStepIdx, setCurrentStepIdx] = React.useState(0);
  const headline = step.headline.replace('{nome}', state.nome || 'Amiga');

  const hasCalledNext = React.useRef(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          if (!hasCalledNext.current) {
            hasCalledNext.current = true;
            setTimeout(() => onNext(), 500);
          }
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onNext]);

  React.useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIdx(prev => (prev < step.steps.length - 1 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(stepInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-10">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-100"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={440}
            strokeDashoffset={440 - (440 * progress) / 100}
            className="text-[#E53935] transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-[#E53935]">{progress}%</span>
        </div>
      </div>
      <div className="text-center space-y-4 w-full">
        <h2 className="text-xl font-bold text-gray-900">
          <HighlightText text={headline} />
        </h2>
        <div className="space-y-3">
          {step.steps.map((s: any, idx: number) => (
            <div key={idx} className="flex items-center space-x-3 text-sm">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${idx <= currentStepIdx ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                {idx < currentStepIdx ? <Check className="w-4 h-4" /> : idx === currentStepIdx ? '●' : ''}
              </div>
              <span className={idx === currentStepIdx ? 'font-bold text-gray-900' : 'text-gray-500'}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const QuestionBodyInteractive: React.FC<StepProps> = ({ step, onNext }) => {
  const [selected, setSelected] = React.useState<string[]>([]);
  
  function togArea(v: string) {
    setSelected(prev => {
      if (prev.includes(v)) {
        return prev.filter(item => item !== v);
      } else {
        return [...prev, v];
      }
    });
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900"><HighlightText text={step.question} /></h2>
        <p className="text-sm text-gray-500"><HighlightText text={step.subtext} /></p>
      </div>
      <div 
        id="body-wrap"
        style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '320px', margin: '0 auto' }}
        className="bg-gray-100 rounded-[12px] overflow-hidden flex items-center justify-center"
      >
        <img 
          src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/CORPO%20TODO.png" 
          alt="Body" 
          className="w-full h-auto block object-contain rounded-[12px]" 
          referrerPolicy="no-referrer"
          data-img-id="antes_depois_cartoon"
        />
        
        {/* Marcadores Dinâmicos baseados no estado 'selected' */}
        <div className="absolute inset-0 pointer-events-none">
          {selected.map(v => {
            const pos = MARCADORES_POS[v];
            if (!pos) return null;
            return (
              <div 
                key={`mc_${v}`}
                className="marcador"
                style={{
                  position: 'absolute',
                  top: pos.top,
                  left: pos.left,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
              />
            );
          })}
          
          {/* Caso especial: Corpo Todo */}
          {selected.includes('corpo_todo') && Object.entries(MARCADORES_POS).map(([key, pos]) => {
            if (key === 'corpo_todo' || !pos) return null;
            return (
              <div 
                key={`mc_all_${key}`}
                className="marcador"
                style={{
                  position: 'absolute',
                  top: pos.top,
                  left: pos.left,
                  transform: 'translate(-50%, -50%)',
                  opacity: 0.9,
                  width: '22px',
                  height: '22px',
                  zIndex: 9
                }}
              />
            );
          })}
        </div>

        <div className="absolute inset-0">
          {step.options.map((opt: any) => (
            <button
              key={opt.value}
              onClick={() => togArea(opt.value)}
              style={opt.position || {}}
              className={`absolute px-3 py-1.5 rounded-full text-[10px] font-bold transition-all shadow-md whitespace-nowrap hover:scale-105 active:scale-95 ${
                selected.includes(opt.value) 
                  ? 'bg-green-500 text-white border-green-500 scale-110 hover:scale-115 sel' 
                  : 'bg-white text-gray-800 border border-gray-200 hover:border-green-300'
              } ${!opt.position ? 'relative m-1' : ''}`}
            >
              {selected.includes(opt.value) && '✓ '}
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      
      {selected.length > 0 && (
        <div className="text-center text-green-600 text-xs font-bold animate-pulse">
          Regiões selecionadas com sucesso!
        </div>
      )}

      <button
        disabled={selected.length === 0}
        onClick={() => onNext({ [step.saves_to]: selected })}
        className="w-full bg-[#E53935] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:hover:scale-100"
      >
        Continuar
      </button>
    </motion.div>
  );
};

export const InterstitialSocialProof: React.FC<StepProps> = ({ step, onNext }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col space-y-6"
  >
    <div className="text-center space-y-2">
      <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider">
        <HighlightText text={step.headline} />
      </h2>
      <p className="text-sm text-gray-500">
        <HighlightText text={step.subtext} />
      </p>
    </div>
    
    <div className="w-full overflow-hidden">
      <img 
        src={step.article.image} 
        alt="News" 
        className="w-full h-auto object-cover" 
        referrerPolicy="no-referrer" 
        data-img-id={step.article.img_id} 
      />
    </div>

    <button
      onClick={() => onNext()}
      className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all"
    >
      Continuar
    </button>
  </motion.div>
);

export const QuestionGridMultiple: React.FC<StepProps> = ({ step, onNext }) => {
  const [selected, setSelected] = React.useState<string[]>([]);
  
  const toggle = (val: string) => {
    setSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900">{step.question}</h2>
        <p className="text-sm text-gray-500">{step.subtext}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {step.options.map((opt: any) => (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all aspect-square hover:scale-[1.02] hover:shadow-md active:scale-[0.98] ${
              selected.includes(opt.value) 
                ? 'border-[#E53935] bg-red-50' 
                : 'border-gray-100 bg-white hover:border-red-200'
            }`}
          >
            <span className="text-3xl mb-2">{opt.emoji}</span>
            <span className="text-xs font-bold text-center text-gray-800">{opt.label}</span>
          </button>
        ))}
      </div>
      <button
        disabled={selected.length === 0}
        onClick={() => onNext({ [step.saves_to]: selected })}
        className="w-full bg-[#E53935] disabled:bg-gray-300 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:hover:scale-100"
      >
        Continuar
      </button>
    </motion.div>
  );
};

export const InterstitialStats: React.FC<StepProps> = ({ step, onNext }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col space-y-8"
  >
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-bold text-gray-900">
        <HighlightText text={step.headline} />
      </h2>
      <p className="text-sm text-gray-500 leading-relaxed">
        <HighlightText text={step.subtext} />
      </p>
    </div>
    <div className="space-y-6">
      {step.stats.map((stat: any, idx: number) => (
        <div key={idx} className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-gray-700 uppercase">{stat.label}</span>
            <span className="text-xl font-black" style={{ color: stat.color }}>{stat.value}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stat.value}%` }}
              transition={{ duration: 1, delay: idx * 0.2 }}
              className="h-full rounded-full"
              style={{ backgroundColor: stat.color }}
            />
          </div>
        </div>
      ))}
    </div>
    <button
      onClick={() => onNext()}
      className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all"
    >
      Quero conquistar meus objetivos
    </button>
  </motion.div>
);

export const InterstitialMethod: React.FC<StepProps> = ({ step, state, onNext }) => {
  const headline = step.headline.replace('{nome}', state.nome || 'Amiga');
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          <HighlightText text={headline} />
        </h2>
        <p className="text-sm text-gray-500">
          <HighlightText text={step.subtext} />
        </p>
      </div>
      <div className="space-y-4">
        {step.timeline.map((item: any, idx: number) => (
          <div key={idx} className={`flex items-start p-4 rounded-2xl border ${item.highlight ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
            <div className="text-2xl mr-4 bg-white p-2 rounded-xl shadow-sm">{item.icon}</div>
            <div>
              <div className={`font-bold ${item.highlight ? 'text-green-700' : 'text-gray-900'}`}>{item.title}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onNext()}
        className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all"
      >
        Entendi! Continuar
      </button>
    </motion.div>
  );
};

export const InputNumberStepper: React.FC<StepProps> = ({ step, onNext }) => {
  const [value, setValue] = React.useState(step.default_value);
  
  const adjust = (delta: number) => {
    setValue(prev => Math.max(1, prev + delta));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900">{step.question}</h2>
        <p className="text-sm text-gray-500">{step.subtext}</p>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <div className="text-6xl font-black text-[#E53935] flex items-baseline">
          {value}
          <span className="text-xl ml-1 text-gray-400 font-bold">{step.unit}</span>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => adjust(-5)} className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">-5</button>
          <button onClick={() => adjust(-1)} className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">-</button>
          <button onClick={() => adjust(1)} className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">+</button>
          <button onClick={() => adjust(5)} className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">+5</button>
        </div>
      </div>
      <button
        onClick={() => onNext({ [step.saves_to]: value })}
        className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all"
      >
        Continuar
      </button>
    </motion.div>
  );
};

export const InterstitialGoalConfirm: React.FC<StepProps> = ({ step, state, onNext }) => {
  const headline = step.headline.replace('{nome}', state.nome || 'Amiga');
  const meta = state.peso_atual - state.peso_desejado;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col space-y-8"
    >
      <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-900">
          <HighlightText text={headline} />
        </h2>
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <div className="text-xs text-gray-500 uppercase font-bold">Atual</div>
            <div className="text-2xl font-black text-gray-900">{state.peso_atual}kg</div>
          </div>
          <ArrowRight className="w-6 h-6 text-red-400" />
          <div className="text-center">
            <div className="text-xs text-gray-500 uppercase font-bold">Meta</div>
            <div className="text-2xl font-black text-[#E53935]">{state.peso_desejado}kg</div>
          </div>
        </div>
        <div className="bg-white py-2 px-4 rounded-full inline-block text-sm font-bold text-[#E53935] shadow-sm">
          🎯 Meta: perder {meta}kg
        </div>
      </div>
      <p className="text-sm text-gray-600 text-center leading-relaxed">
        <HighlightText text={step.motivational_text} />
      </p>
      <button
        onClick={() => onNext()}
        className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all"
      >
        Ok, Vamos lá! 🚀
      </button>
    </motion.div>
  );
};

export const ResultPage: React.FC<StepProps> = ({ step, state, onNext }) => {
  const headline = step.headline.replace('{nome}', state.nome || 'Amiga');
  const imc = (state.peso_atual / Math.pow(state.altura / 100, 2)).toFixed(1);
  const meta = state.peso_atual - state.peso_desejado;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          <HighlightText text={headline} />
        </h2>
      </div>
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-500 uppercase">Seu IMC</span>
          <span className="text-4xl font-black text-[#E53935]">{imc}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
          <div className="h-full bg-blue-400" style={{ width: '20%' }} />
          <div className="h-full bg-green-400" style={{ width: '30%' }} />
          <div className="h-full bg-yellow-400" style={{ width: '20%' }} />
          <div className="h-full bg-red-400" style={{ width: '30%' }} />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center text-xs text-red-500 font-bold bg-red-50 p-2 rounded-lg">
            <Lock className="w-4 h-4 mr-2" /> Metabolismo desacelerado
          </div>
          <div className="flex items-center text-xs text-red-500 font-bold bg-red-50 p-2 rounded-lg">
            <Lock className="w-4 h-4 mr-2" /> Hormonios de saciedade desregulados
          </div>
        </div>
      </div>
      <div className="bg-green-50 border border-green-100 p-4 rounded-2xl">
        <p className="text-sm text-green-800 leading-relaxed">
          <HighlightText text="Boa noticia: seu perfil responde muito bem ao protocolo da Gelatina Mounjaro! O segredo e ativar o GLP-1." />
        </p>
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-gray-900 mb-2">Benefícios:</h3>
        <div className="ben"><span className="ben-e">🌿</span><span><HighlightText text="Receita 100% Natural" /></span></div>
        <div className="ben"><span className="ben-e">🔥</span><span><HighlightText text="Ativa o GLP-1 do seu corpo" /></span></div>
        <div className="ben"><span className="ben-e">🍓</span><span><HighlightText text="Queima de Gordura localizada" /></span></div>
        <div className="ben"><span className="ben-e">⚡</span><span><HighlightText text="Regula o seu Metabolismo" /></span></div>
        <div className="ben"><span className="ben-e">🌬️</span><span><HighlightText text="Leveza e corpo Desinchado" /></span></div>
        <div className="ben"><span className="ben-e">🧃</span><span><HighlightText text="Menos impulsos por doces" /></span></div>
        <div className="ben"><span className="ben-e">⏱️</span><span><HighlightText text="Fácil de fazer e seguir" /></span></div>
      </div>
      <div className="text-center p-6 bg-[#E53935] rounded-3xl text-white space-y-2">
        <div className="text-sm opacity-80">{state.nome}, voce pode perder entre</div>
        <div className="text-4xl font-black">{meta - 2} a {meta + 1}kg</div>
        <div className="text-sm opacity-80">em poucas semanas</div>
      </div>
      <button
        onClick={() => onNext()}
        className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all"
      >
        SIM! Quero comecar!
      </button>
    </motion.div>
  );
};

export const InterstitialHowToUse: React.FC<StepProps> = ({ step, onNext }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col space-y-8"
  >
    <div className="text-center space-y-2">
      <h2 className="text-2xl font-bold text-gray-900">
        <HighlightText text={step.headline} />
      </h2>
      <p className="text-sm text-gray-500"><HighlightText text="Simples, pratico e eficaz" /></p>
    </div>
    <div className="space-y-4">
      {step.instructions.map((item: any, idx: number) => (
        <div key={idx} className="flex items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="text-3xl mr-4">{item.emoji}</div>
          <div>
            <div className="font-bold text-gray-900"><HighlightText text={item.title} /></div>
            <div className="text-xs text-gray-500"><HighlightText text={item.subtitle} /></div>
          </div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-blue-50 p-3 rounded-xl text-center">
        <div className="text-xl">🌅</div>
        <div className="text-[10px] font-bold text-blue-800 uppercase">Manhã</div>
      </div>
      <div className="bg-yellow-50 p-3 rounded-xl text-center">
        <div className="text-xl">☀️</div>
        <div className="text-[10px] font-bold text-yellow-800 uppercase">Dia</div>
      </div>
      <div className="bg-red-50 p-3 rounded-xl text-center">
        <div className="text-xl">🌙</div>
        <div className="text-[10px] font-bold text-red-800 uppercase">Noite</div>
      </div>
    </div>
    <button
      onClick={() => onNext()}
      className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all"
    >
      Entendi! Continuar
    </button>
  </motion.div>
);

export const VSLStep: React.FC<StepProps> = ({ step, state, onNext }) => {
  const isVSL1 = step.type === 'vsl_1';
  const playerId = isVSL1
    ? '69be3871137969468e791820'
    : '69be390f237e0fc6aebdccf2';
  const timerTotal = isVSL1 ? 80 : 130;
  const headline = step.headline?.replace('{nome}', state.nome || 'Amiga');

  const [countdown, setCountdown] = React.useState(timerTotal);
  const [canContinue, setCanContinue] = React.useState(false);

  // Timer countdown
  React.useEffect(() => {
    setCountdown(timerTotal);
    setCanContinue(false);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanContinue(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerTotal]);

  // HTML completo do player Vturb em um iframe isolado
  const vtubrHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; overflow: hidden; }
        vturb-smartplayer { display: block; width: 100%; }
      </style>
    </head>
    <body>
      <vturb-smartplayer
        id="vid-${playerId}"
        style="display:block;width:100%;">
      </vturb-smartplayer>
      <script type="text/javascript">
        var s = document.createElement("script");
        s.src = "https://scripts.converteai.net/936a89ee-2ce4-4007-a60f-9d25da087ec8/players/${playerId}/v4/player.js";
        s.async = true;
        document.head.appendChild(s);
      </script>
    </body>
    </html>
  `;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Título */}
      {headline && (
        <h2 style={{
          fontSize: '18px',
          fontWeight: 800,
          textAlign: 'center',
          lineHeight: 1.3,
          color: '#111'
        }}>
          {headline}
        </h2>
      )}

      {/* Player Vturb em iframe isolado */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        borderRadius: '12px',
        overflow: 'hidden',
        aspectRatio: '9/16',
        background: '#000'
      }}>
        <iframe
          srcDoc={vtubrHTML}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>

      {/* Texto de status */}
      <p style={{
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: 700,
        color: '#6B7280',
        margin: '0'
      }}>
        {canContinue
          ? '✅ Clique para continuar!'
          : countdown < 10
            ? '🔒 Quase lá...'
            : '🔒 Assista para continuar...'
        }
      </p>

      {/* Botão — só aparece ao liberar */}
      {canContinue && (
        <button
          onClick={() => onNext()}
          style={{
            width: '100%',
            padding: '18px',
            background: '#E53935',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontFamily: 'inherit',
            fontSize: '16px',
            fontWeight: 800,
            cursor: 'pointer',
            animation: 'fadeUp 0.4s ease'
          }}
        >
          {isVSL1
            ? 'Entendi, quero continuar! 😄'
            : 'Pegar meu Plano!'
          }
        </button>
      )}

    </div>
  );
};

export const InterstitialPresell: React.FC<StepProps> = ({ step, state, onNext }) => {
  const meta = state.peso_atual - state.peso_desejado;
  const headline = step.headline.replace('{min}', `${meta - 2}`).replace('{max}', `${meta + 3}`);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center space-y-8 text-center"
    >
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl">🎯</div>
      <h2 className="text-2xl font-bold text-gray-900">
        <HighlightText text={headline} />
      </h2>
      <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
        <p className="text-sm text-red-800">
          <HighlightText text="Baseado no seu perfil, esse resultado e totalmente alcancavel com a Gelatina Mounjaro!" />
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="space-y-1">
          <div className="text-xl font-black text-[#E53935]">97%</div>
          <div className="text-[10px] text-gray-400 uppercase font-bold">Sucesso</div>
        </div>
        <div className="space-y-1">
          <div className="text-xl font-black text-green-500">30</div>
          <div className="text-[10px] text-gray-400 uppercase font-bold">Dias</div>
        </div>
        <div className="space-y-1">
          <div className="text-xl font-black text-[#E53935]">12kg</div>
          <div className="text-[10px] text-gray-400 uppercase font-bold">Máximo</div>
        </div>
      </div>
      <button
        onClick={() => onNext()}
        className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all"
      >
        Sim, quero perder peso!
      </button>
    </motion.div>
  );
};

export const InterstitialTestimonials: React.FC<StepProps> = ({ step, state, onNext }) => {
  const deps = getDepoimentos(state);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col space-y-8 pb-24"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          <HighlightText text={step.headline} />
        </h2>
        <p className="text-sm text-gray-500"><HighlightText text="Veja quem ja transformou o corpo" /></p>
      </div>
      <div className="space-y-10">
        {deps.map((d, i) => (
          <div key={i} style={{
            background:'#fff',
            border:'1.5px solid #E5E7EB',
            borderRadius:'12px',
            overflow:'hidden',
            marginBottom:'16px',
            position:'relative',
          }}>

            {/* Badge kg — DINÂMICO */}
            <div style={{
              position:'absolute',
              top:'10px',
              right:'10px',
              background:'#16A34A',
              color:'#fff',
              fontSize:'12px',
              fontWeight:'800',
              padding:'3px 10px',
              borderRadius:'99px',
              zIndex:2,
            }}>-{d.kg}kg</div>

            {/* Imagem ÚNICA antes+depois — FIXA */}
            <img
              src={d.img}
              alt={`Antes e depois ${d.nome}`}
              style={{
                width:'100%',
                display:'block',
                borderRadius:'0',
                objectFit:'cover',
              }}
              referrerPolicy="no-referrer"
            />

            {/* Informações — DINÂMICAS */}
            <div style={{padding:'12px 14px'}}>

              <div style={{
                color:'#E53935',
                fontSize:'15px',
                fontWeight:'800',
                marginBottom:'2px',
              }}>{d.nome}, {d.idade}</div>

              <div style={{
                color:'#6B7280',
                fontSize:'12px',
                fontWeight:'700',
                marginBottom:'6px',
              }}>{d.cidade}</div>

              <div style={{
                color:'#F59E0B',
                fontSize:'14px',
                marginBottom:'8px',
              }}>⭐⭐⭐⭐⭐</div>

              <div style={{
                fontSize:'14px',
                fontWeight:'700',
                fontStyle:'italic',
                color:'#1F2937',
                borderLeft:'3px solid #E53935',
                paddingLeft:'10px',
                lineHeight:'1.5',
              }}>"{d.quote}"</div>

            </div>
          </div>
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-50 flex justify-center">
        <div className="w-full max-w-[448px]">
          <button
            onClick={() => onNext()}
            className="w-full bg-[#E53935] text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-105"
          >
            Pegar meu protocolo
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const SalesPage: React.FC<StepProps> = ({ step, state }) => {
  const headline = step.headline.replace('{nome}', state.nome || 'Amiga');
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  const [timeLeft, setTimeLeft] = React.useState(600); // 10 minutes in seconds

  React.useEffect(() => {
    if (timeLeft <= 0) {
      setTimeLeft(600); // Reset timer when it expires
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const faq = [
    { q: "A Gelatina Mounjaro realmente funciona?", a: "Sim! O protocolo foi desenvolvido para ativar o hormônio GLP-1 naturalmente, o mesmo princípio de medicamentos famosos, mas de forma 100% natural e segura." },
    { q: "Quanto tempo leva para ver resultados?", a: "Muitas usuárias relatam desinchaço nos primeiros 3 a 5 dias. A perda de peso significativa ocorre entre a 2ª e 4ª semana seguindo o passo a passo." },
    { q: "É seguro? Tem efeitos colaterais?", a: "Totalmente seguro. Por ser baseado em ingredientes naturais e alimentos comuns, não possui os efeitos colaterais de medicamentos sintéticos." },
    { q: "Como vou receber o protocolo?", a: "Imediatamente após a confirmação do pagamento, você receberá um e-mail com seus dados de acesso ao nosso aplicativo exclusivo." },
    { q: "E se não funcionar para mim?", a: "Oferecemos 30 dias de garantia incondicional. Se você não ver resultados ou não gostar do método, devolvemos seu dinheiro." },
    { q: "O pagamento é seguro?", a: "Sim, utilizamos a mesma tecnologia de segurança dos grandes bancos (SSL). Seus dados estão 100% protegidos." },
    { q: "Preciso comprar ingredientes caros?", a: "Não! Todos os ingredientes são encontrados facilmente em qualquer supermercado e são muito acessíveis." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col space-y-8 pb-20"
    >
      <div className={`p-3 rounded-xl flex items-center justify-center space-x-2 text-xs font-bold transition-colors ${timeLeft < 60 ? 'bg-red-600 text-white animate-pulse' : 'bg-red-50 text-red-600'}`}>
        <span>⏰ Seu protocolo expira em: {formatTime(timeLeft)}</span>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          <HighlightText text={headline} />
        </h2>
        <p className="text-sm text-gray-500"><HighlightText text="Ele e exclusivo e gerado so uma vez, nao saia dessa pagina para nao perde-lo" /></p>
      </div>

      {/* 1. CARTOON ANTES/DEPOIS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative rounded-2xl overflow-hidden shadow-md border border-gray-100">
          <img 
            src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GORDA.png" 
            alt="Antes" 
            style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '10px' }} 
            referrerPolicy="no-referrer" 
            data-img-id="antes_depois_cartoon" 
          />
          <div className="absolute top-2 left-2 bg-gray-800/80 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            Antes 🖼️
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden shadow-md border-2 border-green-500">
          <img 
            src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/Natural.png" 
            alt="Depois" 
            style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: '10px', border: '2px solid #16A34A' }} 
            referrerPolicy="no-referrer" 
            data-img-id="antes_depois_cartoon" 
          />
          <div className="absolute top-2 left-2 bg-[#16A34A] text-white text-[10px] font-bold px-2 py-1 rounded-full">
            Depois ⭐
          </div>
        </div>
      </div>

      {/* 2. TIMELINE 4 SEMANAS */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-gray-900 text-center leading-tight">
          <HighlightText text={`${state.nome || 'Amiga'}, seguindo o protocolo certinho, veja o que vai acontecer:`} />
        </h3>
        <div className="space-y-4">
          {[
            { s: "SEMANA 1 🌿", d: "Desinche e primeiros resultados", h: false },
            { s: "SEMANA 2 🔥", d: "Perda de até 3 kg", h: false },
            { s: "SEMANA 3 ⚡", d: "Perda de 5 a 7 kg", h: false },
            { s: "SEMANA 4 🏆", d: "Perda de 9 a 12 kg", h: true }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase">{item.s}</span>
                <span className="text-sm font-bold text-gray-800">{item.d}</span>
              </div>
              {item.h && <span className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-md">META</span>}
            </div>
          ))}
        </div>
        <div className="text-center pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-[#E53935]">Resultado esperado: 9 a 12 kg em 30 dias</span>
        </div>
      </div>

      <div className="bg-white border-2 border-[#E53935] rounded-3xl overflow-hidden shadow-xl">
        <div className="bg-[#E53935] text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
          Seu Plano Exclusivo
        </div>
        <div className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <div className="text-lg font-bold text-gray-800"><HighlightText text="1 Mês de Tratamento ⭐" /></div>
            <div className="text-xs text-gray-400 uppercase font-bold"><HighlightText text="ACESSO VITALÍCIO" /></div>
          </div>
          <img 
            src="https://xsomezyqnzetfxulmvlp.supabase.co/storage/v1/object/public/Fotos%20GM/GM.png" 
            alt="Product" 
            style={{ width: '100%', maxWidth: '280px', height: 'auto', display: 'block', margin: '12px auto', objectFit: 'contain' }} 
            referrerPolicy="no-referrer" 
            data-img-id="produto_geleia" 
          />
          
          {/* 3. LISTA COMPLETA DE INCLUDES */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600"><span className="inc-i">✅</span><HighlightText text="Receita completa da Gelatina Mounjaro" /></div>
            <div className="flex items-center text-sm text-gray-600"><span className="inc-i">✅</span><HighlightText text="Protocolo de 30 dias passo a passo" /></div>
            <div className="flex items-center text-sm text-gray-600"><span className="inc-i">✅</span><HighlightText text="Acesso ao Aplicativo Exclusivo" /></div>
            <div className="flex items-center text-sm text-gray-600"><span className="inc-i">✅</span><HighlightText text="Lista completa dos ingredientes" /></div>
            <div className="flex items-center text-sm text-gray-600"><span className="inc-i">✅</span><HighlightText text="Dicas para acelerar resultados" /></div>
            <div className="flex items-center text-sm text-gray-600"><span className="inc-i">✅</span><HighlightText text="Acesso vitalício ao app" /></div>
          </div>

          {/* 4. SEÇÃO DE BÔNUS */}
          <div className="bg-[#FEF9C3] p-4 rounded-2xl space-y-3 border border-yellow-200">
            <div className="text-xs font-bold text-yellow-900 flex items-center"><span className="inc-i">🎁</span><HighlightText text="BÔNUS: Dietas completas" /></div>
            <div className="text-xs font-bold text-yellow-900 flex items-center"><span className="inc-i">🎁</span><HighlightText text="BÔNUS: Receitas doces saudáveis" /></div>
            <div className="text-xs font-bold text-yellow-900 flex items-center"><span className="inc-i">🎁</span><HighlightText text="BÔNUS: Aulas em vídeo de pilates na parede" /></div>
          </div>

          <div className="pt-6 border-t border-gray-100 text-center space-y-2">
            <div className="text-sm text-gray-400 line-through">{step.original_price}</div>
            <div className="text-xs text-gray-500 uppercase font-bold">Por apenas</div>
            <div className="text-5xl font-black text-green-600">{step.price}</div>
            <div className="text-sm text-gray-500">Ou 6x de R$ 4,50</div>
          </div>
          <button 
            onClick={() => window.open('https://checkout.payt.com.br/f1615299364060ff3fce5eb0b0ba10ad', '_blank')}
            className="w-full bg-[#16A34A] hover:bg-green-700 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 text-xl"
          >
            QUERO COMEÇAR 🤩
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-3xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-white">30</div>
          <h4 className="font-bold text-gray-900"><HighlightText text="Garantia de Reembolso" /></h4>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          <HighlightText text="Confiamos tanto na formula que oferecemos 30 dias corridos. Se voce nao gostar, reembolsaremos cada centavo. RISCO ZERO PARA VOCE!" />
        </p>
      </div>

      {/* 5. SEGUNDO BOTÃO CTA */}
      <button 
        onClick={() => window.open('https://checkout.payt.com.br/f1615299364060ff3fce5eb0b0ba10ad', '_blank')}
        className="w-full bg-[#16A34A] hover:bg-green-700 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 text-xl"
      >
        QUERO COMEÇAR 🤩
      </button>

      {/* 6. FAQ ACCORDION */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 text-center"><HighlightText text="Perguntas Frequentes ❓" /></h3>
        <div className="space-y-2">
          {faq.map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 bg-white text-left"
              >
                <span className="text-sm font-bold text-gray-800"><HighlightText text={item.q} /></span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-gray-50 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                      <HighlightText text={item.a} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* 7. FOOTER FINAL */}
      <div className="pt-8 border-t border-gray-100 space-y-6 text-center">
        <div className="flex justify-center items-center space-x-4">
          <div className="flex flex-col items-center space-y-1">
            <Lock className="w-5 h-5 text-gray-400" />
            <span className="text-[8px] font-bold text-gray-400 uppercase">Compra Segura</span>
          </div>
          <div className="h-8 w-px bg-gray-100" />
          <div className="flex flex-col items-center space-y-1">
            <ShieldCheck className="w-5 h-5 text-gray-400" />
            <span className="text-[8px] font-bold text-gray-400 uppercase">Dados Protegidos</span>
          </div>
          <div className="h-8 w-px bg-gray-100" />
          <div className="flex flex-col items-center space-y-1">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <span className="text-[8px] font-bold text-gray-400 uppercase">Pix ou Cartão</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 px-8">
          <HighlightText text="Compra 100% segura. Seus dados estão protegidos por criptografia SSL." />
        </p>
      </div>
    </motion.div>
  );
};
