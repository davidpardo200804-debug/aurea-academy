import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Pin,
  Calendar,
  Sparkles,
  Search,
  Filter,
  Megaphone,
  Tag,
  Clock,
  MapPin,
  Heart,
  Share2,
  Copy,
  Check,
  Camera,
  Trash2,
  Edit3,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Layers,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { appStorage } from '../../services/storage';
import { AcademyNotice } from '../../types';

// Preset beauty photos for easy quick selection
const PHOTO_PRESETS = [
  {
    name: 'Kit Tijeras & Barbería',
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
    category: 'promocion',
  },
  {
    name: 'Colorimetría & Balayage',
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
    category: 'galeria_fotos',
  },
  {
    name: 'Gala & Pasarela de Belleza',
    url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&auto=format&fit=crop&q=80',
    category: 'evento',
  },
  {
    name: 'Barbería Fade & Hair Tattoo',
    url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop&q=80',
    category: 'masterclass',
  },
  {
    name: 'Manicura Rusa & Nail Art',
    url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80',
    category: 'galeria_fotos',
  },
  {
    name: 'Salón Escuela & Peinados',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    category: 'practicas_modelos',
  },
];

export const AcademyNoticesView: React.FC = () => {
  const { currentUser, store, setActiveTab, playSuccessSound, refreshData } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<AcademyNotice | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [sharedNoticeId, setSharedNoticeId] = useState<string | null>(null);

  // Lightbox Modal State
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; gallery?: string[]; index: number } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<AcademyNotice['category']>('promocion');
  const [targetAudience, setTargetAudience] = useState<AcademyNotice['targetAudience']>('todos');
  const [pinned, setPinned] = useState(false);
  const [badgeText, setBadgeText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isPromo, setIsPromo] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(20);
  const [validUntil, setValidUntil] = useState('');
  const [isEvent, setIsEvent] = useState(false);
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [actionButtonText, setActionButtonText] = useState('');
  const [actionTab, setActionTab] = useState('');
  const [showAsPopupOnLogin, setShowAsPopupOnLogin] = useState(true);

  const notices = store.academyNotices || [];
  const canPublish = currentUser.role === 'admin' || currentUser.role === 'teacher';

  const filteredNotices = notices.filter((n) => {
    // Filter by audience
    const matchesAudience =
      n.targetAudience === 'todos' ||
      (currentUser.role === 'student' && n.targetAudience === 'estudiantes') ||
      (currentUser.role === 'teacher' && n.targetAudience === 'docentes') ||
      currentUser.role === 'admin';

    let matchesCategory = true;
    if (filterCategory === 'photos') {
      matchesCategory = !!n.imageUrl || (n.galleryImages && n.galleryImages.length > 0) || n.category === 'galeria_fotos';
    } else if (filterCategory !== 'all') {
      matchesCategory = n.category === filterCategory;
    }

    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.badgeText && n.badgeText.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (n.discountCode && n.discountCode.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesAudience && matchesCategory && matchesSearch;
  });

  // Sort pinned first, then newest
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const handleOpenCreateModal = () => {
    setEditingNotice(null);
    setTitle('');
    setContent('');
    setCategory('promocion');
    setTargetAudience('todos');
    setPinned(false);
    setBadgeText('🔥 Promoción Estudiantil');
    setImageUrl(PHOTO_PRESETS[0].url);
    setGalleryImages([PHOTO_PRESETS[0].url, PHOTO_PRESETS[3].url]);
    setIsPromo(true);
    setDiscountCode('PROMO-BELLEZA');
    setDiscountPercent(25);
    setValidUntil('2026-04-30');
    setIsEvent(false);
    setEventDate('');
    setEventTime('');
    setEventLocation('');
    setActionButtonText('Aprovechar Descuento');
    setActionTab('finances');
    setShowAsPopupOnLogin(true);
    setModalOpen(true);
  };

  const handleOpenEditModal = (notice: AcademyNotice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setContent(notice.content);
    setCategory(notice.category);
    setTargetAudience(notice.targetAudience);
    setPinned(notice.pinned);
    setBadgeText(notice.badgeText || '');
    setImageUrl(notice.imageUrl || '');
    setGalleryImages(notice.galleryImages || []);
    setIsPromo(notice.category === 'promocion' || !!notice.discountCode);
    setDiscountCode(notice.discountCode || '');
    setDiscountPercent(notice.discountPercent || 20);
    setValidUntil(notice.validUntil || '');
    setIsEvent(notice.category === 'evento' || !!notice.eventDate);
    setEventDate(notice.eventDate || '');
    setEventTime(notice.eventTime || '');
    setEventLocation(notice.eventLocation || '');
    setActionButtonText(notice.actionButtonText || '');
    setActionTab(notice.actionTab || '');
    setShowAsPopupOnLogin(notice.showAsPopupOnLogin || false);
    setModalOpen(true);
  };

  const handleAddGalleryImage = () => {
    if (!galleryInput.trim()) return;
    setGalleryImages([...galleryImages, galleryInput.trim()]);
    setGalleryInput('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const noticeData: Omit<AcademyNotice, 'id' | 'publishedAt'> = {
      title,
      content,
      category,
      targetAudience,
      pinned,
      authorName: currentUser.name,
      authorRole: currentUser.role === 'admin' ? 'Dirección General' : 'Instructor Máster',
      badgeText: badgeText.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
      discountCode: isPromo && discountCode.trim() ? discountCode.trim().toUpperCase() : undefined,
      discountPercent: isPromo && discountPercent ? Number(discountPercent) : undefined,
      validUntil: isPromo && validUntil ? validUntil : undefined,
      eventDate: isEvent && eventDate ? eventDate : undefined,
      eventTime: isEvent && eventTime ? eventTime : undefined,
      eventLocation: isEvent && eventLocation ? eventLocation : undefined,
      actionButtonText: actionButtonText.trim() || undefined,
      actionTab: actionTab.trim() || undefined,
      showAsPopupOnLogin,
      likes: editingNotice?.likes || 0,
      likedUserIds: editingNotice?.likedUserIds || [],
    };

    if (editingNotice) {
      appStorage.updateAcademyNotice(editingNotice.id, noticeData);
    } else {
      appStorage.createAcademyNotice(noticeData);
    }

    playSuccessSound();
    refreshData();
    setModalOpen(false);
  };

  const handleDeleteNotice = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de que deseas eliminar este anuncio del muro?')) {
      appStorage.deleteAcademyNotice(id);
      playSuccessSound();
      refreshData();
    }
  };

  const handleLike = (noticeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    appStorage.toggleNoticeLike(noticeId, currentUser.id);
    playSuccessSound();
    refreshData();
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    playSuccessSound();
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleShareNotice = (notice: AcademyNotice, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `📢 ${notice.title}\n${notice.content.slice(0, 150)}...\n\nAcademia de Belleza Arte y Estilo`;
    navigator.clipboard.writeText(shareText);
    setSharedNoticeId(notice.id);
    playSuccessSound();
    setTimeout(() => setSharedNoticeId(null), 2500);
  };

  const handleActionClick = (notice: AcademyNotice, e: React.MouseEvent) => {
    e.stopPropagation();
    if (notice.actionTab) {
      setActiveTab(notice.actionTab);
    }
  };

  const getCategoryMeta = (cat: AcademyNotice['category']) => {
    switch (cat) {
      case 'promocion':
        return {
          label: 'Promoción & Descuento',
          color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: Tag,
        };
      case 'evento':
        return {
          label: 'Evento & Gala',
          color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          icon: Calendar,
        };
      case 'galeria_fotos':
        return {
          label: 'Galería de Trabajos',
          color: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
          icon: Camera,
        };
      case 'masterclass':
        return {
          label: 'Masterclass VIP',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: Sparkles,
        };
      case 'urgente':
        return {
          label: 'Aviso Urgente',
          color: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: Bell,
        };
      case 'practicas_modelos':
        return {
          label: 'Salón & Modelos',
          color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: Sparkles,
        };
      case 'secretaria':
        return {
          label: 'Secretaría & Grados',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: CheckCircle2,
        };
      default:
        return {
          label: 'Académico',
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: Megaphone,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-semibold text-pink-400">
              <Megaphone className="w-3.5 h-3.5 text-pink-400" />
              <span>Muro Oficial de la Academia Arte y Estilo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Muro de Anuncios, Promociones & Eventos</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Cartelera multimedia interactiva para nuestros estudiantes. Descubre promociones exclusivas en kits, convocatorias a galas de belleza, masterclasses internacionales y galerías de transformaciones reales.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {canPublish && (
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center space-x-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Publicar Anuncio / Promo</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-slate-800/80 relative z-10">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por promo, evento, cupón..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-1" />
            {[
              { id: 'all', label: 'Todos' },
              { id: 'photos', label: '📸 Con Fotos' },
              { id: 'promocion', label: '🔥 Promociones' },
              { id: 'evento', label: '🎉 Eventos' },
              { id: 'masterclass', label: '👑 Masterclasses' },
              { id: 'practicas_modelos', label: '✂️ Salón & Modelos' },
              { id: 'urgente', label: '🚨 Urgentes' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  filterCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-800/70 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Notices */}
      {sortedNotices.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <Megaphone className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No se encontraron anuncios</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No hay publicaciones que coincidan con los filtros aplicados. Intenta cambiar de categoría o buscar con otra palabra clave.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {sortedNotices.map((notice) => {
            const meta = getCategoryMeta(notice.category);
            const isLiked = (notice.likedUserIds || []).includes(currentUser.id);
            const hasMultiplePhotos = notice.galleryImages && notice.galleryImages.length > 1;

            return (
              <div
                key={notice.id}
                className={`rounded-3xl border shadow-xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  notice.pinned
                    ? 'bg-slate-900 border-blue-500/40 ring-1 ring-blue-500/20 shadow-blue-950/40'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Notice Top / Media Header */}
                <div>
                  {/* Photo / Flyer preview if available */}
                  {notice.imageUrl ? (
                    <div
                      className="relative h-60 sm:h-72 bg-slate-950 cursor-pointer group overflow-hidden"
                      onClick={() =>
                        setLightboxImage({
                          url: notice.imageUrl!,
                          title: notice.title,
                          gallery: notice.galleryImages || [notice.imageUrl!],
                          index: 0,
                        })
                      }
                    >
                      <img
                        src={notice.imageUrl}
                        alt={notice.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/40" />

                      {/* Top badges over image */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full border text-xs font-black backdrop-blur-md shadow-lg ${meta.color}`}>
                          {notice.badgeText || meta.label}
                        </span>

                        {notice.discountPercent && (
                          <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-black shadow-lg">
                            -{notice.discountPercent}% OFF
                          </span>
                        )}

                        {notice.pinned && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black shadow-lg">
                            <Pin className="w-3 h-3 rotate-45" />
                            <span>Fijado</span>
                          </span>
                        )}

                        {notice.showAsPopupOnLogin && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-indigo-600/90 text-white text-[10px] font-bold backdrop-blur-xs">
                            <Sparkles className="w-3 h-3" />
                            <span>Popup al entrar</span>
                          </span>
                        )}
                      </div>

                      {/* Zoom hint on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xl backdrop-blur-md">
                          <Eye className="w-4 h-4 text-blue-400" />
                          <span>Ver foto en tamaño completo</span>
                        </span>
                      </div>

                      {/* Gallery thumbnails strip on bottom of photo */}
                      {hasMultiplePhotos && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-lg">
                          <Layers className="w-3.5 h-3.5 text-blue-400 ml-1" />
                          <span className="text-[10px] font-bold text-white pr-1">
                            {notice.galleryImages!.length} fotos
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-5 pb-0 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full border text-xs font-bold ${meta.color}`}>
                          {notice.badgeText || meta.label}
                        </span>
                        {notice.pinned && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            <Pin className="w-3 h-3 rotate-45" />
                            <span>Fijado</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        {notice.publishedAt}
                      </span>
                    </div>
                  )}

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Header: Title and Date */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                        <span>Por <strong className="text-slate-200">{notice.authorName}</strong> ({notice.authorRole})</span>
                        <span>{notice.publishedAt}</span>
                      </div>

                      <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                        {notice.title}
                      </h2>
                    </div>

                    {/* Promotion Coupon Highlight */}
                    {notice.discountCode && (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/40 to-pink-950/30 border border-rose-500/40 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-bold text-rose-300 flex items-center space-x-1">
                            <Tag className="w-3.5 h-3.5" />
                            <span>Código de Descuento:</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {notice.validUntil ? `Vence: ${notice.validUntil}` : 'Válido para estudiantes'}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg bg-slate-950 text-rose-300 border border-rose-500/50">
                            {notice.discountCode}
                          </span>
                          <button
                            onClick={(e) => handleCopyCode(notice.discountCode!, e)}
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                            title="Copiar cupón"
                          >
                            {copiedCode === notice.discountCode ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Event Info Details */}
                    {(notice.eventDate || notice.eventLocation || notice.eventTime) && (
                      <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        {notice.eventDate && (
                          <div className="flex items-center space-x-1.5 text-slate-300">
                            <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <div>
                              <span className="block text-[9px] text-slate-400 uppercase font-semibold">Fecha:</span>
                              <strong className="text-white">{notice.eventDate}</strong>
                            </div>
                          </div>
                        )}
                        {notice.eventTime && (
                          <div className="flex items-center space-x-1.5 text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <div>
                              <span className="block text-[9px] text-slate-400 uppercase font-semibold">Horario:</span>
                              <strong className="text-white">{notice.eventTime}</strong>
                            </div>
                          </div>
                        )}
                        {notice.eventLocation && (
                          <div className="flex items-center space-x-1.5 text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                            <div>
                              <span className="block text-[9px] text-slate-400 uppercase font-semibold">Lugar:</span>
                              <strong className="text-white truncate max-w-[130px]">{notice.eventLocation}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content text */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {notice.content}
                    </p>

                    {/* Gallery Thumbnails (click to open in lightbox) */}
                    {notice.galleryImages && notice.galleryImages.length > 1 && (
                      <div className="pt-2">
                        <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center space-x-1.5">
                          <Camera className="w-3.5 h-3.5 text-pink-400" />
                          <span>Galería de Fotos ({notice.galleryImages.length}):</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {notice.galleryImages.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Foto ${idx + 1}`}
                              onClick={() =>
                                setLightboxImage({
                                  url: img,
                                  title: `${notice.title} (Foto ${idx + 1} de ${notice.galleryImages!.length})`,
                                  gallery: notice.galleryImages,
                                  index: idx,
                                })
                              }
                              className="w-16 h-16 rounded-xl object-cover border border-slate-700 hover:border-pink-500 cursor-pointer transition-all hover:scale-105"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Bar: Likes, Shares, Actions, Admin Controls */}
                <div className="p-4 sm:px-6 bg-slate-950/80 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  {/* Left: Like & Share buttons */}
                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      onClick={(e) => handleLike(notice.id, e)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        isLiked
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''} transition-transform`} />
                      <span>{notice.likes || 0}</span>
                    </button>

                    <button
                      onClick={(e) => handleShareNotice(notice, e)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors flex items-center space-x-1.5 cursor-pointer"
                      title="Copiar texto para compartir"
                    >
                      {sharedNoticeId === notice.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Compartir</span>
                        </>
                      )}
                    </button>

                    {/* Admin/Teacher quick edit/delete */}
                    {canPublish && (
                      <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
                        <button
                          onClick={() => handleOpenEditModal(notice)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Editar anuncio"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteNotice(notice.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Eliminar del muro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: Direct action button */}
                  {notice.actionButtonText && (
                    <button
                      onClick={(e) => handleActionClick(notice, e)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
                    >
                      <span>{notice.actionButtonText}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Photo Viewer Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
              <span className="text-sm font-bold text-white truncate max-w-md">
                {lightboxImage.title}
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[350px]">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                className="max-h-[65vh] w-auto max-w-full object-contain"
              />

              {/* Gallery navigation arrows if multiple */}
              {lightboxImage.gallery && lightboxImage.gallery.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const prevIndex =
                        (lightboxImage.index - 1 + lightboxImage.gallery!.length) %
                        lightboxImage.gallery!.length;
                      setLightboxImage({
                        ...lightboxImage,
                        url: lightboxImage.gallery![prevIndex],
                        index: prevIndex,
                      });
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition-all shadow-lg cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      const nextIndex =
                        (lightboxImage.index + 1) % lightboxImage.gallery!.length;
                      setLightboxImage({
                        ...lightboxImage,
                        url: lightboxImage.gallery![nextIndex],
                        index: nextIndex,
                      });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition-all shadow-lg cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Publish / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">
                  {editingNotice ? 'Editar Publicación en el Muro' : 'Publicar Anuncio, Promoción o Evento'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveNotice} className="overflow-y-auto p-6 space-y-5 flex-1 text-xs">
              {/* Category & Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Tipo de Publicación / Categoría:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const newCat = e.target.value as AcademyNotice['category'];
                      setCategory(newCat);
                      if (newCat === 'promocion') {
                        setIsPromo(true);
                        setIsEvent(false);
                      } else if (newCat === 'evento' || newCat === 'masterclass') {
                        setIsEvent(true);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="promocion">🔥 Promoción / Descuento en Kits o Cursos</option>
                    <option value="evento">🎉 Evento / Gala / Pasarela Institucional</option>
                    <option value="masterclass">👑 Masterclass / Seminario Internacional</option>
                    <option value="galeria_fotos">📸 Galería de Trabajos & Transformaciones</option>
                    <option value="practicas_modelos">✂️ Convocatoria de Modelos / Salón Escuela</option>
                    <option value="academico">📚 Circular Académica General</option>
                    <option value="urgente">🚨 Aviso Urgente / Convivencia</option>
                    <option value="secretaria">🎓 Secretaría / Grados & Diplomas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Audiencia Destinataria:
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="todos">Todos (Comunidad Completa)</option>
                    <option value="estudiantes">Solo Estudiantes</option>
                    <option value="docentes">Solo Docentes & Directivos</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Título de la Publicación: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 🔥 30% OFF en Kit de Tijeras Profesionales / 🎉 Gran Gala de Grados"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              {/* Badge Text */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Etiqueta Destacada (Badge):
                </label>
                <input
                  type="text"
                  placeholder="Ej: 🔥 30% OFF, 🎟️ Evento Especial, 📸 Salón Escuela"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Photo & Image presets */}
              <div className="space-y-2">
                <label className="block text-slate-300 font-bold">
                  Imagen Principal (Flyer / Foto de la Promoción):
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />

                {/* Quick Presets */}
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
                    O selecciona una foto profesional de belleza sugerida:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PHOTO_PRESETS.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setImageUrl(p.url);
                          if (!galleryImages.includes(p.url)) {
                            setGalleryImages([...galleryImages, p.url]);
                          }
                        }}
                        className={`group relative h-14 rounded-xl overflow-hidden border cursor-pointer transition-all ${
                          imageUrl === p.url ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-slate-800 hover:border-slate-600'
                        }`}
                        title={p.name}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                        <span className="absolute inset-0 bg-black/50 text-[9px] text-white font-bold p-1 flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
                          {p.name.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Gallery Photos */}
              <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <label className="block text-slate-300 font-bold">
                  Fotos Adicionales para la Galería (Opcional):
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="URL de foto adicional..."
                    value={galleryInput}
                    onChange={(e) => setGalleryInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                  >
                    + Agregar
                  </button>
                </div>

                {galleryImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="relative group w-14 h-14 rounded-xl overflow-hidden border border-slate-700">
                        <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(i)}
                          className="absolute inset-0 bg-rose-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Promotion Fields toggle */}
              <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer font-bold text-rose-300">
                  <input
                    type="checkbox"
                    checked={isPromo}
                    onChange={(e) => setIsPromo(e.target.checked)}
                    className="rounded text-rose-600"
                  />
                  <span>🏷️ Configurar como Promoción / Descuento Especial</span>
                </label>

                {isPromo && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Código del Cupón:
                      </label>
                      <input
                        type="text"
                        placeholder="ARTE35-KIT"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-rose-300 font-mono font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        % de Descuento:
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        placeholder="35"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Válido Hasta:
                      </label>
                      <input
                        type="date"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Event Fields toggle */}
              <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer font-bold text-purple-300">
                  <input
                    type="checkbox"
                    checked={isEvent}
                    onChange={(e) => setIsEvent(e.target.checked)}
                    className="rounded text-purple-600"
                  />
                  <span>📅 Configurar Fecha y Lugar del Evento / Masterclass</span>
                </label>

                {isEvent && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Fecha del Evento:
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Horario:
                      </label>
                      <input
                        type="text"
                        placeholder="06:00 PM - 09:30 PM"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 font-semibold mb-1">
                        Lugar / Sede:
                      </label>
                      <input
                        type="text"
                        placeholder="Auditorio Sede Central"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Content / Body */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Descripción Detallada del Comunicado: *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escribe los detalles, beneficios, requisitos y condiciones..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              {/* Action Button & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Texto del Botón de Acción:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Aprovechar Descuento / Inscribirme"
                    value={actionButtonText}
                    onChange={(e) => setActionButtonText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Pestaña de Destino al Dar Clic:
                  </label>
                  <select
                    value={actionTab}
                    onChange={(e) => setActionTab(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Ninguna (Solo ver información)</option>
                    <option value="finances">Tesorería & Pagos (Para pagar con descuento)</option>
                    <option value="practices">Bitácora de Prácticas Salón</option>
                    <option value="calendar">Calendario Institucional</option>
                    <option value="pensum">Pensum & Módulos</option>
                    <option value="callCenter">Call Center & Admisiones</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes: Pinned & Popup On Login */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row gap-4">
                <label className="flex items-center space-x-2 cursor-pointer font-bold text-amber-300">
                  <input
                    type="checkbox"
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span>⭐ Fijar en la parte superior del muro</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer font-bold text-indigo-300">
                  <input
                    type="checkbox"
                    checked={showAsPopupOnLogin}
                    onChange={(e) => setShowAsPopupOnLogin(e.target.checked)}
                    className="rounded text-indigo-500"
                  />
                  <span>🔔 Mostrar como Ventana Emergente al Iniciar Sesión</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-blue-500/30 cursor-pointer transition-all active:scale-95"
                >
                  {editingNotice ? 'Guardar Cambios' : 'Publicar en el Muro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
