function renderizarItens(itens) {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';

    itens.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'item-card';
        li.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.nome}</span>
                <div class="item-meta">
                    <span class="category-tag">${item.categoria}</span>
                    <span class="quantity-badge">Qtd: ${item.quantidade}</span>
                </div>
            </div>
            <button class="btn-check" data-index="${index}">✓</button>
        `;
        lista.appendChild(li);
    });

    // Adiciona evento aos botões de remoção
    document.querySelectorAll('.btn-check').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            removerItem(index);
        });
    });
}