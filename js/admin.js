/**
 * admin.js - Motor do Sistema SaaS Imobiliário & CRM de Oportunidades
 * Com Módulo Multi-Portais (Feed XML), IA para Corretores, Lead Scoring e Remarketing
 * Imobiliária Prime - Padrão Severino & Ricardo (Impacto Digital)
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminSaaS();
});

let sessaoAutenticada = false;
let imovelEmEdicaoId = null;

function initAdminSaaS() {
  verificarSessao();
  configurarEventosLogin();
  configurarNavegacaoAbas();
  configurarFormularioImovel();
  configurarFormularioConfiguracoes();
  configurarExportacaoImportacao();
  configurarAbaPortais();
  configurarBotoesIA();
}

/**
 * 1. Autenticação e Sessão
 */
function verificarSessao() {
  const logado = sessionStorage.getItem('imob_admin_logado');
  if (logado === 'true') {
    sessaoAutenticada = true;
    exibirPainelPrincipal();
  } else {
    exibirTelaLogin();
  }
}

function exibirTelaLogin() {
  document.getElementById('secao-login').classList.remove('hidden');
  document.getElementById('painel-admin-conteudo').classList.add('hidden');
}

function exibirPainelPrincipal() {
  document.getElementById('secao-login').classList.add('hidden');
  document.getElementById('painel-admin-conteudo').classList.remove('hidden');
  carregarMetricasDashboard();
  renderizarTabelaImoveis();
  renderizarTabelaLeads();
  carregarFormularioConfig();
  atualizarStatusPortaisNaTela();
}

function configurarEventosLogin() {
  const formLogin = document.getElementById('form-login-admin');
  const inputSenha = document.getElementById('input-senha-admin');
  const erroLogin = document.getElementById('login-erro');

  formLogin?.addEventListener('submit', (e) => {
    e.preventDefault();
    const senha = inputSenha.value.trim();

    if (DB.validarSenhaAdmin(senha)) {
      sessionStorage.setItem('imob_admin_logado', 'true');
      sessaoAutenticada = true;
      erroLogin?.classList.add('hidden');
      exibirPainelPrincipal();
    } else {
      erroLogin?.classList.remove('hidden');
      inputSenha.value = '';
      inputSenha.focus();
    }
  });

  document.getElementById('btn-logout')?.addEventListener('click', () => {
    sessionStorage.removeItem('imob_admin_logado');
    location.reload();
  });
}

/**
 * 2. Navegação entre Abas do SaaS
 */
function configurarNavegacaoAbas() {
  document.querySelectorAll('.tab-admin-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;

      // Atualiza botões
      document.querySelectorAll('.tab-admin-nav').forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-sm');
        b.classList.add('text-slate-600', 'hover:bg-slate-100');
      });
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-sm');
      btn.classList.remove('text-slate-600', 'hover:bg-slate-100');

      // Atualiza painéis
      document.querySelectorAll('.painel-aba-conteudo').forEach(painel => {
        painel.classList.add('hidden');
      });
      document.getElementById(targetId)?.classList.remove('hidden');

      if (targetId === 'aba-imoveis') renderizarTabelaImoveis();
      if (targetId === 'aba-leads') renderizarTabelaLeads();
      if (targetId === 'aba-dashboard') carregarMetricasDashboard();
      if (targetId === 'aba-portais') atualizarStatusPortaisNaTela();
    });
  });
}

/**
 * 3. Métricas em Tempo Real no Dashboard
 */
function carregarMetricasDashboard() {
  const imoveis = DB.getImoveis();
  const leads = DB.getLeads();

  const totalImoveis = imoveis.length;
  const imoveisVenda = imoveis.filter(im => im.finalidade === 'venda' || im.finalidade === 'lancamento').length;
  const imoveisAluguel = imoveis.filter(im => im.finalidade === 'aluguel').length;

  const valorCarteiraVenda = imoveis
    .filter(im => im.finalidade === 'venda' || im.finalidade === 'lancamento')
    .reduce((acc, curr) => acc + (curr.preco || 0), 0);

  const totalLeads = leads.length;
  const leadsQuentes = leads.filter(l => l.temperatura === 'quente' || l.status === 'Novo').length;

  document.getElementById('dash-total-imoveis').textContent = totalImoveis;
  document.getElementById('dash-imoveis-venda').textContent = `${imoveisVenda} un.`;
  document.getElementById('dash-imoveis-aluguel').textContent = `${imoveisAluguel} un.`;
  document.getElementById('dash-valor-carteira').textContent = `R$ ${(valorCarteiraVenda / 1000000).toFixed(1)} Mi`;
  document.getElementById('dash-total-leads').textContent = totalLeads;
  document.getElementById('dash-leads-novos').textContent = `${leadsQuentes} quentes 🔥`;

  // Últimos 4 leads rápidos no dashboard
  const listaRecentes = document.getElementById('dash-ultimos-leads');
  if (listaRecentes) {
    if (leads.length === 0) {
      listaRecentes.innerHTML = '<p class="text-xs text-slate-400 py-4 text-center">Nenhum lead recebido ainda.</p>';
    } else {
      listaRecentes.innerHTML = leads.slice(0, 4).map(l => {
        const scoreBadge = l.temperatura === 'quente'
          ? '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">🔥 Quente</span>'
          : (l.temperatura === 'morno' ? '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">⚡ Morno</span>' : '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">❄️ Frio</span>');

        return `
          <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 text-sm">${l.nome}</span>
                ${scoreBadge}
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  ${l.status}
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">${l.imovelTitulo} (${l.tipoInteresse})</p>
            </div>
            <div class="flex items-center gap-1.5">
              <button onclick="abrirModalMatching('${l.id}')" class="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1.5 rounded-lg transition" title="Ver imóveis que combinam com este cliente">
                🎯 Matching
              </button>
              <a href="https://wa.me/${l.whatsapp.replace(/\D/g, '')}" target="_blank" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-sm">
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

/**
 * 4. Gestão e Tabela de Imóveis (CRUD)
 */
function renderizarTabelaImoveis() {
  const container = document.getElementById('tabela-imoveis-corpo');
  if (!container) return;

  const imoveis = DB.getImoveis();
  const termoFiltro = (document.getElementById('busca-admin-imoveis')?.value || '').toLowerCase().trim();

  const filtrados = imoveis.filter(im => {
    if (!termoFiltro) return true;
    return `${im.codigo} ${im.titulo} ${im.bairro} ${im.tipo}`.toLowerCase().includes(termoFiltro);
  });

  if (filtrados.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-slate-400 text-sm">
          Nenhum imóvel encontrado.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = filtrados.map(im => {
    let precoExibicao = im.finalidade === 'aluguel' 
      ? `R$ ${im.precoAluguel.toLocaleString('pt-BR')}/mês` 
      : `R$ ${im.preco.toLocaleString('pt-BR')}`;

    let statusBadgeClass = 'bg-emerald-100 text-emerald-800';
    if (im.status === 'reservado') statusBadgeClass = 'bg-amber-100 text-amber-800';
    if (im.status === 'vendido' || im.status === 'alugado') statusBadgeClass = 'bg-slate-200 text-slate-700';

    return `
      <tr class="hover:bg-slate-50/80 transition border-b border-slate-100">
        <td class="py-3 px-4">
          <div class="w-14 h-11 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
            <img src="${im.fotoPrincipal || im.fotos[0]}" class="w-full h-full object-cover">
          </div>
        </td>
        <td class="py-3 px-4 font-bold text-xs text-blue-600">
          ${im.codigo}
        </td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-800 text-sm line-clamp-1">${im.titulo}</div>
          <div class="text-[11px] text-slate-500">${im.bairro} • ${im.areaUtil} m² • ${im.quartos} qtos</div>
        </td>
        <td class="py-3 px-4">
          <span class="text-xs uppercase font-bold px-2 py-0.5 rounded ${im.finalidade === 'aluguel' ? 'bg-emerald-50 text-emerald-700' : (im.finalidade === 'lancamento' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700')}">
            ${im.finalidade}
          </span>
        </td>
        <td class="py-3 px-4 font-bold text-sm text-slate-900">
          ${precoExibicao}
        </td>
        <td class="py-3 px-4">
          <select onchange="alterarStatusImovelRapido('${im.id}', this.value)" class="text-xs font-semibold rounded-lg px-2 py-1 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 ${statusBadgeClass}">
            <option value="disponivel" ${im.status === 'disponivel' ? 'selected' : ''}>Disponível</option>
            <option value="reservado" ${im.status === 'reservado' ? 'selected' : ''}>Reservado</option>
            <option value="vendido" ${im.status === 'vendido' ? 'selected' : ''}>Vendido</option>
            <option value="alugado" ${im.status === 'alugado' ? 'selected' : ''}>Alugado</option>
          </select>
        </td>
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="gerarCopySocialImovel('${im.id}')" class="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition" title="Gerar Copy para Redes Sociais e WhatsApp com IA">
              ✨
            </button>
            <button onclick="editarImovel('${im.id}')" class="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Editar Imóvel">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button onclick="excluirImovel('${im.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Excluir Imóvel">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function alterarStatusImovelRapido(id, novoStatus) {
  DB.atualizarImovel(id, { status: novoStatus });
  carregarMetricasDashboard();
}

function excluirImovel(id) {
  if (confirm('Tem certeza que deseja excluir este imóvel do catálogo?')) {
    DB.removerImovel(id);
    renderizarTabelaImoveis();
    carregarMetricasDashboard();
  }
}

/**
 * 5. Formulário Modal de Cadastro e Edição de Imóvel + IA
 */
function configurarFormularioImovel() {
  const modal = document.getElementById('modal-cadastro-imovel');
  const form = document.getElementById('form-salvar-imovel');
  const btnNovo = document.getElementById('btn-abrir-modal-novo-imovel');
  const btnFechar = document.getElementById('btn-fechar-modal-cadastro');

  btnNovo?.addEventListener('click', () => {
    imovelEmEdicaoId = null;
    form.reset();
    document.getElementById('modal-cadastro-titulo').textContent = 'Cadastrar Novo Imóvel';
    document.getElementById('input-imob-codigo').value = 'REF-' + Math.floor(1000 + Math.random() * 9000);
    modal.classList.add('active');
  });

  btnFechar?.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  document.getElementById('busca-admin-imoveis')?.addEventListener('input', renderizarTabelaImoveis);

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fotosTexto = document.getElementById('input-imob-fotos').value.trim();
    let fotosArray = fotosTexto ? fotosTexto.split('\n').map(s => s.trim()).filter(Boolean) : [];
    const fotoPrincipal = document.getElementById('input-imob-foto-principal').value.trim() || fotosArray[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

    if (fotosArray.length === 0) {
      fotosArray = [fotoPrincipal];
    }

    const tagsTexto = document.getElementById('input-imob-tags').value.trim();
    const tagsArray = tagsTexto ? tagsTexto.split(',').map(s => s.trim()).filter(Boolean) : [];

    const diferenciaisTexto = document.getElementById('input-imob-diferenciais').value.trim();
    const diferenciaisArray = diferenciaisTexto ? diferenciaisTexto.split(',').map(s => s.trim()).filter(Boolean) : [];

    const dadosImovel = {
      codigo: document.getElementById('input-imob-codigo').value.trim().toUpperCase(),
      titulo: document.getElementById('input-imob-titulo').value.trim(),
      tipo: document.getElementById('input-imob-tipo').value,
      finalidade: document.getElementById('input-imob-finalidade').value,
      bairro: document.getElementById('input-imob-bairro').value.trim(),
      cidade: document.getElementById('input-imob-cidade').value.trim(),
      endereco: document.getElementById('input-imob-endereco').value.trim(),
      preco: parseFloat(document.getElementById('input-imob-preco').value) || 0,
      precoAluguel: parseFloat(document.getElementById('input-imob-preco-aluguel').value) || 0,
      condominio: parseFloat(document.getElementById('input-imob-condominio').value) || 0,
      iptu: parseFloat(document.getElementById('input-imob-iptu').value) || 0,
      areaUtil: parseInt(document.getElementById('input-imob-area-util').value) || 0,
      areaTotal: parseInt(document.getElementById('input-imob-area-total').value) || 0,
      quartos: parseInt(document.getElementById('input-imob-quartos').value) || 0,
      suites: parseInt(document.getElementById('input-imob-suites').value) || 0,
      banheiros: parseInt(document.getElementById('input-imob-banheiros').value) || 0,
      vagas: parseInt(document.getElementById('input-imob-vagas').value) || 0,
      destaque: document.getElementById('input-imob-destaque').checked,
      status: document.getElementById('input-imob-status').value,
      fotoPrincipal: fotoPrincipal,
      fotos: fotosArray,
      tags: tagsArray,
      diferenciais: diferenciaisArray,
      descricao: document.getElementById('input-imob-descricao').value.trim()
    };

    if (imovelEmEdicaoId) {
      DB.atualizarImovel(imovelEmEdicaoId, dadosImovel);
    } else {
      DB.adicionarImovel(dadosImovel);
    }

    modal.classList.remove('active');
    renderizarTabelaImoveis();
    carregarMetricasDashboard();
  });
}

function editarImovel(id) {
  const im = DB.getImovelPorId(id);
  if (!im) return;

  imovelEmEdicaoId = id;
  const modal = document.getElementById('modal-cadastro-imovel');
  document.getElementById('modal-cadastro-titulo').textContent = 'Editar Imóvel: ' + im.codigo;

  document.getElementById('input-imob-codigo').value = im.codigo || '';
  document.getElementById('input-imob-titulo').value = im.titulo || '';
  document.getElementById('input-imob-tipo').value = im.tipo || 'apartamento';
  document.getElementById('input-imob-finalidade').value = im.finalidade || 'venda';
  document.getElementById('input-imob-bairro').value = im.bairro || '';
  document.getElementById('input-imob-cidade').value = im.cidade || '';
  document.getElementById('input-imob-endereco').value = im.endereco || '';
  document.getElementById('input-imob-preco').value = im.preco || 0;
  document.getElementById('input-imob-preco-aluguel').value = im.precoAluguel || 0;
  document.getElementById('input-imob-condominio').value = im.condominio || 0;
  document.getElementById('input-imob-iptu').value = im.iptu || 0;
  document.getElementById('input-imob-area-util').value = im.areaUtil || 0;
  document.getElementById('input-imob-area-total').value = im.areaTotal || im.areaUtil || 0;
  document.getElementById('input-imob-quartos').value = im.quartos || 0;
  document.getElementById('input-imob-suites').value = im.suites || 0;
  document.getElementById('input-imob-banheiros').value = im.banheiros || 0;
  document.getElementById('input-imob-vagas').value = im.vagas || 0;
  document.getElementById('input-imob-destaque').checked = !!im.destaque;
  document.getElementById('input-imob-status').value = im.status || 'disponivel';
  document.getElementById('input-imob-foto-principal').value = im.fotoPrincipal || '';
  document.getElementById('input-imob-fotos').value = (im.fotos || []).join('\n');
  document.getElementById('input-imob-tags').value = (im.tags || []).join(', ');
  document.getElementById('input-imob-diferenciais').value = (im.diferenciais || []).join(', ');
  document.getElementById('input-imob-descricao').value = im.descricao || '';

  modal.classList.add('active');
}

/**
 * 6. Inteligência Artificial: Gerador de Copy Comercial e Redes Sociais
 */
function configurarBotoesIA() {
  const btnGerarIA = document.getElementById('btn-gerar-descricao-ia');
  if (btnGerarIA) {
    btnGerarIA.addEventListener('click', () => {
      const dados = {
        tipo: document.getElementById('input-imob-tipo')?.value,
        bairro: document.getElementById('input-imob-bairro')?.value,
        areaUtil: document.getElementById('input-imob-area-util')?.value,
        quartos: document.getElementById('input-imob-quartos')?.value,
        suites: document.getElementById('input-imob-suites')?.value,
        vagas: document.getElementById('input-imob-vagas')?.value,
        diferenciais: (document.getElementById('input-imob-diferenciais')?.value || '').split(',').map(s => s.trim()).filter(Boolean)
      };

      btnGerarIA.textContent = '⏳ Gerando com IA...';
      btnGerarIA.disabled = true;

      setTimeout(() => {
        const copy = DB.gerarDescricaoComIA(dados);
        document.getElementById('input-imob-descricao').value = copy;
        btnGerarIA.textContent = '✨ Gerar Descrição com IA';
        btnGerarIA.disabled = false;
      }, 600);
    });
  }
}

function gerarCopySocialImovel(id) {
  const im = DB.getImovelPorId(id);
  if (!im) return;

  const copy = DB.gerarCopyRedesSociais(im);
  navigator.clipboard.writeText(copy).then(() => {
    alert(`✨ Copy para Redes Sociais e WhatsApp copiada para a área de transferência!\n\n${copy}`);
  }).catch(() => {
    prompt('Copie o texto abaixo para postar nas redes sociais ou WhatsApp:', copy);
  });
}

/**
 * 7. CRM de Leads, Matching Inteligente & Lead Scoring
 */
function renderizarTabelaLeads() {
  const container = document.getElementById('tabela-leads-corpo');
  if (!container) return;

  const leads = DB.getLeads();

  if (leads.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6" class="py-12 text-center text-slate-400 text-sm">
          Nenhum lead registrado no sistema até o momento.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = leads.map(l => {
    let statusClass = 'bg-blue-50 text-blue-700';
    if (l.status === 'Novo') statusClass = 'bg-emerald-50 text-emerald-700 font-bold';
    if (l.status === 'Visita Agendada') statusClass = 'bg-amber-50 text-amber-700';
    if (l.status === 'Fechado') statusClass = 'bg-purple-50 text-purple-700';

    const scoreClass = l.temperatura === 'quente' ? 'lead-score-quente' : (l.temperatura === 'morno' ? 'lead-score-morno' : 'lead-score-frio');
    const scoreLabel = l.temperatura === 'quente' ? '🔥 Quente' : (l.temperatura === 'morno' ? '⚡ Morno' : '❄️ Frio');
    const numeroLimpo = (l.whatsapp || '').replace(/\D/g, '');

    return `
      <tr class="hover:bg-slate-50/80 transition border-b border-slate-100">
        <td class="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
          <div>${l.data || '-'}</div>
          <span class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${scoreClass}">
            ${scoreLabel}
          </span>
        </td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900 text-sm">${l.nome}</div>
          <div class="text-xs text-slate-500">${l.whatsapp}</div>
        </td>
        <td class="py-3 px-4">
          <div class="font-semibold text-slate-800 text-xs">${l.imovelTitulo}</div>
          <div class="text-[11px] text-blue-600 font-bold uppercase">${l.tipoInteresse}</div>
        </td>
        <td class="py-3 px-4">
          <select onchange="alterarStatusLeadRapido('${l.id}', this.value)" class="text-xs font-semibold rounded-lg px-2.5 py-1 border border-slate-200 focus:outline-none ${statusClass}">
            <option value="Novo" ${l.status === 'Novo' ? 'selected' : ''}>Novo</option>
            <option value="Em Atendimento" ${l.status === 'Em Atendimento' ? 'selected' : ''}>Em Atendimento</option>
            <option value="Visita Agendada" ${l.status === 'Visita Agendada' ? 'selected' : ''}>Visita Agendada</option>
            <option value="Fechado" ${l.status === 'Fechado' ? 'selected' : ''}>Fechado</option>
            <option value="Perdido" ${l.status === 'Perdido' ? 'selected' : ''}>Perdido</option>
          </select>
        </td>
        <td class="py-3 px-4 text-right">
          <div class="flex items-center justify-end gap-1.5 flex-wrap">
            <button onclick="abrirModalMatching('${l.id}')" class="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1.5 rounded-lg transition" title="Cruzamento Inteligente de Imóveis (Matching)">
              🎯 Matching
            </button>
            <a href="https://wa.me/${numeroLimpo}?text=${encodeURIComponent(`Olá ${l.nome}, tudo bem? Aqui é da equipe da ${DB.getConfig().nome}. Recebemos seu interesse no imóvel ${l.imovelTitulo}. Podemos conversar?`)}" target="_blank" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-sm flex items-center gap-1">
              <span>WhatsApp</span>
            </a>
            <button onclick="excluirLead('${l.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition" title="Excluir Lead">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function alterarStatusLeadRapido(id, novoStatus) {
  DB.atualizarStatusLead(id, novoStatus);
  carregarMetricasDashboard();
}

function excluirLead(id) {
  if (confirm('Deseja excluir este lead?')) {
    DB.removerLead(id);
    renderizarTabelaLeads();
    carregarMetricasDashboard();
  }
}

/**
 * 8. Modal de Matching Inteligente (Cruzamento Lead x Imóveis Semelhantes)
 */
function abrirModalMatching(leadId) {
  const lead = DB.getLeads().find(l => l.id === leadId);
  if (!lead) return;

  const resultado = DB.buscarMatchingImoveis(lead);
  let modal = document.getElementById('modal-matching');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-matching';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const imovelPrincipalHtml = resultado.imovelConsultado ? `
    <div class="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3">
      <img src="${resultado.imovelConsultado.fotoPrincipal}" class="w-16 h-12 object-cover rounded-xl">
      <div>
        <span class="text-[10px] uppercase font-bold text-blue-700 bg-white px-2 py-0.5 rounded">Imóvel Consultado</span>
        <h4 class="font-bold text-slate-900 text-xs">${resultado.imovelConsultado.codigo} - ${resultado.imovelConsultado.titulo}</h4>
        <span class="text-xs text-blue-600 font-extrabold">R$ ${resultado.imovelConsultado.preco.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  ` : '<p class="text-xs text-slate-500">Imóvel original não localizado no catálogo.</p>';

  const semelhantesHtml = (resultado.sugestoesMatching.length > 0) ? resultado.sugestoesMatching.map(im => `
    <div class="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 hover:border-blue-400 transition">
      <div class="flex items-center gap-3">
        <img src="${im.fotoPrincipal}" class="w-14 h-11 object-cover rounded-xl">
        <div>
          <h5 class="font-bold text-slate-800 text-xs">${im.codigo} - ${im.titulo}</h5>
          <div class="text-[11px] text-slate-500">${im.bairro} • ${im.areaUtil}m² • ${im.quartos} qtos</div>
          <span class="text-xs text-slate-900 font-black">R$ ${(im.preco || im.precoAluguel).toLocaleString('pt-BR')}</span>
        </div>
      </div>
      <a href="https://wa.me/${(lead.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${lead.nome}! Além do imóvel que você viu, temos esta excelente opção com características semelhantes: ${im.codigo} - ${im.titulo} (${im.bairro}). Gostaria de receber fotos?`)}" target="_blank" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1 shadow-sm">
        <span>Enviar Opção</span>
      </a>
    </div>
  `).join('') : '<p class="text-xs text-slate-400 py-3 text-center">Nenhum outro imóvel com perfil semelhante encontrado no momento.</p>';

  modal.innerHTML = `
    <div class="modal-content relative !max-w-2xl p-6 sm:p-8 space-y-4">
      <button onclick="document.getElementById('modal-matching').classList.remove('active')" class="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center transition">✕</button>
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded">Matching com Inteligência Artificial</span>
        <h3 class="text-xl font-black text-slate-900 mt-1">Imóveis Recomendados para ${lead.nome}</h3>
        <p class="text-xs text-slate-500">Cruze o perfil do cliente com outras opções do catálogo para não perder a venda.</p>
      </div>

      <div class="space-y-3">
        ${imovelPrincipalHtml}
        <h4 class="font-bold text-slate-700 text-xs uppercase tracking-wider mt-4">Sugestões de Imóveis Compatíveis:</h4>
        <div class="space-y-2">
          ${semelhantesHtml}
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

/**
 * 9. Módulo Multi-Portais: Sincronização & Feed XML Oficial
 */
function configurarAbaPortais() {
  const btnCopiar = document.getElementById('btn-copiar-feed-xml');
  const btnBaixar = document.getElementById('btn-baixar-feed-xml');

  btnCopiar?.addEventListener('click', () => {
    const urlFeed = document.getElementById('input-url-feed-xml')?.value;
    navigator.clipboard.writeText(urlFeed).then(() => {
      alert('Link do Feed XML copiado com sucesso! Insira esta URL no painel do ZAP, VivaReal, OLX ou Imovelweb para sincronização automática.');
    });
  });

  btnBaixar?.addEventListener('click', () => {
    const xml = DB.gerarFeedXmlPortais();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `carga_portais_imobiliaria_${new Date().toISOString().slice(0, 10)}.xml`;
    link.click();
  });
}

function atualizarStatusPortaisNaTela() {
  const config = DB.getConfig();
  const inputFeed = document.getElementById('input-url-feed-xml');
  if (inputFeed) {
    inputFeed.value = `${window.location.origin}${window.location.pathname.replace('admin.html', '')}feed-portais.xml`;
  }
}

/**
 * 10. Configurações da Imobiliária, Remarketing e LGPD
 */
function carregarFormularioConfig() {
  const config = DB.getConfig();

  document.getElementById('cfg-nome').value = config.nome || '';
  document.getElementById('cfg-creci').value = config.creci || '';
  document.getElementById('cfg-slogan').value = config.slogan || '';
  document.getElementById('cfg-telefone').value = config.telefone || '';
  document.getElementById('cfg-whatsapp').value = config.whatsapp || '';
  document.getElementById('cfg-email').value = config.email || '';
  document.getElementById('cfg-endereco').value = config.endereco || '';
  document.getElementById('cfg-cidade').value = config.cidade || '';
  document.getElementById('cfg-maps-url').value = config.googleMapsUrl || '';
  document.getElementById('cfg-webhook').value = config.webhookLeads || '';

  // Remarketing e Tráfego Pago
  if (document.getElementById('cfg-pixel-meta')) {
    document.getElementById('cfg-pixel-meta').value = config.pixelMetaId || '';
  }
  if (document.getElementById('cfg-google-ads')) {
    document.getElementById('cfg-google-ads').value = config.googleAdsId || '';
  }

  document.getElementById('cfg-instagram').value = config.instagram || '';
  document.getElementById('cfg-facebook').value = config.facebook || '';
  document.getElementById('cfg-youtube').value = config.youtube || '';
  document.getElementById('cfg-tiktok').value = config.tiktok || '';

  document.getElementById('cfg-hora-semana-inicio').value = config.horaInicioSemana || 8.5;
  document.getElementById('cfg-hora-semana-fim').value = config.horaFimSemana || 19;
  document.getElementById('cfg-hora-sabado-inicio').value = config.horaInicioSabado || 9;
  document.getElementById('cfg-hora-sabado-fim').value = config.horaFimSabado || 16;
}

function configurarFormularioConfiguracoes() {
  const form = document.getElementById('form-config-imobiliaria');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const configAtual = DB.getConfig();
    const novasConfigs = {
      ...configAtual,
      nome: document.getElementById('cfg-nome').value.trim(),
      creci: document.getElementById('cfg-creci').value.trim(),
      slogan: document.getElementById('cfg-slogan').value.trim(),
      telefone: document.getElementById('cfg-telefone').value.trim(),
      whatsapp: document.getElementById('cfg-whatsapp').value.trim().replace(/\D/g, ''),
      email: document.getElementById('cfg-email').value.trim(),
      endereco: document.getElementById('cfg-endereco').value.trim(),
      cidade: document.getElementById('cfg-cidade').value.trim(),
      googleMapsUrl: document.getElementById('cfg-maps-url').value.trim(),
      webhookLeads: document.getElementById('cfg-webhook').value.trim(),

      pixelMetaId: document.getElementById('cfg-pixel-meta')?.value.trim() || '',
      googleAdsId: document.getElementById('cfg-google-ads')?.value.trim() || '',

      instagram: document.getElementById('cfg-instagram').value.trim(),
      facebook: document.getElementById('cfg-facebook').value.trim(),
      youtube: document.getElementById('cfg-youtube').value.trim(),
      tiktok: document.getElementById('cfg-tiktok').value.trim(),

      horaInicioSemana: parseFloat(document.getElementById('cfg-hora-semana-inicio').value) || 8.5,
      horaFimSemana: parseFloat(document.getElementById('cfg-hora-semana-fim').value) || 19,
      horaInicioSabado: parseFloat(document.getElementById('cfg-hora-sabado-inicio').value) || 9,
      horaFimSabado: parseFloat(document.getElementById('cfg-hora-sabado-fim').value) || 16
    };

    DB.salvarConfig(novasConfigs);
    alert('Configurações salvas com sucesso! As tags de Remarketing e Portais estão ativas.');
  });
}

/**
 * 11. Exportação, Backup e Restauração
 */
function configurarExportacaoImportacao() {
  // Exportar Leads para CSV
  document.getElementById('btn-exportar-leads-csv')?.addEventListener('click', () => {
    const leads = DB.getLeads();
    if (leads.length === 0) {
      alert('Nenhum lead para exportar.');
      return;
    }
    const colunas = ['Data', 'Nome', 'WhatsApp', 'Email', 'Temperatura', 'Codigo Imovel', 'Imovel', 'Tipo Interesse', 'Status', 'Mensagem'];
    const linhas = leads.map(l => [
      `"${l.data || ''}"`,
      `"${l.nome || ''}"`,
      `"${l.whatsapp || ''}"`,
      `"${l.email || ''}"`,
      `"${l.temperatura || 'morno'}"`,
      `"${l.imovelCodigo || ''}"`,
      `"${(l.imovelTitulo || '').replace(/"/g, '""')}"`,
      `"${l.tipoInteresse || ''}"`,
      `"${l.status || ''}"`,
      `"${(l.mensagem || '').replace(/"/g, '""')}"`
    ].join(';'));

    const csvContent = '\uFEFF' + [colunas.join(';'), ...linhas].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_imobiliaria_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  });

  // Exportar Backup Completo JSON
  document.getElementById('btn-exportar-backup')?.addEventListener('click', () => {
    const backup = {
      imoveis: DB.getImoveis(),
      config: DB.getConfig(),
      leads: DB.getLeads(),
      dataExportacao: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_imobiliaria_prime_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  });

  // Restaurar Demonstração Original
  document.getElementById('btn-restaurar-padroes')?.addEventListener('click', () => {
    if (confirm('Deseja restaurar o catálogo e os dados de demonstração originais? Isso resetará quaisquer testes feitos para você poder apresentar para um novo cliente.')) {
      DB.restaurarPadroes();
      alert('Dados de demonstração restaurados com sucesso!');
      location.reload();
    }
  });
}

window.alterarStatusImovelRapido = alterarStatusImovelRapido;
window.editarImovel = editarImovel;
window.excluirImovel = excluirImovel;
window.alterarStatusLeadRapido = alterarStatusLeadRapido;
window.excluirLead = excluirLead;
window.gerarCopySocialImovel = gerarCopySocialImovel;
window.abrirModalMatching = abrirModalMatching;
