import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Lock,
  Mail,
  Shield,
  Briefcase,
  GraduationCap,
  KeyRound,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Sparkles,
  User,
  Scissors,
} from 'lucide-react';
import { appStorage } from '../services/storage';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentUser, playSuccessSound } = useApp();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'agent' | 'teacher' | 'student'>('all');

  if (!isOpen) return null;

  const users = appStorage.getStore().users;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const inputLower = usernameOrEmail.trim().toLowerCase();

    // Find user matching email, documentId, or name/username prefix
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === inputLower ||
        u.documentId?.toLowerCase() === inputLower ||
        u.name.toLowerCase().includes(inputLower)
    );

    if (!found) {
      setError('Usuario o documento no encontrado en el sistema de la academia.');
      return;
    }

    // Check password (supports custom pass or standard 123/123456)
    const validPassword =
      found.password === password ||
      password === '123' ||
      password === '123456' ||
      password === 'admin123' ||
      password === 'docente123' ||
      password === 'estudiante123';

    if (!validPassword) {
      setError('Contraseña incorrecta. Por favor verifica tus credenciales.');
      return;
    }

    // Enforce matching role as requested by user ("deban poner usuario - contraseña y rol")
    if (found.role !== selectedRole) {
      const roleNames: Record<UserRole, string> = {
        admin: 'Administración / Directora Académica / Coordinación',
        teacher: 'Docente / Instructor',
        student: 'Estudiante / Aprendiz',
        agent: 'Asesora de Call Center & Matrículas',
      };
      setError(
        `El usuario ingresado (${found.name}) está registrado con el rol de "${roleNames[found.role]}", pero seleccionaste "${roleNames[selectedRole]}". Por favor selecciona el rol correcto en la lista desplegable.`
      );
      return;
    }

    // Success login
    setCurrentUser(found);
    playSuccessSound();
    onClose();
  };

  const handleQuickSelect = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setUsernameOrEmail(found.email);
      setPassword('123456');
      setSelectedRole(found.role);
      setCurrentUser(found);
      playSuccessSound();
      onClose();
    }
  };

  const handleAutoFill = (u: any) => {
    setUsernameOrEmail(u.email);
    setPassword('123456');
    setSelectedRole(u.role);
    setError('');
  };

  const filteredQuickUsers = users.filter((u) => {
    if (roleFilter === 'all') return true;
    return u.role === roleFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0b132b] border border-sky-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[92vh] overflow-y-auto text-white">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Official Logo & Branding */}
        <div className="text-center mb-6 relative z-10">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-white p-1.5 shadow-xl shadow-sky-500/25 border-2 border-sky-400/40 flex items-center justify-center mb-3">
            <img
              src="/logo.jpg"
              alt="Arte & Estilo"
              className="w-full h-full object-contain rounded-2xl"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold tracking-wider uppercase mb-1">
            <Scissors className="w-3 h-3 text-purple-300" />
            <span>Academia de Belleza</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Arte & Estilo</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
            Ingreso al Sistema Institucional: ingresa tu usuario, contraseña y rol asignado.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Credentials Form: Usuario + Contraseña + Rol */}
        <form onSubmit={handleLogin} className="space-y-3.5 relative z-10">
          {/* 1. Usuario */}
          <div>
            <label className="block text-xs font-semibold text-sky-200 mb-1">
              Usuario, Documento o Correo Electrónico *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="ej: carlos.mendoza@arteyestilo.edu.co o CC"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* 2. Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-sky-200 mb-1">Contraseña *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (Demo: 123456)"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* 3. Rol Institucional */}
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1">Rol Institucional *</label>
            <div className="relative">
              <Shield className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400 font-medium"
              >
                <option value="admin">Administrador / Directora Académica / Coordinador</option>
                <option value="agent">Asesora de Call Center & Admisiones</option>
                <option value="teacher">Profesor / Instructor de Belleza</option>
                <option value="student">Estudiante / Aprendiz</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600 hover:from-sky-400 hover:to-purple-500 font-bold text-xs text-white shadow-lg shadow-sky-500/25 transition-all cursor-pointer mt-2 active:scale-98"
          >
            Iniciar Sesión en Arte & Estilo
          </button>
        </form>

        {/* Quick Demo Switcher By Specific Roles */}
        <div className="mt-6 pt-5 border-t border-slate-800 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Acceso Rápido de Prueba por Rol:
            </span>
            <div className="flex space-x-1">
              {(['all', 'admin', 'agent', 'teacher', 'student'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`text-[10px] px-2 py-0.5 rounded-lg cursor-pointer ${
                    roleFilter === r
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white bg-slate-800'
                  }`}
                >
                  {r === 'all'
                    ? 'Todos'
                    : r === 'admin'
                    ? 'Admin'
                    : r === 'agent'
                    ? 'Call Center'
                    : r === 'teacher'
                    ? 'Docentes'
                    : 'Alumnos'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
            {filteredQuickUsers.map((u) => {
              const roleColor =
                u.role === 'admin'
                  ? 'border-sky-500/40 hover:bg-sky-950/40 text-sky-300'
                  : u.role === 'agent'
                  ? 'border-emerald-500/40 hover:bg-emerald-950/40 text-emerald-300'
                  : u.role === 'teacher'
                  ? 'border-purple-500/40 hover:bg-purple-950/40 text-purple-300'
                  : 'border-blue-500/40 hover:bg-blue-950/40 text-blue-300';

              const roleBadge =
                u.role === 'admin'
                  ? 'bg-sky-500/20 text-sky-300'
                  : u.role === 'agent'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : u.role === 'teacher'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-emerald-500/20 text-emerald-300';

              return (
                <div
                  key={u.id}
                  className={`p-2.5 rounded-xl border bg-slate-900/60 ${roleColor} text-left transition-all flex items-center justify-between group`}
                >
                  <div
                    className="flex items-center space-x-2.5 truncate cursor-pointer flex-1"
                    onClick={() => handleQuickSelect(u.id)}
                    title="Iniciar sesión de inmediato con este usuario"
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate group-hover:text-sky-300">
                        {u.name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                        <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${roleBadge}`}>
                          {u.cargo || (u.role === 'admin' ? 'Admin' : u.role === 'teacher' ? 'Docente' : 'Estudiante')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAutoFill(u)}
                    className="ml-2 p-1 text-[10px] rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 shrink-0 cursor-pointer"
                    title="Llenar campos del formulario"
                  >
                    Rellenar
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
