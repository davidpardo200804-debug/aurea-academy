import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardCheck,
  CheckCircle2,
  Clock,
  FileQuestion,
  XCircle,
  Calendar,
  Users,
  Search,
  Filter,
  Save,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  BookOpen,
  AlertTriangle,
  History,
  Check,
  Scissors,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { AttendanceSession, AttendanceStatus, StudentAttendanceItem } from '../../types';
import { appStorage } from '../../services/storage';

export const AttendanceManagement: React.FC = () => {
  const { currentUser, currentRole, playSuccessSound, refreshData } = useApp();
  const store = appStorage.getStore();

  const groups = store.groups || [];
  const enrollments = store.enrollments || [];
  const pastSessions: AttendanceSession[] = store.attendanceSessions || [];

  const [activeView, setActiveView] = useState<'take_attendance' | 'history' | 'student_stats'>('take_attendance');

  // Selected parameters for taking roll call
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || '');
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sessionShift, setSessionShift] = useState<string>('Mañana');
  const [topicCovered, setTopicCovered] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected group object
  const currentGroup = useMemo(() => {
    return groups.find((g) => g.id === selectedGroupId) || groups[0];
  }, [groups, selectedGroupId]);

  // Students in this group
  const groupStudents = useMemo(() => {
    if (!currentGroup) return [];
    return enrollments.filter(
      (e) => e.groupId === currentGroup.id || currentGroup.enrolledStudentIds?.includes(e.userId)
    );
  }, [enrollments, currentGroup]);

  // Attendance state for current session
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>(
    {}
  );

  // Initialize records when group changes or students load
  useEffect(() => {
    if (groupStudents.length > 0) {
      // Check if session for this group & date already exists in history
      const existing = pastSessions.find((s) => s.groupId === currentGroup?.id && s.date === sessionDate);

      if (existing) {
        setTopicCovered(existing.topicCovered || '');
        const map: Record<string, { status: AttendanceStatus; remarks: string }> = {};
        existing.records.forEach((r) => {
          map[r.studentId] = { status: r.status, remarks: r.remarks || '' };
        });
        setAttendanceRecords(map);
      } else {
        const initialMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};
        groupStudents.forEach((student) => {
          // Default all to 'presente' for quick roll call
          initialMap[student.userId] = { status: 'presente', remarks: '' };
        });
        setAttendanceRecords(initialMap);
      }
    }
  }, [currentGroup?.id, sessionDate, groupStudents.length]);

  // Counters
  const counters = useMemo(() => {
    let present = 0;
    let late = 0;
    let excused = 0;
    let absent = 0;

    Object.values(attendanceRecords).forEach((rec) => {
      if (rec.status === 'presente') present++;
      if (rec.status === 'tardanza') late++;
      if (rec.status === 'excusa') excused++;
      if (rec.status === 'falta') absent++;
    });

    const total = groupStudents.length || 1;
    const attendancePercentage = Math.round(((present + late) / total) * 100);

    return { present, late, excused, absent, total: groupStudents.length, attendancePercentage };
  }, [attendanceRecords, groupStudents]);

  // Quick actions
  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    groupStudents.forEach((s) => {
      updated[s.userId] = {
        status,
        remarks: attendanceRecords[s.userId]?.remarks || '',
      };
    });
    setAttendanceRecords(updated);
  };

  const handleUpdateStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleUpdateStudentRemarks = (studentId: string, remarks: string) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  // Save session
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGroup) return;

    const recordsArray: StudentAttendanceItem[] = groupStudents.map((s) => {
      const rec = attendanceRecords[s.userId] || { status: 'presente', remarks: '' };
      return {
        studentId: s.userId,
        studentName: s.fullName,
        studentDocument: s.documentId,
        avatar: s.avatar,
        status: rec.status,
        remarks: rec.remarks,
      };
    });

    appStorage.saveAttendanceSession({
      groupId: currentGroup.id,
      groupName: currentGroup.name,
      date: sessionDate,
      shift: sessionShift,
      teacherId: currentRole === 'teacher' ? currentUser.id : currentGroup.teacherId || currentUser.id,
      teacherName: currentRole === 'teacher' ? currentUser.name : currentGroup.teacherName || currentUser.name,
      topicCovered: topicCovered || 'Práctica General de Taller',
      records: recordsArray,
      totalStudents: recordsArray.length,
      presentCount: counters.present,
      lateCount: counters.late,
      excusedCount: counters.excused,
      absentCount: counters.absent,
    });

    playSuccessSound();
    refreshData();
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 3000);
  };

  // Student cumulative stats
  const studentCumulativeStats = useMemo(() => {
    return groupStudents.map((student) => {
      let totalAssigned = 0;
      let presentTotal = 0;
      let lateTotal = 0;
      let excusedTotal = 0;
      let absentTotal = 0;

      pastSessions
        .filter((s) => s.groupId === currentGroup?.id)
        .forEach((session) => {
          const rec = session.records.find((r) => r.studentId === student.userId);
          if (rec) {
            totalAssigned++;
            if (rec.status === 'presente') presentTotal++;
            if (rec.status === 'tardanza') lateTotal++;
            if (rec.status === 'excusa') excusedTotal++;
            if (rec.status === 'falta') absentTotal++;
          }
        });

      const effectiveAttendance = totalAssigned > 0 ? Math.round(((presentTotal + lateTotal) / totalAssigned) * 100) : 100;
      const isRisk = absentTotal >= 2;

      return {
        student,
        totalAssigned,
        presentTotal,
        lateTotal,
        excusedTotal,
        absentTotal,
        effectiveAttendance,
        isRisk,
      };
    });
  }, [groupStudents, pastSessions, currentGroup?.id]);

  // Filter students by search
  const filteredStudents = useMemo(() => {
    return groupStudents.filter(
      (s) =>
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.documentId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groupStudents, searchTerm]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b132b] via-[#102a43] to-[#1e1b4b] border border-sky-500/25 p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-gradient-to-br from-sky-400/20 to-purple-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg shadow-sky-500/20 shrink-0 border border-sky-400/40 flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="Arte & Estilo"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold mb-2">
                <Scissors className="w-3.5 h-3.5 text-purple-300" />
                <span>Arte & Estilo • Control de Asistencia y Bitácora de Práctica</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Llamado a Lista de Estudiantes
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Pasa lista en tiempo real por cada grupo y taller de belleza. Registra asistencias, retardos,
                justificaciones y el tema técnico o práctica realizada en la clase.
              </p>
            </div>
          </div>

          {/* View switcher */}
          <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-2xl border border-sky-500/30 shrink-0">
            <button
              onClick={() => setActiveView('take_attendance')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeView === 'take_attendance'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Tomar Lista</span>
            </button>

            <button
              onClick={() => setActiveView('history')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeView === 'history'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Historial ({pastSessions.length})</span>
            </button>

            <button
              onClick={() => setActiveView('student_stats')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeView === 'student_stats'
                  ? 'bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-purple-300" />
              <span>Reporte de Inasistencias</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: TAKE ATTENDANCE (LLAMADO A LISTA) */}
      {activeView === 'take_attendance' && (
        <div className="space-y-6">
          {/* Session Configuration Card */}
          <div className="bg-slate-900/90 border border-sky-500/25 rounded-3xl p-5 sm:p-6 shadow-xl text-white space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Group selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>Grupo / Especialidad de Belleza</span>
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400 font-medium"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.shift})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>Fecha de la Clase</span>
                </label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Shift */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Jornada / Horario</span>
                </label>
                <select
                  value={sessionShift}
                  onChange={(e) => setSessionShift(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="Mañana">Jornada Mañana (08:00 AM - 12:00 PM)</option>
                  <option value="Tarde">Jornada Tarde (02:00 PM - 06:00 PM)</option>
                  <option value="Noche">Jornada Noche (06:00 PM - 09:30 PM)</option>
                  <option value="Sábados">Sábados Intensivos (08:00 AM - 04:00 PM)</option>
                </select>
              </div>

              {/* Docente titular */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Docente / Instructor</label>
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-sky-300 font-semibold truncate">
                  {currentRole === 'teacher' ? currentUser.name : currentGroup?.teacherName || 'Docente Asignado'}
                </div>
              </div>
            </div>

            {/* Topic / Practical Exercise */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>Tema Técnico o Práctica en Taller Dictada Hoy</span>
              </label>
              <input
                type="text"
                value={topicCovered}
                onChange={(e) => setTopicCovered(e.target.value)}
                placeholder="Ej: Montaje de Mechas Balayage al aire libre con oxidante 20 vol y matización platinada"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {/* Quick status bar & Batch actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-white">
            {/* Live Status Indicators */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{counters.present} Presentes</span>
              </div>

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{counters.late} Retardos</span>
              </div>

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                <FileQuestion className="w-4 h-4 text-purple-400" />
                <span>{counters.excused} Excusas</span>
              </div>

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>{counters.absent} Faltas</span>
              </div>

              <div className="text-xs font-bold text-sky-300 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/20">
                {counters.attendancePercentage}% Asistencia Global
              </div>
            </div>

            {/* Quick buttons */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleMarkAll('presente')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
              >
                Todos Presentes
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('falta')}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Students List Table */}
          <div className="bg-slate-900/90 border border-sky-500/20 rounded-3xl p-6 shadow-xl text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base text-white flex items-center space-x-2">
                  <ClipboardCheck className="w-5 h-5 text-sky-400" />
                  <span>Estudiantes Matriculados ({groupStudents.length})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Haz clic en el estado de cada estudiante para cambiar su asistencia
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar estudiante..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 font-semibold">
                    <th className="py-3 px-4">Estudiante / Aprendiz</th>
                    <th className="py-3 px-4">Documento</th>
                    <th className="py-3 px-4 text-center">Estado de Asistencia</th>
                    <th className="py-3 px-4">Observaciones / Motivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No hay estudiantes inscritos en este grupo o no coinciden con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => {
                      const record = attendanceRecords[student.userId] || { status: 'presente', remarks: '' };

                      return (
                        <tr key={student.userId} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={
                                  student.avatar ||
                                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
                                }
                                alt={student.fullName}
                                className="w-8 h-8 rounded-full object-cover border border-sky-400/40 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-white block">{student.fullName}</span>
                                <span className="text-[10px] text-slate-400">{student.groupName}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono text-slate-300">{student.documentId}</td>

                          {/* Interactive Status Selector */}
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center space-x-1.5">
                              {/* Presente */}
                              <button
                                type="button"
                                onClick={() => handleUpdateStudentStatus(student.userId, 'presente')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                                  record.status === 'presente'
                                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400 hover:text-emerald-300 hover:bg-slate-700'
                                }`}
                                title="Asistió puntualmente"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Presente</span>
                              </button>

                              {/* Tardanza */}
                              <button
                                type="button"
                                onClick={() => handleUpdateStudentStatus(student.userId, 'tardanza')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                                  record.status === 'tardanza'
                                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                                    : 'bg-slate-800 text-slate-400 hover:text-amber-300 hover:bg-slate-700'
                                }`}
                                title="Llegó tarde con retraso"
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Tarde</span>
                              </button>

                              {/* Excusa */}
                              <button
                                type="button"
                                onClick={() => handleUpdateStudentStatus(student.userId, 'excusa')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                                  record.status === 'excusa'
                                    ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                                    : 'bg-slate-800 text-slate-400 hover:text-purple-300 hover:bg-slate-700'
                                }`}
                                title="Inasistencia justificada con excusa o soporte"
                              >
                                <FileQuestion className="w-3.5 h-3.5" />
                                <span>Excusa</span>
                              </button>

                              {/* Falta */}
                              <button
                                type="button"
                                onClick={() => handleUpdateStudentStatus(student.userId, 'falta')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                                  record.status === 'falta'
                                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                                    : 'bg-slate-800 text-slate-400 hover:text-rose-300 hover:bg-slate-700'
                                }`}
                                title="Inasistencia injustificada"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Falta</span>
                              </button>
                            </div>
                          </td>

                          {/* Remarks */}
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={record.remarks}
                              onChange={(e) => handleUpdateStudentRemarks(student.userId, e.target.value)}
                              placeholder="Observación o motivo..."
                              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Save Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center space-x-2">
                {saveSuccessMessage && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡Asistencia guardada y registrada con éxito en el sistema!</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleSaveAttendance}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-sky-500/25 flex items-center space-x-2 cursor-pointer transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Planilla de Asistencia</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: HISTORIAL DE ASISTENCIAS PASADAS */}
      {activeView === 'history' && (
        <div className="bg-slate-900/90 border border-purple-500/20 rounded-3xl p-6 shadow-xl text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-white flex items-center space-x-2">
                <History className="w-5 h-5 text-purple-400" />
                <span>Historial de Sesiones Registradas</span>
              </h3>
              <p className="text-xs text-slate-400">
                Consulta los llamados a lista anteriores, asistencias y temas vistos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {pastSessions.length === 0 ? (
              <div className="col-span-2 py-10 text-center text-slate-400">
                No hay sesiones de asistencia archivadas aún. Pasa lista en la pestaña "Tomar Lista".
              </div>
            ) : (
              pastSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-slate-800/80 border border-slate-700/80 hover:border-purple-500/40 rounded-2xl p-4 transition-all"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-sky-400">{session.groupName}</span>
                    <span className="font-mono text-slate-400">{session.date}</span>
                  </div>

                  <p className="text-xs font-medium text-slate-300">
                    <span className="text-slate-400">Tema: </span>
                    <span className="text-white">{session.topicCovered}</span>
                  </p>

                  <p className="text-[11px] text-slate-400 mt-1">
                    Docente: <strong className="text-slate-200">{session.teacherName}</strong> • Jornada:{' '}
                    {session.shift}
                  </p>

                  <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-slate-700/60 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {session.presentCount} presentes
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      {session.lateCount} retardos
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                      {session.absentCount} faltas
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: REPORTE DE INASISTENCIAS & ALERTAS */}
      {activeView === 'student_stats' && (
        <div className="bg-slate-900/90 border border-sky-500/20 rounded-3xl p-6 shadow-xl text-white space-y-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-sky-400" />
              <span>Porcentaje de Asistencia Acumulado por Estudiante</span>
            </h3>
            <p className="text-xs text-slate-400">
              Seguimiento al cumplimiento académico y alertas preventivas de deserción o pérdida por fallas
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 font-semibold">
                  <th className="py-3 px-4">Estudiante</th>
                  <th className="py-3 px-4 text-center">Clases Evaluadas</th>
                  <th className="py-3 px-4 text-center text-emerald-400">Presentes</th>
                  <th className="py-3 px-4 text-center text-amber-400">Tardanzas</th>
                  <th className="py-3 px-4 text-center text-rose-400">Faltas</th>
                  <th className="py-3 px-4 text-center">% Asistencia</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {studentCumulativeStats.map((stat) => (
                  <tr key={stat.student.userId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={stat.student.avatar}
                          alt={stat.student.fullName}
                          className="w-7 h-7 rounded-full object-cover border border-sky-400/40"
                        />
                        <span className="font-bold text-white">{stat.student.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-300">{stat.totalAssigned || 1}</td>
                    <td className="py-3 px-4 text-center text-emerald-300 font-bold">{stat.presentTotal}</td>
                    <td className="py-3 px-4 text-center text-amber-300 font-bold">{stat.lateTotal}</td>
                    <td className="py-3 px-4 text-center text-rose-300 font-black">{stat.absentTotal}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center space-x-1.5 font-black text-white">
                        <span>{stat.effectiveAttendance}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {stat.isRisk ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>Riesgo Inasistencia</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Al Día
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
