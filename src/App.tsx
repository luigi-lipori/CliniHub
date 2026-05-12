/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClinicProvider } from './context/ClinicContext';
import { Sidebar } from './components/Sidebar';
import { AppointmentDashboard } from './components/AppointmentDashboard';
import { DoctorList } from './components/DoctorList';
import { PatientList } from './components/PatientList';
import { RoomList } from './components/RoomList';
import { EHRView } from './components/EHRView';
import { AppointmentModal } from './components/AppointmentModal';
import { motion, AnimatePresence } from 'motion/react';
import { DoctorDashboard } from './components/DoctorDashboard';
import { DoctorSchedule } from './components/DoctorSchedule';

const AppContent: React.FC = () => {
  const [activeView, setActiveView] = useState('agenda');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessDoctorEHR, setAccessDoctorEHR] = useState<string | null>(null);

  const handleAccessRestrito = (doctorName: string) => {
    setAccessDoctorEHR(doctorName);
    setActiveView('doctor-dashboard');
  };

  const renderView = () => {
    switch (activeView) {
      case 'agenda':
        return <AppointmentDashboard onNewAppointment={() => setIsModalOpen(true)} />;
      case 'doctors':
        return <DoctorList onAccessRestrito={handleAccessRestrito} />;
      case 'patients':
        return <PatientList />;
      case 'rooms':
        return <RoomList />;
      case 'ehr':
        return (
          <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-primary mb-4">Acesso aos Prontuários</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">Os prontuários são de acesso restrito aos médicos. Por favor, selecione um médico na aba "Corpo Clínico" para autenticar e visualizar os dados.</p>
            <button 
              onClick={() => setActiveView('doctors')}
              className="bg-secondary text-white px-8 py-3 rounded-2xl font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20"
            >
              Ir para Corpo Clínico
            </button>
          </div>
        );
      case 'ehr-view':
        return (
          <EHRView 
            doctorName={accessDoctorEHR || 'Médico'} 
            onBack={() => setActiveView('doctor-dashboard')} 
          />
        );
      case 'doctor-dashboard':
        return (
          <DoctorDashboard 
            doctorName={accessDoctorEHR || 'Médico'} 
            onViewChange={setActiveView} 
          />
        );
      case 'doctor-schedule':
        return (
          <DoctorSchedule 
            doctorName={accessDoctorEHR || 'Médico'} 
            onBack={() => setActiveView('doctor-dashboard')} 
          />
        );
      case 'config':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-primary mb-2">Configurações</h2>
            <p className="text-slate-500">Gerenciamento de usuários, backup do sistema e auditoria.</p>
          </div>
        );
      default:
        return <AppointmentDashboard onNewAppointment={() => setIsModalOpen(true)} />;
    }
  };

  // Aqui é onde o return com os novos títulos do header foi "enfiado"
  return (
    <div className="flex bg-clini-bg min-h-screen">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <main className="flex-1 ml-56 p-10 max-w-7xl">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {activeView === 'agenda' ? 'Dashboard Geral' : 
               activeView === 'doctors' ? 'Corpo Clínico' :
               activeView === 'patients' ? 'Gestão de Pacientes' :
               activeView === 'rooms' ? 'Infraestrutura' :
               activeView === 'ehr' ? 'Prontuários' :
               activeView === 'doctor-dashboard' ? 'Acesso Restrito' :
               activeView === 'doctor-schedule' ? 'Gerenciamento de Grade' :
               activeView === 'ehr-view' ? 'Prontuário Eletrônico' : 'Configurações'}
            </h1>
            <p className="text-slate-500 mt-1 font-medium italic">Bem-vindo ao CliniHub v1.0</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data de Hoje</p>
                <p className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
             </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <ClinicProvider>
      <AppContent />
    </ClinicProvider>
  );
}