/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { ArrowLeft, Save, ClipboardList, History, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EHRViewProps {
  doctorName: string;
  onBack: () => void;
}

export const EHRView: React.FC<EHRViewProps> = ({ doctorName, onBack }) => {
  const { patients, ehrRecords, setEhrRecords } = useClinic();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [evolution, setEvolution] = useState('');
  const [search, setSearch] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientHistory = ehrRecords.filter(r => r.patientId === selectedPatientId);

  const handleSave = () => {
    if (!evolution || !selectedPatientId) return;
    setIsSaving(true);
    
    const newRecord = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: selectedPatientId,
      doctorId: doctorName, // Using name as ID for demo
      date: new Date().toISOString(),
      evolution,
    };

    setTimeout(() => {
      setEhrRecords(prev => [newRecord, ...prev]);
      setEvolution('');
      setIsSaving(false);
      // Optional: show success toast
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-primary">Prontuários eletrônicos</h2>
          <p className="text-sm text-slate-500">Médico: <span className="font-bold text-secondary">{doctorName}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Patient Selection Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar paciente para evolução..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm max-h-[500px] overflow-y-auto">
            {patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`w-full p-4 text-left border-b border-slate-50 transition-all flex items-center gap-3 ${selectedPatientId === p.id ? 'bg-secondary/5 border-l-4 border-l-secondary' : 'hover:bg-slate-50'}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${selectedPatientId === p.id ? 'bg-secondary text-white' : 'bg-slate-100 text-slate-400'}`}>
                   {p.name.charAt(0)}
                </div>
                <div>
                   <p className={`text-sm font-bold ${selectedPatientId === p.id ? 'text-secondary' : 'text-slate-700'}`}>{p.name}</p>
                   <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Nasc: {p.birthDate}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* EHR Editor */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedPatient ? (
              <motion.div 
                key={selectedPatient.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                        <ClipboardList className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{selectedPatient.name}</h3>
                        <p className="text-sm text-slate-500">CPF: {selectedPatient.cpf}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Última Atualização</p>
                       <p className="text-sm font-bold text-slate-700">{patientHistory[0]?.date ? new Date(patientHistory[0].date).toLocaleDateString() : 'Nenhuma'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block pb-1">Evolução Clínica do Dia</label>
                    <textarea 
                      placeholder="Descreva aqui o quadro clínico, diagnóstico e prescrições..."
                      className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-slate-700 leading-relaxed resize-none"
                      value={evolution}
                      onChange={(e) => setEvolution(e.target.value)}
                    />
                    <div className="flex justify-end pt-2">
                       <button 
                         onClick={handleSave}
                         disabled={!evolution || isSaving}
                         className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${!evolution || isSaving ? 'bg-slate-200 text-slate-400' : 'bg-success text-white hover:bg-success/90 shadow-success/20 transform hover:-translate-y-0.5'}`}
                       >
                         {isSaving ? 'Salvando...' : (
                           <>
                             <Save className="w-5 h-5" />
                             Salvar Evolução
                           </>
                         )}
                       </button>
                    </div>
                  </div>
                </div>

                {/* History */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                    <History className="w-4 h-4" /> Histórico de Evoluções
                  </h4>
                  {patientHistory.length > 0 ? (
                    <div className="space-y-4">
                      {patientHistory.map(record => (
                        <div key={record.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-secondary/30"></div>
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-bold text-secondary bg-secondary/5 px-2 py-1 rounded">
                              {new Date(record.date).toLocaleDateString()} {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Médico: {record.doctorId}</span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{record.evolution}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 p-12 rounded-3xl text-center">
                       <p className="text-slate-400 font-medium">Nenhum histórico disponível para este paciente.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-slate-100 border-dashed">
                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
                  <ClipboardList className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Selecione um paciente</h3>
                <p className="text-slate-400 max-w-xs mx-auto">Selecione um paciente na lista ao lado para visualizar o histórico e registrar novas evoluções clínicas.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
