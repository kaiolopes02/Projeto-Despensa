const STORAGE_KEY = 'despensa_familiar_v3';

function carregarItens() {
    try {
        const dados = localStorage.getItem(STORAGE_KEY);
        return dados ? JSON.parse(dados) : [];
    } catch (e) {
        console.warn('Erro ao carregar dados:', e);
        return [];
    }
}

function salvarItens(itens) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
    } catch (e) {
        console.warn('Erro ao salvar dados:', e);
    }
}