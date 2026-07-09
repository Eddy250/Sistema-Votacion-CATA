import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Voting from './components/Voting';
import Admin from './components/Admin';

const App = () => {
  const [voter, setVoter] = useState(null);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 text-slate-800 font-sans">
      {/* Dynamic background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400 opacity-20 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500 opacity-20 blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 text-center shadow-sm bg-white/50 backdrop-blur-md border-b border-white/20">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 drop-shadow-sm">Elecciones de Alcaldía Estudiantil</h1>
            <p className="mt-2 text-indigo-900/60 font-semibold tracking-wide uppercase text-sm">Colegio Adventista Tupac Amaru - Plataforma V2</p>
        </header>

        <main className="flex-grow flex items-center justify-center p-6">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login setVoter={setVoter} />} />
              <Route 
                path="/voto" 
                element={voter ? <Voting voter={voter} setVoter={setVoter} /> : <Navigate to="/" />} 
              />
              <Route path="/admin" element={<Admin />} />
              <Route path="/exito" element={<div className="p-10 text-center bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-green-200 inline-block mt-20"><h2 className="text-4xl text-green-600 font-extrabold mb-4">¡Voto Guardado con Éxito! ✓</h2><p className="text-slate-700 text-lg font-medium">Acabamos de disparar la automatización al equipo central de procesamiento.</p><p className="text-indigo-500 mt-2 font-semibold">Tú (y el correo de prueba) están recibiendo un comprobante oficial de sufragio ahora mismo. Revisa tu buzón.</p><p className="mt-8 text-sm text-gray-400">Puedes cerrar esta ventana.</p></div>} />
            </Routes>
          </BrowserRouter>
        </main>
      </div>
    </div>
  );
};

export default App;
