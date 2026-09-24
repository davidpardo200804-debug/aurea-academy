import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  DollarSign,
  Calendar,
  Sparkles,
  MessagesSquare,
  Cloud,
  GraduationCap,
  FileSpreadsheet,
  UploadCloud,
  FileCheck,
  Video,
  Award,
  Wallet,
  ShieldCheck,
  UserCog,
  PhoneCall,
  Bot,
  KeyRound,
  StickyNote,
  Landmark,
  ClipboardCheck,
  BookOpen,
  Scissors,
  MessageCircle,
  Bell,
  Megaphone,
} from 'lucide-react';
import { RolePermissions } from '../types';

export const Sidebar: React.FC = () => {
  const { currentRole, currentUser, activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen, hasPermission } = useApp();

  const adminNav = [
    { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard },
    { id: 'chatCenter', label: 'Chat Center (Admin & Ventas)', icon: MessageCircle },
    { id: 'callCenter', label: 'Call Center & Admisiones', icon: PhoneCall },
    { id: 'pensum', label: 'Pensum & Calificación Módulos', icon: BookOpen },
    { id: 'practices', label: 'Bitácora de Prácticas Salón', icon: Scissors },
    { id: 'observer', label: 'Observador Estudiantil', icon: FileCheck },
    { id: 'teacherStudentChat', label: 'Mensajes Docente-Alumno', icon: MessageCircle },
    { id: 'notices', label: 'Muro de Anuncios & Promos', icon: Megaphone },
    { id: 'accounting', label: 'Contabilidad & Activos Fijos', icon: Landmark },
    { id: 'attendance', label: 'Llamado a Lista (Asistencia)', icon: ClipboardCheck },
    { id: 'notepad', label: 'Block de Notas & Minutas', icon: StickyNote },
    { id: 'staffChat', label: 'Llamadas & Sala Docente', icon: PhoneCall },
    { id: 'whatsapp', label: 'WhatsApp Extensión + IA', icon: Bot },
    { id: 'students', label: 'Estudiantes & Matrícula', icon: UserPlus },
    { id: 'groups', label: 'Grupos & Salones', icon: Users },
    { id: 'finances', label: 'Finanzas & Tesorería', icon: DollarSign },
    { id: 'security', label: 'Ciberseguridad & Antivirus', icon: ShieldCheck },
    { id: 'calendar', label: 'Calendario Institucional', icon: Calendar },
    { id: 'projections', label: 'Próximos Cursos & Proyección', icon: Sparkles },
    { id: 'forums', label: 'Foros Estudiantiles', icon: MessagesSquare },
    { id: 'users', label: 'Gestión de Usuarios', icon: UserCog },
    { id: 'permissions', label: 'Permisos por Rol', icon: KeyRound },
    { id: 'backup', label: 'Respaldo en la Nube', icon: Cloud },
  ];

  const teacherNav = [
    { id: 'dashboard', label: 'Panel Docente', icon: LayoutDashboard },
    { id: 'pensum', label: 'Pensum & Calificar Módulos', icon: BookOpen },
    { id: 'practices', label: 'Bitácora de Prácticas Salón', icon: Scissors },
    { id: 'observer', label: 'Observador Estudiantil', icon: FileCheck },
    { id: 'teacherStudentChat', label: 'Chat con Estudiantes', icon: MessageCircle },
    { id: 'notices', label: 'Muro de Anuncios & Eventos', icon: Megaphone },
    { id: 'attendance', label: 'Llamar a Lista (Asistencia)', icon: ClipboardCheck },
    { id: 'staffChat', label: 'Llamadas & Sala Directiva', icon: PhoneCall },
    { id: 'grades', label: 'Calificaciones & Notas', icon: Award },
    { id: 'groups', label: 'Mis Grupos Asignados', icon: Users },
    { id: 'resources', label: 'Aula Virtual (Archivos/Video)', icon: UploadCloud },
    { id: 'invoices', label: 'Cuentas de Cobro & Honorarios', icon: Wallet },
    { id: 'inductions', label: 'Reinducciones Docentes', icon: Video },
    { id: 'forums', label: 'Foros de Clase', icon: MessagesSquare },
  ];

  const studentNav = [
    { id: 'dashboard', label: 'Mi Panel (Progreso 0-100%)', icon: LayoutDashboard },
    { id: 'pensum', label: 'Mi Pensum & Módulos', icon: BookOpen },
    { id: 'practices', label: 'Mis Prácticas en Salón Escuela', icon: Scissors },
    { id: 'observer', label: 'Mi Observador Estudiantil', icon: FileCheck },
    { id: 'teacherStudentChat', label: 'Mensajes con Docentes', icon: MessageCircle },
    { id: 'notices', label: 'Muro de Fotos, Promos & Eventos', icon: Megaphone },
    { id: 'certificates', label: 'Solicitud de Certificados', icon: FileCheck },
    { id: 'attendance', label: 'Mi Asistencia a Clases', icon: ClipboardCheck },
    { id: 'finances', label: 'Estado Financiero & Pagos', icon: DollarSign },
    { id: 'grades', label: 'Mis Calificaciones', icon: Award },
    { id: 'resources', label: 'Aula Virtual (Materiales)', icon: FileSpreadsheet },
    { id: 'forums', label: 'Foros de Discusión', icon: MessagesSquare },
    { id: 'calendar', label: 'Calendario Escolar', icon: Calendar },
  ];

  const agentNav = [
    { id: 'chatCenter', label: 'Chat Center (Admin & Ventas)', icon: MessageCircle },
    { id: 'callCenter', label: 'Call Center & Admisiones', icon: PhoneCall },
    { id: 'students', label: 'Estudiantes & Matrículas', icon: UserPlus },
    { id: 'groups', label: 'Grupos & Cupos', icon: Users },
    { id: 'projections', label: 'Próximos Cursos & Proyección', icon: Sparkles },
    { id: 'pensum', label: 'Pensum de la Academia', icon: BookOpen },
    { id: 'calendar', label: 'Calendario & Citas', icon: Calendar },
    { id: 'whatsapp', label: 'WhatsApp Extensión + IA', icon: Bot },
    { id: 'notices', label: 'Muro de Promos & Eventos', icon: Megaphone },
    { id: 'notepad', label: 'Block de Notas & Minutas', icon: StickyNote },
  ];

  const baseItems =
    currentRole === 'admin'
      ? adminNav
      : currentRole === 'agent'
      ? agentNav
      : currentRole === 'teacher'
      ? teacherNav
      : studentNav;

  // Granular filtering based on customized role permissions
  const currentItems = baseItems.filter((item) => hasPermission(item.id as keyof RolePermissions));

  // If current active tab is blocked by permissions, redirect to dashboard or first allowed
  useEffect(() => {
    if (currentItems.length > 0 && !currentItems.some((item) => item.id === activeTab)) {
      setActiveTab(currentItems[0].id);
    }
  }, [currentItems, activeTab, setActiveTab]);

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div className="py-4 px-3 flex-1 overflow-y-auto">
          {/* Role Badge Indicator */}
          {/* Role & Cargo Badge Indicator */}
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 shadow-md">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
              {currentUser.cargo || (currentRole === 'admin' ? 'Administración General' : currentRole === 'teacher' ? 'Docente' : 'Estudiante')}
            </div>
            <div className="text-xs font-bold text-white flex items-center space-x-1.5 mt-1 truncate">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  currentRole === 'admin'
                    ? 'bg-amber-400 shadow-sm shadow-amber-400'
                    : currentRole === 'teacher'
                    ? 'bg-sky-400 shadow-sm shadow-sky-400'
                    : 'bg-emerald-400 shadow-sm shadow-emerald-400'
                }`}
              />
              <span className="truncate">{currentUser.name}</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {currentItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? currentRole === 'admin'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                        : currentRole === 'teacher'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? (currentRole === 'admin' ? 'text-slate-950 font-bold' : 'text-white') : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Versión 2.6 Pro</span>
            <span className="flex items-center space-x-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>En Línea</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
