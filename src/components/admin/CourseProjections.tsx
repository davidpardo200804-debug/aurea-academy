import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  TrendingUp,
  Plus,
  Users,
  Calendar,
  DollarSign,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToCSV } from '../../services/exportUtils';
import { appStorage } from '../../services/storage';

export const CourseProjections: React.FC = () => {
  const { store, refreshData, playSuccessSound } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Educación Continua');
  const [targetAudience, setTargetAudience] = useState('');
  const [plannedStartDate, setPlannedStartDate] = useState('2026-06-01');
  const [durationMonths, setDurationMonths] = useState('3');
  const [estimatedTuitionFee, setEstimatedTuitionFee] = useState('450000');
  const [targetStudents, setTargetStudents] = useState('30');
  const [currentPreRegistered, setCurrentPreRegistered] = useState('15');

  const projections = store.projections;

  const totalProjectedRevenue = projections.reduce((sum, p) => sum + p.projectedRevenue, 0);
  const totalTargetStudents = projections.reduce((sum, p) => sum + p.targetStudents, 0);
  const totalPreRegistered = projections.reduce((sum, p) => sum + p.currentPreRegistered, 0);

  const handleCreateProjection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const studentsNum = Number(targetStudents) || 20;
    const feeNum = Number(estimatedTuitionFee) || 300000;
    const revenue = studentsNum * feeNum;

    appStorage.createCourseProjection({
      name,
      category,
      targetAudience: targetAudience || 'Comunidad estudiantil y profesionales',
      plannedStartDate,
      durationMonths: Number(durationMonths) || 3,
      estimatedTuitionFee: feeNum,
      targetStudents: studentsNum,
      currentPreRegistered: Number(currentPreRegistered) || 0,
      projectedRevenue: revenue,
      status: 'convocatoria_abierta',
    });

    playSuccessSound();
    refreshData();
    setIsModalOpen(false);
    setName('');
    setTargetAudience('');
  };

  const handleExportProjections = () => {
    const headers = [
      'Curso / Programa',
      'Categoría',
      'Inicio Previsto',
      'Duración (Meses)',
      'Meta Alumnos',
      'Pre-inscritos',
      'Valor Matrícula ($COP)',
      'Ingreso Proyectado ($COP)',
      'Estado',
    ];
    const rows = projections.map((p) => [
      p.name,
      p.category,
      p.plannedStartDate,
      p.durationMonths,
      p.targetStudents,
      p.currentPreRegistered,
      p.estimatedTuitionFee,
      p.projectedRevenue,
      p.status.toUpperCase(),
    ]);
    exportToCSV(`Proyecciones_Academicas_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <span>Próximos Cursos & Proyección Académica</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Análisis de apertura de nuevos programas, estimación de matrículas y metas financieras.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportProjections}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar Proyección</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Planear Nuevo Curso</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Ingresos Totales Proyectados</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            ${totalProjectedRevenue.toLocaleString('es-CO')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Con base en metas de matriculación</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Capacidad de Nuevos Alumnos</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{totalTargetStudents}</div>
          <div className="text-[11px] text-slate-400 mt-1">Cupos en oferta institucional</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Pre-inscritos Interesados</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{totalPreRegistered}</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            {Math.round((totalPreRegistered / (totalTargetStudents || 1)) * 100)}% de viabilidad alcanzada
          </div>
        </div>
      </div>

      {/* Projections List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projections.map((proj) => {
          const percent = Math.min(100, Math.round((proj.currentPreRegistered / proj.targetStudents) * 100));
          return (
            <div
              key={proj.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {proj.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {proj.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-1 leading-snug">{proj.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{proj.targetAudience}</p>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>Inicio previsto:</span>
                    </span>
                    <span className="font-semibold text-white">{proj.plannedStartDate}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Matrícula estimada:</span>
                    </span>
                    <span className="font-bold text-emerald-400">
                      ${proj.estimatedTuitionFee.toLocaleString('es-CO')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Ingreso Proyectado:</span>
                    </span>
                    <span className="font-bold text-white">
                      ${proj.projectedRevenue.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
                    <span className="text-slate-400">
                      Pre-inscripción: {proj.currentPreRegistered} / {proj.targetStudents}
                    </span>
                    <span className="text-indigo-400 font-bold">{percent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Duración: {proj.durationMonths} meses</span>
                <span className="text-indigo-400 font-medium cursor-pointer hover:underline">
                  Ver detalle
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: New Projection */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-4">Planear Nuevo Curso / Programa</h2>
            <form onSubmit={handleCreateProjection} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Curso *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Diplomado en Ciberseguridad Defensiva"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Educación Continua">Educación Continua</option>
                    <option value="Bachillerato">Bachillerato / Nivelación</option>
                    <option value="Idiomas">Idiomas</option>
                    <option value="Tecnología">Tecnología & Programación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha Apertura</label>
                  <input
                    type="date"
                    value={plannedStartDate}
                    onChange={(e) => setPlannedStartDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duración (Meses)</label>
                  <input
                    type="number"
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Cupos</label>
                  <input
                    type="number"
                    value={targetStudents}
                    onChange={(e) => setTargetStudents(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pre-inscritos</label>
                  <input
                    type="number"
                    value={currentPreRegistered}
                    onChange={(e) => setCurrentPreRegistered(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Valor Matrícula Estimada ($COP)</label>
                <input
                  type="number"
                  value={estimatedTuitionFee}
                  onChange={(e) => setEstimatedTuitionFee(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white"
                >
                  Guardar Proyección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
