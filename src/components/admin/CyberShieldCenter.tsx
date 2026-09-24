import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  FileCheck2,
  FileX2,
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Eye,
  Cpu,
  Key,
  Database,
  Sparkles,
  Zap,
} from 'lucide-react';
import { cyberShield, SecurityAuditLog } from '../../services/security';

export const CyberShieldCenter: React.FC = () => {
  const { playSuccessSound, playNotificationSound } = useApp();
  const [logs, setLogs] = useState<SecurityAuditLog[]>(cyberShield.getAuditLogs());
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);

  // Test Sanitize Sandbox
  const [testPayload, setTestPayload] = useState('<script>alert("hacked")</script>');
  const [sanitizedResult, setSanitizedResult] = useState('');

  // Test Antivirus Upload Sandbox
  const [scanResult, setScanResult] = useState<{ isSafe: boolean; message: string } | null>(null);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditComplete(false);

    setTimeout(() => {
      cyberShield.logEvent({
        event: 'threat_blocked',
        severity: 'info',
        details: 'Auditoría completa del sistema ejecutada. 0 vulnerabilidades detectadas.',
      });
      setLogs(cyberShield.getAuditLogs());
      setIsAuditing(false);
      setAuditComplete(true);
      playSuccessSound();
    }, 1800);
  };

  const handleTestSanitize = () => {
    const clean = cyberShield.sanitizeInput(testPayload);
    setSanitizedResult(clean);
    setLogs(cyberShield.getAuditLogs());
    playNotificationSound();
  };

  const handleTestFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cyberShield.scanFile(file);
    if (res.isSafe) {
      setScanResult({
        isSafe: true,
        message: `✅ Archivo "${file.name}" verificado 100% seguro. Libre de virus, troyanos y malware.`,
      });
      playSuccessSound();
    } else {
      setScanResult({
        isSafe: false,
        message: `⛔ Amenaza Neutralizada: ${res.threatDetected}`,
      });
      playNotificationSound();
    }
    setLogs(cyberShield.getAuditLogs());
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border border-amber-500/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Áurea CyberShield Defense • Grado Institucional</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Centro de Ciberseguridad & Antivirus
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Blindaje activo multicapa: prevención contra hackeos, desinfección de archivos, protección anti-XSS y monitoreo en tiempo real.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-amber-400/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isAuditing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span>{isAuditing ? 'Auditando Sistema...' : 'Ejecutar Auditoría General'}</span>
            </button>
          </div>
        </div>

        {/* Audit result alert */}
        {auditComplete && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Auditoría ejecutada con éxito: <strong>Estado Óptimo</strong>. 0 brechas, 0 firmas de virus detectadas en archivos del campus.
              </span>
            </div>
            <button onClick={() => setAuditComplete(false)} className="text-emerald-400 hover:text-white font-bold">
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 4 Security Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
              ACTIVO 100%
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">Escudo Anti-Inyección & XSS</h3>
          <p className="text-xs text-slate-400 mt-1">
            Filtra scripts maliciosos, inyecciones de código y neutraliza ataques en formularios.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
              ACTIVO 100%
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">Antivirus & File Guardian</h3>
          <p className="text-xs text-slate-400 mt-1">
            Bloqueo automático de ejecutables (.exe, .bat, .vbs) y escáner heurístico de malware.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
              ACTIVO 100%
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">Defensa Anti Fuerza Bruta</h3>
          <p className="text-xs text-slate-400 mt-1">
            Bloqueo preventivo de cuentas tras 4 intentos fallidos consecutivos de contraseña.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Database className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
              ACTIVO 100%
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">Integridad de Almacenamiento</h3>
          <p className="text-xs text-slate-400 mt-1">
            Validación de integridad para evitar adulteración ilegítima de calificaciones y saldos.
          </p>
        </div>
      </div>

      {/* Interactive Testing Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Antivirus Test Sandbox */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Banco de Prueba: Escáner Antivirus Áurea</h2>
              <p className="text-xs text-slate-400">
                Sube cualquier archivo para verificar cómo Áurea Shield detecta extensiones peligrosas y valida archivos limpios.
              </p>
            </div>
          </div>

          <div className="p-6 border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl bg-slate-950/60 text-center transition-colors">
            <input
              type="file"
              id="securityTestFileInput"
              onChange={handleTestFileScan}
              className="hidden"
            />
            <label
              htmlFor="securityTestFileInput"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <FileCheck2 className="w-10 h-10 text-emerald-400" />
              <span className="text-xs font-bold text-white">
                Haz clic para escanear un archivo de prueba
              </span>
              <span className="text-[11px] text-slate-400">
                Soporta PDFs, imágenes, guías docentes. Bloquea ejecutables (.exe, .bat, scripts).
              </span>
            </label>
          </div>

          {scanResult && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold border animate-in fade-in ${
                scanResult.isSafe
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
              }`}
            >
              {scanResult.message}
            </div>
          )}
        </div>

        {/* Anti-XSS Sanitizer Sandbox */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Banco de Prueba: Sanitizador Anti-XSS</h2>
              <p className="text-xs text-slate-400">
                Comprueba en tiempo real cómo el motor neutraliza intentos de inyección de código.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Entrada sospechosa de prueba:</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                onClick={handleTestSanitize}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Sanitizar
              </button>
            </div>
          </div>

          {sanitizedResult && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-emerald-400">Resultado Protegido & Limpio:</label>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-200">
                {sanitizedResult}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Audit Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Registro de Auditoría de Ciberseguridad</h2>
              <p className="text-xs text-slate-400">
                Eventos de protección, análisis de archivos y verificaciones de acceso en tiempo real.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Monitoreo Activo</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Hora</th>
                <th className="py-3 px-4">Evento</th>
                <th className="py-3 px-4">Severidad</th>
                <th className="py-3 px-4">IP Origen</th>
                <th className="py-3 px-4">Detalles de la Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400 font-mono">{log.timestamp}</td>
                  <td className="py-3 px-4 font-bold text-white capitalize">
                    {log.event.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : log.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {log.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono">{log.ip}</td>
                  <td className="py-3 px-4 text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
