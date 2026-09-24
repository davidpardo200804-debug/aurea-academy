import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Award,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  FileText,
  MessagesSquare,
  Sparkles,
  ArrowRight,
  BookOpen,
  Camera,
  FileCheck,
  Scissors,
  MessageCircle,
  Bell,
  Megaphone,
} from 'lucide-react';
import { appStorage } from '../../services/storage';
import { StudyProgressBar } from '../common/StudyProgressBar';
import { StudentNoticePopupModal } from '../academy/StudentNoticePopupModal';
import { StudentNoticeBanner } from './StudentNoticeBanner';

export const StudentDashboard: React.FC = () => {
  const { store, currentUser, setActiveTab, playSuccessSound, refreshData } = useApp();
  const [forceOpenPopup, setForceOpenPopup] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          appStorage.updateStudentAvatar(currentUser.id, event.target.result as string);
          playSuccessSound();
          refreshData();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const enrollment = store.enrollments.find((e) => e.userId === currentUser.id);
  const myGrades = store.grades.filter((g) => g.studentId === currentUser.id);
  const myPayments = store.payments.filter((p) => p.studentId === currentUser.id);

  const hasDebt = (enrollment?.balanceDue || 0) > 0;
  const balanceDue = enrollment?.balanceDue || 0;

  const average =
    myGrades.length > 0
      ? myGrades.reduce((sum, g) => sum + g.score, 0) / myGrades.length
      : 0;

  const recentResources = store.resources.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-900/50 p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative group shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/60 shadow-xl"
            />
            <label
              className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white text-[10px]"
              title="Cambiar mi foto"
            >
              <Camera className="w-5 h-5 mb-0.5" />
              <span>Cambiar</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Academia de Belleza Arte y Estilo • Portal Estudiantil</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ¡Hola, {currentUser.name}! ✂️💄
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {enrollment?.groupName || 'Estudiante Activa en Formación de Belleza'}. Te damos la bienvenida a tu centro integral de formación profesional en estilismo, colorimetría, barbería y spa de uñas.
            </p>
          </div>
        </div>

        {/* Quick action shortcuts */}
        <div className="mt-6 flex flex-wrap gap-2.5 relative z-10">
          <button
            onClick={() => setActiveTab('pensum')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Mi Pensum & Calificaciones</span>
          </button>

          <button
            onClick={() => setActiveTab('practices')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Scissors className="w-4 h-4 text-pink-400" />
            <span>Bitácora de Prácticas Salón</span>
          </button>

          <button
            onClick={() => setActiveTab('observer')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>Mi Observador Estudiantil</span>
          </button>

          <button
            onClick={() => setActiveTab('teacherStudentChat')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-indigo-400" />
            <span>Chat con Mis Docentes</span>
          </button>

          <button
            onClick={() => setForceOpenPopup(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-pink-500/25 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span>Ver Novedades & Promos 🔥</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span>Muro de Anuncios</span>
          </button>
        </div>
      </div>

      {/* 0 TO 100% ACADEMIC PROGRESS BAR */}
      <StudyProgressBar
        studentId={currentUser.id}
        onViewPensum={() => setActiveTab('pensum')}
      />

      {/* STUDENT WALL & NOTICES BANNER (Photos, Promotions & Events) */}
      <StudentNoticeBanner onOpenPopup={() => setForceOpenPopup(true)} />

      {/* Welcome / Featured Notice Popup Modal */}
      <StudentNoticePopupModal
        forceOpen={forceOpenPopup}
        onClose={() => setForceOpenPopup(false)}
      />

      {/* Financial Notice Bar */}
      {hasDebt ? (
        <div
          onClick={() => setActiveTab('finances')}
          className="bg-rose-950/30 border border-rose-500/40 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-rose-950/40 transition-all"
        >
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-rose-300">
                Aviso de Pago: Presentas saldo pendiente por ${balanceDue.toLocaleString('es-CO')}
              </div>
              <p className="text-[11px] text-slate-300">
                Paga en línea mediante PSE o tarjeta de crédito para evitar restricciones de plataforma.
              </p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0">
            Pagar Ahora
          </button>
        </div>
      ) : (
        <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-300">
                Paz y Salvo Institucional al Día
              </div>
              <p className="text-[11px] text-slate-300">
                No tienes pagos pendientes. Puedes descargar tu paz y salvo digital en cualquier momento.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTab('grades')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-slate-700 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Promedio General</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {average.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {average >= 3.0 ? 'Desempeño Aprobatorio ✓' : 'En riesgo académico'}
          </div>
        </div>

        <div
          onClick={() => setActiveTab('finances')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-slate-700 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Estado de Cartera</span>
            <DollarSign className="w-4 h-4 text-indigo-400" />
          </div>
          <div className={`text-xl font-bold mt-2 ${hasDebt ? 'text-rose-400' : 'text-emerald-400'}`}>
            {hasDebt ? `Debe $${balanceDue.toLocaleString('es-CO')}` : 'Al Día ($0)'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {enrollment?.paymentPlan || 'Plan Mensual'}
          </div>
        </div>

        <div
          onClick={() => setActiveTab('forums')}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-slate-700 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Foros Activos</span>
            <MessagesSquare className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">{store.forums.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Temas abiertos para debatir</div>
        </div>
      </div>

      {/* Recent Grades & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Mis Últimas Calificaciones</span>
            </h3>
            <button
              onClick={() => setActiveTab('grades')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Ver boletín
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {myGrades.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No tienes calificaciones cargadas aún.
              </div>
            ) : (
              myGrades.map((g) => (
                <div key={g.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">{g.subject}</div>
                    <div className="text-[11px] text-slate-400">
                      {g.period} • {g.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-black px-2 py-0.5 rounded-lg ${
                        g.score >= 3.0
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {g.score.toFixed(1)} / 5.0
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Aula Virtual Materials */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Materiales Recientes del Aula</span>
            </h3>
            <button
              onClick={() => setActiveTab('resources')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Ver aula virtual
            </button>
          </div>

          <div className="space-y-3">
            {recentResources.map((res) => (
              <div
                key={res.id}
                onClick={() => setActiveTab('resources')}
                className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white text-xs truncate max-w-[260px]">{res.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {res.subject} • {res.type === 'video' ? 'Video Clase' : 'Guía PDF'}
                  </div>
                </div>
                <span className="text-xs text-indigo-400 font-semibold flex items-center space-x-1">
                  <span>Abrir</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
