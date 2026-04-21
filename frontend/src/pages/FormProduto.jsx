import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FormProduto() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        sku: '',
        nome: '',
        categoria: 'Cabos e Fios',
        qtd: 0,
        min: 5
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        await fetch('http://localhost:3001/api/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        // Após salvar, volta para a tela inicial do estoque
        navigate('/dashboard');
    };

    return (
        <div className="animate-fade-in max-w-lg mx-auto">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Novo Produto</h2>
                <p className="text-slate-500 text-sm">Cadastre um novo material no sistema.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Código (SKU)</label>
                            <input 
                                type="text" 
                                required 
                                placeholder="Ex: CABO-10MM"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50"
                                onChange={e => setForm({...form, sku: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Categoria</label>
                            <select 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50"
                                onChange={e => setForm({...form, categoria: e.target.value})}
                                value={form.categoria}
                            >
                                <option value="Cabos e Fios">Cabos e Fios</option>
                                <option value="Iluminação">Iluminação</option>
                                <option value="Proteção (Disjuntores)">Proteção (Disjuntores)</option>
                                <option value="Tomadas e Interruptores">Tomadas e Interruptores</option>
                                <option value="Ferramentas">Ferramentas</option>
                                <option value="Diversos">Diversos</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Produto</label>
                        <input 
                            type="text" 
                            required 
                            placeholder="Ex: Cabo Flexível 10mm Azul 750V"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50"
                            onChange={e => setForm({...form, nome: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Estoque Inicial</label>
                            <input 
                                type="number" 
                                min="0" 
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50"
                                onChange={e => setForm({...form, qtd: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Estoque Mínimo</label>
                            <input 
                                type="number" 
                                min="1" 
                                required 
                                value={form.min}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-slate-50"
                                onChange={e => setForm({...form, min: Number(e.target.value)})}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg mt-4"
                    >
                        Salvar Produto
                    </button>
                </form>
            </div>
        </div>
    );
}