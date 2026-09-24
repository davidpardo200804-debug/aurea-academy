import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Send,
  User,
  MessageSquare,
  Shield,
  BookOpen,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { appStorage } from '../services/storage';

export const LiveChat: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    currentUser,
    store,
    refreshData,
    playMessageSound,
    selectedChatContactId,
    setSelectedChatContactId,
  } = useApp();

  const [activeContactId, setActiveContactId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Available contacts (everyone except currentUser)
  const contacts = store.users.filter((u) => u.id !== currentUser.id);

  useEffect(() => {
    if (selectedChatContactId) {
      setActiveContactId(selectedChatContactId);
    } else if (contacts.length > 0 && !activeContactId) {
      setActiveContactId(contacts[0].id);
    }
  }, [selectedChatContactId, contacts, activeContactId]);

  // Messages between currentUser and activeContactId
  const conversationMessages = store.chats.filter((m) => {
    return (
      (m.senderId === currentUser.id && m.receiverId === activeContactId) ||
      (m.senderId === activeContactId && m.receiverId === currentUser.id)
    );
  });

  const activeContact = store.users.find((u) => u.id === activeContactId) || contacts[0];

  useEffect(() => {
    if (isChatOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationMessages.length, isChatOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact) return;

    appStorage.sendChatMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      receiverId: activeContact.id,
      text: inputText.trim(),
    });

    playMessageSound();
    setInputText('');
    refreshData();
  };

  if (!isChatOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full sm:w-[460px] h-[580px] max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Chat Institucional en Vivo</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Comunicación directa con notificación instantánea</p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsChatOpen(false);
            setSelectedChatContactId(null);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main chat body: Left contact avatars or tab, Right conversation */}
      <div className="flex-1 flex overflow-hidden">
        {/* Contact List column */}
        <div className="w-36 sm:w-44 bg-slate-950/70 border-r border-slate-800/80 p-2 overflow-y-auto space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-500 px-2 py-1">Contactos</div>
          {contacts.map((contact) => {
            const isSelected = contact.id === activeContactId;
            const unread = store.chats.some(
              (m) => m.senderId === contact.id && m.receiverId === currentUser.id && !m.read
            );

            return (
              <button
                key={contact.id}
                onClick={() => {
                  setActiveContactId(contact.id);
                  // Mark as read
                  store.chats.forEach((m) => {
                    if (m.senderId === contact.id && m.receiverId === currentUser.id) {
                      m.read = true;
                    }
                  });
                  appStorage.saveStore(store);
                  refreshData();
                }}
                className={`w-full text-left p-2 rounded-xl text-xs flex items-center space-x-2 transition-all ${
                  isSelected
                    ? 'bg-indigo-600/30 text-white border border-indigo-500/50'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img src={contact.avatar} className="w-7 h-7 rounded-full object-cover" alt="" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-slate-900" />
                </div>
                <div className="overflow-hidden leading-tight flex-1">
                  <div className="truncate font-semibold text-[11px]">{contact.name.split(' ')[0]}</div>
                  <div className="text-[9px] text-slate-400 uppercase font-medium">
                    {contact.role === 'admin' ? 'Admin' : contact.role === 'teacher' ? 'Docente' : 'Alumno'}
                  </div>
                </div>
                {unread && <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Conversation column */}
        <div className="flex-1 flex flex-col bg-slate-900/60">
          {/* Active Contact Header */}
          {activeContact && (
            <div className="px-3 py-2 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src={activeContact.avatar}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                  alt=""
                />
                <div>
                  <div className="text-xs font-semibold text-white">{activeContact.name}</div>
                  <div className="text-[10px] text-emerald-400 font-medium">En línea para responder</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {activeContact.role === 'admin' ? 'Administración' : activeContact.role === 'teacher' ? 'Cuerpo Docente' : 'Estudiante'}
              </span>
            </div>
          )}

          {/* Messages scroll */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
            {conversationMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
                <MessageSquare className="w-8 h-8 text-slate-600 mb-2" />
                <p className="font-medium text-slate-300">No hay mensajes previos</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Escribe un mensaje para iniciar una conversación en tiempo real.
                </p>
              </div>
            ) : (
              conversationMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-500 mt-0.5 px-1">{msg.timestamp.slice(11)}</span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input field */}
          <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-800 bg-slate-950/80 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Escribe a ${activeContact?.name?.split(' ')[0] || 'usuario'}...`}
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
