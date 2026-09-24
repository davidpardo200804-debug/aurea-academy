import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { exportToCSV, printSection } from '../../services/exportUtils';

export const StudentGrades: React.FC = () => {
  const { store, currentUser } = useApp();

  const myGrades = store.grades.filter((g) => g.studentId === currentUser.id);

  const average =
    myGrades.length > 0
      ? myGrades.reduce((sum, g) => sum + g.score, 0) / myGrades.length
      : 0;

  const isApproved = average >= 3.0;

  const handleExportExcel = () => {
    const headers = ['Asignatura', 'Periodo / Corte', 'Calificación', 'Peso %', 'Observaciones Docente', 'Fecha'];
    const rows = myGrades.map((g) => [
      g.subject,
      g.period,
      g.score.toFixed(1),
      `${g.weight}%`,
      g.feedback,
      g.date,
    ]);
    exportToCSV(`Boletin_${currentUser.name.replace(/ /g, '_')}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <Award className="w-6 h-6 text-indigo-400" />
            <span>Boletín de Calificaciones & Progreso Escolar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Consulta tus notas oficiales por periodo, observaciones docentes y promedio acumulado.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Descargar Excel</span>
          </button>

          <button
            onClick={() => printSection('report-card-printable', `Boletín Oficial - ${currentUser.name}`)}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Imprimir Boletín (PDF)</span>
          </button>
        </div>
      </div>

      {/* GPA Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Promedio Ponderado General</div>
          <div className="text-3xl font-black text-white mt-1">
            {average.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Escala de 0.0 a 5.0 (Aprobatoria: 3.0)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Estado Académico</div>
          <div className={`text-xl font-bold mt-1 ${isApproved ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isApproved ? 'APROBADO SATISFACTORIAMENTE' : 'EN RIESGO ACADÉMICO'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isApproved ? 'Buen rendimiento en todos los cortes' : 'Requiere plan de mejoramiento'}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Evaluaciones Registradas</div>
          <div className="text-3xl font-black text-indigo-400 mt-1">{myGrades.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Cortes calificados por docentes</div>
        </div>
      </div>

      {/* Report Card Table */}
      <div id="report-card-printable" className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Desglose de Asignaturas y Cortes</h3>
            <p className="text-xs text-slate-400">Alumno: {currentUser.name} • Documento: {currentUser.documentId}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/40 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Asignatura</th>
                <th className="py-3 px-4">Periodo / Corte</th>
                <th className="py-3 px-4">Calificación</th>
                <th className="py-3 px-4">Ponderación</th>
                <th className="py-3 px-4">Observaciones y Retroalimentación</th>
                <th className="py-3 px-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {myGrades.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    Aún no tienes calificaciones registradas en el sistema para este periodo.
                  </td>
                </tr>
              ) : (
                myGrades.map((grd) => (
                  <tr key={grd.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">{grd.subject}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-indigo-300">
                        {grd.period}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-sm">
                      <span
                        className={
                          grd.score >= 3.0 ? 'text-emerald-400' : 'text-rose-400'
                        }
                      >
                        {grd.score.toFixed(1)} / 5.0
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{grd.weight}%</td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-sm">{grd.feedback}</td>
                    <td className="py-3.5 px-4 text-slate-400">{grd.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
