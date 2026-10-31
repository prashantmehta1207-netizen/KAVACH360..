import React, { useState } from 'react';
import { Incident, SeverityType } from '../types/safety';
import { StatusBadge } from './StatusBadge';
import {
  ShieldAlert,
  Search,
  Filter,
  Megaphone,
  UserCheck,
  CheckCircle,
  FileText,
  AlertTriangle,
  Clock,
  Camera,
  ExternalLink,
  X,
  Send,
  Building2,
  HardHat,
  Printer
} from 'lucide-react';
import { audioService } from '../services/audioService';

interface IncidentCommandProps {
  incidents: Incident[];
  onResolveIncident: (incidentId: string, notes: string) => void;
  onDispatchMarshal: (incidentId: string, marshalTeam: string) => void;
  onBroadcastIncident: (incident: Incident) => void;
}

export const IncidentCommand: React.FC<IncidentCommandProps> = ({
  incidents,
  onResolveIncident,
  onDispatchMarshal,
  onBroadcastIncident
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveNotes, setResolveNotes] = useState('');
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);
  const [noticeGenerated, setNoticeGenerated] = useState<string | null>(null);

  const filtered = incidents.filter((inc) => {
    if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inc.code.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.workerName.toLowerCase().includes(q) ||
        inc.contractor.toLowerCase().includes(q) ||
        inc.zoneName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleDispatch = (inc: Incident) => {
    audioService.playRadioChirp();
    onDispatchMarshal(inc.id, 'Rapid Intervention Unit Alpha');
    setDispatchSuccess(`Marshal Unit dispatched to ${inc.zoneName}. ETA: 45 seconds.`);
    setTimeout(() => setDispatchSuccess(null), 4000);
  };

  const handleFormalNotice = (inc: Incident) => {
    audioService.playComplianceChime();
    setNoticeGenerated(`Notice Ref #${inc.code}-PENALTY successfully recorded to contractor compliance registry.`);
    setTimeout(() => setNoticeGenerated(null), 4000);
  };

  const handleConfirmResolve = () => {
    if (!selectedIncident) return;
    onResolveIncident(selectedIncident.id, resolveNotes || 'Supervisor verified worker donned compliant PPE and secured tie-off.');
    setShowResolveModal(false);
    setResolveNotes('');
  };

  return (
    <div className="space-y-4">
      {/* Alert Banners */}
      {dispatchSuccess && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-[#2563EB]" />
            <span>{dispatchSuccess}</span>
          </div>
          <button onClick={() => setDispatchSuccess(null)} className="text-blue-500 hover:text-blue-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {noticeGenerated && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{noticeGenerated}</span>
          </div>
          <button onClick={() => setNoticeGenerated(null)} className="text-emerald-500 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Incident Table & Detail Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Table & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Controls Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by worker, code, zone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            {/* Severity Tabs */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs w-full sm:w-auto">
              <button
                onClick={() => setFilterSeverity('all')}
                className={`flex-1 sm:flex-initial px-3 py-1 rounded-md font-medium transition-colors ${
                  filterSeverity === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({incidents.length})
              </button>
              <button
                onClick={() => setFilterSeverity('critical')}
                className={`flex-1 sm:flex-initial px-3 py-1 rounded-md font-medium transition-colors ${
                  filterSeverity === 'critical' ? 'bg-red-50 text-red-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setFilterSeverity('warning')}
                className={`flex-1 sm:flex-initial px-3 py-1 rounded-md font-medium transition-colors ${
                  filterSeverity === 'warning' ? 'bg-amber-50 text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Warnings
              </button>
              <button
                onClick={() => setFilterSeverity('resolved')}
                className={`flex-1 sm:flex-initial px-3 py-1 rounded-md font-medium transition-colors ${
                  filterSeverity === 'resolved' ? 'bg-emerald-50 text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Resolved
              </button>
            </div>
          </div>

          {/* Incident Table */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider font-mono">
                    <th className="py-2.5 px-3">Ref ID & Time</th>
                    <th className="py-2.5 px-3">Breach Description</th>
                    <th className="py-2.5 px-3">Zone / Camera</th>
                    <th className="py-2.5 px-3">Personnel</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-xs">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No safety incidents match current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((inc) => {
                      const isSelected = selectedIncident?.id === inc.id;
                      return (
                        <tr
                          key={inc.id}
                          onClick={() => setSelectedIncident(inc)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50/70 border-l-4 border-l-[#2563EB]' : 'hover:bg-[#F1F5F9]'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono">
                            <div className="font-bold text-[#0F172A]">{inc.code}</div>
                            <div className="text-[10px] text-slate-500 tabular-nums">{inc.timestamp}</div>
                          </td>
                          <td className="py-2.5 px-3 max-w-[200px]">
                            <div className="font-semibold text-slate-900 truncate">{inc.title}</div>
                            <div className="text-[11px] text-slate-500 truncate">{inc.oshaRegulation}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-medium text-slate-800">{inc.zoneName}</div>
                            <div className="font-mono text-[10px] text-slate-400">{inc.cameraCode}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-medium text-slate-900">{inc.workerName}</div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{inc.contractor}</div>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <StatusBadge
                              type={inc.severity}
                              label={inc.status === 'resolved' ? 'RESOLVED' : inc.severity}
                              pulse={inc.severity === 'critical' && inc.status === 'active'}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Incident Detail Dossier (5 Cols) */}
        <div className="lg:col-span-5">
          {selectedIncident ? (
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 space-y-4">
              {/* Dossier Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {selectedIncident.code}
                    </span>
                    <StatusBadge
                      type={selectedIncident.severity}
                      label={selectedIncident.status === 'resolved' ? 'RESOLVED' : selectedIncident.severity}
                      pulse={selectedIncident.severity === 'critical' && selectedIncident.status === 'active'}
                    />
                  </div>
                  <h3 className="font-bold text-sm text-[#0F172A] mt-1.5 font-['Plus_Jakarta_Sans']">
                    {selectedIncident.title}
                  </h3>
                </div>
              </div>

              {/* Snapshot Frame with Visual Capture */}
              <div className="relative rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-900">
                <img
                  src={selectedIncident.snapshotUrl}
                  alt={selectedIncident.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1.5 border border-white/10">
                  <Camera className="w-3 h-3 text-red-400" />
                  <span>AI INFRACTION CAPTURE</span>
                  <span>·</span>
                  <span>{selectedIncident.cameraCode}</span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-xs p-2 rounded text-[11px] text-white">
                  <span className="text-amber-300 font-bold">OSHA Breach: </span>
                  {selectedIncident.oshaRegulation}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                    Incident Description & Risk Assessment
                  </div>
                  <p className="text-slate-800 leading-relaxed">{selectedIncident.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-mono uppercase">Personnel Involved</div>
                    <div className="font-bold text-slate-900 mt-0.5">{selectedIncident.workerName}</div>
                    <div className="font-mono text-[10px] text-blue-600">{selectedIncident.workerId} · {selectedIncident.trade}</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-mono uppercase">Contractor Company</div>
                    <div className="font-bold text-slate-900 mt-0.5 truncate">{selectedIncident.contractor}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{selectedIncident.zoneName}</div>
                  </div>
                </div>

                {selectedIncident.dispatchedTo && (
                  <div className="flex items-center justify-between p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs">
                    <span className="text-blue-700 font-semibold flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4" />
                      Dispatched Unit:
                    </span>
                    <span className="font-bold text-blue-900">{selectedIncident.dispatchedTo}</span>
                  </div>
                )}

                {selectedIncident.resolutionNotes && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5 font-mono">
                      Supervisor Resolution Log ({selectedIncident.resolutionTime})
                    </div>
                    <p className="text-emerald-900">{selectedIncident.resolutionNotes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                {selectedIncident.status !== 'resolved' && (
                  <>
                    <button
                      onClick={() => handleDispatch(selectedIncident)}
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2 px-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Marshal</span>
                    </button>

                    <button
                      onClick={() => onBroadcastIncident(selectedIncident)}
                      className="flex items-center gap-1.5 py-2 px-3 bg-white border border-[#CBD5E1] hover:bg-slate-100 text-[#0F172A] text-xs font-semibold rounded-lg transition-colors"
                      title="Broadcast Audio Warning to Sector"
                    >
                      <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                      <span>Warn Zone</span>
                    </button>

                    <button
                      onClick={() => setShowResolveModal(true)}
                      className="flex items-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleFormalNotice(selectedIncident)}
                  className="flex items-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                  title="Generate Official Safety Notice Slip"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Log OSHA Record</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 text-center text-slate-400">
              Select an incident from the log to view details.
            </div>
          )}
        </div>
      </div>

      {/* Resolve Incident Clearance Modal */}
      {showResolveModal && selectedIncident && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-2xl max-w-md w-full p-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-[#0F172A]">Resolve Incident Verification</h3>
              </div>
              <button
                onClick={() => setShowResolveModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <p className="text-xs text-slate-600">
                You are marking <span className="font-mono font-bold">{selectedIncident.code}</span> as rectified. Enter the corrective action verified by the site safety marshal:
              </p>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-mono">
                  Corrective Action Sign-Off Notes
                </label>
                <textarea
                  rows={3}
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                  placeholder="e.g. Worker instructed to tether dual-lanyard harness to static lifeline. Area cleared by Marshal Alpha."
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolve}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Confirm Rectification & Clear Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
