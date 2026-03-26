import React, { useState } from 'react';
import { QuizState, Step } from './types';
import { QUIZ_STEPS } from './constants';
import { 
  IntroStep, 
  QuestionSingle, 
  QuestionImageGrid, 
  InputText, 
  LoadingAnimated,
  LoadingProtocol,
  QuestionBodyInteractive,
  InterstitialSocialProof,
  QuestionGridMultiple,
  QuestionListMultiple,
  InterstitialStats,
  InterstitialMethod,
  InputNumberStepper,
  InterstitialGoalConfirm,
  ResultPage,
  InterstitialHowToUse,
  InterstitialSimple,
  VSLStep,
  InterstitialPresell,
  InterstitialTestimonials,
  SalesPage
} from './components/Steps';
import { ChevronLeft } from 'lucide-react';

const INITIAL_STATE: QuizState = {
  nome: '',
  faixa_etaria: '',
  tipo_corpo: '',
  areas_gordura: [],
  situacao_emocional: '',
  verdade_espelho: '',
  inimigo_emagrecimento: '',
  vitorias_urgentes: [],
  peso_atual: 75,
  altura: 165,
  peso_desejado: 65,
  gestacoes: '',
  rotina_diaria: [],
  horas_sono: '',
  consumo_agua: '',
  corpo_sonho: '',
  compromisso: '',
  kg_perder: 10
};

const FLOW = [2, 11, 3, 4, 6, 7, 8, 9, 5, 10, 29, 13, 14, 15, 19, 20, 21, 25, 22, 27, 32];

export default function App() {
  const [currentFlowIdx, setCurrentFlowIdx] = useState(0);
  const [state, setState] = useState<QuizState>(INITIAL_STATE);
  const [history, setHistory] = useState<number[]>([]);

  const currentStepId = FLOW[currentFlowIdx];
  const baseStep = QUIZ_STEPS.find(s => s.id === currentStepId) || QUIZ_STEPS[0];
  
  // Lógica condicional para Etapas 8 e 9
  const getActiveStep = () => {
    if (baseStep.id === 8) {
      const variant = state.situacao_emocional;
      if (variant === "vergonha") return QUIZ_STEPS.find(s => s.id === "8A") || baseStep;
      if (variant === "saude") return QUIZ_STEPS.find(s => s.id === "8B") || baseStep;
      if (variant === "relac") return QUIZ_STEPS.find(s => s.id === "8C") || baseStep;
      if (variant === "rotina") return QUIZ_STEPS.find(s => s.id === "8D") || baseStep;
    } else if (baseStep.id === 9) {
      const variant = state.situacao_emocional;
      if (variant === "vergonha") return QUIZ_STEPS.find(s => s.id === "9A") || baseStep;
      if (variant === "saude") return QUIZ_STEPS.find(s => s.id === "9B") || baseStep;
      if (variant === "relac") return QUIZ_STEPS.find(s => s.id === "9C") || baseStep;
      if (variant === "rotina") return QUIZ_STEPS.find(s => s.id === "9D") || baseStep;
    }
    return baseStep;
  };

  const currentStep = getActiveStep();

  const handleNext = (data?: Partial<QuizState>) => {
    // Eventos de rastreamento Clarity
    const eventMap: Record<number | string, string> = {
      6:  'nome_capturado',
      7:  'dor_selecionada',
      13: 'peso_definido',
      25: 'loading_completo',
      22: 'resultado_visto',
      27: 'corpo_sonho_selecionado',
      32: 'pagina_vendas_vista',
    };

    const currentId = FLOW[currentFlowIdx];
    if (eventMap[currentId] && (window as any).clarity) {
      (window as any).clarity("event", eventMap[currentId]);
    }

    if (data) {
      setState(prev => ({ ...prev, ...data }));
    }
    setHistory(prev => [...prev, currentFlowIdx]);
    setCurrentFlowIdx(prev => Math.min(prev + 1, FLOW.length - 1));
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prevIdx = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentFlowIdx(prevIdx);
    }
  };

  const renderStep = () => {
    const props = { step: currentStep, state, onNext: handleNext, onBack: handleBack };
    
    switch (currentStep.type) {
      case 'intro': return <IntroStep {...props} />;
      case 'question_single': return <QuestionSingle {...props} />;
      case 'question_image_grid': return <QuestionImageGrid {...props} />;
      case 'question_body_interactive': return <QuestionBodyInteractive {...props} />;
      case 'interstitial_social_proof': return <InterstitialSocialProof {...props} />;
      case 'input_text': return <InputText {...props} />;
      case 'question_grid_multiple': return <QuestionGridMultiple {...props} />;
      case 'question_list_multiple': return <QuestionListMultiple {...props} />;
      case 'interstitial_stats': return <InterstitialStats {...props} />;
      case 'interstitial_method': return <InterstitialMethod {...props} />;
      case 'input_number_stepper': return <InputNumberStepper {...props} />;
      case 'interstitial_goal_confirm': return <InterstitialGoalConfirm {...props} />;
      case 'result_page': return <ResultPage {...props} />;
      case 'interstitial_how_to_use': return <InterstitialHowToUse {...props} />;
      case 'interstitial_simple': return <InterstitialSimple {...props} />;
      case 'loading_animated': return <LoadingAnimated {...props} />;
      case 'loading_protocol': return <LoadingProtocol {...props} />;
      case 'vsl_1': 
      case 'vsl_2': return <VSLStep {...props} />;
      case 'interstitial_presell': return <InterstitialPresell {...props} />;
      case 'interstitial_testimonials': return <InterstitialTestimonials {...props} />;
      case 'sales_page': return <SalesPage {...props} />;
      default: return (
        <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-400">Em desenvolvimento: {currentStep.type}</h2>
          <button onClick={() => handleNext()} className="bg-[#E53935] text-white px-6 py-2 rounded-lg">Pular</button>
        </div>
      );
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center font-sans">
      <div className="w-full max-w-[480px] bg-white min-h-screen shadow-xl flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
          {currentStep.show_back_button && (
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <div className="flex-1 flex justify-center">
             <div className="h-2 w-full max-w-[200px] bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full transition-[width] duration-300 ease-out"
                  style={{ width: `${currentStep.progress_percent || 0}%`, background: currentStep.progress_color || '#E53935' }}
                />
             </div>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div key={currentStep.id}>
            {renderStep()}
          </div>
        </main>

        {/* Footer info */}
        <footer className="p-4 text-center text-[10px] text-gray-400 border-t border-gray-50">
          © 2026 Gelatina Mounjaro • Todos os direitos reservados
        </footer>
      </div>
    </div>
  );
}
