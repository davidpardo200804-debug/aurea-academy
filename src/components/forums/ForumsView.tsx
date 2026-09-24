import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessagesSquare,
  Plus,
  MessageCircle,
  ThumbsUp,
  Tag,
  Pin,
  Send,
  User,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { appStorage } from '../../services/storage';

export const ForumsView: React.FC = () => {
  const { store, currentUser, refreshData, playSuccessSound } = useApp();

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState(false);

  // New Topic Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [groupId, setGroupId] = useState(store.groups[0]?.id || '');
  const [tagsInput, setTagsInput] = useState('Química, Preguntas');

  // Reply Form
  const [replyContent, setReplyContent] = useState('');

  const topics = store.forums;
  const selectedTopic = topics.find((t) => t.id === selectedTopicId);
  const replies = selectedTopic
    ? store.replies.filter((r) => r.topicId === selectedTopic.id)
    : [];

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const group = store.groups.find((g) => g.id === groupId);
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    appStorage.createForumTopic({
      title,
      content,
      groupId,
      groupName: group ? group.name : 'General',
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      tags,
    });

    playSuccessSound();
    refreshData();
    setIsNewTopicModalOpen(false);
    setTitle('');
    setContent('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !selectedTopicId) return;

    appStorage.addForumReply({
      topicId: selectedTopicId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatar,
      content: replyContent.trim(),
    });

    playSuccessSound();
    refreshData();
    setReplyContent('');
  };

  const handleLikeReply = (replyId: string) => {
    store.replies = store.replies.map((r) =>
      r.id === replyId ? { ...r, likes: r.likes + 1 } : r
    );
    appStorage.saveStore(store);
    refreshData();
  };

  const handleLikeTopic = (topicId: string) => {
    store.forums = store.forums.map((t) =>
      t.id === topicId ? { ...t, likes: t.likes + 1 } : t
    );
    appStorage.saveStore(store);
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <MessagesSquare className="w-6 h-6 text-indigo-400" />
            <span>Comunidad de Foros Estudiantiles & Debates</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Espacio colaborativo de preguntas académicas, discusión de proyectos y asesoría docente.
          </p>
        </div>

        <button
          onClick={() => setIsNewTopicModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nueva Discusión</span>
        </button>
      </div>

      {/* Main Forum Content: Either Topic Detail or Topic List */}
      {selectedTopic ? (
        /* Topic Detail with replies */
        <div className="space-y-4">
          <button
            onClick={() => setSelectedTopicId(null)}
            className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la lista de foros</span>
          </button>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={selectedTopic.authorAvatar}
                alt=""
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <div>
                <div className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>{selectedTopic.authorName}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {selectedTopic.authorRole}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">{selectedTopic.createdAt} • Grupo: {selectedTopic.groupName}</div>
              </div>
            </div>

            <h2 className="text-lg font-bold text-white mb-2">{selectedTopic.title}</h2>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {selectedTopic.content}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {selectedTopic.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-800 text-indigo-300 border border-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center space-x-4">
              <button
                onClick={() => handleLikeTopic(selectedTopic.id)}
                className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-indigo-400 cursor-pointer"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{selectedTopic.likes} Me gusta</span>
              </button>
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{replies.length} Respuestas</span>
              </span>
            </div>
          </div>

          {/* Replies Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white px-1">Respuestas ({replies.length})</h3>

            {replies.map((reply) => (
              <div
                key={reply.id}
                className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <img src={reply.authorAvatar} className="w-7 h-7 rounded-full object-cover" alt="" />
                    <span className="text-xs font-bold text-white">{reply.authorName}</span>
                    <span className="text-[10px] uppercase font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">
                      {reply.authorRole}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">{reply.createdAt}</span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed pl-9">{reply.content}</p>

                <div className="pl-9 mt-2 flex items-center space-x-3 text-[11px] text-slate-400">
                  <button
                    onClick={() => handleLikeReply(reply.id)}
                    className="flex items-center space-x-1 hover:text-emerald-400 cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{reply.likes}</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Reply Input Box */}
            <form onSubmit={handleSendReply} className="mt-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Responder a esta discusión como {currentUser.name}
              </label>
              <textarea
                rows={3}
                required
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escribe tu aporte o respuesta pedagógica..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Respuesta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Topics List View */
        <div className="grid grid-cols-1 gap-4">
          {topics.map((t) => {
            const repliesCount = store.replies.filter((r) => r.topicId === t.id).length;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTopicId(t.id)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-5 shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {t.isPinned && (
                      <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Pin className="w-3 h-3" />
                        <span>Fijado</span>
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-slate-400">{t.groupName}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{t.createdAt}</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {t.content}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <img src={t.authorAvatar} className="w-5 h-5 rounded-full object-cover" alt="" />
                    <span className="text-xs text-slate-300 font-medium">{t.authorName}</span>
                    <span className="text-[10px] text-slate-400 capitalize">({t.authorRole})</span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{t.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{repliesCount} respuestas</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: New Topic */}
      {isNewTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-4">Abrir Nueva Discusión en el Foro</h2>
            <form onSubmit={handleCreateTopic} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título de la Pregunta *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. ¿Cómo se resuelve el ejercicio 4 del taller de límites?"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Grupo o Curso</label>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {store.groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción / Pregunta Detallada *</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Explica detalladamente tu duda o tema a debatir..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Etiquetas (separadas por coma)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Química, Ejercicios, Examen"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewTopicModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg"
                >
                  Crear Discusión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
