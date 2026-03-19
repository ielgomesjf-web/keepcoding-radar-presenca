import { criterios } from './criteria';
import { getNivel } from '../utils/constants';
import { getStatusFromPercentual } from '../utils/helpers';

const PESO_TOTAL = criterios.reduce((sum, c) => sum + c.peso, 0); // 77

export function calcularDiagnostico(placeData, manualAnswers = {}) {
  let pontosObtidos = 0;
  const resultados = [];

  for (const c of criterios) {
    let pontos = 0;
    let msg = '';

    if (c.auto) {
      const resultado = c.avaliar(placeData);
      pontos = resultado.pontos;
      msg = resultado.msg;
    } else if (manualAnswers[c.id] !== undefined) {
      pontos = manualAnswers[c.id];
      const opcao = c.opcoes?.find(o => o.valor === pontos);
      msg = opcao ? opcao.label : c.descricao;
    } else {
      pontos = 0;
      msg = 'Pendente — preencha a verificacao manual.';
    }

    const status = getStatusFromPercentual(pontos, c.peso);
    pontosObtidos += pontos;

    resultados.push({
      id: c.id,
      nome: c.nome,
      categoria: c.categoria,
      peso: c.peso,
      pontos,
      status,
      mensagem: msg,
      auto: c.auto,
      descricao: c.descricao,
      opcoes: c.opcoes || null,
    });
  }

  const score = Math.round((pontosObtidos / PESO_TOTAL) * 100);
  const nivel = getNivel(score);

  const acoesPriorizadas = resultados
    .filter(c => c.status !== 'verde')
    .sort((a, b) => b.peso - a.peso)
    .map(c => ({
      id: c.id,
      nome: c.nome,
      acao: c.mensagem,
      impacto: c.peso,
      status: c.status,
    }));

  return {
    score,
    nivel,
    criterios: resultados,
    acoesPriorizadas,
    pesoTotal: PESO_TOTAL,
    pontosObtidos,
  };
}
