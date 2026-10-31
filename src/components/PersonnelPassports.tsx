import React, { useState } from 'react';
import { Worker } from '../types/safety';
import { StatusBadge } from './StatusBadge';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Award,
  IdCard,
  Phone,
  Droplet,
  Radio,
  FileCheck,
  X,
  Printer,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { audioService } from '../services/audioService';

interface PersonnelPassportsProps {
  workers: Worker[];
}

export const PersonnelPassports: React.FC<PersonnelPassportsProps> = ({ workers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterContractor, setFilterContractor] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [retrainingIssued, setRetrainingIssued] = useState<string | null>(null);

  const contractors = Array.from(new Set(workers.map((w) => w.contractor)));

  const filtered = workers.filter((w) => {
    if (filterContractor !== 'all' && w.contractor !== filterContractor) return false;
    if (filterStatus !== 'all' && w.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.code.toLowerCase().includes(q) ||
        w.trade.toLowerCase().includes(q) ||
        w.contractor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleIssueRetraining = (worker: Worker) => {
    audioService.playComplianceChime();
    setRetrainingIssued(`Safety Retraining order issued for ${worker.name}. Scheduled for 07:00 tomorrow.`);
    setTimeout(() => setRetrainingIssued(null), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Retraining notification */}
      {retrainingIssued && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#2563EB]" />
            <span>{retrainingIssued}</span>
          </div>
          <button onClick={() => setRetrainingIssued(null)} className="text-blue-500 hover:text-blue-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#0F172A] tracking-tight">
            Personnel & Safety Passports Roster
          </h2>
          <p className="text-xs text-slate-500">
            Real-time RFID biometric tracking, site induction status & mandatory trade certifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search personnel, badge ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {/* Contractor Filter */}
          <select
            value={filterContractor}
            onChange={(e) => setFilterContractor(e.target.value)}
            className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB]"
          >
            <option value="all">All Contractors</option>
            {contractors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#2563EB]"
          >
            <option value="all">All Statuses</option>
            <option value="compliant">Compliant</option>
            <option value="warning">Warning</option>
            <option value="breach">Breach</option>
          </select>
        </div>
      </div>

      {/* Workers Roster Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider font-mono">
                <th className="py-2.5 px-4">Worker & Badge ID</th>
                <th className="py-2.5 px-4">Trade & Role</th>
                <th className="py-2.5 px-4">Contractor</th>
                <th className="py-2.5 px-4">Current Zone</th>
                <th className="py-2.5 px-4">PPE Score</th>
                <th className="py-2.5 px-4">Certifications</th>
                <th className="py-2.5 px-4 text-right">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs">
              {filtered.map((worker) => (
                <tr
                  key={worker.id}
                  onClick={() => setSelectedWorker(worker)}
                  className="hover:bg-[#F1F5F9] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 font-['Plus_Jakarta_Sans']">{worker.name}</div>
                        <div className="font-mono text-[10px] text-slate-500">{worker.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">{worker.trade}</td>
                  <td className="py-3 px-4 text-slate-600">{worker.contractor}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800">{worker.zoneName}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold ${
                        worker.ppeComplianceRate >= 95 ? 'text-emerald-700' : worker.ppeComplianceRate >= 90 ? 'text-amber-700' : 'text-red-700'
                      }`}>
                        {worker.ppeComplianceRate}%
                      </span>
                      <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            worker.ppeComplianceRate >= 95 ? 'bg-emerald-500' : worker.ppeComplianceRate >= 90 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${worker.ppeComplianceRate}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span className="font-medium text-slate-700">
                        {worker.certifications.filter((c) => c.valid).length} Verified
                      </span>
                      {worker.certifications.some((c) => !c.valid) && (
                        <span className="text-[10px] text-red-600 font-mono font-bold">(1 Expired)</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge
                      type={worker.status === 'breach' ? 'critical' : worker.status}
                      label={worker.status === 'breach' ? 'BREACH' : worker.status}
                      pulse={worker.status === 'breach'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Digital Safety Passport Inspection Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-2xl max-w-lg w-full p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-[#2563EB]">
                  <IdCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0F172A] font-['Plus_Jakarta_Sans']">
                    Digital Safety Passport
                  </h3>
                  <p className="text-xs text-slate-500">Government & OSHA Certified Site Credential</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Passport Identity Card */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-slate-900 to-[#1E293B] text-white shadow-md relative overflow-hidden">
              <div className="flex items-start gap-4">
                <img
                  src={selectedWorker.avatar}
                  alt={selectedWorker.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-white/20 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-cyan-400 font-bold">{selectedWorker.code}</span>
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded border border-white/10">
                      RFID ACTIVE
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-white mt-1 font-['Plus_Jakarta_Sans']">
                    {selectedWorker.name}
                  </h4>
                  <p className="text-xs text-slate-300">{selectedWorker.trade}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{selectedWorker.contractor}</p>
                </div>
              </div>

              {/* RFID Beacon & Emergency Telemetry */}
              <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-slate-400">Beacon ID:</span>
                  <div className="text-white font-semibold">{selectedWorker.rfidBeacon}</div>
                </div>
                <div>
                  <span className="text-slate-400">Blood Group:</span>
                  <div className="text-amber-300 font-semibold">{selectedWorker.bloodGroup}</div>
                </div>
              </div>
            </div>

            {/* Compliance Scores & Certifications */}
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Cumulative PPE Compliance</div>
                  <div className="text-lg font-bold text-[#0F172A] mt-0.5 tabular-nums font-mono">
                    {selectedWorker.ppeComplianceRate}%
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Recorded Infractions</div>
                  <div className={`text-lg font-bold mt-0.5 tabular-nums font-mono ${
                    selectedWorker.infractionsCount > 0 ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {selectedWorker.infractionsCount} Notices
                  </div>
                </div>
              </div>

              {/* Verified Competencies */}
              <div>
                <h5 className="text-xs font-bold text-[#0F172A] mb-2 flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
                  <Award className="w-4 h-4 text-[#2563EB]" />
                  <span>Verified Safety Competencies & Permits</span>
                </h5>
                <div className="space-y-1.5">
                  {selectedWorker.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                        cert.valid
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                          : 'bg-red-50/50 border-red-200 text-red-950'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{cert.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">Ref: {cert.code}</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                          cert.valid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {cert.valid ? `Expires ${cert.expiry}` : 'EXPIRED'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-700 font-mono uppercase font-bold">Emergency Contact</span>
                  <div className="font-semibold text-blue-950 mt-0.5">{selectedWorker.emergencyContact}</div>
                </div>
                <Phone className="w-4 h-4 text-blue-600" />
              </div>
            </div>

            {/* Passport Modal Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedWorker(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => handleIssueRetraining(selectedWorker)}
                className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Issue PPE Retraining Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
