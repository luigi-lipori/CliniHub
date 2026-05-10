/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { DoorOpen, AlertTriangle, CheckCircle2, MoreVertical, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export const RoomList: React.FC = () => {
  const { rooms, setRooms } = useClinic();

  const toggleMaintenance = (id: string) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, inMaintenance: !r.inMaintenance } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Gestão de Salas</h2>
        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" />
          Nova Sala
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <motion.div 
            key={room.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white p-6 rounded-2xl border transition-all ${room.inMaintenance ? 'border-danger/30' : 'border-slate-100'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${room.inMaintenance ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                <DoorOpen className="w-6 h-6" />
              </div>
              <button className="text-slate-300 hover:text-slate-600">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="font-bold text-lg">{room.name}</h3>
            <p className="text-sm text-slate-500 mb-6">{room.description || 'Sala de atendimento clínico padrão'}</p>
            
            <div className={`flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-wider ${room.inMaintenance ? 'text-danger' : 'text-success'}`}>
              {room.inMaintenance ? (
                <>
                  <AlertTriangle className="w-4 h-4" /> Em Manutenção
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Disponível
                </>
              )}
            </div>
            
            <button 
              onClick={() => toggleMaintenance(room.id)}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors border ${room.inMaintenance ? 'bg-success/5 text-success border-success/20 hover:bg-success/10' : 'bg-danger/5 text-danger border-danger/20 hover:bg-danger/10'}`}
            >
              {room.inMaintenance ? 'Liberar Sala' : 'Colocar em Manutenção'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
