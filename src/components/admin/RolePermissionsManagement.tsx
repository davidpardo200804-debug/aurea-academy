import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  GraduationCap,
  Briefcase,
  Shield,
  RotateCcw,
  CheckCircle2,
  Info,
  Layers,
  BookOpen,
  DollarSign,
  Award,
  Video,
  MessagesSquare,
  Calendar,
  TrendingUp,
  FileCheck,
  Compass,
  HardDrive,
  MessageSquare,
  StickyNote,
} from 'lucide-react';
import { UserRole, RolePermissions } from '../../types';
import { appStorage, DEFAULT_ROLE_PERMISSIONS } from '../../services/storage';

interface ModulePermissionItem {
  key: keyof RolePermissions;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'Academico' | 'Financiero' | 'Comunidad' | 'Administracion';
}

const MODULES_LIST: ModulePermissionItem[] = [
  {
    key: 'dashboard',
    label: 'Panel Principal / Dashboard',
    description: 'Vista de métricas, accesos directos y resumen según el perfil.',
    icon: <Layers className="w-4 h-4 text-indigo-400" />,
    category: 'Academico',
  },
  {
    key: 'students',
    label: 'Matrículas y Alumnos',
    description: 'Inscripción de nuevos alumnos, asignación de fotos y listas generales.',
    icon: <Users className="w-4 h-4 text-indigo-400" />,
    category: 'Academico',
  },
  {
    key: 'groups',
    label: 'Cursos y Salones',
    description: 'Creación de salones, jornadas, asignación de docentes y horarios.',
    icon: <BookOpen className="w-4 h-4 text-indigo-400" />,
    category: 'Academico',
  },
  {
    key: 'grades',
    label: 'Calificaciones y Boletines',
    description: 'Registro de notas, cortes evaluativos y consulta de promedios académicos.',
    icon: <Award className="w-4 h-4 text-amber-400" />,
    category: 'Academico',
  },
  {
    key: 'resources',
    label: 'Aula Virtual (Archivos y Videos)',
    description: 'Subida y descarga de guías PDF, talleres y videoclases.',
    icon: <Video className="w-4 h-4 text-sky-400" />,
    category: 'Academico',
  },
  {
    key: 'finances',
    label: 'Finanzas, Cartera y Pagos',
    description: 'Consulta de saldos en mora, pasarela PSE/tarjeta y arqueo de tesorería.',
    icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
    category: 'Financiero',
  },
  {
    key: 'invoices',
    label: 'Cuentas de Cobro y Honorarios',
    description: 'Radicación de horas trabajadas y aprobación de pagos a profesores.',
    icon: <FileCheck className="w-4 h-4 text-emerald-400" />,
    category: 'Financiero',
  },
  {
    key: 'projections',
    label: 'Proyecciones Académicas',
    description: 'Estudio de demanda y proyección de ingresos para nuevos cursos.',
    icon: <TrendingUp className="w-4 h-4 text-indigo-400" />,
    category: 'Financiero',
  },
  {
    key: 'forums',
    label: 'Foros Estudiantiles',
    description: 'Debates colaborativos, preguntas de clase, respuestas y etiquetas.',
    icon: <MessagesSquare className="w-4 h-4 text-purple-400" />,
    category: 'Comunidad',
  },
  {
    key: 'calendar',
    label: 'Calendario y Eventos Institucionales',
    description: 'Programación de claustros, feriados y entrega de boletines.',
    icon: <Calendar className="w-4 h-4 text-rose-400" />,
    category: 'Comunidad',
  },
  {
    key: 'chat',
    label: 'Chat Institucional en Vivo',
    description: 'Mensajería instantánea directa entre directivos, docentes y alumnos.',
    icon: <MessageSquare className="w-4 h-4 text-cyan-400" />,
    category: 'Comunidad',
  },
  {
    key: 'inductions',
    label: 'Reinducciones Docentes',
    description: 'Módulos obligatorios de capacitación pedagógica y lineamientos.',
    icon: <Compass className="w-4 h-4 text-sky-400" />,
    category: 'Administracion',
  },
  {
    key: 'users',
    label: 'Gestión de Usuarios y Cuentas',
    description: 'Creación de credenciales, roles, cambio de fotos y suspensión de cuentas.',
    icon: <Users className="w-4 h-4 text-amber-400" />,
    category: 'Administracion',
  },
  {
    key: 'permissions',
    label: 'Matriz de Permisos de Acceso',
    description: 'Configuración granular de módulos visibles para cada rol.',
    icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
    category: 'Administracion',
  },
  {
    key: 'backup',
    label: 'Copias de Seguridad en la Nube',
    description: 'Exportación y restauración de datos en JSON y sincronización.',
    icon: <HardDrive className="w-4 h-4 text-slate-400" />,
    category: 'Administracion',
  },
  {
    key: 'staffChat',
    label: 'Sala Docente & Videollamadas Directivas',
    description: 'Comunicaciones directas, llamadas de voz y videollamadas entre profesores y administración.',
    icon: <Video className="w-4 h-4 text-amber-400" />,
    category: 'Comunidad',
  },
  {
    key: 'whatsapp',
    label: 'Extensión WhatsApp Business con IA',
    description: 'Asistente de respuestas automáticas con Gemini 3.8 Flash para admisiones y atención.',
    icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
    category: 'Administracion',
  },
  {
    key: 'security',
    label: 'Ciberseguridad & Antivirus Áurea Shield',
    description: 'Protección multicapa contra hackeos, escáner de malware e inyecciones de código.',
    icon: <ShieldCheck className="w-4 h-4 text-amber-400" />,
    category: 'Administracion',
  },
  {
    key: 'notepad',
    label: 'Block de Notas & Minutas Directivas',
    description: 'Anotaciones confidenciales de comités, acuerdos de claustro y checklists de tareas.',
    icon: <StickyNote className="w-4 h-4 text-amber-400" />,
    category: 'Administracion',
  },
  {
    key: 'certificates',
    label: 'Solicitud y Expedición de Certificados',
    description: 'Generación digital con firma y código de verificación QR de certificados de estudio.',
    icon: <FileCheck className="w-4 h-4 text-emerald-400" />,
    category: 'Academico',
  },
];

export const RolePermissionsManagement: React.FC = () => {
  const { store, refreshData, playSuccessSound, switchRoleQuickly } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'TODOS' | 'Academico' | 'Financiero' | 'Comunidad' | 'Administracion'>('TODOS');
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const permissions = store.permissions || DEFAULT_ROLE_PERMISSIONS;

  const handleToggle = (role: UserRole, moduleKey: keyof RolePermissions) => {
    const currentVal = permissions[role]?.[moduleKey] ?? false;
    const newVal = !currentVal;

    appStorage.updateRolePermissions(role, {
      [moduleKey]: newVal,
    });

    playSuccessSound();
    refreshData();

    setBannerNotice(
      `Permiso "${moduleKey}" ${newVal ? 'HABILITADO' : 'DESHABILITADO'} para el rol ${
        role === 'admin' ? 'Administrador' : role === 'teacher' ? 'Docente' : 'Estudiante'
      }. Aplicado en tiempo real.`
    );

    setTimeout(() => {
      setBannerNotice(null);
    }, 4000);
  };

  const handleResetDefaults = () => {
    if (confirm('¿Deseas restablecer los permisos de todos los roles a su configuración inicial recomendada?')) {
      appStorage.updateRolePermissions('admin', DEFAULT_ROLE_PERMISSIONS.admin);
      appStorage.updateRolePermissions('teacher', DEFAULT_ROLE_PERMISSIONS.teacher);
      appStorage.updateRolePermissions('student', DEFAULT_ROLE_PERMISSIONS.student);
      playSuccessSound();
      refreshData();
      setBannerNotice('Se han restablecido los permisos a los valores predeterminados del sistema.');
    }
  };

  const filteredModules = MODULES_LIST.filter(
    (m) => selectedCategory === 'TODOS' || m.category === selectedCategory
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2.5">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
            <span>Control y Asignación de Permisos por Rol</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Define con total libertad qué módulos y funciones pueden ver y utilizar los Estudiantes, Docentes y Administrativos.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="flex items-center justify-center space-x-2 px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restablecer Valores Iniciales</span>
        </button>
      </div>

      {/* Real-time Alert */}
      {bannerNotice && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/70 border border-indigo-500/40 text-indigo-200 text-xs flex items-center space-x-2.5 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{bannerNotice}</span>
        </div>
      )}

      {/* Info Card */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Sincronización Inmediata en la Barra Lateral
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Al desactivar un módulo para un rol (por ejemplo, desmarcar "Finanzas" para Estudiantes), el menú lateral ocultará automáticamente esa pestaña y bloqueará su navegación para todos los usuarios con ese perfil.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto shrink-0">
          <span className="text-[11px] text-slate-400">Probar perfil:</span>
          <button
            onClick={() => switchRoleQuickly('student')}
            className="px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-colors cursor-pointer flex items-center space-x-1"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Estudiante</span>
          </button>
          <button
            onClick={() => switchRoleQuickly('teacher')}
            className="px-2.5 py-1.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 text-xs font-medium border border-sky-500/30 transition-colors cursor-pointer flex items-center space-x-1"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Docente</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {(['TODOS', 'Academico', 'Financiero', 'Comunidad', 'Administracion'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat === 'TODOS'
              ? 'Todos los Módulos'
              : cat === 'Academico'
              ? 'Área Académica'
              : cat === 'Financiero'
              ? 'Área Financiera'
              : cat === 'Comunidad'
              ? 'Comunidad y Comunicación'
              : 'Administración y Sistema'}
          </button>
        ))}
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 w-2/5">Módulo o Función del Sistema</th>
                <th className="py-4 px-4 text-center w-1/5">
                  <div className="flex items-center justify-center space-x-1.5 text-indigo-400">
                    <GraduationCap className="w-4 h-4" />
                    <span>Estudiante</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center w-1/5">
                  <div className="flex items-center justify-center space-x-1.5 text-sky-400">
                    <Briefcase className="w-4 h-4" />
                    <span>Docente</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center w-1/5">
                  <div className="flex items-center justify-center space-x-1.5 text-amber-400">
                    <Shield className="w-4 h-4" />
                    <span>Administrativo</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredModules.map((mod) => {
                const studentActive = permissions.student?.[mod.key] ?? false;
                const teacherActive = permissions.teacher?.[mod.key] ?? false;
                const adminActive = permissions.admin?.[mod.key] ?? false;

                return (
                  <tr key={mod.key} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 mt-0.5 shrink-0">
                          {mod.icon}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{mod.label}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{mod.description}</div>
                        </div>
                      </div>
                    </td>

                    {/* Student Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle('student', mod.key)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          studentActive ? 'bg-indigo-600' : 'bg-slate-800'
                        }`}
                        title={studentActive ? 'Desactivar para Estudiantes' : 'Activar para Estudiantes'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            studentActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Teacher Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle('teacher', mod.key)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          teacherActive ? 'bg-sky-600' : 'bg-slate-800'
                        }`}
                        title={teacherActive ? 'Desactivar para Docentes' : 'Activar para Docentes'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            teacherActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Admin Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle('admin', mod.key)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          adminActive ? 'bg-amber-600' : 'bg-slate-800'
                        }`}
                        title={adminActive ? 'Desactivar para Administradores' : 'Activar para Administradores'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            adminActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
