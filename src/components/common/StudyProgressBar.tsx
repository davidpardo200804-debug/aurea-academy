import React from 'react';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Flame,
  Scissors,
  Palette,
} from 'lucide-react';
import { appStorage } from '../../services/storage';

interface StudyProgressBarProps {
  studentId: string;
  onViewPensum?: () => void;
  compact?: boolean;
}

export const StudyProgressBar: React.FC<StudyProgressBarProps> = ({
  studentId,
  onViewPensum,
  compact = false,
}) => {
  const progress = appStorage.getStudentAcademicProgress(studentId);

  // Milestone points on 0-100 scale
  const milestones = [
    { pct: 25, label: 'Fundamentos & Corte', icon: Scissors },
    { pct: 50, label: 'Color & Químicos', icon: Palette },
    { pct: 75, label: 'Salón Escuela', icon: Sparkles },
    { pct: 100, label: 'Grado Oficial', icon: GraduationCap },
  ];

  if (compact) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-300">Progreso de Formación</div>
              <div className="text-[11px] text-slate-400">{progress.stageLabel}</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
              {progress.overallPercentage}%
            </span>
          </div>
        </div>

        {/* Bar */}
        <div className="relative w-full bg-slate-800/80 rounded-full h-3 p-0.5 overflow-hidden ring-1 ring-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 transition-all duration-1000 ease-out shadow-sm shadow-blue-500/50"
            style={{ width: `${progress.overallPercentage}%` }}
          />
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>{progress.approvedModulesCount}/{progress.totalModulesCount} Módulos aprobados</span>
          <span>{progress.totalPracticeHours}/{progress.requiredPracticeHours}h Prácticas</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-[11px] font-bold text-blue-300">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Avance de Carrera Académica • 0 a 100%</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{progress.programName}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {progress.stageLabel}
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700/60 px-5 py-3 rounded-2xl shrink-0 self-start sm:self-auto">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avance Global</div>
              <div className="text-3xl font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
                {progress.overallPercentage}%
              </div>
            </div>
            {onViewPensum && (
              <button
                onClick={onViewPensum}
                className="ml-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center space-x-1 cursor-pointer transition-all active:scale-95"
              >
                <span>Ver Pensum</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 0 to 100 Visual Slider Bar */}
        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-300 px-1">
            <span className="flex items-center gap-1 text-slate-400">
              <span>0% Inicio</span>
            </span>
            <span className="text-blue-300 font-bold">
              Progreso Actual: {progress.overallPercentage}%
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <GraduationCap className="w-4 h-4" />
              <span>100% Grado Oficial</span>
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="relative w-full bg-slate-950/80 rounded-2xl h-5 p-1 ring-1 ring-white/10 shadow-inner overflow-hidden">
            <div
              className="h-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out relative group"
              style={{ width: `${Math.max(5, progress.overallPercentage)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl" />
              {/* Shimmer line */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-r-xl shadow-lg shadow-white/50" />
            </div>
          </div>

          {/* Milestones markers */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {milestones.map((m) => {
              const Icon = m.icon;
              const isReached = progress.overallPercentage >= m.pct;
              return (
                <div
                  key={m.pct}
                  className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                    isReached
                      ? 'bg-blue-500/10 border border-blue-500/30 text-blue-300'
                      : 'bg-slate-800/40 border border-slate-800 text-slate-500'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1 text-xs ${
                      isReached
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold leading-tight">{m.pct}%</span>
                  <span className="text-[10px] hidden sm:inline leading-tight font-medium opacity-90 truncate max-w-full">
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Módulos del Pensum</div>
              <div className="text-base font-extrabold text-white">
                {progress.approvedModulesCount} de {progress.totalModulesCount} Aprobados
              </div>
              <div className="text-[10px] text-blue-400">
                {progress.modulesPercentage}% completado
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Prácticas Salón Escuela</div>
              <div className="text-base font-extrabold text-white">
                {progress.totalPracticeHours}h de {progress.requiredPracticeHours}h
              </div>
              <div className="text-[10px] text-purple-400">
                {progress.practiceHoursPercentage}% horas certificadas
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Promedio Ponderado</div>
              <div className="text-base font-extrabold text-white">
                {progress.gpa.toFixed(1)} / 5.0
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">
                {progress.gpa >= 4.5 ? '⭐ Rendimiento Sobresaliente' : progress.gpa >= 3.0 ? 'Aprobatorio' : 'En nivelación'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
