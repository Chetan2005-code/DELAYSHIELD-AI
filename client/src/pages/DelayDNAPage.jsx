import React, { useState, useEffect } from 'react';
import { 
  Dna, Activity, ShieldAlert, Zap, AlertTriangle, 
  CheckCircle2, AlertCircle, ArrowRight
} from 'lucide-react';
import api from '../services/api';

const ConfidenceBadge = ({ score }) => {
  let color = 'bg-slate-100 text-slate-600';
  if (score >= 80) color = 'bg-emerald-100 text-emerald-700';
  else if (score >= 50) color = 'bg-amber-100 text-amber-700';
  else color = 'bg-red-100 text-red-700';

  return (
    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${color}`}>
      <Activity className="w-3 h-3" />
      Confidence: {score}%
    </div>
  );
};

const DelayDNAPage = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchDNA = async () => {
      try {
        const response = await api.get('/dna');
        if (response.data?.success) {
          setInsights(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch Delay DNA:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDNA();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <h2 className="text-xl font-bold text-slate-700">No DNA Insights Available</h2>
        <p className="text-slate-500 mt-2">Generate more shipments with SLA analysis to build historical correlations.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30 text-white">
            <Dna size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-blue-950 tracking-tight font-display">Delay DNA Engine</h1>
              {insights.isDemo && (
                <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 border border-purple-200 text-[10px] font-bold uppercase tracking-wider">
                  Demo Dataset
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-blue-500/80 uppercase tracking-widest mt-1">Systemic Root Cause Intelligence</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-sm rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-200"
        >
          Next Step: Return to Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chronic Bottlenecks */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-2 rounded-lg text-red-600"><AlertTriangle size={20} /></div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Chronic Route Bottlenecks</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Identified recurrent primary causes for specific routes.</p>
            </div>
          </div>

          <div className="space-y-4">
            {insights.chronicBottlenecks?.length > 0 ? insights.chronicBottlenecks.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-700">{item.route}</h3>
                    <p className="text-xs font-bold text-red-500 uppercase tracking-wide mt-1">Cause: {item.primaryCause}</p>
                  </div>
                  <ConfidenceBadge score={item.confidence} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white p-3 rounded-lg border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Occurrences</p>
                    <p className="text-lg font-black text-slate-700">{item.occurrences} <span className="text-xs font-medium text-slate-400">/ {item.totalSample}</span></p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Risk Score</p>
                    <p className="text-lg font-black text-red-600">{item.avgRiskScore}</p>
                  </div>
                </div>
              </div>
            )) : <p className="text-sm text-slate-500">No chronic bottlenecks detected yet.</p>}
          </div>
        </div>

        {/* Systemic Risk Predictor */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><ShieldAlert size={20} /></div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Stakeholder Escalation Drivers</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Which risks lead to critical communication escalations?</p>
            </div>
          </div>

          <div className="space-y-4">
            {insights.systemicRisks?.length > 0 ? insights.systemicRisks.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-slate-800">{item.escalationType}</h3>
                  <ConfidenceBadge score={item.confidence} />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Dominant Driver</p>
                    <p className="text-sm font-bold text-slate-700">{item.dominantDriver}</p>
                  </div>
                  <ArrowRight className="text-slate-300 w-5 h-5 flex-shrink-0" />
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center w-24">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Frequency</p>
                    <p className="text-sm font-black text-slate-700">{item.triggerFrequency}%</p>
                  </div>
                </div>
              </div>
            )) : <p className="text-sm text-slate-500">No systemic escalation drivers detected.</p>}
          </div>
        </div>
      </div>

      {/* Mitigation Effectiveness */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><CheckCircle2 size={20} /></div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Historical Mitigation Effectiveness</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Success rates of AI-recommended recovery actions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.mitigationEffectiveness?.length > 0 ? insights.mitigationEffectiveness.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold text-slate-800 w-2/3">{item.action}</h3>
                <ConfidenceBadge score={item.confidence} />
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Success Rate</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-emerald-600">{item.successRate}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Times Applied</p>
                  <p className="text-sm font-bold text-slate-700">{item.appliedCount}</p>
                </div>
              </div>
              
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${item.successRate}%` }}
                ></div>
              </div>
            </div>
          )) : <p className="text-sm text-slate-500">No mitigation data available.</p>}
        </div>
      </div>
    </div>
  );
};

export default DelayDNAPage;
