import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LiveChat } from './components/LiveChat';
import { AuthModal } from './components/AuthModal';

// Admin modules
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminNotepad } from './components/admin/AdminNotepad';
import { StudentsManagement } from './components/admin/StudentsManagement';
import { GroupsManagement } from './components/admin/GroupsManagement';
import { FinancesManagement } from './components/admin/FinancesManagement';
import { InstitutionalCalendar } from './components/admin/InstitutionalCalendar';
import { CourseProjections } from './components/admin/CourseProjections';
import { CloudBackup } from './components/admin/CloudBackup';
import { UsersManagement } from './components/admin/UsersManagement';
import { RolePermissionsManagement } from './components/admin/RolePermissionsManagement';
import { WhatsAppExtension } from './components/admin/WhatsAppExtension';
import { CyberShieldCenter } from './components/admin/CyberShieldCenter';

// Teacher modules
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherGrades } from './components/teacher/TeacherGrades';
import { TeacherInvoices } from './components/teacher/TeacherInvoices';
import { TeacherInductions } from './components/teacher/TeacherInductions';
import { TeacherVirtualClassroom } from './components/teacher/TeacherVirtualClassroom';

// Student modules
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentFinances } from './components/student/StudentFinances';
import { StudentGrades } from './components/student/StudentGrades';
import { StudentCertificates } from './components/student/StudentCertificates';

// Shared modules
import { ForumsView } from './components/forums/ForumsView';
import { StaffCommunicationHub } from './components/common/StaffCommunicationHub';
import { AccountingManagement } from './components/admin/AccountingManagement';
import { AttendanceManagement } from './components/common/AttendanceManagement';

// Beauty Academy modules
import { PensumView } from './components/academy/PensumView';
import { SalonPracticesView } from './components/academy/SalonPracticesView';
import { StudentObserverView } from './components/academy/StudentObserverView';
import { TeacherStudentChatView } from './components/academy/TeacherStudentChatView';
import { AcademyNoticesView } from './components/academy/AcademyNoticesView';
import { CallCenterView } from './components/callcenter/CallCenterView';
import { ChatCenterView } from './components/callcenter/ChatCenterView';

const AppContent: React.FC = () => {
  const { currentRole, activeTab } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Render module based on current role and active tab
  const renderActiveModule = () => {
    // Shared Beauty Academy Tabs across roles
    if (activeTab === 'chatCenter') return <ChatCenterView />;
    if (activeTab === 'callCenter') return <CallCenterView />;
    if (activeTab === 'pensum') return <PensumView />;
    if (activeTab === 'practices') return <SalonPracticesView />;
    if (activeTab === 'observer') return <StudentObserverView />;
    if (activeTab === 'teacherStudentChat') return <TeacherStudentChatView />;
    if (activeTab === 'notices') return <AcademyNoticesView />;

    // Agent / Call Center Views
    if (currentRole === 'agent') {
      switch (activeTab) {
        case 'callCenter':
          return <CallCenterView />;
        case 'notepad':
          return <AdminNotepad />;
        case 'whatsapp':
          return <WhatsAppExtension />;
        case 'students':
          return <StudentsManagement />;
        case 'groups':
          return <GroupsManagement />;
        case 'calendar':
          return <InstitutionalCalendar />;
        case 'projections':
          return <CourseProjections />;
        default:
          return <CallCenterView />;
      }
    }

    // Admin Views
    if (currentRole === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'notepad':
          return <AdminNotepad />;
        case 'accounting':
          return <AccountingManagement />;
        case 'attendance':
          return <AttendanceManagement />;
        case 'staffChat':
          return <StaffCommunicationHub />;
        case 'whatsapp':
          return <WhatsAppExtension />;
        case 'security':
          return <CyberShieldCenter />;
        case 'students':
          return <StudentsManagement />;
        case 'groups':
          return <GroupsManagement />;
        case 'finances':
          return <FinancesManagement />;
        case 'certificates':
          return <StudentCertificates />;
        case 'calendar':
          return <InstitutionalCalendar />;
        case 'projections':
          return <CourseProjections />;
        case 'forums':
          return <ForumsView />;
        case 'users':
          return <UsersManagement />;
        case 'permissions':
          return <RolePermissionsManagement />;
        case 'backup':
          return <CloudBackup />;
        default:
          return <AdminDashboard />;
      }
    }

    // Teacher Views
    if (currentRole === 'teacher') {
      switch (activeTab) {
        case 'dashboard':
          return <TeacherDashboard />;
        case 'attendance':
          return <AttendanceManagement />;
        case 'staffChat':
          return <StaffCommunicationHub />;
        case 'grades':
          return <TeacherGrades />;
        case 'groups':
          return <GroupsManagement />;
        case 'resources':
          return <TeacherVirtualClassroom />;
        case 'invoices':
          return <TeacherInvoices />;
        case 'inductions':
          return <TeacherInductions />;
        case 'forums':
          return <ForumsView />;
        default:
          return <TeacherDashboard />;
      }
    }

    // Student Views
    if (currentRole === 'student') {
      switch (activeTab) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'certificates':
          return <StudentCertificates />;
        case 'attendance':
          return <AttendanceManagement />;
        case 'finances':
          return <StudentFinances />;
        case 'grades':
          return <StudentGrades />;
        case 'resources':
          return <TeacherVirtualClassroom />;
        case 'forums':
          return <ForumsView />;
        case 'calendar':
          return <InstitutionalCalendar />;
        default:
          return <StudentDashboard />;
      }
    }

    return <AdminDashboard />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar for Desktop & Drawer for Mobile */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 min-w-0 transition-all">
          <div className="max-w-6xl mx-auto">
            {renderActiveModule()}
          </div>
        </main>
      </div>

      {/* Live Chat Panel */}
      <LiveChat />

      {/* Login & Profile Switcher Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
