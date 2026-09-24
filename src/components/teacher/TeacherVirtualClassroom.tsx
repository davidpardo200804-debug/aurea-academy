import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UploadCloud,
  FileText,
  Video,
  Download,
  Plus,
  Play,
  FileSpreadsheet,
  Link,
  BookOpen,
} from 'lucide-react';
import { appStorage } from '../../services/storage';

export const TeacherVirtualClassroom: React.FC = () => {
  const { store, currentUser, currentRole, refreshData, playSuccessSound } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState(store.groups[0]?.id || '');
  const [subject, setSubject] = useState(currentUser.specialty || 'Química Orgánica');
  const [type, setType] = useState<'document' | 'video' | 'workshop'>('document');
  const [videoUrl, setVideoUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('2.5 MB');

  const resources = store.resources.filter((res) => {
    // If student, filter by enrolled group or show all; if teacher/admin show all or by selected filter
    if (filterType === 'ALL') return true;
    return res.type === filterType;
  });

  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !groupId) return;

    const group = store.groups.find((g) => g.id === groupId);

    appStorage.addResource({
      title,
      description,
      groupId,
      groupName: group ? group.name : 'Grupo General',
      subject,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      type,
      fileName: fileName || (type === 'video' ? undefined : 'Material_Clase_EduManage.pdf'),
      fileSize: type === 'video' ? undefined : fileSize || '1.8 MB',
      videoUrl: type === 'video' ? videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ' : undefined,
    });

    playSuccessSound();
    refreshData();
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setFileName('');
  };

  const isTeacherOrAdmin = currentRole === 'teacher' || currentRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2.5">
            <UploadCloud className="w-6 h-6 text-indigo-400" />
            <span>Aula Virtual & Repositorio de Recursos Multimedia</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Espacio de aprendizaje con guías pedagógicas en PDF, talleres prácticos y clases en video.
          </p>
        </div>

        {isTeacherOrAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Subir Archivo o Video</span>
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <span className="text-xs font-semibold text-slate-400 px-2">Tipo de recurso:</span>
        {['ALL', 'document', 'video', 'workshop'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
              filterType === t
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t === 'ALL' ? 'Todos' : t === 'document' ? 'Documentos PDF' : t === 'video' ? 'Videos' : 'Talleres'}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {resources.map((res) => (
          <div
            key={res.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {res.subject}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{res.uploadedAt}</span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{res.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{res.description}</p>

              {/* Video Player if video */}
              {res.type === 'video' && res.videoUrl && (
                <div className="mt-4 rounded-xl overflow-hidden aspect-video bg-black/50 border border-slate-800">
                  <iframe
                    src={res.videoUrl}
                    title={res.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* File Attachment Pill if document */}
              {res.type !== 'video' && (
                <div className="mt-4 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white truncate max-w-[200px]">
                        {res.fileName || 'Documento_Academico.pdf'}
                      </div>
                      <div className="text-[10px] text-slate-400">{res.fileSize || '2.4 MB'}</div>
                    </div>
                  </div>

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Descargando material: ${res.fileName || res.title}`);
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </a>
                </div>
              )}

              <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Grupo: {res.groupName}</span>
                <span>Prof: {res.teacherName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Upload Resource */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-4">Publicar Material en Aula Virtual</h2>
            <form onSubmit={handleUploadResource} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título del Recurso *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Taller Preparatorio para Evaluación Final"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Grupo Destino</label>
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Asignatura</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Química, Física, etc."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Contenido</label>
                <div className="flex space-x-2">
                  {(['document', 'video', 'workshop'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        type === t ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {t === 'document' ? 'Documento PDF' : t === 'video' ? 'Video / Clase' : 'Taller Práctico'}
                    </button>
                  ))}
                </div>
              </div>

              {type === 'video' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enlace de Video (YouTube / Vimeo / MP4)
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de Archivo</label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="Guia_Estudio_Corte2.pdf"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tamaño Estimado</label>
                    <input
                      type="text"
                      value={fileSize}
                      onChange={(e) => setFileSize(e.target.value)}
                      placeholder="3.2 MB"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Instrucciones</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles pedagógicos para los alumnos..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white shadow-lg"
                >
                  Publicar Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
