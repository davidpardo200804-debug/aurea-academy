import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Video,
  CheckCircle,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { appStorage } from '../../services/storage';

export const TeacherInductions: React.FC = () => {
  const { store, currentUser, refreshData, playSuccessSound } = useApp();

  const inductions = store.inductions;

  const handleToggleCompleted = (inductionId: string) => {
    appStorage.toggleTeacherInduction(inductionId, currentUser.id);
    playSuccessSound();
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2.5">
          <Video className="w-6 h-6 text-indigo-400" />
          <span>Programa de Reinducciones y Capacitación Docente</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Actualización pedagógica institucional, lineamientos normativos y protocolos de aula 2026.
        </p>
      </div>

      {/* Inductions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {inductions.map((ind) => {
          const isCompleted = ind.completedByTeacherIds.includes(currentUser.id);

          return (
            <div
              key={ind.id}
              className={`bg-slate-900 border rounded-3xl p-5 shadow-lg flex flex-col justify-between transition-all ${
                isCompleted ? 'border-emerald-500/40 bg-slate-900/90' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      ind.mandatory
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {ind.mandatory ? 'Obligatorio' : 'Opcional / Crecimiento'}
                  </span>

                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{ind.duration}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{ind.title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{ind.description}</p>

                {/* Video Container preview */}
                <div className="mt-4 rounded-xl overflow-hidden aspect-video bg-black/40 border border-slate-800 relative">
                  <iframe
                    src={ind.videoUrl}
                    title={ind.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{ind.moduleCount} Módulos temáticos</span>
                  <span>Plazo: {ind.deadline}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleToggleCompleted(ind.id)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isCompleted ? 'Completado ✓ (Repasar)' : 'Marcar como Completado'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
