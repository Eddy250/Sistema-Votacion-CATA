import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, LogOut, CheckCircle2 } from 'lucide-react';

const Voting = ({ voter, setVoter }) => {
  const [candidatos, setCandidatos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidatos = async () => {
      try {
        const response = await api.get('/candidatos');
        setCandidatos(response.data);
      } catch (err) {
        console.error("Error cargando candidatos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidatos();
  }, []);

  const handleVote = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await api.post('/voto', {
        voter_codigo: voter.codigo,
        candidato_id: selected,
      });
      setSuccess(true);
      setTimeout(() => {
        setVoter(null);
        navigate('/');
      }, 4000);
    } catch (err) {
      alert("Uh oh! Hubo un error al guardar tu voto.");
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: 'spring', delay: 0.2 }}
          className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner"
        >
          <CheckCircle2 className="w-14 h-14 text-green-500" />
        </motion.div>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">¡Voto Registrado Exitosamente!</h2>
        <p className="text-slate-600 text-lg mb-8">Gracias por cumplir con tu deber civil, <strong>{voter.nombre}</strong>.</p>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden shadow-inner">
           <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: '100%' }} 
              transition={{ duration: 4, ease: "linear" }}
              className="bg-green-500 h-full"
           />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-6xl w-full mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/70 backdrop-blur-md p-4 md:px-8 rounded-3xl shadow-sm border border-white mb-10 gap-4">
        <div>
           <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Cédula de Sufragio</h2>
           <p className="text-xs text-indigo-600 font-bold tracking-widest uppercase">Elecciones Generales</p>
        </div>
        <div className="flex items-center gap-4">
           <span className="bg-white text-indigo-800 py-2 px-6 rounded-full font-bold text-sm shadow-sm border border-indigo-100">
             Votante: {voter.codigo}
           </span>
           <button onClick={() => { setVoter(null); navigate('/') }} className="text-slate-400 hover:text-red-500 p-2 transition-colors bg-white rounded-full shadow-sm hover:shadow">
              <LogOut className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
           <p className="text-center md:col-span-2 lg:col-span-3 py-20 text-slate-400 animate-pulse font-bold text-xl">Descargando padrón de candidatos...</p>
        ) : (
          candidatos.map((c) => (
             <motion.div
                key={c.id}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(c.id)}
                className={`cursor-pointer rounded-3xl overflow-hidden bg-white shadow-lg border-[3px] transition-all duration-300 relative group
                  ${selected === c.id ? 'border-indigo-500 shadow-indigo-300/50 shadow-2xl scale-[1.02]' : 'border-transparent hover:border-indigo-100'}
                `}
             >
                <div className="h-64 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                   {c.foto ? (
                      <img src={`http://127.0.0.1:5000${c.foto}`} alt={c.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-200 bg-indigo-50/30 transition duration-700 group-hover:scale-105">
                         <span className="text-6xl font-black opacity-20">{c.nombre.charAt(0)}</span>
                      </div>
                   )}

                   {/* Marca Roja X dinámica */}
                   <AnimatePresence>
                     {selected === c.id && (
                       <motion.div 
                         initial={{ opacity: 0, filter: 'blur(10px)' }}
                         animate={{ opacity: 1, filter: 'blur(0px)' }}
                         exit={{ opacity: 0 }}
                         className="absolute inset-0 bg-red-400/20 flex items-center justify-center mix-blend-multiply z-10"
                       >
                         <svg className="w-full h-full text-red-600 p-8 drop-shadow-2xl" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <motion.path 
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                              strokeLinecap="round" strokeLinejoin="round" d="M4 20L20 4M4 4l16 16"
                            />
                         </svg>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
                
                <div className="p-6 text-center bg-white relative z-20">
                   <h3 className="text-2xl font-black text-slate-800 tracking-tight">{c.nombre}</h3>
                   <p className="text-slate-500 text-sm mt-2 font-medium line-clamp-2">{c.descripcion || "Postulante a la Alcaldía"}</p>
                </div>
             </motion.div>
          ))
        )}
      </div>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none">
         <motion.button 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: selected ? 1 : 0 }}
            onClick={handleVote}
            disabled={!selected || submitting}
            className={`
              pointer-events-auto flex items-center justify-center gap-3 px-12 py-5 rounded-full font-black text-xl text-white shadow-2xl transition-all
              ${selected && !submitting ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-indigo-500/40 hover:-translate-y-1' : 'bg-slate-300 cursor-not-allowed'}
            `}
         >
            {submitting ? 'Asegurando Voto...' : (
              <>Confirmar Sufragio <Check className="w-6 h-6 stroke-[3px]" /></>
            )}
         </motion.button>
      </div>
    </div>
  );
};

export default Voting;
