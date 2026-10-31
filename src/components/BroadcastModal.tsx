import React, { useState } from 'react';
import { Megaphone, X, Radio, Volume2, CheckCircle2 } from 'lucide-react';
import { audioService } from '../services/audioService';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMessage?: string;
  defaultZoneName?: string;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  defaultMessage = '',
  defaultZoneName = 'Global Site Broadcast'
}) => {
  const [message, setMessage] = useState(defaultMessage || 'Attention all personnel: Fall protection inspection active. Verify all lanyards are anchored.');
  const [targetZone, setTargetZone] = useState(defaultZoneName);
  const [transmitted, setTransmitted] = useState(false);

  if (!isOpen) return null;

  const presets = [
    'Attention Zone C: Immediate Fall Protection Check. All ironworkers tether harnesses to static lifeline.',
    'Warning Zone B: Heavy crane slewing overhead. Clear exclusion radius immediately.',
    'Weather Alert: High wind gusts exceeding 35 km/h. High-elevation deck operations suspended.',
    'Gate Notice: Mandatory PPE and biometric badge verification at Gate 3 transit corridor.'
  ];

  const handleTransmit = () => {
    audioService.speakBroadcast(message);
    setTransmitted(true);
    setTimeout(() => {
      setTransmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#CBD5E1] shadow-2xl max-w-lg w-full p-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#2563EB] uppercase tracking-wider">
                Public Address Intercom
              </span>
              <h3 className="text-base font-bold text-[#0F172A] font-['Plus_Jakarta_Sans']">
                Site-Wide Safety Audio Broadcast
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-md">
            <X className="w-5 h-5" />
          </button>
        </div>

        {transmitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-bold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
              Broadcast Transmitted Successfully
            </h4>
            <p className="text-xs text-slate-500 font-mono">
              Audio synthesized to sector loudspeakers with radio lead tone.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4 text-xs">
            {/* Target Channel */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">
                Select Transmission Channel
              </label>
              <select
                value={targetZone}
                onChange={(e) => setTargetZone(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-[#2563EB]"
              >
                <option value="Global Site Broadcast">Channel 1: Global Site Broadcast (All Horns)</option>
                <option value="Zone B - Tower Crane Swing Arc">Channel 2: Zone B - Tower Crane Swing Arc</option>
                <option value="Zone C - High-Elevation Deck Level 4">Channel 3: Zone C - High-Elevation Deck Level 4</option>
                <option value="Zone A - Pier Foundation Excavation">Channel 4: Zone A - Pier Foundation Excavation</option>
                <option value="Zone D - Transit Corridor Gate 3">Channel 5: Zone D - Transit Corridor Gate 3</option>
              </select>
            </div>

            {/* Message Area */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 font-mono">
                Broadcast Audio Message
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-3 text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] leading-relaxed"
                placeholder="Enter safety message for speech synthesis..."
              />
            </div>

            {/* Quick Presets */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-mono">
                Quick Standard Directives
              </label>
              <div className="space-y-1">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMessage(preset)}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-[11px] text-slate-700 hover:text-blue-900 border border-slate-200 transition-colors truncate"
                  >
                    "{preset}"
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleTransmit}
                disabled={!message.trim()}
                className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-slate-200 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Transmit Broadcast (PA)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
