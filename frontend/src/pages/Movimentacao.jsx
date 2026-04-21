import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Movimentacao() {
    const [produtos, setProdutos] = useState([]);
    const [form, setForm] = useState({ produtoId: '', tipo: 'ENTRADA', qtd: '', obs: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/api/produtos')
            .then(r => r.json())
            .then(data => {
                setProdutos(data);
                // Já deixa o primeiro produto selecionado por padrão para evitar erros
                if (data.length > 0) setForm(f => ({ ...f, produtoId: data[0]._id }));
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:3001/api/movimentacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        navigate('/historico');
    };

    return (
        <div className="animate-fade-in max-w-lg mx-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Movimentar Estoque</h2>
                <p className="text-slate-500 text-sm">Registre a entrada ou saída de materiais.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Produto</label>
                        <select 
                            required 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50"
                            onChange={e => setForm({...form, produtoId: e.target.value})}
                            value={form.produtoId}
                        >
                            {produtos.map(p => (
                                <option key={p._id} value={p._id}>
                                    {p.nome} (Estoque atual: {p.qtd})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Tipo</label>
                            <select 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50"
                                onChange={e => setForm({...form, tipo: e.target.value})}
                                value={form.tipo}
                            >
                                <option value="ENTRADA">Entrada (+)</option>
                                <option value="SAIDA">Saída (-)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Quantidade</label>
                            <input 
                                type="number" 
                                min="1" 
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50"
                                onChange={e => setForm({...form, qtd: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Observação (Opcional)</label>
                        <input 
                            type="text" 
                            placeholder="Ex: Nota Fiscal, OS nº 123..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50"
                            onChange={e => setForm({...form, obs: e.target.value})}
                        />
                    </div>

                    {/* Botão muda de cor dependendo se é Entrada (Verde) ou Saída (Vermelho) */}
                    <button 
                        type="submit" 
                        className={`w-full py-3 text-white rounded-xl font-bold transition shadow-lg mt-4 ${
                            form.tipo === 'ENTRADA' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-500 hover:bg-red-600'
                        }`}
                    >
                        Registrar {form.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
                    </button>
                </form>
            </div>
        </div>
    );
}