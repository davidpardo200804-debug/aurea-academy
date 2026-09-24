import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Award,
  Wallet,
  Video,
  UploadCloud,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Scissors,
  FileCheck,
  MessageCircle,
  Bell,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { store, currentUser, setActiveTab } = useApp();

  const myGroups = store.groups.filter((g) => g.teacherId === currentUser.id);
  const myGrades = store.grades.filter((g) => g.teacherId === currentUser.id);
  const myInvoices = store.invoices.filter((inv) => inv.teacherId === currentUser.id);

  const pendingInvoices = myInvoices.filter((inv) => inv.status === 'pendiente' || inv.status === 'aprobado');
  const totalEarned = myInvoices
    .filter((inv) => inv.status === 'pagado')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const pendingPractices = (store.practiceRecords || []).filter((p) => p.status !== 'aprobado');
  const pendingObserverSignatures = (store.observerEntries || []).filter((o) => o.status !== 'cumplido_cerrado');
  const pendingInductions = (store.inductions || []).filter(
    (ind) => !ind.completedByTeacherIds.includes(currentUser.id)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Academia de Belleza Arte y Estilo • Portal Docente</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ¡Hola, {currentUser.name}! ✂️✨
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            {currentUser.specialty || 'Docente Instructor en Belleza & Estilismo'}. Gestiona tus salones prácticos, evalúa los módulos del pensum técnico, valida horas en el salón escuela y mantén al día el observador del estudiante.
          </p>
        </div>

        {/* Quick actions */}
        <div className="mt-6 flex flex-wrap gap-2.5 relative z-10">
          <button
            onClick={() => setActiveTab('pensum')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Calificar Pensum & Módulos</span>
          </button>

          <button
            onClick={() => setActiveTab('practices')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Scissors className="w-4 h-4 text-pink-400" />
            <span>Supervisar Prácticas ({pendingPractices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('observer')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Observador Estudiantil</span>
          </button>

          <button
            onClick={() => setActiveTab('teacherStudentChat')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-indigo-400" />
            <span>Chat con Estudiantes</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Cartelera de Avisos</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('groups')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-slate-700 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Grupos a Cargo</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{myGroups.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Salones bajo tu tutoría académica</div>
        </div>

        <div
          onClick={() => setActiveTab('grades')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-slate-700 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Notas Asignadas</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{myGrades.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Calificaciones en sistema este corte</div>
        </div>

        <div
          onClick={() => setActiveTab('invoices')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-slate-700 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Honorarios en Trámite</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            ${pendingInvoices.reduce((s, i) => s + i.totalAmount, 0).toLocaleString('es-CO')}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Cuentas radicadas y aprobadas</div>
        </div>
      </div>

      {/* Assigned Groups & Inductions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Groups */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Mis Salones y Grupos Asignados</span>
            </h3>
            <button
              onClick={() => setActiveTab('grades')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Ir a notas
            </button>
          </div>

          <div className="space-y-3">
            {myGroups.map((grp) => {
              const students = store.enrollments.filter((e) => e.groupId === grp.id);
              return (
                <div
                  key={grp.id}
                  className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white text-xs">{grp.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Jornada {grp.shift} • {grp.room} • {students.length} estudiantes
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('grades')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold transition-colors"
                  >
                    Calificar
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reinducciones Docentes */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Video className="w-4 h-4 text-indigo-400" />
              <span>Reinducciones Institucionales ({pendingInductions.length} pendientes)</span>
            </h3>
            <button
              onClick={() => setActiveTab('inductions')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Ver todas
            </button>
          </div>

          <div className="space-y-3">
            {store.inductions.slice(0, 2).map((ind) => {
              const completed = ind.completedByTeacherIds.includes(currentUser.id);
              return (
                <div
                  key={ind.id}
                  className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between"
                >
                  <div className="max-w-[280px]">
                    <div className="font-bold text-white text-xs truncate">{ind.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {ind.duration} • Plazo: {ind.deadline}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      completed
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {completed ? 'Completada ✓' : 'Pendiente'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
