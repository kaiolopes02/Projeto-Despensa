let itens = [];

window.onload = () => {
    // Lógica de importação via URL
    const params = new URLSearchParams(window.location.search);
    const listaImportada = params.get('lista');

    if (listaImportada) {
        try {
            const decodificado = JSON.parse(atob(listaImportada));
            if (confirm("Você recebeu uma lista compartilhada. Deseja carregar esses itens?")) {
                itens = decodificado;
                salvarItens(itens);
                window.history.replaceState({}, document.title, window.location.pathname);
            } else {
                itens = carregarItens();
            }
        } catch (e) {
            itens = carregarItens();
        }
    } else {
        itens = carregarItens();
    }
    renderizarItens(itens);
};

document.getElementById('addBtn').addEventListener('click', gerenciarSalvar);
document.getElementById('shareBtn').addEventListener('click', compartilhar);

function gerenciarSalvar() {
    const elNome = document.getElementById('itemName');
    const elCat = document.getElementById('itemCategory');
    const elQtd = document.getElementById('itemQuantity');
    const elEditIndex = document.getElementById('editIndex');

    const name = elNome.value.trim();
    const category = elCat.value;
    const quantity = parseInt(elQtd.value) || 1;
    const indexAtual = parseInt(elEditIndex.value);

    if (!name) return alert("Digite o nome do item!");

    // Validação de Duplicidade
    const duplicado = itens.some((it, i) => it.name.toLowerCase() === name.toLowerCase() && i !== indexAtual);
    if (duplicado) return alert("Este item já está na lista!");

    if (indexAtual > -1) {
        itens[indexAtual] = { ...itens[indexAtual], name, category, quantity };
        elEditIndex.value = "-1";
        document.getElementById('addBtn').querySelector('span').innerText = "Adicionar à Lista";
    } else {
        itens.push({ name, category, quantity, checked: false });
    }

    elNome.value = '';
    elQtd.value = '1';
    atualizarTudo();
}

function prepararEdicao(index) {
    const item = itens[index];
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemQuantity').value = item.quantity;
    document.getElementById('editIndex').value = index;

    document.getElementById('addBtn').querySelector('span').innerText = "Salvar Alterações";
    
    // Scroll suave para o formulário
    document.getElementById('form-topo').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('itemName').focus();
}

function toggleCheck(index) {
    itens[index].checked = !itens[index].checked;
    atualizarTudo();
}

function removerItem(index) {
    if (confirm("Remover este item da lista?")) {
        itens.splice(index, 1);
        atualizarTudo();
    }
}

function atualizarTudo() {
    salvarItens(itens);
    renderizarItens(itens);
}

function compartilhar() {
    if (itens.length === 0) return alert("Lista vazia!");

    const b64 = btoa(JSON.stringify(itens));
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
}