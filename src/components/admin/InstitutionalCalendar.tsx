import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Users,
  Tag,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { printSection } from '../../services/exportUtils';
import { appStorage } from '../../services/storage';
import { CalendarEvent, UserRole } from '../../types';

export const InstitutionalCalendar: React.FC = () => {
  const { store, currentRole, refreshData, playSuccessSound } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [type, setType] = useState<CalendarEvent['type']>('reunion');
  const [targetRoles, setTargetRoles] = useState<UserRole[]>(['admin', 'teacher']);
  const [location, setLocation] = useState('Sala de Juntas Principal');

  const events = store.events.filter((evt) => {
    // Check if event targets currentUser role or if current user is admin
    const isTargeted = currentRole === 'admin' || evt.targetRoles.includes(currentRole);
    const matchesType = filterType === 'ALL' || evt.type === filterType;
    return isTargeted && matchesType;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    appStorage.createEvent({
      title,
      description,
      date,
      time,
      type,
      targetRoles,
      location,
      createdBy: 'Coordinación Institucional',
    });

    playSuccessSound();
    refreshData();
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const toggleRole = (r: UserRole) => {
    if (targetRoles.includes(r)) {
      if (targetRoles.length > 1) {
        setTargetRoles(targetRoles.filter((item) => item !== r));
      }
    } else {
      setTargetRoles([...targetRoles, r]);
    }
  };

  const getEventBadge = (evtType: string) => {
    switch (evtType) {
      case 'reunion':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'evaluacion':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'pago':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'academico':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <CalendarIcon className="w-6 h-6 text-indigo-400" />
            <span>Calendario y Agenda Institucional</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cronograma oficial de reuniones académicas, claustros docentes, cierres de notas y eventos.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => printSection('calendar-printable-agenda', 'Agenda Institucional de Eventos')}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Imprimir Agenda</span>
          </button>

          {currentRole === 'admin' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Programar Evento</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="text-xs font-semibold text-slate-300 flex items-center space-x-2">
          <span>Filtrar categoría:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'reunion', 'academico', 'evaluacion', 'pago'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filterType === t
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              {t === 'ALL'
                ? 'Todos'
                : t === 'reunion'
                ? 'Reuniones'
                : t === 'academico'
                ? 'Académicos'
                : t === 'evaluacion'
                ? 'Evaluaciones'
                : 'Pagos'}
            </button>
          ))}
        </div>
      </div>

      {/* Events Agenda List */}
      <div id="calendar-printable-agenda" className="space-y-3.5">
        {events.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-xs">
            No hay eventos programados en esta categoría.
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-950/60 border border-indigo-800/40 rounded-2xl p-3 text-center min-w-[70px]">
                  <div className="text-[10px] font-bold uppercase text-indigo-400">
                    {new Date(evt.date + 'T00:00:00').toLocaleDateString('es-CO', { month: 'short' })}
                  </div>
                  <div className="text-2xl font-black text-white">
                    {new Date(evt.date + 'T00:00:00').getDate()}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{evt.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getEventBadge(
                        evt.type
                      )}`}
                    >
                      {evt.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{evt.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{evt.time}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{evt.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        Para: {evt.targetRoles.map((r) => (r === 'admin' ? 'Directivos' : r === 'teacher' ? 'Profesores' : 'Estudiantes')).join(', ')}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-mono">Por: {evt.createdBy}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Program new event */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-4">Programar Reunión o Evento</h2>
            <form onSubmit={handleCreateEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título del Evento *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Claustro Docente - Cierre Corte 1"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción / Objetivos</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles de la reunión o agenda..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hora</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Evento</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="reunion">Reunión / Claustro</option>
                    <option value="evaluacion">Cierre de Notas / Evaluación</option>
                    <option value="academico">Evento Académico / Feria</option>
                    <option value="pago">Vencimiento de Pago / Pensión</option>
                    <option value="feriado">Feriado / Receso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ubicación / Enlace</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Aula 204 o Google Meet"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Dirigido a (Notificar automáticamente):
                </label>
                <div className="flex space-x-2">
                  {(['admin', 'teacher', 'student'] as UserRole[]).map((r) => {
                    const selected = targetRoles.includes(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => toggleRole(r)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          selected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {r === 'admin' ? 'Directivos' : r === 'teacher' ? 'Profesores' : 'Estudiantes'}
                      </button>
                    );
                  })}
                </div>
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg"
                >
                  Guardar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
