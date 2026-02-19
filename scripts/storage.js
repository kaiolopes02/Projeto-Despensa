const STORAGE_KEY = 'despensa_v2';

function carregarItens() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

function salvarItens(itens) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
}

