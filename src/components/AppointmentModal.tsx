/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { X, Calendar, Clock, User, DoorOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppointmentStatus } from '../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
  const { patients, doctors, rooms, addAppointment } = useClinic();
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    roomId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 30,
  });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const selectedPatient = patients.find(p => p.id === formData.patientId);
    const selectedDoctor = doctors.find(d => d.id === formData.doctorId);
    const selectedRoom = rooms.find(r => r.id === formData.roomId);

    if (!selectedPatient || !selectedDoctor || !selectedRoom) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const success = addAppointment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      dateTime: `${formData.date}T${formData.time}:00`,
      durationMinutes: formData.duration,
      status: AppointmentStatus.SCHEDULED,
    });

    if (success) {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 1500);
    } else {
      setError('Choque de horário! O médico ou a sala já estão ocupados neste período.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl relative"
          >
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-6 h-6 text-secondary" />
                Agendar Nova Consulta
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                  <p className="text-sm text-danger font-medium leading-normal">{error}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <User className="w-3 h-3" /> Paciente
                  </label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/20 outline-none"
                    value={formData.patientId}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                    required
                  >
                    <option value="">Selecione o paciente...</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <User className="w-3 h-3" /> Médico
                  </label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/20 outline-none"
                    value={formData.doctorId}
                    onChange={(e) => setFormData(prev => ({ ...prev, doctorId: e.target.value }))}
                    required
                  >
                    <option value="">Selecione o médico...</option>
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <DoorOpen className="w-3 h-3" /> Sala de Atendimento
                  </label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/20 outline-none"
                    value={formData.roomId}
                    onChange={(e) => setFormData(prev => ({ ...prev, roomId: e.target.value }))}
                    required
                  >
                    <option value="">Selecione a sala...</option>
                    {rooms.map(r => <option key={r.id} value={r.id} disabled={r.inMaintenance}>{r.name} {r.inMaintenance ? '(Manutenção)' : ''}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Data
                  </label>
                  <input 
                    type="date"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/20 outline-none"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Horário
                  </label>
                  <input 
                    type="time"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary/20 outline-none"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={status === 'success'}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                    status === 'success' 
                      ? 'bg-success text-white' 
                      : 'bg-secondary text-white hover:bg-secondary/90 shadow-secondary/20'
                  }`}
                >
                  {status === 'success' ? (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      Consulta Agendada!
                    </>
                  ) : (
                    'Confirmar Agendamento'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
