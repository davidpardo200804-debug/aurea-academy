import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Award,
  Plus,
  FileSpreadsheet,
  Printer,
  Search,
  CheckCircle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { exportToCSV, printSection } from '../../services/exportUtils';
import { appStorage } from '../../services/storage';

export const TeacherGrades: React.FC = () => {
  const { store, currentUser, refreshData, playSuccessSound } = useApp();

  // Find groups assigned to this teacher, or all groups if admin viewing
  const myGroups = store.groups.filter((g) => g.teacherId === currentUser.id || currentUser.role === 'admin');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(myGroups[0]?.id || store.groups[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState(currentUser.specialty || 'Química Orgánica');
  const [period, setPeriod] = useState<'Corte 1' | 'Corte 2' | 'Corte 3' | 'Examen Final'>('Corte 1');
  const [score, setScore] = useState('4.5');
  const [weight, setWeight] = useState('30');
  const [feedback, setFeedback] = useState('');

  const currentGroup = store.groups.find((g) => g.id === selectedGroupId) || store.groups[0];
  const enrolledStudents = currentGroup
    ? store.enrollments.filter((e) => e.groupId === currentGroup.id)
    : [];

  const groupGrades = store.grades.filter((g) => g.groupId === selectedGroupId);

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !selectedGroupId) return;

    const studentEnrollment = enrolledStudents.find((s) => s.userId === studentId);
    if (!studentEnrollment) return;

    appStorage.addGrade({
      studentId,
      studentName: studentEnrollment.fullName,
      groupId: selectedGroupId,
      subject,
      period,
      score: parseFloat(score) || 0,
      weight: parseFloat(weight) || 25,
      feedback: feedback || 'Desempeño registrado satisfactoriamente.',
      teacherId: currentUser.id,
    });

    playSuccessSound();
    refreshData();
    setIsAddModalOpen(false);
    setFeedback('');
  };

  const handleExportGradesExcel = () => {
    const headers = ['Estudiante', 'Materia', 'Periodo / Corte', 'Calificación (0-5.0)', 'Peso (%)', 'Observaciones', 'Fecha'];
    const rows = groupGrades.map((g) => [
      g.studentName,
      g.subject,
      g.period,
      g.score.toFixed(1),
      `${g.weight}%`,
      g.feedback,
      g.date,
    ]);
    exportToCSV(`Planilla_Notas_${currentGroup?.code || 'Grupo'}_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <Award className="w-6 h-6 text-blue-400" />
            <span>Gestión de Calificaciones y Progreso Académico</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Registra notas ponderadas, retroalimentaciones pedagógicas y genera boletines oficiales.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportGradesExcel}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar Planilla</span>
          </button>

          <button
            onClick={() => printSection('grades-printable-table', `Boletín de Notas - ${currentGroup?.name}`)}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Imprimir PDF</span>
          </button>

          <button
            onClick={() => {
              if (enrolledStudents.length > 0) {
                setStudentId(enrolledStudents[0].userId);
              }
              setIsAddModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Asignar Calificación</span>
          </button>
        </div>
      </div>

      {/* Group selector */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GraduationCap className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-semibold text-white">Grupo actual:</span>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            {store.groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.shift})
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-slate-400">
          {enrolledStudents.length} estudiantes inscritos en este salón
        </div>
      </div>

      {/* Grades Table */}
      <div id="grades-printable-table" className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Estudiante</th>
                <th className="py-3.5 px-4">Asignatura</th>
                <th className="py-3.5 px-4">Periodo / Corte</th>
                <th className="py-3.5 px-4">Nota (0.0 - 5.0)</th>
                <th className="py-3.5 px-4">Peso</th>
                <th className="py-3.5 px-4">Retroalimentación</th>
                <th className="py-3.5 px-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {groupGrades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Aún no hay calificaciones registradas para este grupo. Haz clic en "Asignar Calificación".
                  </td>
                </tr>
              ) : (
                groupGrades.map((grd) => {
                  const isApproved = grd.score >= 3.0;
                  return (
                    <tr key={grd.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">{grd.studentName}</td>
                      <td className="py-3.5 px-4 text-slate-200">{grd.subject}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-indigo-300">
                          {grd.period}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg font-black text-xs ${
                            isApproved
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {grd.score.toFixed(1)} / 5.0
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{grd.weight}%</td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-xs truncate">{grd.feedback}</td>
                      <td className="py-3.5 px-4 text-slate-400">{grd.date}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Grade */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-4">Registrar Nueva Calificación</h2>
            <form onSubmit={handleSaveGrade} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Estudiante *</label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {enrolledStudents.map((std) => (
                    <option key={std.userId} value={std.userId}>
                      {std.fullName} ({std.documentId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Asignatura</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Química, Matemáticas, etc."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Periodo</label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white"
                  >
                    <option value="Corte 1">Corte 1</option>
                    <option value="Corte 2">Corte 2</option>
                    <option value="Corte 3">Corte 3</option>
                    <option value="Examen Final">Examen Final</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nota (0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5.0"
                    required
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Peso %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Retroalimentación Pedagógica
                </label>
                <textarea
                  rows={2}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Observaciones de mejora o felicitaciones..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-lg"
                >
                  Guardar y Notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
