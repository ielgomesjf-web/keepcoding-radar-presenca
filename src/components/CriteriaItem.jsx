import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const statusConfig = {
  verde: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  amarelo: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  vermelho: { icon: XCircle, color: 'text-danger', bg: 'bg-danger/10' },
};

export default function CriteriaItem({ criterio }) {
  const [open, setOpen] = useState(false);
  const { icon: StatusIcon, color, bg } = statusConfig[criterio.status];

  return (
    <div className={`border border-border rounded-lg overflow-hidden transition-colors ${open ? 'bg-gray-50' : 'bg-card'}`}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer">
        <div className={`w-7 h-7 rounded-full ${bg} flex items-center justify-center shrink-0`}>
          <StatusIcon size={15} className={color} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            <span className="text-xs text-gray mr-1.5">{criterio.id}</span>
            {criterio.nome}
          </p>
        </div>
        <span className="text-sm font-semibold text-gray-600 shrink-0">{criterio.pontos}/{criterio.peso}</span>
        {open ? <ChevronUp size={16} className="text-gray" /> : <ChevronDown size={16} className="text-gray" />}
      </button>
      {open && (
        <div className="px-4 pb-3 pt-0 text-sm text-gray border-t border-border/50 animate-fade-in">
          <p className="mt-2">{criterio.mensagem}</p>
          {criterio.descricao && <p className="mt-1 text-xs text-gray/70 italic">{criterio.descricao}</p>}
        </div>
      )}
    </div>
  );
}
