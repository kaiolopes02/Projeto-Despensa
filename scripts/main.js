let itens = [];
let filtroAtual = 'todos';

// ───── INICIALIZAÇÃO ─────
window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const listaImportada = params.get('lista');

    if (listaImportada) {
        try {
<<<<<<< HEAD
            const decodificado = JSON.parse(atob(listaImportada));
            if (Array.isArray(decodificado) && confirm("Você recebeu uma lista compartilhada. Deseja carregar esses itens?")) {
=======
            // Decodificação segura para caracteres UTF-8 (acentos)
            const jsonString = decodeURIComponent(escape(atob(listaImportada)));
            const decodificado = JSON.parse(jsonString);
            
            if (confirm("Você recebeu uma lista compartilhada. Deseja carregar esses itens?")) {
>>>>>>> 44fdbe0fb628c1b2f7e9ca6ee4e2e9f012672e52
                itens = decodificado;
                salvarItens(itens);
                window.history.replaceState({}, document.title, window.location.pathname);
                mostrarToast('Lista importada com sucesso!', 'success');
            } else {
                itens = carregarItens();
            }
        } catch (e) {
<<<<<<< HEAD
            console.warn('Falha ao importar lista:', e);
=======
            console.error("Erro na importação:", e);
>>>>>>> 44fdbe0fb628c1b2f7e9ca6ee4e2e9f012672e52
            itens = carregarItens();
        }
    } else {
        itens = carregarItens();
    }

    renderizarItens(itens, filtroAtual);
    lucide.createIcons();
};

// ───── EVENTOS ─────
document.getElementById('addBtn').addEventListener('click', gerenciarSalvar);
document.getElementById('shareBtn').addEventListener('click', compartilhar);
document.getElementById('clearCheckedBtn').addEventListener('click', limparComprados);

// Submete com Enter no campo nome
document.getElementById('itemName').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') gerenciarSalvar();
});

// Stepper de quantidade (+ / -)
document.getElementById('qtyMinus').addEventListener('click', () => {
    const el  = document.getElementById('itemQuantity');
    const val = parseInt(el.value) || 1;
    if (val > 1) el.value = val - 1;
});
document.getElementById('qtyPlus').addEventListener('click', () => {
    const el  = document.getElementById('itemQuantity');
    const val = parseInt(el.value) || 1;
    el.value  = val + 1;
});

// Filtros de categoria
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtroAtual = btn.dataset.filter;
        renderizarItens(itens, filtroAtual);
    });
});

// ───── GERENCIAR SALVAR (adicionar / editar) ─────
function gerenciarSalvar() {
    const elNome      = document.getElementById('itemName');
    const elCat       = document.getElementById('itemCategory');
    const elQtd       = document.getElementById('itemQuantity');
    const elEditIndex = document.getElementById('editIndex');
    const btnAdd = document.getElementById('addBtn');

    const name       = elNome.value.trim();
    const category   = elCat.value;
    const quantity   = Math.max(1, parseInt(elQtd.value) || 1);
    const indexAtual = parseInt(elEditIndex.value);

<<<<<<< HEAD
    // Validações
    if (!name) {
        mostrarToast('Digite o nome do item!', 'warning');
        elNome.focus();
        return;
=======
    if (!name) return alert("Digite o nome do item!");

    const duplicado = itens.some((it, i) => it.name.toLowerCase() === name.toLowerCase() && i !== indexAtual);
    if (duplicado) return alert("Este item já está na lista!");

    if (indexAtual > -1) {
        itens[indexAtual] = { ...itens[indexAtual], name, category, quantity };
        elEditIndex.value = "-1";
        btnAdd.innerText = "Adicionar à Lista"; // Ajustado para funcionar sem o <span>
    } else {
        itens.push({ name, category, quantity, checked: false });
>>>>>>> 44fdbe0fb628c1b2f7e9ca6ee4e2e9f012672e52
    }

    const duplicado = itens.some(
        (it, i) => it.name.toLowerCase() === name.toLowerCase() && i !== indexAtual
    );
    if (duplicado) {
        mostrarToast('Este item já está na lista!', 'warning');
        elNome.focus();
        return;
    }

    if (indexAtual > -1) {
        // Edição
        itens[indexAtual] = { ...itens[indexAtual], name, category, quantity };
        mostrarToast(`"${name}" atualizado!`, 'success');
        cancelarEdicao();
    } else {
        // Novo item
        itens.push({ name, category, quantity, checked: false });
        mostrarToast(`"${name}" adicionado!`, 'success');
    }

    // Limpa formulário
    elNome.value = '';
<<<<<<< HEAD
    elQtd.value  = '1';
    elNome.focus();

=======
    elQtd.value = '';
>>>>>>> 44fdbe0fb628c1b2f7e9ca6ee4e2e9f012672e52
    atualizarTudo();
}

// ───── PREPARAR EDIÇÃO ─────
function prepararEdicao(index) {
    const item = itens[index];
    document.getElementById('itemName').value      = item.name;
    document.getElementById('itemCategory').value  = item.category;
    document.getElementById('itemQuantity').value  = item.quantity;
    document.getElementById('editIndex').value     = index;

    const btn = document.getElementById('addBtn');
    btn.querySelector('span').innerText = 'Salvar Alterações';
    btn.classList.add('editing');

<<<<<<< HEAD
=======
    document.getElementById('addBtn').innerText = "Salvar Alterações";
    
>>>>>>> 44fdbe0fb628c1b2f7e9ca6ee4e2e9f012672e52
    document.getElementById('form-topo').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('itemName').focus();
}

function cancelarEdicao() {
    document.getElementById('editIndex').value = '-1';
    const btn = document.getElementById('addBtn');
    btn.querySelector('span').innerText = 'Adicionar à Lista';
    btn.classList.remove('editing');
}

// ───── TOGGLE CHECKED ─────
function toggleCheck(index) {
    itens[index].checked = !itens[index].checked;
    atualizarTudo();
}

// ───── REMOVER ITEM ─────
function removerItem(index) {
<<<<<<< HEAD
    const nome = itens[index].name;
    itens.splice(index, 1);

    // Se estava em edição desse item, cancela
    if (parseInt(document.getElementById('editIndex').value) === index) {
        cancelarEdicao();
        document.getElementById('itemName').value = '';
        document.getElementById('itemQuantity').value = '1';
    }

    mostrarToast(`"${nome}" removido.`);
=======
    itens.splice(index, 1);
>>>>>>> 44fdbe0fb628c1b2f7e9ca6ee4e2e9f012672e52
    atualizarTudo();
}

// ───── LIMPAR COMPRADOS ─────
function limparComprados() {
    const qtd = itens.filter(i => i.checked).length;
    if (qtd === 0) {
        mostrarToast('Nenhum item comprado para limpar.', 'warning');
        return;
    }
    itens = itens.filter(i => !i.checked);
    mostrarToast(`${qtd} item${qtd > 1 ? 's' : ''} removido${qtd > 1 ? 's' : ''}!`, 'success');
    atualizarTudo();
}

// ───── COMPARTILHAR ─────
function compartilhar() {
    if (itens.length === 0) {
        mostrarToast('A lista está vazia!', 'warning');
        return;
    }

<<<<<<< HEAD
    const b64  = btoa(unescape(encodeURIComponent(JSON.stringify(itens))));
    const link = `${window.location.origin}${window.location.pathname}?lista=${b64}`;

    const pendentes = itens.filter(i => !i.checked);
    const resumo =
        '🛒 *Minha Lista de Despensa*\n\n' +
        (pendentes.length
            ? pendentes.map(i => `• ${i.name} (${i.quantity})`).join('\n')
            : '_(todos os itens já foram comprados)_') +
        `\n\n🔗 Acesse e edite: ${link}`;

    if (navigator.share) {
        navigator.share({ title: 'Lista de Despensa', text: resumo }).catch(() => {});
    } else {
        navigator.clipboard.writeText(resumo)
            .then(() => mostrarToast('Lista copiada para a área de transferência!', 'success'))
            .catch(() => mostrarToast('Não foi possível copiar. Tente manualmente.', 'error'));
    }
}

// ───── ATUALIZAR TUDO ─────
function atualizarTudo() {
    salvarItens(itens);
    renderizarItens(itens, filtroAtual);
}
=======
    try {
        // Codificação segura para caracteres UTF-8 (acentos)
        const jsonString = JSON.stringify(itens);
        const b64 = btoa(unescape(encodeURIComponent(jsonString)));
        
        const link = `${window.location.origin}${window.location.pathname}?lista=${b64}`;
        
        const resumo = "📋 *Minha Lista de Despensa*\n\n" + 
            itens.filter(i => !i.checked).map(i => `• ${i.name} (${i.quantity})`).join('\n') +
            `\n\n🔗 Edite aqui: ${link}`;

        if (navigator.share) {
            navigator.share({ title: 'Lista de Despensa', text: resumo });
        } else {
            navigator.clipboard.writeText(resumo);
            alert("Lista e link copiados!");
        }
    } catch (e) {
        alert("Erro ao gerar link de compartilhamento.");
    }
}
>>>>>>> 44fdbe0fb628c1b2f7e9ca6ee4e2e9f012672e52
