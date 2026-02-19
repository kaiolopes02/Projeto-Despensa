let itens = carregarItens();

document.getElementById('addBtn').addEventListener('click', adicionarItem);

document.getElementById('itemName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') adicionarItem();
});

function adicionarItem() {
    const inputNome = document.getElementById('itemName');
    const selectCategoria = document.getElementById('itemCategory');
    const inputQuantidade = document.getElementById('itemQuantity');

    const nome = inputNome.value.trim();
    const categoria = selectCategoria.value;
    const quantidade = parseInt(inputQuantidade.value) || 1; // Padrão 1

    if (nome) {
        itens.push({ nome, categoria, quantidade });
        inputNome.value = '';
        inputQuantidade.value = ' '; // Reseta para 1
        salvarItens(itens);
        renderizarItens(itens);
    }
}

function removerItem(index) {
    itens.splice(index, 1);
    salvarItens(itens);
    renderizarItens(itens);
}

// Renderiza a lista ao carregar a página
renderizarItens(itens);