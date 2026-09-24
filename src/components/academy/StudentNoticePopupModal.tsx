import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Tag,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Heart,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Megaphone,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { appStorage } from '../../services/storage';
import { AcademyNotice } from '../../types';

interface StudentNoticePopupModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const StudentNoticePopupModal: React.FC<StudentNoticePopupModalProps> = ({
  forceOpen = false,
  onClose,
}) => {
  const { store, currentUser, setActiveTab, playSuccessSound, refreshData } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Filter notices marked to pop up on login for students
  const popupNotices = (store.academyNotices || []).filter((n) => {
    const isTarget = n.targetAudience === 'todos' || n.targetAudience === 'estudiantes';
    return isTarget && (n.showAsPopupOnLogin || n.pinned || n.category === 'promocion' || n.category === 'evento');
  });

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    // Only auto-open for students
    if (currentUser.role !== 'student') return;

    // Check session storage to avoid spamming on every tab switch within the same session
    const sessionKey = `aurea_popup_seen_${currentUser.id}_${new Date().toISOString().slice(0, 10)}`;
    const alreadySeenToday = sessionStorage.getItem(sessionKey);

    if (!alreadySeenToday && popupNotices.length > 0) {
      // Small delay for smooth entrance animation after dashboard loads
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem(sessionKey, 'true');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [forceOpen, currentUser.id, currentUser.role, popupNotices.length]);

  if (!isOpen || popupNotices.length === 0) return null;

  const currentNotice: AcademyNotice = popupNotices[currentIndex] || popupNotices[0];
  const isLiked = (currentNotice.likedUserIds || []).includes(currentUser.id);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % popupNotices.length);
    setCopiedCode(null);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + popupNotices.length) % popupNotices.length);
    setCopiedCode(null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    playSuccessSound();
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleLike = () => {
    appStorage.toggleNoticeLike(currentNotice.id, currentUser.id);
    playSuccessSound();
    refreshData();
  };

  const handleActionClick = () => {
    setIsOpen(false);
    if (onClose) onClose();
    if (currentNotice.actionTab) {
      setActiveTab(currentNotice.actionTab);
    } else {
      setActiveTab('notices');
    }
  };

  const handleGoToWall = () => {
    setIsOpen(false);
    if (onClose) onClose();
    setActiveTab('notices');
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-pink-500 animate-pulse" />
            <div className="flex items-center space-x-1.5 text-xs font-bold text-white tracking-wide uppercase">
              <Megaphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Novedades & Anuncios de la Academia</span>
            </div>
            {popupNotices.length > 1 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800/80 text-blue-300 border border-blue-500/30">
                {currentIndex + 1} de {popupNotices.length}
              </span>
            )}
          </div>

          <button
            onClick={handleCloseModal}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-4">
          {/* Hero Image / Flyer banner */}
          {currentNotice.imageUrl ? (
            <div className="relative rounded-2xl overflow-hidden shadow-lg group bg-slate-950">
              <img
                src={currentNotice.imageUrl}
                alt={currentNotice.title}
                className="w-full h-56 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                {currentNotice.category === 'promocion' && (
                  <span className="px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-black flex items-center space-x-1 shadow-lg backdrop-blur-xs">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{currentNotice.badgeText || 'PROMO EXCLUSIVA'}</span>
                  </span>
                )}
                {currentNotice.category === 'evento' && (
                  <span className="px-3 py-1 rounded-full bg-purple-600/90 text-white text-xs font-black flex items-center space-x-1 shadow-lg backdrop-blur-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{currentNotice.badgeText || 'EVENTO ESPECIAL'}</span>
                  </span>
                )}
                {currentNotice.category === 'masterclass' && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 text-xs font-black flex items-center space-x-1 shadow-lg backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentNotice.badgeText || 'MASTERCLASS'}</span>
                  </span>
                )}
                {currentNotice.category === 'galeria_fotos' && (
                  <span className="px-3 py-1 rounded-full bg-pink-600/90 text-white text-xs font-black flex items-center space-x-1 shadow-lg backdrop-blur-xs">
                    <span>{currentNotice.badgeText || 'GALERÍA DE FOTOS'}</span>
                  </span>
                )}
                {currentNotice.discountPercent && (
                  <span className="px-2.5 py-1 rounded-full bg-yellow-400 text-slate-950 text-xs font-black shadow-lg">
                    -{currentNotice.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Extra Gallery thumbnails */}
              {currentNotice.galleryImages && currentNotice.galleryImages.length > 1 && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 backdrop-blur-sm border border-slate-700/60">
                  {currentNotice.galleryImages.slice(0, 3).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Thumbnail"
                      className="w-9 h-9 rounded-lg object-cover border border-slate-600/50"
                    />
                  ))}
                  {currentNotice.galleryImages.length > 3 && (
                    <span className="text-[10px] font-bold text-white px-1.5">
                      +{currentNotice.galleryImages.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-28 rounded-2xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-pink-900/40 border border-blue-500/20 flex items-center justify-center p-4">
              <div className="text-center space-y-1">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold inline-flex items-center space-x-1.5">
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>{currentNotice.badgeText || 'Aviso Oficial de la Academia'}</span>
                </span>
              </div>
            </div>
          )}

          {/* Title and metadata */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {currentNotice.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>Publicado por: <strong className="text-slate-300">{currentNotice.authorName}</strong></span>
              <span>•</span>
              <span>{currentNotice.authorRole}</span>
              <span>•</span>
              <span>{currentNotice.publishedAt}</span>
            </div>
          </div>

          {/* Promotion Coupon Box */}
          {currentNotice.discountCode && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 to-pink-950/30 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-rose-300 flex items-center space-x-1.5">
                  <Tag className="w-4 h-4 text-rose-400" />
                  <span>Cupón de Descuento Especial Alumnos:</span>
                </div>
                <div className="text-xs text-slate-300">
                  {currentNotice.validUntil ? `Válido hasta el ${currentNotice.validUntil}` : 'Por tiempo limitado'}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm sm:text-base font-black px-3.5 py-1.5 rounded-xl bg-slate-950 text-rose-300 border border-rose-500/50 tracking-wider">
                  {currentNotice.discountCode}
                </span>
                <button
                  onClick={() => handleCopyCode(currentNotice.discountCode!)}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center space-x-1 shadow-md active:scale-95 cursor-pointer"
                >
                  {copiedCode === currentNotice.discountCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
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

          {/* Event Details Box */}
          {(currentNotice.eventDate || currentNotice.eventLocation || currentNotice.eventTime) && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-indigo-950/30 border border-purple-500/40 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              {currentNotice.eventDate && (
                <div className="flex items-center space-x-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Fecha:</span>
                    <strong className="text-white">{currentNotice.eventDate}</strong>
                  </div>
                </div>
              )}
              {currentNotice.eventTime && (
                <div className="flex items-center space-x-2 text-slate-300">
                  <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Horario:</span>
                    <strong className="text-white">{currentNotice.eventTime}</strong>
                  </div>
                </div>
              )}
              {currentNotice.eventLocation && (
                <div className="flex items-center space-x-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Lugar:</span>
                    <strong className="text-white truncate max-w-[150px]">{currentNotice.eventLocation}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description Content */}
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
            {currentNotice.content}
          </div>

          {/* Interactive Bar: Likes & Wall redirect */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleLike}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                isLiked
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''} transition-transform`} />
              <span>{currentNotice.likes || 0} Me gusta</span>
            </button>

            <button
              onClick={handleGoToWall}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <span>Ver todos los avisos en el muro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Navigation & Primary Actions */}
        <div className="bg-slate-950 px-5 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Carousel Arrows */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
            {popupNotices.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Anuncio anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex space-x-1.5 px-2">
                  {popupNotices.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentIndex === i ? 'w-6 bg-blue-500' : 'w-2 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Siguiente anuncio"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Entendido / Cerrar
            </button>

            {currentNotice.actionButtonText && (
              <button
                onClick={handleActionClick}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <span>{currentNotice.actionButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
