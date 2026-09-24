import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  MessageSquare,
  Shield,
  GraduationCap,
  BookOpen,
  LogOut,
  RefreshCw,
  CloudCheck,
  Menu,
  CheckCircle,
  PhoneCall,
  Bot,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react';
import { appStorage } from '../services/storage';

interface NavbarProps {
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuthModal }) => {
  const {
    currentUser,
    currentRole,
    switchRoleQuickly,
    unreadNotifsCount,
    unreadChatsCount,
    isChatOpen,
    setIsChatOpen,
    userNotifications,
    refreshData,
    setActiveTab,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    refreshData();
    setTimeout(() => {
      setIsSyncing(false);
    }, 500);
  };

  const handleNotificationClick = (notifId: string, targetTab?: string) => {
    appStorage.markNotificationRead(notifId);
    refreshData();
    if (targetTab) {
      setActiveTab(targetTab);
    }
    setShowNotifMenu(false);
  };

  const handleMarkAllRead = () => {
    appStorage.markAllNotificationsRead(currentUser.id, currentUser.role);
    refreshData();
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b132b]/95 backdrop-blur-md text-white border-b border-sky-500/25 shadow-lg shadow-sky-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger + Arte & Estilo Logo */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white p-0.5 border-2 border-sky-400/40 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
                  <img
                    src="/logo.jpg"
                    alt="Arte & Estilo"
                    className="w-full h-full object-contain rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-sky-200 to-purple-300 bg-clip-text text-transparent">
                    Arte & Estilo
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40">
                    ACADEMIA DE BELLEZA
                  </span>
                </div>
                <p className="text-[10px] text-sky-200/80 font-semibold tracking-wide hidden sm:block">
                  Academia de Belleza Profesional
                </p>
              </div>
            </div>
          </div>

          {/* Center: Cheerful Greeting + Role Quick Switcher */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-sky-500/30 shadow-inner">
              <button
                onClick={() => switchRoleQuickly('admin')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentRole === 'admin'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-md shadow-sky-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Administrador</span>
              </button>
              <button
                onClick={() => switchRoleQuickly('teacher')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentRole === 'teacher'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Profesor</span>
              </button>
              <button
                onClick={() => switchRoleQuickly('student')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentRole === 'student'
                    ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold shadow-md shadow-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Estudiante</span>
              </button>
            </div>
          </div>

          {/* Right actions: Shortcuts + Live Chat + Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Direct Shortcuts for Admin / Teacher */}
            {(currentRole === 'admin' || currentRole === 'teacher') && (
              <button
                onClick={() => setActiveTab('staffChat')}
                title="Sala Directiva & Videollamadas Docente"
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Llamadas Staff</span>
              </button>
            )}

            {currentRole === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('whatsapp')}
                  title="Extensión WhatsApp Business con IA"
                  className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp IA</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  title="Centro de Ciberseguridad & Antivirus"
                  className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Shield</span>
                </button>
              </>
            )}

            {/* Realtime Sync Status Indicator */}
            <div
              onClick={handleManualSync}
              title="Sincronización en tiempo real activa (Clic para refrescar)"
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg cursor-pointer hover:bg-emerald-500/20 transition-colors"
            >
              <CloudCheck className={`w-4 h-4 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span className="font-bold text-[10px] uppercase">En Línea</span>
            </div>

            {/* Live Chat Drawer Button */}
            <button
              type="button"
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-700"
              title="Chat en vivo institucional"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadChatsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
                  {unreadChatsCount}
                </span>
              )}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowUserMenu(false);
                }}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-700"
                title="Notificaciones automáticas"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm animate-bounce">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Notificaciones</h4>
                      <p className="text-xs text-slate-400">
                        {unreadNotifsCount} sin leer para tu perfil
                      </p>
                    </div>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Marcar leídas
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {userNotifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No tienes notificaciones pendientes
                      </div>
                    ) : (
                      userNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif.id, notif.targetTab)}
                          className={`p-3.5 hover:bg-slate-800/80 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-indigo-950/20 border-l-2 border-indigo-500' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-semibold text-white leading-snug">
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar / Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifMenu(false);
                }}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-amber-500/40"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight max-w-[130px] truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-300 font-medium truncate max-w-[130px]">
                    {currentUser.cargo || (currentUser.role === 'admin' ? 'Administrador' : currentUser.role === 'teacher' ? 'Docente' : 'Estudiante')}
                  </div>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-amber-500/30 shadow-2xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-800">
                    <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                    <p className="text-xs text-slate-400">{currentUser.email}</p>
                    <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {currentUser.cargo || currentUser.role.toUpperCase()} • {currentUser.documentId}
                    </div>
                  </div>

                  <div className="py-1">
                    <div className="px-4 py-1.5 text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                      Cambiar de perfil o cargo
                    </div>
                    {appStorage.getStore().users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          appStorage.setCurrentUser(u);
                          setShowUserMenu(false);
                          refreshData();
                        }}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-800 cursor-pointer ${
                          u.id === currentUser.id ? 'text-amber-400 font-semibold bg-slate-800/50' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <img src={u.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                          <div className="truncate max-w-[140px]">
                            <div className="font-semibold text-white leading-tight truncate">{u.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{u.cargo || u.role}</div>
                          </div>
                        </div>
                        <span className="text-[9px] uppercase font-bold text-amber-400/80 px-1.5 py-0.5 rounded bg-slate-950/60 border border-slate-800 shrink-0">
                          {u.administrativeTitle === 'directora_academica'
                            ? 'Directora'
                            : u.administrativeTitle === 'coordinador'
                            ? 'Coord.'
                            : u.role === 'admin'
                            ? 'Admin'
                            : u.role === 'teacher'
                            ? 'Docente'
                            : 'Alumno'}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-800 pt-1 mt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAuthModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-indigo-400 hover:bg-slate-800 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Ingresar con otra cuenta</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Role Switcher Bar */}
        <div className="md:hidden py-2 border-t border-slate-800 flex justify-around">
          <button
            onClick={() => switchRoleQuickly('admin')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-1 ${
              currentRole === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
          <button
            onClick={() => switchRoleQuickly('teacher')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-1 ${
              currentRole === 'teacher' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Profesor</span>
          </button>
          <button
            onClick={() => switchRoleQuickly('student')}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-1 ${
              currentRole === 'student' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Estudiante</span>
          </button>
        </div>
      </div>
    </header>
  );
};
