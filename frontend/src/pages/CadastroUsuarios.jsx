import { useEffect, useState } from 'react';

export default function CadastroUsuarios() {
    const meuCargo = localStorage.getItem('cargo'); 
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [cargo, setCargo] = useState('funcionario');
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    const carregarUsuarios = async () => {
        try {
            const resposta = await fetch('https://api-eletronexo.onrender.com/api/usuarios');
            const dados = await resposta.json();
            setUsuarios(dados);
        } catch (error) {
            console.error('Erro ao carregar usuários');
        }
    };

    useEffect(() => { carregarUsuarios(); }, []);

    const handleRemover = async (id, emailUsuario) => {
        if (window.confirm(`Tem certeza que deseja remover o usuário ${emailUsuario}?`)) {
            try {
                const resposta = await fetch(`https://api-eletronexo.onrender.com/api/usuarios/${id}`, {
                    method: 'DELETE'
                });
                if (resposta.ok) {
                    carregarUsuarios(); // Atualiza a lista após deletar
                }
            } catch (error) {
                alert("Erro ao remover usuário");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resposta = await fetch('https://api-eletronexo.onrender.com/api/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha, cargo })
            });
            const dados = await resposta.json();
            if (dados.sucesso) {
                setMensagem({ texto: 'Usuário cadastrado!', tipo: 'sucesso' });
                setEmail(''); setSenha(''); setCargo('funcionario');
                carregarUsuarios();
                setTimeout(() => { setMostrarForm(false); setMensagem({ texto: '', tipo: '' }); }, 1500);
            } else {
                setMensagem({ texto: dados.erro, tipo: 'erro' });
            }
        } catch (error) {
            setMensagem({ texto: 'Erro no servidor.', tipo: 'erro' });
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-8 mt-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Gerenciar Usuários</h2>
                    <p className="text-slate-500 text-sm mt-1">Painel de controle de acessos.</p>
                </div>
                <button 
                    onClick={() => { setMostrarForm(!mostrarForm); setMensagem({ texto: '', tipo: '' }); }}
                    className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md ${mostrarForm ? 'bg-slate-200 text-slate-700' : 'bg-[#163354] text-white hover:bg-[#1e4573]'}`}
                >
                    {mostrarForm ? 'Voltar para Lista' : '+ Novo Usuário'}
                </button>
            </header>

            {mostrarForm ? (
                /* Formulário (Mesmo código anterior com a trava de cargo para gerente) */
                <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#163354]"/>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
                            <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#163354]"/>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Cargo</label>
                            {meuCargo === 'admin' ? (
                                <select value={cargo} onChange={(e) => setCargo(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white">
                                    <option value="funcionario">Funcionário</option>
                                    <option value="gerente">Gerente</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            ) : (
                                <div className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm">Funcionário (Padrão)</div>
                            )}
                        </div>
                        {mensagem.texto && <div className={`p-3 rounded-lg text-sm font-bold ${mensagem.tipo === 'sucesso' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{mensagem.texto}</div>}
                        <button type="submit" className="w-full py-3 bg-[#163354] text-white rounded-xl font-bold hover:bg-[#1e4573] transition shadow-md">Salvar Usuário</button>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">E-mail</th>
                                <th className="px-6 py-4">Cargo</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {usuarios.map(user => {
                                // LÓGICA DE PERMISSÃO PARA DELETAR
                                // Admin deleta todos (menos ele mesmo por segurança)
                                // Gerente deleta apenas funcionários
                                const podeDeletar = 
                                    (meuCargo === 'admin' && user.email !== 'admin@eletronexo.com') || 
                                    (meuCargo === 'gerente' && user.cargo === 'funcionario');

                                return (
                                    <tr key={user._id} className="hover:bg-slate-50/50 transition">
                                        <td className="px-6 py-4 font-medium text-slate-800">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase ${user.cargo === 'admin' ? 'bg-purple-100 text-purple-700' : user.cargo === 'gerente' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {user.cargo}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {podeDeletar && (
                                                <button 
                                                    onClick={() => handleRemover(user._id, user.email)}
                                                    className="text-red-400 hover:text-red-600 p-2 transition-colors"
                                                    title="Remover Usuário"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}