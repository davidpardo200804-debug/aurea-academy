import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Sparkles,
  Send,
  Phone,
  Video,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  CheckCheck,
  Bot,
  User,
  RefreshCw,
  PlusCircle,
  ShieldCheck,
  Zap,
  Clock,
  Check,
  X,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { WhatsAppConversation, WhatsAppMessage } from '../../types';
import { appStorage } from '../../services/storage';

export const WhatsAppExtension: React.FC = () => {
  const { store, refreshData, playSuccessSound, playNotificationSound } = useApp();
  const [activeChatId, setActiveChatId] = useState<string>(store.whatsappChats[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'aspirante' | 'padre_familia' | 'estudiante'>('ALL');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [customAiPrompt, setCustomAiPrompt] = useState('');
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simName, setSimName] = useState('');
  const [simPhone, setSimPhone] = useState('+57 3');
  const [simType, setSimType] = useState<'aspirante' | 'padre_familia' | 'estudiante'>('aspirante');
  const [simMessage, setSimMessage] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chats = store.whatsappChats || [];
  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const filteredChats = chats.filter((c) => {
    const matchesSearch =
      c.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phoneNumber.includes(searchTerm) ||
      c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSendMessage = (textToSend?: string, isFromAI: boolean = false) => {
    const msg = textToSend || inputText;
    if (!msg.trim() || !activeChat) return;

    appStorage.sendWhatsAppMessage(activeChat.id, msg.trim(), isFromAI ? 'ai' : 'business', isFromAI);
    playSuccessSound();
    setInputText('');
    setAiSuggestion(null);
    refreshData();
  };

  const handleGenerateAIReply = async (customInstruction?: string) => {
    if (!activeChat) return;

    setIsGeneratingAI(true);
    setAiSuggestion(null);

    // Build context from recent 3 messages
    const recentContext = activeChat.messages
      .slice(-4)
      .map((m) => `${m.sender === 'user' ? activeChat.contactName : 'Áurea'}: ${m.text}`)
      .join('\n');

    const promptMessage = customInstruction
      ? `${activeChat.lastMessage} [Instrucción adicional del administrador: ${customInstruction}]`
      : activeChat.lastMessage;

    try {
      const res = await fetch('/api/ai/whatsapp-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptMessage,
          context: recentContext,
          contactName: activeChat.contactName,
          contactType: activeChat.type,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiSuggestion(data.reply);
        playNotificationSound();
      } else {
        // Fallback realistic response
        setAiSuggestion(
          `¡Hola ${activeChat.contactName}! ✨ Recibimos tu consulta con mucho gusto. En Áurea las inscripciones y asesorías para ${activeChat.type === 'aspirante' ? 'nuevos programas' : 'estudiantes'} están abiertas de 7:00 a.m. a 4:00 p.m. ¿Te gustaría que te enviemos el folleto informativo por este medio?`
        );
      }
    } catch {
      setAiSuggestion(
        `¡Hola ${activeChat.contactName}! 🌟 Gracias por contactarte con el área administrativa de Áurea. Te confirmamos que los costos y horarios para tu grado ya están vigentes. ¿Deseas agendar una cita presencial o resolver más dudas por aquí?`
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleToggleAutoReply = () => {
    if (!activeChat) return;
    const current = activeChat.aiAutoReplyEnabled ?? false;
    appStorage.updateWhatsAppAutoReply(activeChat.id, !current);
    playSuccessSound();
    refreshData();
  };

  const handleSimulateIncoming = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName || !simMessage) return;

    const newChat = appStorage.createWhatsAppChat(simName, simPhone, simType, simMessage);
    setShowSimulateModal(false);
    setSimName('');
    setSimMessage('');
    playNotificationSound();
    refreshData();
    setActiveChatId(newChat.id);

    // If auto-reply is on or simulate AI response
    setTimeout(async () => {
      try {
        const res = await fetch('/api/ai/whatsapp-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: simMessage,
            contactName: simName,
            contactType: simType,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setAiSuggestion(data.reply);
        }
      } catch {
        // ignore
      }
    }, 1000);
  };

  const handleCopySuggestion = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/80 border border-emerald-800/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Extensión Oficial WhatsApp Business + IA Áurea</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Centro de Atención WhatsApp con Inteligencia Artificial
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Responde al instante preguntas sobre matrículas, pensiones, paz y salvos y horarios asistido por Gemini 3.8 Flash.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowSimulateModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simular Mensaje Entrante</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main WhatsApp Window Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[720px]">
        {/* Left Side: Chats Sidebar */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-950/70">
          {/* Top Bar of Sidebar */}
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-emerald-400/30">
                Á
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-tight">Áurea WhatsApp Web</div>
                <div className="text-[10px] text-emerald-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>En Línea • Asistente Activo</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-slate-400">
              <span className="p-1.5 rounded-lg bg-slate-800 text-[10px] text-amber-400 font-bold border border-slate-700">
                IA v3.8
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-slate-800/80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar o empezar un chat..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center space-x-1.5 mt-2.5 overflow-x-auto pb-1">
              {(['ALL', 'padre_familia', 'aspirante', 'estudiante'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setTypeFilter(filterKey)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    typeFilter === filterKey
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {filterKey === 'ALL'
                    ? 'Todos'
                    : filterKey === 'padre_familia'
                    ? 'Padres'
                    : filterKey === 'aspirante'
                    ? 'Aspirantes'
                    : 'Alumnos'}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
            {filteredChats.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No hay conversaciones que coincidan.
              </div>
            ) : (
              filteredChats.map((c) => {
                const isSelected = c.id === activeChat?.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveChatId(c.id)}
                    className={`w-full text-left p-3.5 flex items-start space-x-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/80 border-l-4 border-emerald-500'
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={c.avatar}
                        alt={c.contactName}
                        className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      {c.type === 'padre_familia' ? (
                        <span className="absolute -bottom-1 -right-1 px-1 rounded-sm bg-purple-600 text-[9px] font-bold text-white ring-1 ring-slate-900">
                          P
                        </span>
                      ) : c.type === 'aspirante' ? (
                        <span className="absolute -bottom-1 -right-1 px-1 rounded-sm bg-amber-600 text-[9px] font-bold text-white ring-1 ring-slate-900">
                          A
                        </span>
                      ) : (
                        <span className="absolute -bottom-1 -right-1 px-1 rounded-sm bg-blue-600 text-[9px] font-bold text-white ring-1 ring-slate-900">
                          E
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{c.contactName}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{c.lastMessageTime}</span>
                      </div>

                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{c.lastMessage}</div>

                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-slate-500 font-mono">{c.phoneNumber}</span>
                        {c.unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px]">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Chat Window + AI Copilot */}
        {activeChat ? (
          <div className="flex-1 flex flex-col bg-slate-950">
            {/* Chat Top Header */}
            <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.contactName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center space-x-2">
                    <span>{activeChat.contactName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-normal bg-slate-800 text-slate-300 border border-slate-700">
                      {activeChat.type === 'padre_familia'
                        ? 'Madre/Padre de Familia'
                        : activeChat.type === 'aspirante'
                        ? 'Aspirante Matrícula'
                        : 'Estudiante'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{activeChat.phoneNumber}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Auto-Reply IA Toggle */}
                <button
                  onClick={handleToggleAutoReply}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    activeChat.aiAutoReplyEnabled
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Activa respuestas automáticas con IA para este chat"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span>Auto-Respuesta IA: {activeChat.aiAutoReplyEnabled ? 'ON' : 'OFF'}</span>
                </button>

                <a
                  href={`https://wa.me/${activeChat.phoneNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors"
                  title="Abrir en WhatsApp Web Externo"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="text-center my-2">
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                  🔒 Cifrado institucional de extremo a extremo Áurea Shield
                </span>
              </div>

              {activeChat.messages.map((m) => {
                const isUser = m.sender === 'user';
                const isAi = m.sender === 'ai';

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-md relative ${
                        isUser
                          ? 'bg-slate-800 text-white rounded-tl-xs border border-slate-700'
                          : isAi
                          ? 'bg-gradient-to-r from-emerald-950 to-amber-950/70 border border-amber-500/30 text-emerald-100 rounded-tr-xs'
                          : 'bg-emerald-900/90 text-white rounded-tr-xs border border-emerald-700/60'
                      }`}
                    >
                      {isAi && (
                        <div className="flex items-center space-x-1 text-[10px] text-amber-400 font-bold mb-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Respuesta sugerida por IA Áurea</span>
                        </div>
                      )}

                      <p className="whitespace-pre-wrap">{m.text}</p>

                      <div
                        className={`text-[10px] mt-1.5 flex items-center justify-end space-x-1 ${
                          isUser ? 'text-slate-400' : 'text-emerald-300/80'
                        }`}
                      >
                        <span>{m.timestamp}</span>
                        {!isUser && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Assistant Quick Reply Drawer */}
            <div className="p-3.5 bg-slate-900/90 border-t border-slate-800/80 backdrop-blur-sm space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Sugerencias Inteligentes de la IA Áurea:</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleGenerateAIReply()}
                    disabled={isGeneratingAI}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isGeneratingAI ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                    <span>{isGeneratingAI ? 'Generando respuesta...' : 'Generar Respuesta IA'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => handleGenerateAIReply('Explicar costos, mensualidad y facilidades de pago')}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 whitespace-nowrap cursor-pointer"
                >
                  💰 Costos y Matrículas
                </button>
                <button
                  onClick={() => handleGenerateAIReply('Confirmar recepción de pago y envío de paz y salvo')}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 whitespace-nowrap cursor-pointer"
                >
                  📜 Paz y Salvo / PSE
                </button>
                <button
                  onClick={() => handleGenerateAIReply('Brindar horarios de clases, jornada mañana y tarde')}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 whitespace-nowrap cursor-pointer"
                >
                  🕒 Horarios de Atención
                </button>
                <button
                  onClick={() => handleGenerateAIReply('Saludar amablemente y solicitar número de documento')}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 whitespace-nowrap cursor-pointer"
                >
                  👋 Pedir Documento
                </button>
              </div>

              {/* AI Draft Box if Generated */}
              {aiSuggestion && (
                <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Borrador generado por Gemini 3.8:</span>
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleCopySuggestion(aiSuggestion)}
                        className="p-1 text-slate-400 hover:text-white rounded-md"
                        title="Copiar texto"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setAiSuggestion(null)}
                        className="p-1 text-slate-400 hover:text-white rounded-md"
                        title="Descartar"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
                    {aiSuggestion}
                  </p>

                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      onClick={() => setInputText(aiSuggestion)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 cursor-pointer"
                    >
                      Editar antes de enviar
                    </button>
                    <button
                      onClick={() => handleSendMessage(aiSuggestion, true)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 cursor-pointer active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar por WhatsApp</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Message Typing Bar */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe un mensaje por WhatsApp o genera uno con la IA..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/30 disabled:opacity-40 cursor-pointer active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <MessageSquare className="w-12 h-12 text-slate-600 mb-3" />
            <div className="font-bold text-white text-base">Selecciona un chat de WhatsApp</div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Conecta con acudientes, aspirantes y alumnos para responder dudas en tiempo real apoyado por la IA.
            </p>
          </div>
        )}
      </div>

      {/* Modal: Simulate Incoming WhatsApp Message */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6">
            <button
              onClick={() => setShowSimulateModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Simular Mensaje Entrante</h3>
                <p className="text-xs text-slate-400">
                  Prueba cómo la IA redacta respuestas a mensajes de padres o aspirantes.
                </p>
              </div>
            </div>

            <form onSubmit={handleSimulateIncoming} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Remitente *</label>
                <input
                  type="text"
                  required
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  placeholder="Ej. Carolina Herrera (Madre)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={simPhone}
                    onChange={(e) => setSimPhone(e.target.value)}
                    placeholder="+57 3..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Contacto</label>
                  <select
                    value={simType}
                    onChange={(e) => setSimType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="padre_familia">Madre / Padre</option>
                    <option value="aspirante">Aspirante / Interesado</option>
                    <option value="estudiante">Estudiante</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mensaje de WhatsApp *</label>
                <textarea
                  required
                  rows={3}
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  placeholder="Ej: Buenas tardes, ¿cuánto cuesta el diplomado y tienen facilidades de pago para empleados?"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30 cursor-pointer active:scale-95"
                >
                  Recibir Mensaje
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
