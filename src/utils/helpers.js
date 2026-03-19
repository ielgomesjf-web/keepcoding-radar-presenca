export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getStatusFromPercentual(pontos, peso) {
  const pct = peso > 0 ? pontos / peso : 0;
  if (pct >= 0.8) return 'verde';
  if (pct >= 0.4) return 'amarelo';
  return 'vermelho';
}

export function getStatusIcon(status) {
  if (status === 'verde') return { emoji: '\u2705', label: 'OK' };
  if (status === 'amarelo') return { emoji: '\u26A0\uFE0F', label: 'Atenção' };
  return { emoji: '\u274C', label: 'Falha' };
}

export function getImpactoLabel(peso) {
  if (peso >= 5) return 'Alto';
  if (peso >= 3) return 'Medio';
  return 'Baixo';
}

export function formatDate() {
  return new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}
