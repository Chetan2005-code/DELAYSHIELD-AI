import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ShipmentsPage from './pages/ShipmentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <BrowserRouter>
      {/* 
        The main App wrapper sets up the global background and text colors.
        We moved from a top Navbar to a left Sidebar layout.
      */}
      <div className="min-h-screen bg-[#0b1120] font-sans text-slate-200 flex">
        <Sidebar />
        
        {/* Main Content Area - offset by the 64px width (256px) of the sidebar */}
        <main className="flex-1 ml-64 min-h-screen relative overflow-x-hidden">
          {/* Subtle noise/grid overlay on main content to make the background feel textured */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          
          <div className="relative z-10 w-full h-full">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/shipments" element={<ShipmentsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
