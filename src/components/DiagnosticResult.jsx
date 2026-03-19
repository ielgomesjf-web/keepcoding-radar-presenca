import { useState, useRef, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { calcularDiagnostico } from '../engine/scoringEngine';
import BusinessHeader from './BusinessHeader';
import ScoreGauge from './ScoreGauge';
import CriteriaChecklist from './CriteriaChecklist';
import ManualChecklist from './ManualChecklist';
import ActionPlan from './ActionPlan';
import PdfReport from './PdfReport';

export default function DiagnosticResult({ placeData, onReset }) {
  const [manualAnswers, setManualAnswers] = useState({});
  const gaugeRef = useRef(null);
  const diagnostico = calcularDiagnostico(placeData, manualAnswers);

  const handleAnswer = useCallback((id, valor) => {
    setManualAnswers(prev => ({ ...prev, [id]: valor }));
  }, []);

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <button onClick={onReset}
        className="flex items-center gap-1.5 text-sm text-brand hover:underline cursor-pointer self-start">
        <ArrowLeft size={16} /> Nova busca
      </button>

      <BusinessHeader data={placeData} />

      <div className="bg-card rounded-xl border border-border shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
        <div ref={gaugeRef}>
          <ScoreGauge score={diagnostico.score} nivel={diagnostico.nivel} />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-2xl font-bold text-gray-900">{diagnostico.pontosObtidos} <span className="text-base font-normal text-gray">de {diagnostico.pesoTotal} pontos</span></p>
          <p className="text-sm text-gray mt-1">
            {diagnostico.score >= 86 ? 'Perfil excelente! Continue mantendo.' :
             diagnostico.score >= 71 ? 'Bom perfil, mas ainda ha o que melhorar.' :
             diagnostico.score >= 51 ? 'Perfil regular. Varias melhorias pendentes.' :
             diagnostico.score >= 31 ? 'Perfil fraco. Acoes urgentes necessarias.' :
             'Perfil critico. Risco alto de perda de visibilidade.'}
          </p>
          <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start text-xs text-gray">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-success" /> {diagnostico.criterios.filter(c => c.status === 'verde').length} OK</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-warning" /> {diagnostico.criterios.filter(c => c.status === 'amarelo').length} Atencao</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-danger" /> {diagnostico.criterios.filter(c => c.status === 'vermelho').length} Falha</span>
          </div>
        </div>
      </div>

      <CriteriaChecklist criterios={diagnostico.criterios} />

      <ManualChecklist criterios={diagnostico.criterios} answers={manualAnswers} onAnswer={handleAnswer} />

      <ActionPlan acoes={diagnostico.acoesPriorizadas} />

      <PdfReport diagnostico={diagnostico} placeData={placeData} gaugeRef={gaugeRef} />
    </div>
  );
}
