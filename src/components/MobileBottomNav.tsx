import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Receipt, PlusCircle, ArrowDownLeft, FileSpreadsheet, PieChart } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { currentUser } = useApp();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          Dashboard
        </button>

        {currentUser.role === 'super_admin' ? (
          <button
            onClick={() => setActiveTab('income')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
              activeTab === 'income' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <ArrowDownLeft className="w-5 h-5 mb-0.5 text-emerald-600" />
            Pemasukan
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('budgets')}
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
              activeTab === 'budgets' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <PieChart className="w-5 h-5 mb-0.5" />
            Anggaran
          </button>
        )}

        {/* Central Prominent Action Button: + Catat Pengeluaran */}
        <button
          onClick={() => setActiveTab('add-expense')}
          className="-mt-4 flex flex-col items-center group"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-active:scale-95 transition-transform ring-4 ring-white">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-emerald-800 mt-0.5">Catat Nota</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'expenses' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Receipt className="w-5 h-5 mb-0.5" />
          Pengeluaran
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'reports' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <FileSpreadsheet className="w-5 h-5 mb-0.5" />
          Laporan
        </button>
      </div>
    </div>
  );
};
