import React, { useState } from 'react';
import { HazardZone } from '../types/safety';
import { PowerOff, AlertTriangle, X, ShieldAlert, Check } from 'lucide-react';
import { audioService } from '../services/audioService';

interface EmergencyLockoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: HazardZone[];
  onConfirmLockout: (target: 'all' | string) => void;
}

export const EmergencyLockoutModal: React.FC<EmergencyLockoutModalProps> = ({
  isOpen,
  onClose,
  zones,
  onConfirmLockout
}) => {
  const [targetZone, setTargetZone] = useState<'all' | string>('all');
  const [safetyGuardLifted, setSafetyGuardLifted] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  if (!isOpen) return null;

  const handleExecute = () => {
    audioService.playEmergencyLockout();
    onConfirmLockout(targetZone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border-2 border-red-500 shadow-2xl max-w-lg w-full p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 shrink-0">
              <PowerOff className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold bg-red-600 text-white px-2 py-0.5 rounded">
                CRITICAL INTERVENTION
              </span>
              <h3 className="text-lg font-black text-[#0F172A] mt-1 font-['Plus_Jakarta_Sans'] uppercase tracking-tight">
                Emergency Machinery Lockout
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Warning: Immediate Electrical Trip Command</span>
            </div>
            Engaging this control transmits an instant telemetry stop command to high-voltage interlocks, tower cranes, segment launchers, and hydraulic excavators.
          </div>

          {/* Select Target Scope */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">
              Target Lockout Sector
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTargetZone('all')}
                className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                  targetZone === 'all'
                    ? 'border-red-600 bg-red-50 text-red-900 font-bold ring-2 ring-red-500/20'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-[10px] font-mono text-red-600">GLOBAL SITE</div>
                <div>All Heavy Machinery</div>
              </button>

              {zones.slice(0, 3).map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setTargetZone(z.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    targetZone === z.id
                      ? 'border-red-600 bg-red-50 text-red-900 font-bold ring-2 ring-red-500/20'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-500">{z.code}</div>
                  <div className="truncate text-xs font-semibold">{z.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 1: Safety Switch Guard */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Safety Interlock Guard</div>
              <div className="text-[11px] text-slate-500">Lift physical switch cover to enable trip switch</div>
            </div>
            <button
              type="button"
              onClick={() => {
                audioService.playRadioChirp();
                setSafetyGuardLifted(!safetyGuardLifted);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                safetyGuardLifted
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {safetyGuardLifted ? 'GUARD LIFTED' : 'LIFT GUARD'}
            </button>
          </div>

          {/* Step 2: Confirmation input */}
          {safetyGuardLifted && (
            <div className="animate-fade-in space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                Type <span className="font-mono text-red-600 font-extrabold">STOP</span> to authorize shutdown:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value.toUpperCase())}
                placeholder="Type STOP"
                className="w-full bg-[#F8FAFC] border border-red-300 rounded-lg px-3 py-2 text-sm font-mono font-bold tracking-widest text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}
        </div>

        {/* Modal Buttons */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
          >
            Cancel
          </button>
          <button
            disabled={!safetyGuardLifted || confirmInput !== 'STOP'}
            onClick={handleExecute}
            className={`px-5 py-2 text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 transition-all ${
              safetyGuardLifted && confirmInput === 'STOP'
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <PowerOff className="w-4 h-4" />
            <span>TRIGGER EMERGENCY SHUTDOWN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
