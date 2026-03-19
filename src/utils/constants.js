export const NIVEIS = {
  CRITICO: { min: 0, max: 30, label: 'CRITICO', cor: '#EA4335', bg: 'bg-danger/10', text: 'text-danger' },
  FRACO: { min: 31, max: 50, label: 'FRACO', cor: '#E65100', bg: 'bg-orange/10', text: 'text-orange' },
  REGULAR: { min: 51, max: 70, label: 'REGULAR', cor: '#FBBC04', bg: 'bg-warning/10', text: 'text-warning' },
  BOM: { min: 71, max: 85, label: 'BOM', cor: '#43A047', bg: 'bg-success-light/10', text: 'text-success-light' },
  EXCELENTE: { min: 86, max: 100, label: 'EXCELENTE', cor: '#34A853', bg: 'bg-success/10', text: 'text-success' },
};

export const CATEGORIAS = {
  dados: { nome: 'Dados Basicos', icone: 'Database' },
  conteudo: { nome: 'Conteudo', icone: 'FileText' },
  midias: { nome: 'Midias Visuais', icone: 'Image' },
  avaliacoes: { nome: 'Avaliacoes', icone: 'Star' },
  engajamento: { nome: 'Engajamento', icone: 'TrendingUp' },
  consistencia: { nome: 'Consistencia', icone: 'Shield' },
};

export const CATEGORIAS_GENERICAS = [
  'establishment', 'point_of_interest', 'store', 'food',
  'health', 'finance', 'place_of_worship', 'local_government_office',
];

export function getNivel(score) {
  if (score <= 30) return NIVEIS.CRITICO;
  if (score <= 50) return NIVEIS.FRACO;
  if (score <= 70) return NIVEIS.REGULAR;
  if (score <= 85) return NIVEIS.BOM;
  return NIVEIS.EXCELENTE;
}
