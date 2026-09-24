import React, { useState } from 'react';
import {
  Tag,
  Calendar,
  Sparkles,
  ArrowRight,
  Heart,
  ChevronRight,
  Copy,
  Check,
  Megaphone,
  Camera,
  MapPin,
  Clock,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { appStorage } from '../../services/storage';
import { AcademyNotice } from '../../types';

interface StudentNoticeBannerProps {
  onOpenPopup: () => void;
}

export const StudentNoticeBanner: React.FC<StudentNoticeBannerProps> = ({ onOpenPopup }) => {
  const { store, currentUser, setActiveTab, playSuccessSound, refreshData } = useApp();
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'promocion' | 'evento' | 'galeria_fotos'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const notices = (store.academyNotices || []).filter((n) => {
    return n.targetAudience === 'todos' || n.targetAudience === 'estudiantes';
  });

  const filteredNotices = notices.filter((n) => {
    if (activeTabFilter === 'all') return true;
    return n.category === activeTabFilter;
  });

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    playSuccessSound();
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleLike = (noticeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    appStorage.toggleNoticeLike(noticeId, currentUser.id);
    playSuccessSound();
    refreshData();
  };

  const handleOpenNotice = (notice: AcademyNotice) => {
    if (notice.actionTab) {
      setActiveTab(notice.actionTab);
    } else {
      setActiveTab('notices');
    }
  };

  if (notices.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 relative overflow-hidden">
      {/* Decorative gradient blur background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1">
              <Megaphone className="w-3.5 h-3.5" />
              <span>Cartelera & Muro de Estudiantes</span>
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1 flex items-center gap-2">
            <span>Promociones, Eventos & Fotos de la Academia</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPopup}
            className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            title="Abrir ventana destacada de novedades"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Ver Novedades Destacadas</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
          >
            <span>Ver Muro Completo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs relative z-10">
        <button
          onClick={() => setActiveTabFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
            activeTabFilter === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Todo ({notices.length})
        </button>
        <button
          onClick={() => setActiveTabFilter('promocion')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
            activeTabFilter === 'promocion'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-500/30'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>🔥 Promos & Kits</span>
        </button>
        <button
          onClick={() => setActiveTabFilter('evento')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
            activeTabFilter === 'evento'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>🎉 Eventos & Galas</span>
        </button>
        <button
          onClick={() => setActiveTabFilter('galeria_fotos')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1 shrink-0 ${
            activeTabFilter === 'galeria_fotos'
              ? 'bg-pink-600 text-white shadow-md shadow-pink-500/30'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>📸 Fotos & Salón</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
        {filteredNotices.slice(0, 3).map((notice) => {
          const isLiked = (notice.likedUserIds || []).includes(currentUser.id);

          return (
            <div
              key={notice.id}
              onClick={() => handleOpenNotice(notice)}
              className="group bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div>
                {/* Image header */}
                {notice.imageUrl ? (
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={notice.imageUrl}
                      alt={notice.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                      {notice.badgeText && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-black border border-slate-700/60 shadow-md">
                          {notice.badgeText}
                        </span>
                      )}
                      {notice.discountPercent && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black shadow-md">
                          -{notice.discountPercent}%
                        </span>
                      )}
                    </div>

                    {/* Extra images counter if gallery */}
                    {notice.galleryImages && notice.galleryImages.length > 1 && (
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold flex items-center space-x-1 border border-white/20">
                        <Layers className="w-3 h-3" />
                        <span>{notice.galleryImages.length} fotos</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-3 flex items-center">
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30">
                      {notice.badgeText || 'Aviso Institucional'}
                    </span>
                  </div>
                )}

                {/* Content body */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-white line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {notice.content}
                  </p>

                  {/* Promo coupon if any */}
                  {notice.discountCode && (
                    <div className="mt-2 p-2 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-rose-300">
                        {notice.discountCode}
                      </span>
                      <button
                        onClick={(e) => handleCopyCode(notice.discountCode!, e)}
                        className="px-2 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                        title="Copiar cupón"
                      >
                        {copiedCode === notice.discountCode ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Listo</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Event date if any */}
                  {notice.eventDate && (
                    <div className="mt-2 text-[11px] text-purple-300 flex items-center space-x-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{notice.eventDate} {notice.eventTime ? `• ${notice.eventTime}` : ''}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-3 sm:px-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => handleLike(notice.id, e)}
                  className={`flex items-center space-x-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    isLiked ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{notice.likes || 0}</span>
                </button>

                <span className="text-xs text-blue-400 group-hover:text-blue-300 font-bold flex items-center space-x-1">
                  <span>{notice.actionButtonText || 'Ver detalle'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
