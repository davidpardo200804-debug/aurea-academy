import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  DollarSign,
  TrendingUp,
  Award,
  AlertTriangle,
  UserPlus,
  Calendar,
  Sparkles,
  Wallet,
  CheckCircle2,
  Clock,
  ArrowRight,
  PhoneCall,
  Bot,
  ShieldCheck,
  Sun,
  StickyNote,
  BookOpen,
  Scissors,
  FileCheck,
  Landmark,
  ClipboardCheck,
  MessageCircle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { store, setActiveTab, currentUser } = useApp();

  const enrollments = store.enrollments;
  const totalStudents = enrollments.length;
  const studentsWithDebt = enrollments.filter((e) => e.balanceDue > 0);
  const totalDebt = enrollments.reduce((acc, curr) => acc + curr.balanceDue, 0);

  const totalCollected = store.payments
    .filter((p) => p.status === 'pagado')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingInvoices = store.invoices.filter((inv) => inv.status === 'pendiente');
  const upcomingEvents = store.events.slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Academia de Belleza Arte y Estilo • Panel Directivo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex flex-wrap items-center gap-2">
            <span>¡Hola, {currentUser.name}! ✂️✨</span>
            {currentUser.cargo && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                {currentUser.cargo}
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Bienvenido al centro de administración de <strong>Arte y Estilo</strong>. Supervisa las matrículas,
            el cumplimiento del pensum por competencias, el registro de prácticas en salón escuela, el observador estudiantil y el módulo contable de ingresos, egresos y activos fijos.
          </p>
        </div>

        {/* Quick action shortcuts */}
        <div className="mt-6 flex flex-wrap gap-2.5 relative z-10">
          <button
            onClick={() => setActiveTab('chatCenter')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-pink-500/25 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span>Chat Center (Vendedoras & Admisiones) 🔥</span>
          </button>

          <button
            onClick={() => setActiveTab('pensum')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Pensum & Módulos</span>
          </button>

          <button
            onClick={() => setActiveTab('practices')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Scissors className="w-4 h-4 text-pink-400" />
            <span>Bitácora de Prácticas Salón</span>
          </button>

          <button
            onClick={() => setActiveTab('observer')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Observador Estudiantil</span>
          </button>

          <button
            onClick={() => setActiveTab('accounting')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Landmark className="w-4 h-4 text-amber-400" />
            <span>Contabilidad & Activos Fijos</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <ClipboardCheck className="w-4 h-4 text-indigo-400" />
            <span>Llamado a Lista</span>
          </button>

          <button
            onClick={() => setActiveTab('notepad')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <StickyNote className="w-4 h-4" />
            <span>Block de Notas ({store.adminNotes?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('staffChat')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 border border-amber-500/30 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Sala de Llamadas Docente</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Bot className="w-4 h-4" />
            <span>WhatsApp con IA</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-amber-500/30 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Áurea CyberShield</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-indigo-400" />
            <span>Matricular Alumno</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4 text-sky-400" />
            <span>Gestión de Usuarios</span>
          </button>

          <button
            onClick={() => setActiveTab('permissions')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Permisos por Rol</span>
          </button>

          <button
            onClick={() => setActiveTab('finances')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Tesorería & Cobros</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => setActiveTab('students')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Alumnos Matriculados</span>
            <Users className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{totalStudents}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <span>En {store.groups.length} grupos activos</span>
            <ArrowRight className="w-3 h-3 text-indigo-400" />
          </div>
        </div>

        {/* Total Collected */}
        <div
          onClick={() => setActiveTab('finances')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Recaudo Total Ingresos</span>
            <DollarSign className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            ${totalCollected.toLocaleString('es-CO')}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Pensiones y matrículas 2026</span>
          </div>
        </div>

        {/* Overdue Debt */}
        <div
          onClick={() => setActiveTab('finances')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Cartera en Mora</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2">
            ${totalDebt.toLocaleString('es-CO')}
          </div>
          <div className="text-[11px] text-rose-400/80 mt-1">
            {studentsWithDebt.length} estudiantes con saldo pendiente
          </div>
        </div>

        {/* Pending Teacher Invoices */}
        <div
          onClick={() => setActiveTab('finances')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl cursor-pointer transition-all shadow-md group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Honorarios por Aprobar</span>
            <Wallet className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">
            {pendingInvoices.length}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">
            Cuentas de cobro docentes radicadas
          </div>
        </div>
      </div>

      {/* Middle Grid: Pending Collections vs Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Collections Alert */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold text-white">Alumnos con Cobro Pendiente</h3>
              </div>
              <button
                onClick={() => setActiveTab('students')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Ver todos
              </button>
            </div>

            <div className="divide-y divide-slate-800">
              {studentsWithDebt.length === 0 ? (
                <div className="py-6 text-center text-xs text-emerald-400 font-semibold">
                  ¡Excelente! No hay alumnos en mora en este momento.
                </div>
              ) : (
                studentsWithDebt.map((std) => (
                  <div key={std.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">{std.fullName}</div>
                      <div className="text-[11px] text-slate-400">
                        {std.groupName} • Acudiente: {std.guardianName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-rose-400">
                        ${std.balanceDue.toLocaleString('es-CO')}
                      </div>
                      <span className="text-[10px] text-rose-400/80 font-medium">Debe pensión</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
            <span>Las notificaciones automáticas alertan al alumno al ingresar.</span>
          </div>
        </div>

        {/* Institutional Events Agenda */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Próximos Eventos Institucionales</h3>
              </div>
              <button
                onClick={() => setActiveTab('calendar')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Ver calendario
              </button>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start space-x-3"
                >
                  <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-300 font-bold text-xs text-center min-w-[50px]">
                    <div>{evt.date.split('-')[2]}</div>
                    <div className="text-[9px] uppercase font-semibold">
                      {new Date(evt.date + 'T00:00:00').toLocaleDateString('es-CO', { month: 'short' })}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-white">{evt.title}</h4>
                    <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{evt.description}</p>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>{evt.time}</span>
                      <span>•</span>
                      <span>{evt.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-right">
            <button
              onClick={() => setActiveTab('calendar')}
              className="text-xs text-indigo-400 font-bold hover:underline"
            >
              + Programar nueva reunión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
