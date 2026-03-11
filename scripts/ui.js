function renderizarItens(itens) {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';
    let somaTotal = 0;

    itens.forEach((item, index) => {
        if (!item.checked) somaTotal += parseInt(item.quantity);

        const li = document.createElement('li');
        li.className = `item-card ${item.checked ? 'checked' : ''}`;
        
        li.innerHTML = `
            <div class="item-info" onclick="toggleCheck(${index})">
                <span class="item-name">${item.name}</span>
                <span class="item-details">${item.category} • Qtd: ${item.quantity}</span>
            </div>
            <div class="actions">
                <button class="btn-icon" onclick="prepararEdicao(${index})" title="Editar">
                    <i data-lucide="edit-3" style="width: 18px"></i>
                </button>
                <button class="btn-icon btn-del" onclick="removerItem(${index})" title="Excluir">
                    <i data-lucide="trash-2" style="width: 18px"></i>
                </button>
            </div>
        `;
        lista.appendChild(li);
    });

    document.getElementById('total-count').innerText = somaTotal;
    // Reinicia os ícones do Lucide para os novos elementos
    lucide.createIcons();
}