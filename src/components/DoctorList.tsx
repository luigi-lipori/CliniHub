/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { UserCircle, Shield, ArrowRight, Plus, X, Check, Mail, Award, Contact, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Lista das 10 principais especialidades clínicas
const SPECIALTIES = [
  "Clínica Médica",
  "Cardiologia",
  "Pediatria",
  "Dermatologia",
  "Ginecologia",
  "Ortopedia",
  "Psiquiatria",
  "Oftalmologia",
  "Neurologia",
  "Endocrinologia"
];

export const DoctorList: React.FC<{ onAccessEHR: (doctorName: string) => void }> = ({ onAccessEHR }) => {
  const { doctors, addDoctor } = useClinic();
  
  const [isAdding, setIsAdding] = useState(false);
  const [newDoctorData, setNewDoctorData] = useState({
    name: '',
    specialty: 'Clínica Médica', // Valor padrão inicial
    crm: '',
    email: ''
  });

  const [passwordModal, setPasswordModal] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [errorModal, setErrorModal] = useState(false);

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorData.name.trim()) return;

    addDoctor({
      name: newDoctorData.name,
      specialty: newDoctorData.specialty,
      crm: newDoctorData.crm || '00000-UF',
      email: newDoctorData.email || 'contato@clinihub.com'
    });

    setNewDoctorData({ name: '', specialty: 'Clínica Médica', crm: '', email: '' });
    setIsAdding(false);
  };

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      onAccessEHR(passwordModal!);
      setPasswordModal(null);
      setPassword('');
      setErrorModal(false);
    } else {
      setErrorModal(true);
    }
  };

  const inputClassName = "w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary focus:bg-white transition-all shadow-inner appearance-none";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-primary">Corpo Clínico</h2>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md ${
            isAdding 
            ? 'bg-slate-100 text-slate-500' 
            : 'bg-primary text-white hover:bg-primary/90 shadow-primary/10'
          }`}
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancelar' : 'Novo Médico'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSaveDoctor}
            className="bg-white p-6 rounded-2xl border border-secondary/20 shadow-xl space-y-5"
          >
            <h3 className="text-sm font-bold text-secondary uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4" /> Cadastrar Profissional
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Nome */}
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" placeholder="Nome" className={inputClassName}
                  value={newDoctorData.name} onChange={(e) => setNewDoctorData(p => ({...p, name: e.target.value}))} required
                />
              </div>

              {/* Especialidade (Select Listado) */}
              <div className="relative">
                <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
                <select 
                  className={inputClassName}
                  value={newDoctorData.specialty} 
                  onChange={(e) => setNewDoctorData(p => ({...p, specialty: e.target.value}))}
                >
                  {SPECIALTIES.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* CRM */}
              <div className="relative">
                <Contact className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" placeholder="CRM" className={inputClassName}
                  value={newDoctorData.crm} onChange={(e) => setNewDoctorData(p => ({...p, crm: e.target.value}))}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="email" placeholder="E-mail" className={inputClassName}
                  value={newDoctorData.email} onChange={(e) => setNewDoctorData(p => ({...p, email: e.target.value}))}
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" className="bg-secondary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/10">
                <Check className="w-5 h-5" /> Salvar Médico
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

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

      <AnimatePresence>
        {passwordModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl relative"
            >
              <button onClick={() => setPasswordModal(null)} className="absolute top-6 right-6 text-slate-400">&times;</button>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-primary">Acesso Restrito</h3>
                <p className="text-sm text-slate-500 mt-2">{passwordModal}</p>
              </div>
              <form onSubmit={handleAccess} className="space-y-4">
                <input 
                  type="password" placeholder="••••••••" autoFocus
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 ${errorModal ? 'border-danger ring-danger/10' : 'border-slate-200 ring-secondary/10'}`}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="w-full py-4 bg-secondary text-white rounded-xl font-bold shadow-lg">Confirmar</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};