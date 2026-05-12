/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, Users, Settings, UserCircle, DoorOpen, ClipboardList } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'doctors', label: 'Corpo Clínico', icon: UserCircle },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'rooms', label: 'Salas', icon: DoorOpen },
    { id: 'config', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-primary h-screen flex flex-col fixed left-0 top-0 text-white shadow-xl z-20">
      <div className="p-8 text-2xl font-bold tracking-tight border-b border-white/10 flex items-center gap-2">
        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-white text-sm">CH</div>
        CliniHub
      </div>
      
      <nav className="flex-1 mt-6 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                isActive 
                  ? 'bg-secondary text-white font-medium shadow-lg shadow-secondary/20' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-sm">{item.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
      
    </aside>
  );
};
