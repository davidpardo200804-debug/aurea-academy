import React, { useState } from 'react';
import {
  Scissors,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Filter,
  Calendar,
  User,
  FlaskConical,
  Check,
  Search,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { appStorage } from '../../services/storage';
import { SalonPracticeRecord, SalonServiceCategory } from '../../types';

export const SalonPracticesView: React.FC = () => {
  const { currentUser, store, playSuccessSound, refreshData } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceCategory, setServiceCategory] = useState<SalonServiceCategory>('Colorimetría Avanzada & Balayage');
  const [modelClientName, setModelClientName] = useState('');
  const [practiceHours, setPracticeHours] = useState<number>(3);
  const [technicalFormulas, setTechnicalFormulas] = useState('');
  const [targetStudentId, setTargetStudentId] = useState<string>(
    currentUser.role === 'student' ? currentUser.id : (store.users.find((u) => u.role === 'student')?.id || '')
  );

  const practices = store.practiceRecords || [];
  const isStudent = currentUser.role === 'student';
  const students = store.users.filter((u) => u.role === 'student');

  // Filtered
  const filteredPractices = practices.filter((p) => {
    const matchesUser = isStudent ? p.studentId === currentUser.id : true;
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesSearch =
      p.serviceDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.modelClientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUser && matchesStatus && matchesSearch;
  });

  const totalCertifiedHours = practices
    .filter((p) => (isStudent ? p.studentId === currentUser.id : true) && p.status === 'aprobado')
    .reduce((acc, curr) => acc + (curr.practiceHours || 0), 0);

  const handleCreatePractice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceDescription || !modelClientName) return;

    const currentStudent = students.find((s) => s.id === targetStudentId);
    const studName = currentStudent ? currentStudent.name : currentUser.name;
    const studentEnrollment = store.enrollments.find((en) => en.userId === targetStudentId);

    const isSupervisor = currentUser.role === 'teacher' || currentUser.role === 'admin';

    appStorage.createPracticeRecord({
      studentId: targetStudentId,
      studentName: studName,
      groupId: studentEnrollment?.groupId || 'grp-peluqueria-1',
      groupName: studentEnrollment?.groupName || 'Técnico en Peluquería Integral',
      date: new Date().toISOString().slice(0, 10),
      serviceCategory,
      modelClientName,
      serviceDescription,
      technicalFormulas: technicalFormulas.trim() || undefined,
      practiceHours: Number(practiceHours),
      supervisorTeacherId: currentUser.role === 'teacher' ? currentUser.id : 'usr-teacher-1',
      supervisorTeacherName: currentUser.role === 'teacher' ? currentUser.name : 'Prof. Elena Restrepo',
      status: isSupervisor ? 'aprobado' : 'pendiente_revision',
      score: isSupervisor ? 4.8 : undefined,
      teacherObservations: isSupervisor ? 'Práctica técnica aprobada en turno de salón escuela.' : undefined,
      verifiedSignature: isSupervisor,
    });

    playSuccessSound();
    refreshData();
    setModalOpen(false);
    setServiceDescription('');
    setModelClientName('');
    setTechnicalFormulas('');
  };

  const handleApprovePractice = (id: string, score: number) => {
    appStorage.updatePracticeRecord(id, {
      status: 'aprobado',
      score,
      supervisorTeacherId: currentUser.id,
      supervisorTeacherName: currentUser.name,
      teacherObservations: 'Excelente técnica, bioseguridad y protocolo de atención con cliente en salón escuela.',
      verifiedSignature: true,
    });
    playSuccessSound();
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-semibold text-pink-400">
              <Scissors className="w-3.5 h-3.5" />
              <span>Salón Escuela & Prácticas con Modelos Reales</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Bitácora de Prácticas Profesionales</span>
            </h1>
            <p className="text-sm text-slate-400">
              Registro formal de servicios técnicos, clientas atendidas, productos químicos y validación docente.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700/60 text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Horas Certificadas
              </div>
              <div className="text-xl font-black text-emerald-400">
                {totalCertifiedHours}h / 250h Requeridas
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Práctica</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar servicio, estudiante o clienta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400 font-medium shrink-0">Estado:</span>
            {['all', 'aprobado', 'pendiente_revision', 'requiere_correccion'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize cursor-pointer shrink-0 ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all'
                  ? 'Todos'
                  : st === 'pendiente_revision'
                  ? 'Pendiente'
                  : st === 'requiere_correccion'
                  ? 'Por Corregir'
                  : 'Aprobado'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Practices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPractices.map((prac) => (
          <div
            key={prac.id}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/20 text-xs font-bold text-pink-300">
                  {prac.serviceCategory}
                </span>

                <div
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    prac.status === 'aprobado'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : prac.status === 'requiere_correccion'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {prac.status === 'aprobado' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {prac.status === 'aprobado'
                      ? `Aprobado (${prac.score?.toFixed(1) || '5.0'})`
                      : prac.status === 'requiere_correccion'
                      ? 'Por Corregir'
                      : 'En Supervisión'}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mt-3 leading-snug">
                {prac.serviceDescription}
              </h3>

              {/* Student & Client meta */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Estudiante: <strong className="text-white">{prac.studentName}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>Clienta/Modelo: <strong className="text-slate-200">{prac.modelClientName}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Duración: <strong className="text-emerald-400">{prac.practiceHours} horas acreditadas</strong></span>
                </div>
              </div>

              {/* Technical Formulas */}
              {prac.technicalFormulas && (
                <div className="mt-3.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-slate-400 mb-1">
                    <FlaskConical className="w-3 h-3 text-indigo-400" />
                    <span>Fórmula & Técnica Aplicada:</span>
                  </div>
                  <p className="text-xs font-mono text-slate-300">
                    {prac.technicalFormulas}
                  </p>
                </div>
              )}

              {/* Teacher observations */}
              {prac.teacherObservations && (
                <div className="mt-3 p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300">
                  <span className="font-bold block text-[11px]">
                    Evaluación de {prac.supervisorTeacherName}:
                  </span>
                  {prac.teacherObservations}
                </div>
              )}
            </div>

            {/* Footer / Teacher Action */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{prac.date}</span>

              {!isStudent && prac.status !== 'aprobado' && (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleApprovePractice(prac.id, 4.8)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aprobar (4.8)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Practice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Scissors className="w-5 h-5 text-pink-400" />
                <h3 className="text-lg font-bold text-white">Registrar Práctica en Salón</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePractice} className="mt-4 space-y-4">
              {!isStudent && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Estudiante Responsable
                  </label>
                  <select
                    value={targetStudentId}
                    onChange={(e) => setTargetStudentId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-blue-500"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.gradeLevel || 'Estudiante'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Categoría de Servicio
                  </label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Colorimetría Avanzada & Balayage">Colorimetría & Balayage</option>
                    <option value="Corte de Cabello Femenino/Masculino">Corte de Cabello</option>
                    <option value="Barbería, Fade & Barba">Barbería & Fade</option>
                    <option value="Tratamientos Capilares & Alisados">Alisados & Keratinas</option>
                    <option value="Peinados, Brushing & Ondas">Peinados & Brushing</option>
                    <option value="Manicura, Pedicura & Nail Art">Manicura & Uñas</option>
                    <option value="Maquillaje Social & Fiesta">Maquillaje Social</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Horas de Práctica
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={practiceHours}
                    onChange={(e) => setPracticeHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Descripción del Servicio Realizado
                </label>
                <input
                  type="text"
                  placeholder="Ej: Balayage Rubio Vainilla + Matiz 9.12 + Corte en Capas + Brushing"
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre de la Clienta o Modelo
                </label>
                <input
                  type="text"
                  placeholder="Ej: Carolina Restrepo (Modelo voluntaria)"
                  value={modelClientName}
                  onChange={(e) => setModelClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fórmula Química & Técnica
                </label>
                <input
                  type="text"
                  placeholder="Ej: Decolorante 1:2 con 20 Vol + Tinte 9.1 + Protector Plex"
                  value={technicalFormulas}
                  onChange={(e) => setTechnicalFormulas(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Bitácora</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
