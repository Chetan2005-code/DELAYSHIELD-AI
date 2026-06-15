import React from 'react';
import { Shield, AlertTriangle, CheckCircle2, Zap, X, Loader2 } from 'lucide-react';

const AIAnalysisModal = ({ isOpen, onClose, analysis, shipment }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" /> AI Deep Analysis
            </h2>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">{shipment?.id} • {shipment?.origin?.name || 'Origin'} to {shipment?.destination?.name || 'Destination'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {!analysis ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
              <p className="font-bold">Generating Guardian AI Assessment...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Top Banner */}
              <div className={`p-4 rounded-xl border ${analysis.slaRisk?.level === 'Critical' ? 'bg-red-50 border-red-200 text-red-900' : analysis.slaRisk?.level === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg">{analysis.explanation?.summary || 'SLA Status Analyzed'}</h3>
                    <p className="text-sm opacity-80 mt-1">{analysis.explanation?.explanation}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Risk & Cause */}
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Core Telemetry & Risk</h4>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl border-4 ${analysis.slaRisk?.level === 'Critical' ? 'border-red-500 text-red-600 bg-red-50' : analysis.slaRisk?.level === 'High' ? 'border-amber-500 text-amber-600 bg-amber-50' : analysis.slaRisk?.level === 'Medium' ? 'border-yellow-500 text-yellow-600 bg-yellow-50' : 'border-emerald-500 text-emerald-600 bg-emerald-50'}`}>
                        {analysis.slaRisk?.score || 0}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">Risk Score</div>
                        <div className="text-xs text-slate-500">Breach Probability: {analysis.slaRisk?.breachProbability * 100}%</div>
                        <div className="text-xs font-bold text-blue-600 mt-1">Confidence: {analysis.explanation?.confidence}%</div>
                      </div>
                    </div>
                    
                    <h5 className="text-[10px] font-bold uppercase text-slate-400 mb-2 mt-4">Risk Breakdown</h5>
                    <div className="space-y-2">
                      {analysis.slaRisk?.breakdown && Object.entries(analysis.slaRisk.breakdown).map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center text-xs">
                          <span className="capitalize text-slate-600">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-bold text-slate-800">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Primary Catalyst</h4>
                    <p className="text-sm font-bold text-slate-800 leading-relaxed border-l-4 border-indigo-500 pl-3 py-1">
                      {analysis.recovery?.primaryCause || 'Unknown'}
                    </p>
                    
                    <h5 className="text-[10px] font-bold uppercase text-slate-400 mb-2 mt-4">Key Factors</h5>
                    <div className="flex flex-wrap gap-2">
                      {analysis.explanation?.keyFactors?.map(f => (
                        <span key={f} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md border border-slate-200">{f}</span>
                      ))}
                    </div>
                  </div>

                  {/* Carbon Shield (ESG) */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">🌱 Carbon Shield (ESG)</h4>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        (analysis.carbonImpact?.ecoBadge || shipment?.carbonImpact?.ecoBadge) === 'Eco Friendly' ? 'bg-emerald-100 text-emerald-700' :
                        (analysis.carbonImpact?.ecoBadge || shipment?.carbonImpact?.ecoBadge) === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {analysis.carbonImpact?.ecoBadge || shipment?.carbonImpact?.ecoBadge || 'Moderate'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-slate-500 font-semibold">Total Footprint</div>
                        <div className="text-2xl font-black text-slate-800 mt-1">
                          {analysis.carbonImpact?.totalCO2 || shipment?.carbonImpact?.totalCO2 || 0} <span className="text-xs font-bold text-slate-500">kg CO₂</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-semibold">Sustainability Score</div>
                        <div className="text-2xl font-black text-emerald-600 mt-1">
                          {Math.round(analysis.carbonImpact?.sustainabilityScore || shipment?.carbonImpact?.sustainabilityScore || 85)}%
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                      <div 
                        className={`h-full ${(analysis.carbonImpact?.ecoBadge || shipment?.carbonImpact?.ecoBadge) === 'Eco Friendly' ? 'bg-emerald-500' : (analysis.carbonImpact?.ecoBadge || shipment?.carbonImpact?.ecoBadge) === 'Moderate' ? 'bg-amber-500' : 'bg-red-500'}`} 
                        style={{ width: `${Math.round(analysis.carbonImpact?.sustainabilityScore || shipment?.carbonImpact?.sustainabilityScore || 85)}%` }}
                      ></div>
                    </div>

                    <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Transit Emissions:</span>
                        <span className="font-bold text-slate-700">{analysis.carbonImpact?.transitEmission || shipment?.carbonImpact?.transitEmission || 0} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Idling / Delay Emissions:</span>
                        <span className="font-bold text-slate-700">{analysis.carbonImpact?.delayEmission || shipment?.carbonImpact?.delayEmission || 0} kg</span>
                      </div>
                      <div className="flex justify-between text-emerald-600">
                        <span className="font-semibold">Offset Potential:</span>
                        <span className="font-black">-{analysis.carbonImpact?.emissionSaved || shipment?.carbonImpact?.emissionSaved || 0} kg CO₂</span>
                      </div>
                    </div>

                    {(analysis.recovery?.suggestedEcoRoute || analysis.recovery?.suggestedRoute) && (
                      <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs">
                        <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                          <span>🌍 Cleanest Route (AI suggested)</span>
                        </div>
                        <p className="font-black text-emerald-700 mb-1">{analysis.recovery.suggestedEcoRoute || analysis.recovery.suggestedRoute}</p>
                        <p className="text-emerald-600 text-[11px] leading-snug">{analysis.recovery.ecoSavingsExplanation || 'Reduces idling emissions in congestion hotspots.'}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Recovery & Financials */}
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">AI Recovery Blueprint</h4>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-blue-900 text-sm">Suggested Route</span>
                      </div>
                      <p className="text-xs font-bold text-blue-700 ml-6">{analysis.recovery?.suggestedRoute || 'Maintain Current Route'}</p>
                    </div>

                    <h5 className="text-[10px] font-bold uppercase text-slate-400 mb-2">Recommended Actions</h5>
                    <ul className="space-y-2 mb-6 flex-1">
                      {analysis.recovery?.recommendedActions?.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="font-medium">{action}</span>
                        </li>
                      ))}
                    </ul>

                    {analysis.recovery?.warehouseIntelligence && (
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
                        <h5 className="text-[10px] font-bold uppercase text-orange-600 mb-2">
                          Warehouse Intelligence
                        </h5>
                        <div className="space-y-1.5 text-sm text-orange-900">
                          <div className="flex justify-between">
                            <span className="font-medium">Recommended Hub:</span>
                            <span className="font-bold">{analysis.recovery.warehouseIntelligence.recommendedWarehouseName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Utilization:</span>
                            <span className="font-bold">{analysis.recovery.warehouseIntelligence.utilization}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Queue Reduction:</span>
                            <span className="font-bold">{analysis.recovery.warehouseIntelligence.queueReduction}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Est. Time Saved:</span>
                            <span className="font-bold">{analysis.recovery.warehouseIntelligence.timeSavedFormatted}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center">
                        <div className="text-[10px] font-bold uppercase text-emerald-600 mb-1">Time Saved</div>
                        <div className="text-xl font-black text-emerald-700">{analysis.recovery?.estimatedTimeSaved || 0}m</div>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-center">
                        <div className="text-[10px] font-bold uppercase text-indigo-600 mb-1">Loss Prevented</div>
                        <div className="text-xl font-black text-indigo-700">₹{(analysis.recovery?.lossPrevented || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisModal;
