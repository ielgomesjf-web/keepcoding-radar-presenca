import { ClipboardCheck } from 'lucide-react';

export default function ManualChecklist({ criterios, answers, onAnswer }) {
  const manuais = criterios.filter(c => !c.auto);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardCheck size={20} className="text-brand" />
        <h3 className="text-lg font-bold text-gray-900">Verificacao Manual</h3>
      </div>
      <p className="text-sm text-gray mb-4">Estes itens precisam da sua conferencia para um diagnostico completo.</p>
      <div className="flex flex-col gap-4">
        {manuais.map(c => (
          <div key={c.id} className="border border-border rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 mb-1">
              <span className="text-xs text-gray mr-1.5">{c.id}</span>
              {c.nome}
            </p>
            <p className="text-xs text-gray mb-3">{c.descricao}</p>
            <div className="flex flex-col gap-1.5">
              {c.opcoes.map(op => (
                <label key={op.valor} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${
                  answers[c.id] === op.valor
                    ? 'border-brand bg-brand/5 text-brand font-medium'
                    : 'border-border hover:border-gray-300 text-gray-700'
                }`}>
                  <input type="radio" name={c.id} value={op.valor}
                    checked={answers[c.id] === op.valor}
                    onChange={() => onAnswer(c.id, op.valor)}
                    className="accent-brand w-4 h-4" />
                  {op.label}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
