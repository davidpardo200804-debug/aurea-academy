import {
  User,
  UserRole,
  GroupCourse,
  StudentEnrollment,
  GradeItem,
  PaymentRecord,
  TeacherInvoice,
  ResourceMaterial,
  ForumTopic,
  ForumReply,
  CalendarEvent,
  TeacherInduction,
  ChatMessage,
  AppNotification,
  CourseProjection,
  RolePermissions,
  RolePermissionsMap,
  AppDataStore,
  StaffCallSession,
  WhatsAppConversation,
  WhatsAppMessage,
  WhatsAppRecruitmentStage,
  AdminNote,
  CertificateRequest,
  AccountingEntry,
  FixedAsset,
  AttendanceSession,
  PensumModule,
  StudentModuleGrade,
  SalonPracticeRecord,
  StudentObserverEntry,
  AcademyNotice,
  TeacherStudentMsg,
  CallCenterScheduleItem,
  AgentEnrollmentRecord,
  AgentCommissionSummary,
  AdminAgentMessage,
} from '../types';
import {
  INITIAL_PENSUM_MODULES,
  INITIAL_MODULE_GRADES,
  INITIAL_PRACTICE_RECORDS,
  INITIAL_OBSERVER_ENTRIES,
  INITIAL_ACADEMY_NOTICES,
  INITIAL_TEACHER_STUDENT_MESSAGES,
} from './academyData';
import {
  INITIAL_CALL_CENTER_SCHEDULES,
  INITIAL_AGENT_ENROLLMENTS,
  INITIAL_AGENT_COMMISSIONS,
  INITIAL_ADMIN_AGENT_MESSAGES,
} from './callCenterData';

export const DEFAULT_ROLE_PERMISSIONS: RolePermissionsMap = {
  admin: {
    dashboard: true,
    callCenter: true,
    chatCenter: true,
    students: true,
    groups: true,
    finances: true,
    accounting: true,
    attendance: true,
    grades: true,
    pensum: true,
    practices: true,
    observer: true,
    teacherStudentChat: true,
    notices: true,
    resources: true,
    forums: true,
    calendar: true,
    projections: true,
    invoices: true,
    inductions: true,
    users: true,
    permissions: true,
    backup: true,
    chat: true,
    staffChat: true,
    whatsapp: true,
    security: true,
    notepad: true,
    certificates: true,
  },
  teacher: {
    dashboard: true,
    callCenter: false,
    chatCenter: false,
    students: false,
    groups: true,
    finances: false,
    accounting: false,
    attendance: true,
    grades: true,
    pensum: true,
    practices: true,
    observer: true,
    teacherStudentChat: true,
    notices: true,
    resources: true,
    forums: true,
    calendar: true,
    projections: false,
    invoices: true,
    inductions: true,
    users: false,
    permissions: false,
    backup: false,
    chat: true,
    staffChat: true,
    whatsapp: false,
    security: false,
    notepad: false,
    certificates: false,
  },
  student: {
    dashboard: true,
    callCenter: false,
    chatCenter: false,
    students: false,
    groups: false,
    finances: true,
    accounting: false,
    attendance: true,
    grades: true,
    pensum: true,
    practices: true,
    observer: true,
    teacherStudentChat: true,
    notices: true,
    resources: true,
    forums: true,
    calendar: true,
    projections: false,
    invoices: false,
    inductions: false,
    users: false,
    permissions: false,
    backup: false,
    chat: true,
    staffChat: false,
    whatsapp: false,
    security: false,
    notepad: false,
    certificates: true,
  },
  agent: {
    dashboard: true,
    callCenter: true,
    chatCenter: true,
    students: true,
    groups: true,
    finances: false,
    accounting: false,
    attendance: false,
    grades: false,
    pensum: true,
    practices: false,
    observer: false,
    teacherStudentChat: false,
    notices: true,
    resources: false,
    forums: false,
    calendar: true,
    projections: true,
    invoices: false,
    inductions: false,
    users: false,
    permissions: false,
    backup: false,
    chat: true,
    staffChat: false,
    whatsapp: true,
    security: false,
    notepad: true,
    certificates: false,
  },
};

// Pre-seeded initial users
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Lic. Carlos Mendoza',
    email: 'admin@arteyestilo.edu.co',
    password: 'admin',
    role: 'admin',
    cargo: 'Director General',
    administrativeTitle: 'administrador',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+57 310 456 7890',
    documentId: 'CC 80.123.456',
    active: true,
    createdAt: '2026-01-10',
  },
  {
    id: 'usr-admin-2',
    name: 'Dra. Sofía Valenzuela',
    email: 'directora.academica@arteyestilo.edu.co',
    password: 'admin',
    role: 'admin',
    cargo: 'Directora Académica',
    administrativeTitle: 'directora_academica',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+57 312 990 1234',
    documentId: 'CC 51.442.901',
    active: true,
    createdAt: '2026-01-12',
  },
  {
    id: 'usr-admin-3',
    name: 'Lic. Gabriel Torres',
    email: 'coordinacion@arteyestilo.edu.co',
    password: 'admin',
    role: 'admin',
    cargo: 'Coordinador Académico & Convivencia',
    administrativeTitle: 'coordinador',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '+57 314 556 7788',
    documentId: 'CC 80.887.332',
    active: true,
    createdAt: '2026-01-15',
  },
  {
    id: 'usr-teach-1',
    name: 'Prof. Elena Restrepo',
    email: 'elena@arteyestilo.edu.co',
    password: 'prof',
    role: 'teacher',
    cargo: 'Docente Máster en Colorimetría & Estilismo',
    ratePerClass: 48000,
    assignedSalary: 2400000,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+57 315 889 0123',
    documentId: 'CC 52.987.654',
    specialty: 'Colorimetría Avanzada, Balayage & Estilismo Capilar',
    active: true,
    createdAt: '2026-01-15',
  },
  {
    id: 'usr-teach-2',
    name: 'Prof. Marcos Silva',
    email: 'marcos@arteyestilo.edu.co',
    password: 'prof',
    role: 'teacher',
    cargo: 'Docente Máster en Barbería Urbana & Fade',
    ratePerClass: 55000,
    assignedSalary: 2750000,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+57 320 112 3344',
    documentId: 'CC 79.654.321',
    specialty: 'Barbería Urbana, Fade & Técnicas de Navaja',
    active: true,
    createdAt: '2026-02-01',
  },
  {
    id: 'usr-agent-1',
    name: 'Camila Morales',
    email: 'camila.admisiones@arteyestilo.edu.co',
    password: 'asesor',
    role: 'agent',
    cargo: 'Líder de Call Center & Admisiones',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+57 318 456 9012',
    documentId: 'CC 1.098.765.432',
    active: true,
    createdAt: '2026-02-01',
  },
  {
    id: 'usr-agent-2',
    name: 'Valentina Osorio',
    email: 'valentina.admisiones@arteyestilo.edu.co',
    password: 'asesor',
    role: 'agent',
    cargo: 'Asesora de Matrículas & Telemercadeo',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '+57 319 765 4321',
    documentId: 'CC 1.014.234.890',
    active: true,
    createdAt: '2026-02-10',
  },
  {
    id: 'usr-stud-1',
    name: 'Sofía Ramírez Díaz',
    email: 'sofia@arteyestilo.edu.co',
    password: 'est',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+57 301 223 3445',
    documentId: 'TI 1.025.789.444',
    gradeLevel: 'Ciclo 2 - Salón Escuela',
    active: true,
    createdAt: '2026-02-10',
  },
  {
    id: 'usr-stud-2',
    name: 'Mateo Castro Gómez',
    email: 'mateo@arteyestilo.edu.co',
    password: 'est',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    phone: '+57 318 998 7766',
    documentId: 'TI 1.032.441.982',
    gradeLevel: 'Ciclo 1 - Barbería Avanzada',
    active: true,
    createdAt: '2026-02-12',
  },
  {
    id: 'usr-stud-3',
    name: 'Valentina Morales Rios',
    email: 'valentina@arteyestilo.edu.co',
    password: 'est',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '+57 312 334 5566',
    documentId: 'TI 1.018.665.231',
    gradeLevel: 'Ciclo 1 - Manicura & Spa',
    active: true,
    createdAt: '2026-02-15',
  },
];

export const INITIAL_GROUPS: GroupCourse[] = [
  {
    id: 'grp-pel-01',
    code: 'TEC-PEL-01',
    name: 'Técnico Laboral en Peluquería Integral & Estilismo',
    description: 'Colorimetría avanzada, cortes de tendencia, alisados orgánicos y salón escuela supervisado',
    teacherId: 'usr-teach-1',
    teacherName: 'Prof. Elena Restrepo',
    level: 'Ciclo Profesional',
    shift: 'Mañana',
    maxCapacity: 25,
    enrolledStudentIds: ['usr-stud-1'],
    status: 'active',
    startDate: '2026-02-01',
    endDate: '2026-11-28',
    monthlyFee: 280000,
    room: 'Salón Escuela 1 - Bloque Peluquería',
  },
  {
    id: 'grp-barb-02',
    code: 'BARB-02',
    name: 'Taller Máster de Barbería Profesional, Fade & Barba',
    description: 'Manejo de clípper, low/mid/high fade, ritual de barba con toalla caliente y navaja',
    teacherId: 'usr-teach-2',
    teacherName: 'Prof. Marcos Silva',
    level: 'Ciclo Especializado',
    shift: 'Tarde',
    maxCapacity: 20,
    enrolledStudentIds: ['usr-stud-2'],
    status: 'active',
    startDate: '2026-02-05',
    endDate: '2026-10-15',
    monthlyFee: 250000,
    room: 'Barber Shop Studio Academy',
  },
  {
    id: 'grp-unas-03',
    code: 'DIP-UNA-03',
    name: 'Diplomado en Manicura Rusa, Acrílico & Nail Art',
    description: 'Esmaltado semipermanente, escultura en acrílico, polygel, bioseguridad y diseño 3D',
    teacherId: 'usr-teach-1',
    teacherName: 'Prof. Elena Restrepo',
    level: 'Diplomado Técnico',
    shift: 'Fines de Semana',
    maxCapacity: 18,
    enrolledStudentIds: ['usr-stud-3'],
    status: 'active',
    startDate: '2026-03-01',
    endDate: '2026-08-30',
    monthlyFee: 220000,
    room: 'Aula Spa de Uñas & Manicura',
  },
];

export const INITIAL_ENROLLMENTS: StudentEnrollment[] = [
  {
    id: 'enr-1',
    userId: 'usr-stud-1',
    fullName: 'Sofía Ramírez Díaz',
    email: 'sofia@arteyestilo.edu.co',
    documentId: 'TI 1.025.789.444',
    phone: '+57 301 223 3445',
    guardianName: 'Martha Díaz (Madre)',
    guardianPhone: '+57 311 556 7788',
    groupId: 'grp-pel-01',
    groupName: 'Técnico Laboral en Peluquería Integral & Estilismo',
    enrollmentDate: '2026-01-20',
    status: 'activo',
    paymentPlan: 'Mensual',
    monthlyAmount: 280000,
    balanceDue: 0, // Al día
  },
  {
    id: 'enr-2',
    userId: 'usr-stud-2',
    fullName: 'Mateo Castro Gómez',
    email: 'mateo@arteyestilo.edu.co',
    documentId: 'TI 1.032.441.982',
    phone: '+57 318 998 7766',
    guardianName: 'Jorge Castro (Padre)',
    guardianPhone: '+57 316 224 8899',
    groupId: 'grp-barb-02',
    groupName: 'Taller Máster de Barbería Profesional, Fade & Barba',
    enrollmentDate: '2026-01-22',
    status: 'activo',
    paymentPlan: 'Mensual',
    monthlyAmount: 250000,
    balanceDue: 0,
  },
  {
    id: 'enr-3',
    userId: 'usr-stud-3',
    fullName: 'Valentina Morales Rios',
    email: 'valentina@arteyestilo.edu.co',
    documentId: 'TI 1.018.665.231',
    phone: '+57 312 334 5566',
    guardianName: 'Gloria Rios (Madre)',
    guardianPhone: '+57 314 990 1122',
    groupId: 'grp-unas-03',
    groupName: 'Diplomado en Manicura Rusa, Acrílico & Nail Art',
    enrollmentDate: '2026-01-25',
    status: 'activo',
    paymentPlan: 'Mensual',
    monthlyAmount: 220000,
    balanceDue: 0, // Al día
  },
];

export const INITIAL_GRADES: GradeItem[] = [
  {
    id: 'grd-1',
    studentId: 'usr-stud-1',
    studentName: 'Sofía Ramírez Díaz',
    groupId: 'grp-11a',
    subject: 'Química Orgánica',
    period: 'Corte 1',
    score: 4.8,
    weight: 30,
    feedback: 'Excelente desempeño en el laboratorio de síntesis de hidrocarburos.',
    date: '2026-03-10',
    teacherId: 'usr-teach-1',
  },
  {
    id: 'grd-2',
    studentId: 'usr-stud-1',
    studentName: 'Sofía Ramírez Díaz',
    groupId: 'grp-11a',
    subject: 'Física y Cálculo',
    period: 'Corte 1',
    score: 4.5,
    weight: 30,
    feedback: 'Muy buena comprensión de límites trigonométricos.',
    date: '2026-03-12',
    teacherId: 'usr-teach-2',
  },
  {
    id: 'grd-3',
    studentId: 'usr-stud-2',
    studentName: 'Mateo Castro Gómez',
    groupId: 'grp-11a',
    subject: 'Química Orgánica',
    period: 'Corte 1',
    score: 3.2,
    weight: 30,
    feedback: 'Debe reforzar la nomenclatura IUPAC de grupos funcionales.',
    date: '2026-03-10',
    teacherId: 'usr-teach-1',
  },
  {
    id: 'grd-4',
    studentId: 'usr-stud-2',
    studentName: 'Mateo Castro Gómez',
    groupId: 'grp-11a',
    subject: 'Física y Cálculo',
    period: 'Corte 1',
    score: 2.8,
    weight: 30,
    feedback: 'Requiere plan de mejoramiento para la evaluación remedial de cinemática.',
    date: '2026-03-14',
    teacherId: 'usr-teach-2',
  },
  {
    id: 'grd-5',
    studentId: 'usr-stud-3',
    studentName: 'Valentina Morales Rios',
    groupId: 'grp-10t',
    subject: 'Programación JavaScript & React',
    period: 'Corte 1',
    score: 4.9,
    weight: 35,
    feedback: 'Proyecto de portafolio web con código impecable y modular.',
    date: '2026-03-15',
    teacherId: 'usr-teach-2',
  },
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    studentId: 'usr-stud-1',
    studentName: 'Sofía Ramírez Díaz',
    concept: 'Matrícula Anual 2026',
    amount: 350000,
    dueDate: '2026-02-05',
    paidDate: '2026-02-02',
    status: 'pagado',
    referenceCode: 'REC-2026-0081',
    paymentMethod: 'PSE',
    notes: 'Aprobado automáticamente por pasarela Bancolombia.',
  },
  {
    id: 'pay-2',
    studentId: 'usr-stud-1',
    studentName: 'Sofía Ramírez Díaz',
    concept: 'Pensión / Mensualidad Marzo 2026',
    amount: 180000,
    dueDate: '2026-03-10',
    paidDate: '2026-03-08',
    status: 'pagado',
    referenceCode: 'REC-2026-0145',
    paymentMethod: 'Tarjeta de Crédito',
    notes: 'Pago exitoso.',
  },
  {
    id: 'pay-3',
    studentId: 'usr-stud-2',
    studentName: 'Mateo Castro Gómez',
    concept: 'Matrícula Anual 2026',
    amount: 350000,
    dueDate: '2026-02-05',
    paidDate: '2026-02-04',
    status: 'pagado',
    referenceCode: 'REC-2026-0099',
    paymentMethod: 'Transferencia Bancaria',
    notes: 'Comprobante verificado por tesorería.',
  },
  {
    id: 'pay-4',
    studentId: 'usr-stud-2',
    studentName: 'Mateo Castro Gómez',
    concept: 'Pensión / Mensualidad Marzo 2026',
    amount: 180000,
    dueDate: '2026-03-10',
    status: 'vencido',
    referenceCode: 'COB-2026-0302',
    notes: 'Recordatorio enviado vía correo y notificación push.',
  },
  {
    id: 'pay-5',
    studentId: 'usr-stud-3',
    studentName: 'Valentina Morales Rios',
    concept: 'Pensión / Mensualidad Marzo 2026',
    amount: 210000,
    dueDate: '2026-03-10',
    paidDate: '2026-03-05',
    status: 'pagado',
    referenceCode: 'REC-2026-0130',
    paymentMethod: 'PSE',
  },
];

export const INITIAL_INVOICES: TeacherInvoice[] = [
  {
    id: 'inv-1',
    teacherId: 'usr-teach-1',
    teacherName: 'Prof. Elena Restrepo',
    monthPeriod: 'Febrero 2026',
    classCount: 45,
    ratePerClass: 48000,
    hoursWorked: 45,
    hourlyRate: 48000,
    totalAmount: 2160000,
    concept: 'Honorarios por 45 clases dictadas de Ciencias Naturales y Química',
    supportDocName: 'cuenta_cobro_feb_elena_restrepo.pdf',
    status: 'pagado',
    submissionDate: '2026-02-28',
    paymentDate: '2026-03-05',
    adminNotes: 'Transferencia nómina docentes aprobada.',
  },
  {
    id: 'inv-2',
    teacherId: 'usr-teach-1',
    teacherName: 'Prof. Elena Restrepo',
    monthPeriod: 'Marzo 2026',
    classCount: 48,
    ratePerClass: 48000,
    hoursWorked: 48,
    hourlyRate: 48000,
    totalAmount: 2304000,
    concept: 'Honorarios por 48 clases dictadas y laboratorios de ciencias',
    supportDocName: 'cuenta_cobro_marzo_elena.pdf',
    status: 'aprobado',
    submissionDate: '2026-03-20',
    adminNotes: 'Listo para giro bancario en corte de fin de mes.',
  },
  {
    id: 'inv-3',
    teacherId: 'usr-teach-2',
    teacherName: 'Ing. Marcos Silva',
    monthPeriod: 'Marzo 2026',
    classCount: 50,
    ratePerClass: 55000,
    hoursWorked: 50,
    hourlyRate: 55000,
    totalAmount: 2750000,
    concept: 'Honorarios por 50 clases cátedra de Desarrollo de Software y Robótica',
    supportDocName: 'cuenta_cobro_marzo_marcos_silva.pdf',
    status: 'pendiente',
    submissionDate: '2026-03-21',
  },
];

export const INITIAL_ADMIN_NOTES: AdminNote[] = [
  {
    id: 'note-1',
    title: 'Acuerdos Claustro Directivo - Comité Académico',
    content: '1. Establecer fecha límite para subida de notas del Corte 1: 30 de Marzo.\n2. Confirmar jornada de inducción pedagógica para docentes nuevos.\n3. Auditar cuentas de cobro de docentes de cátedra según clases certificadas.',
    category: 'acuerdo',
    color: 'yellow',
    pinned: true,
    createdAt: '2026-03-20 09:30 AM',
    updatedAt: '2026-03-21 11:00 AM',
    authorName: 'Dra. Sofía Valenzuela (Directora Académica)',
    checklist: [
      { id: 'chk-1', text: 'Cerrar actas de comisión de evaluación', done: true },
      { id: 'chk-2', text: 'Enviar cronograma de pruebas bimestrales', done: true },
      { id: 'chk-3', text: 'Publicar listado de graduación grado 11°', done: false },
    ],
  },
  {
    id: 'note-2',
    title: 'Lineamientos Cuentas de Cobro & Honorarios',
    content: 'Recordatorio importante: La tarifa por clase está fijada contractualmente para cada docente. El sistema calcula automáticamente el total multiplicando las clases dictadas por la tarifa oficial asignada en el perfil del usuario.',
    category: 'urgente',
    color: 'amber',
    pinned: true,
    createdAt: '2026-03-18 03:15 PM',
    updatedAt: '2026-03-19 10:20 AM',
    authorName: 'Lic. Carlos Mendoza (Administrador General)',
  },
  {
    id: 'note-3',
    title: 'Jornada de Certificaciones y Paz y Salvos',
    content: 'Se habilitó la opción para que los estudiantes puedan generar y descargar certificados de estudio y paz y salvo con código QR de verificación institucional.',
    category: 'idea',
    color: 'emerald',
    pinned: false,
    createdAt: '2026-03-15 02:00 PM',
    updatedAt: '2026-03-15 02:00 PM',
    authorName: 'Lic. Gabriel Torres (Coordinador)',
  },
];

export const INITIAL_CERTIFICATE_REQUESTS: CertificateRequest[] = [
  {
    id: 'cert-1',
    studentId: 'usr-stud-1',
    studentName: 'Sofía Ramírez Díaz',
    studentDocument: 'TI 1.025.789.444',
    studentGrade: '11° Bachillerato Académico - Grupo A',
    certificateType: 'estudios_activo',
    purpose: 'Trámite de afiliación a EPS y subsidio familiar',
    status: 'generado',
    requestedAt: '2026-03-18 10:30 AM',
    issueDate: '18 de Marzo de 2026',
    verificationCode: 'AUR-2026-9812-STU',
    signedBy: 'Lic. Carlos Mendoza - Rectoría & Dirección General',
  },
  {
    id: 'cert-2',
    studentId: 'usr-stud-3',
    studentName: 'Valentina Morales Rios',
    studentDocument: 'TI 1.018.665.231',
    studentGrade: '10° Grado Técnico en Sistemas',
    certificateType: 'paz_y_salvo',
    purpose: 'Renovación de beca estudiantil por excelencia',
    status: 'generado',
    requestedAt: '2026-03-19 02:45 PM',
    issueDate: '19 de Marzo de 2026',
    verificationCode: 'AUR-2026-4431-FIN',
    signedBy: 'Dra. Sofía Valenzuela - Dirección Académica',
  },
];

export const INITIAL_ACCOUNTING: AccountingEntry[] = [
  {
    id: 'acc-inc-1',
    type: 'ingreso',
    category: 'Matrícula',
    concept: 'Matrícula Diplomado Colorimetría Avanzada & Balayage',
    amount: 450000,
    date: '2026-03-10',
    paymentMethod: 'Nequi',
    voucherNumber: 'RC-2026-001',
    beneficiaryOrClient: 'Camila Andrea Rojas (Estudiante)',
    registeredBy: 'Lic. Carlos Mendoza',
    notes: 'Matrícula ordinaria ciclo 2026',
    createdAt: '2026-03-10 09:30 AM',
  },
  {
    id: 'acc-inc-2',
    type: 'ingreso',
    category: 'Mensualidad / Curso',
    concept: 'Mensualidad Marzo - Taller Barbería Profesional & Fade',
    amount: 280000,
    date: '2026-03-12',
    paymentMethod: 'Transferencia Bancaria',
    voucherNumber: 'RC-2026-002',
    beneficiaryOrClient: 'Andrés Felipe Meza',
    registeredBy: 'Lic. Carlos Mendoza',
    notes: 'Pago mensual módulo corte con máquina y navaja',
    createdAt: '2026-03-12 11:15 AM',
  },
  {
    id: 'acc-inc-3',
    type: 'ingreso',
    category: 'Venta Kits & Cosméticos',
    concept: 'Venta Kit Profesional de Tijeras de Peluquería 6.0" + Capa de Corte',
    amount: 340000,
    date: '2026-03-14',
    paymentMethod: 'Efectivo',
    voucherNumber: 'RC-2026-003',
    beneficiaryOrClient: 'Laura Camila Méndez',
    registeredBy: 'Dra. Sofía Valenzuela',
    notes: 'Kit para práctica en taller',
    createdAt: '2026-03-14 02:00 PM',
  },
  {
    id: 'acc-inc-4',
    type: 'ingreso',
    category: 'Servicios Salón Escuela',
    concept: 'Servicio Salón Escuela: Balayage Rubio Miel + Cepillado Modelado',
    amount: 195000,
    date: '2026-03-16',
    paymentMethod: 'Tarjeta Débito/Crédito',
    voucherNumber: 'RC-2026-004',
    beneficiaryOrClient: 'Luisa Fernanda Mora (Cliente Salón)',
    registeredBy: 'Prof. Elena Restrepo',
    notes: 'Práctica supervisada de estudiantes de último corte',
    createdAt: '2026-03-16 04:30 PM',
  },
  {
    id: 'acc-inc-5',
    type: 'ingreso',
    category: 'Certificados & Diplomas',
    concept: 'Expedición de Certificado Oficial de Competencias Laborales',
    amount: 55000,
    date: '2026-03-18',
    paymentMethod: 'Daviplata',
    voucherNumber: 'RC-2026-005',
    beneficiaryOrClient: 'Paola Andrea Cruz (Egresada)',
    registeredBy: 'Lic. Carlos Mendoza',
    notes: 'Trámite laboral acreditado',
    createdAt: '2026-03-18 10:00 AM',
  },
  {
    id: 'acc-exp-1',
    type: 'egreso',
    category: 'Nómina & Honorarios Docentes',
    concept: 'Liquidación Honorarios Docentes Quincena Marzo - Instructores Belleza',
    amount: 2400000,
    date: '2026-03-15',
    paymentMethod: 'Transferencia Bancaria',
    voucherNumber: 'CE-2026-001',
    beneficiaryOrClient: 'Docentes & Especialistas Arte & Estilo',
    registeredBy: 'Lic. Carlos Mendoza',
    notes: 'Pago de horas de cátedra y talleres prácticos certificados',
    createdAt: '2026-03-15 05:00 PM',
  },
  {
    id: 'acc-exp-2',
    type: 'egreso',
    category: 'Arriendo de Sede',
    concept: 'Canon de Arrendamiento Sede Central Academia Arte & Estilo',
    amount: 3200000,
    date: '2026-03-05',
    paymentMethod: 'Transferencia Bancaria',
    voucherNumber: 'CE-2026-002',
    beneficiaryOrClient: 'Inmobiliaria Central de Belleza S.A.S.',
    registeredBy: 'Lic. Carlos Mendoza',
    notes: 'Pago mensual sede 2 niveles con salones y área de estética',
    createdAt: '2026-03-05 10:00 AM',
  },
  {
    id: 'acc-exp-3',
    type: 'egreso',
    category: 'Insumos Químicos & Cosméticos',
    concept: 'Insumos: Tintes Wella Koleston, Decolorantes Blondor y Peróxidos 20/30V',
    amount: 860000,
    date: '2026-03-08',
    paymentMethod: 'Transferencia Bancaria',
    voucherNumber: 'CE-2026-003',
    beneficiaryOrClient: 'Distribuidora Belleza Pro S.A.S.',
    registeredBy: 'Dra. Sofía Valenzuela',
    notes: 'Factura DIAN N° 45892 para talleres prácticos',
    createdAt: '2026-03-08 03:20 PM',
  },
  {
    id: 'acc-exp-4',
    type: 'egreso',
    category: 'Servicios Públicos (Agua/Luz/Net)',
    concept: 'Servicio de Agua Potable (Lavacabezas) y Energía Eléctrica Trifásica',
    amount: 430000,
    date: '2026-03-12',
    paymentMethod: 'PSE',
    voucherNumber: 'CE-2026-004',
    beneficiaryOrClient: 'Empresas Públicas Municipales',
    registeredBy: 'Lic. Carlos Mendoza',
    notes: 'Periodo de consumo Febrero-Marzo',
    createdAt: '2026-03-12 09:00 AM',
  },
  {
    id: 'acc-exp-5',
    type: 'egreso',
    category: 'Mantenimiento de Equipos',
    concept: 'Mantenimiento Preventivo y Calibración de Máquinas Wahl & Secadores Parlux',
    amount: 180000,
    date: '2026-03-17',
    paymentMethod: 'Efectivo',
    voucherNumber: 'CE-2026-005',
    beneficiaryOrClient: 'Servicio Técnico Barber & Salon',
    registeredBy: 'Prof. Marcos Silva',
    notes: 'Afilado de cuchillas cerámicas y cambio de carbones de secadores',
    createdAt: '2026-03-17 01:15 PM',
  },
];

export const INITIAL_FIXED_ASSETS: FixedAsset[] = [
  {
    id: 'asset-1',
    code: 'ACT-001',
    name: 'Sillones Hidráulicos de Peluquería Reclinables en Eco-cuero Negro (Lote de 6)',
    category: 'Mobiliario & Estaciones',
    purchaseDate: '2025-08-10',
    purchaseCost: 4800000,
    currentValue: 4200000,
    condition: 'Excelente',
    location: 'Aula Central de Peluquería',
    brand: 'StylistPro Italy',
    assignedTo: 'Área de Peluquería',
    notes: 'Bomba hidráulica de alto tráfico con freno de giro',
    createdAt: '2025-08-10',
  },
  {
    id: 'asset-2',
    code: 'ACT-002',
    name: 'Lavacabezas de Cerámica Basculante con Butaca Ergonómica y Grifería (Lote de 3)',
    category: 'Mobiliario & Estaciones',
    purchaseDate: '2025-08-15',
    purchaseCost: 3600000,
    currentValue: 3200000,
    condition: 'Excelente',
    location: 'Zona de Lavado y Tratamientos',
    brand: 'Ceramix Salon',
    assignedTo: 'Área de Lavado',
    notes: 'Bacha basculante profunda antidesborde',
    createdAt: '2025-08-15',
  },
  {
    id: 'asset-3',
    code: 'ACT-003',
    name: 'Secadores Profesionales Iónicos Parlux 385 PowerLight 2150W (Lote de 6)',
    category: 'Equipos Térmicos & Eléctricos',
    purchaseDate: '2025-09-01',
    purchaseCost: 2700000,
    currentValue: 2200000,
    condition: 'Bueno',
    location: 'Estaciones de Peinado 1 al 6',
    brand: 'Parlux Italia',
    serialNumber: 'PLX-385-SERIES-COL',
    assignedTo: 'Prof. Elena Restrepo',
    notes: 'Motor K-Lamination de 2200 horas de vida útil',
    createdAt: '2025-09-01',
  },
  {
    id: 'asset-4',
    code: 'ACT-004',
    name: 'Planchas Profesionales BabylissPRO Nano Titanium 1¼" 450°F (Lote de 4)',
    category: 'Equipos Térmicos & Eléctricos',
    purchaseDate: '2025-09-10',
    purchaseCost: 1400000,
    currentValue: 1150000,
    condition: 'Excelente',
    location: 'Estaciones de Peinado',
    brand: 'BabylissPRO',
    serialNumber: 'BBY-NANO-TIT-450',
    assignedTo: 'Área de Peinado',
    notes: 'Placas de titanio con generador iónico',
    createdAt: '2025-09-10',
  },
  {
    id: 'asset-5',
    code: 'ACT-005',
    name: 'Vaporizador Facial de Ozono con Brazo Articulado y Luz LED de Aumento',
    category: 'Estética Facial & Corporal',
    purchaseDate: '2025-10-05',
    purchaseCost: 980000,
    currentValue: 850000,
    condition: 'Excelente',
    location: 'Cabina de Cosmetología & Spa',
    brand: 'DermaOzone Pro',
    assignedTo: 'Cabina de Estética',
    notes: 'Depósito térmico con función germicida de ozono',
    createdAt: '2025-10-05',
  },
  {
    id: 'asset-6',
    code: 'ACT-006',
    name: 'Lámparas UV/LED SunX Plus 72W Sensor Automático para Uñas (Lote de 4)',
    category: 'Herramientas de Corte & Estilo',
    purchaseDate: '2025-10-12',
    purchaseCost: 640000,
    currentValue: 520000,
    condition: 'Bueno',
    location: 'Aula de Manicura & Nail Art',
    brand: 'SunX Professional',
    assignedTo: 'Área de Manicura',
    notes: 'Temporizador digital con luz no perjudicial para la vista',
    createdAt: '2025-10-12',
  },
  {
    id: 'asset-7',
    code: 'ACT-007',
    name: 'Esterilizador Germicida Ultravioleta UV + Autoclave Grado Bioseguridad',
    category: 'Seguridad & Bioseguridad',
    purchaseDate: '2025-08-20',
    purchaseCost: 1250000,
    currentValue: 1100000,
    condition: 'Excelente',
    location: 'Módulo Central de Desinfección',
    brand: 'SterilMed Pro',
    assignedTo: 'Dirección Académica',
    notes: 'Cumple protocolo Resolución Secretaría de Salud para barberías y peluquerías',
    createdAt: '2025-08-20',
  },
  {
    id: 'asset-8',
    code: 'ACT-008',
    name: 'Sillones Clásicos de Barbería Vintage Reclinables 360° en Cuero con Cabecera',
    category: 'Mobiliario & Estaciones',
    purchaseDate: '2025-11-01',
    purchaseCost: 3100000,
    currentValue: 2850000,
    condition: 'Excelente',
    location: 'Barber Shop Academy',
    brand: 'MasterBarber Vintage',
    assignedTo: 'Prof. Marcos Silva',
    notes: 'Estructura cromada pesada y apoyo para toallas calientes',
    createdAt: '2025-11-01',
  },
  {
    id: 'asset-9',
    code: 'ACT-009',
    name: 'Computador All-in-One HP 24" Touchscreen + Impresora Térmica POS Facturación',
    category: 'Cómputo & Tecnología',
    purchaseDate: '2025-08-01',
    purchaseCost: 2600000,
    currentValue: 2100000,
    condition: 'Bueno',
    location: 'Recepción Principal',
    brand: 'HP Pavilion POS',
    assignedTo: 'Administración General',
    notes: 'Control de caja, matrículas y facturación',
    createdAt: '2025-08-01',
  },
];

export const INITIAL_ATTENDANCE: AttendanceSession[] = [
  {
    id: 'att-session-1',
    groupId: 'grp-11a',
    groupName: 'Colorimetría Avanzada & Balayage',
    date: '2026-03-20',
    shift: 'Mañana',
    teacherId: 'usr-teach-1',
    teacherName: 'Prof. Elena Restrepo',
    topicCovered: 'Técnica de decoloración global en cabello virgen y neutralización de fondos amarillos',
    records: [
      {
        studentId: 'usr-stud-1',
        studentName: 'Sofía Ramírez Díaz',
        studentDocument: 'TI 1.025.789.444',
        status: 'presente',
        remarks: 'Puntual y con su kit completo de brochas y recipientes',
      },
      {
        studentId: 'usr-stud-2',
        studentName: 'Mateo Castro Gómez',
        studentDocument: 'TI 1.032.441.982',
        status: 'presente',
        remarks: 'Excelente formulación de decolorante 20 vol',
      },
    ],
    totalStudents: 2,
    presentCount: 2,
    lateCount: 0,
    excusedCount: 0,
    absentCount: 0,
    createdAt: '2026-03-20 01:00 PM',
  },
  {
    id: 'att-session-2',
    groupId: 'grp-11a',
    groupName: 'Colorimetría Avanzada & Balayage',
    date: '2026-03-18',
    shift: 'Mañana',
    teacherId: 'usr-teach-1',
    teacherName: 'Prof. Elena Restrepo',
    topicCovered: 'Fórmula de matiz platinado 9.12 sobre mechas con gorro de silicona',
    records: [
      {
        studentId: 'usr-stud-1',
        studentName: 'Sofía Ramírez Díaz',
        studentDocument: 'TI 1.025.789.444',
        status: 'presente',
        remarks: 'Asistió puntual',
      },
      {
        studentId: 'usr-stud-2',
        studentName: 'Mateo Castro Gómez',
        studentDocument: 'TI 1.032.441.982',
        status: 'tardanza',
        remarks: 'Llegó 15 min tarde por congestión vehicular',
      },
    ],
    totalStudents: 2,
    presentCount: 1,
    lateCount: 1,
    excusedCount: 0,
    absentCount: 0,
    createdAt: '2026-03-18 01:00 PM',
  },
];

export const INITIAL_RESOURCES: ResourceMaterial[] = [
  {
    id: 'res-1',
    title: 'Guía de Estudio: Reacciones de Hidrocarburos y Estereoquímica',
    description: 'Taller preparatorio con 25 ejercicios para el segundo examen parcial de Química.',
    groupId: 'grp-11a',
    groupName: '11° Bachillerato Académico - Grupo A',
    subject: 'Química Orgánica',
    teacherId: 'usr-teach-1',
    teacherName: 'Prof. Elena Restrepo',
    type: 'document',
    fileName: 'Guia_Quimica_Organica_Corte2.pdf',
    fileSize: '3.4 MB',
    fileUrl: '#',
    uploadedAt: '2026-03-14',
  },
  {
    id: 'res-2',
    title: 'Clase Grabada: Explicación de Mecanismos SN1 vs SN2',
    description: 'Video explicativo en alta definición con resolución paso a paso de dudas frecuentes.',
    groupId: 'grp-11a',
    groupName: '11° Bachillerato Académico - Grupo A',
    subject: 'Química Orgánica',
    teacherId: 'usr-teach-1',
    teacherName: 'Prof. Elena Restrepo',
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    uploadedAt: '2026-03-16',
  },
  {
    id: 'res-3',
    title: 'Taller Práctico: Componentes en React y Manejo de Estado',
    description: 'Código base y especificaciones del proyecto para el desarrollo de la aplicación web.',
    groupId: 'grp-10t',
    groupName: '10° Técnico en Sistemas y Desarrollo Web',
    subject: 'Desarrollo Web Frontend',
    teacherId: 'usr-teach-2',
    teacherName: 'Ing. Marcos Silva',
    type: 'workshop',
    fileName: 'Laboratorio_React_Semana6.zip',
    fileSize: '8.1 MB',
    fileUrl: '#',
    uploadedAt: '2026-03-18',
  },
  {
    id: 'res-4',
    title: 'Video Tutorial: Arquitectura de Componentes y Hooks en React 19',
    description: 'Demostración en vivo de useState, useEffect y creación de hooks personalizados.',
    groupId: 'grp-10t',
    groupName: '10° Técnico en Sistemas y Desarrollo Web',
    subject: 'Desarrollo Web Frontend',
    teacherId: 'usr-teach-2',
    teacherName: 'Ing. Marcos Silva',
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
    uploadedAt: '2026-03-19',
  },
];

export const INITIAL_FORUMS: ForumTopic[] = [
  {
    id: 'forum-1',
    title: '¿Dudas con el balanceo redox en medio ácido del taller 3?',
    content: 'Hola profe Elena y compañeros, al balancear la reacción del permanganato de potasio me quedan 3 electrones de diferencia. ¿Alguien tiene el paso a paso del método ion-electrón?',
    groupId: 'grp-11a',
    groupName: '11° Bachillerato Académico - Grupo A',
    authorId: 'usr-stud-1',
    authorName: 'Sofía Ramírez Díaz',
    authorRole: 'student',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-03-18 14:30',
    tags: ['Química', 'Taller 3', 'Redox'],
    likes: 5,
    isPinned: true,
  },
  {
    id: 'forum-2',
    title: 'Consejos para estructurar el proyecto de grado en React',
    content: 'He creado esta discusión para compartir buenas prácticas sobre la separación de componentes, servicios y vistas en TypeScript.',
    groupId: 'grp-10t',
    groupName: '10° Técnico en Sistemas y Desarrollo Web',
    authorId: 'usr-teach-2',
    authorName: 'Ing. Marcos Silva',
    authorRole: 'teacher',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-03-19 09:15',
    tags: ['Arquitectura', 'React', 'TypeScript'],
    likes: 8,
    isPinned: true,
  },
];

export const INITIAL_REPLIES: ForumReply[] = [
  {
    id: 'rep-1',
    topicId: 'forum-1',
    authorId: 'usr-teach-1',
    authorName: 'Prof. Elena Restrepo',
    authorRole: 'teacher',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    content: 'Hola Sofía, recuerda que el manganeso pasa de +7 a +2, por lo que gana 5 electrones. Revisa el número de moléculas de agua añadidas en el medio ácido. En el video subido al aula en el minuto 12:40 está resuelto.',
    createdAt: '2026-03-18 16:10',
    likes: 3,
  },
  {
    id: 'rep-2',
    topicId: 'forum-1',
    authorId: 'usr-stud-2',
    authorName: 'Mateo Castro Gómez',
    authorRole: 'student',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    content: 'Gracias profe, yo tenía la misma duda y con eso ya me cuadraron los coeficientes estequiométricos.',
    createdAt: '2026-03-18 17:05',
    likes: 1,
  },
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Claustro Docente y Comité de Evaluación Corte 1',
    description: 'Reunión de todo el cuerpo docente con la dirección académica para revisar rendimiento y casos especiales.',
    date: '2026-03-25',
    time: '14:00',
    type: 'reunion',
    targetRoles: ['admin', 'teacher'],
    location: 'Sala de Juntas Principal / Virtual Google Meet',
    createdBy: 'Dirección Académica',
  },
  {
    id: 'evt-2',
    title: 'Fecha Límite Cierre de Notas Corte 1',
    description: 'Último plazo para que los docentes registren y consoliden las notas del primer 30% en el sistema.',
    date: '2026-03-27',
    time: '23:59',
    type: 'evaluacion',
    targetRoles: ['admin', 'teacher', 'student'],
    location: 'Plataforma EduManage',
    createdBy: 'Secretaría Académica',
  },
  {
    id: 'evt-3',
    title: 'Vencimiento Pensión y Mensualidad Abril',
    description: 'Plazo ordinario de pago para evitar recargos o restricción temporal de certificados.',
    date: '2026-04-10',
    time: '18:00',
    type: 'pago',
    targetRoles: ['admin', 'student'],
    location: 'Tesorería Institucional y Pasarela Digital',
    createdBy: 'Tesorería',
  },
  {
    id: 'evt-4',
    title: 'Feria de la Ciencia, Tecnología e Innovación 2026',
    description: 'Presentación de proyectos estudiantiles, maquetas, robots y aplicaciones desarrolladas.',
    date: '2026-04-18',
    time: '08:30',
    type: 'academico',
    targetRoles: ['admin', 'teacher', 'student'],
    location: 'Coliseo Deportivo y Aulas Multipropósito',
    createdBy: 'Comité de Ciencias',
  },
];

export const INITIAL_INDUCTIONS: TeacherInduction[] = [
  {
    id: 'ind-1',
    title: 'Protocolo de Evaluación Formativa y Competencias Socioemocionales',
    description: 'Taller obligatorio sobre las nuevas directrices curriculares y rúbricas de desempeño estudiantil 2026.',
    moduleCount: 4,
    duration: '3 Horas',
    videoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    deadline: '2026-04-05',
    mandatory: true,
    completedByTeacherIds: ['usr-teach-1'],
  },
  {
    id: 'ind-2',
    title: 'Seguridad Digital en Aulas Virtuales y Manejo de Datos de Menores',
    description: 'Políticas institucionales de privacidad, uso de cámaras y protección de información sensible.',
    moduleCount: 3,
    duration: '2 Horas',
    videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    deadline: '2026-04-15',
    mandatory: true,
    completedByTeacherIds: ['usr-teach-1', 'usr-teach-2'],
  },
  {
    id: 'ind-3',
    title: 'Uso de Herramientas IA para Optimización de Material Didáctico',
    description: 'Capacitación opcional para diseñar casos de estudio interactivos y rúbricas automatizadas.',
    moduleCount: 2,
    duration: '2.5 Horas',
    videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
    deadline: '2026-04-30',
    mandatory: false,
    completedByTeacherIds: ['usr-teach-2'],
  },
];

export const INITIAL_PROJECTIONS: CourseProjection[] = [
  {
    id: 'proj-1',
    name: 'Diplomado en Inteligencia Artificial Aplicada a Negocios',
    category: 'Educación Continua',
    targetAudience: 'Egresados, profesionales y estudiantes avanzados',
    plannedStartDate: '2026-05-15',
    durationMonths: 4,
    estimatedTuitionFee: 850000,
    targetStudents: 30,
    currentPreRegistered: 22,
    projectedRevenue: 25500000,
    status: 'convocatoria_abierta',
  },
  {
    id: 'proj-2',
    name: 'Pre-Icfes Saber 11 Intensivo Vacacional',
    category: 'Bachillerato / Nivelación',
    targetAudience: 'Estudiantes de grado 10° y 11°',
    plannedStartDate: '2026-06-20',
    durationMonths: 2,
    estimatedTuitionFee: 320000,
    targetStudents: 50,
    currentPreRegistered: 38,
    projectedRevenue: 16000000,
    status: 'convocatoria_abierta',
  },
  {
    id: 'proj-3',
    name: 'Curso de Francés Comunicativo Nivel A1-A2',
    category: 'Idiomas',
    targetAudience: 'Comunidad en general y estudiantes',
    plannedStartDate: '2026-07-01',
    durationMonths: 5,
    estimatedTuitionFee: 450000,
    targetStudents: 25,
    currentPreRegistered: 11,
    projectedRevenue: 11250000,
    status: 'en_estudio',
  },
];

export const INITIAL_CHATS: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'usr-admin-1',
    senderName: 'Lic. Carlos Mendoza (Admin)',
    senderRole: 'admin',
    receiverId: 'usr-teach-1',
    text: 'Hola Profesora Elena, excelente trabajo con el laboratorio de química. Recuerde subir la cuenta de cobro de marzo antes del día 25.',
    timestamp: '2026-03-20 10:15',
    read: true,
  },
  {
    id: 'msg-2',
    senderId: 'usr-teach-1',
    senderName: 'Prof. Elena Restrepo',
    senderRole: 'teacher',
    receiverId: 'usr-admin-1',
    text: 'Muchas gracias Lic. Carlos. Ya subí la cuenta de cobro al panel con el reporte de 52 horas.',
    timestamp: '2026-03-20 10:22',
    read: true,
  },
  {
    id: 'msg-3',
    senderId: 'usr-stud-1',
    senderName: 'Sofía Ramírez Díaz',
    senderRole: 'student',
    receiverId: 'usr-teach-1',
    text: 'Buenas tardes profe Elena, ¿las notas definitivas del corte 1 ya quedaron publicadas?',
    timestamp: '2026-03-21 15:40',
    read: true,
  },
  {
    id: 'msg-4',
    senderId: 'usr-teach-1',
    senderName: 'Prof. Elena Restrepo',
    senderRole: 'teacher',
    receiverId: 'usr-stud-1',
    text: 'Hola Sofía, sí, sacaste 4.8. Ya puedes descargar el boletín en tu módulo de notas.',
    timestamp: '2026-03-21 15:45',
    read: true,
  },
  {
    id: 'msg-5',
    senderId: 'usr-admin-1',
    senderName: 'Lic. Carlos Mendoza (Admin)',
    senderRole: 'admin',
    receiverId: 'usr-stud-2',
    text: 'Estimado Mateo, te informamos que presentas la mensualidad de marzo pendiente por $180.000. Por favor realiza el pago por la pasarela PSE o en tesorería.',
    timestamp: '2026-03-22 09:00',
    read: false,
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    targetUserId: 'usr-stud-2',
    title: '⚠️ Aviso de Pago Pendiente',
    message: 'Tu mensualidad de Marzo ($180.000) venció el 10 de marzo. Realiza el pago para evitar suspensión del acceso a foros.',
    type: 'payment',
    read: false,
    timestamp: 'Hace 2 horas',
    targetTab: 'finances',
  },
  {
    id: 'notif-2',
    targetUserId: 'usr-stud-1',
    title: '🎉 Nueva Calificación Registrada',
    message: 'La profesora Elena Restrepo ha registrado tu nota de Química Orgánica: 4.8 / 5.0 (Excelente).',
    type: 'grade',
    read: false,
    timestamp: 'Hace 1 día',
    targetTab: 'grades',
  },
  {
    id: 'notif-3',
    targetUserId: 'usr-teach-1',
    title: '✅ Cuenta de Cobro Aprobada',
    message: 'Tu cuenta de cobro de Marzo por $2.340.000 ha sido aprobada por la administración.',
    type: 'payment',
    read: false,
    timestamp: 'Hace 3 horas',
    targetTab: 'invoices',
  },
  {
    id: 'notif-4',
    targetUserId: 'all',
    title: '📅 Claustro Docente Programado',
    message: 'Reunión general programada para el 25 de Marzo a las 14:00.',
    type: 'event',
    read: false,
    timestamp: 'Hace 2 días',
    targetTab: 'calendar',
  },
];

export const INITIAL_STAFF_CALLS: StaffCallSession[] = [
  {
    id: 'call-1',
    callerId: 'usr-admin-1',
    callerName: 'Lic. Carlos Mendoza (Admin)',
    callerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    callerRole: 'admin',
    receiverId: 'usr-teach-1',
    receiverName: 'Prof. Elena Restrepo',
    receiverAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    receiverRole: 'teacher',
    type: 'video',
    status: 'ended',
    startedAt: 'Hoy, 09:30 AM',
    durationSeconds: 420,
  },
  {
    id: 'call-2',
    callerId: 'usr-teach-2',
    callerName: 'Ing. Marcos Silva',
    callerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    callerRole: 'teacher',
    receiverId: 'usr-admin-1',
    receiverName: 'Lic. Carlos Mendoza (Admin)',
    receiverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    receiverRole: 'admin',
    type: 'audio',
    status: 'ended',
    startedAt: 'Ayer, 04:15 PM',
    durationSeconds: 195,
  },
];

export const INITIAL_WHATSAPP_CHATS: WhatsAppConversation[] = [
  {
    id: 'wa-1',
    contactName: 'Mariana Gómez Quintero',
    phoneNumber: '+57 312 456 7890',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    type: 'aspirante',
    programOfInterest: 'Técnico Laboral en Peluquería Integral & Estilismo',
    recruitmentStage: 'visita_agendada',
    assignedAgentId: 'usr-agent-1',
    assignedAgentName: 'Camila Morales',
    unreadCount: 0,
    lastMessage: 'Perfecto Camila, mañana a las 10:00 a.m. paso por la sede para conocer las salas de colorimetría y apartar el cupo.',
    lastMessageTime: '11:45 AM',
    lastRespondedBy: 'Camila Morales (Vendedora)',
    lastRespondedById: 'usr-agent-1',
    lastRespondedByRole: 'agent',
    lastRespondedByAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    aiAutoReplyEnabled: false,
    messages: [
      {
        id: 'wam-1-1',
        sender: 'user',
        text: '¡Hola buenos días! Me interesa mucho el programa de Peluquería Integral. ¿Cuándo inician clases y qué horarios tienen disponibles?',
        timestamp: '11:30 AM',
        status: 'read',
      },
      {
        id: 'wam-1-2',
        sender: 'business',
        text: '¡Hola Mariana! ✨ Con gusto te saluda Camila Morales, Asesora de Admisiones de Arte & Estilo. Iniciamos el próximo ciclo el 1° de Abril en jornadas de Mañana (8am-12m) y Sábados intensivos. ¿Te gustaría agendar una visita a la sede para ver las salas técnicas y los kits incluidos?',
        timestamp: '11:35 AM',
        status: 'read',
        respondedBy: 'Camila Morales',
        respondedById: 'usr-agent-1',
        respondedByRole: 'agent',
        respondedByCargo: 'Líder Call Center & Admisiones',
        respondedByAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      },
      {
        id: 'wam-1-3',
        sender: 'user',
        text: 'Perfecto Camila, mañana a las 10:00 a.m. paso por la sede para conocer las salas de colorimetría y apartar el cupo.',
        timestamp: '11:45 AM',
        status: 'read',
      },
    ],
  },
  {
    id: 'wa-2',
    contactName: 'Julián David Cárdenas',
    phoneNumber: '+57 320 890 1234',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    type: 'aspirante',
    programOfInterest: 'Técnico en Barbería Profesional & Cortes Urbanos',
    recruitmentStage: 'nuevo_prospecto',
    assignedAgentId: undefined,
    assignedAgentName: undefined,
    unreadCount: 1,
    lastMessage: 'Buenas tardes, quiero saber si en Barbería el kit incluye la máquina inalámbrica y tijeras profesionales, o si hay que comprarlas aparte.',
    lastMessageTime: '01:15 PM',
    aiAutoReplyEnabled: false,
    messages: [
      {
        id: 'wam-2-1',
        sender: 'user',
        text: 'Buenas tardes, quiero saber si en Barbería el kit incluye la máquina inalámbrica y tijeras profesionales, o si hay que comprarlas aparte.',
        timestamp: '01:15 PM',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'wa-3',
    contactName: 'Tatiana Lucía Benítez',
    phoneNumber: '+57 315 678 9012',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    type: 'aspirante',
    programOfInterest: 'Técnico en Manicura Rusa, Polygel & Nail Art',
    recruitmentStage: 'esperando_pago',
    assignedAgentId: 'usr-agent-2',
    assignedAgentName: 'Valentina Osorio',
    unreadCount: 0,
    lastMessage: 'Listo Valentina, acabo de transferir el abono de matrícula de $350.000 por Bancolombia. Ya te paso el comprobante.',
    lastMessageTime: 'Ayer 04:20 PM',
    lastRespondedBy: 'Valentina Osorio (Vendedora)',
    lastRespondedById: 'usr-agent-2',
    lastRespondedByRole: 'agent',
    lastRespondedByAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    aiAutoReplyEnabled: false,
    messages: [
      {
        id: 'wam-3-1',
        sender: 'user',
        text: 'Hola, me encantó el contenido del curso de Manicura Rusa y Polygel. ¿Cuánto es el abono mínimo para congelar el precio promocional?',
        timestamp: 'Ayer 03:10 PM',
        status: 'read',
      },
      {
        id: 'wam-3-2',
        sender: 'business',
        text: '¡Hola Tatiana! Con gusto te saluda Valentina Osorio de Admisiones. Puedes reservar tu cupo hoy mismo con un abono inicial de $350.000 COP y te incluimos el kit de fresas diamantadas de obsequio. 💅✨',
        timestamp: 'Ayer 03:22 PM',
        status: 'read',
        respondedBy: 'Valentina Osorio',
        respondedById: 'usr-agent-2',
        respondedByRole: 'agent',
        respondedByCargo: 'Asesora de Matrículas & Admisiones',
        respondedByAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      },
      {
        id: 'wam-3-3',
        sender: 'user',
        text: 'Listo Valentina, acabo de transferir el abono de matrícula de $350.000 por Bancolombia. Ya te paso el comprobante.',
        timestamp: 'Ayer 04:20 PM',
        status: 'read',
      },
    ],
  },
  {
    id: 'wa-4',
    contactName: 'Carlos Andrés Meza',
    phoneNumber: '+57 318 234 5678',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    type: 'aspirante',
    programOfInterest: 'Técnico en Barbería Profesional & Fade',
    recruitmentStage: 'informacion_enviada',
    assignedAgentId: 'usr-admin-1',
    assignedAgentName: 'Lic. Carlos Mendoza',
    unreadCount: 0,
    lastMessage: 'Muchas gracias Licenciado Carlos, reviso el pensum y confirmo la inscripción con Camila.',
    lastMessageTime: '09:30 AM',
    lastRespondedBy: 'Lic. Carlos Mendoza (Admin)',
    lastRespondedById: 'usr-admin-1',
    lastRespondedByRole: 'admin',
    lastRespondedByAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    aiAutoReplyEnabled: false,
    messages: [
      {
        id: 'wam-4-1',
        sender: 'user',
        text: 'Buenos días, quisiera saber si las certificaciones son avaladas por la Secretaría de Educación para poder trabajar en el exterior.',
        timestamp: '09:10 AM',
        status: 'read',
      },
      {
        id: 'wam-4-2',
        sender: 'business',
        text: 'Estimado Carlos, un cordial saludo de la Dirección General de Arte & Estilo. Nuestros certificados cuentan con registro oficial y código verificable institucional, plenamente convalidables y aptos para apostille. Con gusto te esperamos en nuestra sede.',
        timestamp: '09:20 AM',
        status: 'read',
        respondedBy: 'Lic. Carlos Mendoza (Admin)',
        respondedById: 'usr-admin-1',
        respondedByRole: 'admin',
        respondedByCargo: 'Director General & Fundador',
        respondedByAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      {
        id: 'wam-4-3',
        sender: 'user',
        text: 'Muchas gracias Licenciado Carlos, reviso el pensum y confirmo la inscripción con Camila.',
        timestamp: '09:30 AM',
        status: 'read',
      },
    ],
  },
];

const STORAGE_KEY = 'aurea_data_store_v2';
const CURRENT_USER_KEY = 'aurea_current_user_v2';

// Storage Manager with Multi-tab BroadcastChannel
class AppStorageService {
  private broadcast: BroadcastChannel | null = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.broadcast = new BroadcastChannel('edumanage_sync_channel');
        this.broadcast.onmessage = (event) => {
          if (event.data === 'sync_update') {
            this.notifyListeners();
          }
        };
      } catch {
        // Fallback for older browsers
        window.addEventListener('storage', (e) => {
          if (e.key === STORAGE_KEY) {
            this.notifyListeners();
          }
        });
      }
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  private broadcastUpdate() {
    this.notifyListeners();
    if (this.broadcast) {
      try {
        this.broadcast.postMessage('sync_update');
      } catch {
        // ignore
      }
    }
  }

  getStore(): AppDataStore {
    if (typeof window === 'undefined') {
      return this.getInitialStore();
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = this.getInitialStore();
      this.saveStore(initial);
      return initial;
    }
    try {
      const parsed = JSON.parse(raw);
      // Ensure permissions exist
      if (!parsed.permissions) {
        parsed.permissions = DEFAULT_ROLE_PERMISSIONS;
      }
      if (!parsed.staffCalls) {
        parsed.staffCalls = INITIAL_STAFF_CALLS;
      }
      if (!parsed.whatsappChats || parsed.whatsappChats.length === 0 || !parsed.whatsappChats.some((c: any) => c.recruitmentStage)) {
        parsed.whatsappChats = INITIAL_WHATSAPP_CHATS;
      }
      if (!parsed.adminNotes) {
        parsed.adminNotes = INITIAL_ADMIN_NOTES;
      }
      if (!parsed.certificateRequests) {
        parsed.certificateRequests = INITIAL_CERTIFICATE_REQUESTS;
      }
      if (!parsed.accounting) {
        parsed.accounting = INITIAL_ACCOUNTING;
      }
      if (!parsed.fixedAssets) {
        parsed.fixedAssets = INITIAL_FIXED_ASSETS;
      }
      if (!parsed.attendanceSessions) {
        parsed.attendanceSessions = INITIAL_ATTENDANCE;
      }
      if (!parsed.pensumModules || parsed.pensumModules.length === 0) {
        parsed.pensumModules = INITIAL_PENSUM_MODULES;
      }
      if (!parsed.moduleGrades || parsed.moduleGrades.length === 0) {
        parsed.moduleGrades = INITIAL_MODULE_GRADES;
      }
      if (!parsed.practiceRecords || parsed.practiceRecords.length === 0) {
        parsed.practiceRecords = INITIAL_PRACTICE_RECORDS;
      }
      if (!parsed.observerEntries || parsed.observerEntries.length === 0) {
        parsed.observerEntries = INITIAL_OBSERVER_ENTRIES;
      }
      if (!parsed.academyNotices || parsed.academyNotices.length === 0 || !parsed.academyNotices.some((n: any) => n.id === 'not-promo-1')) {
        parsed.academyNotices = INITIAL_ACADEMY_NOTICES;
      }
      if (!parsed.teacherStudentMessages || parsed.teacherStudentMessages.length === 0) {
        parsed.teacherStudentMessages = INITIAL_TEACHER_STUDENT_MESSAGES;
      }
      if (!parsed.callCenterSchedules || parsed.callCenterSchedules.length === 0) {
        parsed.callCenterSchedules = INITIAL_CALL_CENTER_SCHEDULES;
      }
      if (!parsed.agentEnrollments || parsed.agentEnrollments.length === 0) {
        parsed.agentEnrollments = INITIAL_AGENT_ENROLLMENTS;
      }
      if (!parsed.agentCommissions || parsed.agentCommissions.length === 0) {
        parsed.agentCommissions = INITIAL_AGENT_COMMISSIONS;
      }
      if (!parsed.adminAgentMessages || parsed.adminAgentMessages.length === 0 || !parsed.adminAgentMessages.some((m: any) => m.id === 'aam-gen-01')) {
        parsed.adminAgentMessages = INITIAL_ADMIN_AGENT_MESSAGES;
      }

      // Upgrade permissions if missing
      ['admin', 'teacher', 'student', 'agent'].forEach((roleKey) => {
        const r = roleKey as UserRole;
        if (parsed.permissions?.[r]) {
          if (!('pensum' in parsed.permissions[r])) parsed.permissions[r].pensum = true;
          if (!('practices' in parsed.permissions[r])) parsed.permissions[r].practices = true;
          if (!('observer' in parsed.permissions[r])) parsed.permissions[r].observer = true;
          if (!('teacherStudentChat' in parsed.permissions[r])) parsed.permissions[r].teacherStudentChat = true;
          if (!('notices' in parsed.permissions[r])) parsed.permissions[r].notices = true;
          if (!('callCenter' in parsed.permissions[r])) {
            parsed.permissions[r].callCenter = r === 'admin' || r === 'agent';
          }
          if (!('chatCenter' in parsed.permissions[r])) {
            parsed.permissions[r].chatCenter = r === 'admin' || r === 'agent';
          }
        }
      });

      if (!parsed.permissions?.agent) {
        parsed.permissions.agent = DEFAULT_ROLE_PERMISSIONS.agent;
      }

      // Update groups and enrollments if old non-beauty data was cached
      if (parsed.groups && parsed.groups.some((g: any) => g.name?.includes('Bachillerato'))) {
        parsed.groups = INITIAL_GROUPS;
        parsed.enrollments = INITIAL_ENROLLMENTS;
      }

      // Ensure new permissions are active
      if (parsed.permissions?.admin && !('accounting' in parsed.permissions.admin)) {
        parsed.permissions.admin.accounting = true;
      }
      if (parsed.permissions?.admin && !('attendance' in parsed.permissions.admin)) {
        parsed.permissions.admin.attendance = true;
      }
      if (parsed.permissions?.teacher && !('attendance' in parsed.permissions.teacher)) {
        parsed.permissions.teacher.attendance = true;
      }
      if (parsed.permissions?.student && !('attendance' in parsed.permissions.student)) {
        parsed.permissions.student.attendance = true;
      }

      // Ensure new staff members (Directora Académica, Coordinador) exist in existing stores
      INITIAL_USERS.forEach((initUser) => {
        const exists = parsed.users.find((u: User) => u.id === initUser.id);
        if (!exists) {
          parsed.users.push(initUser);
        } else {
          // Sync cargo and rate if not set
          if (!exists.cargo && initUser.cargo) exists.cargo = initUser.cargo;
          if (!exists.administrativeTitle && initUser.administrativeTitle) exists.administrativeTitle = initUser.administrativeTitle;
          if (!exists.ratePerClass && initUser.ratePerClass) exists.ratePerClass = initUser.ratePerClass;
          if (!exists.assignedSalary && initUser.assignedSalary) exists.assignedSalary = initUser.assignedSalary;
        }
      });

      return parsed;
    } catch {
      const initial = this.getInitialStore();
      this.saveStore(initial);
      return initial;
    }
  }

  private getInitialStore(): AppDataStore {
    return {
      users: INITIAL_USERS,
      groups: INITIAL_GROUPS,
      enrollments: INITIAL_ENROLLMENTS,
      grades: INITIAL_GRADES,
      payments: INITIAL_PAYMENTS,
      invoices: INITIAL_INVOICES,
      resources: INITIAL_RESOURCES,
      forums: INITIAL_FORUMS,
      replies: INITIAL_REPLIES,
      events: INITIAL_EVENTS,
      inductions: INITIAL_INDUCTIONS,
      projections: INITIAL_PROJECTIONS,
      chats: INITIAL_CHATS,
      staffCalls: INITIAL_STAFF_CALLS,
      whatsappChats: INITIAL_WHATSAPP_CHATS,
      adminNotes: INITIAL_ADMIN_NOTES,
      certificateRequests: INITIAL_CERTIFICATE_REQUESTS,
      accounting: INITIAL_ACCOUNTING,
      fixedAssets: INITIAL_FIXED_ASSETS,
      attendanceSessions: INITIAL_ATTENDANCE,
      pensumModules: INITIAL_PENSUM_MODULES,
      moduleGrades: INITIAL_MODULE_GRADES,
      practiceRecords: INITIAL_PRACTICE_RECORDS,
      observerEntries: INITIAL_OBSERVER_ENTRIES,
      academyNotices: INITIAL_ACADEMY_NOTICES,
      teacherStudentMessages: INITIAL_TEACHER_STUDENT_MESSAGES,
      callCenterSchedules: INITIAL_CALL_CENTER_SCHEDULES,
      agentEnrollments: INITIAL_AGENT_ENROLLMENTS,
      agentCommissions: INITIAL_AGENT_COMMISSIONS,
      adminAgentMessages: INITIAL_ADMIN_AGENT_MESSAGES,
      notifications: INITIAL_NOTIFICATIONS,
      permissions: DEFAULT_ROLE_PERMISSIONS,
      lastBackupDate: new Date().toISOString(),
    };
  }

  saveStore(store: AppDataStore) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    this.broadcastUpdate();
  }

  // Session user
  getCurrentUser(): User {
    if (typeof window === 'undefined') return INITIAL_USERS[0];
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // Ensure user exists in current store
        const store = this.getStore();
        const found = store.users.find((u) => u.id === parsed.id);
        if (found) return found;
      } catch {
        // Fallback
      }
    }
    // Default to admin for first experience
    const defaultUser = INITIAL_USERS[0];
    this.setCurrentUser(defaultUser);
    return defaultUser;
  }

  setCurrentUser(user: User) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    this.notifyListeners();
  }

  // Actions: Enroll student
  enrollStudent(data: Omit<StudentEnrollment, 'id' | 'enrollmentDate' | 'balanceDue'>) {
    const store = this.getStore();
    const newUserId = `usr-stud-${Date.now()}`;
    const newEnrollmentId = `enr-${Date.now()}`;
    const studentAvatar = data.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;

    const newUser: User = {
      id: newUserId,
      name: data.fullName,
      email: data.email,
      password: 'est',
      role: 'student',
      avatar: studentAvatar,
      phone: data.phone,
      documentId: data.documentId,
      gradeLevel: data.groupName.split(' ')[0] || '10°',
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const newEnrollment: StudentEnrollment = {
      ...data,
      id: newEnrollmentId,
      userId: newUserId,
      avatar: studentAvatar,
      enrollmentDate: new Date().toISOString().split('T')[0],
      balanceDue: data.paymentPlan === 'Beca Completa' ? 0 : data.monthlyAmount,
    };

    // Add student to the group's enrolledStudentIds
    const updatedGroups = store.groups.map((grp) => {
      if (grp.id === data.groupId && !grp.enrolledStudentIds.includes(newUserId)) {
        return {
          ...grp,
          enrolledStudentIds: [...grp.enrolledStudentIds, newUserId],
        };
      }
      return grp;
    });

    // Create initial invoice/payment pending
    const initialPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      studentId: newUserId,
      studentName: data.fullName,
      concept: 'Matrícula Inicial y Carnet',
      amount: data.monthlyAmount,
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'pendiente',
      referenceCode: `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    // System notification
    const adminNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      targetUserId: 'admin',
      title: '🎓 Nueva Matrícula Registrada',
      message: `${data.fullName} ha sido inscrito en el grupo "${data.groupName}".`,
      type: 'system',
      read: false,
      timestamp: 'Justo ahora',
      targetTab: 'students',
    };

    store.users.push(newUser);
    store.enrollments.push(newEnrollment);
    store.groups = updatedGroups;
    store.payments.push(initialPayment);
    store.notifications.unshift(adminNotification);

    this.saveStore(store);
    return { user: newUser, enrollment: newEnrollment };
  }

  // Action: Add or update grade
  addGrade(grade: Omit<GradeItem, 'id' | 'date'>) {
    const store = this.getStore();
    const newGrade: GradeItem = {
      ...grade,
      id: `grd-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    store.grades.push(newGrade);

    // Notify student
    const studentNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      targetUserId: grade.studentId,
      title: '📝 Nueva Nota Asignada',
      message: `Tu profesor ha registrado la nota de ${grade.subject} (${grade.period}): ${grade.score.toFixed(1)} / 5.0.`,
      type: 'grade',
      read: false,
      timestamp: 'Justo ahora',
      targetTab: 'grades',
    };
    store.notifications.unshift(studentNotification);

    this.saveStore(store);
    return newGrade;
  }

  // Action: Create Group / Course
  createGroup(groupData: Omit<GroupCourse, 'id' | 'enrolledStudentIds'>) {
    const store = this.getStore();
    const newGroup: GroupCourse = {
      ...groupData,
      id: `grp-${Date.now()}`,
      enrolledStudentIds: [],
    };
    store.groups.push(newGroup);
    this.saveStore(store);
    return newGroup;
  }

  // Action: Record Student Payment (instant simulation PSE/Card or Admin registration)
  processStudentPayment(paymentId: string, paymentMethod: 'PSE' | 'Tarjeta de Crédito' | 'Transferencia Bancaria' | 'Efectivo') {
    const store = this.getStore();
    let studentId = '';
    let studentName = '';
    let amount = 0;

    const updatedPayments = store.payments.map((p) => {
      if (p.id === paymentId) {
        studentId = p.studentId;
        studentName = p.studentName;
        amount = p.amount;
        return {
          ...p,
          status: 'pagado' as const,
          paidDate: new Date().toISOString().split('T')[0],
          paymentMethod,
          referenceCode: p.referenceCode || `REC-PAG-${Math.floor(10000 + Math.random() * 90000)}`,
        };
      }
      return p;
    });

    // Update student balance due
    const updatedEnrollments = store.enrollments.map((enr) => {
      if (enr.userId === studentId) {
        return {
          ...enr,
          balanceDue: Math.max(0, enr.balanceDue - amount),
        };
      }
      return enr;
    });

    // Notifications
    const studentNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetUserId: studentId,
      title: '✅ Pago Procesado Exitosamente',
      message: `Hemos recibido tu pago de $${amount.toLocaleString('es-CO')} mediante ${paymentMethod}. Tu paz y salvo está al día.`,
      type: 'payment',
      read: false,
      timestamp: 'Justo ahora',
      targetTab: 'finances',
    };

    const adminNotif: AppNotification = {
      id: `notif-${Date.now() + 1}`,
      targetUserId: 'admin',
      title: '💰 Ingreso Registrado',
      message: `${studentName} pagó $${amount.toLocaleString('es-CO')} vía ${paymentMethod}.`,
      type: 'payment',
      read: false,
      timestamp: 'Justo ahora',
      targetTab: 'finances',
    };

    store.payments = updatedPayments;
    store.enrollments = updatedEnrollments;
    store.notifications.unshift(studentNotif, adminNotif);

    this.saveStore(store);
  }

  // Action: Submit Teacher Invoice / Cuenta de Cobro
  submitTeacherInvoice(invoiceData: Omit<TeacherInvoice, 'id' | 'status' | 'submissionDate'>) {
    const store = this.getStore();
    // Guarantee teacher salary/ratePerClass cannot be tampered with:
    const teacher = store.users.find((u) => u.id === invoiceData.teacherId);
    const assignedRate = teacher?.ratePerClass || 48000;
    const classCount = Number(invoiceData.classCount || invoiceData.hoursWorked || 1);
    const lockedTotal = classCount * assignedRate;

    const newInvoice: TeacherInvoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      classCount,
      ratePerClass: assignedRate,
      hoursWorked: classCount,
      hourlyRate: assignedRate,
      totalAmount: lockedTotal,
      status: 'pendiente',
      submissionDate: new Date().toISOString().split('T')[0],
    };

    // Notify Admin
    const adminNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetUserId: 'admin',
      title: '📄 Nueva Cuenta de Cobro Recibida',
      message: `${invoiceData.teacherName} ha radicado honorarios de ${invoiceData.monthPeriod} por ${classCount} clases ($${lockedTotal.toLocaleString('es-CO')}).`,
      type: 'payment',
      read: false,
      timestamp: 'Justo ahora',
      targetTab: 'invoices',
    };

    store.invoices.push(newInvoice);
    store.notifications.unshift(adminNotif);
    this.saveStore(store);
    return newInvoice;
  }

  // Action: Approve or Pay Teacher Invoice (Admin)
  updateTeacherInvoiceStatus(invoiceId: string, status: 'aprobado' | 'pagado' | 'rechazado', adminNotes?: string) {
    const store = this.getStore();
    let teacherId = '';
    let teacherName = '';
    let total = 0;

    const updatedInvoices = store.invoices.map((inv) => {
      if (inv.id === invoiceId) {
        teacherId = inv.teacherId;
        teacherName = inv.teacherName;
        total = inv.totalAmount;
        return {
          ...inv,
          status,
          adminNotes: adminNotes || inv.adminNotes,
          paymentDate: status === 'pagado' ? new Date().toISOString().split('T')[0] : inv.paymentDate,
        };
      }
      return inv;
    });

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetUserId: teacherId,
      title: status === 'pagado' ? '💵 Honorarios Pagados' : status === 'aprobado' ? '✅ Cuenta de Cobro Aprobada' : '⚠️ Cuenta de Cobro con Observaciones',
      message: `Tu cuenta de cobro por $${total.toLocaleString('es-CO')} ha cambiado al estado: "${status.toUpperCase()}". ${adminNotes ? `Nota: ${adminNotes}` : ''}`,
      type: 'payment',
      read: false,
      timestamp: 'Justo ahora',
      targetTab: 'invoices',
    };

    store.invoices = updatedInvoices;
    store.notifications.unshift(notif);
    this.saveStore(store);
  }

  // Action: Upload Resource / File / Video to Classroom
  addResource(resourceData: Omit<ResourceMaterial, 'id' | 'uploadedAt'>) {
    const store = this.getStore();
    const newRes: ResourceMaterial = {
      ...resourceData,
      id: `res-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    // Notify all enrolled students in that group
    const targetGroup = store.groups.find((g) => g.id === resourceData.groupId);
    if (targetGroup) {
      targetGroup.enrolledStudentIds.forEach((stdId) => {
        store.notifications.unshift({
          id: `notif-${Date.now()}-${stdId}`,
          targetUserId: stdId,
          title: `📚 Nuevo Material: ${resourceData.subject}`,
          message: `${resourceData.teacherName} subió "${resourceData.title}" (${resourceData.type === 'video' ? 'Video' : 'Archivo'}).`,
          type: 'system',
          read: false,
          timestamp: 'Justo ahora',
          targetTab: 'resources',
        });
      });
    }

    store.resources.unshift(newRes);
    this.saveStore(store);
    return newRes;
  }

  // Action: Create Forum Topic
  createForumTopic(topicData: Omit<ForumTopic, 'id' | 'createdAt' | 'likes'>) {
    const store = this.getStore();
    const newTopic: ForumTopic = {
      ...topicData,
      id: `forum-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      likes: 0,
    };
    store.forums.unshift(newTopic);
    this.saveStore(store);
    return newTopic;
  }

  // Action: Add Forum Reply
  addForumReply(replyData: Omit<ForumReply, 'id' | 'createdAt' | 'likes'>) {
    const store = this.getStore();
    const newReply: ForumReply = {
      ...replyData,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      likes: 0,
    };
    store.replies.push(newReply);
    this.saveStore(store);
    return newReply;
  }

  // Action: Calendar Event
  createEvent(eventData: Omit<CalendarEvent, 'id'>) {
    const store = this.getStore();
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
    };
    store.events.push(newEvent);

    // Notify relevant roles
    eventData.targetRoles.forEach((role) => {
      store.notifications.unshift({
        id: `notif-${Date.now()}-${role}`,
        targetUserId: role,
        title: `📅 Nuevo Evento: ${newEvent.title}`,
        message: `${newEvent.description.slice(0, 80)}... Fecha: ${newEvent.date} a las ${newEvent.time}.`,
        type: 'event',
        read: false,
        timestamp: 'Justo ahora',
        targetTab: 'calendar',
      });
    });

    this.saveStore(store);
    return newEvent;
  }

  // Action: Send Live Chat Message
  sendChatMessage(messageData: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>) {
    const store = this.getStore();
    const newMsg: ChatMessage = {
      ...messageData,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      read: false,
    };
    store.chats.push(newMsg);

    // Push notification to receiver
    if (messageData.receiverId) {
      store.notifications.unshift({
        id: `notif-${Date.now()}`,
        targetUserId: messageData.receiverId,
        title: `💬 Mensaje de ${messageData.senderName}`,
        message: messageData.text.length > 60 ? messageData.text.slice(0, 60) + '...' : messageData.text,
        type: 'chat',
        read: false,
        timestamp: 'Justo ahora',
        targetTab: 'chat',
      });
    }

    this.saveStore(store);
    return newMsg;
  }

  // Action: Complete Teacher Induction
  toggleTeacherInduction(inductionId: string, teacherId: string) {
    const store = this.getStore();
    store.inductions = store.inductions.map((ind) => {
      if (ind.id === inductionId) {
        const completed = ind.completedByTeacherIds.includes(teacherId);
        return {
          ...ind,
          completedByTeacherIds: completed
            ? ind.completedByTeacherIds.filter((id) => id !== teacherId)
            : [...ind.completedByTeacherIds, teacherId],
        };
      }
      return ind;
    });
    this.saveStore(store);
  }

  // Action: Create Course Projection
  createCourseProjection(projData: Omit<CourseProjection, 'id'>) {
    const store = this.getStore();
    const newProj: CourseProjection = {
      ...projData,
      id: `proj-${Date.now()}`,
    };
    store.projections.push(newProj);
    this.saveStore(store);
    return newProj;
  }

  // Action: Mark notification as read
  markNotificationRead(notificationId: string) {
    const store = this.getStore();
    store.notifications = store.notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.saveStore(store);
  }

  markAllNotificationsRead(userId: string, role: string) {
    const store = this.getStore();
    store.notifications = store.notifications.map((n) => {
      if (n.targetUserId === userId || n.targetUserId === role || n.targetUserId === 'all') {
        return { ...n, read: true };
      }
      return n;
    });
    this.saveStore(store);
  }

  // User Management
  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const store = this.getStore();
    const newUser: User = {
      ...userData,
      id: `usr-${userData.role.slice(0, 4)}-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      avatar:
        userData.avatar ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      active: userData.active !== undefined ? userData.active : true,
    };

    store.users.push(newUser);

    // If student, create a stub enrollment record if none exists
    if (newUser.role === 'student') {
      const defaultGroup = store.groups[0];
      const newEnrollment: StudentEnrollment = {
        id: `enr-${Date.now()}`,
        userId: newUser.id,
        fullName: newUser.name,
        avatar: newUser.avatar,
        email: newUser.email,
        documentId: newUser.documentId,
        phone: newUser.phone,
        guardianName: 'Por registrar',
        guardianPhone: newUser.phone,
        groupId: defaultGroup ? defaultGroup.id : 'grp-11a',
        groupName: defaultGroup ? defaultGroup.name : '11° Bachillerato',
        enrollmentDate: newUser.createdAt,
        status: 'activo',
        paymentPlan: 'Mensual',
        monthlyAmount: defaultGroup ? defaultGroup.monthlyFee : 180000,
        balanceDue: 0,
      };
      store.enrollments.push(newEnrollment);
    }

    this.saveStore(store);
    return newUser;
  }

  updateUser(userId: string, data: Partial<User>) {
    const store = this.getStore();
    store.users = store.users.map((u) => {
      if (u.id === userId) {
        const updated = { ...u, ...data };
        // If current user is modified, update in session
        const currentUser = this.getCurrentUser();
        if (currentUser.id === userId) {
          this.setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    });

    // Sync avatar / name / phone in enrollments if this user is a student
    if (data.avatar || data.name || data.phone || data.email || data.documentId) {
      store.enrollments = store.enrollments.map((e) => {
        if (e.userId === userId) {
          return {
            ...e,
            fullName: data.name || e.fullName,
            avatar: data.avatar || e.avatar,
            email: data.email || e.email,
            phone: data.phone || e.phone,
            documentId: data.documentId || e.documentId,
          };
        }
        return e;
      });
    }

    this.saveStore(store);
  }

  deleteUser(userId: string) {
    const store = this.getStore();
    store.users = store.users.filter((u) => u.id !== userId);
    store.enrollments = store.enrollments.filter((e) => e.userId !== userId);
    this.saveStore(store);
  }

  updateStudentAvatar(userId: string, avatarUrl: string) {
    const store = this.getStore();
    store.users = store.users.map((u) => (u.id === userId ? { ...u, avatar: avatarUrl } : u));
    store.enrollments = store.enrollments.map((e) =>
      e.userId === userId ? { ...e, avatar: avatarUrl } : e
    );
    const currentUser = this.getCurrentUser();
    if (currentUser.id === userId) {
      this.setCurrentUser({ ...currentUser, avatar: avatarUrl });
    }
    this.saveStore(store);
  }

  // Role Permissions Customization
  updateRolePermissions(role: UserRole, permissions: Partial<RolePermissions>) {
    const store = this.getStore();
    if (!store.permissions) {
      store.permissions = { ...DEFAULT_ROLE_PERMISSIONS };
    }
    store.permissions[role] = {
      ...store.permissions[role],
      ...permissions,
    };
    this.saveStore(store);
  }

  // WhatsApp Extension Operations
  sendWhatsAppMessage(
    chatId: string,
    text: string,
    sender: 'user' | 'business' | 'ai' = 'business',
    suggestedByAI: boolean = false,
    responder?: {
      respondedBy: string;
      respondedById: string;
      respondedByRole: 'admin' | 'agent';
      respondedByCargo?: string;
      respondedByAvatar?: string;
    }
  ) {
    const store = this.getStore();
    const newMsg: WhatsAppMessage = {
      id: `wam-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: sender === 'user' ? 'delivered' : 'read',
      suggestedByAI,
      respondedBy: responder?.respondedBy,
      respondedById: responder?.respondedById,
      respondedByRole: responder?.respondedByRole,
      respondedByCargo: responder?.respondedByCargo,
      respondedByAvatar: responder?.respondedByAvatar,
    };

    store.whatsappChats = store.whatsappChats.map((c) => {
      if (c.id === chatId) {
        return {
          ...c,
          lastMessage: text,
          lastMessageTime: newMsg.timestamp,
          unreadCount: sender === 'user' ? c.unreadCount + 1 : 0,
          lastRespondedBy: responder?.respondedBy || c.lastRespondedBy,
          lastRespondedById: responder?.respondedById || c.lastRespondedById,
          lastRespondedByRole: responder?.respondedByRole || c.lastRespondedByRole,
          lastRespondedByAvatar: responder?.respondedByAvatar || c.lastRespondedByAvatar,
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    this.saveStore(store);
  }

  assignWhatsAppChat(chatId: string, agentId: string, agentName: string) {
    const store = this.getStore();
    store.whatsappChats = store.whatsappChats.map((c) =>
      c.id === chatId ? { ...c, assignedAgentId: agentId, assignedAgentName: agentName } : c
    );
    this.saveStore(store);
  }

  updateWhatsAppRecruitmentStage(
    chatId: string,
    stage: WhatsAppRecruitmentStage,
    notes?: string,
    program?: string
  ) {
    const store = this.getStore();
    store.whatsappChats = store.whatsappChats.map((c) =>
      c.id === chatId
        ? {
            ...c,
            recruitmentStage: stage,
            recruitmentNotes: notes !== undefined ? notes : c.recruitmentNotes,
            programOfInterest: program || c.programOfInterest,
          }
        : c
    );
    this.saveStore(store);
  }

  updateWhatsAppAutoReply(chatId: string, enabled: boolean) {
    const store = this.getStore();
    store.whatsappChats = store.whatsappChats.map((c) =>
      c.id === chatId ? { ...c, aiAutoReplyEnabled: enabled } : c
    );
    this.saveStore(store);
  }

  createWhatsAppChat(
    contactName: string,
    phoneNumber: string,
    type: 'aspirante' | 'padre_familia' | 'estudiante' | 'docente',
    firstMessage: string
  ) {
    const store = this.getStore();
    const newChatId = `wa-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newChat: WhatsAppConversation = {
      id: newChatId,
      contactName,
      phoneNumber,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      type,
      unreadCount: 1,
      lastMessage: firstMessage,
      lastMessageTime: timestamp,
      aiAutoReplyEnabled: false,
      messages: [
        {
          id: `wam-${Date.now()}`,
          sender: 'user',
          text: firstMessage,
          timestamp,
          status: 'delivered',
        },
      ],
    };

    store.whatsappChats = [newChat, ...store.whatsappChats];
    this.saveStore(store);
    return newChat;
  }

  // Staff Calls Operations
  recordStaffCall(session: Omit<StaffCallSession, 'id'>) {
    const store = this.getStore();
    const newCall: StaffCallSession = {
      ...session,
      id: `call-${Date.now()}`,
    };
    store.staffCalls = [newCall, ...(store.staffCalls || [])];
    this.saveStore(store);
    return newCall;
  }

  updateStaffCall(callId: string, updates: Partial<StaffCallSession>) {
    const store = this.getStore();
    store.staffCalls = (store.staffCalls || []).map((c) =>
      c.id === callId ? { ...c, ...updates } : c
    );
    this.saveStore(store);
  }

  // Admin Notepad Operations
  createAdminNote(noteData: Omit<AdminNote, 'id' | 'createdAt' | 'updatedAt'>) {
    const store = this.getStore();
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newNote: AdminNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: timeStr,
      updatedAt: timeStr,
    };
    store.adminNotes = [newNote, ...(store.adminNotes || [])];
    this.saveStore(store);
    return newNote;
  }

  updateAdminNote(id: string, updates: Partial<AdminNote>) {
    const store = this.getStore();
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    store.adminNotes = (store.adminNotes || []).map((n) =>
      n.id === id ? { ...n, ...updates, updatedAt: timeStr } : n
    );
    this.saveStore(store);
  }

  deleteAdminNote(id: string) {
    const store = this.getStore();
    store.adminNotes = (store.adminNotes || []).filter((n) => n.id !== id);
    this.saveStore(store);
  }

  // Student Certificate Requests Operations
  requestCertificate(
    reqData: Omit<
      CertificateRequest,
      'id' | 'requestedAt' | 'verificationCode' | 'status' | 'issueDate' | 'signedBy'
    >
  ) {
    const store = this.getStore();
    const now = new Date();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const code = `AUR-${now.getFullYear()}-${randomDigits}-${reqData.certificateType.slice(0, 3).toUpperCase()}`;

    const newReq: CertificateRequest = {
      ...reqData,
      id: `cert-${Date.now()}`,
      status: 'generado',
      requestedAt: `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      issueDate: now.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
      verificationCode: code,
      signedBy: 'Dra. Sofía Valenzuela - Dirección Académica Áurea',
    };

    store.certificateRequests = [newReq, ...(store.certificateRequests || [])];

    // Notification to student
    store.notifications.unshift({
      id: `notif-${Date.now()}`,
      targetUserId: reqData.studentId,
      title: '📜 Certificado Generado con Éxito',
      message: `Tu certificado (${reqData.certificateType}) ya está listo con código institucional ${code}. Puedes previsualizarlo e imprimirlo.`,
      type: 'system',
      read: false,
      timestamp: 'Justo ahora',
      targetTab: 'certificates',
    });

    this.saveStore(store);
    return newReq;
  }

  updateCertificateStatus(id: string, status: 'generado' | 'pendiente' | 'aprobado', signedBy?: string) {
    const store = this.getStore();
    store.certificateRequests = (store.certificateRequests || []).map((c) =>
      c.id === id ? { ...c, status, signedBy: signedBy || c.signedBy } : c
    );
    this.saveStore(store);
  }

  // Teacher Salary / Cargo update
  updateUserSalaryRate(userId: string, ratePerClass: number, assignedSalary?: number) {
    const store = this.getStore();
    store.users = store.users.map((u) =>
      u.id === userId ? { ...u, ratePerClass, assignedSalary: assignedSalary || u.assignedSalary } : u
    );
    this.saveStore(store);
  }

  // Accounting entries
  createAccountingEntry(entry: Omit<AccountingEntry, 'id' | 'createdAt'>): AccountingEntry {
    const store = this.getStore();
    const newEntry: AccountingEntry = {
      ...entry,
      id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toLocaleString('es-CO'),
    };
    store.accounting = [newEntry, ...(store.accounting || [])];
    this.saveStore(store);
    return newEntry;
  }

  deleteAccountingEntry(id: string) {
    const store = this.getStore();
    store.accounting = (store.accounting || []).filter((e) => e.id !== id);
    this.saveStore(store);
  }

  // Fixed Assets
  createFixedAsset(asset: Omit<FixedAsset, 'id' | 'createdAt'>): FixedAsset {
    const store = this.getStore();
    const newAsset: FixedAsset = {
      ...asset,
      id: `asset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    store.fixedAssets = [newAsset, ...(store.fixedAssets || [])];
    this.saveStore(store);
    return newAsset;
  }

  updateFixedAsset(id: string, updates: Partial<FixedAsset>): FixedAsset | null {
    const store = this.getStore();
    let updated: FixedAsset | null = null;
    store.fixedAssets = (store.fixedAssets || []).map((a) => {
      if (a.id === id) {
        updated = { ...a, ...updates };
        return updated;
      }
      return a;
    });
    this.saveStore(store);
    return updated;
  }

  deleteFixedAsset(id: string) {
    const store = this.getStore();
    store.fixedAssets = (store.fixedAssets || []).filter((a) => a.id !== id);
    this.saveStore(store);
  }

  // Attendance Sessions
  saveAttendanceSession(sessionData: Omit<AttendanceSession, 'id' | 'createdAt'>): AttendanceSession {
    const store = this.getStore();
    const existingIndex = (store.attendanceSessions || []).findIndex(
      (s) => s.groupId === sessionData.groupId && s.date === sessionData.date
    );

    let savedSession: AttendanceSession;

    if (existingIndex >= 0) {
      savedSession = {
        ...store.attendanceSessions[existingIndex],
        ...sessionData,
      };
      store.attendanceSessions[existingIndex] = savedSession;
    } else {
      savedSession = {
        ...sessionData,
        id: `att-sess-${Date.now()}`,
        createdAt: new Date().toLocaleString('es-CO'),
      };
      store.attendanceSessions = [savedSession, ...(store.attendanceSessions || [])];
    }

    this.saveStore(store);
    return savedSession;
  }

  deleteAttendanceSession(id: string) {
    const store = this.getStore();
    store.attendanceSessions = (store.attendanceSessions || []).filter((s) => s.id !== id);
    this.saveStore(store);
  }

  // Cloud Backup: Export all JSON
  exportBackupJSON(): string {
    const store = this.getStore();
    store.lastBackupDate = new Date().toISOString();
    this.saveStore(store);
    return JSON.stringify(store, null, 2);
  }

  // Cloud Backup: Restore from JSON
  restoreBackupJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.users && parsed.enrollments && parsed.groups) {
        this.saveStore(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Module grades & progress calculation (0-100% progress bar)
  saveModuleGrade(data: Omit<StudentModuleGrade, 'id' | 'updatedAt'>): StudentModuleGrade {
    const store = this.getStore();
    const existingIndex = (store.moduleGrades || []).findIndex(
      (m) => m.studentId === data.studentId && m.moduleId === data.moduleId
    );
    const updatedRecord: StudentModuleGrade = {
      ...data,
      id: existingIndex >= 0 ? store.moduleGrades[existingIndex].id : `mgr-${Date.now()}`,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    if (!store.moduleGrades) store.moduleGrades = [];
    if (existingIndex >= 0) {
      store.moduleGrades[existingIndex] = updatedRecord;
    } else {
      store.moduleGrades.unshift(updatedRecord);
    }
    this.saveStore(store);
    return updatedRecord;
  }

  getStudentAcademicProgress(studentId: string) {
    const store = this.getStore();
    const studentGrades = (store.moduleGrades || []).filter((g) => g.studentId === studentId);
    const approvedGrades = studentGrades.filter((g) => g.status === 'aprobado' || g.finalScore >= 3.0);
    
    // Find relevant modules for student's enrolled program
    const enrollment = (store.enrollments || []).find((e) => e.userId === studentId);
    const programName = enrollment?.groupName?.includes('Barbería')
      ? 'Barbería Profesional & Fade'
      : enrollment?.groupName?.includes('Manicura')
      ? 'Manicura Rusa, Acrílico & Nail Art'
      : 'Técnico Laboral en Peluquería Integral';
    
    const programModules = (store.pensumModules || []).filter((m) => m.program === programName);
    const totalModulesCount = programModules.length > 0 ? programModules.length : 8;
    const approvedModulesCount = approvedGrades.length;
    const modulesPercentage = Math.min(100, Math.round((approvedModulesCount / totalModulesCount) * 100));

    // Practice hours in Salon Escuela
    const studentPractices = (store.practiceRecords || []).filter(
      (p) => p.studentId === studentId && p.status === 'aprobado'
    );
    const totalPracticeHours = studentPractices.reduce((acc, p) => acc + (p.practiceHours || 0), 0);
    const requiredPracticeHours = 250; // standard beauty academy requirement
    const practiceHoursPercentage = Math.min(100, Math.round((totalPracticeHours / requiredPracticeHours) * 100));

    // Combined 0-100% progress: 60% weight on academic modules, 40% weight on practical salon hours
    const overallPercentage = Math.min(
      100,
      Math.max(0, Math.round(modulesPercentage * 0.6 + practiceHoursPercentage * 0.4))
    );

    // GPA
    const gpa =
      studentGrades.length > 0
        ? Number((studentGrades.reduce((sum, g) => sum + g.finalScore, 0) / studentGrades.length).toFixed(2))
        : 0;

    let stageLabel = 'Fase 1: Iniciación, Tricología & Bioseguridad (0% - 25%)';
    if (overallPercentage >= 95) {
      stageLabel = 'Fase 5: Apto para Grado & Certificación Profesional (100%)';
    } else if (overallPercentage >= 75) {
      stageLabel = 'Fase 4: Salón Escuela Avanzado & Book de Estilo (75% - 95%)';
    } else if (overallPercentage >= 50) {
      stageLabel = 'Fase 3: Colorimetría, Balayage & Alisados (50% - 75%)';
    } else if (overallPercentage >= 25) {
      stageLabel = 'Fase 2: Técnicas de Corte & Brushing (25% - 50%)';
    }

    return {
      studentId,
      overallPercentage,
      approvedModulesCount,
      totalModulesCount,
      modulesPercentage,
      totalPracticeHours,
      requiredPracticeHours,
      practiceHoursPercentage,
      gpa,
      stageLabel,
      programName,
    };
  }

  // Practices Logbook
  createPracticeRecord(record: Omit<SalonPracticeRecord, 'id' | 'createdAt'>): SalonPracticeRecord {
    const store = this.getStore();
    const newRecord: SalonPracticeRecord = {
      ...record,
      id: `prac-${Date.now()}`,
      createdAt: new Date().toLocaleString(),
    };
    if (!store.practiceRecords) store.practiceRecords = [];
    store.practiceRecords.unshift(newRecord);
    this.saveStore(store);
    return newRecord;
  }

  updatePracticeRecord(id: string, updates: Partial<SalonPracticeRecord>): SalonPracticeRecord | null {
    const store = this.getStore();
    const idx = (store.practiceRecords || []).findIndex((p) => p.id === id);
    if (idx === -1) return null;
    store.practiceRecords[idx] = { ...store.practiceRecords[idx], ...updates };
    this.saveStore(store);
    return store.practiceRecords[idx];
  }

  deletePracticeRecord(id: string): void {
    const store = this.getStore();
    store.practiceRecords = (store.practiceRecords || []).filter((p) => p.id !== id);
    this.saveStore(store);
  }

  // Student Observer Entries
  createObserverEntry(entry: Omit<StudentObserverEntry, 'id' | 'createdAt'>): StudentObserverEntry {
    const store = this.getStore();
    const newEntry: StudentObserverEntry = {
      ...entry,
      id: `obs-${Date.now()}`,
      createdAt: new Date().toLocaleString(),
    };
    if (!store.observerEntries) store.observerEntries = [];
    store.observerEntries.unshift(newEntry);
    this.saveStore(store);
    return newEntry;
  }

  updateObserverEntry(id: string, updates: Partial<StudentObserverEntry>): StudentObserverEntry | null {
    const store = this.getStore();
    const idx = (store.observerEntries || []).findIndex((o) => o.id === id);
    if (idx === -1) return null;
    store.observerEntries[idx] = { ...store.observerEntries[idx], ...updates };
    this.saveStore(store);
    return store.observerEntries[idx];
  }

  deleteObserverEntry(id: string): void {
    const store = this.getStore();
    store.observerEntries = (store.observerEntries || []).filter((o) => o.id !== id);
    this.saveStore(store);
  }

  // Academy Notices
  createAcademyNotice(notice: Omit<AcademyNotice, 'id' | 'publishedAt'>): AcademyNotice {
    const store = this.getStore();
    const newNotice: AcademyNotice = {
      ...notice,
      id: `not-${Date.now()}`,
      publishedAt: new Date().toISOString().slice(0, 10),
      likes: notice.likes || 0,
      likedUserIds: notice.likedUserIds || [],
    };
    if (!store.academyNotices) store.academyNotices = [];
    store.academyNotices.unshift(newNotice);
    this.saveStore(store);
    return newNotice;
  }

  updateAcademyNotice(id: string, updates: Partial<AcademyNotice>): AcademyNotice | null {
    const store = this.getStore();
    const idx = (store.academyNotices || []).findIndex((n) => n.id === id);
    if (idx === -1) return null;
    store.academyNotices[idx] = { ...store.academyNotices[idx], ...updates };
    this.saveStore(store);
    return store.academyNotices[idx];
  }

  toggleNoticeLike(noticeId: string, userId: string): { likes: number; isLiked: boolean } {
    const store = this.getStore();
    const notice = (store.academyNotices || []).find((n) => n.id === noticeId);
    if (!notice) return { likes: 0, isLiked: false };

    if (!notice.likedUserIds) notice.likedUserIds = [];
    const hasLiked = notice.likedUserIds.includes(userId);

    if (hasLiked) {
      notice.likedUserIds = notice.likedUserIds.filter((id) => id !== userId);
      notice.likes = Math.max(0, (notice.likes || 1) - 1);
    } else {
      notice.likedUserIds.push(userId);
      notice.likes = (notice.likes || 0) + 1;
    }

    this.saveStore(store);
    return { likes: notice.likes, isLiked: !hasLiked };
  }

  deleteAcademyNotice(id: string): void {
    const store = this.getStore();
    store.academyNotices = (store.academyNotices || []).filter((n) => n.id !== id);
    this.saveStore(store);
  }

  // Teacher-Student Direct Messages
  sendTeacherStudentMessage(msg: Omit<TeacherStudentMsg, 'id' | 'timestamp' | 'read'>): TeacherStudentMsg {
    const store = this.getStore();
    const newMsg: TeacherStudentMsg = {
      ...msg,
      id: `ts-msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    if (!store.teacherStudentMessages) store.teacherStudentMessages = [];
    store.teacherStudentMessages.push(newMsg);
    this.saveStore(store);
    return newMsg;
  }

  markTeacherStudentMessageAsRead(id: string): void {
    const store = this.getStore();
    const msg = (store.teacherStudentMessages || []).find((m) => m.id === id);
    if (msg) {
      msg.read = true;
      this.saveStore(store);
    }
  }

  // ==========================================
  // CALL CENTER, AGENDAS, MATRÍCULAS Y COMISIONES
  // ==========================================
  createCallCenterSchedule(item: Omit<CallCenterScheduleItem, 'id' | 'createdAt'>): CallCenterScheduleItem {
    const store = this.getStore();
    const newItem: CallCenterScheduleItem = {
      ...item,
      id: `sched-${Date.now()}`,
      createdAt: new Date().toLocaleString(),
    };
    if (!store.callCenterSchedules) store.callCenterSchedules = [];
    store.callCenterSchedules.unshift(newItem);
    this.saveStore(store);
    return newItem;
  }

  updateCallCenterSchedule(id: string, updates: Partial<CallCenterScheduleItem>): CallCenterScheduleItem | null {
    const store = this.getStore();
    const idx = (store.callCenterSchedules || []).findIndex((s) => s.id === id);
    if (idx === -1) return null;
    store.callCenterSchedules[idx] = { ...store.callCenterSchedules[idx], ...updates };
    this.saveStore(store);
    return store.callCenterSchedules[idx];
  }

  deleteCallCenterSchedule(id: string): void {
    const store = this.getStore();
    store.callCenterSchedules = (store.callCenterSchedules || []).filter((s) => s.id !== id);
    this.saveStore(store);
  }

  enrollStudentByAgent(data: {
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
    totalTuitionFee: number;
    initialPayment: number;
    paymentMethod: 'Efectivo' | 'Nequi' | 'Daviplata' | 'Transferencia Bancaria' | 'PSE' | 'Tarjeta';
    discountAmount?: number;
    discountAuthorizedBy?: string;
    agentId: string;
    agentName: string;
    notes?: string;
  }): AgentEnrollmentRecord {
    const store = this.getStore();
    const now = new Date();
    const enrollmentDate = now.toISOString().slice(0, 10);
    const voucherNumber = `REC-MAT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const studentId = `usr-stud-${Date.now()}`;
    const enrollmentId = `enr-${Date.now()}`;
    const agentRecordId = `enr-agent-${Date.now()}`;
    const baseCommission = 50000;

    // 1. Create or ensure student User
    let existingUser = store.users.find(
      (u) => u.documentId?.toLowerCase() === data.studentDocument.toLowerCase()
    );
    if (!existingUser) {
      existingUser = {
        id: studentId,
        name: data.studentName,
        email: data.studentEmail || `estudiante_${Date.now()}@arteyestilo.edu.co`,
        password: 'est',
        role: 'student',
        phone: data.studentPhone,
        documentId: data.studentDocument,
        gradeLevel: data.programName,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        active: true,
        createdAt: enrollmentDate,
      };
      store.users.push(existingUser);
    }

    // 2. Add to Group enrolledStudentIds
    const grp = (store.groups || []).find((g) => g.id === data.groupId);
    if (grp) {
      if (!grp.enrolledStudentIds) grp.enrolledStudentIds = [];
      if (!grp.enrolledStudentIds.includes(existingUser.id)) {
        grp.enrolledStudentIds.push(existingUser.id);
      }
    }

    // 3. Create StudentEnrollment
    const newEnrollment: StudentEnrollment = {
      id: enrollmentId,
      userId: existingUser.id,
      fullName: data.studentName,
      avatar: existingUser.avatar,
      email: existingUser.email,
      documentId: data.studentDocument,
      phone: data.studentPhone,
      guardianName: data.guardianName || 'N/A',
      guardianPhone: data.guardianPhone || 'N/A',
      groupId: data.groupId,
      groupName: data.groupName,
      enrollmentDate,
      status: 'activo',
      paymentPlan: 'Mensual',
      monthlyAmount: 350000,
      balanceDue: Math.max(0, data.totalTuitionFee - data.initialPayment - (data.discountAmount || 0)),
    };
    if (!store.enrollments) store.enrollments = [];
    store.enrollments.unshift(newEnrollment);

    // 4. Create AgentEnrollmentRecord
    const agentRecord: AgentEnrollmentRecord = {
      id: agentRecordId,
      studentId: existingUser.id,
      studentName: data.studentName,
      studentDocument: data.studentDocument,
      studentPhone: data.studentPhone,
      studentEmail: data.studentEmail,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      programName: data.programName,
      groupId: data.groupId,
      groupName: data.groupName,
      shift: data.shift,
      enrollmentDate,
      totalTuitionFee: data.totalTuitionFee,
      initialPayment: data.initialPayment,
      paymentMethod: data.paymentMethod,
      voucherNumber,
      discountAmount: data.discountAmount || 0,
      discountAuthorizedBy: data.discountAuthorizedBy,
      agentId: data.agentId,
      agentName: data.agentName,
      commissionEarned: baseCommission,
      commissionStatus: 'aprobada',
      notes: data.notes,
      receiptGenerated: true,
    };
    if (!store.agentEnrollments) store.agentEnrollments = [];
    store.agentEnrollments.unshift(agentRecord);

    // 5. Update Agent Commissions Summary
    const currentMonth = enrollmentDate.slice(0, 7); // '2026-09'
    if (!store.agentCommissions) store.agentCommissions = [];
    let agentComm = store.agentCommissions.find(
      (c) => c.agentId === data.agentId && c.month === currentMonth
    );
    if (!agentComm) {
      agentComm = {
        agentId: data.agentId,
        agentName: data.agentName,
        month: currentMonth,
        enrollmentCount: 0,
        baseCommissionTotal: 0,
        bonusAmount: 0,
        totalCommission: 0,
        status: 'pendiente',
      };
      store.agentCommissions.push(agentComm);
    }
    agentComm.enrollmentCount += 1;
    agentComm.baseCommissionTotal = agentComm.enrollmentCount * baseCommission;
    // Bonus ladder: >= 15 matrículas (+$500.000), >= 10 (+$250.000), >= 5 (+$100.000)
    if (agentComm.enrollmentCount >= 15) {
      agentComm.bonusAmount = 500000;
    } else if (agentComm.enrollmentCount >= 10) {
      agentComm.bonusAmount = 250000;
    } else if (agentComm.enrollmentCount >= 5) {
      agentComm.bonusAmount = 100000;
    } else {
      agentComm.bonusAmount = 0;
    }
    agentComm.totalCommission = agentComm.baseCommissionTotal + agentComm.bonusAmount;

    // 6. Record Initial Payment in store.payments & accounting if payment > 0
    if (data.initialPayment > 0) {
      if (!store.payments) store.payments = [];
      const paymentMethodMapped =
        data.paymentMethod === 'Efectivo'
          ? 'Efectivo'
          : data.paymentMethod === 'PSE'
          ? 'PSE'
          : data.paymentMethod === 'Tarjeta'
          ? 'Tarjeta de Crédito'
          : 'Transferencia Bancaria';

      store.payments.unshift({
        id: `pay-${Date.now()}`,
        studentId: existingUser.id,
        studentName: data.studentName,
        concept: `Abono de Matrícula Inicial - ${data.programName}`,
        amount: data.initialPayment,
        dueDate: enrollmentDate,
        paidDate: enrollmentDate,
        status: 'pagado',
        referenceCode: voucherNumber,
        paymentMethod: paymentMethodMapped,
      });

      if (!store.accounting) store.accounting = [];
      store.accounting.unshift({
        id: `acc-${Date.now()}`,
        date: enrollmentDate,
        type: 'ingreso',
        category: 'Matrícula',
        concept: `Ingreso Matrícula ${data.studentName} (${data.programName}) - Recibo: ${voucherNumber}. Asesora: ${data.agentName}`,
        amount: data.initialPayment,
        voucherNumber,
        beneficiaryOrClient: data.studentName,
        paymentMethod: (data.paymentMethod === 'Tarjeta' ? 'Tarjeta Débito/Crédito' : data.paymentMethod) as any,
        registeredBy: data.agentName,
        createdAt: new Date().toISOString(),
      });
    }

    // 7. Send notification to Administration
    if (!store.notifications) store.notifications = [];
    store.notifications.unshift({
      id: `notif-${Date.now()}`,
      targetUserId: 'admin',
      title: '🎉 ¡Nueva Matrícula Registrada!',
      message: `${data.agentName} (Call Center) matriculó a ${data.studentName} en ${data.programName} (${data.groupName}). Abono inicial: $${data.initialPayment.toLocaleString('es-CO')}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'payment',
      targetTab: 'callCenter',
    });

    this.saveStore(store);
    return agentRecord;
  }

  // Admin-Agent Chat
  sendAdminAgentMessage(msg: Omit<AdminAgentMessage, 'id' | 'timestamp' | 'date' | 'read'>): AdminAgentMessage {
    const store = this.getStore();
    const now = new Date();
    const newMsg: AdminAgentMessage = {
      ...msg,
      id: `aam-${Date.now()}`,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toISOString().slice(0, 10),
      read: false,
    };
    if (!store.adminAgentMessages) store.adminAgentMessages = [];
    store.adminAgentMessages.push(newMsg);

    // Notifications
    if (!store.notifications) store.notifications = [];
    if (msg.senderRole === 'agent') {
      store.notifications.unshift({
        id: `notif-${Date.now()}`,
        targetUserId: msg.recipientId || 'admin',
        title: msg.type === 'discount_request' ? '🏷️ Solicitud de Descuento (Ventas)' : '💬 Mensaje de Vendedora (Chat Center)',
        message: `${msg.senderName}: ${msg.message.slice(0, 80)}...`,
        timestamp: newMsg.timestamp,
        read: false,
        type: msg.type === 'discount_request' ? 'system' : 'chat',
        targetTab: 'chatCenter',
      });
    } else if (msg.senderRole === 'admin') {
      store.notifications.unshift({
        id: `notif-${Date.now()}`,
        targetUserId: msg.recipientId || msg.agentId,
        title: '💬 Mensaje de Dirección (Chat Center)',
        message: `${msg.senderName}: ${msg.message.slice(0, 80)}...`,
        timestamp: newMsg.timestamp,
        read: false,
        type: 'chat',
        targetTab: 'chatCenter',
      });
    }

    this.saveStore(store);
    return newMsg;
  }

  updateAdminAgentMessage(id: string, updates: Partial<AdminAgentMessage>): AdminAgentMessage | null {
    const store = this.getStore();
    const idx = (store.adminAgentMessages || []).findIndex((m) => m.id === id);
    if (idx === -1) return null;
    store.adminAgentMessages[idx] = { ...store.adminAgentMessages[idx], ...updates };
    this.saveStore(store);
    return store.adminAgentMessages[idx];
  }

  approveOrRejectDiscount(
    messageId: string,
    decision: 'aprobado' | 'rechazado',
    adminName: string
  ): void {
    const store = this.getStore();
    const msg = (store.adminAgentMessages || []).find((m) => m.id === messageId);
    if (msg && msg.discountRequestData) {
      msg.discountRequestData.status = decision;
      msg.discountRequestData.authorizedBy = adminName;
      msg.type = decision === 'aprobado' ? 'discount_approved' : 'discount_rejected';

      // Send system confirmation message back into chat
      const sysMsg: AdminAgentMessage = {
        id: `aam-${Date.now()}`,
        agentId: msg.agentId,
        agentName: msg.agentName,
        senderId: 'admin',
        senderName: adminName,
        senderRole: 'admin',
        message: decision === 'aprobado'
          ? `✅ Solicitud de descuento APROBADA para ${msg.discountRequestData.prospectName} en ${msg.discountRequestData.programName} (${msg.discountRequestData.discountPercent}% off). Puedes proceder con el cierre de la matrícula.`
          : `❌ Solicitud de descuento NO autorizada para ${msg.discountRequestData.prospectName}. Aplica facilidades en cuotas estándar sin alterar el valor base.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().slice(0, 10),
        type: decision === 'aprobado' ? 'discount_approved' : 'discount_rejected',
        read: false,
      };
      store.adminAgentMessages.push(sysMsg);
      this.saveStore(store);
    }
  }

  liquidateAgentCommission(agentId: string, month: string, adminName: string): boolean {
    const store = this.getStore();
    const comm = (store.agentCommissions || []).find(
      (c) => c.agentId === agentId && c.month === month
    );
    if (!comm || comm.status === 'liquidada_pagada') return false;

    comm.status = 'liquidada_pagada';
    comm.lastPayoutDate = new Date().toISOString().slice(0, 10);
    comm.payoutVoucherNumber = `EG-COM-${Date.now()}`;

    // Mark corresponding agent enrollments as paid
    (store.agentEnrollments || []).forEach((e) => {
      if (e.agentId === agentId && e.enrollmentDate.startsWith(month)) {
        e.commissionStatus = 'liquidada_pagada';
      }
    });

    // Register expense in accounting
    if (!store.accounting) store.accounting = [];
    store.accounting.unshift({
      id: `acc-comm-${Date.now()}`,
      date: comm.lastPayoutDate,
      type: 'egreso',
      category: 'Nómina & Honorarios Docentes',
      concept: `Liquidación de Comisiones Call Center - ${comm.agentName} (${comm.enrollmentCount} matrículas, Mes: ${month}). Comprobante: ${comm.payoutVoucherNumber}`,
      amount: comm.totalCommission,
      voucherNumber: comm.payoutVoucherNumber,
      beneficiaryOrClient: comm.agentName,
      paymentMethod: 'Transferencia Bancaria',
      registeredBy: adminName,
      createdAt: new Date().toISOString(),
    });

    this.saveStore(store);
    return true;
  }

  // Reset to initial demo data
  resetToDefault() {
    const initial = this.getInitialStore();
    this.saveStore(initial);
    this.setCurrentUser(INITIAL_USERS[0]);
  }
}

export const appStorage = new AppStorageService();
