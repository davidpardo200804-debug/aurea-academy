import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Phone,
  Video,
  PhoneOff,
  Mic,
  MicOff,
  VideoOff,
  Volume2,
  VolumeX,
  Maximize2,
  Paperclip,
  Send,
  UserCheck,
  Search,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  MessageSquare,
  Users,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { User, StaffCallSession, ChatMessage } from '../../types';
import { appStorage } from '../../services/storage';
import { cyberShield } from '../../services/security';

export const StaffCommunicationHub: React.FC = () => {
  const { store, currentUser, refreshData, playSuccessSound, playNotificationSound } = useApp();

  // Active contact/channel
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [messageInput, setMessageInput] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'calls_history'>('chats');

  // Call State
  const [activeCall, setActiveCall] = useState<StaffCallSession | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isCallConnected, setIsCallConnected] = useState(false);

  // Scanner status for file attachments
  const [uploadThreatMessage, setUploadThreatMessage] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ringtoneAudioCtx = useRef<AudioContext | null>(null);
  const timerIntervalRef = useRef<any>(null);

  // Potential contacts: Admin sees Teachers, Teachers see Admin and other Teachers
  const staffMembers = store.users.filter(
    (u) => (u.role === 'admin' || u.role === 'teacher') && u.id !== currentUser.id && u.active
  );

  const selectedContact = staffMembers.find((u) => u.id === selectedContactId) || staffMembers[0];

  useEffect(() => {
    if (!selectedContactId && staffMembers.length > 0) {
      setSelectedContactId(staffMembers[0].id);
    }
  }, [staffMembers, selectedContactId]);

  // Messages between current user and selected contact
  const conversationMessages = store.chats.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === selectedContact?.id) ||
      (m.senderId === selectedContact?.id && m.receiverId === currentUser.id)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages.length]);

  // Call duration counter
  useEffect(() => {
    if (activeCall && isCallConnected) {
      timerIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [activeCall, isCallConnected]);

  // Synthesize pleasant ringtone
  const playRingtone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      ringtoneAudioCtx.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.setValueAtTime(480, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.0);
    } catch {
      // Audio not permitted
    }
  };

  const startCall = (type: 'audio' | 'video') => {
    if (!selectedContact) return;

    playRingtone();

    const newCallSession: Omit<StaffCallSession, 'id'> = {
      callerId: currentUser.id,
      callerName: currentUser.name,
      callerAvatar: currentUser.avatar,
      callerRole: currentUser.role,
      receiverId: selectedContact.id,
      receiverName: selectedContact.name,
      receiverAvatar: selectedContact.avatar,
      receiverRole: selectedContact.role,
      type,
      status: 'ringing',
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationSeconds: 0,
    };

    const savedCall = appStorage.recordStaffCall(newCallSession);
    setActiveCall(savedCall);
    setCallDuration(0);
    setIsCallConnected(false);
    setIsVideoEnabled(type === 'video');

    // Simulate answer after 2.5 seconds
    setTimeout(() => {
      setIsCallConnected(true);
      if (type === 'video') {
        // Try user media if available
        navigator.mediaDevices
          ?.getUserMedia({ video: true, audio: true })
          .then((stream) => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          })
          .catch(() => {
            // Gracefully handled; avatar waveform fallback
          });
      }
    }, 2500);
  };

  const endCall = () => {
    if (activeCall) {
      appStorage.updateStaffCall(activeCall.id, {
        status: isCallConnected ? 'ended' : 'missed',
        durationSeconds: callDuration,
      });
    }

    // Stop tracks
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      localVideoRef.current.srcObject = null;
    }

    setActiveCall(null);
    setIsCallConnected(false);
    setCallDuration(0);
    refreshData();
    playNotificationSound();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedContact) return;

    // Sanitize input with CyberShield
    const sanitized = cyberShield.sanitizeInput(messageInput.trim());

    appStorage.sendChatMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId: selectedContact.id,
      text: sanitized,
    });

    setMessageInput('');
    playSuccessSound();
    refreshData();
  };

  // Upload file attachment with live antivirus scan
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedContact) return;

    setUploadThreatMessage(null);
    const scan = await cyberShield.scanFile(file);

    if (!scan.isSafe) {
      setUploadThreatMessage(scan.threatDetected || 'Archivo malicioso bloqueado por Áurea CyberShield.');
      playNotificationSound();
      return;
    }

    // Safe file
    appStorage.sendChatMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId: selectedContact.id,
      text: `📎 Archivo adjunto verificado por Áurea Shield: "${file.name}" (${(file.size / 1024).toFixed(1)} KB) - Libre de virus.`,
    });

    playSuccessSound();
    refreshData();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900/90 via-slate-900 to-indigo-950 border border-amber-500/30 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30 shrink-0">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Sala Docente & Directiva Áurea</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Comunicaciones, Chat y Videollamadas Docente - Administrativo
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Canal directo cifrado y seguro para coordinación pedagógica, reuniones virtuales de corte y atención prioritaria.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveTab(activeTab === 'chats' ? 'calls_history' : 'chats')}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-2 border border-slate-700 transition-all cursor-pointer"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{activeTab === 'chats' ? 'Ver Registro de Llamadas' : 'Volver a Sala de Chat'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Hub Box */}
      {activeTab === 'calls_history' ? (
        /* Call History View */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>Historial Institucional de Llamadas y Videollamadas</span>
              </h2>
              <p className="text-xs text-slate-400">
                Registro de sesiones y llamadas realizadas entre directivos y profesores.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80">
            {(store.staffCalls || []).length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No hay registro de llamadas recientes.
              </div>
            ) : (
              (store.staffCalls || []).map((call) => (
                <div key={call.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-amber-400">
                      {call.type === 'video' ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center space-x-2">
                        <span>{call.callerName}</span>
                        <span className="text-slate-400 font-normal">➔</span>
                        <span>{call.receiverName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>{call.startedAt}</span>
                        <span>•</span>
                        <span>
                          Duración: {call.durationSeconds > 0 ? formatTimer(call.durationSeconds) : 'Perdida'}
                        </span>
                        <span>•</span>
                        <span
                          className={`font-semibold ${
                            call.status === 'ended' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {call.status === 'ended' ? 'Finalizada con éxito' : 'Llamada no contestada'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedContactId(
                        call.callerId === currentUser.id ? call.receiverId : call.callerId
                      );
                      setActiveTab('chats');
                      startCall(call.type);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Llamar de nuevo</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Regular Staff Chat & Calling Stage */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[700px]">
          {/* Staff Contacts Column */}
          <div className="w-full md:w-80 lg:w-88 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-950/60">
            <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Equipo Docente y Administrativo</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-bold border border-slate-700">
                {staffMembers.length} Conectados
              </span>
            </div>

            {/* Filter */}
            <div className="p-3 border-b border-slate-800/80">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Buscar docente o directivo..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Staff list */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
              {staffMembers
                .filter(
                  (m) =>
                    m.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
                    (m.specialty && m.specialty.toLowerCase().includes(filterQuery.toLowerCase()))
                )
                .map((member) => {
                  const isSelected = member.id === selectedContact?.id;
                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelectedContactId(member.id)}
                      className={`w-full text-left p-3.5 flex items-center space-x-3 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/10 border-l-4 border-amber-400'
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-700"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">{member.name}</span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-sm bg-slate-800 text-amber-300">
                            {member.role === 'admin' ? 'Directivo' : 'Docente'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {member.specialty || member.email}
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Chat and Call Controls */}
          {selectedContact ? (
            <div className="flex-1 flex flex-col bg-slate-950">
              {/* Header with Call buttons */}
              <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedContact.avatar}
                    alt={selectedContact.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/40"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center space-x-2">
                      <span>{selectedContact.name}</span>
                      <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Disponible</span>
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {selectedContact.specialty ||
                        (selectedContact.role === 'admin' ? 'Dirección General Áurea' : 'Cuerpo Docente')}
                    </div>
                  </div>
                </div>

                {/* Call action buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startCall('audio')}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 border border-slate-700 transition-all cursor-pointer shadow-md shadow-slate-950 active:scale-95"
                    title="Iniciar Llamada de Voz"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => startCall('video')}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 flex items-center space-x-1.5 text-xs"
                    title="Iniciar Videollamada Oficial"
                  >
                    <Video className="w-4 h-4" />
                    <span className="hidden sm:inline">Videollamada</span>
                  </button>
                </div>
              </div>

              {/* Threat warning if scanner caught virus */}
              {uploadThreatMessage && (
                <div className="p-3 bg-rose-950/80 border-b border-rose-600/50 flex items-center justify-between text-xs text-rose-200">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{uploadThreatMessage}</span>
                  </div>
                  <button
                    onClick={() => setUploadThreatMessage(null)}
                    className="text-xs text-rose-400 hover:text-rose-200"
                  >
                    Cerrar
                  </button>
                </div>
              )}

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="text-center my-2">
                  <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-amber-300/80">
                    🛡️ Canal Staff protegido por Áurea Shield • Cifrado Institucional
                  </span>
                </div>

                {conversationMessages.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs">
                    No hay mensajes previos. Inicia la conversación o una videollamada.
                  </div>
                ) : (
                  conversationMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                            isMe
                              ? 'bg-amber-500 text-slate-950 rounded-tr-xs font-medium'
                              : 'bg-slate-800 text-white rounded-tl-xs border border-slate-700'
                          }`}
                        >
                          <div
                            className={`text-[10px] font-bold mb-0.5 ${
                              isMe ? 'text-amber-950' : 'text-amber-400'
                            }`}
                          >
                            {msg.senderName}
                          </div>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                          <div
                            className={`text-[9px] mt-1 text-right ${
                              isMe ? 'text-amber-900' : 'text-slate-400'
                            }`}
                          >
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Typing Area */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2"
              >
                <label
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors border border-slate-700"
                  title="Adjuntar archivo seguro (analizado por Áurea Antivirus)"
                >
                  <Paperclip className="w-4 h-4" />
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>

                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Escribir mensaje a ${selectedContact.name}...`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />

                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md shadow-amber-500/20 disabled:opacity-40 cursor-pointer active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500 text-xs">
              Selecciona un docente o administrativo de la lista.
            </div>
          )}
        </div>
      )}

      {/* Live Voice / Video Call Modal */}
      {activeCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Top Bar in Call */}
            <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {isCallConnected
                    ? `En Llamada: ${formatTimer(callDuration)}`
                    : 'Llamando... (Esperando respuesta)'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cifrado Áurea Shield</span>
              </div>
            </div>

            {/* Video Stage / Visualizer */}
            <div className="relative h-96 bg-slate-950 flex items-center justify-center overflow-hidden">
              {activeCall.type === 'video' && isVideoEnabled ? (
                <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                  {/* Remote faculty avatar presentation */}
                  <div className="text-center space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={selectedContact.avatar}
                        alt={selectedContact.name}
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-amber-400/80 shadow-2xl mx-auto"
                      />
                      {isCallConnected && (
                        <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-slate-900 flex items-center justify-center">
                          <CheckCheck className="w-3 h-3 text-slate-950 font-bold" />
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">{selectedContact.name}</h3>
                      <p className="text-xs text-amber-300">
                        {isCallConnected ? 'Conectado a la Sala de Video Áurea' : 'Timbrando...'}
                      </p>
                    </div>

                    {/* Waveform Animation for Voice */}
                    {isCallConnected && (
                      <div className="flex items-center justify-center space-x-1.5 pt-2">
                        <span className="w-1.5 h-6 rounded-full bg-amber-400 animate-pulse" />
                        <span className="w-1.5 h-10 rounded-full bg-yellow-400 animate-pulse delay-75" />
                        <span className="w-1.5 h-8 rounded-full bg-amber-400 animate-pulse delay-150" />
                        <span className="w-1.5 h-12 rounded-full bg-emerald-400 animate-pulse delay-200" />
                        <span className="w-1.5 h-7 rounded-full bg-amber-400 animate-pulse delay-100" />
                      </div>
                    )}
                  </div>

                  {/* Local preview PIP */}
                  <div className="absolute bottom-4 right-4 w-36 h-28 rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden shadow-xl">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1.5 text-[9px] font-bold text-white bg-slate-950/80 px-1.5 py-0.5 rounded-sm">
                      Tú ({currentUser.name.split(' ')[0]})
                    </div>
                  </div>
                </div>
              ) : (
                /* Audio Only Screen */
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-amber-400 shadow-2xl mx-auto"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedContact.name}</h3>
                    <p className="text-xs text-slate-400">Llamada de voz institucional</p>
                  </div>
                  {isCallConnected && (
                    <div className="text-sm font-mono text-emerald-400 font-bold">
                      {formatTimer(callDuration)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-center space-x-4">
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-3.5 rounded-full transition-all cursor-pointer ${
                  isMicMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title={isMicMuted ? 'Activar micrófono' : 'Silenciar micrófono'}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {activeCall.type === 'video' && (
                <button
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={`p-3.5 rounded-full transition-all cursor-pointer ${
                    !isVideoEnabled
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title={isVideoEnabled ? 'Apagar cámara' : 'Encender cámara'}
                >
                  {!isVideoEnabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>
              )}

              <button
                onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                className={`p-3.5 rounded-full transition-all cursor-pointer ${
                  isSpeakerMuted
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title={isSpeakerMuted ? 'Activar altavoz' : 'Silenciar altavoz'}
              >
                {isSpeakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <button
                onClick={endCall}
                className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-xl shadow-rose-600/40 cursor-pointer active:scale-95"
                title="Colgar y terminar llamada"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
