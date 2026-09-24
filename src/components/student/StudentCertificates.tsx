import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck,
  Plus,
  Printer,
  Download,
  QrCode,
  ShieldCheck,
  Calendar,
  User,
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  X,
  FileText,
} from 'lucide-react';
import { CertificateRequest } from '../../types';
import { appStorage } from '../../services/storage';

const CERTIFICATE_TYPES: Record<
  CertificateRequest['certificateType'],
  { label: string; description: string; validity: string }
> = {
  estudios_activo: {
    label: 'Certificado de Estudio (Alumno Regular)',
    description: 'Acredita que el estudiante se encuentra legalmente matriculado y cursando su grado actual.',
    validity: 'Vigencia de 90 días calendario',
  },
  paz_y_salvo: {
    label: 'Certificado de Paz y Salvo Institucional',
    description: 'Certifica encontrarse al día en obligaciones financieras, biblioteca y laboratorios.',
    validity: 'Vigencia para el periodo académico en curso',
  },
  buena_conducta: {
    label: 'Constancia de Convivencia y Buena Conducta',
    description: 'Certifica intachable desempeño comportamental y cumplimiento del manual de convivencia.',
    validity: 'Vigencia de 60 días',
  },
  notas_calificaciones: {
    label: 'Certificado de Notas y Calificaciones Oficiales',
    description: 'Boletín certificado de asignaturas cursadas, créditos y promedio ponderado acumulado.',
    validity: 'Periodo 2026',
  },
  calificaciones_parcial: {
    label: 'Certificado de Calificaciones Parciales',
    description: 'Sábana oficial de notas acumuladas en los periodos académicos transcurridos.',
    validity: 'Periodo 2026',
  },
  constancia_matricula: {
    label: 'Constancia Oficial de Matrícula y Folio',
    description: 'Documento legal de legalización de matrícula con número de libro y folio institucional.',
    validity: 'Año lectivo 2026',
  },
};

export const StudentCertificates: React.FC = () => {
  const { store, currentUser, refreshData, playSuccessSound } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<CertificateRequest['certificateType']>('estudios_activo');
  const [purpose, setPurpose] = useState('Trámite de subsidio familiar y afiliación EPS');
  const [previewCert, setPreviewCert] = useState<CertificateRequest | null>(null);

  const allRequests = store.certificateRequests || [];
  // Filter for current student or all if admin
  const studentRequests = allRequests.filter(
    (req) => req.studentId === currentUser.id || currentUser.role === 'admin'
  );

  const handleRequestCertificate = (e: React.FormEvent) => {
    e.preventDefault();

    const newCert = appStorage.requestCertificate({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentDocument: currentUser.documentId || 'TI 1.025.789.444',
      studentGrade: currentUser.gradeLevel ? `${currentUser.gradeLevel} Bachillerato Académico` : '11° Bachillerato Académico',
      certificateType: selectedType,
      purpose,
    });

    playSuccessSound();
    refreshData();
    setIsModalOpen(false);
    setPreviewCert(newCert);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/20 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Secretaría Académica Virtual • Áurea</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <FileCheck className="w-6 h-6 text-amber-400" />
            <span>Solicitud & Expedición de Certificados</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Genera al instante certificados de estudio, constancias de matrícula y paz y salvo con código
            seguro de verificación QR y firma digital institucional.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Solicitar Certificado</span>
        </button>
      </div>

      {/* Available Certificate Types Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(CERTIFICATE_TYPES).slice(0, 3).map(([key, item]) => (
          <div
            key={key}
            onClick={() => {
              setSelectedType(key as CertificateRequest['certificateType']);
              setIsModalOpen(true);
            }}
            className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 p-5 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-xs leading-snug group-hover:text-amber-300 transition-colors">
                {item.label}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.description}</p>
            </div>
            <div className="pt-3 border-t border-slate-800 mt-3 flex items-center justify-between text-[10px] text-amber-400 font-semibold">
              <span>{item.validity}</span>
              <span className="group-hover:translate-x-0.5 transition-transform">Expedir →</span>
            </div>
          </div>
        ))}
      </div>

      {/* History of Requested Certificates */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Tus Certificados Solicitados & Vigentes</h3>
          <span className="text-xs text-slate-400">{studentRequests.length} certificado(s)</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {studentRequests.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No tienes certificados solicitados aún. Haz clic en "Solicitar Certificado" para emitir el tuyo.
            </div>
          ) : (
            studentRequests.map((cert) => {
              const meta = CERTIFICATE_TYPES[cert.certificateType] || CERTIFICATE_TYPES.estudios_activo;
              return (
                <div
                  key={cert.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-bold text-white text-sm">{meta.label}</span>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {cert.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">Finalidad: {cert.purpose}</p>

                    <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center space-x-1 text-amber-300 font-mono">
                        <QrCode className="w-3 h-3 text-amber-400" />
                        <span>Código: {cert.verificationCode}</span>
                      </span>
                      <span>•</span>
                      <span>Solicitado: {cert.requestedAt}</span>
                      <span>•</span>
                      <span>Firmado por: {cert.signedBy}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setPreviewCert(cert)}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ver Documento</span>
                    </button>

                    <button
                      onClick={() => {
                        setPreviewCert(cert);
                        setTimeout(() => window.print(), 300);
                      }}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs font-bold text-amber-300 border border-amber-500/40 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir / PDF</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal: Solicitar Certificado */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white">Solicitar Nuevo Certificado Oficial</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleRequestCertificate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tipo de Certificado Requerido *
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as CertificateRequest['certificateType'])}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {Object.entries(CERTIFICATE_TYPES).map(([k, val]) => (
                    <option key={k} value={k}>
                      {val.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  {CERTIFICATE_TYPES[selectedType].description}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Finalidad / Entidad a la que se Presenta *
                </label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Ej. Afiliación a EPS, Caja de Compensación Familiar, Visa o Becas"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Student Details Summary */}
              <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-1 text-xs">
                <div className="font-semibold text-slate-300">Datos que se incluirán en el documento:</div>
                <div className="text-slate-400 text-[11px]">
                  <strong>Estudiante:</strong> {currentUser.name} | <strong>Doc:</strong> {currentUser.documentId || 'TI 1.025.789.444'}
                </div>
                <div className="text-slate-400 text-[11px]">
                  <strong>Grado:</strong> {currentUser.gradeLevel || '11°'} Bachillerato Académico
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
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 font-bold text-xs text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  Generar Certificado Ahora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Preview Certificate Document with Official Institutional Seal */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl p-8 sm:p-10 my-8 border-4 border-amber-400/50">
            {/* Action Bar (Not printed) */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6 print:hidden">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Documento Oficial Certificado y Firmado Digitalmente</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrintCertificate}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / Guardar PDF</span>
                </button>
                <button
                  onClick={() => setPreviewCert(null)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Certificate Paper Document */}
            <div className="space-y-6 text-center">
              {/* Institution Header */}
              <div className="border-b-2 border-amber-500 pb-5">
                <div className="inline-flex items-center space-x-2 text-amber-700 font-black tracking-widest text-lg uppercase">
                  <span>ÁUREA CAMPUS EDUCATIVO</span>
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  SECRETARÍA ACADÉMICA & RECTORÍA GENERAL
                </div>
                <div className="text-[10px] text-slate-400 tracking-wide mt-0.5">
                  Resolución Ministerial No. 45892 de Educación Nacional • Código DANE 11100109923
                </div>
              </div>

              {/* Title */}
              <div className="pt-2">
                <h2 className="text-xl font-serif font-black tracking-wider uppercase text-slate-900">
                  {CERTIFICATE_TYPES[previewCert.certificateType]?.label || 'CERTIFICADO INSTITUCIONAL'}
                </h2>
                <div className="w-24 h-0.5 bg-amber-500 mx-auto mt-2"></div>
              </div>

              {/* Legal Text */}
              <div className="text-justify text-xs sm:text-sm text-slate-700 leading-relaxed font-serif space-y-4 pt-4 px-2 sm:px-6">
                <p>
                  <strong>LA DIRECCIÓN ACADÉMICA Y LA SECRETARÍA GENERAL DEL INSTITUTO ÁUREA</strong>,
                  en uso de sus facultades legales e institucionales:
                </p>

                <p className="font-bold text-center tracking-wider text-base text-slate-900 py-1">
                  CERTIFICA:
                </p>

                <p>
                  Que el(la) estudiante <strong className="text-slate-950 uppercase">{previewCert.studentName}</strong>,
                  identificado(a) con documento de identidad No. <strong>{previewCert.studentDocument}</strong>, se encuentra
                  debidamente matriculado(a) y activo(a) en el programa académico correspondente a{' '}
                  <strong>{previewCert.studentGrade}</strong> durante el año lectivo <strong>2026</strong>.
                </p>

                <p>
                  El(la) estudiante cumple a cabalidad con las actividades pedagógicas, curriculares y compromisos
                  académicos programados para el presente periodo lectivo.
                </p>

                <p>
                  El presente documento se expide a solicitud de la parte interesada para efectos de:{' '}
                  <em>"{previewCert.purpose}"</em>, en la ciudad de Bogotá D.C., a los{' '}
                  <strong>{previewCert.issueDate}</strong>.
                </p>
              </div>

              {/* Signatures & QR Verification */}
              <div className="pt-8 grid grid-cols-2 gap-6 items-end px-6 border-t border-slate-200 mt-6">
                <div className="text-center space-y-1">
                  <div className="font-serif italic font-bold text-slate-900 text-sm">
                    Sofía Valenzuela R.
                  </div>
                  <div className="w-40 h-px bg-slate-400 mx-auto"></div>
                  <div className="text-[11px] font-bold text-slate-800">Dra. Sofía Valenzuela</div>
                  <div className="text-[10px] text-slate-500">Directora Académica Institucional</div>
                </div>

                <div className="text-center space-y-1 flex flex-col items-center">
                  <div className="p-2 border border-slate-300 rounded-lg inline-block bg-slate-50">
                    <QrCode className="w-12 h-12 text-slate-900" />
                  </div>
                  <div className="text-[9px] font-mono text-slate-600 font-semibold mt-1">
                    CÓDIGO DE VALIDACIÓN:
                  </div>
                  <div className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                    {previewCert.verificationCode}
                  </div>
                  <div className="text-[8px] text-slate-400">Verificable en aurea.edu.co/validar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
