import React, { useState } from 'react';
import { ContractorSummary, Incident } from '../types/safety';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Award,
  AlertTriangle,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Download,
  Calendar,
  Clock,
  Building,
  CheckCircle2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../services/audioService';

interface SafetyAnalyticsProps {
  safeManHours: number;
  safetyIndex: number;
  contractors: ContractorSummary[];
  incidents: Incident[];
  onTriggerConfetti: () => void;
}

export const SafetyAnalytics: React.FC<SafetyAnalyticsProps> = ({
  safeManHours,
  safetyIndex,
  contractors,
  incidents,
  onTriggerConfetti
}) => {
  const [showShiftReport, setShowShiftReport] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState('2026-10-31 14:00 Shift Handover');

  const ppeMetrics = [
    { label: 'Type-II Hardhat & Chinstrap', score: 98.6, trend: '+1.2%', status: 'compliant' },
    { label: 'Class 3 High-Visibility Apparel', score: 97.4, trend: '+0.5%', status: 'compliant' },
    { label: 'Fall-Arrest Full Body Harness', score: 93.8, trend: '-2.1%', status: 'warning' },
    { label: 'Heavy Equipment Proximity Radius', score: 96.2, trend: '+1.8%', status: 'compliant' },
    { label: 'Trench & Excavation Shoring', score: 99.1, trend: '+0.0%', status: 'compliant' }
  ];

  const hourlyTrends = [
    { hour: '06:00', incidents: 0, compliance: 98 },
    { hour: '07:00', incidents: 0, compliance: 99 },
    { hour: '08:00', incidents: 1, compliance: 96 },
    { hour: '09:00', incidents: 0, compliance: 97 },
    { hour: '10:00', incidents: 0, compliance: 98 },
    { hour: '11:00', incidents: 1, compliance: 95 },
    { hour: '12:00', incidents: 0, compliance: 98 },
    { hour: '13:00', incidents: 1, compliance: 94 },
    { hour: '14:00', incidents: 1, compliance: 93 }
  ];

  const handleCelebrate = () => {
    audioService.playComplianceChime();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    onTriggerConfetti();
  };

  const handleDownloadCsv = () => {
    audioService.playRadioChirp();
    const headers = 'Contractor,Personnel,ComplianceRate,ActiveViolations,Grade\n';
    const rows = contractors
      .map((c) => `"${c.name}",${c.personnelCount},${c.complianceRate}%,${c.activeViolations},${c.grade}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KAVACH360_Safety_Audit_Shift_A_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* KPI Highlight Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Safety Index Gauge */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono uppercase">
            <span>Overall Site Safety Index</span>
            <span className="text-emerald-600 font-bold font-sans">Shift Target: 95.0</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#0F172A] font-['Plus_Jakarta_Sans'] tabular-nums">
              {safetyIndex}
            </span>
            <span className="text-xs text-slate-400 font-bold">/ 100</span>
            <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
              Grade A
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${safetyIndex}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            +1.8% over previous 24h baseline
          </p>
        </div>

        {/* Safe Man-Hours & Milestone Trigger */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono uppercase">
            <span>Safe Man-Hours Without LTI</span>
            <button
              onClick={handleCelebrate}
              className="text-amber-600 hover:text-amber-700 p-1 rounded hover:bg-amber-50"
              title="Celebrate Milestone!"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
          <div className="text-3xl font-extrabold text-[#004AC6] mt-2 font-['Plus_Jakarta_Sans'] tabular-nums">
            {safeManHours.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
            <span>Next Target: 150,000 hrs</span>
            <span className="text-blue-600 font-bold">98.8% Reached</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '98.8%' }} />
          </div>
        </div>

        {/* Total Active On-Site Personnel */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="text-xs text-slate-500 font-mono uppercase">Total On-Site Personnel</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#0F172A] font-['Plus_Jakarta_Sans'] tabular-nums">
              119
            </span>
            <span className="text-xs text-slate-400 font-medium">Workers Inducted</span>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-600">
            <span className="font-semibold text-emerald-700">114 Verified</span>
            <span>·</span>
            <span className="text-red-600 font-semibold">5 In Triage</span>
          </div>
        </div>

        {/* Open Critical Breaches */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="text-xs text-slate-500 font-mono uppercase">Active Open Breaches</div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-red-600 font-['Plus_Jakarta_Sans'] tabular-nums">
              {incidents.filter((i) => i.severity === 'critical' && i.status !== 'resolved').length}
            </span>
            <span className="text-xs text-slate-400 font-medium">Requiring Intervention</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">Avg Resolution:</span>
            <span className="font-mono font-bold text-slate-800">4.2 Minutes</span>
          </div>
        </div>
      </div>

      {/* PPE Adherence Breakdown & Hourly Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* PPE Category Adherence (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#0F172A] font-['Plus_Jakarta_Sans']">
              PPE Category Compliance Adherence
            </h3>
            <span className="text-xs text-slate-500 font-mono">Real-time Vision Verification</span>
          </div>

          <div className="space-y-3">
            {ppeMetrics.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{item.trend}</span>
                    <span className={`font-mono font-bold ${
                      item.score >= 95 ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {item.score}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.score >= 95 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Trend Chart (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A] font-['Plus_Jakarta_Sans']">
                Shift Incident Frequency & Compliance Track
              </h3>
              <p className="text-xs text-slate-500">Hourly breakdown of detected anomalies vs resolution</p>
            </div>
            <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Shift A Track
            </span>
          </div>

          {/* SVG Bar / Trend Chart */}
          <div className="py-4">
            <div className="h-32 flex items-end justify-between gap-2 px-2">
              {hourlyTrends.map((t, idx) => {
                const heightPct = Math.max(15, (t.compliance - 90) * 10);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    {t.incidents > 0 && (
                      <span className="text-[10px] font-mono font-bold text-red-600 bg-red-100 px-1 rounded">
                        {t.incidents}
                      </span>
                    )}
                    <div className="w-full bg-slate-100 rounded-t-md h-24 flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t transition-all ${
                          t.incidents > 0 ? 'bg-gradient-to-t from-red-500 to-amber-500' : 'bg-gradient-to-t from-blue-600 to-[#38BDF8]'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{t.hour}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
              Compliance Rate (93% - 99%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-red-500" />
              Incidents Logged
            </span>
          </div>
        </div>
      </div>

      {/* Contractor Safety League Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] font-['Plus_Jakarta_Sans']">
              Contractor Safety Compliance Standings & Accountability
            </h3>
            <p className="text-xs text-slate-500">Sub-contractor performance matrix evaluated against OSHA standards</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#CBD5E1] hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setShowShiftReport(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Shift Handover Report</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider font-mono">
                <th className="py-2.5 px-4">Contractor Company</th>
                <th className="py-2.5 px-4">Active Personnel</th>
                <th className="py-2.5 px-4">Compliance Rating</th>
                <th className="py-2.5 px-4">Active Violations</th>
                <th className="py-2.5 px-4">Safety Supervisor</th>
                <th className="py-2.5 px-4 text-right">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs">
              {contractors.map((c, idx) => (
                <tr key={idx} className="hover:bg-[#F1F5F9] transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                    {c.name}
                    <div className="text-[10px] font-mono text-slate-400 font-normal">{c.code}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">{c.personnelCount} Workers</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{c.complianceRate}%</span>
                      <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            c.complianceRate >= 95 ? 'bg-emerald-500' : c.complianceRate >= 90 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${c.complianceRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-mono font-bold ${c.activeViolations > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {c.activeViolations} Active
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div>{c.supervisor}</div>
                    <div className="text-[10px] font-mono text-slate-400">{c.contact}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                        c.grade === 'A+' || c.grade === 'A'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : c.grade === 'B'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      GRADE {c.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shift Handover Report Modal */}
      {showShiftReport && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-2xl max-w-2xl w-full p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  FORMAL SITE HANDOVER AUDIT
                </span>
                <h3 className="text-lg font-extrabold text-[#0F172A] mt-1 font-['Plus_Jakarta_Sans']">
                  Shift A Safety Performance Handover Dossier
                </h3>
                <p className="text-xs text-slate-500">Project: Mumbai Metro Line 4 · Viaduct Pkg 08</p>
              </div>
              <button
                onClick={() => setShowShiftReport(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-center">
                <div>
                  <div className="text-slate-500 text-[10px]">SHIFT SAFE HOURS</div>
                  <div className="text-base font-bold text-blue-700">{safeManHours.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">SAFETY INDEX</div>
                  <div className="text-base font-bold text-emerald-700">{safetyIndex} / 100</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">TOTAL INCIDENTS</div>
                  <div className="text-base font-bold text-slate-800">{incidents.length} Logged</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2 font-['Plus_Jakarta_Sans']">
                  1. Incident Status Summary
                </h4>
                <div className="p-3 rounded-lg border border-slate-200 space-y-2">
                  {incidents.slice(0, 3).map((inc) => (
                    <div key={inc.id} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                      <div>
                        <span className="font-mono font-bold text-slate-800">{inc.code}: </span>
                        <span className="text-slate-700">{inc.title}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-600">
                        {inc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2 font-['Plus_Jakarta_Sans']">
                  2. Outgoing Safety Director Sign-Off
                </h4>
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200 text-slate-700 leading-relaxed">
                  "All high-elevation safety lifelines inspected and tension calibrated. Tower crane swing arc geofence verified active. Sub-contractor Afcons instructed on mandatory dual-lanyard tie-off."
                  <div className="mt-2 font-bold font-mono text-[11px] text-[#004AC6]">
                    Signed: Eng. Prashant Mehta (Lead Safety Director, Cert #OSHA-500-IND)
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">Timestamp: {reportGeneratedTime}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowShiftReport(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    audioService.playComplianceChime();
                    window.print();
                  }}
                  className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print & Dispatch Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
