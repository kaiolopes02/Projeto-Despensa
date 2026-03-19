// ───── CONFIGURAÇÃO ─────
const HISTORY_KEY = 'despensa_historico_v1';
const MAX_HISTORY = 5;

// ───── STORAGE ─────
function carregarHistorico() {
    try {
        const dados = localStorage.getItem(HISTORY_KEY);
        return dados ? JSON.parse(dados) : [];
    } catch (e) {
        return [];
    }
}

function salvarHistorico(historico) {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(historico));
    } catch (e) {
        console.warn('Erro ao salvar histórico:', e);
    }
}

// ───── SALVAR LISTA NO HISTÓRICO (e limpar lista ativa) ─────
function salvarListaNoHistorico(itensAtivos) {
    if (!itensAtivos || itensAtivos.length === 0) {
        mostrarToast('A lista está vazia!', 'warning');
        return;
    }

    const historico = carregarHistorico();

    const agora = new Date();
    const entrada = {
        id:   agora.getTime(),
        data: formatarData(agora),
        itens: JSON.parse(JSON.stringify(itensAtivos)), // deep copy
    };

    historico.unshift(entrada);
    if (historico.length > MAX_HISTORY) historico.length = MAX_HISTORY;

    salvarHistorico(historico);

    // Limpa a lista ativa após salvar
    itens = [];
    salvarItens(itens);
    renderizarItens(itens, filtroAtual);

    atualizarBotaoHistorico();
    mostrarToast('Lista salva no histórico e limpa!', 'success');
}

// ───── USAR LISTA DO HISTÓRICO COMO BASE ─────
function usarComoBase(id) {
    const historico = carregarHistorico();
    const entrada   = historico.find(h => h.id === id);
    if (!entrada) return;

    // Cópia profunda, todos os itens resetados para não-marcado
    const copia = entrada.itens.map(item => ({
        ...item,
        checked: false,
    }));

    // Confirma se há itens na lista atual
    if (typeof itens !== 'undefined' && itens.length > 0) {
        if (!confirm(`Substituir a lista atual pelos ${copia.length} itens desta entrada?\n\nA lista do histórico continuará salva normalmente.`)) {
            return;
        }
    }

    // Aplica na lista ativa (variável global definida em main.js)
    itens = copia;
    salvarItens(itens);
    renderizarItens(itens, filtroAtual);
    fecharHistorico();
    mostrarToast(`${copia.length} itens carregados como base!`, 'success');
}

// ───── EXCLUIR ENTRADA DO HISTÓRICO ─────
function excluirEntradaHistorico(id) {
    let historico = carregarHistorico();
    historico     = historico.filter(h => h.id !== id);
    salvarHistorico(historico);
    renderizarHistorico();
    atualizarBotaoHistorico();
    mostrarToast('Entrada removida do histórico.');
}

// ───── RENDERIZAR MODAL ─────
function renderizarHistorico() {
    const container  = document.getElementById('history-list');
    const emptyEl    = document.getElementById('history-empty');
    const historico  = carregarHistorico();

    container.innerHTML = '';

    if (historico.length === 0) {
        emptyEl.classList.remove('hidden');
        container.classList.add('hidden');
        return;
    }

    emptyEl.classList.add('hidden');
    container.classList.remove('hidden');

    historico.forEach((entrada, idx) => {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.style.animationDelay = `${idx * 55}ms`;

        const total  = entrada.itens.length;
        const resumo = `${total} item${total !== 1 ? 's' : ''}`;

        // Chips de todos os itens
        const chipsHtml = entrada.itens
            .map(i => `<span class="preview-chip">${escapeHtml(i.name)}</span>`)
            .join('');

        card.innerHTML = `
            <div class="history-card-top">
                <div class="history-entry-label">
                    <div class="history-index">${idx + 1}</div>
                    <span class="history-date">${entrada.data}</span>
                </div>
                <span class="history-item-count">${resumo}</span>
            </div>
            <div class="history-card-body">
                <div class="history-items-preview">${chipsHtml}</div>
            </div>
            <div class="history-card-footer">
                <button class="btn-use-history" onclick="usarComoBase(${entrada.id})">
                    <i data-lucide="copy-plus"></i>
                    Usar como base
                </button>
                <button class="btn-del-history" onclick="excluirEntradaHistorico(${entrada.id})" title="Remover do histórico">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    lucide.createIcons();
}

// ───── ABRIR / FECHAR MODAL ─────
function abrirHistorico() {
    const overlay = document.getElementById('history-overlay');
    overlay.classList.remove('hidden', 'closing');
    renderizarHistorico();
    document.body.style.overflow = 'hidden';
}

function fecharHistorico() {
    const overlay = document.getElementById('history-overlay');
    overlay.classList.add('closing');
    document.body.style.overflow = '';
    setTimeout(() => overlay.classList.add('hidden'), 220);
}

// ───── BADGE NO BOTÃO ─────
function atualizarBotaoHistorico() {
    const btn       = document.getElementById('historyBtn');
    const historico = carregarHistorico();
    btn.classList.toggle('has-history', historico.length > 0);
}

// ───── EVENTOS DO MODAL ─────
document.getElementById('historyBtn').addEventListener('click', abrirHistorico);
document.getElementById('closeHistoryBtn').addEventListener('click', fecharHistorico);

// Fecha ao clicar no overlay fora do modal
document.getElementById('history-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('history-overlay')) fecharHistorico();
});

// Fecha com Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('history-overlay').classList.contains('hidden')) {
        fecharHistorico();
    }
});

// ───── HELPERS ─────
function formatarData(date) {
    const datePart = date.toLocaleDateString('pt-BR', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
    const pad  = n => String(n).padStart(2, '0');
    const hora = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return `${datePart} às ${hora}`;
}
