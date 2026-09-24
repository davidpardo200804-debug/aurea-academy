import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Lock,
  Upload,
  Calendar,
  BookOpen,
  Info,
} from 'lucide-react';
import { appStorage } from '../../services/storage';

const MONTH_OPTIONS = [
  'Enero 2026',
  'Febrero 2026',
  'Marzo 2026',
  'Abril 2026',
  'Mayo 2026',
  'Junio 2026',
  'Julio 2026',
  'Agosto 2026',
  'Septiembre 2026',
  'Octubre 2026',
  'Noviembre 2026',
  'Diciembre 2026',
];

export const TeacherInvoices: React.FC = () => {
  const { store, currentUser, refreshData, playSuccessSound } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Abril 2026');
  const [classCount, setClassCount] = useState('42');
  const [concept, setConcept] = useState('');
  const [supportDocName, setSupportDocName] = useState('cuenta_cobro_abril_firmada.pdf');

  // Find assigned rate in current user profile (assigned when user was created)
  const officialTeacherRate = currentUser.ratePerClass || 48000;
  const officialSalaryBase = currentUser.assignedSalary;

  // Filter invoices for this teacher (or all if admin)
  const myInvoices = store.invoices.filter(
    (inv) => inv.teacherId === currentUser.id || currentUser.role === 'admin'
  );

  const totalEarnedPaid = myInvoices
    .filter((inv) => inv.status === 'pagado')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalPending = myInvoices
    .filter((inv) => inv.status === 'pendiente' || inv.status === 'aprobado')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const parsedClasses = Math.max(1, Number(classCount) || 0);
  const calculatedTotal = parsedClasses * officialTeacherRate;

  const handleSubmitInvoice = (e: React.FormEvent) => {
    e.preventDefault();

    appStorage.submitTeacherInvoice({
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      monthPeriod: selectedMonth,
      classCount: parsedClasses,
      ratePerClass: officialTeacherRate,
      hoursWorked: parsedClasses,
      hourlyRate: officialTeacherRate,
      totalAmount: calculatedTotal,
      concept:
        concept ||
        `Honorarios por ${parsedClasses} clases dictadas en el mes de ${selectedMonth}`,
      supportDocName: supportDocName || 'soporte_cuenta_cobro.pdf',
    });

    playSuccessSound();
    refreshData();
    setIsModalOpen(false);
    setConcept('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/20 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-2">
            <Wallet className="w-3.5 h-3.5" />
            <span>Módulo de Honorarios & Cuentas de Cobro</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Radicación y Seguimiento de Cuentas de Cobro
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Reporta el mes y el número de clases dictadas. Tu tarifa institucional de honorarios está
            vinculada contractualmente a tu usuario por la administración institucional.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Radicar Nueva Cuenta</span>
        </button>
      </div>

      {/* Salary & Contract Info Badge */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center space-x-2">
              <span>Tarifa Contractual Asignada:</span>
              <span className="text-amber-400 font-extrabold text-sm">
                ${officialTeacherRate.toLocaleString('es-CO')} / clase
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Valor asignado en rectoría al dar de alta tu usuario. El docente no puede alterar este valor
              unilateralmente.
              {officialSalaryBase && (
                <span className="ml-1 text-slate-300">
                  (Salario base referencial: ${officialSalaryBase.toLocaleString('es-CO')})
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>Contrato Docente Vigente 2026</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
          <div className="text-slate-400 text-xs font-medium">Honorarios Pagados (Acumulado)</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            ${totalEarnedPaid.toLocaleString('es-CO')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Giro recibido y confirmado en cuenta bancaria</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-md">
          <div className="text-slate-400 text-xs font-medium">Cuentas en Trámite / Aprobadas</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            ${totalPending.toLocaleString('es-CO')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Próximas a desembolso por la tesorería de Áurea</span>
          </div>
        </div>
      </div>

      {/* Invoice list */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Historial de Cuentas de Cobro Radicadas</h3>
          <span className="text-xs text-slate-400">{myInvoices.length} registro(s)</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {myInvoices.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No has radicado cuentas de cobro aún. Haz clic en "Radicar Nueva Cuenta".
            </div>
          ) : (
            myInvoices.map((inv) => (
              <div key={inv.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-bold text-white text-sm">{inv.monthPeriod}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
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

                  <p className="text-xs text-slate-300">{inv.concept}</p>

                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center space-x-1 text-slate-200 font-semibold">
                      <BookOpen className="w-3 h-3 text-amber-400" />
                      <span>Clases dictadas: {inv.classCount || inv.hoursWorked || 0}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-slate-300">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Tarifa: ${(inv.ratePerClass || inv.hourlyRate || 0).toLocaleString('es-CO')} / clase</span>
                    </span>
                    <span>•</span>
                    <span>Radicado el: {inv.submissionDate}</span>
                    {inv.supportDocName && (
                      <>
                        <span>•</span>
                        <span className="text-indigo-400 font-medium">📎 {inv.supportDocName}</span>
                      </>
                    )}
                  </div>

                  {inv.adminNotes && (
                    <div className="text-[11px] text-amber-300 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/30 mt-1">
                      <strong className="text-amber-200">Observación de Dirección/Tesorería:</strong> {inv.adminNotes}
                    </div>
                  )}
                </div>

                <div className="text-left md:text-right shrink-0">
                  <div className="text-lg font-black text-white">
                    ${inv.totalAmount.toLocaleString('es-CO')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {inv.paymentDate ? `Pagado el: ${inv.paymentDate}` : 'En espera de corte y giro'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Radicar Cuenta con Mes y Clases (Tarifa Bloqueada al Usuario) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white">Radicar Nueva Cuenta de Cobro</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleSubmitInvoice} className="space-y-4">
              {/* Mes a Cobrar */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mes a Radicar *</span>
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  required
                >
                  {MONTH_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clases vs Tarifa Fija */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Clases Dictadas (Editable) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Clases Dictadas *</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    required
                    value={classCount}
                    onChange={(e) => setClassCount(e.target.value)}
                    placeholder="Ej. 42"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Número de sesiones impartidas
                  </span>
                </div>

                {/* Tarifa por Clase (BLOQUEADA / ASIGNADA EN CREACIÓN) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Valor por Clase (Asignado)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      readOnly
                      value={`$${officialTeacherRate.toLocaleString('es-CO')}`}
                      className="w-full bg-slate-950/80 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-300 font-black cursor-not-allowed"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">
                      Fijo
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400/90 mt-0.5 block">
                    🔒 Tarifa fijada al crear tu usuario
                  </span>
                </div>
              </div>

              {/* Concepto Detallado */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Concepto / Detalle de Actividades
                </label>
                <textarea
                  rows={2}
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder={`Honorarios por ${parsedClasses} clases dictadas en ${selectedMonth}, asesorías académicas y evaluación de talleres.`}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Soporte */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre del Soporte Adjunto (PDF o RUT)
                </label>
                <input
                  type="text"
                  value={supportDocName}
                  onChange={(e) => setSupportDocName(e.target.value)}
                  placeholder="cuenta_cobro_firmada.pdf"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Total Calculation Display */}
              <div className="p-3.5 bg-gradient-to-r from-amber-950/40 via-slate-950 to-amber-950/40 rounded-2xl border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Total Liquidado
                  </div>
                  <div className="text-xs text-slate-400">
                    {parsedClasses} clases × ${officialTeacherRate.toLocaleString('es-CO')}
                  </div>
                </div>
                <div className="text-lg font-black text-amber-300">
                  ${calculatedTotal.toLocaleString('es-CO')}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 font-bold text-xs text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  Radicar Cuenta de Cobro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
