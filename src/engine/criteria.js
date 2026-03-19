import { CATEGORIAS_GENERICAS } from '../utils/constants';

const KEYWORD_STUFFING_REGEX = /\||\s-\s\w+|\b(dentista|advogado|medico|clinica|loja|restaurante|bar|salao|oficina|academia)\b.*\b(dentista|advogado|medico|clinica|loja|restaurante|bar|salao|oficina|academia)\b/i;
const CITY_IN_NAME_REGEX = /\b(sp|rj|mg|ba|pr|rs|sc|go|pe|ce|ma|pa|am|mt|ms|df|es|pb|rn|al|pi|se|ro|to|ac|ap|rr)\b/i;

function countKeywordStuffingSignals(name) {
  let signals = 0;
  if (name.includes('|')) signals++;
  if (/\s[-–]\s\w{3,}/.test(name)) signals++;
  if (CITY_IN_NAME_REGEX.test(name)) signals++;
  if (KEYWORD_STUFFING_REGEX.test(name)) signals++;
  if ((name.match(/,/g) || []).length >= 2) signals++;
  return signals;
}

export const criterios = [
  // === DADOS BASICOS ===
  {
    id: 'E01', nome: 'Nome do negocio', peso: 5, categoria: 'dados', auto: true,
    descricao: 'Nome deve ser identico a fachada, sem keywords artificiais.',
    campo_api: 'displayName',
    avaliar: (d) => {
      const name = d.displayName?.text || '';
      if (!name) return { pontos: 0, msg: 'Nome do negocio nao encontrado.' };
      const signals = countKeywordStuffingSignals(name);
      if (signals === 0) return { pontos: 5, msg: 'Nome limpo, sem keyword stuffing.' };
      if (signals === 1) return { pontos: 2, msg: 'O nome contem sinais de keyword stuffing. Risco de suspensao. Use apenas o nome real da empresa.' };
      return { pontos: 0, msg: 'O nome contem palavras-chave artificiais. Risco alto de suspensao. Use apenas o nome real da empresa.' };
    },
  },
  {
    id: 'E02', nome: 'Endereco verificado', peso: 5, categoria: 'dados', auto: true,
    descricao: 'Perfil deve ter endereco verificado e status operacional.',
    campo_api: 'formattedAddress',
    avaliar: (d) => {
      const addr = d.formattedAddress;
      const status = d.businessStatus;
      if (addr && status === 'OPERATIONAL') return { pontos: 5, msg: 'Endereco verificado e perfil operacional.' };
      if (addr) return { pontos: 2, msg: 'Endereco presente mas perfil nao esta como operacional.' };
      return { pontos: 0, msg: 'Endereco nao verificado ou perfil nao operacional.' };
    },
  },
  {
    id: 'E03', nome: 'Categoria principal especifica', peso: 5, categoria: 'dados', auto: true,
    descricao: 'A categoria principal deve ser especifica, nao generica.',
    campo_api: 'primaryType',
    avaliar: (d) => {
      const pt = d.primaryType;
      if (!pt) return { pontos: 0, msg: 'Categoria principal nao definida.' };
      if (CATEGORIAS_GENERICAS.includes(pt)) return { pontos: 1, msg: 'Categoria principal muito generica. Use uma categoria mais especifica para seu negocio.' };
      return { pontos: 5, msg: `Categoria principal especifica: ${d.primaryTypeDisplayName?.text || pt}.` };
    },
  },
  {
    id: 'E04', nome: 'Categorias secundarias', peso: 3, categoria: 'dados', auto: true,
    descricao: 'Adicionar categorias secundarias amplia visibilidade.',
    campo_api: 'types',
    avaliar: (d) => {
      const types = (d.types || []).filter(t => !['establishment', 'point_of_interest'].includes(t));
      if (types.length >= 3) return { pontos: 3, msg: `${types.length} categorias relevantes encontradas.` };
      if (types.length === 2) return { pontos: 2, msg: 'Apenas 2 categorias. Adicione mais para aparecer em mais buscas.' };
      if (types.length === 1) return { pontos: 1, msg: 'Apenas a categoria principal. Adicione categorias secundarias.' };
      return { pontos: 0, msg: 'Sem categorias secundarias. Adicione para aparecer em mais buscas relevantes.' };
    },
  },
  {
    id: 'E05', nome: 'Telefone presente', peso: 4, categoria: 'dados', auto: true,
    descricao: 'Telefone permite contato direto pelo perfil.',
    campo_api: 'nationalPhoneNumber',
    avaliar: (d) => {
      if (d.nationalPhoneNumber || d.internationalPhoneNumber) return { pontos: 4, msg: 'Telefone cadastrado.' };
      return { pontos: 0, msg: 'Telefone nao cadastrado. Clientes nao conseguem ligar diretamente.' };
    },
  },
  {
    id: 'E06', nome: 'Website com SSL', peso: 3, categoria: 'dados', auto: true,
    descricao: 'Website com HTTPS transmite seguranca.',
    campo_api: 'websiteUri',
    avaliar: (d) => {
      const uri = d.websiteUri;
      if (!uri) return { pontos: 0, msg: 'Sem website. Perde 31% dos cliques potenciais.' };
      if (uri.startsWith('https://')) return { pontos: 3, msg: 'Website com SSL ativo.' };
      return { pontos: 1, msg: 'Website sem SSL (https). Navegadores mostram aviso de seguranca.' };
    },
  },
  {
    id: 'E07', nome: 'Horarios de funcionamento', peso: 4, categoria: 'dados', auto: true,
    descricao: 'Horarios completos ajudam na decisao do cliente.',
    campo_api: 'regularOpeningHours',
    avaliar: (d) => {
      const periods = d.regularOpeningHours?.periods;
      if (!periods || periods.length === 0) return { pontos: 0, msg: 'Horarios incompletos. Cliente nao sabe quando voce esta aberto.' };
      if (periods.length >= 5) return { pontos: 4, msg: `Horarios configurados para ${periods.length} periodos.` };
      return { pontos: 2, msg: `Apenas ${periods.length} dias com horario. Complete todos os dias.` };
    },
  },

  // === CONTEUDO ===
  {
    id: 'E08', nome: 'Descricao do negocio', peso: 4, categoria: 'conteudo', auto: true,
    descricao: 'Descricao com ate 750 caracteres sobre seus servicos.',
    campo_api: 'editorialSummary',
    avaliar: (d) => {
      const text = d.editorialSummary?.text;
      if (!text) return { pontos: 0, msg: 'Descricao vazia. Preencha com ate 750 caracteres descrevendo seus servicos.' };
      if (text.length >= 100) return { pontos: 4, msg: `Descricao com ${text.length} caracteres.` };
      if (text.length >= 50) return { pontos: 2, msg: `Descricao curta (${text.length} chars). Expanda para pelo menos 100 caracteres.` };
      return { pontos: 1, msg: `Descricao muito curta (${text.length} chars). Expanda significativamente.` };
    },
  },

  // === MIDIAS VISUAIS ===
  {
    id: 'E09', nome: 'Quantidade de fotos', peso: 5, categoria: 'midias', auto: true,
    descricao: 'Perfis com 10+ fotos recebem 70% mais engajamento.',
    campo_api: 'photos',
    avaliar: (d) => {
      const count = d.photos?.length || 0;
      if (count >= 10) return { pontos: 5, msg: `${count} fotos encontradas. Otimo!` };
      if (count >= 5) return { pontos: 3, msg: `${count} fotos. Adicione mais para chegar a 10+.` };
      if (count >= 1) return { pontos: 1, msg: `Apenas ${count} foto(s). Perfis com 10+ fotos recebem 70% mais engajamento.` };
      return { pontos: 0, msg: 'Nenhuma foto. Adicione fotos do negocio, equipe e servicos.' };
    },
  },
  {
    id: 'E10', nome: 'Qualidade das fotos', peso: 3, categoria: 'midias', auto: true,
    descricao: 'Fotos de alta resolucao transmitem profissionalismo.',
    campo_api: 'photos',
    avaliar: (d) => {
      const photo = d.photos?.[0];
      if (!photo) return { pontos: 0, msg: 'Sem fotos para avaliar qualidade.' };
      const w = photo.widthPx || 0;
      const h = photo.heightPx || 0;
      if (w >= 800 && h >= 600) return { pontos: 3, msg: `Foto principal com boa resolucao (${w}x${h}).` };
      if (w >= 400 && h >= 300) return { pontos: 2, msg: `Resolucao media (${w}x${h}). Use imagens maiores.` };
      return { pontos: 1, msg: `Fotos com resolucao baixa (${w}x${h}). Use imagens de alta qualidade.` };
    },
  },
  {
    id: 'E11', nome: 'Fotos recentes', peso: 3, categoria: 'midias', auto: true,
    descricao: 'Fotos atualizadas sinalizam atividade ao Google.',
    campo_api: 'photos',
    avaliar: (d) => {
      const count = d.photos?.length || 0;
      if (count >= 10) return { pontos: 3, msg: 'Volume de fotos sugere atualizacao recente.' };
      if (count >= 5) return { pontos: 2, msg: 'Bom volume. Mantenha fotos atualizadas a cada 90 dias.' };
      if (count >= 1) return { pontos: 1, msg: 'Poucas fotos. Adicione novas regularmente.' };
      return { pontos: 0, msg: 'Sem fotos. Adicione e mantenha atualizadas a cada 90 dias.' };
    },
  },

  // === AVALIACOES ===
  {
    id: 'E12', nome: 'Nota media >= 4.0', peso: 5, categoria: 'avaliacoes', auto: true,
    descricao: 'Clientes descartam negocios com nota abaixo de 4.0.',
    campo_api: 'rating',
    avaliar: (d) => {
      const r = d.rating;
      if (!r) return { pontos: 0, msg: 'Sem avaliacoes. Incentive clientes a avaliarem.' };
      if (r >= 4.5) return { pontos: 5, msg: `Nota excelente: ${r}.` };
      if (r >= 4.0) return { pontos: 4, msg: `Boa nota: ${r}. Continue assim.` };
      if (r >= 3.5) return { pontos: 2, msg: `Nota ${r}. Abaixo do ideal — trabalhe o atendimento.` };
      if (r >= 3.0) return { pontos: 1, msg: `Nota baixa: ${r}. Clientes descartam negocios com nota baixa.` };
      return { pontos: 0, msg: `Nota critica: ${r}. Priorize melhoria urgente no atendimento.` };
    },
  },
  {
    id: 'E13', nome: 'Volume de avaliacoes', peso: 4, categoria: 'avaliacoes', auto: true,
    descricao: 'Mais avaliacoes geram mais confianca.',
    campo_api: 'userRatingCount',
    avaliar: (d) => {
      const c = d.userRatingCount || 0;
      if (c >= 50) return { pontos: 4, msg: `${c} avaliacoes — otimo volume.` };
      if (c >= 20) return { pontos: 3, msg: `${c} avaliacoes. Bom, mas continue incentivando.` };
      if (c >= 10) return { pontos: 2, msg: `${c} avaliacoes. Incentive mais clientes.` };
      if (c >= 1) return { pontos: 1, msg: `Apenas ${c} avaliacao(oes). Peca para cada cliente avaliar.` };
      return { pontos: 0, msg: 'Nenhuma avaliacao. Incentive clientes a avaliarem apos cada atendimento.' };
    },
  },
  {
    id: 'E14', nome: 'Avaliacoes respondidas', peso: 5, categoria: 'avaliacoes', auto: true,
    descricao: 'Responda 100% das avaliacoes — positivas e negativas.',
    campo_api: 'reviews',
    avaliar: (d) => {
      const reviews = d.reviews || [];
      if (reviews.length === 0) return { pontos: 0, msg: 'Sem avaliacoes para verificar respostas.' };
      const total = Math.min(reviews.length, 5);
      const respondidas = reviews.slice(0, 5).filter(r => r.response || (r.ownerResponse)).length;
      const pontos = Math.round((respondidas / total) * 5);
      if (respondidas === total) return { pontos: 5, msg: `Todas as ${total} avaliacoes recentes foram respondidas!` };
      return { pontos, msg: `${respondidas}/${total} avaliacoes respondidas. Responda 100% — positivas e negativas.` };
    },
  },

  // === ENGAJAMENTO (MANUAL) ===
  {
    id: 'E15', nome: 'Google Posts ativos', peso: 4, categoria: 'engajamento', auto: false,
    descricao: 'Publique no minimo 2 posts por mes com imagem e chamada para acao.',
    opcoes: [
      { label: 'Sim, posts nos ultimos 30 dias', valor: 4 },
      { label: 'Parcial — posts antigos', valor: 2 },
      { label: 'Nao tem posts', valor: 0 },
    ],
  },
  {
    id: 'E16', nome: 'Perguntas e Respostas', peso: 3, categoria: 'engajamento', auto: false,
    descricao: 'Crie e responda perguntas frequentes. O Google usa isso como fonte para IA.',
    opcoes: [
      { label: 'Sim, com FAQ proativo', valor: 3 },
      { label: 'Algumas respondidas', valor: 1 },
      { label: 'Nao tem Q&A', valor: 0 },
    ],
  },
  {
    id: 'E17', nome: 'Servicos/Produtos cadastrados', peso: 3, categoria: 'engajamento', auto: false,
    descricao: 'Liste todos os servicos com descricao e preco para match com buscas especificas.',
    opcoes: [
      { label: 'Sim, detalhado', valor: 3 },
      { label: 'Basico', valor: 1 },
      { label: 'Vazio', valor: 0 },
    ],
  },
  {
    id: 'E18', nome: 'Atributos preenchidos', peso: 2, categoria: 'engajamento', auto: false,
    descricao: 'Preencha todos os atributos disponiveis para aparecer em filtros de busca.',
    opcoes: [
      { label: 'Sim, completos', valor: 2 },
      { label: 'Parcial', valor: 1 },
      { label: 'Nao preenchidos', valor: 0 },
    ],
  },

  // === CONSISTENCIA ===
  {
    id: 'E19', nome: 'NAP consistente', peso: 4, categoria: 'consistencia', auto: false,
    descricao: 'Padronize NAP (Nome, Endereco, Telefone) em todos os diretorios.',
    opcoes: [
      { label: 'Sim, 100% consistente', valor: 4 },
      { label: 'Diferencas pequenas', valor: 2 },
      { label: 'Inconsistente', valor: 0 },
    ],
  },
  {
    id: 'E20', nome: 'Pin do mapa correto', peso: 3, categoria: 'consistencia', auto: false,
    descricao: 'Pin no local errado faz o cliente ir para o endereco errado.',
    opcoes: [
      { label: 'Sim, pin correto', valor: 3 },
      { label: 'Nao, pin errado', valor: 0 },
    ],
  },
];
