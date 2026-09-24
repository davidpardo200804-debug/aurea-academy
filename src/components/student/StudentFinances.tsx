import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  CreditCard,
  Building,
  ShieldCheck,
  Receipt,
} from 'lucide-react';
import { printSection } from '../../services/exportUtils';
import { appStorage } from '../../services/storage';

export const StudentFinances: React.FC = () => {
  const { store, currentUser, refreshData, playSuccessSound } = useApp();

  const [selectedPayId, setSelectedPayId] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<'PSE' | 'Tarjeta de Crédito' | 'Transferencia Bancaria'>('PSE');
  const [isProcessing, setIsProcessing] = useState(false);

  // Student enrollment record
  const enrollment = store.enrollments.find((e) => e.userId === currentUser.id);
  const myPayments = store.payments.filter((p) => p.studentId === currentUser.id);

  const hasDebt = (enrollment?.balanceDue || 0) > 0;
  const balanceDue = enrollment?.balanceDue || 0;

  const pendingPayments = myPayments.filter((p) => p.status !== 'pagado');
  const paidPayments = myPayments.filter((p) => p.status === 'pagado');

  const selectedPayment = store.payments.find((p) => p.id === selectedPayId);

  const handleSimulatePayment = () => {
    if (!selectedPayId) return;
    setIsProcessing(true);

    setTimeout(() => {
      appStorage.processStudentPayment(selectedPayId, payMethod);
      setIsProcessing(false);
      setSelectedPayId(null);
      playSuccessSound();
      refreshData();
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Financial Health Banner */}
      <div
        className={`p-6 rounded-3xl border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          hasDebt
            ? 'bg-rose-950/20 border-rose-500/30'
            : 'bg-emerald-950/20 border-emerald-500/30'
        }`}
      >
        <div className="flex items-start space-x-4">
          <div
            className={`p-3 rounded-2xl ${
              hasDebt
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {hasDebt ? <AlertTriangle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Estado Financiero del Alumno
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  hasDebt ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                }`}
              >
                {hasDebt ? 'Saldo Pendiente' : 'Paz y Salvo'}
              </span>
            </div>

            <h2 className="text-2xl font-black text-white mt-1">
              {hasDebt ? (
                <span>Debes: ${balanceDue.toLocaleString('es-CO')}</span>
              ) : (
                <span>¡Estás al día con todos tus pagos!</span>
              )}
            </h2>

            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {hasDebt
                ? 'Tienes mensualidades o conceptos escolares vencidos. Puedes pagarlos aquí mismo en línea vía PSE o tarjeta para mantener habilitado el acceso a foros y certificados.'
                : 'No registras valores pendientes con tesorería. Tienes acceso completo a todas las aulas y foros estudiantiles.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => printSection('student-account-statement', 'Estado de Cuenta Estudiantil')}
          className="self-start sm:self-auto flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-blue-400" />
          <span>Certificado Paz y Salvo (PDF)</span>
        </button>
      </div>

      {/* Pending Invoices / Payments */}
      {pendingPayments.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Facturas y Mensualidades por Pagar</h3>
          </div>

          <div className="divide-y divide-slate-800">
            {pendingPayments.map((pay) => (
              <div
                key={pay.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{pay.concept}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {pay.status === 'vencido' ? 'VENCIDO' : 'PENDIENTE'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Ref: {pay.referenceCode} • Vence: {pay.dueDate}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-black text-rose-400">
                      ${pay.amount.toLocaleString('es-CO')}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPayId(pay.id)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pagar Ahora en Línea</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History & Printable Statement */}
      <div id="student-account-statement" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Historial de Recibos y Pagos Realizados</h3>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {paidPayments.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              No tienes pagos registrados todavía.
            </div>
          ) : (
            paidPayments.map((pay) => (
              <div
                key={pay.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="font-semibold text-white text-xs">{pay.concept}</div>
                  <div className="text-[11px] text-slate-400">
                    Comprobante: {pay.referenceCode} • Pagado el: {pay.paidDate} • Vía {pay.paymentMethod}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-bold text-emerald-400 text-sm">
                    ${pay.amount.toLocaleString('es-CO')}
                  </span>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>PAGADO</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Simulated Payment Gateway (PSE / Tarjeta) */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-1">Pasarela de Pagos en Línea</h2>
            <p className="text-xs text-slate-400 mb-4">
              Transacción cifrada y certificada para EduManage Pro.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 mb-4 space-y-1">
              <div className="text-xs text-slate-400">{selectedPayment.concept}</div>
              <div className="text-xl font-black text-emerald-400">
                ${selectedPayment.amount.toLocaleString('es-CO')}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Ref: {selectedPayment.referenceCode}</div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Medio de Pago</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPayMethod('PSE')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center space-x-2 ${
                    payMethod === 'PSE'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-800 bg-slate-800/60 text-slate-400'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Débito PSE</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPayMethod('Tarjeta de Crédito')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex items-center space-x-2 ${
                    payMethod === 'Tarjeta de Crédito'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-slate-800 bg-slate-800/60 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Tarjeta</span>
                </button>
              </div>

              {payMethod === 'PSE' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Seleccionar Banco</label>
                  <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white">
                    <option>Bancolombia</option>
                    <option>Davivienda</option>
                    <option>Banco de Bogotá</option>
                    <option>Nequi / Daviplata</option>
                    <option>BBVA Colombia</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Número de Tarjeta (Demo)</label>
                  <input
                    type="text"
                    disabled
                    value="•••• •••• •••• 4242"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 flex items-center justify-end space-x-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setSelectedPayId(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>Procesando transacción...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Pago de ${selectedPayment.amount.toLocaleString('es-CO')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
