/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Search, Plus, Phone, Calendar, User, MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';

export const PatientList: React.FC = () => {
  const { patients, addPatient } = useClinic();
  const [search, setSearch] = useState('');

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.cpf.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-primary">Pacientes</h2>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Nome ou CPF..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="bg-success text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-success/90 transition-all shadow-md shadow-success/10">
            <Plus className="w-5 h-5" />
            Novo Paciente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPatients.map((patient) => (
          <motion.div 
            key={patient.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-secondary/30 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{patient.name}</h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {patient.phone}</span>
                  <span className="flex items-center gap-1 font-mono uppercase tracking-tighter">CPF: {patient.cpf}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-xs font-bold text-primary hover:bg-slate-50 rounded-lg transition-colors">
                Editar
              </button>
              <button className="px-4 py-2 text-xs font-bold text-secondary hover:bg-secondary/5 rounded-lg transition-colors">
                Ver Prontuário
              </button>
              <button className="p-2 text-slate-300 hover:text-slate-600 rounded-full">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
