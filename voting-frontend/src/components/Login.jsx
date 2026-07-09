import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { KeyRound, LogIn } from 'lucide-react';

const Login = ({ setVoter }) => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/login', { codigo });
      if (response.data.success) {
        setVoter(response.data.voter);
        navigate('/voto');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-8 md:p-10 max-w-md w-full my-auto mt-10 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto bg-indigo-50/50 rounded-full flex items-center justify-center mb-5 border border-indigo-100 shadow-inner">
          <KeyRound className="w-10 h-10 text-indigo-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Acceso a Votación</h2>
        <p className="text-slate-500 mt-2 text-sm font-medium">Ingresa tu código único de estudiante para ejercer tu voto electrónico corporativo.</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 mb-6 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-bold flex items-center gap-2">
          <span>⚠️</span> {error}
        </motion.div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Código Privado</label>
          <input 
            type="text" 
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="w-full px-5 py-4 bg-white/60 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl outline-none transition-all font-bold text-lg placeholder:text-slate-300 placeholder:font-normal shadow-sm"
            placeholder="Ejemplo: 2023001"
            required
            autoComplete="off"
            autoFocus
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-lg py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:-translate-y-0 transform active:scale-[0.98]"
        >
          {loading ? 'Verificando Sistema...' : (
            <>Ingresar a Urna Virtual <LogIn className="w-6 h-6" /></>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default Login;
