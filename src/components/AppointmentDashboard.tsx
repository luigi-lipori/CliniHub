/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Plus, Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppointmentStatus } from '../types';

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 20; hour++) {
    for (let min = 0; min < 60; min += 20) {
      slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

export const AppointmentDashboard: React.FC<{ onNewAppointment: () => void }> = ({ onNewAppointment }) => {
  const { appointments, rooms, doctors, patients } = useClinic();
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  
  // Estados para a Seleção com Busca
  const [search, setSearch] = useState('');
  const [isPatientListOpen, setIsPatientListOpen] = useState(false);
  const patientRef = useRef<HTMLDivElement>(null);

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  // Filtra a lista de sugestões de pacientes para o dropdown
  const patientSuggestions = useMemo(() => {
    if (!search) return [];
    return patients.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.cpf.includes(search)
    );
  }, [patients, search]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (patientRef.current && !patientRef.current.contains(event.target as Node)) {
        setIsPatientListOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtra as consultas da agenda globalmente
  const filteredAppointments = appointments.filter(app => {
    if (selectedRoom !== 'all' && app.roomId !== selectedRoom) return false;
    if (selectedDoctor !== 'all' && app.doctorId !== selectedDoctor) return false;
    if (search && !app.patientName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-3 items-center flex-1 w-full">
          
          {/* BUSCA DE PACIENTE COM SELEÇÃO */}
          <div className="relative flex-1 max-w-xs" ref={patientRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Pesquisar paciente..."
              className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsPatientListOpen(true);
              }}
              onFocus={() => setIsPatientListOpen(true)}
            />
            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3 transition-transform ${isPatientListOpen ? 'rotate-180' : ''}`} />

            <AnimatePresence>
              {isPatientListOpen && patientSuggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto"
                >
                  {patientSuggestions.map(p => (
                    <button
                      key={p.id}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex flex-col transition-colors border-b border-slate-50 last:border-0"
                      onClick={() => {
                        setSearch(p.name);
                        setIsPatientListOpen(false);
                      }}
                    >
                      <span className="font-bold text-slate-700 text-xs">{p.name}</span>
                      <span className="text-[9px] text-slate-400 uppercase">CPF: {p.cpf}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            <option value="all">Todas as Salas</option>
            {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
          </select>
          
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="all">Todos os Médicos</option>
            {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
          </select>
        </div>
        
        <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><ChevronLeft className="w-5 h-5"/></button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><ChevronRight className="w-5 h-5"/></button>
            <button 
                onClick={onNewAppointment}
                className="flex items-center gap-2 bg-success text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-success/90 transition-all shadow-lg shadow-success/20 ml-2"
            >
                <Plus className="w-5 h-5" />
                Nova Consulta
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-slate-100 bg-slate-50/50">
          <div className="p-4 border-r border-slate-100 text-[10px] font-bold text-slate-400 uppercase text-center flex items-center justify-center">Hora</div>
          {weekDays.map((day, i) => (
            <div key={day} className="p-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500 border-r border-slate-100 last:border-r-0">
              {day} <span className="block text-[10px] opacity-50 font-medium">{11 + i}/05</span>
            </div>
          ))}
        </div>
        
        <div className="max-h-[600px] overflow-y-auto">
          {TIME_SLOTS.map((time) => (
            <div key={time} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-slate-50 min-h-[65px]">
              <div className="p-2 text-[11px] font-bold text-slate-400 text-right border-r border-slate-100 bg-slate-50/20 flex items-center justify-end pr-4">
                {time}
              </div>

              {Array.from({ length: 7 }).map((_, i) => {
                const dayOfMonth = 11 + i;
                
                // MUDANÇA AQUI: Usando .filter() em vez de .find() para pegar todas as consultas do horário
                const slotAppointments = filteredAppointments.filter(app => {
                  const d = new Date(app.dateTime);
                  const appTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  return d.getDate() === dayOfMonth && appTime === time;
                });

                return (
                  <div key={i} className="border-r border-slate-50 p-1 hover:bg-blue-50/10 transition-colors relative flex flex-col gap-1">
                    {slotAppointments.map((appointment) => (
                      <motion.div 
                        key={appointment.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        // Adicionando flex-1 para dividirem o espaço e min-h-0 para evitar transbordamento
                        className={`flex-1 min-h-0 w-full border-l-4 p-1.5 rounded shadow-sm overflow-hidden flex flex-col justify-center ${
                            appointment.status === AppointmentStatus.CANCELLED ? 'bg-slate-100 border-slate-300 text-slate-500' :
                            appointment.status === AppointmentStatus.COMPLETED ? 'bg-emerald-50 border-emerald-500 text-emerald-700' :
                            'bg-secondary/10 border-secondary text-secondary-dark'
                          }`}
                        title={`${appointment.patientName} com ${appointment.doctorName}`} // Adiciona um tooltip nativo ao passar o mouse
                      >
                        <div className="text-[10px] font-bold truncate leading-tight">{appointment.patientName}</div>
                        {/* Se houver muitos agendamentos na mesma célula, oculta o nome do médico para não quebrar a UI visualmente */}
                        {slotAppointments.length < 3 && (
                          <div className="text-[8px] opacity-70 truncate italic mt-0.5">{appointment.doctorName}</div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};