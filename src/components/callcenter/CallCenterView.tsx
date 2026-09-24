import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { appStorage } from '../../services/storage';
import {
  PhoneCall,
  Calendar as CalendarIcon,
  Users,
  Award,
  DollarSign,
  Bot,
  MessageSquare,
  Sparkles,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Send,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Percent,
  Check,
  X,
  AlertCircle,
  FileText,
  Printer,
  Copy,
  BarChart3,
  CalendarCheck2,
  HelpCircle,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import {
  CallCenterScheduleItem,
  CallCenterScheduleType,
  AgentEnrollmentRecord,
  AdminAgentMessage,
  GroupCourse,
} from '../../types';
import { CALL_CENTER_WHATSAPP_TEMPLATES } from '../../services/callCenterData';

type CallCenterSubTab =
  | 'matriculas'
  | 'mis_matriculados'
  | 'agenda'
  | 'whatsapp'
  | 'copilot_ia'
  | 'proyeccion'
  | 'comisiones'
  | 'chat_admin';

export const CallCenterView: React.FC = () => {
  const { currentUser, currentRole, store, refreshData, playSuccessSound, playMessageSound, setActiveTab } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<CallCenterSubTab>('matriculas');

  // Active agent context (if admin, can toggle agent view or see all)
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    currentUser.role === 'agent' ? currentUser.id : 'all'
  );

  // ----------------------------------------------------
  // 1. STATE FOR ENROLLMENT FORM
  // ----------------------------------------------------
  const [studentName, setStudentName] = useState('');
  const [studentDoc, setStudentDoc] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [initialPayment, setInitialPayment] = useState<number>(350000);
  const [paymentMethod, setPaymentMethod] = useState<
    'Efectivo' | 'Nequi' | 'Daviplata' | 'Transferencia Bancaria' | 'PSE' | 'Tarjeta'
  >('Nequi');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountAuthorizedBy, setDiscountAuthorizedBy] = useState('');
  const [enrollmentNotes, setEnrollmentNotes] = useState('');
  const [enrollSuccessReceipt, setEnrollSuccessReceipt] = useState<AgentEnrollmentRecord | null>(null);

  // ----------------------------------------------------
  // 2. STATE FOR SCHEDULE / AGENDA
  // ----------------------------------------------------
  const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false);
  const [scheduleProspectName, setScheduleProspectName] = useState('');
  const [schedulePhone, setSchedulePhone] = useState('');
  const [scheduleEmail, setScheduleEmail] = useState('');
  const [scheduleProgram, setScheduleProgram] = useState('Técnico Laboral en Peluquería Integral & Estilismo');
  const [scheduleShift, setScheduleShift] = useState<'Mañana' | 'Tarde' | 'Sábados'>('Mañana');
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().slice(0, 10));
  const [scheduleTime, setScheduleTime] = useState('10:00');
  const [scheduleType, setScheduleType] = useState<CallCenterScheduleType>('llamada_seguimiento');
  const [scheduleNotes, setScheduleNotes] = useState('');
  const [scheduleFilterStatus, setScheduleFilterStatus] = useState<string>('todos');

  // ----------------------------------------------------
  // 3. STATE FOR WHATSAPP EXTENSION
  // ----------------------------------------------------
  const [waSelectedContact, setWaSelectedContact] = useState<{
    name: string;
    phone: string;
    program?: string;
  } | null>(null);
  const [waCustomPhone, setWaCustomPhone] = useState('');
  const [waCustomName, setWaCustomName] = useState('');
  const [waMessageDraft, setWaMessageDraft] = useState('');
  const [waAiPrompt, setWaAiPrompt] = useState('');
  const [waAiGenerating, setWaAiGenerating] = useState(false);
  const [waCopiedNotice, setWaCopiedNotice] = useState(false);

  // ----------------------------------------------------
  // 4. STATE FOR CALL CENTER CO-PILOT IA
  // ----------------------------------------------------
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotHistory, setCopilotHistory] = useState<
    Array<{ sender: 'agent' | 'ai'; text: string; timestamp: string }>
  >([
    {
      sender: 'ai',
      text: `👋 ¡Hola ${currentUser.name}! Soy tu Co-Piloto de IA para Admisiones y Call Center de la *Academia de Belleza Arte & Estilo* ✂️✨. 

Estoy conectado a la base de datos de grupos y proyección administrativa. Puedo ayudarte con:
1. 📊 Información inmediata sobre cupos disponibles y viabilidad de apertura de grupos.
2. 💡 Argumentarios persuasivos para rebatir objeciones ("no tengo tiempo", "es muy costoso").
3. 💰 Políticas de comisiones y escalones de bonos por metas de matrícula.
4. 🎯 Técnicas de cierre rápido y recomendaciones comerciales.

¿Qué grupo o prospecto deseas consultar hoy?`,
      timestamp: 'En línea',
    },
  ]);
  const [copilotLoading, setCopilotLoading] = useState(false);

  // ----------------------------------------------------
  // 5. STATE FOR ADMIN-AGENT CHAT
  // ----------------------------------------------------
  const [adminChatMsg, setAdminChatMsg] = useState('');
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountReqProspect, setDiscountReqProspect] = useState('');
  const [discountReqProgram, setDiscountReqProgram] = useState('Técnico Laboral en Peluquería Integral');
  const [discountReqPercent, setDiscountReqPercent] = useState<number>(10);
  const [discountReqStandardFee, setDiscountReqStandardFee] = useState<number>(2400000);

  // ----------------------------------------------------
  // COMPUTED METRICS & FILTERS
  // ----------------------------------------------------
  const groups = store.groups || [];
  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  // All agent enrollments filtered
  const enrollments = useMemo(() => {
    const all = store.agentEnrollments || [];
    if (selectedAgentId === 'all') return all;
    return all.filter((e) => e.agentId === selectedAgentId);
  }, [store.agentEnrollments, selectedAgentId]);

  // Schedules filtered
  const schedules = useMemo(() => {
    let list = store.callCenterSchedules || [];
    if (selectedAgentId !== 'all') {
      list = list.filter((s) => s.agentId === selectedAgentId);
    }
    if (scheduleFilterStatus !== 'todos') {
      list = list.filter((s) => s.status === scheduleFilterStatus);
    }
    return list;
  }, [store.callCenterSchedules, selectedAgentId, scheduleFilterStatus]);

  // Current month commission summary for selected agent or logged-in agent
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const effectiveAgentId = currentUser.role === 'agent' ? currentUser.id : selectedAgentId === 'all' ? 'usr-agent-1' : selectedAgentId;
  const currentCommissionSummary = useMemo(() => {
    const all = store.agentCommissions || [];
    const found = all.find((c) => c.agentId === effectiveAgentId && c.month === currentMonth);
    if (found) return found;

    // Calculate on the fly if not yet recorded
    const agentEnrs = (store.agentEnrollments || []).filter(
      (e) => e.agentId === effectiveAgentId && e.enrollmentDate.startsWith(currentMonth)
    );
    const count = agentEnrs.length;
    const base = count * 50000;
    const bonus = count >= 15 ? 500000 : count >= 10 ? 250000 : count >= 5 ? 100000 : 0;
    return {
      agentId: effectiveAgentId,
      agentName: currentUser.name,
      month: currentMonth,
      enrollmentCount: count,
      baseCommissionTotal: base,
      bonusAmount: bonus,
      totalCommission: base + bonus,
      status: 'pendiente' as const,
    };
  }, [store.agentCommissions, store.agentEnrollments, effectiveAgentId, currentMonth, currentUser.name]);

  // Global call center statistics
  const stats = useMemo(() => {
    const allEnrollments = store.agentEnrollments || [];
    const currentMonthEnrs = allEnrollments.filter((e) => e.enrollmentDate.startsWith(currentMonth));
    const totalCollectedInitial = currentMonthEnrs.reduce((acc, curr) => acc + (curr.initialPayment || 0), 0);
    const pendingSchedules = (store.callCenterSchedules || []).filter((s) => s.status === 'pendiente').length;

    return {
      monthCount: currentMonthEnrs.length,
      monthCollected: totalCollectedInitial,
      pendingSchedules,
      totalHistoric: allEnrollments.length,
    };
  }, [store.agentEnrollments, store.callCenterSchedules, currentMonth]);

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------

  // Submit Enrollment
  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentDoc.trim() || !studentPhone.trim() || !selectedGroupId) {
      alert('Por favor completa todos los datos obligatorios del estudiante y selecciona un grupo.');
      return;
    }

    const grp = groups.find((g) => g.id === selectedGroupId);
    if (!grp) {
      alert('Grupo no encontrado.');
      return;
    }

    const totalFee = grp.monthlyFee ? grp.monthlyFee * 6 : 2400000; // estimated tuition

    const newRecord = appStorage.enrollStudentByAgent({
      studentName: studentName.trim(),
      studentDocument: studentDoc.trim(),
      studentPhone: studentPhone.trim(),
      studentEmail: studentEmail.trim() || `${studentName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      guardianName: guardianName.trim(),
      guardianPhone: guardianPhone.trim(),
      programName: grp.name,
      groupId: grp.id,
      groupName: grp.name,
      shift: grp.shift,
      totalTuitionFee: totalFee,
      initialPayment: Number(initialPayment) || 0,
      paymentMethod,
      discountAmount: Number(discountAmount) || 0,
      discountAuthorizedBy: discountAuthorizedBy.trim(),
      agentId: currentUser.role === 'agent' ? currentUser.id : 'usr-agent-1',
      agentName: currentUser.role === 'agent' ? currentUser.name : 'Camila Morales (Call Center)',
      notes: enrollmentNotes.trim(),
    });

    playSuccessSound();
    refreshData();
    setEnrollSuccessReceipt(newRecord);

    // Reset fields
    setStudentName('');
    setStudentDoc('');
    setStudentPhone('');
    setStudentEmail('');
    setGuardianName('');
    setGuardianPhone('');
    setEnrollmentNotes('');
    setDiscountAmount(0);
    setDiscountAuthorizedBy('');
  };

  // Submit Schedule Item
  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleProspectName.trim() || !schedulePhone.trim()) {
      alert('Nombre y teléfono del prospecto son requeridos.');
      return;
    }

    appStorage.createCallCenterSchedule({
      prospectName: scheduleProspectName.trim(),
      phone: schedulePhone.trim(),
      email: scheduleEmail.trim(),
      programOfInterest: scheduleProgram,
      preferredShift: scheduleShift,
      scheduledDate: scheduleDate,
      scheduledTime: scheduleTime,
      type: scheduleType,
      status: 'pendiente',
      agentId: currentUser.role === 'agent' ? currentUser.id : 'usr-agent-1',
      agentName: currentUser.role === 'agent' ? currentUser.name : 'Camila Morales',
      notes: scheduleNotes.trim(),
    });

    playSuccessSound();
    refreshData();
    setIsNewScheduleModalOpen(false);
    setScheduleProspectName('');
    setSchedulePhone('');
    setScheduleEmail('');
    setScheduleNotes('');
  };

  // Update schedule status
  const handleUpdateScheduleStatus = (id: string, newStatus: CallCenterScheduleItem['status']) => {
    appStorage.updateCallCenterSchedule(id, { status: newStatus });
    refreshData();
  };

  // Send WhatsApp Direct Web Link
  const handleOpenWhatsApp = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // AI Generated WhatsApp Reply
  const handleGenerateAiWaReply = async () => {
    if (!waAiPrompt.trim()) return;
    setWaAiGenerating(true);
    try {
      const res = await fetch('/api/ai/whatsapp-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: waAiPrompt,
          contactName: waSelectedContact?.name || waCustomName || 'Aspirante',
          contactType: 'aspirante',
          context: `Interés en: ${waSelectedContact?.program || 'Cursos de Belleza'}. Academia: Arte & Estilo.`,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setWaMessageDraft(data.reply);
        playMessageSound();
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setWaMessageDraft(
        `¡Hola ${waSelectedContact?.name || waCustomName || ''}! ✨ Con mucho gusto te brindamos la información sobre la Academia de Belleza Arte & Estilo ✂️. Contamos con turnos de Mañana, Tarde y Sábados con prácticas 100% reales en nuestro Salón Escuela. ¿Te gustaría agendar una visita presencial para conocer las instalaciones?`
      );
    } finally {
      setWaAiGenerating(false);
    }
  };

  // AI Co-Pilot Query
  const handleSendCopilotQuery = async (queryText?: string) => {
    const q = queryText || copilotQuery;
    if (!q.trim() || copilotLoading) return;

    const newHistory = [
      ...copilotHistory,
      {
        sender: 'agent' as const,
        text: q,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setCopilotHistory(newHistory);
    setCopilotQuery('');
    setCopilotLoading(true);

    try {
      const groupsSummary = groups.map((g) => ({
        name: g.name,
        shift: g.shift,
        enrolled: g.enrolledStudentIds?.length || 0,
        maxCapacity: g.maxCapacity,
        status: g.status,
      }));

      const res = await fetch('/api/ai/call-center-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          agentName: currentUser.name,
          currentGroupsInfo: groupsSummary,
        }),
      });
      const data = await res.json();

      setCopilotHistory([
        ...newHistory,
        {
          sender: 'ai',
          text:
            data.reply ||
            'Información analizada. Te recomendamos priorizar los grupos de la tarde para alcanzar el punto de equilibrio financiero.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      playMessageSound();
    } catch (err) {
      console.error(err);
      setCopilotHistory([
        ...newHistory,
        {
          sender: 'ai',
          text:
            '📊 Grupos prioritarios: Recuerda que el grupo de Peluquería Mañana ya tiene cupos confirmados (>70%). Enfoca los esfuerzos de cierre en Barbería Sábados y Peluquería Tarde para optimizar las comisiones del mes.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setCopilotLoading(false);
    }
  };

  // Send message to Admin
  const handleSendAdminMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatMsg.trim()) return;

    appStorage.sendAdminAgentMessage({
      agentId: currentUser.role === 'agent' ? currentUser.id : 'usr-agent-1',
      agentName: currentUser.role === 'agent' ? currentUser.name : 'Camila Morales',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role === 'admin' ? 'admin' : 'agent',
      message: adminChatMsg.trim(),
      type: 'text',
    });

    playMessageSound();
    refreshData();
    setAdminChatMsg('');
  };

  // Send Discount Request to Admin
  const handleSendDiscountRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountReqProspect.trim()) {
      alert('Ingresa el nombre del prospecto.');
      return;
    }

    const discountValue = Math.round(discountReqStandardFee * (discountReqPercent / 100));
    const discounted = discountReqStandardFee - discountValue;

    appStorage.sendAdminAgentMessage({
      agentId: currentUser.role === 'agent' ? currentUser.id : 'usr-agent-1',
      agentName: currentUser.role === 'agent' ? currentUser.name : 'Camila Morales',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'agent',
      message: `Solicito autorización de descuento del ${discountReqPercent}% ($${discountValue.toLocaleString('es-CO')}) para el prospecto ${discountReqProspect} en ${discountReqProgram}. Valor final con descuento: $${discounted.toLocaleString('es-CO')}. ¿Autorizan el cierre?`,
      type: 'discount_request',
      discountRequestData: {
        prospectName: discountReqProspect.trim(),
        programName: discountReqProgram,
        standardFee: discountReqStandardFee,
        discountPercent: discountReqPercent,
        discountedFee: discounted,
        status: 'pendiente',
      },
    });

    playMessageSound();
    refreshData();
    setIsDiscountModalOpen(false);
    setDiscountReqProspect('');
  };

  // Admin approves/rejects discount
  const handleAdminDecisionDiscount = (messageId: string, decision: 'aprobado' | 'rechazado') => {
    appStorage.approveOrRejectDiscount(messageId, decision, currentUser.name);
    playSuccessSound();
    refreshData();
  };

  // Admin liquidates commission
  const handleLiquidateCommission = (agentId: string, month: string) => {
    const success = appStorage.liquidateAgentCommission(agentId, month, currentUser.name);
    if (success) {
      playSuccessSound();
      refreshData();
      alert('¡Comisiones liquidadas con éxito y registradas en el libro contable de egresos!');
    }
  };

  // Pre-load prospect from schedule into Enrollment Tab
  const handlePreloadEnrollmentFromSchedule = (s: CallCenterScheduleItem) => {
    setStudentName(s.prospectName);
    setStudentPhone(s.phone);
    setStudentEmail(s.email || '');
    // Match group by program name substring
    const matchedGroup = groups.find((g) =>
      g.name.toLowerCase().includes(s.programOfInterest.toLowerCase().slice(0, 8))
    );
    if (matchedGroup) {
      setSelectedGroupId(matchedGroup.id);
    }
    setActiveSubTab('matriculas');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Call Center Hub Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d1f40] to-slate-900 border border-sky-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-10 w-56 h-56 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -top-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl text-white shadow-lg shadow-sky-500/30">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  Call Center & Admisiones
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    En Vivo
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  Academia de Belleza Arte & Estilo • Matrículas, Agendas, WhatsApp y Comisiones
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-sky-500/20">
            <div className="px-3 py-1.5 border-r border-slate-700/60 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Matrículas del Mes
              </span>
              <span className="text-lg font-black text-sky-400">
                {stats.monthCount} Chicos
              </span>
            </div>

            <div className="px-3 py-1.5 border-r border-slate-700/60 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Recaudo Inicial
              </span>
              <span className="text-lg font-black text-emerald-400">
                ${stats.monthCollected.toLocaleString('es-CO')}
              </span>
            </div>

            <div className="px-3 py-1.5 text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Citas Pendientes
              </span>
              <span className="text-lg font-black text-amber-400">
                {stats.pendingSchedules}
              </span>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => setActiveSubTab('matriculas')}
              className="ml-auto px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-500/25 flex items-center space-x-1.5 transition-all transform hover:scale-105 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Matricular Chico</span>
            </button>
          </div>
        </div>

        {/* Admin Filter Bar (When logged in as Admin, can switch view between all agents or specific agent) */}
        {currentRole === 'admin' && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span className="text-slate-300 font-semibold">Vista Administrativa:</span>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="bg-slate-800 text-white border border-slate-700 rounded-lg px-2.5 py-1 font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              >
                <option value="all">Todas las Asesoras (Visión Global)</option>
                <option value="usr-agent-1">Camila Morales (Líder Call Center)</option>
                <option value="usr-agent-2">Valentina Osorio (Telemercadeo)</option>
              </select>
            </div>
            <div className="text-slate-400">
              Comisión estándar: <strong className="text-white">$50.000 COP</strong> por cada matrícula formalizada
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs - Modern & Highly Interactive */}
      <div className="flex items-center overflow-x-auto pb-1 gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveSubTab('matriculas')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'matriculas'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Matricular Chicos</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mis_matriculados')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'mis_matriculados'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Chicos Matriculados ({enrollments.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('agenda')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'agenda'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Calendario & Agendas</span>
          {stats.pendingSchedules > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
              {stats.pendingSchedules}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('whatsapp')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <span>Extensión WhatsApp</span>
        </button>

        <button
          onClick={() => setActiveSubTab('copilot_ia')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'copilot_ia'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-400" />
          <span>IA Co-Pilot</span>
        </button>

        <button
          onClick={() => setActiveSubTab('proyeccion')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'proyeccion'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Proyección Administrativa</span>
        </button>

        <button
          onClick={() => setActiveSubTab('comisiones')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'comisiones'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Control de Comisiones</span>
        </button>

        <button
          onClick={() => setActiveSubTab('chat_admin')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'chat_admin'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Chat con Admin</span>
        </button>

        <button
          onClick={() => setActiveTab('chatCenter')}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white shadow-md shadow-pink-500/20 transition-all cursor-pointer ml-auto"
        >
          <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
          <span>Abrir Chat Center Hub 💬</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. TAB: FORMULARIO DE MATRÍCULA ÁGIL                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'matriculas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-400" />
                  Formalización de Matrícula
                </h2>
                <p className="text-xs text-slate-400">
                  Registra los datos del estudiante, asigna grupo y acredita el pago inicial. Genera automáticamente recibo oficial y comisión.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/30">
                Paso Único Ágil
              </span>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-5">
              {/* Student Identity */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  1. Información Personal del Estudiante
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nombre Completo <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Natalia Andrea Gómez"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Documento de Identidad (CC / TI) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: CC 1.025.889.774"
                      value={studentDoc}
                      onChange={(e) => setStudentDoc(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Teléfono Móvil / WhatsApp <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: +57 312 456 7890"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      placeholder="Ej: natalia.estilista@gmail.com"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Acudiente / Contacto de Emergencia
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Gloria Gómez (Madre)"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Teléfono del Acudiente
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: +57 310 998 1122"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Group Selection */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  2. Asignación de Programa & Grupo
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Selecciona el Grupo Activo <span className="text-rose-400">*</span>
                  </label>
                  <select
                    required
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none font-semibold"
                  >
                    <option value="">-- Elige un grupo de la academia --</option>
                    {groups.map((g) => {
                      const enrolledCount = g.enrolledStudentIds?.length || 0;
                      const available = g.maxCapacity - enrolledCount;
                      return (
                        <option key={g.id} value={g.id}>
                          {g.name} | Jornada: {g.shift} | {available} cupos libres de {g.maxCapacity}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {selectedGroupId && selectedGroup && (
                  <div className="p-3 bg-sky-950/40 border border-sky-500/30 rounded-xl text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-sky-200">
                      <span className="font-bold">{selectedGroup.name}</span>
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-black">
                        {selectedGroup.shift}
                      </span>
                    </div>
                    <p className="text-slate-400">{selectedGroup.room || 'Salón Escuela de Belleza Principal'}</p>
                    <div className="flex items-center gap-4 pt-1 text-slate-300">
                      <span>Docente: <strong className="text-white">{selectedGroup.teacherName || 'Docente Asignado'}</strong></span>
                      <span>Ocupación: <strong className="text-sky-300">{selectedGroup.enrolledStudentIds?.length || 0} / {selectedGroup.maxCapacity}</strong></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment & Commissions */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  3. Pago Inicial, Descuento & Comisión
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Abono Inicial de Matrícula ($ COP) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={50000}
                      value={initialPayment}
                      onChange={(e) => setInitialPayment(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm font-bold text-emerald-400 focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Medio de Pago
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    >
                      <option value="Nequi">Nequi</option>
                      <option value="Daviplata">Daviplata</option>
                      <option value="Efectivo">Efectivo en Caja</option>
                      <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                      <option value="PSE">Pasarela PSE</option>
                      <option value="Tarjeta">Tarjeta Débito / Crédito</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Descuento Especial ($ COP)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                {discountAmount > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      Autorizado por (Dirección / Rectoría)
                    </label>
                    <input
                      type="text"
                      value={discountAuthorizedBy}
                      onChange={(e) => setDiscountAuthorizedBy(e.target.value)}
                      placeholder="Ej: Lic. Carlos Mendoza (Director General)"
                      className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3.5 py-2 text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Observaciones / Acuerdos de Pago
                  </label>
                  <textarea
                    rows={2}
                    value={enrollmentNotes}
                    onChange={(e) => setEnrollmentNotes(e.target.value)}
                    placeholder="Ej: El estudiante cancelará el saldo en 4 cuotas quincenales de $450.000. Recibió kit inicial de tijeras."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              {/* Commission Alert Notice */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Award className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-white block">
                      Comisión generada por esta matrícula: <strong className="text-amber-300">+$50.000 COP</strong>
                    </span>
                    <span className="text-slate-400">
                      Asesora: {currentUser.name} • Se abona inmediatamente a tu acumulado mensual.
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01] cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Formalizar Matrícula & Generar Comprobante</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar: Guidelines & Quick Tools */}
          <div className="space-y-6">
            {/* Quick Pitch Guide */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Guía Rápida para el Asesor
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <strong className="text-sky-300 block mb-1">1. Requisitos para el estudiante</strong>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                    <li>Fotocopia de documento de identidad</li>
                    <li>1 foto 3x4 fondo blanco</li>
                    <li>Abono de matrícula desde $300.000 COP</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <strong className="text-emerald-300 block mb-1">2. Beneficios de Arte & Estilo</strong>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                    <li>Prácticas 100% reales en Salón Escuela</li>
                    <li>Doble certificación técnica laboral</li>
                    <li>Docentes galardonados a nivel nacional</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <strong className="text-purple-300 block mb-1">3. ¿Necesitas descuento especial?</strong>
                  <p className="text-slate-400 mb-2">
                    Si el prospecto paga hoy de contado, puedes pedir autorización a la Dirección en 1 minuto.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSubTab('chat_admin');
                      setIsDiscountModalOpen(true);
                    }}
                    className="w-full py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Solicitar Descuento al Admin
                  </button>
                </div>
              </div>
            </div>

            {/* Scale of bonuses */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Escala de Bonos Comerciales
              </h3>
              <p className="text-xs text-slate-400">
                Alcanza la meta de matrículas este mes para desbloquear bonificaciones adicionales:
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-semibold text-slate-300">5 a 9 Matrículas:</span>
                  <span className="font-bold text-amber-400">+$100.000 COP</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-semibold text-slate-300">10 a 14 Matrículas:</span>
                  <span className="font-bold text-emerald-400">+$250.000 COP</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-semibold text-slate-300">15+ Matrículas:</span>
                  <span className="font-bold text-purple-400">+$500.000 COP (Oro)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: CHICOS MATRICULADOS                                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'mis_matriculados' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-400" />
                Estudiantes Matriculados por Call Center
              </h2>
              <p className="text-xs text-slate-400">
                Historial de admisiones formalizadas con número de recibo, cuota inicial y comisiones devengadas.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-slate-800 text-sky-400 font-extrabold text-xs">
              {enrollments.length} Registros
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enr) => (
              <div
                key={enr.id}
                className="bg-slate-900 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-4 shadow-lg space-y-3 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-white text-sm">{enr.studentName}</h3>
                    <p className="text-xs text-slate-400">{enr.studentDocument}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {enr.voucherNumber}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                  <div className="text-slate-300 font-medium truncate">{enr.programName}</div>
                  <div className="text-slate-400 text-[11px]">{enr.shift}</div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">Abono Inicial:</span>
                    <strong className="text-emerald-400">${enr.initialPayment.toLocaleString('es-CO')} ({enr.paymentMethod})</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400 text-[11px]">
                    Fecha: {enr.enrollmentDate} • {enr.agentName.split(' ')[0]}
                  </span>
                  <span className="font-extrabold text-amber-400">
                    +${enr.commissionEarned.toLocaleString('es-CO')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                  <button
                    onClick={() => setEnrollSuccessReceipt(enr)}
                    className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>Ver Recibo</span>
                  </button>

                  <button
                    onClick={() =>
                      handleOpenWhatsApp(
                        enr.studentPhone,
                        `¡Hola ${enr.studentName}! 🎉 Oficialmente eres parte de la familia Arte & Estilo. Tu matrícula en el programa ${enr.programName} (${enr.shift}) está formalizada con éxito con el comprobante ${enr.voucherNumber}. ¡Bienvenida!`
                      )
                    }
                    className="py-1.5 px-2 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: CALENDARIO & AGENDAS                                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'agenda' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-sky-400" />
                Agenda & Calendario de Admisiones
              </h2>
              <p className="text-xs text-slate-400">
                Control de llamadas de seguimiento, visitas presenciales a las instalaciones y citas de matrícula.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={scheduleFilterStatus}
                onChange={(e) => setScheduleFilterStatus(e.target.value)}
                className="bg-slate-800 text-white border border-slate-700 text-xs font-bold rounded-xl px-3 py-2 outline-none"
              >
                <option value="todos">Todos los Estados</option>
                <option value="pendiente">Solo Pendientes</option>
                <option value="realizada">Realizadas</option>
                <option value="matriculado">Matriculados</option>
              </select>

              <button
                onClick={() => setIsNewScheduleModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nueva Cita</span>
              </button>
            </div>
          </div>

          {/* Agenda Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((item) => {
              const isPast = new Date(`${item.scheduledDate}T${item.scheduledTime}`) < new Date();
              return (
                <div
                  key={item.id}
                  className={`bg-slate-900 border rounded-2xl p-4 shadow-lg space-y-3 transition-all ${
                    item.status === 'pendiente'
                      ? 'border-sky-500/40 hover:border-sky-400'
                      : item.status === 'matriculado'
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : 'border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-white text-sm">{item.prospectName}</h3>
                      <p className="text-xs text-slate-400">{item.phone}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.status === 'pendiente'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : item.status === 'matriculado'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-sky-300 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {item.scheduledDate} a las {item.scheduledTime}
                      </span>
                    </div>
                    <div className="text-slate-300 truncate">
                      <strong>Programa:</strong> {item.programOfInterest}
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      <strong>Tipo:</strong>{' '}
                      {item.type === 'visita_sede'
                        ? '🏫 Recorrido Sede'
                        : item.type === 'cierre_matricula'
                        ? '✍️ Cierre de Matrícula'
                        : '📞 Llamada de Seguimiento'}
                    </div>
                    {item.notes && (
                      <p className="text-slate-400 text-[11px] italic pt-1 border-t border-slate-800">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {item.status === 'pendiente' && (
                      <>
                        <button
                          onClick={() => handlePreloadEnrollmentFromSchedule(item)}
                          title="Pasar a matrícula inmediata"
                          className="flex-1 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Matricular</span>
                        </button>

                        <button
                          onClick={() => handleUpdateScheduleStatus(item.id, 'realizada')}
                          title="Marcar cita realizada"
                          className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() =>
                        handleOpenWhatsApp(
                          item.phone,
                          `¡Hola ${item.prospectName}! 👋 Te recordamos tu cita en la Academia de Belleza Arte & Estilo programada para el ${item.scheduledDate} a las ${item.scheduledTime}. ¡Te estaremos esperando con mucho gusto!`
                        )
                      }
                      title="Enviar recordatorio por WhatsApp"
                      className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB: EXTENSIÓN DE WHATSAPP INTEGRADA                                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Contact Picker & Direct Phone Input */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Destinatario de WhatsApp
              </h3>
              <span className="text-[11px] font-bold text-emerald-400">Extensión Web</span>
            </div>

            {/* Direct Number Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Número de Celular (con prefijo o directo)
              </label>
              <input
                type="text"
                placeholder="Ej: +57 312 456 7890 o 3124567890"
                value={waCustomPhone}
                onChange={(e) => {
                  setWaCustomPhone(e.target.value);
                  setWaSelectedContact(null);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />

              <label className="block text-xs font-bold text-slate-300 pt-1">
                Nombre del Prospecto
              </label>
              <input
                type="text"
                placeholder="Ej: Laura Sofía"
                value={waCustomName}
                onChange={(e) => setWaCustomName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Quick Select from Agenda */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                O Selecciona de la Agenda / Matriculados:
              </label>
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                {(store.callCenterSchedules || []).slice(0, 8).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setWaSelectedContact({ name: s.prospectName, phone: s.phone, program: s.programOfInterest });
                      setWaCustomPhone(s.phone);
                      setWaCustomName(s.prospectName);
                    }}
                    className={`p-2 rounded-xl text-xs cursor-pointer transition-colors border ${
                      waCustomPhone === s.phone
                        ? 'bg-emerald-950/40 border-emerald-500 text-white font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{s.prospectName}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{s.phone}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">{s.programOfInterest}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center & Right: Message Composer + Official Templates + AI Generator */}
          <div className="lg:col-span-2 space-y-4">
            {/* Quick Templates Buttons */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Plantillas Rápidas Oficiales de Arte & Estilo
                </h3>
                <span className="text-xs text-slate-400">Clic para cargar mensaje</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CALL_CENTER_WHATSAPP_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      const name = waCustomName || waSelectedContact?.name || '[Nombre]';
                      const agent = currentUser.name.split(' ')[0];
                      const replaced = tpl.text
                        .replace(/\[Nombre\]/g, name)
                        .replace(/\[Agente\]/g, agent)
                        .replace(/\[Programa\]/g, 'Peluquería Integral / Barbería')
                        .replace(/\[Meses\]/g, '12')
                        .replace(/\[Grupo\]/g, 'Grupo Mañana')
                        .replace(/\[Horario\]/g, '8:00 a.m. a 12:00 m.')
                        .replace(/\[Día\]/g, 'este Miércoles')
                        .replace(/\[Hora\]/g, '10:00 a.m.')
                        .replace(/\[ValorAbono\]/g, '350.000');
                      setWaMessageDraft(replaced);
                    }}
                    className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[10px] font-extrabold text-emerald-400 block uppercase tracking-wider mb-0.5">
                      {tpl.category}
                    </span>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1">
                      {tpl.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Generator Mini-bar */}
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-4 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-purple-300 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-purple-400" />
                  Generar Mensaje con IA para WhatsApp
                </span>
                <span className="text-[10px] text-slate-400">Modelo Gemini 3.8</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: Pregunta si el curso de barbería incluye máquina y si puede pagar los sábados..."
                  value={waAiPrompt}
                  onChange={(e) => setWaAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateAiWaReply()}
                  className="flex-1 bg-slate-950 border border-purple-500/30 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={handleGenerateAiWaReply}
                  disabled={waAiGenerating || !waAiPrompt.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer"
                >
                  {waAiGenerating ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
                  <span>{waAiGenerating ? 'Redactando...' : 'Generar'}</span>
                </button>
              </div>
            </div>

            {/* Message Draft Box & Send to WhatsApp Web */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                  Mensaje a Enviar por WhatsApp:
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(waMessageDraft);
                      setWaCopiedNotice(true);
                      setTimeout(() => setWaCopiedNotice(false), 2000);
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{waCopiedNotice ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={5}
                value={waMessageDraft}
                onChange={(e) => setWaMessageDraft(e.target.value)}
                placeholder="Escribe aquí el mensaje o selecciona una plantilla de arriba..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-xs text-slate-400">
                  Destinatario: <strong className="text-emerald-400">{waCustomPhone || 'Ingresa un número'}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp(waCustomPhone, waMessageDraft)}
                  disabled={!waCustomPhone || !waMessageDraft.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Abrir en WhatsApp Web</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: IA CO-PILOT PARA CALL CENTER                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'copilot_ia' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Quick Prompts */}
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              Consultas Rápidas a la IA
            </h3>
            <p className="text-xs text-slate-400">
              Respuestas instantáneas con base en los datos de la academia:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSendCopilotQuery('¿Qué grupos inician clases próximamente y cuántos cupos quedan disponibles?')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-200 transition-all cursor-pointer"
              >
                📊 Cupos y Grupos Próximos
              </button>

              <button
                type="button"
                onClick={() => handleSendCopilotQuery('¿Cómo respondo a un prospecto que dice que no tiene todo el dinero para la matrícula?')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-200 transition-all cursor-pointer"
              >
                💡 Objeción: "No tengo el dinero"
              </button>

              <button
                type="button"
                onClick={() => handleSendCopilotQuery('¿Cómo convenzo a alguien que solo dispone de tiempo los sábados?')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-200 transition-all cursor-pointer"
              >
                📅 Cierre para Horario Sábados
              </button>

              <button
                type="button"
                onClick={() => handleSendCopilotQuery('¿Cuáles son los pasos para solicitar un descuento a la Dirección si el cliente paga hoy?')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-xs text-slate-200 transition-all cursor-pointer"
              >
                🏷️ Protocolo de Descuentos
              </button>
            </div>
          </div>

          {/* Right: Live Interactive Chat with AI */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="font-extrabold text-white text-sm">
                  Co-Piloto Inteligente de Admisiones (Gemini 3.8 Flash)
                </h3>
              </div>
              <span className="text-xs text-slate-400">Asesora: {currentUser.name}</span>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {copilotHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex ${item.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      item.sender === 'agent'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 shadow'
                    }`}
                  >
                    <div className="whitespace-pre-line">{item.text}</div>
                    <span className="block text-[10px] text-right mt-1 opacity-70">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              {copilotLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-purple-300 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
                    <span>Analizando grupos y redactando la mejor recomendación...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="pt-3 border-t border-slate-800 mt-2 flex gap-2">
              <input
                type="text"
                placeholder="Pregunta sobre proyección, viabilidad de grupos o consejos de venta..."
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCopilotQuery()}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => handleSendCopilotQuery()}
                disabled={copilotLoading || !copilotQuery.trim()}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB: PROYECCIÓN ADMINISTRATIVA DE GRUPOS                               */}
      {/* ========================================================================= */}
      {activeSubTab === 'proyeccion' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sky-400" />
                Proyección Administrativa & Viabilidad de Grupos
              </h2>
              <p className="text-xs text-slate-400">
                Monitorea el cupo máximo vs matriculados reales (0% a 100%), viabilidad de apertura e ingresos proyectados.
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Apertura Confirmada (≥70%)
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> En Campaña Activa (40-69%)
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> En Riesgo (&lt;40%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((grp) => {
              const enrolledCount = grp.enrolledStudentIds?.length || 0;
              const maxCap = grp.maxCapacity || 20;
              const percent = Math.min(100, Math.round((enrolledCount / maxCap) * 100));
              const available = Math.max(0, maxCap - enrolledCount);

              // Status color
              let badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
              let barColor = 'from-rose-500 to-amber-500';
              let statusLabel = 'En Campaña Crítica';

              if (percent >= 70) {
                badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                barColor = 'from-emerald-500 to-teal-400';
                statusLabel = percent === 100 ? 'Cupo Completo / Agotado' : 'Apertura 100% Confirmada';
              } else if (percent >= 40) {
                badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                barColor = 'from-amber-500 to-yellow-400';
                statusLabel = 'Punto de Equilibrio Alcanzado';
              }

              const projectedTotal = (grp.monthlyFee || 250000) * 6 * maxCap;
              const currentCollected = (grp.monthlyFee || 250000) * 6 * enrolledCount;

              return (
                <div
                  key={grp.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-sky-500/40 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-white text-sm">{grp.name}</h3>
                      <p className="text-xs text-slate-400">{grp.shift} • {grp.room || 'Salón Principal'}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${badgeColor}`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Progress Bar 0 to 100% */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Llenado de Cupos:</span>
                      <strong className="text-white font-extrabold">{percent}% ({enrolledCount}/{maxCap})</strong>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full bg-gradient-to-r ${barColor} transition-all duration-700`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Restan: <strong className="text-sky-300">{available} cupos</strong></span>
                      <span>Docente: {grp.teacherName || 'Por Asignar'}</span>
                    </div>
                  </div>

                  {/* Financial Projection */}
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Ingreso Proyectado:</span>
                      <strong className="text-white">${projectedTotal.toLocaleString('es-CO')}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Recaudo Base Actual:</span>
                      <strong className="text-emerald-400">${currentCollected.toLocaleString('es-CO')}</strong>
                    </div>
                  </div>

                  {/* Quick Action: Open WhatsApp with this group offer */}
                  <button
                    onClick={() => {
                      setActiveSubTab('matriculas');
                      setSelectedGroupId(grp.id);
                    }}
                    className="w-full py-2 bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Matricular en este Grupo</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB: CONTROL DE COMISIONES                                            */}
      {/* ========================================================================= */}
      {activeSubTab === 'comisiones' && (
        <div className="space-y-6">
          {/* Big Commission Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    Control de Comisiones Call Center • Mes: {currentMonth}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white">
                  ${currentCommissionSummary.totalCommission.toLocaleString('es-CO')}{' '}
                  <span className="text-xs font-bold text-amber-400/80">COP Ganados</span>
                </h2>
                <p className="text-xs text-slate-300">
                  Asesora: <strong className="text-white">{currentCommissionSummary.agentName}</strong> • {currentCommissionSummary.enrollmentCount} estudiantes matriculados este mes
                </p>
              </div>

              {/* Commission Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Comisión Base ($50k/c/u)</span>
                  <span className="text-lg font-black text-white">
                    ${currentCommissionSummary.baseCommissionTotal.toLocaleString('es-CO')}
                  </span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Bono por Meta</span>
                  <span className="text-lg font-black text-amber-400">
                    +${currentCommissionSummary.bonusAmount.toLocaleString('es-CO')}
                  </span>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-left col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Estado de Pago</span>
                  <span
                    className={`text-xs font-black uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${
                      currentCommissionSummary.status === 'liquidada_pagada'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {currentCommissionSummary.status === 'liquidada_pagada' ? 'Liquidada' : 'Pendiente'}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Action to Liquidate */}
            {currentRole === 'admin' && currentCommissionSummary.status !== 'liquidada_pagada' && (
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Como administrador, puedes liquidar las comisiones de la asesora para autorizar el giro y asentar el egreso contable.
                </div>
                <button
                  onClick={() => handleLiquidateCommission(effectiveAgentId, currentMonth)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Aprobar & Liquidar Comisiones del Mes
                </button>
              </div>
            )}
          </div>

          {/* Detailed Enrollments for this Agent */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-extrabold text-white text-sm">
              Desglose de Matrículas que Aportan a la Comisión
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Estudiante</th>
                    <th className="py-2.5 px-3">Programa / Grupo</th>
                    <th className="py-2.5 px-3">Fecha</th>
                    <th className="py-2.5 px-3">Abono Inicial</th>
                    <th className="py-2.5 px-3">Comisión</th>
                    <th className="py-2.5 px-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {enrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-white">{enr.studentName}</td>
                      <td className="py-2.5 px-3 text-slate-300">{enr.programName}</td>
                      <td className="py-2.5 px-3 text-slate-400">{enr.enrollmentDate}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-400">
                        ${enr.initialPayment.toLocaleString('es-CO')}
                      </td>
                      <td className="py-2.5 px-3 font-extrabold text-amber-400">
                        +${enr.commissionEarned.toLocaleString('es-CO')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                          {enr.commissionStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. TAB: CHAT DIRECTO CON LA PARTE ADMINISTRATIVA                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'chat_admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Action Box: Request Discount */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Percent className="w-4 h-4 text-purple-400" />
              Solicitar Autorización
            </h3>
            <p className="text-xs text-slate-400">
              ¿Tienes un prospecto listo para cerrar pero pide descuento o condición especial? Envíale la solicitud directa a Dirección en tiempo real:
            </p>

            <button
              type="button"
              onClick={() => setIsDiscountModalOpen(true)}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <Percent className="w-4 h-4" />
              <span>+ Solicitar Descuento Especial</span>
            </button>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
              <strong className="text-slate-300 block font-semibold">Reglas de Descuento:</strong>
              <p>• Máximo 10% para pago de contado completo.</p>
              <p>• Requiere aprobación de Rectoría o Directora Académica.</p>
            </div>
          </div>

          {/* Right: Direct Chat Stream */}
          <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-extrabold text-white text-sm">
                    Canal Directo Call Center ↔ Dirección General
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Canal seguro para autorizaciones, excepciones de horario y consultas de cupos
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                Oficial
              </span>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
              {(store.adminAgentMessages || []).map((msg) => {
                const isFromMe = msg.senderId === currentUser.id;
                const isDiscountReq = msg.type === 'discount_request';
                const isDiscountApproved = msg.type === 'discount_approved';
                const isDiscountRejected = msg.type === 'discount_rejected';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isFromMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-slate-300">{msg.senderName}</span>
                      <span>({msg.senderRole === 'admin' ? 'Dirección' : 'Call Center'})</span>
                      <span>• {msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                        isDiscountReq
                          ? 'bg-purple-950/60 border border-purple-500/50 text-purple-100'
                          : isDiscountApproved
                          ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-100'
                          : isDiscountRejected
                          ? 'bg-rose-950/60 border border-rose-500/50 text-rose-100'
                          : isFromMe
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-950 border border-slate-800 text-slate-200'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.message}</p>

                      {/* If this is a discount request and viewer is Admin, show Approve/Reject buttons */}
                      {isDiscountReq && msg.discountRequestData && currentRole === 'admin' && msg.discountRequestData.status === 'pendiente' && (
                        <div className="mt-3 pt-2.5 border-t border-purple-500/30 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAdminDecisionDiscount(msg.id, 'aprobado')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center space-x-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Aprobar Descuento</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleAdminDecisionDiscount(msg.id, 'rechazado')}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg flex items-center space-x-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Rechazar</span>
                          </button>
                        </div>
                      )}

                      {msg.discountRequestData?.status && msg.discountRequestData.status !== 'pendiente' && (
                        <div className="mt-2 text-[11px] font-bold text-right opacity-80">
                          Decisión: {msg.discountRequestData.status.toUpperCase()} por {msg.discountRequestData.authorizedBy || 'Administración'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Send Box */}
            <form onSubmit={handleSendAdminMessage} className="pt-3 border-t border-slate-800 mt-2 flex gap-2">
              <input
                type="text"
                placeholder="Escribe tu mensaje a la Dirección..."
                value={adminChatMsg}
                onChange={(e) => setAdminChatMsg(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!adminChatMsg.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NUEVA CITA EN LA AGENDA                                            */}
      {/* ========================================================================= */}
      {isNewScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-sky-400" />
                Agendar Cita / Prospecto
              </h3>
              <button
                onClick={() => setIsNewScheduleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nombre del Prospecto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Juliana Méndez"
                  value={scheduleProspectName}
                  onChange={(e) => setScheduleProspectName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+57 311 456 7890"
                    value={schedulePhone}
                    onChange={(e) => setSchedulePhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Correo (Opcional)</label>
                  <input
                    type="email"
                    placeholder="prospecto@gmail.com"
                    value={scheduleEmail}
                    onChange={(e) => setScheduleEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tipo de Actividad</label>
                  <select
                    value={scheduleType}
                    onChange={(e) => setScheduleType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option value="llamada_seguimiento">📞 Llamada de Seguimiento</option>
                    <option value="visita_sede">🏫 Visita al Salón Escuela</option>
                    <option value="cierre_matricula">✍️ Cierre de Matrícula</option>
                    <option value="recordatorio_pago">💳 Recordatorio de Cuota</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Jornada Preferida</label>
                  <select
                    value={scheduleShift}
                    onChange={(e) => setScheduleShift(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  >
                    <option value="Mañana">Mañana (8am - 12m)</option>
                    <option value="Tarde">Tarde (2pm - 6pm)</option>
                    <option value="Sábados">Sábados (8am - 2pm)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Fecha Programada</label>
                  <input
                    type="date"
                    required
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Hora Programada</label>
                  <input
                    type="time"
                    required
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Programa de Interés</label>
                <select
                  value={scheduleProgram}
                  onChange={(e) => setScheduleProgram(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value="Técnico Laboral en Peluquería Integral & Estilismo">
                    Técnico Laboral en Peluquería Integral & Estilismo
                  </option>
                  <option value="Técnico en Barbería Profesional & Fade">
                    Técnico en Barbería Profesional & Fade
                  </option>
                  <option value="Técnico en Manicura Rusa, Polygel & Nail Art">
                    Técnico en Manicura Rusa, Polygel & Nail Art
                  </option>
                  <option value="Colorimetría Avanzada & Balayage Masterclass">
                    Colorimetría Avanzada & Balayage Masterclass
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Notas / Interés Particular</label>
                <textarea
                  rows={2}
                  value={scheduleNotes}
                  onChange={(e) => setScheduleNotes(e.target.value)}
                  placeholder="Ej: Interesada en aprender balayage. Viene con su hermana el sábado..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Guardar en Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SOLICITAR DESCUENTO A ADMINISTRACIÓN                               */}
      {/* ========================================================================= */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Percent className="w-5 h-5 text-purple-400" />
                Solicitud de Descuento Comercial
              </h3>
              <button
                onClick={() => setIsDiscountModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendDiscountRequest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nombre del Prospecto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Camilo Andrés Vargas"
                  value={discountReqProspect}
                  onChange={(e) => setDiscountReqProspect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Programa</label>
                <select
                  value={discountReqProgram}
                  onChange={(e) => setDiscountReqProgram(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none"
                >
                  <option value="Técnico Laboral en Peluquería Integral">Peluquería Integral ($2.400.000)</option>
                  <option value="Técnico en Barbería Profesional & Fade">Barbería Profesional & Fade ($2.100.000)</option>
                  <option value="Técnico en Manicura & Polygel">Manicura Rusa & Polygel ($1.900.000)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">% Descuento</label>
                  <select
                    value={discountReqPercent}
                    onChange={(e) => setDiscountReqPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none font-bold text-purple-400"
                  >
                    <option value={5}>5% de Descuento</option>
                    <option value={10}>10% de Descuento</option>
                    <option value={15}>15% (Especial)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Valor Final Estimado</label>
                  <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-extrabold text-xs">
                    ${(discountReqStandardFee * (1 - discountReqPercent / 100)).toLocaleString('es-CO')}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200">
                La solicitud se publicará en el Chat Directo con el botón para que el Administrador la apruebe en 1 clic.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDiscountModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Enviar a Dirección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: COMPROBANTE OFICIAL DE MATRÍCULA                                   */}
      {/* ========================================================================= */}
      {enrollSuccessReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/50 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">
                    ¡Comprobante Oficial de Matrícula!
                  </h3>
                  <p className="text-xs text-slate-400">
                    Academia de Belleza Arte & Estilo • Recibo {enrollSuccessReceipt.voucherNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEnrollSuccessReceipt(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Printable Preview */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5 text-xs text-slate-300 font-mono">
              <div className="text-center border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-sm text-white font-sans tracking-wide">
                  ARTE & ESTILO • ACADEMIA DE BELLEZA
                </h4>
                <p className="text-[10px] text-slate-400 font-sans">
                  Sede Principal • Resolución Secretaría de Educación & Salud
                </p>
                <p className="text-sky-400 font-bold font-sans mt-0.5">
                  RECIBO: {enrollSuccessReceipt.voucherNumber}
                </p>
              </div>

              <div className="space-y-1">
                <div><strong>Estudiante:</strong> {enrollSuccessReceipt.studentName}</div>
                <div><strong>Documento:</strong> {enrollSuccessReceipt.studentDocument}</div>
                <div><strong>Teléfono:</strong> {enrollSuccessReceipt.studentPhone}</div>
                <div><strong>Programa:</strong> {enrollSuccessReceipt.programName}</div>
                <div><strong>Jornada / Horario:</strong> {enrollSuccessReceipt.shift}</div>
                <div><strong>Fecha:</strong> {enrollSuccessReceipt.enrollmentDate}</div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span>Valor Total Colegiatura:</span>
                  <span>${enrollSuccessReceipt.totalTuitionFee.toLocaleString('es-CO')}</span>
                </div>
                {enrollSuccessReceipt.discountAmount ? (
                  <div className="flex justify-between text-amber-300">
                    <span>Descuento Aplicado:</span>
                    <span>-${enrollSuccessReceipt.discountAmount.toLocaleString('es-CO')}</span>
                  </div>
                ) : null}
                <div className="flex justify-between font-bold text-emerald-400 text-sm pt-1 border-t border-slate-800">
                  <span>Abono Inicial Recibido:</span>
                  <span>${enrollSuccessReceipt.initialPayment.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Medio de Pago:</span>
                  <span>{enrollSuccessReceipt.paymentMethod}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 text-center font-sans">
                Asesor Responsable: {enrollSuccessReceipt.agentName}
                <br />
                ¡Bienvenido a la mejor formación profesional en estilismo y barbería!
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-sky-400" />
                <span>Imprimir Recibo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleOpenWhatsApp(
                    enrollSuccessReceipt.studentPhone,
                    `¡Hola ${enrollSuccessReceipt.studentName}! 🎉 Confirmamos tu matrícula en la Academia de Belleza Arte & Estilo.
Recibo Oficial: ${enrollSuccessReceipt.voucherNumber}
Programa: ${enrollSuccessReceipt.programName}
Horario: ${enrollSuccessReceipt.shift}
Abono Recibido: $${enrollSuccessReceipt.initialPayment.toLocaleString('es-CO')} (${enrollSuccessReceipt.paymentMethod}).
¡Te esperamos en el Salón Escuela!`
                  );
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
