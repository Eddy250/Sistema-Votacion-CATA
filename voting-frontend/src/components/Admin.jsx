import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Users, Vote, Percent, Trash2, Edit3, PlusCircle, LayoutDashboard, UserCog, Image as ImageIcon, Download } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
    <div className={`p-4 rounded-xl ${color} bg-opacity-10`}>
      <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
    </div>
    <div>
      <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-black text-slate-800">{value}</h3>
    </div>
  </div>
);

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  
  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', foto: null });

  const loadData = async () => {
    try {
      const [resStats, resCand] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/candidatos')
      ]);
      setStats(resStats.data);
      setCandidatos(resCand.data);
    } catch (err) {
      console.error("Error cargando panel", err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleFileChange = (e) => {
    setFormData({ ...formData, foto: e.target.files[0] });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('descripcion', formData.descripcion);
    if (formData.foto) data.append('foto', formData.foto);

    try {
      if (editMode) {
        await api.put(`/admin/candidatos/${editMode}`, data, { headers: { 'Content-Type': 'multipart/form-data' }});
      } else {
        await api.post('/admin/candidatos', data, { headers: { 'Content-Type': 'multipart/form-data' }});
      }
      setShowModal(false);
      setFormData({ nombre: '', descripcion: '', foto: null });
      setEditMode(null);
      loadData();
    } catch (err) {
      alert("Error guardando candidato");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar el candidato y todos sus votos?")) return;
    try {
      await api.delete(`/admin/candidatos/${id}`);
      loadData();
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  if (!stats) return <div className="p-20 text-center animate-pulse font-bold text-slate-500">Cargando Panel Administrativo...</div>;

  const chartData = {
    labels: stats.chart_labels,
    datasets: [{
      label: 'Votos Obtenidos',
      data: stats.chart_data,
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderRadius: 8,
    }]
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
           <h1 className="text-4xl font-black text-slate-800 tracking-tight">Centro de Control</h1>
           <p className="text-slate-500 font-medium mt-1">Gestión de elecciones y recuento en tiempo real</p>
           <a href="http://127.0.0.1:5000/api/admin/export" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-sm transition-colors">
              <Download size={16} /> Exportar Auditoría en CSV (Excel)
           </a>
        </div>
        
        <div className="flex bg-white rounded-full shadow-sm p-1 border border-slate-100">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={18} /> Resultados
          </button>
          <button 
            onClick={() => setActiveTab('candidatos')} 
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'candidatos' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <UserCog size={18} /> Candidatos
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' ? (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
               <StatCard title="Padrón Total" value={stats.total_alumnos} icon={Users} color="bg-blue-500" />
               <StatCard title="Votos Emitidos" value={stats.votos_emitidos} icon={Vote} color="bg-green-500" />
               <StatCard title="Participación" value={`${stats.porcentaje_participacion}%`} icon={Percent} color="bg-purple-500" />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
               <h3 className="text-lg font-bold text-slate-700 mb-6">Distribución de Votos</h3>
               <div className="h-80"><Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
            </div>
            
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider border-b border-slate-100">
                        <th className="p-5">Candidato</th>
                        <th className="p-5 text-right">Votos</th>
                        <th className="p-5 text-right">Porcentaje</th>
                     </tr>
                  </thead>
                  <tbody>
                     {stats.resultados.map((r, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                           <td className="p-5 font-bold text-slate-800">{r.nombre}</td>
                           <td className="p-5 text-right font-medium text-slate-600">{r.votos}</td>
                           <td className="p-5 text-right font-bold text-indigo-600">{r.porcentaje}%</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </motion.div>
        ) : (
          <motion.div key="candidatos" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-slate-800">Candidatos Registrados</h3>
               <button 
                 onClick={() => { setEditMode(null); setFormData({ nombre: '', descripcion: '', foto: null }); setShowModal(true); }}
                 className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-full shadow-lg transition-colors"
               >
                 <PlusCircle size={18} /> Añadir Candidato
               </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {candidatos.map(c => (
                <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                   <div className="h-40 bg-slate-100 relative">
                      {c.foto ? (
                        <img src={`http://127.0.0.1:5000${c.foto}`} className="w-full h-full object-cover" alt="foto" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={40} /></div>
                      )}
                   </div>
                   <div className="p-5 flex-grow">
                      <h4 className="font-bold text-lg text-slate-800">{c.nombre}</h4>
                      <p className="text-slate-500 text-sm mt-1 line-clamp-2">{c.descripcion}</p>
                   </div>
                   <div className="grid grid-cols-2 border-t border-slate-100">
                      <button 
                        onClick={() => { setEditMode(c.id); setFormData({ nombre: c.nombre, descripcion: c.descripcion || '', foto: null }); setShowModal(true); }}
                        className="py-3 px-4 text-center font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors border-r border-slate-100"
                      >
                         <Edit3 size={16} /> Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="py-3 px-4 text-center font-bold text-red-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
                      >
                         <Trash2 size={16} /> Eliminar
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-2xl font-black text-slate-800 mb-6">{editMode ? 'Editar Candidato' : 'Nuevo Candidato'}</h3>
                <form onSubmit={handleSave} className="space-y-5">
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Completo</label>
                     <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none" required />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Descripción / Partido</label>
                     <textarea value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none" rows="3"></textarea>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Fotografía (.jpg, .png)</label>
                     <input type="file" accept="image/*" onChange={handleFileChange} className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                   </div>
                   <div className="flex gap-4 mt-8">
                     <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancelar</button>
                     <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors">Guardar</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
