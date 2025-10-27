import React, { useState } from 'react';
import { View, AnyMachine } from './types';
import { useMachines } from './hooks/useMachines';
import Header from './components/Header';
import Calculator from './components/Calculator';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.CALCULATOR);
  const { machines, loadMachines } = useMachines();

  const renderView = () => {
    switch (currentView) {
      case View.ADMIN_LOGIN:
        return <AdminLogin 
                  onLoginSuccess={() => setCurrentView(View.ADMIN_PANEL)}
                  onCancel={() => setCurrentView(View.CALCULATOR)}
                />;
      case View.ADMIN_PANEL:
        return <AdminPanel 
                  machines={machines} 
                  loadMachines={loadMachines as (machines: AnyMachine[]) => void}
                  onLogout={() => setCurrentView(View.CALCULATOR)}
                />;
      case View.CALCULATOR:
      default:
        return <Calculator machines={machines} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onAdminClick={() => setCurrentView(View.ADMIN_LOGIN)} />
      <main className="flex-grow flex flex-col">
        {renderView()}
      </main>
      <footer className="bg-white mt-auto py-4">
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Kalkulator Kosztów Dostawy. Wszelkie prawa zastrzeżone.
        </div>
      </footer>
    </div>
  );
};

export default App;
