/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, Doctor, Room, Appointment, EHRRecord, UserRole, UserProfile } from '../types';

interface ClinicContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  ehrRecords: EHRRecord[];
  setEhrRecords: React.Dispatch<React.SetStateAction<EHRRecord[]>>;
  
  doctorSchedules: Record<string, string[]>;
  updateDoctorSchedule: (doctorName: string, slots: string[]) => void;
  canDoctorAccessPatient: (doctorId: string, patientId: string) => boolean; 
  
  // Helpers de Criação
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void; 
  addRoom: (room: Omit<Room, 'id'>) => void;     
  addAppointment: (appointment: Omit<Appointment, 'id'>) => boolean;

  // Helpers de Edição
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;

  // --- NOVOS HELPERS DE EXCLUSÃO (LIXO) ---
  removePatient: (id: string) => void;
  removeDoctor: (id: string) => void;
  removeRoom: (id: string) => void;
  removeAppointment: (id: string) => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('clinihub_user');
    return saved ? JSON.parse(saved) : { id: 'admin-1', name: 'Admin', role: UserRole.RECEPTIONIST, email: 'admin@clinihub.com' };
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('clinihub_patients');
    return saved ? JSON.parse(saved) : []; // Removi os dados iniciais conforme solicitado anteriormente
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('clinihub_doctors');
    return saved ? JSON.parse(saved) : [];
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('clinihub_rooms');
    return saved ? JSON.parse(saved) : [];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('clinihub_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  const [ehrRecords, setEhrRecords] = useState<EHRRecord[]>(() => {
    const saved = localStorage.getItem('clinihub_ehr');
    return saved ? JSON.parse(saved) : [];
  });

  const [doctorSchedules, setDoctorSchedules] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('clinihub_schedules');
    return saved ? JSON.parse(saved) : {};
  });

  // Persistência
  useEffect(() => { localStorage.setItem('clinihub_user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('clinihub_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('clinihub_doctors', JSON.stringify(doctors)); }, [doctors]);
  useEffect(() => { localStorage.setItem('clinihub_rooms', JSON.stringify(rooms)); }, [rooms]);
  useEffect(() => { localStorage.setItem('clinihub_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('clinihub_ehr', JSON.stringify(ehrRecords)); }, [ehrRecords]);
  useEffect(() => { localStorage.setItem('clinihub_schedules', JSON.stringify(doctorSchedules)); }, [doctorSchedules]);

  const updateDoctorSchedule = (doctorName: string, slots: string[]) => {
    setDoctorSchedules(prev => ({ ...prev, [doctorName]: slots }));
  };

  // FUNÇÕES DE ADIÇÃO
  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = { ...patientData, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() };
    setPatients(prev => [...prev, newPatient]);
  };

  const addDoctor = (doctorData: Omit<Doctor, 'id'>) => {
    const newDoctor: Doctor = { ...doctorData, id: `dr-${Math.random().toString(36).substr(2, 5)}` };
    setDoctors(prev => [...prev, newDoctor]);
  };

  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = { ...roomData, id: `sala-${Math.random().toString(36).substr(2, 5)}` };
    setRooms(prev => [...prev, newRoom]);
  };

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const doctor = doctors.find(d => d.id === appointmentData.doctorId);
    const room = rooms.find(r => r.id === appointmentData.roomId);

    if (doctor && room) {
      const isGeral = room.description === "Geral";
      const isCompatible = room.description === doctor.specialty;
      if (!isGeral && !isCompatible) return false; 
    }

    if (checkConflict(appointmentData)) return false;

    const newApp: Appointment = { ...appointmentData, id: Math.random().toString(36).substr(2, 9) };
    setAppointments(prev => [...prev, newApp]);
    return true;
  };

  // FUNÇÕES DE ATUALIZAÇÃO
  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, ...updates } : app));
  };

  // --- NOVAS FUNÇÕES DE EXCLUSÃO (REMOVE) ---
  const removePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const removeDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  const removeRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const removeAppointment = (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
  };

  const checkConflict = (newApp: Omit<Appointment, 'id'>) => {
    const newStart = new Date(newApp.dateTime).getTime();
    const newEnd = newStart + newApp.durationMinutes * 60000;
    return appointments.some(app => {
      if (app.status === 'cancelled') return false;
      const appStart = new Date(app.dateTime).getTime();
      const appEnd = appStart + app.durationMinutes * 60000;
      const timeOverlap = (newStart < appEnd && newEnd > appStart);
      return timeOverlap && (app.doctorId === newApp.doctorId || app.roomId === newApp.roomId);
    });
  };

  const canDoctorAccessPatient = (doctorId: string, patientId: string) => {
    
    if (currentUser?.role === UserRole.RECEPTIONIST) return false;

    // Verifica se existe pelo menos uma consulta marcada entre este médico e este paciente
    // que não tenha sido cancelada.
    return appointments.some(app => 
      app.doctorId === doctorId && 
      app.patientId === patientId
  );
};

  return (
    <ClinicContext.Provider value={{
      currentUser, setCurrentUser,
      patients, setPatients,
      doctors, setDoctors,
      rooms, setRooms,
      appointments, setAppointments,
      ehrRecords, setEhrRecords,
      doctorSchedules, updateDoctorSchedule,
      addPatient, addDoctor, addRoom, addAppointment,
      updatePatient, updateDoctor, updateRoom, updateAppointment,
      removePatient, removeDoctor, removeRoom, removeAppointment, canDoctorAccessPatient// Adicionado aqui
      
    }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) throw new Error('useClinic must be used within a ClinicProvider');
  return context;
};