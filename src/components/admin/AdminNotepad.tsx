import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  StickyNote,
  Plus,
  Pin,
  Trash2,
  Edit3,
  Search,
  CheckSquare,
  Square,
  Sparkles,
  Tag,
  Copy,
  Check,
  Calendar,
  User,
  Filter,
  Download,
} from 'lucide-react';
import { AdminNote } from '../../types';
import { appStorage } from '../../services/storage';

const CATEGORY_MAP: Record<string, { label: string; bg: string; text: string; border: string }> = {
  acuerdo: {
    label: 'Acuerdo Directivo',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  reunion: {
    label: 'Minuta de Reunión',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  urgente: {
    label: 'Prioritario / Urgente',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  idea: {
    label: 'Idea / Proyecto',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  general: {
    label: 'Apunte General',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
};

const COLOR_MAP: Record<string, { bg: string; border: string; header: string }> = {
  yellow: {
    bg: 'bg-gradient-to-br from-amber-950/40 to-slate-900',
    border: 'border-amber-500/40',
    header: 'bg-amber-500/20 text-amber-300',
  },
  emerald: {
    bg: 'bg-gradient-to-br from-emerald-950/40 to-slate-900',
    border: 'border-emerald-500/40',
    header: 'bg-emerald-500/20 text-emerald-300',
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-950/40 to-slate-900',
    border: 'border-indigo-500/40',
    header: 'bg-indigo-500/20 text-indigo-300',
  },
  rose: {
    bg: 'bg-gradient-to-br from-rose-950/40 to-slate-900',
    border: 'border-rose-500/40',
    header: 'bg-rose-500/20 text-rose-300',
  },
  amber: {
    bg: 'bg-gradient-to-br from-yellow-950/40 to-slate-900',
    border: 'border-yellow-500/40',
    header: 'bg-yellow-500/20 text-yellow-300',
  },
};

export const AdminNotepad: React.FC = () => {
  const { store, currentUser, refreshData, playSuccessSound, playNotificationSound } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<AdminNote | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<AdminNote['category']>('acuerdo');
  const [color, setColor] = useState<AdminNote['color']>('yellow');
  const [pinned, setPinned] = useState(false);
  const [checklistText, setChecklistText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const notes = store.adminNotes || [];

  const filteredNotes = notes.filter((n) => {
    const matchesCategory = selectedCategory === 'all' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const otherNotes = filteredNotes.filter((n) => !n.pinned);

  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setCategory('acuerdo');
    setColor('yellow');
    setPinned(false);
    setChecklistText('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: AdminNote) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setColor(note.color);
    setPinned(note.pinned);
    setChecklistText(
      note.checklist ? note.checklist.map((item) => (item.done ? `[x] ${item.text}` : `[ ] ${item.text}`)).join('\n') : ''
    );
    setIsModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Parse checklist items
    const parsedChecklist = checklistText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, idx) => {
        const isDone = line.startsWith('[x]') || line.startsWith('[X]');
        const text = line.replace(/^\[(x|X| )\]\s*/, '');
        return {
          id: `chk-${Date.now()}-${idx}`,
          text: text || line,
          done: isDone,
        };
      });

    const authorCargo = currentUser.cargo || (currentUser.role === 'admin' ? 'Administración' : currentUser.name);
    const authorString = `${currentUser.name} (${authorCargo})`;

    if (editingNote) {
      appStorage.updateAdminNote(editingNote.id, {
        title,
        content,
        category,
        color,
        pinned,
        checklist: parsedChecklist.length > 0 ? parsedChecklist : undefined,
      });
      playSuccessSound();
    } else {
      appStorage.createAdminNote({
        title,
        content,
        category,
        color,
        pinned,
        authorName: authorString,
        checklist: parsedChecklist.length > 0 ? parsedChecklist : undefined,
      });
      playSuccessSound();
    }

    refreshData();
    setIsModalOpen(false);
  };

  const handleDeleteNote = (id: string, noteTitle: string) => {
    if (confirm(`¿Estás seguro de eliminar el apunte "${noteTitle}"?`)) {
      appStorage.deleteAdminNote(id);
      playNotificationSound();
      refreshData();
    }
  };

  const handleTogglePin = (note: AdminNote) => {
    appStorage.updateAdminNote(note.id, { pinned: !note.pinned });
    playNotificationSound();
    refreshData();
  };

  const handleToggleCheckItem = (noteId: string, itemId: string) => {
    const targetNote = notes.find((n) => n.id === noteId);
    if (!targetNote || !targetNote.checklist) return;

    const updatedChecklist = targetNote.checklist.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );

    appStorage.updateAdminNote(noteId, { checklist: updatedChecklist });
    refreshData();
  };

  const handleCopyNote = (note: AdminNote) => {
    const textToCopy = `📌 ${note.title}\n${note.content}\n\nAutor: ${note.authorName} - ${note.updatedAt}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    playSuccessSound();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadNote = (note: AdminNote) => {
    const textToSave = `========================================\nÁUREA CAMPUS - APUNTE ADMINISTRATIVO\n========================================\nTítulo: ${note.title}\nCategoría: ${note.category.toUpperCase()}\nAutor: ${note.authorName}\nFecha: ${note.updatedAt}\n\nCONTENIDO:\n${note.content}\n\n` +
      (note.checklist && note.checklist.length > 0
        ? `CHECKLIST DE TAREAS:\n${note.checklist.map((c) => (c.done ? `[✓] ${c.text}` : `[ ] ${c.text}`)).join('\n')}\n`
        : '');

    const blob = new Blob([textToSave], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apunte_${note.title.toLowerCase().replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-2">
            <StickyNote className="w-3.5 h-3.5" />
            <span>Áurea Workspace • Apuntes Directivos</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>Block de Notas & Minutas de Gestión</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Espacio confidencial para tomar notas de comités, registrar acuerdos directivos, compromisos con
            acudientes y listas de verificación rápidas.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Apunte</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar en apuntes por título, contenido o autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Todos ({notes.length})
          </button>
          {Object.entries(CATEGORY_MAP).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                selectedCategory === key
                  ? `${cat.bg} ${cat.text} border ${cat.border} font-bold`
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Pin className="w-3.5 h-3.5 rotate-45" />
            <span>Apuntes Fijados al Inicio ({pinnedNotes.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => renderNoteCard(note))}
          </div>
        </div>
      )}

      {/* Other Notes Section */}
      <div className="space-y-3">
        {pinnedNotes.length > 0 && otherNotes.length > 0 && (
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Todos los Apuntes ({otherNotes.length})
          </div>
        )}

        {filteredNotes.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <StickyNote className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No hay notas registradas</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm || selectedCategory !== 'all'
                ? 'Ningún apunte coincide con los filtros aplicados.'
                : 'Comienza creando tu primera nota para organizar las decisiones y acuerdos de la institución.'}
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Crear Nota Ahora</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherNotes.map((note) => renderNoteCard(note))}
          </div>
        )}
      </div>

      {/* Modal: Create / Edit Note */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <StickyNote className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white">
                  {editingNote ? 'Editar Apunte Administrativo' : 'Nuevo Apunte de Gestión'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título del Apunte *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Acuerdos Reunión Comité de Convivencia"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AdminNote['category'])}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="acuerdo">Acuerdo Directivo</option>
                    <option value="reunion">Minuta de Reunión</option>
                    <option value="urgente">Prioritario / Urgente</option>
                    <option value="idea">Idea / Proyecto</option>
                    <option value="general">Apunte General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Color de la Ficha</label>
                  <div className="flex items-center space-x-2 pt-1">
                    {(['yellow', 'emerald', 'indigo', 'rose', 'amber'] as const).map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-7 h-7 rounded-xl border-2 transition-all cursor-pointer ${
                          color === c ? 'scale-115 border-white ring-2 ring-amber-400/50' : 'border-transparent opacity-70 hover:opacity-100'
                        } ${
                          c === 'yellow'
                            ? 'bg-amber-500'
                            : c === 'emerald'
                            ? 'bg-emerald-500'
                            : c === 'indigo'
                            ? 'bg-indigo-500'
                            : c === 'rose'
                            ? 'bg-rose-500'
                            : 'bg-yellow-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Contenido / Anotaciones *</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detalla los puntos tratados, acuerdos tomados, decisiones y compromisos..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Lista de Tareas / Checklist (Opcional)
                  </label>
                  <span className="text-[10px] text-slate-400">Una tarea por línea</span>
                </div>
                <textarea
                  rows={3}
                  value={checklistText}
                  onChange={(e) => setChecklistText(e.target.value)}
                  placeholder={`Ejemplo:\n[x] Convocar a docentes grado 11°\n[ ] Elaborar acta de cierre\n[ ] Enviar informe a Secretaría`}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pinned-checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-400 cursor-pointer"
                />
                <label htmlFor="pinned-checkbox" className="text-xs text-slate-300 cursor-pointer flex items-center space-x-1.5">
                  <Pin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fijar este apunte en la parte superior</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 font-bold text-xs text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {editingNote ? 'Guardar Cambios' : 'Guardar Apunte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function renderNoteCard(note: AdminNote) {
    const colorStyle = COLOR_MAP[note.color] || COLOR_MAP.yellow;
    const catStyle = CATEGORY_MAP[note.category] || CATEGORY_MAP.general;

    return (
      <div
        key={note.id}
        className={`relative rounded-3xl p-5 border ${colorStyle.border} ${colorStyle.bg} shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group space-y-3.5`}
      >
        {/* Top Card Bar */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
            >
              {catStyle.label}
            </span>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleTogglePin(note)}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  note.pinned
                    ? 'text-amber-400 bg-amber-500/20'
                    : 'text-slate-500 hover:text-slate-300 opacity-60 group-hover:opacity-100'
                }`}
                title={note.pinned ? 'Desfijar' : 'Fijar nota'}
              >
                <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'rotate-45 fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={() => handleCopyNote(note)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer opacity-60 group-hover:opacity-100"
                title="Copiar texto"
              >
                {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleDownloadNote(note)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer opacity-60 group-hover:opacity-100"
                title="Descargar como TXT"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleOpenEditModal(note)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer opacity-60 group-hover:opacity-100"
                title="Editar"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleDeleteNote(note.id, note.title)}
                className="p-1 rounded-lg text-rose-400/80 hover:text-rose-400 transition-colors cursor-pointer opacity-60 group-hover:opacity-100"
                title="Eliminar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h3 className="font-bold text-white text-sm leading-snug">{note.title}</h3>
          <p className="text-xs text-slate-300 mt-2 whitespace-pre-line leading-relaxed">
            {note.content}
          </p>
        </div>

        {/* Checklist if present */}
        {note.checklist && note.checklist.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Compromisos / Tareas ({note.checklist.filter((c) => c.done).length}/{note.checklist.length})
            </div>
            <div className="space-y-1">
              {note.checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleToggleCheckItem(note.id, item.id)}
                  className="w-full flex items-start space-x-2 text-left text-xs py-0.5 group/item cursor-pointer"
                >
                  {item.done ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5 group-hover/item:text-slate-300" />
                  )}
                  <span className={`${item.done ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Meta */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center space-x-1 truncate max-w-[200px]">
            <User className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">{note.authorName}</span>
          </div>
          <span>{note.updatedAt}</span>
        </div>
      </div>
    );
  }
};
