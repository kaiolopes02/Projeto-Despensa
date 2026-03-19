// Paleta de cores por categoria
const CAT_COLORS = {
    'Alimentos': { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
    'Limpeza':   { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
    'Higiene':   { bg: '#ede9fe', text: '#5b21b6', dot: '#8b5cf6' },
    'Outros':    { bg: '#f3f4f6', text: '#374151', dot: '#9ca3af' },
};

function renderizarItens(itens, filtro = 'todos') {
    const lista      = document.getElementById('lista');
    const emptyState = document.getElementById('empty-state');

    lista.innerHTML = '';

    // Contadores
    let pendentes = 0, comprados = 0;
    itens.forEach(item => {
        const q = parseInt(item.quantity) || 1;
        if (item.checked) comprados += q;
        else              pendentes += q;
    });

    document.getElementById('total-count').innerText  = pendentes;
    document.getElementById('checked-count').innerText = comprados;
    document.getElementById('total-items').innerText   = itens.length;

    // Filtra itens para exibição
    const itensFiltrados = filtro === 'todos'
        ? itens
        : itens.filter(i => i.category === filtro);

    // Empty state
    if (itensFiltrados.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    // Cabeçalho da lista: aparece sempre que há itens
    document.getElementById('list-header').classList.toggle('hidden', itens.length === 0);

    // Renderiza itens
    itensFiltrados.forEach(item => {
        const index = itens.indexOf(item);
        const cor   = CAT_COLORS[item.category] || CAT_COLORS['Outros'];

        const li = document.createElement('li');
        li.className = `item-card ${item.checked ? 'checked' : ''}`;

        li.innerHTML = `
            <div class="check-circle" onclick="toggleCheck(${index})" title="${item.checked ? 'Desmarcar' : 'Marcar como comprado'}">
                <i data-lucide="check"></i>
            </div>
            <div class="cat-dot" style="background:${cor.dot}" title="${item.category}"></div>
            <div class="item-info" onclick="toggleCheck(${index})">
                <span class="item-name">${escapeHtml(item.name)}</span>
                <div class="item-details">
                    <span class="cat-chip" style="background:${cor.bg};color:${cor.text}">${item.category}</span>
                    <span class="qty-badge">Qtd: ${item.quantity}</span>
                </div>
            </div>
            <div class="actions">
                <button class="btn-icon" onclick="prepararEdicao(${index})" title="Editar">
                    <i data-lucide="pencil"></i>
                </button>
                <button class="btn-icon btn-del" onclick="removerItem(${index})" title="Excluir">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;
        lista.appendChild(li);
    });

    lucide.createIcons();
}

// Previne XSS nos nomes dos itens
function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

// Sistema de toasts
function mostrarToast(msg, tipo = '') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;

    const iconMap = { success: '✓', warning: '⚠', error: '✕' };
    const icon = iconMap[tipo] || 'ℹ';
    toast.innerHTML = `<span>${icon}</span>${msg}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}
