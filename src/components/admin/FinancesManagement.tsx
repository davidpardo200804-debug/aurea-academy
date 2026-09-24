import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  Search,
  Filter,
  Check,
  X,
  CreditCard,
  Building,
} from 'lucide-react';
import { exportToCSV, printSection } from '../../services/exportUtils';
import { appStorage } from '../../services/storage';

export const FinancesManagement: React.FC = () => {
  const { store, refreshData, playSuccessSound, playNotificationSound } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'income' | 'invoices'>('income');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Stats calculation
  const totalIncomePaid = store.payments
    .filter((p) => p.status === 'pagado')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPendingDebt = store.payments
    .filter((p) => p.status === 'pendiente' || p.status === 'vencido')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalTeacherPayrollPaid = store.invoices
    .filter((inv) => inv.status === 'pagado')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalTeacherPayrollPending = store.invoices
    .filter((inv) => inv.status === 'pendiente' || inv.status === 'aprobado')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const netBalance = totalIncomePaid - totalTeacherPayrollPaid;

  // Filtered Payments
  const filteredPayments = store.payments.filter((pay) => {
    const matchesSearch =
      pay.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.referenceCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || pay.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Filtered Invoices
  const filteredInvoices = store.invoices.filter((inv) => {
    const matchesSearch =
      inv.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.monthPeriod.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleApproveInvoice = (invoiceId: string) => {
    appStorage.updateTeacherInvoiceStatus(invoiceId, 'aprobado', 'Revisado y aprobado por Dirección Financiera.');
    playSuccessSound();
    refreshData();
  };

  const handlePayInvoice = (invoiceId: string) => {
    appStorage.updateTeacherInvoiceStatus(invoiceId, 'pagado', 'Giro por transferencia bancaria efectuado con éxito.');
    playSuccessSound();
    refreshData();
  };

  const handleRejectInvoice = (invoiceId: string) => {
    const reason = prompt('Ingrese el motivo de rechazo u observación:', 'Faltan soportes de planillas de asistencia');
    if (reason) {
      appStorage.updateTeacherInvoiceStatus(invoiceId, 'rechazado', reason);
      playNotificationSound();
      refreshData();
    }
  };

  const handleExportExcel = () => {
    if (activeSubTab === 'income') {
      const headers = ['Ref. Pago', 'Estudiante', 'Concepto', 'Valor ($COP)', 'Fecha Límite', 'Fecha Pago', 'Estado', 'Medio'];
      const rows = filteredPayments.map((p) => [
        p.referenceCode,
        p.studentName,
        p.concept,
        p.amount,
        p.dueDate,
        p.paidDate || 'N/A',
        p.status.toUpperCase(),
        p.paymentMethod || 'N/A',
      ]);
      exportToCSV(`Ingresos_Estudiantiles_${new Date().toISOString().slice(0, 10)}`, headers, rows);
    } else {
      const headers = ['ID', 'Profesor', 'Periodo', 'Horas', 'Valor Hora', 'Total ($COP)', 'Estado', 'Fecha Radicación', 'Fecha Pago'];
      const rows = filteredInvoices.map((inv) => [
        inv.id,
        inv.teacherName,
        inv.monthPeriod,
        inv.classCount || inv.hoursWorked || 0,
        inv.ratePerClass || inv.hourlyRate || 0,
        inv.totalAmount,
        inv.status.toUpperCase(),
        inv.submissionDate,
        inv.paymentDate || 'N/A',
      ]);
      exportToCSV(`Honorarios_Docentes_${new Date().toISOString().slice(0, 10)}`, headers, rows);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <span>Tesorería, Cobros & Honorarios Docentes</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervisa ingresos por pensiones y aprueba las cuentas de cobro radicadas por los profesores.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar Excel</span>
          </button>

          <button
            onClick={() => printSection('finances-printable-table', 'Reporte Financiero Institucional')}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Imprimir PDF</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Ingresos Recaudados (Alumnos)</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            ${totalIncomePaid.toLocaleString('es-CO')}
          </div>
          <div className="text-[11px] text-emerald-400/80 font-medium mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Recaudo efectivo consolidado</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Cartera Vencida / Pendiente</div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            ${totalPendingDebt.toLocaleString('es-CO')}
          </div>
          <div className="text-[11px] text-rose-400/80 font-medium mt-1">
            Pendiente por cobrar a estudiantes
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Nómina Docente Pagada</div>
          <div className="text-2xl font-black text-blue-400 mt-1">
            ${totalTeacherPayrollPaid.toLocaleString('es-CO')}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">
            Honorarios desembolsados
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="text-slate-400 text-xs font-medium">Balance Neto Operativo</div>
          <div className={`text-2xl font-black mt-1 ${netBalance >= 0 ? 'text-indigo-400' : 'text-amber-400'}`}>
            ${netBalance.toLocaleString('es-CO')}
          </div>
          <div className="text-[11px] text-indigo-400/80 font-medium mt-1">
            Superávit operativo institucional
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Income vs Teacher Invoices */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveSubTab('income')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeSubTab === 'income'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Recaudos Estudiantiles ({store.payments.length})
        </button>

        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeSubTab === 'invoices'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Cuentas de Cobro Docentes ({store.invoices.length})
        </button>
      </div>

      {/* Subtab 1: Student Payments */}
      {activeSubTab === 'income' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por estudiante, concepto o referencia..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ALL">Todos los estados</option>
                <option value="pagado">Pagados</option>
                <option value="pendiente">Pendientes</option>
                <option value="vencido">Vencidos (En mora)</option>
              </select>
            </div>
          </div>

          <div id="finances-printable-table" className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Referencia / Concepto</th>
                    <th className="py-3.5 px-4">Estudiante</th>
                    <th className="py-3.5 px-4">Monto ($COP)</th>
                    <th className="py-3.5 px-4">Vencimiento</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4">Medio de Pago</th>
                    <th className="py-3.5 px-4 text-right no-print">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{pay.concept}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{pay.referenceCode}</div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-200">{pay.studentName}</td>

                      <td className="py-3.5 px-4 font-bold text-white">
                        ${pay.amount.toLocaleString('es-CO')}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">{pay.dueDate}</td>

                      <td className="py-3.5 px-4">
                        {pay.status === 'pagado' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>PAGADO ({pay.paidDate})</span>
                          </span>
                        ) : pay.status === 'vencido' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <AlertCircle className="w-3 h-3" />
                            <span>VENCIDO / MORA</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="w-3 h-3" />
                            <span>PENDIENTE</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        {pay.paymentMethod || <span className="text-slate-500 italic">Por registrar</span>}
                      </td>

                      <td className="py-3.5 px-4 text-right no-print">
                        {pay.status !== 'pagado' && (
                          <button
                            onClick={() => {
                              appStorage.processStudentPayment(pay.id, 'Efectivo');
                              playSuccessSound();
                              refreshData();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Registrar Pago
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Teacher Invoices (Cuentas de Cobro) */}
      {activeSubTab === 'invoices' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
            <h3 className="text-sm font-bold text-white mb-1">
              Cuentas de Cobro y Honorarios Docentes Radicados
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Revisa las horas de clase reportadas por los profesores, valida soportes y aprueba la orden de giro.
            </p>

            <div className="divide-y divide-slate-800">
              {filteredInvoices.map((inv) => (
                <div key={inv.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{inv.teacherName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-indigo-300">
                        Periodo: {inv.monthPeriod}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{inv.concept}</p>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-3">
                      <span>Clases: {inv.classCount || inv.hoursWorked || 0}</span>
                      <span>•</span>
                      <span>Tarifa: ${(inv.ratePerClass || inv.hourlyRate || 0).toLocaleString('es-CO')} / clase</span>
                      <span>•</span>
                      <span>Radicado: {inv.submissionDate}</span>
                      {inv.supportDocName && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-400 underline cursor-pointer">
                            {inv.supportDocName}
                          </span>
                        </>
                      )}
                    </div>
                    {inv.adminNotes && (
                      <div className="text-[11px] text-slate-400 italic bg-slate-950/40 p-1.5 rounded-lg border border-slate-800 mt-1">
                        Observación admin: {inv.adminNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-base font-black text-white">
                        ${inv.totalAmount.toLocaleString('es-CO')}
                      </div>
                      <span
                        className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-0.5 ${
                          inv.status === 'pagado'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : inv.status === 'aprobado'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : inv.status === 'rechazado'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {inv.status === 'pendiente' && (
                        <>
                          <button
                            onClick={() => handleApproveInvoice(inv.id)}
                            className="p-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-colors"
                            title="Aprobar para pago"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectInvoice(inv.id)}
                            className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-colors"
                            title="Rechazar con observaciones"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {inv.status === 'aprobado' && (
                        <button
                          onClick={() => handlePayInvoice(inv.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                        >
                          Efectuar Pago
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
