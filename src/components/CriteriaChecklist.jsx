import { useState } from 'react';
import { CATEGORIAS } from '../utils/constants';
import CriteriaItem from './CriteriaItem';
import { Database, FileText, Image, Star, TrendingUp, Shield, ChevronDown, ChevronUp } from 'lucide-react';

const iconMap = { Database, FileText, Image, Star, TrendingUp, Shield };

export default function CriteriaChecklist({ criterios }) {
  const categorias = Object.entries(CATEGORIAS);
  const [collapsed, setCollapsed] = useState({});

  function toggle(key) {
    setCollapsed(p => ({ ...p, [key]: !p[key] }));
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-gray-900">Diagnostico por Criterio</h3>
      {categorias.map(([key, cat]) => {
        const items = criterios.filter(c => c.categoria === key && c.auto);
        if (items.length === 0) return null;
        const total = items.reduce((s, c) => s + c.peso, 0);
        const obtidos = items.reduce((s, c) => s + c.pontos, 0);
        const Icon = iconMap[cat.icone] || Database;
        const isCollapsed = collapsed[key];

        return (
          <div key={key} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <button onClick={() => toggle(key)}
              className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <Icon size={18} className="text-brand shrink-0" />
              <span className="font-semibold text-gray-900 flex-1 text-left">{cat.nome}</span>
              <span className="text-sm font-medium text-gray">{obtidos}/{total}</span>
              {isCollapsed ? <ChevronDown size={16} className="text-gray" /> : <ChevronUp size={16} className="text-gray" />}
            </button>
            {!isCollapsed && (
              <div className="flex flex-col gap-1.5 px-3 pb-3">
                {items.map(c => <CriteriaItem key={c.id} criterio={c} />)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
