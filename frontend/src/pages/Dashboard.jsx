import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [produtos, setProdutos] = useState([]);
    const [busca, setBusca] = useState(''); 
    
    // PAGINAÇÃO
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 8; // itens por pagina

    useEffect(() => {
        fetch('http://localhost:3001/api/produtos')
            .then(r => r.json())
            .then(setProdutos);
    }, []);

    // volta pra pagina 1 quando pesquisa
    useEffect(() => {
        setPaginaAtual(1);
    }, [busca]);


    // filtra os produto
    const produtosFiltrados = produtos.filter(p => {
        const termoBusca = busca.toLowerCase().trim();

        // digitar repor pra ver oq precisa repor
        if (termoBusca === 'repor') {
            return p.qtd <= p.min;
        }

        // pesquisar normal
        const bateNome = p.nome?.toLowerCase().includes(termoBusca);
        const bateSku = p.sku?.toLowerCase().includes(termoBusca);
        return bateNome || bateSku;
    });

    // Calcula os índices matemáticos para cortar a lista
    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    
    //  Corta a lista para pegar apenas os 8 produtos da pagina atual
    const produtosDaPagina = produtosFiltrados.slice(indicePrimeiroItem, indiceUltimoItem);

    // Calcula quantas páginas vão existir no total
    const totalPaginas = Math.ceil(produtosFiltrados.length / itensPorPagina);

    return (
        <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-8 mt-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Estoque Geral</h2>
                    <p className="text-slate-500 text-sm mt-1">Controle de inventário em tempo real.</p>
                </div>
                
                {/* botao adicionar produto */}
                <Link 
                    to="/novo" 
                    className="flex items-center gap-2 bg-[#163354] hover:bg-[#1e4573] text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Adicionar Produto
                </Link>
            </header>

            {/* barra de pesquisa */}
            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Pesquisar produto por nome ou SKU..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-[#163354] focus:border-[#163354] outline-none transition text-slate-700 placeholder-slate-400"
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Produto</th>
                            <th className="px-6 py-4">Categoria</th>
                            <th className="px-6 py-4 text-center">Qtd</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        
                        {produtosDaPagina.length > 0 ? (
                            produtosDaPagina.map(p => (
                                <tr key={p._id} className="hover:bg-slate-50/50 transition">
                                    <td className="px-6 py-4 font-medium">{p.nome} <br/><span className="text-xs text-slate-400">{p.sku}</span></td>
                                    <td className="px-6 py-4 text-slate-500">{p.categoria}</td>
                                    <td className="px-6 py-4 text-center font-bold">{p.qtd}</td>
                                    <td className="px-6 py-4">
                                        {p.qtd <= p.min ? 
                                            <span className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded-full font-bold">REPOR</span> : 
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-xs rounded-full font-bold">OK</span>
                                        }
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-8 text-slate-500">
                                    Nenhum produto encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* controle paginacao */}
            {/* so mostra os botoes se tiver mais de uma pagina de produtos */}
            {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 mb-8">

                    {/* numeros das pagina */}
                    {Array.from({ length: totalPaginas }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setPaginaAtual(index + 1)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition shadow-sm ${paginaAtual === index + 1 ? 'bg-[#163354] text-white border-transparent' : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-[#163354]'}`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    
                </div>
            )}
        </div>
    );
}