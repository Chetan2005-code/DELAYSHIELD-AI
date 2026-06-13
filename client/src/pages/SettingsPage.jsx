import React, { useState } from 'react';
import { 
  Settings, User, Bell, Shield, Database, LayoutTemplate, 
  Save, CheckCircle2
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('General');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-500/30 text-white">
            <Settings size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-blue-950 tracking-tight font-display">Platform Settings</h1>
            <p className="text-xs font-bold text-blue-500/80 uppercase tracking-widest mt-1">Configure DelayShield AI Engine</p>
          </div>
        </div>
        <div>
          <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg ${
              saved 
                ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
            }`}
          >
            {saved ? <><CheckCircle2 className="w-5 h-5" /> Saved Successfully</> : <><Save className="w-5 h-5" /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-3 flex flex-col gap-1 sticky top-6">
            {[
              { id: 'General', icon: LayoutTemplate },
              { id: 'Account', icon: User },
              { id: 'Notifications', icon: Bell },
              { id: 'AI Engine', icon: Database },
              { id: 'Security', icon: Shield },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full text-left ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                {tab.id}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'General' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Company Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Company Name</label>
                    <input type="text" defaultValue="DelayShield Enterprise" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Industry</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option>Logistics & Supply Chain</option>
                      <option>Manufacturing</option>
                      <option>Retail</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Headquarters Address</label>
                    <input type="text" defaultValue="Sector 44, Gurgaon, Haryana, India" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Currency Format</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">Timezone</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option>Asia/Kolkata (IST)</option>
                      <option>UTC</option>
                      <option>America/New_York (EST)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'AI Engine' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Risk Assessment Parameters</h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold text-slate-800">Traffic Impact Weight</label>
                      <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">45%</span>
                    </div>
                    <input type="range" min="0" max="100" defaultValue="45" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    <p className="text-xs text-slate-500 mt-2">Determines how heavily live traffic conditions affect the overall SLA risk score.</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold text-slate-800">Weather Severity Threshold</label>
                      <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">High</span>
                    </div>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500">
                      <option>Low (Any rain triggers alert)</option>
                      <option>Medium (Heavy rain triggers alert)</option>
                      <option selected>High (Only severe storms trigger alert)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">Automated Actions</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Auto-Rerouting</h3>
                      <p className="text-xs text-slate-500 mt-1">Allow AI to automatically redirect shipments if time saved &gt; 30 mins</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Auto-Notifications</h3>
                      <p className="text-xs text-slate-500 mt-1">Send SMS/Email to customers automatically on SLA breach detection</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs can be empty placeholders for now */}
          {['Account', 'Notifications', 'Security'].includes(activeTab) && (
            <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Settings className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">{activeTab} Settings</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">This settings module is currently under development. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
