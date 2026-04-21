import { useEffect, useState } from 'react';

export default function Historico() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetch('https://api-eletronexo.onrender.com/api/historico')
            .then(r => r.json())
            .then(setLogs);
    }, []);

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800">Histórico</h2>
                <p className="text-slate-500 text-sm">Registro de todas as movimentações.</p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Data / Hora</th>
                            <th className="px-6 py-4">Produto</th>
                            <th className="px-6 py-4">Tipo</th>
                            <th className="px-6 py-4 text-center">Qtd</th>
                            <th className="px-6 py-4">Observação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.map(log => (
                            <tr key={log._id} className="hover:bg-slate-50/50 transition">
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {new Date(log.data).toLocaleString('pt-BR')}
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    {/* Caso o produto tenha sido deletado, o populate pode retornar null */}
                                    {log.produtoId ? log.produtoId.nome : 'Produto Removido'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs rounded-full font-bold ${
                                        log.tipo === 'ENTRADA' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                        {log.tipo}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-slate-700">{log.qtd}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{log.obs || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {logs.length === 0 && (
                    <div className="p-8 text-center text-slate-400">
                        Nenhuma movimentação registrada ainda.
                    </div>
                )}
            </div>
        </div>
    );
}