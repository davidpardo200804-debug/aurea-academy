import React, { useState } from 'react';
import {
  MessageCircle,
  Send,
  User,
  Search,
  Clock,
  Sparkles,
  Paperclip,
  CheckCheck,
  Check,
  GraduationCap,
  Shield,
  Scissors,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { appStorage } from '../../services/storage';
import { TeacherStudentMsg } from '../../types';

export const TeacherStudentChatView: React.FC = () => {
  const { currentUser, store, playMessageSound, refreshData } = useApp();
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const allUsers = store.users || [];
  const messages = store.teacherStudentMessages || [];

  // If student, show teachers and admins. If teacher/admin, show students.
  const isStudent = currentUser.role === 'student';
  const contacts = allUsers.filter((u) => {
    if (u.id === currentUser.id) return false;
    if (isStudent) {
      return u.role === 'teacher' || u.role === 'admin';
    } else {
      return u.role === 'student';
    }
  });

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.specialty && c.specialty.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeContactId = selectedContactId || (filteredContacts[0]?.id ?? '');
  const activeContact = allUsers.find((u) => u.id === activeContactId);

  // Messages between current user and active contact
  const conversation = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.recipientId === activeContactId) ||
      (m.senderId === activeContactId && m.recipientId === currentUser.id)
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeContact) return;

    appStorage.sendTeacherStudentMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      recipientId: activeContact.id,
      recipientName: activeContact.name,
      recipientRole: activeContact.role,
      recipientAvatar: activeContact.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      message: messageText.trim(),
    });

    playMessageSound();
    setMessageText('');
    refreshData();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Canal Directo Docente - Estudiante</span>
            </h2>
            <p className="text-xs text-slate-400">
              Comunicación pedagógica, resolución de dudas y asesoría para prácticas en salón.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Arte y Estilo Campus</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Contact list sidebar */}
        <div className="w-72 sm:w-80 border-r border-slate-800 flex flex-col bg-slate-950/40">
          {/* Search bar */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={isStudent ? 'Buscar docentes...' : 'Buscar estudiantes...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {filteredContacts.map((contact) => {
              const isSelected = contact.id === activeContactId;
              const contactMsgs = messages.filter(
                (m) =>
                  (m.senderId === currentUser.id && m.recipientId === contact.id) ||
                  (m.senderId === contact.id && m.recipientId === currentUser.id)
              );
              const lastMsg = contactMsgs[contactMsgs.length - 1];

              return (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContactId(contact.id)}
                  className={`w-full p-3.5 text-left flex items-start space-x-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-600/10 border-l-4 border-blue-500' : 'hover:bg-slate-900/60'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={contact.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={contact.name}
                      className="w-10 h-10 rounded-2xl object-cover border border-slate-700"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">
                        {contact.name}
                      </span>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-400">
                          {lastMsg.timestamp}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-indigo-400 font-semibold truncate mt-0.5">
                      {contact.specialty || (contact.role === 'teacher' ? 'Docente' : 'Estudiante')}
                    </div>

                    {lastMsg ? (
                      <p className="text-[11px] text-slate-400 truncate mt-1">
                        {lastMsg.message}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-500 italic mt-1">
                        Inicia una conversación...
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Conversation Area */}
        <div className="flex-1 flex flex-col bg-slate-900/50">
          {activeContact ? (
            <>
              {/* Active Header */}
              <div className="p-3.5 px-5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={activeContact.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={activeContact.name}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {activeContact.name}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{activeContact.specialty || (activeContact.role === 'teacher' ? 'Instructor de Belleza' : 'Estudiante')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Flow */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {conversation.map((msg) => {
                  const isMine = msg.senderId === currentUser.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-md ${
                          isMine
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        <div
                          className={`mt-1 flex items-center justify-end space-x-1 text-[10px] ${
                            isMine ? 'text-blue-200' : 'text-slate-400'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isMine && <CheckCheck className="w-3 h-3 text-blue-200" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {conversation.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <MessageCircle className="w-12 h-12 text-slate-700 mb-2" />
                    <p className="text-sm font-semibold text-slate-300">
                      Inicia una consulta directa con {activeContact.name}
                    </p>
                    <p className="text-xs text-slate-500 max-w-xs mt-1">
                      Pueden coordinar fórmulas de tintes, citas para modelos en salón escuela o aclarar dudas sobre el pensum.
                    </p>
                  </div>
                )}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3.5 bg-slate-950/70 border-t border-slate-800 flex items-center space-x-2"
              >
                <input
                  type="text"
                  placeholder={`Escribe un mensaje para ${activeContact.name}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              Selecciona un docente o estudiante para abrir el chat
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
