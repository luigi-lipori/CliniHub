/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { UserCircle, Shield, ArrowRight, Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DoctorList: React.FC<{ onAccessEHR: (doctorName: string) => void }> = ({ onAccessEHR }) => {
  const { doctors } = useClinic();
  const [passwordModal, setPasswordModal] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') { // Simulação do protótipo
      onAccessEHR(passwordModal!);
      setPasswordModal(null);
      setPassword('');
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-primary">Corpo Clínico</h2>
        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          Novo Médico
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <motion.div 
            key={doctor.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                <UserCircle className="w-8 h-8" />
              </div>
              <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {doctor.specialty}
              </div>
            </div>
            
            <h3 className="font-bold text-lg mb-1">{doctor.name}</h3>
            <p className="text-sm text-slate-500 mb-6 flex items-center gap-1.5">
              <span className="font-semibold text-slate-700">CRM:</span> {doctor.crm}
            </p>
            
            <button 
              onClick={() => setPasswordModal(doctor.name)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-secondary transition-colors"
            >
              <Shield className="w-4 h-4" />
              Acessar Prontuários
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Password Modal */}
      <AnimatePresence>
        {passwordModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setPasswordModal(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-primary">Acesso ao Médico</h3>
                <p className="text-sm text-slate-500 mt-2">Acesso restrito para <span className="font-bold text-secondary">{passwordModal}</span></p>
              </div>
              
              <form onSubmit={handleAccess} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Digite sua senha</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    autoFocus
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all ${error ? 'border-danger ring-2 ring-danger/10' : 'border-slate-200'}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && <p className="text-[10px] text-danger font-bold mt-2 uppercase tracking-tight">Senha incorreta. Tente novamente.</p>}
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-4 bg-secondary text-white rounded-xl font-bold shadow-lg shadow-secondary/30 hover:bg-secondary/90 transform hover:-translate-y-0.5 transition-all"
                >
                  Confirmar Acesso
                </button>
              </form>
              
              <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-wider font-medium">Use a senha de teste: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">1234</span></p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
