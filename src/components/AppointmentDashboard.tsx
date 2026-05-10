/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Plus, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppointmentStatus } from '../types';

export const AppointmentDashboard: React.FC<{ onNewAppointment: () => void }> = ({ onNewAppointment }) => {
  const { appointments, rooms, doctors } = useClinic();
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
  const [search, setSearch] = useState('');

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  
  // Basic mock list for the week (just showing current week for simplicity in the grid)
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
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Pesquisar paciente..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            <option value="all">Todas as Salas</option>
            {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
          </select>
          
          <select 
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="all">Todos os Médicos</option>
            {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
          </select>
        </div>
        
        <button 
          onClick={onNewAppointment}
          className="flex items-center gap-2 bg-success text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-success/90 transition-all shadow-lg shadow-success/20 w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Nova Consulta
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {weekDays.map(day => (
            <div key={day} className="p-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
          {Array.from({ length: 7 }).map((_, i) => {
            const dayAppointments = filteredAppointments.filter(app => {
              const d = new Date(app.dateTime);
              // Simple check: match day of month for the mock demo week
              // In reality, this would be based on a selected date range
              return true; // Simple logic for prototype: show all filtered in grid cells
            });

            return (
              <div key={i} className="day-cell p-2 hover:bg-slate-50/30 transition-colors group relative">
                <div className="text-right text-xs text-slate-400 font-medium mb-2 group-hover:text-secondary group-hover:font-bold">
                  {11 + i} {/* Mock date */}
                </div>
                
                <div className="space-y-px">
                  {dayAppointments.slice(0, 3).map(app => (
                    <motion.div 
                      key={app.id} 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-[10px] p-1.5 rounded border-l-4 leading-tight truncate shadow-sm mb-1 ${
                        app.status === AppointmentStatus.CANCELLED ? 'bg-slate-100 border-slate-300 text-slate-500 line-through' :
                        app.status === AppointmentStatus.COMPLETED ? 'bg-emerald-50 border-emerald-500 text-emerald-700' :
                        'bg-secondary/10 border-secondary text-secondary-dark'
                      }`}
                    >
                      <div className="font-bold">{new Date(app.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div className="truncate">{app.patientName}</div>
                      <div className="text-[9px] opacity-70 italic">{app.doctorName}</div>
                    </motion.div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-[9px] text-center text-slate-400 font-medium py-1">
                      + {dayAppointments.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
