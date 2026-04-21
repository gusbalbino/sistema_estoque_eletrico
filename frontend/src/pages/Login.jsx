import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoEmpresa from '../assets/logo.png';
import imagemFundo from '../assets/fundo.png';

// Ícones SVG embutidos para ficarem perfeitos
const UserIcon = () => (
  <svg className="h-5 w-5 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg className="h-5 w-5 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="h-5 w-5 text-slate-500 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer hover:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default function Login() {
    const navigate = useNavigate();
    
    // Estados para controlar o formulário
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

// Função que comunica com o backend
    const handleLogin = async (e) => {
        e.preventDefault();
        setErro(''); // Limpa erros anteriores

        // 1. Prepara um "cronômetro" de 5 segundos para a requisição
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
            const resposta = await fetch('https://api-eletronexo.onrender.com/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
                signal: controller.signal 
            });

            clearTimeout(timeoutId);

            const dados = await resposta.json();

            if (dados.sucesso) {
                localStorage.setItem('autenticado', 'true');
                localStorage.setItem('cargo', dados.cargo); 
                navigate('/dashboard'); 
            } else {
                setErro(dados.erro); 
            }
        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                // API demorou 
                setErro('Erro: A API demorou para responder.');
            } else {

                setErro('Erro: A API não respondeu.');
            }
        }
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${imagemFundo})` }}>
            {/* Máscara escura opcional sobre o fundo para dar contraste */}
            <div className="absolute inset-0 bg-slate-900/20"></div>
            
            {/* Container do Formulario (Vidro) */}
            <div className="relative bg-[#eef2f6]/95 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl w-full max-w-[360px] text-center border border-white/60">
                
                {/* Logo e Título */}
                <div className="mb-6 flex flex-col items-center">
                    <img 
                    src={logoEmpresa} 
                    alt="Logo da Empresa" 
                    className="h-16 w-auto object-contain mb-3 drop-shadow-md" 
                    />
                    <h2 className="text-2xl font-bold text-[#163354] tracking-wide mb-1">ELETRONEXO</h2>
                    <p className="text-xs font-semibold text-[#4e6a85]">Materiais Elétricos</p>
                </div>
                
                {/* O Formulario agora chama a função handleLogin */}
                <form className="space-y-4" onSubmit={handleLogin}>
                    
                    {/* Input Usuário */}
                    <div className="relative">
                        <UserIcon />
                        <input 
                            type="text" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="USUÁRIO" 
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#cbd5e1] bg-white text-sm text-[#163354] placeholder-slate-400 focus:ring-2 focus:ring-[#163354] outline-none transition font-medium" 
                        />
                    </div>

                    {/* Input Senha */}
                    <div className="relative">
                        <LockIcon />
                        <input 
                            type="password" 
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="SENHA" 
                            className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#cbd5e1] bg-white text-sm text-[#163354] placeholder-slate-400 focus:ring-2 focus:ring-[#163354] outline-none transition font-medium" 
                        />
                        <EyeIcon />
                    </div>

                    {/* Exibe mensagem de erro caso erre a senha */}
                    {erro && <p className="text-red-500 text-xs font-bold text-left px-1">{erro}</p>}

                    {/* Lembrar e Esqueceu a Senha */}
                    <div className="flex justify-between items-center px-1 text-[11px] font-bold text-[#163354] mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">

                        </label>
                        <a href="#" className="hover:underline hover:text-blue-600 transition"></a>
                    </div>

                    {/* Botão */}
                    <button type="submit" className="w-full py-3 bg-[#11243b] text-white rounded-xl font-bold hover:bg-[#1e3c60] transition shadow-lg mt-6 text-sm tracking-wide">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}