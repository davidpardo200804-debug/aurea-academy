import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  PlusCircle,
  Clock,
  MapPin,
  UserCheck,
  GraduationCap,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { appStorage } from '../../services/storage';

export const GroupsManagement: React.FC = () => {
  const { store, refreshData, playSuccessSound } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroupDetailsId, setSelectedGroupDetailsId] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [teacherId, setTeacherId] = useState(
    store.users.find((u) => u.role === 'teacher')?.id || ''
  );
  const [level, setLevel] = useState('11° Grado');
  const [shift, setShift] = useState<'Mañana' | 'Tarde' | 'Noche' | 'Fines de Semana'>('Mañana');
  const [maxCapacity, setMaxCapacity] = useState('30');
  const [monthlyFee, setMonthlyFee] = useState('180000');
  const [room, setRoom] = useState('Aula 201');

  const teachers = store.users.filter((u) => u.role === 'teacher');

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const teacher = teachers.find((t) => t.id === teacherId);

    appStorage.createGroup({
      code,
      name,
      description,
      teacherId,
      teacherName: teacher ? teacher.name : 'Por asignar',
      level,
      shift,
      maxCapacity: Number(maxCapacity) || 30,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-15',
      monthlyFee: Number(monthlyFee) || 180000,
      room,
    });

    playSuccessSound();
    refreshData();
    setIsCreateModalOpen(false);
    setCode('');
    setName('');
    setDescription('');
  };

  const selectedGroup = store.groups.find((g) => g.id === selectedGroupDetailsId);
  const selectedGroupStudents = selectedGroup
    ? store.enrollments.filter((e) => e.groupId === selectedGroup.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Grupos Estudiantiles y Asignación Docente</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organiza salones, jornadas académicas, profesores titulares y aforos.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Crear Nuevo Grupo</span>
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {store.groups.map((group) => {
          const enrolledStudents = store.enrollments.filter((e) => e.groupId === group.id);
          const percentFilled = Math.min(100, Math.round((enrolledStudents.length / group.maxCapacity) * 100));

          return (
            <div
              key={group.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-5 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {group.code}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Activo</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">{group.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {group.description || 'Sin descripción adicional.'}
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="text-slate-400">Profesor titular:</span>
                    <span className="font-semibold text-white truncate">{group.teacherName}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-slate-400">Jornada:</span>
                    <span>{group.shift}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="text-slate-400">Salón:</span>
                    <span>{group.room}</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
                    <span className="text-slate-400">
                      Ocupación: {enrolledStudents.length} / {group.maxCapacity} alumnos
                    </span>
                    <span className="text-indigo-400 font-bold">{percentFilled}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">
                  ${group.monthlyFee.toLocaleString('es-CO')} <span className="text-[10px] text-slate-400">/mes</span>
                </span>
                <button
                  onClick={() => setSelectedGroupDetailsId(group.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  Ver Alumnos ({enrolledStudents.length})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Group */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-4">Crear Nuevo Grupo Académico</h2>
            <form onSubmit={handleCreateGroup} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Código</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ej. BACH-11B"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nivel / Grado</label>
                  <input
                    type="text"
                    required
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="11° Grado"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Grupo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. 11° Bachillerato Académico - Grupo B"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Profesor Titular</label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.specialty || 'Docente'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Jornada</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                    <option value="Fines de Semana">Fines de Semana</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cupo Máx.</label>
                  <input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Salón</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Aula 102"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pensión Mensual Sugerida ($COP)</label>
                <input
                  type="number"
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white"
                >
                  Guardar Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Group Students */}
      {selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6">
            <h2 className="text-base font-bold text-white mb-1">{selectedGroup.name}</h2>
            <p className="text-xs text-slate-400 mb-4">
              Profesor: {selectedGroup.teacherName} • Salón: {selectedGroup.room}
            </p>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
              {selectedGroupStudents.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No hay estudiantes inscritos en este grupo aún.
                </div>
              ) : (
                selectedGroupStudents.map((std) => (
                  <div key={std.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">{std.fullName}</div>
                      <div className="text-[11px] text-slate-400">{std.documentId} • {std.email}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        std.balanceDue > 0
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {std.balanceDue > 0 ? `Debe $${std.balanceDue.toLocaleString('es-CO')}` : 'Al Día'}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedGroupDetailsId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
