import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  UserCheck,
  Edit3,
  Check,
  Layers,
  GraduationCap,
  Scissors,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { appStorage } from '../../services/storage';
import { PensumModule, StudentModuleGrade } from '../../types';
import { StudyProgressBar } from '../common/StudyProgressBar';

export const PensumView: React.FC = () => {
  const { currentUser, store, playSuccessSound, refreshData } = useApp();
  const [selectedProgram, setSelectedProgram] = useState<string>('Peluquería Integral & Estilismo');
  const [selectedCycle, setSelectedCycle] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [activeModuleForGrade, setActiveModuleForGrade] = useState<PensumModule | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Grade Form State
  const [theoryScore, setTheoryScore] = useState<number>(4.5);
  const [practiceScore, setPracticeScore] = useState<number>(4.8);
  const [biosecurityScore, setBiosecurityScore] = useState<number>(5.0);
  const [gradeStatus, setGradeStatus] = useState<'aprobado' | 'reprobado' | 'en_curso'>('aprobado');
  const [feedback, setFeedback] = useState('');

  const modules = store.pensumModules || [];
  const moduleGrades = store.moduleGrades || [];
  const students = store.users.filter((u) => u.role === 'student');

  const isStudent = currentUser.role === 'student';
  const effectiveStudentId = isStudent ? currentUser.id : selectedStudentId || (students[0]?.id ?? '');

  // Filter modules
  const filteredModules = modules.filter((m) => {
    const matchesProgram = m.program === selectedProgram;
    const matchesCycle = selectedCycle === 'all' || m.cycleOrSemester === selectedCycle;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.competencies && m.competencies.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesProgram && matchesCycle && matchesSearch;
  });

  const getStudentGradeForModule = (moduleId: string) => {
    return moduleGrades.find(
      (g) => g.studentId === effectiveStudentId && g.moduleId === moduleId
    );
  };

  const handleOpenGradeModal = (moduleItem: PensumModule) => {
    setActiveModuleForGrade(moduleItem);
    const existing = moduleGrades.find(
      (g) => g.studentId === effectiveStudentId && g.moduleId === moduleItem.id
    );
    if (existing) {
      setTheoryScore(existing.theoryScore);
      setPracticeScore(existing.practiceScore);
      setBiosecurityScore(existing.biosecurityScore || 4.8);
      setGradeStatus(existing.status);
      setFeedback(existing.feedback || '');
    } else {
      setTheoryScore(4.2);
      setPracticeScore(4.6);
      setBiosecurityScore(4.9);
      setGradeStatus('aprobado');
      setFeedback('Excelente técnica y pulcritud en estación de trabajo.');
    }
    setGradingModalOpen(true);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModuleForGrade || !effectiveStudentId) return;

    const studentObj = students.find((s) => s.id === effectiveStudentId);
    const studentName = studentObj ? studentObj.name : 'Estudiante';
    const studentEnrollment = store.enrollments.find((en) => en.userId === effectiveStudentId);

    // Calculate final weighted score: 30% Theory, 50% Practice, 20% Biosecurity
    const finalScore = Number(
      (theoryScore * 0.3 + practiceScore * 0.5 + biosecurityScore * 0.2).toFixed(1)
    );

    appStorage.saveModuleGrade({
      studentId: effectiveStudentId,
      studentName,
      studentDocument: studentObj?.documentId || 'CC 102349182',
      groupId: studentEnrollment?.groupId || 'grp-peluqueria-1',
      groupName: studentEnrollment?.groupName || 'Técnico en Peluquería Integral - Sede Principal',
      moduleId: activeModuleForGrade.id,
      moduleCode: activeModuleForGrade.code,
      moduleName: activeModuleForGrade.name,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      theoryScore,
      practiceScore,
      biosecurityScore,
      finalScore,
      status: gradeStatus,
      feedback: feedback.trim() || 'Aprobó con éxito las competencias técnicas exigidas por el módulo.',
    });

    playSuccessSound();
    refreshData();
    setGradingModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 0 to 100% Student Academic Progress Bar */}
      {effectiveStudentId && (
        <StudyProgressBar studentId={effectiveStudentId} />
      )}

      {/* Page Title & Program Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Malla Curricular Oficial • Arte y Estilo</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-400" />
              <span>Pensum Académico & Calificación de Módulos</span>
            </h1>
            <p className="text-sm text-slate-400">
              Estructura curricular de la academia por competencias laborales y horas teórico-prácticas en salón escuela.
            </p>
          </div>

          {/* Student Picker for Teachers/Admin */}
          {!isStudent && (
            <div className="flex items-center space-x-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Estudiante a Evaluar
                </label>
                <select
                  value={effectiveStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id} className="bg-slate-900 text-white">
                      {st.name} ({st.gradeLevel || 'Estudiante'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Program Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-800 pb-4">
          {[
            'Peluquería Integral & Estilismo',
            'Barbería Profesional & Fade',
            'Manicura Rusa, Polygel & Nail Art',
          ].map((prog) => (
            <button
              key={prog}
              onClick={() => setSelectedProgram(prog)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center space-x-2 ${
                selectedProgram === prog
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>{prog}</span>
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar módulo, código o competencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Ciclo:</span>
            <div className="inline-flex rounded-xl bg-slate-800/80 p-1 border border-slate-700/60">
              <button
                onClick={() => setSelectedCycle('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  selectedCycle === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedCycle(1)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  selectedCycle === 1 ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Ciclo 1
              </button>
              <button
                onClick={() => setSelectedCycle(2)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  selectedCycle === 2 ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Ciclo 2
              </button>
              <button
                onClick={() => setSelectedCycle(3)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  selectedCycle === 3 ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Ciclo 3
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredModules.map((m) => {
          const studentGrade = getStudentGradeForModule(m.id);
          const isApproved = studentGrade?.status === 'aprobado';

          return (
            <div
              key={m.id}
              className={`rounded-2xl border p-5 transition-all relative overflow-hidden flex flex-col justify-between ${
                isApproved
                  ? 'bg-slate-900/90 border-emerald-900/40 shadow-lg shadow-emerald-950/20'
                  : studentGrade?.status === 'en_curso'
                  ? 'bg-slate-900/90 border-blue-900/50'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-mono font-bold text-blue-400">
                      {m.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-semibold text-slate-300">
                      Ciclo {m.cycleOrSemester}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {studentGrade ? (
                    <div
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isApproved
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {studentGrade.status === 'aprobado'
                          ? `Aprobado (${studentGrade.finalScore.toFixed(1)})`
                          : `En Curso (${studentGrade.finalScore.toFixed(1)})`}
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700/50">
                      <Clock className="w-3 h-3" />
                      <span>Pendiente</span>
                    </div>
                  )}
                </div>

                {/* Module title & description */}
                <h3 className="text-lg font-bold text-white mt-3">
                  {m.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {m.description}
                </p>

                {/* Competencies */}
                {m.competencies && m.competencies.length > 0 && (
                  <div className="mt-3.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                      Competencias Laborales Exigidas:
                    </div>
                    <ul className="text-xs space-y-1 text-slate-300">
                      {m.competencies.map((comp, idx) => (
                        <li key={idx} className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hours breakdown */}
                <div className="mt-3 flex items-center space-x-4 text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span>{m.theoryHours}h Teoría</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Scissors className="w-3.5 h-3.5 text-pink-400" />
                    <span>{m.practiceHours}h Salón</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>{m.totalHours}h Totales</span>
                  </div>
                </div>

                {/* Feedback note if available */}
                {studentGrade?.feedback && (
                  <div className="mt-3 text-xs p-2.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-blue-200">
                    <span className="font-bold text-blue-300 block mb-0.5">
                      Observación del Docente ({studentGrade.teacherName}):
                    </span>
                    {studentGrade.feedback}
                  </div>
                )}
              </div>

              {/* Action Button for Teachers / Admin */}
              {!isStudent && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    {studentGrade ? `Nota actual: ${studentGrade.finalScore.toFixed(1)}/5.0` : 'Sin calificación registrada'}
                  </div>
                  <button
                    onClick={() => handleOpenGradeModal(m)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 hover:border-transparent text-blue-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{studentGrade ? 'Editar Calificación' : 'Calificar Módulo'}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grading Modal */}
      {gradingModalOpen && activeModuleForGrade && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-blue-400">
                  {activeModuleForGrade.code}
                </span>
                <h3 className="text-lg font-bold text-white">
                  Evaluar Módulo: {activeModuleForGrade.name}
                </h3>
              </div>
              <button
                onClick={() => setGradingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Estudiante Evaluado
                </label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  <span>
                    {students.find((s) => s.id === effectiveStudentId)?.name || 'Estudiante'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Teoría (30%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={theoryScore}
                    onChange={(e) => setTheoryScore(parseFloat(e.target.value) || 1.0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Práctica (50%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={practiceScore}
                    onChange={(e) => setPracticeScore(parseFloat(e.target.value) || 1.0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Bioseguridad (20%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={biosecurityScore}
                    onChange={(e) => setBiosecurityScore(parseFloat(e.target.value) || 1.0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Calculated final score preview */}
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-blue-300 block font-medium">Nota Definitiva Ponderada:</span>
                  <span className="text-xs text-slate-400">(30% Teoría + 50% Práctica + 20% Bioseguridad)</span>
                </div>
                <div className="text-2xl font-black text-white">
                  {(theoryScore * 0.3 + practiceScore * 0.5 + biosecurityScore * 0.2).toFixed(1)} / 5.0
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Estado Académico del Módulo
                </label>
                <select
                  value={gradeStatus}
                  onChange={(e) => setGradeStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="aprobado">Aprobado (Cumplió competencias)</option>
                  <option value="en_curso">En Curso / Talleres Prácticos</option>
                  <option value="reprobado">Reprobado (Requiere nivelación)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Observaciones & Retroalimentación Técnica
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Excelente manejo de técnica, bioseguridad y atención al cliente..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setGradingModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Calificación</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
