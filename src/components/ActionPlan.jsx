import { Target } from 'lucide-react';
import { getImpactoLabel } from '../utils/helpers';

export default function ActionPlan({ acoes }) {
  if (acoes.length === 0) {
    return (
      <div className="bg-success/5 border border-success/20 rounded-xl p-5 text-center">
        <p className="text-success font-semibold">Parabens! Nenhuma acao pendente.</p>
        <p className="text-sm text-gray mt-1">Seu perfil esta otimizado.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target size={20} className="text-brand" />
        <h3 className="text-lg font-bold text-gray-900">Plano de Acao</h3>
      </div>
      <p className="text-sm text-gray mb-4">O que corrigir primeiro — ordenado por impacto.</p>
      <div className="flex flex-col gap-2">
        {acoes.map((a, i) => {
          const impacto = getImpactoLabel(a.impacto);
          const dotColor = a.status === 'vermelho' ? 'bg-danger' : 'bg-warning';
          const impactoBadge = impacto === 'Alto' ? 'bg-danger/10 text-danger' :
            impacto === 'Medio' ? 'bg-warning/10 text-orange' : 'bg-gray-100 text-gray';

          return (
            <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2 shrink-0 mt-0.5">
                <span className="text-xs font-bold text-gray w-5">{i + 1}.</span>
                <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{a.nome}</p>
                <p className="text-xs text-gray mt-0.5">{a.acao}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${impactoBadge}`}>
                {impacto}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
