import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserPlus,
  Search,
  Filter,
  FileSpreadsheet,
  Printer,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  DollarSign,
  GraduationCap,
  Camera,
} from 'lucide-react';
import { exportToCSV, printSection } from '../../services/exportUtils';
import { StudentEnrollmentModal } from './StudentEnrollmentModal';
import { appStorage } from '../../services/storage';

export const StudentsManagement: React.FC = () => {
  const { store, refreshData, setSelectedChatContactId, setIsChatOpen, playNotificationSound, playSuccessSound } = useApp();
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('ALL');
  const [filterPayment, setFilterPayment] = useState('ALL'); // ALL, AL_DIA, CON_DEUDA

  const enrollments = store.enrollments;

  const handlePhotoUploadForStudent = (userId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          appStorage.updateStudentAvatar(userId, event.target.result as string);
          playSuccessSound();
          refreshData();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredStudents = enrollments.filter((std) => {
    const matchesSearch =
      std.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.documentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup = filterGroup === 'ALL' || std.groupId === filterGroup;

    const hasDebt = std.balanceDue > 0;
    const matchesPayment =
      filterPayment === 'ALL' ||
      (filterPayment === 'AL_DIA' && !hasDebt) ||
      (filterPayment === 'CON_DEUDA' && hasDebt);

    return matchesSearch && matchesGroup && matchesPayment;
  });

  const handleExportExcel = () => {
    const headers = [
      'Documento',
      'Nombre Completo',
      'Grupo',
      'Plan Financiero',
      'Valor Mensual',
      'Saldo Pendiente',
      'Estado Cartera',
      'Correo',
      'Teléfono',
      'Acudiente',
      'Tel. Acudiente',
      'Fecha Matrícula',
    ];

    const rows = filteredStudents.map((s) => [
      s.documentId,
      s.fullName,
      s.groupName,
      s.paymentPlan,
      s.monthlyAmount,
      s.balanceDue,
      s.balanceDue > 0 ? 'EN MORA / PENDIENTE' : 'PAZ Y SALVO',
      s.email,
      s.phone,
      s.guardianName,
      s.guardianPhone,
      s.enrollmentDate,
    ]);

    exportToCSV(`Estudiantes_EduManage_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  const handleSendPaymentReminder = (studentId: string, studentName: string, balance: number) => {
    // Send automated notification
    store.notifications.unshift({
      id: `notif-${Date.now()}`,
      targetUserId: studentId,
      title: '🚨 Recordatorio Urgente de Pago Escolar',
      message: `Hola ${studentName}, presentas un saldo vencido de $${balance.toLocaleString('es-CO')}. Por favor realiza el pago por la plataforma para evitar recargos.`,
      type: 'payment',
      read: false,
      timestamp: 'Justo ahora',
      targetTab: 'finances',
    });
    appStorage.saveStore(store);
    playNotificationSound();
    refreshData();
    alert(`Recordatorio de pago enviado exitosamente a ${studentName}.`);
  };

  const handleOpenChatWithStudent = (userId: string) => {
    setSelectedChatContactId(userId);
    setIsChatOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
            <span>Gestión Escolar y Registro de Matrículas</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inscribe nuevos alumnos, supervisa el estado de cartera y genera reportes oficiales.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            title="Exportar a formato Excel compatible"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar Excel</span>
          </button>

          <button
            onClick={() => printSection('students-printable-table', 'Reporte General de Estudiantes')}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            title="Generar e imprimir PDF"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Imprimir PDF</span>
          </button>

          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Matricular Alumno</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Total Estudiantes Matriculados</div>
          <div className="text-2xl font-black text-white mt-1">{enrollments.length}</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">100% cupos asignados</div>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Estudiantes al Día (Paz y Salvo)</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {enrollments.filter((e) => e.balanceDue === 0).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Sin deudas de matrícula o pensión</div>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Estudiantes con Saldo Pendiente</div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            {enrollments.filter((e) => e.balanceDue > 0).length}
          </div>
          <div className="text-[11px] text-rose-400/80 font-medium mt-1">
            Cartera total: $
            {enrollments
              .reduce((acc, curr) => acc + curr.balanceDue, 0)
              .toLocaleString('es-CO')}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, documento o correo..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">Todos los grupos</option>
              {store.groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">Todos los estados de pago</option>
            <option value="AL_DIA">Al día (Paz y salvo)</option>
            <option value="CON_DEUDA">Con deuda pendiente</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div id="students-printable-table" className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Estudiante / Documento</th>
                <th className="py-3.5 px-4">Grupo Asignado</th>
                <th className="py-3.5 px-4">Plan Financiero</th>
                <th className="py-3.5 px-4">Estado Cartera</th>
                <th className="py-3.5 px-4">Acudiente</th>
                <th className="py-3.5 px-4 text-right no-print">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    No se encontraron estudiantes con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => {
                  const hasDebt = std.balanceDue > 0;
                  const studentUser = store.users.find((u) => u.id === std.userId);
                  const avatarUrl =
                    std.avatar ||
                    studentUser?.avatar ||
                    `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;

                  return (
                    <tr key={std.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative group shrink-0">
                            <img
                              src={avatarUrl}
                              alt={std.fullName}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
                            />
                            <label
                              className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white"
                              title="Cambiar foto de este alumno"
                            >
                              <Camera className="w-4 h-4" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoUploadForStudent(std.userId, e)}
                                className="hidden"
                              />
                            </label>
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">{std.fullName}</div>
                            <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                              <span>{std.documentId}</span>
                              <span>•</span>
                              <span>{std.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-200">
                        {std.groupName}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-200">{std.paymentPlan}</span>
                        <div className="text-[11px] text-slate-400">
                          ${std.monthlyAmount.toLocaleString('es-CO')} / mes
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {hasDebt ? (
                          <div>
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Debe ${std.balanceDue.toLocaleString('es-CO')}</span>
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Paz y Salvo ($0)</span>
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{std.guardianName}</div>
                        <div className="text-[11px] text-slate-400">{std.guardianPhone}</div>
                      </td>

                      <td className="py-3.5 px-4 text-right no-print">
                        <div className="flex items-center justify-end space-x-1.5">
                          {hasDebt && (
                            <button
                              onClick={() => handleSendPaymentReminder(std.userId, std.fullName, std.balanceDue)}
                              className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
                              title="Enviar notificación de cobro automática"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenChatWithStudent(std.userId)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="Chat directo con el alumno"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StudentEnrollmentModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
      />
    </div>
  );
};
