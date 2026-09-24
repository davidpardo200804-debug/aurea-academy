import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Award,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Filter,
  Search,
  PenTool,
  Check,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { appStorage } from '../../services/storage';
import { StudentObserverEntry, ObserverEntryType } from '../../types';

export const StudentObserverView: React.FC = () => {
  const { currentUser, store, playSuccessSound, refreshData } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [targetStudentId, setTargetStudentId] = useState<string>(
    currentUser.role === 'student' ? currentUser.id : (store.users.find((u) => u.role === 'student')?.id || '')
  );
  const [entryType, setEntryType] = useState<ObserverEntryType>('felicitacion_merito');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [studentCommitment, setStudentCommitment] = useState('');
  const [guardianNotified, setGuardianNotified] = useState(false);

  const entries = store.observerEntries || [];
  const isStudent = currentUser.role === 'student';
  const students = store.users.filter((u) => u.role === 'student');

  const filteredEntries = entries.filter((e) => {
    const matchesUser = isStudent ? e.studentId === currentUser.id : true;
    const matchesType = filterType === 'all' || e.entryType === filterType;
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUser && matchesType && matchesSearch;
  });

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const studentObj = students.find((s) => s.id === targetStudentId);
    const studName = studentObj ? studentObj.name : 'Estudiante';
    const enrollment = store.enrollments.find((en) => en.userId === targetStudentId);

    appStorage.createObserverEntry({
      studentId: targetStudentId,
      studentName: studName,
      studentDocument: studentObj?.documentId || 'CC 102349182',
      groupId: enrollment?.groupId || 'grp-peluqueria-1',
      groupName: enrollment?.groupName || 'Técnico en Peluquería Integral',
      date: new Date().toISOString().slice(0, 10),
      entryType,
      title,
      description,
      studentCommitment: studentCommitment.trim() || undefined,
      guardianNotified,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      status: 'activo',
    });

    playSuccessSound();
    refreshData();
    setModalOpen(false);
    setTitle('');
    setDescription('');
    setStudentCommitment('');
    setGuardianNotified(false);
  };

  const handleStudentSign = (entryId: string) => {
    appStorage.updateObserverEntry(entryId, {
      status: 'cumplido_cerrado',
    });
    playSuccessSound();
    refreshData();
  };

  const getTypeBadge = (type: ObserverEntryType) => {
    switch (type) {
      case 'felicitacion_merito':
        return {
          label: 'Felicitación & Destreza',
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          icon: Award,
        };
      case 'falta_bioseguridad':
        return {
          label: 'Bioseguridad & Normas',
          bg: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
          icon: ShieldAlert,
        };
      case 'compromiso_academico':
        return {
          label: 'Compromiso Académico',
          bg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
          icon: FileText,
        };
      case 'llamado_atencion':
        return {
          label: 'Llamado de Atención',
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
          icon: AlertTriangle,
        };
      case 'citacion_acudiente':
        return {
          label: 'Citación a Acudiente',
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
          icon: Calendar,
        };
      default:
        return {
          label: 'Anotación General',
          bg: 'bg-slate-700/40 border-slate-600/40 text-slate-300',
          icon: FileText,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Libro Oficial del Observador Estudiantil</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Observador & Seguimiento Pedagógico</span>
            </h1>
            <p className="text-sm text-slate-400">
              Historial formal de reconocimientos, compromisos de salón escuela y actas de bioseguridad en la academia.
            </p>
          </div>

          {!isStudent && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Anotación en Observador</span>
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar estudiante, motivo o fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400 font-medium shrink-0">Tipo:</span>
            {['all', 'felicitacion_merito', 'falta_bioseguridad', 'compromiso_academico', 'llamado_atencion'].map((tp) => (
              <button
                key={tp}
                onClick={() => setFilterType(tp)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize cursor-pointer shrink-0 ${
                  filterType === tp
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {tp === 'all'
                  ? 'Todos'
                  : tp === 'felicitacion_merito'
                  ? 'Felicitación'
                  : tp === 'falta_bioseguridad'
                  ? 'Bioseguridad'
                  : tp === 'compromiso_academico'
                  ? 'Compromiso'
                  : 'Llamado'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Entries */}
      <div className="space-y-4">
        {filteredEntries.map((item) => {
          const badge = getTypeBadge(item.entryType);
          const Icon = badge.icon;
          const isClosed = item.status === 'cumplido_cerrado';

          return (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className={`p-2.5 rounded-2xl border ${badge.bg} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        {item.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mt-1.5">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Status / Signature */}
                <div className="self-start sm:self-auto">
                  {isClosed ? (
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Firmado y Cumplido por {item.studentName}</span>
                    </div>
                  ) : isStudent && item.studentId === currentUser.id ? (
                    <button
                      onClick={() => handleStudentSign(item.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center space-x-1.5 cursor-pointer"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Firmar Compromiso Digital</span>
                    </button>
                  ) : (
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4" />
                      <span>En Seguimiento Pedagógico</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="mt-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
                {item.description}
              </p>

              {/* Commitment if present */}
              {item.studentCommitment && (
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-1">
                    Compromiso Pedagógico Concertado:
                  </div>
                  <p className="text-xs font-medium text-slate-200">
                    "{item.studentCommitment}"
                  </p>
                </div>
              )}

              {/* Recorded by meta */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
                <div>
                  Registrado por: <strong className="text-slate-200">{item.authorName}</strong> ({item.authorRole === 'admin' ? 'Dirección' : 'Docente'})
                </div>
                <div>
                  Estudiante: <strong className="text-blue-400">{item.studentName}</strong> ({item.groupName})
                </div>
              </div>
            </div>
          );
        })}

        {filteredEntries.length === 0 && (
          <div className="text-center py-12 bg-slate-900/60 border border-slate-800 rounded-3xl">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Sin anotaciones en el observador</h3>
            <p className="text-xs text-slate-400 mt-1">
              No hay registros que coincidan con los criterios seleccionados.
            </p>
          </div>
        )}
      </div>

      {/* New Observer Entry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Nueva Anotación en Observador</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Estudiante
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Categoría de la Anotación
                </label>
                <select
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="felicitacion_merito">Felicitación / Destreza Sobresaliente</option>
                  <option value="falta_bioseguridad">Bioseguridad & Esterilización de Instrumental</option>
                  <option value="compromiso_academico">Rendimiento Académico & Práctico</option>
                  <option value="llamado_atencion">Llamado de Atención Pedagógico</option>
                  <option value="citacion_acudiente">Citación a Acudiente</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título del Asunto
                </label>
                <input
                  type="text"
                  placeholder="Ej: Felicitación por técnica impecable en Balayage y atención a clienta"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Descripción Detallada
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Se deja constancia del desempeño observado en el salón de clases..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Compromiso o Plan de Acción
                </label>
                <input
                  type="text"
                  placeholder="Ej: Estudiar tabla de fondos de aclaración para la próxima clase práctica"
                  value={studentCommitment}
                  onChange={(e) => setStudentCommitment(e.target.value)}
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
                  <span>Guardar en Observador</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
