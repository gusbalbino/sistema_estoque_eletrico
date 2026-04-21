import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FormProduto from './pages/FormProduto';
import Movimentacao from './pages/Movimentacao';
import Historico from './pages/Historico';
import CadastroUsuarios from './pages/CadastroUsuarios';
import logoEmpresa from './assets/logo.png'; 

// Segurança Padrão (Exige Login)
const RotaProtegida = ({ children }) => {
    if (!localStorage.getItem('autenticado')) return <Navigate to="/" replace />;
    return children;
};

// Segurança de Gestão (Exige ser Admin OU Gerente)
const RotaGestao = ({ children }) => {
    const cargo = localStorage.getItem('cargo');
    // Se for funcionário, joga de volta pro Dashboard
    if (cargo !== 'admin' && cargo !== 'gerente') return <Navigate to="/dashboard" replace />;
    return children;
};

const Navbar = () => {
    const loc = useLocation();
    const navigate = useNavigate();
    
    if (loc.pathname === '/') return null;

    const cargo = localStorage.getItem('cargo'); 

    const handleSair = () => {
        localStorage.removeItem('autenticado'); 
        localStorage.removeItem('cargo'); 
        navigate('/'); 
    };

    return (
        <nav className="bg-white border-b border-slate-200 py-3 px-8 flex justify-between items-center mb-8 shadow-sm">
            <div className="flex items-center gap-3">
                <img src={logoEmpresa} alt="Logo" className="h-9 w-auto object-contain" />
                <span className="text-xl font-bold tracking-tighter text-[#163354]">ELETRONEXO</span>
            </div>

            <div className="flex gap-6 text-sm font-semibold text-slate-500 items-center">
                <Link to="/dashboard" className="hover:text-blue-600 transition">Estoque</Link>
                <Link to="/movimentar" className="hover:text-blue-600 transition">Movimentar</Link> 
                <Link to="/historico" className="hover:text-blue-600 transition">Histórico</Link>
                
                {/* BOTÃO LIBERADO PARA ADMIN E GERENTE */}
                {(cargo === 'admin' || cargo === 'gerente') && (
                    <Link to="/usuarios" className="text-[#163354] bg-slate-100 px-3 py-1.5 rounded-md hover:bg-slate-200 transition">
                        Gerenciar Usuários
                    </Link>
                )}
                
                <button onClick={handleSair} className="ml-4 text-red-400 hover:text-red-600 flex items-center gap-1 cursor-pointer bg-transparent border-none">
                    Sair
                </button>
            </div>
        </nav>
    );
};

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900">
                <Navbar />
                <div className="max-w-5xl mx-auto px-4">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
                        <Route path="/novo" element={<RotaProtegida><FormProduto /></RotaProtegida>} />
                        <Route path="/movimentar" element={<RotaProtegida><Movimentacao /></RotaProtegida>} />
                        <Route path="/historico" element={<RotaProtegida><Historico /></RotaProtegida>} />
                        
                        {/* ROTA PROTEGIDA PELA GESTÃO */}
                        <Route path="/usuarios" element={
                            <RotaProtegida>
                                <RotaGestao>
                                    <CadastroUsuarios />
                                </RotaGestao>
                            </RotaProtegida>
                        } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}