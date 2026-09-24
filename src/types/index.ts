export type UserRole = 'admin' | 'teacher' | 'student' | 'agent';

export type AdministrativeTitle = 'administrador' | 'directora_academica' | 'coordinador';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  cargo?: string; // e.g., 'Administrador General', 'Directora Académica', 'Coordinador Académico', 'Docente Titular'
  administrativeTitle?: AdministrativeTitle;
  avatar: string;
  phone: string;
  documentId: string;
  active: boolean;
  createdAt: string;
  specialty?: string; // Para docentes
  gradeLevel?: string; // Para estudiantes (e.g. 11°, 10°)
  ratePerClass?: number; // Tarifa oficial por clase asignada por administración (no alterable por el docente)
  assignedSalary?: number; // Salario base mensual asignado en contrato
}

export interface GroupCourse {
  id: string;
  code: string;
  name: string;
  description: string;
  teacherId: string;
  teacherName: string;
  level: string;
  shift: 'Mañana' | 'Tarde' | 'Noche' | 'Fines de Semana';
  maxCapacity: number;
  enrolledStudentIds: string[];
  status: 'active' | 'upcoming' | 'completed';
  startDate: string;
  endDate: string;
  monthlyFee: number;
  room: string;
}

export interface StudentEnrollment {
  id: string;
  userId: string;
  fullName: string;
  avatar?: string;
  email: string;
  documentId: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  groupId: string;
  groupName: string;
  enrollmentDate: string;
  status: 'activo' | 'inactivo' | 'suspendido';
  paymentPlan: 'Mensual' | 'Semestral' | 'Beca Completa';
  monthlyAmount: number;
  balanceDue: number;
}

export interface GradeItem {
  id: string;
  studentId: string;
  studentName: string;
  groupId: string;
  subject: string;
  period: 'Corte 1' | 'Corte 2' | 'Corte 3' | 'Examen Final';
  score: number; // 0.0 - 5.0
  weight: number; // porcentaje (ej: 25)
  feedback: string;
  date: string;
  teacherId: string;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  concept: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pagado' | 'pendiente' | 'vencido';
  referenceCode: string;
  paymentMethod?: 'PSE' | 'Tarjeta de Crédito' | 'Transferencia Bancaria' | 'Efectivo';
  receiptUrl?: string;
  notes?: string;
}

export interface TeacherInvoice {
  id: string;
  teacherId: string;
  teacherName: string;
  monthPeriod: string; // ej: "Septiembre 2026"
  classCount?: number; // Clases dictadas en el mes
  ratePerClass?: number; // Tarifa fija fijada en el contrato del docente
  hoursWorked?: number; // Para compatibilidad
  hourlyRate?: number; // Para compatibilidad
  totalAmount: number; // classCount * ratePerClass
  concept: string;
  supportDocName?: string;
  status: 'pendiente' | 'aprobado' | 'pagado' | 'rechazado';
  submissionDate: string;
  paymentDate?: string;
  adminNotes?: string;
}

export interface ResourceMaterial {
  id: string;
  title: string;
  description: string;
  groupId: string;
  groupName: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  type: 'document' | 'video' | 'link' | 'workshop';
  fileUrl?: string;
  videoUrl?: string;
  fileName?: string;
  fileSize?: string;
  uploadedAt: string;
}

export interface ForumTopic {
  id: string;
  title: string;
  content: string;
  groupId: string;
  groupName: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  createdAt: string;
  tags: string[];
  likes: number;
  isPinned?: boolean;
}

export interface ForumReply {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: 'reunion' | 'academico' | 'pago' | 'evaluacion' | 'feriado';
  targetRoles: UserRole[];
  location: string;
  createdBy: string;
}

export interface TeacherInduction {
  id: string;
  title: string;
  description: string;
  moduleCount: number;
  duration: string;
  videoUrl: string;
  materialsUrl?: string;
  deadline: string;
  mandatory: boolean;
  completedByTeacherIds: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId?: string; // Si es chat privado
  groupId?: string; // Si es chat de grupo/canal
  text: string;
  timestamp: string;
  read: boolean;
}

export interface AppNotification {
  id: string;
  targetUserId: string | 'all' | UserRole;
  title: string;
  message: string;
  type: 'payment' | 'grade' | 'event' | 'chat' | 'system';
  read: boolean;
  timestamp: string;
  targetTab?: string;
}

export interface CourseProjection {
  id: string;
  name: string;
  category: string;
  targetAudience: string;
  plannedStartDate: string;
  durationMonths: number;
  estimatedTuitionFee: number;
  targetStudents: number;
  currentPreRegistered: number;
  assignedTeacherId?: string;
  projectedRevenue: number;
  status: 'en_estudio' | 'aprobado' | 'convocatoria_abierta';
}

export interface StaffCallSession {
  id: string;
  callerId: string;
  callerName: string;
  callerAvatar: string;
  callerRole: UserRole;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  receiverRole: UserRole;
  type: 'audio' | 'video';
  status: 'ringing' | 'connected' | 'ended' | 'missed';
  startedAt: string;
  durationSeconds: number;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'user' | 'business' | 'ai';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  suggestedByAI?: boolean;
  // Multi-agent attribution
  respondedBy?: string;
  respondedById?: string;
  respondedByRole?: 'admin' | 'agent';
  respondedByCargo?: string;
  respondedByAvatar?: string;
  templateUsed?: string;
}

export type WhatsAppRecruitmentStage =
  | 'nuevo_prospecto'
  | 'informacion_enviada'
  | 'visita_agendada'
  | 'esperando_pago'
  | 'matriculado';

export interface WhatsAppConversation {
  id: string;
  contactName: string;
  phoneNumber: string;
  avatar: string;
  type: 'aspirante' | 'padre_familia' | 'estudiante' | 'docente';
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: WhatsAppMessage[];
  aiAutoReplyEnabled?: boolean;
  // Multi-agent & Recruitment fields
  assignedAgentId?: string;
  assignedAgentName?: string;
  lastRespondedBy?: string;
  lastRespondedById?: string;
  lastRespondedByRole?: 'admin' | 'agent';
  lastRespondedByAvatar?: string;
  programOfInterest?: string;
  recruitmentStage?: WhatsAppRecruitmentStage;
  recruitmentNotes?: string;
}

export interface AdminNote {
  id: string;
  title: string;
  content: string;
  category: 'reunion' | 'acuerdo' | 'urgente' | 'idea' | 'general';
  color: 'yellow' | 'emerald' | 'indigo' | 'rose' | 'amber';
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  checklist?: { id: string; text: string; done: boolean }[];
}

export type CertificateType =
  | 'estudios_activo'
  | 'notas_calificaciones'
  | 'buena_conducta'
  | 'paz_y_salvo'
  | 'calificaciones_parcial'
  | 'constancia_matricula';

export interface CertificateRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentDocument: string;
  studentGrade: string;
  certificateType: CertificateType;
  purpose: string;
  status: 'generado' | 'pendiente' | 'aprobado';
  requestedAt: string;
  issueDate: string;
  verificationCode: string;
  signedBy: string;
}

// ==========================================
// CONTABILIDAD: INGRESOS, EGRESOS Y ACTIVOS FIJOS
// ==========================================
export type AccountingEntryType = 'ingreso' | 'egreso';

export type IncomeCategory =
  | 'Matrícula'
  | 'Mensualidad / Curso'
  | 'Venta Kits & Cosméticos'
  | 'Servicios Salón Escuela'
  | 'Seminarios & Masterclasses'
  | 'Certificados & Diplomas'
  | 'Otros Ingresos';

export type ExpenseCategory =
  | 'Nómina & Honorarios Docentes'
  | 'Arriendo de Sede'
  | 'Servicios Públicos (Agua/Luz/Net)'
  | 'Insumos Químicos & Cosméticos'
  | 'Mantenimiento de Equipos'
  | 'Marketing, Redes & Publicidad'
  | 'Papelería & Aseo'
  | 'Impuestos & Tasas'
  | 'Otros Egresos';

export interface AccountingEntry {
  id: string;
  type: AccountingEntryType;
  category: IncomeCategory | ExpenseCategory | string;
  concept: string;
  amount: number;
  date: string; // YYYY-MM-DD
  paymentMethod: 'Efectivo' | 'Nequi' | 'Daviplata' | 'Transferencia Bancaria' | 'Tarjeta Débito/Crédito' | 'PSE';
  voucherNumber?: string; // Recibo de Caja o Comprobante de Egreso
  beneficiaryOrClient?: string; // Alumno, Cliente o Proveedor
  registeredBy: string;
  notes?: string;
  createdAt: string;
}

export type FixedAssetCategory =
  | 'Mobiliario & Estaciones'
  | 'Equipos Térmicos & Eléctricos'
  | 'Herramientas de Corte & Estilo'
  | 'Estética Facial & Corporal'
  | 'Cómputo & Tecnología'
  | 'Seguridad & Bioseguridad';

export type FixedAssetCondition = 'Excelente' | 'Bueno' | 'Regular' | 'En Mantenimiento' | 'De Baja';

export interface FixedAsset {
  id: string;
  code: string; // Placa ej: ACT-001
  name: string;
  category: FixedAssetCategory;
  purchaseDate: string;
  purchaseCost: number;
  currentValue: number;
  condition: FixedAssetCondition;
  location: string; // ej: Aula 1 Peluquería, Cabina de Estética, etc.
  serialNumber?: string;
  brand?: string;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
}

// ==========================================
// ASISTENCIA Y LLAMADO A LISTA
// ==========================================
export type AttendanceStatus = 'presente' | 'tardanza' | 'excusa' | 'falta';

export interface StudentAttendanceItem {
  studentId: string;
  studentName: string;
  studentDocument?: string;
  avatar?: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceSession {
  id: string;
  groupId: string;
  groupName: string;
  date: string; // YYYY-MM-DD
  shift: string; // Mañana, Tarde, etc.
  teacherId: string;
  teacherName: string;
  topicCovered: string; // Práctica / Tema visto
  records: StudentAttendanceItem[];
  totalStudents: number;
  presentCount: number;
  lateCount: number;
  excusedCount: number;
  absentCount: number;
  createdAt: string;
}

// ==========================================
// PENSUM, PRÁCTICAS, OBSERVADOR Y COMUNICACIÓN
// ==========================================
export interface PensumModule {
  id: string;
  code: string;
  name: string;
  program: string; // ej: 'Peluquería Integral & Estilismo', 'Barbería Profesional'
  cycleOrSemester: number; // 1, 2, 3...
  theoryHours: number;
  practiceHours: number;
  totalHours: number;
  competencies: string[];
  prerequisites?: string;
  description: string;
  order: number;
}

export interface StudentModuleGrade {
  id: string;
  studentId: string;
  studentName: string;
  studentDocument?: string;
  groupId: string;
  groupName: string;
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  theoryScore: number; // 0.0 - 5.0 (30%)
  practiceScore: number; // 0.0 - 5.0 (50%)
  biosecurityScore: number; // 0.0 - 5.0 (20%)
  finalScore: number; // 0.0 - 5.0
  status: 'aprobado' | 'reprobado' | 'en_curso';
  feedback: string;
  teacherId: string;
  teacherName: string;
  updatedAt: string;
}

export type SalonServiceCategory =
  | 'Corte de Cabello Femenino/Masculino'
  | 'Colorimetría Avanzada & Balayage'
  | 'Barbería, Fade & Barba'
  | 'Manicura, Pedicura & Nail Art'
  | 'Maquillaje Social & Fiesta'
  | 'Tratamientos Capilares & Alisados'
  | 'Peinados, Brushing & Ondas';

export interface SalonPracticeRecord {
  id: string;
  studentId: string;
  studentName: string;
  groupId: string;
  groupName: string;
  date: string;
  serviceCategory: SalonServiceCategory;
  modelClientName: string;
  modelClientPhone?: string;
  serviceDescription: string;
  technicalFormulas?: string; // fórmulas de tintes, mezclas, técnica
  practiceHours: number;
  supervisorTeacherId: string;
  supervisorTeacherName: string;
  status: 'pendiente_revision' | 'aprobado' | 'requiere_correccion';
  score?: number; // 0.0 - 5.0
  teacherObservations?: string;
  verifiedSignature: boolean;
  createdAt: string;
}

export type ObserverEntryType =
  | 'felicitacion_merito'
  | 'llamado_atencion'
  | 'falta_bioseguridad'
  | 'compromiso_academico'
  | 'citacion_acudiente';

export interface StudentObserverEntry {
  id: string;
  studentId: string;
  studentName: string;
  studentDocument: string;
  groupId: string;
  groupName: string;
  date: string;
  entryType: ObserverEntryType;
  title: string;
  description: string;
  studentCommitment?: string;
  guardianNotified: boolean;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  status: 'activo' | 'en_seguimiento' | 'cumplido_cerrado';
  createdAt: string;
}

export interface AcademyNotice {
  id: string;
  title: string;
  content: string;
  category:
    | 'urgente'
    | 'practicas_modelos'
    | 'academico'
    | 'masterclass'
    | 'secretaria'
    | 'promocion'
    | 'evento'
    | 'galeria_fotos';
  targetAudience: 'todos' | 'estudiantes' | 'docentes';
  authorName: string;
  authorRole: string;
  pinned: boolean;
  publishedAt: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  badgeText?: string;
  imageUrl?: string;
  galleryImages?: string[];
  discountCode?: string;
  discountPercent?: number;
  validUntil?: string;
  actionButtonText?: string;
  actionTab?: string;
  actionUrl?: string;
  likes?: number;
  likedUserIds?: string[];
  showAsPopupOnLogin?: boolean;
}

export interface TeacherStudentMsg {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  recipientId: string;
  recipientName: string;
  recipientRole: UserRole;
  recipientAvatar: string;
  subject?: string;
  message: string;
  timestamp: string;
  read: boolean;
  attachmentName?: string;
}

// ==========================================
// CALL CENTER, MATRÍCULAS, COMISIONES Y AGENDAS
// ==========================================
export type CallCenterScheduleType =
  | 'llamada_seguimiento'
  | 'visita_sede'
  | 'cierre_matricula'
  | 'recordatorio_pago';

export type CallCenterScheduleStatus =
  | 'pendiente'
  | 'realizada'
  | 'pospuesta'
  | 'cancelada'
  | 'matriculado';

export interface CallCenterScheduleItem {
  id: string;
  prospectName: string;
  phone: string;
  email?: string;
  programOfInterest: string;
  preferredShift?: 'Mañana' | 'Tarde' | 'Sábados';
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  type: CallCenterScheduleType;
  status: CallCenterScheduleStatus;
  agentId: string;
  agentName: string;
  notes?: string;
  createdAt: string;
}

export interface AgentEnrollmentRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentDocument: string;
  studentPhone: string;
  studentEmail: string;
  guardianName?: string;
  guardianPhone?: string;
  programName: string;
  groupId: string;
  groupName: string;
  shift: string;
  enrollmentDate: string; // YYYY-MM-DD
  totalTuitionFee: number;
  initialPayment: number;
  paymentMethod: 'Efectivo' | 'Nequi' | 'Daviplata' | 'Transferencia Bancaria' | 'PSE' | 'Tarjeta';
  voucherNumber?: string;
  discountAmount?: number;
  discountAuthorizedBy?: string;
  agentId: string;
  agentName: string;
  commissionEarned: number; // e.g. 50000 COP
  commissionStatus: 'pendiente' | 'aprobada' | 'liquidada_pagada';
  notes?: string;
  receiptGenerated: boolean;
}

export interface AgentCommissionSummary {
  agentId: string;
  agentName: string;
  month: string; // e.g. '2026-09'
  enrollmentCount: number;
  baseCommissionTotal: number;
  bonusAmount: number;
  totalCommission: number;
  status: 'pendiente' | 'aprobada' | 'liquidada_pagada';
  lastPayoutDate?: string;
  payoutVoucherNumber?: string;
}

export type AdminAgentMessageType =
  | 'text'
  | 'discount_request'
  | 'capacity_query'
  | 'urgent_alert'
  | 'discount_approved'
  | 'discount_rejected';

export interface AdminAgentMessage {
  id: string;
  agentId: string;
  agentName: string;
  senderId: string;
  senderName: string;
  senderRole: 'agent' | 'admin';
  message: string;
  timestamp: string;
  date: string;
  type: AdminAgentMessageType;
  channelId?: string;
  recipientId?: string;
  recipientName?: string;
  priority?: 'normal' | 'urgente' | 'aprobacion_inmediata';
  quoteProspectName?: string;
  quoteProgramName?: string;
  attachmentName?: string;
  discountRequestData?: {
    prospectName: string;
    programName: string;
    standardFee: number;
    discountPercent: number;
    discountedFee: number;
    status: 'pendiente' | 'aprobado' | 'rechazado';
    authorizedBy?: string;
  };
  read: boolean;
}

export interface RolePermissions {
  dashboard: boolean;
  callCenter: boolean;
  chatCenter: boolean;
  students: boolean;
  groups: boolean;
  finances: boolean;
  accounting: boolean;
  attendance: boolean;
  grades: boolean;
  pensum: boolean;
  practices: boolean;
  observer: boolean;
  teacherStudentChat: boolean;
  notices: boolean;
  resources: boolean;
  forums: boolean;
  calendar: boolean;
  projections: boolean;
  invoices: boolean;
  inductions: boolean;
  users: boolean;
  permissions: boolean;
  backup: boolean;
  chat: boolean;
  staffChat: boolean;
  whatsapp: boolean;
  security: boolean;
  notepad: boolean;
  certificates: boolean;
}

export type RolePermissionsMap = Record<UserRole, RolePermissions>;

export interface AppDataStore {
  users: User[];
  groups: GroupCourse[];
  enrollments: StudentEnrollment[];
  grades: GradeItem[];
  payments: PaymentRecord[];
  invoices: TeacherInvoice[];
  resources: ResourceMaterial[];
  forums: ForumTopic[];
  replies: ForumReply[];
  events: CalendarEvent[];
  inductions: TeacherInduction[];
  projections: CourseProjection[];
  chats: ChatMessage[];
  staffCalls: StaffCallSession[];
  whatsappChats: WhatsAppConversation[];
  adminNotes: AdminNote[];
  certificateRequests: CertificateRequest[];
  accounting: AccountingEntry[];
  fixedAssets: FixedAsset[];
  attendanceSessions: AttendanceSession[];
  pensumModules: PensumModule[];
  moduleGrades: StudentModuleGrade[];
  practiceRecords: SalonPracticeRecord[];
  observerEntries: StudentObserverEntry[];
  academyNotices: AcademyNotice[];
  teacherStudentMessages: TeacherStudentMsg[];
  callCenterSchedules: CallCenterScheduleItem[];
  agentEnrollments: AgentEnrollmentRecord[];
  agentCommissions: AgentCommissionSummary[];
  adminAgentMessages: AdminAgentMessage[];
  notifications: AppNotification[];
  permissions: RolePermissionsMap;
  lastBackupDate: string;
}
