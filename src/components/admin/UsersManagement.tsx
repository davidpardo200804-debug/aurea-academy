import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  GraduationCap,
  Briefcase,
  Key,
  Camera,
  Upload,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  LogIn,
  X,
  Lock,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { appStorage } from '../../services/storage';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
];

export const UsersManagement: React.FC = () => {
  const { store, currentUser, setCurrentUser, refreshData, playSuccessSound, playNotificationSound } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState<UserRole>('student');
  const [cargo, setCargo] = useState('Estudiante Activo');
  const [ratePerClass, setRatePerClass] = useState('48000');
  const [assignedSalary, setAssignedSalary] = useState('2400000');
  const [phone, setPhone] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [gradeLevel, setGradeLevel] = useState('11°');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);

  const users = store.users;

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.documentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.cargo && u.cargo.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const handleOpenCreateModal = () => {
    setName('');
    setEmail('');
    setPassword('123456');
    setRole('student');
    setCargo('Estudiante Activo');
    setRatePerClass('48000');
    setAssignedSalary('2400000');
    setPhone('');
    setDocumentId('');
    setSpecialty('');
    setGradeLevel('11°');
    setAvatar(PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]);
    setEditingUser(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPassword(u.password || '');
    setRole(u.role);
    setCargo(u.cargo || (u.role === 'admin' ? 'Administrador General' : u.role === 'teacher' ? 'Docente de Planta' : 'Estudiante'));
    setRatePerClass(String(u.ratePerClass || 48000));
    setAssignedSalary(String(u.assignedSalary || 2400000));
    setPhone(u.phone);
    setDocumentId(u.documentId);
    setSpecialty(u.specialty || '');
    setGradeLevel(u.gradeLevel || '11°');
    setAvatar(u.avatar || PRESET_AVATARS[0]);
    setIsCreateModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !documentId) return;

    if (editingUser) {
      // Edit existing user
      appStorage.updateUser(editingUser.id, {
        name,
        email,
        password,
        role,
        cargo,
        ratePerClass: role === 'teacher' ? Number(ratePerClass) || 48000 : undefined,
        assignedSalary: role === 'teacher' ? Number(assignedSalary) || 2400000 : undefined,
        avatar,
        phone,
        documentId,
        specialty: role === 'teacher' ? specialty : undefined,
        gradeLevel: role === 'student' ? gradeLevel : undefined,
      });
      playSuccessSound();
    } else {
      // Create new user
      appStorage.createUser({
        name,
        email,
        password,
        role,
        cargo,
        ratePerClass: role === 'teacher' ? Number(ratePerClass) || 48000 : undefined,
        assignedSalary: role === 'teacher' ? Number(assignedSalary) || 2400000 : undefined,
        avatar,
        phone: phone || '+57 300 123 4567',
        documentId,
        specialty: role === 'teacher' ? specialty : undefined,
        gradeLevel: role === 'student' ? gradeLevel : undefined,
        active: true,
      });
      playSuccessSound();
    }

    refreshData();
    setIsCreateModalOpen(false);
  };

  const handleToggleActive = (u: User) => {
    appStorage.updateUser(u.id, { active: !u.active });
    playNotificationSound();
    refreshData();
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`¿Estás seguro de eliminar al usuario "${userName}"? Esta acción no se puede deshacer.`)) {
      appStorage.deleteUser(userId);
      playNotificationSound();
      refreshData();
    }
  };

  const handleLoginAsUser = (u: User) => {
    setCurrentUser(u);
    playSuccessSound();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2.5">
            <Users className="w-7 h-7 text-indigo-400" />
            <span>Gestión de Usuarios y Cuentas</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Crea, edita y administra los perfiles de acceso para Administrativos, Docentes y Estudiantes.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Crear Nuevo Usuario</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Usuarios</div>
          <div className="text-2xl font-black text-white mt-1">{users.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider flex items-center space-x-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Estudiantes</span>
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {users.filter((u) => u.role === 'student').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider flex items-center space-x-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Docentes</span>
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {users.filter((u) => u.role === 'teacher').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Administradores</span>
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {users.filter((u) => u.role === 'admin').length}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, correo o documento..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'admin', 'teacher', 'student'] as const).map((rKey) => (
            <button
              key={rKey}
              onClick={() => setRoleFilter(rKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                roleFilter === rKey
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {rKey === 'ALL'
                ? 'Todos'
                : rKey === 'admin'
                ? 'Administrativos'
                : rKey === 'teacher'
                ? 'Docentes'
                : 'Estudiantes'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Usuario / Identificación</th>
                <th className="py-3.5 px-4">Rol en el Sistema</th>
                <th className="py-3.5 px-4">Contacto</th>
                <th className="py-3.5 px-4">Detalle / Especialidad</th>
                <th className="py-3.5 px-4">Estado Cuenta</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No se encontraron usuarios coincidentes.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = currentUser.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40 shadow-sm shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-white text-sm flex items-center space-x-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                  Tú
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                              <span>{u.documentId}</span>
                              <span>•</span>
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {u.role === 'admin' ? (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              <Shield className="w-3 h-3" />
                              <span>{u.cargo || 'Administrador General'}</span>
                            </span>
                          ) : u.role === 'teacher' ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-300 border border-sky-500/30">
                                <Briefcase className="w-3 h-3" />
                                <span>{u.cargo || 'Docente'}</span>
                              </span>
                              <div className="text-[10px] text-amber-300 font-semibold flex items-center space-x-1">
                                <Lock className="w-2.5 h-2.5" />
                                <span>${(u.ratePerClass || 48000).toLocaleString('es-CO')} / clase</span>
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                              <GraduationCap className="w-3 h-3" />
                              <span>Estudiante</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{u.phone}</div>
                        <div className="text-[11px] text-slate-400">Creado: {u.createdAt}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {u.role === 'teacher' ? (
                          <div className="space-y-0.5">
                            <span className="text-sky-300 font-medium block">{u.specialty || 'General'}</span>
                            {u.assignedSalary && (
                              <span className="text-[10px] text-slate-400 block">
                                Base: ${u.assignedSalary.toLocaleString('es-CO')}
                              </span>
                            )}
                          </div>
                        ) : u.role === 'student' ? (
                          <span className="text-indigo-300 font-medium">Grado {u.gradeLevel || '11°'}</span>
                        ) : (
                          <span className="text-amber-300 font-medium">{u.cargo || 'Dirección Institucional'}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleActive(u)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                            u.active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                          }`}
                        >
                          {u.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{u.active ? 'Activo' : 'Suspendido'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleLoginAsUser(u)}
                            className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-colors cursor-pointer"
                            title="Probar interfaz como este usuario"
                          >
                            <LogIn className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                            title="Editar usuario"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!isCurrent && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                              title="Eliminar cuenta"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Modal: Create or Edit User */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                {editingUser ? <Edit2 className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingUser ? 'Editar Cuenta de Usuario' : 'Crear Nuevo Usuario en la Plataforma'}
                </h2>
                <p className="text-xs text-slate-400">
                  Asigna el rol (Estudiante, Docente o Administrativo) y sus credenciales de acceso.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              {/* Photo Selector */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group shrink-0">
                  <img
                    src={avatar}
                    alt="Foto de perfil"
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
                  />
                  <label className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white">
                    <Camera className="w-6 h-6" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="text-xs font-semibold text-white">Foto de Perfil del Usuario</div>
                  <p className="text-[11px] text-slate-400">
                    Sube una foto personalizada o selecciona un avatar sugerido:
                  </p>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-medium border border-indigo-500/40 transition-colors cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir archivo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <div className="flex items-center space-x-1">
                      {PRESET_AVATARS.map((pUrl, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setAvatar(pUrl)}
                          className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-transform cursor-pointer ${
                            avatar === pUrl ? 'border-indigo-400 scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={pUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Rol en el Sistema *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      role === 'student'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span className="text-xs font-bold">Estudiante</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      role === 'teacher'
                        ? 'bg-sky-600/20 border-sky-500 text-sky-300 ring-2 ring-sky-500/20'
                        : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                    <span className="text-xs font-bold">Docente</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      role === 'admin'
                        ? 'bg-amber-600/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/20'
                        : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span className="text-xs font-bold">Administrativo</span>
                  </button>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Andrés Camilo Torres"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Documento de Identidad *</label>
                  <input
                    type="text"
                    required
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    placeholder="CC o TI 1.035.789.012"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico (Login) *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@edumanage.edu"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña de Acceso</label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Clave de acceso inicial"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 312 987 6543"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {role === 'teacher' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Área / Especialidad Docente</label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="Ej. Matemáticas, Física, Ciencias"
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ) : role === 'student' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Grado Escolar</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="6°">6° Bachillerato</option>
                      <option value="7°">7° Bachillerato</option>
                      <option value="8°">8° Bachillerato</option>
                      <option value="9°">9° Bachillerato</option>
                      <option value="10°">10° Bachillerato / Técnico</option>
                      <option value="11°">11° Bachillerato Académico</option>
                      <option value="Diplomado">Educación Continuada / Diplomado</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Cargo Administrativo Específico *</label>
                    <select
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="Administrador General / Rector">Administrador General / Rector</option>
                      <option value="Directora Académica">Directora Académica</option>
                      <option value="Coordinador Académico">Coordinador Académico</option>
                      <option value="Coordinador de Convivencia">Coordinador de Convivencia</option>
                      <option value="Secretaría Académica">Secretaría Académica</option>
                      <option value="Tesorería & Contabilidad">Tesorería & Contabilidad</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Specific Teacher Salary / Rate Fields */}
              {role === 'teacher' && (
                <div className="p-4 bg-slate-950/70 border border-amber-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
                    <Lock className="w-4 h-4" />
                    <span>Asignación Salarial & Tarifa Contractual (Fijada por Administración)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    El valor asignado aquí es el que regirá automáticamente para las cuentas de cobro de este
                    docente. El docente sólo podrá ingresar el mes y las clases, pero <strong>no podrá alterar este valor</strong>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Valor por Clase Asignada ($COP) *
                      </label>
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        required
                        value={ratePerClass}
                        onChange={(e) => setRatePerClass(e.target.value)}
                        placeholder="48000"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                      />
                      <span className="text-[10px] text-slate-500 mt-0.5 block">Ej: $48.000 / clase impartida</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Salario Base Mensual Referencial ($COP)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={assignedSalary}
                        onChange={(e) => setAssignedSalary(e.target.value)}
                        placeholder="2400000"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                      <span className="text-[10px] text-slate-500 mt-0.5 block">Ej: $2.400.000 base</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Vinculación / Cargo</label>
                    <input
                      type="text"
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                      placeholder="Docente de Planta / Docente Catedrático Titular"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
                >
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
