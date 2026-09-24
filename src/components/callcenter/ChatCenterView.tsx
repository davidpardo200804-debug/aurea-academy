import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { appStorage } from '../../services/storage';
import {
  MessageSquare,
  Users,
  Send,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  PhoneCall,
  DollarSign,
  Award,
  ChevronRight,
  TrendingUp,
  Percent,
  Check,
  X,
  FileText,
  BadgePercent,
  ShieldCheck,
  HelpCircle,
  Megaphone,
  UserCheck,
  Bot,
  Zap,
  Phone,
  Bookmark,
  ExternalLink,
  MessageCircle,
  Copy,
  Flame,
} from 'lucide-react';
import { AdminAgentMessage, AdminAgentMessageType, User } from '../../types';

interface ChannelDef {
  id: string;
  name: string;
  type: 'channel' | 'dm';
  icon: any;
  description: string;
  badge?: string;
  unreadCount?: number;
}

export const ChatCenterView: React.FC = () => {
  const { store, currentUser, currentRole, setActiveTab, playSuccessSound, playMessageSound, refreshData } = useApp();

  // Active channel or Direct Message ID
  const [activeChatId, setActiveChatId] = useState<string>('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'normal' | 'urgente' | 'aprobacion_inmediata'>('normal');

  // Modal for requesting a new discount / approval
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountProspectName, setDiscountProspectName] = useState('');
  const [discountProgramName, setDiscountProgramName] = useState('Técnico Laboral en Peluquería Integral & Estilismo');
  const [discountStandardFee, setDiscountStandardFee] = useState(2400000);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [discountReason, setDiscountReason] = useState('');

  // Modal for quoting a prospect from schedule
  const [isQuoteProspectModalOpen, setIsQuoteProspectModalOpen] = useState(false);
  const [quotedProspect, setQuotedProspect] = useState<any>(null);

  // Quick internal call simulation modal
  const [activeCallContact, setActiveCallContact] = useState<{ name: string; role: string; avatar: string } | null>(null);

  // Right info panel toggle
  const [showSidePanel, setShowSidePanel] = useState(true);

  // Auto scroll ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [store.adminAgentMessages, activeChatId]);

  // List of Admin Users & Agent Users
  const adminUsers = useMemo(() => store.users.filter((u) => u.role === 'admin'), [store.users]);
  const agentUsers = useMemo(() => store.users.filter((u) => u.role === 'agent'), [store.users]);

  // Channels definition
  const channels: ChannelDef[] = [
    {
      id: 'general',
      name: '📢 Sala General (Ventas & Dirección)',
      type: 'channel',
      icon: Megaphone,
      description: 'Canal abierto para anuncios, motivación diaria y metas de matrículas',
    },
    {
      id: 'approvals',
      name: '🏷️ Mesa de Aprobaciones & Descuentos',
      type: 'channel',
      icon: BadgePercent,
      description: 'Solicitudes de descuentos y acuerdos de pago en tiempo real',
    },
    {
      id: 'support',
      name: '💡 Soporte Rápido & Objeciones de Clientes',
      type: 'channel',
      icon: HelpCircle,
      description: 'Preguntas y respuestas oficiales sobre kits, requisitos y cupos',
    },
  ];

  // Direct conversations list
  const dmContacts = useMemo(() => {
    // If current user is agent, list all admins and peer agents
    // If current user is admin, list all agents and peer admins
    const contacts: { id: string; user: User; roleLabel: string; status: 'online' | 'calling' | 'busy' }[] = [];

    // Admins
    adminUsers.forEach((admin) => {
      contacts.push({
        id: `dm-${admin.id}`,
        user: admin,
        roleLabel: admin.cargo || 'Directiva Institucional',
        status: 'online',
      });
    });

    // Agents
    agentUsers.forEach((agent) => {
      contacts.push({
        id: `dm-${agent.id}`,
        user: agent,
        roleLabel: agent.cargo || 'Asesora Comercial / Vendedora',
        status: agent.id === 'usr-agent-1' ? 'online' : 'calling',
      });
    });

    return contacts;
  }, [adminUsers, agentUsers]);

  // Calculate pending discount approvals count
  const pendingApprovalsCount = useMemo(() => {
    return (store.adminAgentMessages || []).filter(
      (m) => m.type === 'discount_request' && m.discountRequestData?.status === 'pendiente'
    ).length;
  }, [store.adminAgentMessages]);

  // Filter messages for the current active chat
  const currentMessages = useMemo(() => {
    const all = store.adminAgentMessages || [];
    if (activeChatId === 'general') {
      return all.filter((m) => m.channelId === 'general' || (!m.channelId && !m.recipientId));
    }
    if (activeChatId === 'approvals') {
      return all.filter((m) => m.channelId === 'approvals' || m.type === 'discount_request');
    }
    if (activeChatId === 'support') {
      return all.filter((m) => m.channelId === 'support');
    }
    if (activeChatId.startsWith('dm-')) {
      const targetUserId = activeChatId.replace('dm-', '');
      return all.filter(
        (m) =>
          (m.senderId === currentUser.id && m.recipientId === targetUserId) ||
          (m.senderId === targetUserId && m.recipientId === currentUser.id) ||
          (m.channelId && m.channelId.includes(targetUserId) && m.channelId.includes(currentUser.id)) ||
          // Fallback matching if between specific agent and admin
          (m.agentId === targetUserId || m.senderId === targetUserId)
      );
    }
    return all;
  }, [store.adminAgentMessages, activeChatId, currentUser.id]);

  // Active chat metadata
  const activeChatMeta = useMemo(() => {
    const foundChannel = channels.find((c) => c.id === activeChatId);
    if (foundChannel) {
      return {
        title: foundChannel.name,
        subtitle: foundChannel.description,
        isChannel: true,
        avatar: null,
      };
    }
    const foundContact = dmContacts.find((c) => c.id === activeChatId);
    if (foundContact) {
      return {
        title: foundContact.user.name,
        subtitle: `${foundContact.roleLabel} • ${foundContact.status === 'online' ? '🟢 En Línea' : '📞 En Llamada con Estudiante'}`,
        isChannel: false,
        avatar: foundContact.user.avatar,
        user: foundContact.user,
        status: foundContact.status,
      };
    }
    return {
      title: 'Chat Comercial',
      subtitle: 'Centro de Comunicaciones',
      isChannel: true,
      avatar: null,
    };
  }, [activeChatId, channels, dmContacts]);

  // Handle send normal message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() && !quotedProspect) return;

    let targetChannel = activeChatId;
    let recipientId: string | undefined = undefined;
    let recipientName: string | undefined = undefined;

    if (activeChatId.startsWith('dm-')) {
      recipientId = activeChatId.replace('dm-', '');
      const recUser = store.users.find((u) => u.id === recipientId);
      recipientName = recUser ? recUser.name : 'Personal';
    }

    const newMsg: Omit<AdminAgentMessage, 'id' | 'timestamp' | 'date' | 'read'> = {
      agentId: currentUser.role === 'agent' ? currentUser.id : 'usr-agent-1',
      agentName: currentUser.role === 'agent' ? currentUser.name : 'Camila Morales',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role === 'admin' ? 'admin' : 'agent',
      message: messageInput.trim(),
      channelId: targetChannel,
      recipientId,
      recipientName,
      priority: selectedPriority,
      type: 'text',
      quoteProspectName: quotedProspect?.prospectName,
      quoteProgramName: quotedProspect?.programOfInterest,
    };

    appStorage.sendAdminAgentMessage(newMsg);
    playMessageSound();
    setMessageInput('');
    setQuotedProspect(null);
    setSelectedPriority('normal');
    refreshData();
  };

  // Handle submit discount request
  const handleSendDiscountRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountProspectName.trim()) return;

    const discountAmount = Math.round((discountStandardFee * discountPercent) / 100);
    const finalFee = discountStandardFee - discountAmount;

    const messageText = `🏷️ SOLICITUD DE DESCUENTO: Prospecto ${discountProspectName} para ${discountProgramName}. Solicita ${discountPercent}% de descuento ($${discountAmount.toLocaleString('es-CO')}). Matrícula quedaría en $${finalFee.toLocaleString('es-CO')}. Motivo: ${discountReason || 'Cierre inmediato hoy'}.`;

    appStorage.sendAdminAgentMessage({
      agentId: currentUser.role === 'agent' ? currentUser.id : 'usr-agent-1',
      agentName: currentUser.role === 'agent' ? currentUser.name : 'Camila Morales',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'agent',
      channelId: 'approvals',
      priority: 'aprobacion_inmediata',
      type: 'discount_request',
      message: messageText,
      quoteProspectName: discountProspectName,
      quoteProgramName: discountProgramName,
      discountRequestData: {
        prospectName: discountProspectName,
        programName: discountProgramName,
        standardFee: discountStandardFee,
        discountPercent: discountPercent,
        discountedFee: finalFee,
        status: 'pendiente',
      },
    });

    playSuccessSound();
    setIsDiscountModalOpen(false);
    setDiscountProspectName('');
    setDiscountReason('');
    setActiveChatId('approvals');
    refreshData();
  };

  // Handle admin approval or rejection of discount
  const handleDecideDiscount = (msgId: string, decision: 'aprobado' | 'rechazado') => {
    appStorage.approveOrRejectDiscount(msgId, decision, currentUser.name);
    playSuccessSound();
    refreshData();
  };

  // Quick canned responses
  const cannedTemplates = [
    '✅ Aprobado, procede con la matrícula y asegúrate de registrar el recibo en caja.',
    '⚠️ Recuerden que para Barbería quedan únicamente 3 cupos en la jornada de la Mañana.',
    '💡 Puedes ofrecerle el pago de matrícula fraccionado en 2 quincenas si realiza abono inicial de $200.000.',
    '🎉 ¡Excelente cierre! Ya sumamos otra matrícula al grupo confirmado.',
    '📞 Llámalo en 10 minutos que ya revisé su perfil y le podemos dar el obsequio del kit de peines.',
  ];

  return (
    <div className="h-[calc(100vh-5.5rem)] flex flex-col bg-slate-950 text-slate-100 rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden">
      {/* TOP STATUS BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-b border-slate-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Chat Center Comercial & Administrativo
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                Arte & Estilo
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-2">
              <span>Canal directo entre Dirección, Coordinación y Asesoras de Ventas</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
                5 Asesores y Directivos en línea
              </span>
            </p>
          </div>
        </div>

        {/* Action Shortcuts & KPIs */}
        <div className="flex items-center space-x-2.5">
          {pendingApprovalsCount > 0 && (
            <button
              onClick={() => setActiveChatId('approvals')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all flex items-center space-x-1.5 animate-pulse cursor-pointer"
            >
              <BadgePercent className="w-3.5 h-3.5 text-amber-300" />
              <span>{pendingApprovalsCount} Aprobación{pendingApprovalsCount > 1 ? 'es' : ''} Pendiente{pendingApprovalsCount > 1 ? 's' : ''}</span>
            </button>
          )}

          <button
            onClick={() => setIsDiscountModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-pink-500/20 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <BadgePercent className="w-3.5 h-3.5 text-pink-200" />
            <span>Pedir Aprobación de Descuento</span>
          </button>

          <button
            onClick={() => setShowSidePanel(!showSidePanel)}
            className={`p-2 rounded-xl border text-xs font-medium transition-all ${
              showSidePanel
                ? 'bg-slate-800 text-indigo-300 border-indigo-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Panel de Indicadores Comerciales"
          >
            <TrendingUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA: 3 PANELS */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: CHANNELS & DIRECT MESSAGES */}
        <div className="w-72 sm:w-80 border-r border-slate-800/80 bg-slate-900/60 flex flex-col shrink-0">
          {/* Search bar */}
          <div className="p-3 border-b border-slate-800/80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar canal, vendedora o admin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {/* CANALES DEL EQUIPO */}
            <div>
              <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase flex items-center justify-between">
                <span>Canales del Equipo</span>
                <span className="text-slate-500 text-[9px]">Oficial</span>
              </div>
              <div className="space-y-1">
                {channels
                  .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((channel) => {
                    const Icon = channel.icon;
                    const isActive = activeChatId === channel.id;
                    const isApprovals = channel.id === 'approvals';

                    return (
                      <button
                        key={channel.id}
                        onClick={() => setActiveChatId(channel.id)}
                        className={`w-full text-left p-2.5 rounded-2xl transition-all flex items-start space-x-2.5 cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/40 border border-indigo-500/50 text-white shadow-md'
                            : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl shrink-0 ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : isApprovals && pendingApprovalsCount > 0
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold truncate">{channel.name}</span>
                            {isApprovals && pendingApprovalsCount > 0 && (
                              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] animate-pulse">
                                {pendingApprovalsCount}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {channel.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* CHATS DIRECTOS CON EL EQUIPO */}
            <div>
              <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase flex items-center justify-between">
                <span>Personal Administrativo</span>
                <span className="text-indigo-400 text-[9px]">Dirección</span>
              </div>
              <div className="space-y-1">
                {dmContacts
                  .filter((c) => c.user.role === 'admin' && c.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((contact) => {
                    const isActive = activeChatId === contact.id;

                    return (
                      <button
                        key={contact.id}
                        onClick={() => setActiveChatId(contact.id)}
                        className={`w-full text-left p-2 rounded-2xl transition-all flex items-center space-x-2.5 cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-900/50 to-indigo-900/40 border border-purple-500/50 text-white'
                            : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={contact.user.avatar}
                            alt={contact.user.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-purple-400/40"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold truncate text-white">
                              {contact.user.name}
                            </span>
                            <span className="text-[9px] text-purple-400 font-bold uppercase">Admin</span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{contact.roleLabel}</p>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* ASESORAS DE VENTA / CALL CENTER */}
            <div>
              <div className="px-2 pb-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase flex items-center justify-between">
                <span>Vendedoras & Admisiones</span>
                <span className="text-pink-400 text-[9px]">Fuerza Comercial</span>
              </div>
              <div className="space-y-1">
                {dmContacts
                  .filter((c) => c.user.role === 'agent' && c.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((contact) => {
                    const isActive = activeChatId === contact.id;

                    return (
                      <button
                        key={contact.id}
                        onClick={() => setActiveChatId(contact.id)}
                        className={`w-full text-left p-2 rounded-2xl transition-all flex items-center space-x-2.5 cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-pink-900/50 to-indigo-900/40 border border-pink-500/50 text-white'
                            : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={contact.user.avatar}
                            alt={contact.user.name}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-pink-400/40"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-slate-950 rounded-full ${
                              contact.status === 'online' ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                          ></span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold truncate text-white">
                              {contact.user.name}
                            </span>
                            <span className="text-[9px] text-pink-400 font-bold uppercase">Ventas</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-[10px] text-slate-400 truncate">{contact.roleLabel}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: ACTIVE CHAT CONVERSATION */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
          {/* Active conversation header */}
          <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3">
              {activeChatMeta.avatar ? (
                <div className="relative">
                  <img
                    src={activeChatMeta.avatar}
                    alt={activeChatMeta.title}
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/50"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
              )}
              <div>
                <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>{activeChatMeta.title}</span>
                </h2>
                <p className="text-xs text-slate-400">{activeChatMeta.subtitle}</p>
              </div>
            </div>

            {/* Header shortcuts */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsQuoteProspectModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-all flex items-center space-x-1 cursor-pointer"
                title="Citar un prospecto en la conversación"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Citar Prospecto</span>
              </button>

              {!activeChatMeta.isChannel && activeChatMeta.user && (
                <button
                  onClick={() =>
                    setActiveCallContact({
                      name: activeChatMeta.user!.name,
                      role: activeChatMeta.user!.cargo || 'Equipo',
                      avatar: activeChatMeta.user!.avatar,
                    })
                  }
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-xs text-emerald-300 border border-emerald-500/30 transition-all flex items-center space-x-1 cursor-pointer"
                  title="Iniciar llamada interna"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Llamada Rápida</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('callCenter')}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-xs text-indigo-300 border border-indigo-500/30 transition-all flex items-center space-x-1 cursor-pointer"
                title="Ir al Call Center principal"
              >
                <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Ver Call Center</span>
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {currentMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-14 h-14 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-slate-300">No hay mensajes en este canal</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Inicia la conversación con el personal administrativo o tus compañeras vendedoras.
                </p>
              </div>
            ) : (
              currentMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                const isAdmin = msg.senderRole === 'admin';
                const isDiscountReq = msg.type === 'discount_request';
                const isDiscountAppr = msg.type === 'discount_approved';
                const isUrgent = msg.priority === 'urgente' || msg.priority === 'aprobacion_inmediata';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-2xl ${
                      isMe ? 'ml-auto' : 'mr-auto'
                    }`}
                  >
                    {/* Sender tag */}
                    <div className="flex items-center space-x-1.5 mb-1 px-1">
                      <span className="text-[11px] font-bold text-slate-300">{msg.senderName}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-md text-[9px] font-extrabold uppercase ${
                          isAdmin
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                        }`}
                      >
                        {isAdmin ? 'Dirección' : 'Vendedora'}
                      </span>
                      <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      {isUrgent && (
                        <span className="px-1.5 py-0.2 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[9px] font-bold">
                          ⚡ Urgente
                        </span>
                      )}
                    </div>

                    {/* Message Card */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-lg relative ${
                        isMe
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                          : isAdmin
                          ? 'bg-slate-900 border border-purple-500/30 text-slate-100 rounded-tl-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                      }`}
                    >
                      {/* Quoted prospect badge if attached */}
                      {msg.quoteProspectName && (
                        <div className="mb-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-2 text-[11px]">
                          <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-slate-400">Prospecto citado: </span>
                            <span className="font-bold text-white">{msg.quoteProspectName}</span>
                            {msg.quoteProgramName && (
                              <span className="text-indigo-300"> ({msg.quoteProgramName})</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Main Message Text */}
                      <p className="whitespace-pre-line">{msg.message}</p>

                      {/* INTERACTIVE DISCOUNT REQUEST CARD */}
                      {msg.discountRequestData && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-indigo-500/40 space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center space-x-1.5 text-indigo-300 font-bold text-xs">
                              <BadgePercent className="w-4 h-4 text-pink-400" />
                              <span>Resumen de Descuento Solicitado</span>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                msg.discountRequestData.status === 'aprobado'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : msg.discountRequestData.status === 'rechazado'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                              }`}
                            >
                              {msg.discountRequestData.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-400">Prospecto: </span>
                              <span className="font-semibold text-slate-200">
                                {msg.discountRequestData.prospectName}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">Programa: </span>
                              <span className="font-semibold text-slate-200">
                                {msg.discountRequestData.programName}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">Precio Normal: </span>
                              <span className="line-through text-slate-400">
                                ${msg.discountRequestData.standardFee.toLocaleString('es-CO')}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400">Descuento: </span>
                              <span className="font-bold text-pink-400">
                                {msg.discountRequestData.discountPercent}% OFF ($-
                                {(
                                  msg.discountRequestData.standardFee -
                                  msg.discountRequestData.discountedFee
                                ).toLocaleString('es-CO')}
                                )
                              </span>
                            </div>
                            <div className="col-span-2 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-300">Valor Final Matrícula:</span>
                              <span className="text-sm font-black text-emerald-400">
                                ${msg.discountRequestData.discountedFee.toLocaleString('es-CO')} COP
                              </span>
                            </div>
                          </div>

                          {/* ACTION BUTTONS FOR ADMIN */}
                          {msg.discountRequestData.status === 'pendiente' && currentUser.role === 'admin' && (
                            <div className="pt-2 border-t border-slate-800 flex items-center space-x-2">
                              <button
                                onClick={() => handleDecideDiscount(msg.id, 'aprobado')}
                                className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1 cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Aprobar Descuento</span>
                              </button>
                              <button
                                onClick={() => handleDecideDiscount(msg.id, 'rechazado')}
                                className="flex-1 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 font-semibold text-xs border border-rose-500/40 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Rechazar</span>
                              </button>
                            </div>
                          )}

                          {/* SHORTCUT TO ENROLL FOR AGENT */}
                          {msg.discountRequestData.status === 'aprobado' && (
                            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                              <span className="text-emerald-300 font-medium">
                                ✓ Autorizado por: {msg.discountRequestData.authorizedBy || 'Dirección'}
                              </span>
                              <button
                                onClick={() => setActiveTab('callCenter')}
                                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs shadow transition-all cursor-pointer"
                              >
                                Matricular Ahora 🚀
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quoted Prospect Floating Chip */}
          {quotedProspect && (
            <div className="mx-4 mb-2 p-2 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 truncate">
                <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-300">Citar a:</span>
                <span className="font-bold text-white">{quotedProspect.prospectName}</span>
                <span className="text-slate-400">({quotedProspect.programOfInterest})</span>
              </div>
              <button
                onClick={() => setQuotedProspect(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Canned Chips Bar */}
          <div className="px-4 py-1.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto text-[11px]">
            <span className="text-slate-500 shrink-0 font-bold flex items-center">
              <Zap className="w-3 h-3 text-amber-400 mr-1" /> Respuestas Rápidas:
            </span>
            {cannedTemplates.slice(0, 3).map((tpl, i) => (
              <button
                key={i}
                onClick={() => setMessageInput(tpl)}
                className="px-2 py-0.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 truncate max-w-xs transition-colors cursor-pointer"
              >
                {tpl}
              </button>
            ))}
          </div>

          {/* Typing Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2 shrink-0"
          >
            {/* Priority selector */}
            <select
              value={selectedPriority}
              onChange={(e: any) => setSelectedPriority(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              title="Prioridad del mensaje"
            >
              <option value="normal">⚪ Normal</option>
              <option value="urgente">🔴 Urgente</option>
              <option value="aprobacion_inmediata">⚡ Aprobación</option>
            </select>

            <button
              type="button"
              onClick={() => setIsDiscountModalOpen(true)}
              className="p-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 transition-all cursor-pointer"
              title="Solicitar Descuento de Matrícula"
            >
              <BadgePercent className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsQuoteProspectModalOpen(true)}
              className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-all cursor-pointer"
              title="Citar Prospecto de Agenda"
            >
              <FileText className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={`Escribe un mensaje a ${activeChatMeta.title}...`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <button
              type="submit"
              disabled={!messageInput.trim() && !quotedProspect}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* RIGHT DRAWER: COMMERCIAL TARGETS & AGENT PERFORMANCE */}
        {showSidePanel && (
          <div className="w-72 lg:w-80 border-l border-slate-800/80 bg-slate-900/40 p-4 overflow-y-auto space-y-4 shrink-0 hidden md:block">
            {/* Directives from Management */}
            <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/30 p-3.5 rounded-2xl">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-300 mb-2">
                <Flame className="w-4 h-4 text-pink-400" />
                <span>Metas del Mes (Arte y Estilo)</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">Nuevas Matrículas:</span>
                    <span className="font-bold text-white">5 de 25 cupos</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500 to-indigo-500 h-2 rounded-full w-[20%]"></div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">
                  🎯 Bono comercial de <strong className="text-emerald-400">$100.000 COP</strong> a partir de 5 matrículas y <strong className="text-emerald-400">$500.000 COP</strong> a partir de 15.
                </p>
              </div>
            </div>

            {/* Cupos Críticos por Programa */}
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span>Cupos Disponibles</span>
                <span className="text-emerald-400 text-[10px]">Actualizado</span>
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Peluquería Integral (Mañana)</div>
                    <div className="text-[10px] text-slate-400">Turno 8:00 a.m. - 12:00 m.</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    Confirmado
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Manicura & Polygel (Sábados)</div>
                    <div className="text-[10px] text-amber-300">¡Últimos 4 cupos!</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    Crítico
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Barbería Urbana & Fade</div>
                    <div className="text-[10px] text-slate-400">Turno Tarde</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                    8 Cupos
                  </span>
                </div>
              </div>
            </div>

            {/* Vendedoras Activas */}
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-slate-200">Vendedoras en Turno</div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
                    alt="Camila"
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-pink-500/50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">Camila Morales</div>
                    <div className="text-[10px] text-slate-400">4 Matrículas cerradas</div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                    alt="Valentina"
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-pink-500/50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">Valentina Osorio</div>
                    <div className="text-[10px] text-slate-400">1 Matrícula cerrada</div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: SOLICITAR DESCUENTO EN VIVO */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <BadgePercent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Solicitud de Descuento en Línea</h3>
                  <p className="text-xs text-slate-400">Enviará notificación inmediata a Dirección</p>
                </div>
              </div>
              <button
                onClick={() => setIsDiscountModalOpen(false)}
                className="p-1 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendDiscountRequest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre del Prospecto en Llamada / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Mariana Gómez Quintero"
                  value={discountProspectName}
                  onChange={(e) => setDiscountProspectName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Programa de Formación *
                </label>
                <select
                  value={discountProgramName}
                  onChange={(e) => {
                    setDiscountProgramName(e.target.value);
                    if (e.target.value.includes('Barbería')) setDiscountStandardFee(2100000);
                    else if (e.target.value.includes('Manicura')) setDiscountStandardFee(1900000);
                    else setDiscountStandardFee(2400000);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Técnico Laboral en Peluquería Integral & Estilismo">
                    Técnico Laboral en Peluquería Integral & Estilismo ($2.400.000)
                  </option>
                  <option value="Técnico en Barbería Profesional & Cortes Urbanos">
                    Técnico en Barbería Profesional & Cortes Urbanos ($2.100.000)
                  </option>
                  <option value="Técnico en Manicura Rusa, Polygel & Nail Art">
                    Técnico en Manicura Rusa, Polygel & Nail Art ($1.900.000)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    % de Descuento Solicitado
                  </label>
                  <select
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={5}>5% (Pronto Pago)</option>
                    <option value={10}>10% (Cierre Inmediato)</option>
                    <option value={15}>15% (Convenio Familiar)</option>
                    <option value={20}>20% (Beca Parcial)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Valor Final con Descuento
                  </label>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400">
                    ${(discountStandardFee - (discountStandardFee * discountPercent) / 100).toLocaleString('es-CO')}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Motivo / Justificación de la Asesora
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Tiene el dinero en efectivo listo y promete traer a una amiga la próxima semana..."
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDiscountModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-pink-500/30"
                >
                  Enviar Solicitud a Dirección 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CITAR PROSPECTO DE AGENDA */}
      {isQuoteProspectModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Seleccionar Prospecto de la Agenda</span>
              </h3>
              <button
                onClick={() => setIsQuoteProspectModalOpen(false)}
                className="p-1 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2">
              {(store.callCenterSchedules || []).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No hay prospectos en agenda</p>
              ) : (
                (store.callCenterSchedules || []).map((prospect) => (
                  <button
                    key={prospect.id}
                    onClick={() => {
                      setQuotedProspect(prospect);
                      setIsQuoteProspectModalOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-indigo-300">
                        {prospect.prospectName}
                      </div>
                      <div className="text-[11px] text-slate-400">{prospect.programOfInterest}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Tel: {prospect.phone} • Fecha: {prospect.scheduledDate} {prospect.scheduledTime}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SIMULACIÓN DE LLAMADA INTERNA DIRECTA */}
      {activeCallContact && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950 border border-indigo-500/40 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="relative inline-block mx-auto">
              <img
                src={activeCallContact.avatar}
                alt={activeCallContact.name}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500 shadow-2xl"
              />
              <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white animate-pulse">
                <Phone className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-white">{activeCallContact.name}</h3>
              <p className="text-xs text-indigo-300 mt-0.5">{activeCallContact.role}</p>
              <p className="text-[11px] text-slate-400 mt-2">
                Conectando línea interna de alta prioridad (Sala de Comunicaciones)...
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4 pt-2">
              <button
                onClick={() => {
                  playSuccessSound();
                  setActiveCallContact(null);
                }}
                className="w-12 h-12 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95"
                title="Colgar llamada"
              >
                <PhoneCall className="w-5 h-5 rotate-[135deg]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
