import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cloud,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Database,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { appStorage } from '../../services/storage';

export const CloudBackup: React.FC = () => {
  const { store, refreshData, playSuccessSound } = useApp();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleDownloadBackup = () => {
    const json = appStorage.exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EduManage_Cloud_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    playSuccessSound();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = appStorage.restoreBackupJSON(content);
        if (success) {
          setImportStatus('success');
          setStatusMessage('¡Respaldo restaurado exitosamente! Todos los datos han sido sincronizados.');
          playSuccessSound();
          refreshData();
        } else {
          setImportStatus('error');
          setStatusMessage('El archivo no tiene la estructura válida de EduManage Pro.');
        }
      } catch {
        setImportStatus('error');
        setStatusMessage('Error al procesar el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('¿Estás seguro de restablecer toda la base de datos a los valores de demostración iniciales?')) {
      appStorage.resetToDefault();
      playSuccessSound();
      refreshData();
      alert('Sistema restablecido con éxito a valores de demostración iniciales.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <Cloud className="w-6 h-6 text-indigo-400" />
            <span>Sistema de Respaldo y Sincronización en la Nube</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Garantiza la integridad y portabilidad de los datos institucionales, notas y registros contables.
          </p>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Sincronización en Tiempo Real Activa</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              El canal <code>edumanage_sync_channel</code> está transmitiendo eventos de actualización entre
              todas las pestañas y ventanas activas del navegador. Cualquier calificación o pago se refleja
              instantáneamente sin recargar la página.
            </p>
            <div className="mt-3 flex items-center space-x-4 text-xs text-slate-400">
              <span>Última sincronización: {new Date(store.lastBackupDate || Date.now()).toLocaleTimeString()}</span>
              <span>•</span>
              <span>Registros en memoria local persistente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Export Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="p-3 w-fit rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-3">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Descargar Respaldo Completo</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Exporta un archivo JSON consolidado con todos los usuarios, notas, foros, pagos y eventos
              actuales. Útil para auditoría y archivo físico o en la nube.
            </p>

            <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div>• {store.users.length} Cuentas de usuarios y contraseñas</div>
              <div>• {store.enrollments.length} Registros de matrícula escolar</div>
              <div>• {store.payments.length} Comprobantes y cobros financieros</div>
              <div>• {store.grades.length} Calificaciones y notas registradas</div>
            </div>
          </div>

          <button
            onClick={handleDownloadBackup}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Generar y Descargar Backup (.JSON)</span>
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="p-3 w-fit rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Restaurar Copia de Seguridad</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Carga un archivo de respaldo generado previamente por la plataforma para reanudar el estado
              institucional en este dispositivo.
            </p>

            {statusMessage && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs flex items-center space-x-2 ${
                  importStatus === 'success'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {importStatus === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{statusMessage}</span>
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white border border-slate-700 transition-all flex items-center justify-center space-x-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Seleccionar Archivo de Respaldo</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset to Default */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-rose-400">Restablecer Datos de Demostración</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Reinicia la base de datos a los estudiantes, notas y estados de pago predeterminados.
          </p>
        </div>
        <button
          onClick={handleResetData}
          className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
        >
          Restablecer a Demo Original
        </button>
      </div>
    </div>
  );
};
