import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SupabaseGuideModal } from './components/SupabaseGuideModal';
import { DashboardAdmin } from './pages/DashboardAdmin';
import { DashboardSie } from './pages/DashboardSie';
import { DashboardViewer } from './pages/DashboardViewer';
import { IncomePage } from './pages/IncomePage';
import { BudgetsPage } from './pages/BudgetsPage';
import { DisbursementsPage } from './pages/DisbursementsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { AddExpensePage } from './pages/AddExpensePage';
import { FundRequestsPage } from './pages/FundRequestsPage';
import { ManagementPage } from './pages/ManagementPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';

function MainApp() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

  // If user navigates to login
  if (activeTab === 'login') {
    return (
      <>
        <LoginPage
          onLoginSuccess={(role) => {
            setActiveTab('dashboard');
          }}
          onOpenSupabaseGuide={() => setIsSupabaseModalOpen(true)}
        />
        <SupabaseGuideModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
        />
      </>
    );
  }

  // Render content based on activeTab and Role-Based Access Control
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentUser.role === 'super_admin') {
          return <DashboardAdmin setActiveTab={setActiveTab} />;
        } else if (currentUser.role === 'koordinator_sie') {
          return <DashboardSie setActiveTab={setActiveTab} />;
        } else {
          return <DashboardViewer setActiveTab={setActiveTab} />;
        }

      case 'sie-monitoring':
        return <DashboardViewer setActiveTab={setActiveTab} />;

      case 'income':
        if (currentUser.role === 'koordinator_sie') {
          return <DashboardSie setActiveTab={setActiveTab} />;
        }
        return <IncomePage />;

      case 'budgets':
        return <BudgetsPage />;

      case 'disbursements':
        if (currentUser.role === 'koordinator_sie') {
          return <DashboardSie setActiveTab={setActiveTab} />;
        }
        return <DisbursementsPage />;

      case 'expenses':
        return <ExpensesPage setActiveTab={setActiveTab} />;

      case 'add-expense':
        return <AddExpensePage setActiveTab={setActiveTab} />;

      case 'fund-requests':
        return <FundRequestsPage />;

      case 'management':
      case 'sies':
      case 'users':
        if (currentUser.role !== 'super_admin') {
          return <BudgetsPage />;
        }
        return <ManagementPage />;

      case 'reports':
        return <ReportsPage />;

      case 'audit':
        return <AuditLogPage />;

      case 'settings':
        return <SettingsPage onOpenSupabaseGuide={() => setIsSupabaseModalOpen(true)} />;

      case 'profile':
        return <ProfilePage />;

      default:
        return <DashboardAdmin setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onOpenSupabaseGuide={() => setIsSupabaseModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 lg:pb-8">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenSupabaseGuide={() => setIsSupabaseModalOpen(true)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Guide & Connection Modal */}
      <SupabaseGuideModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
