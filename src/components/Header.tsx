import React from 'react';
import {
  Volume2,
  VolumeX,
  Megaphone,
  AlertTriangle,
  Clock,
  HardHat,
  Sparkles,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { audioService } from '../services/audioService';

interface HeaderProps {
  safeManHours: number;
  activeBreachesCount: number;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  openBroadcastModal: () => void;
  onSimulateHazard: () => void;
  onResetSimulation: () => void;
  isSimulated: boolean;
  selectedSite: string;
  setSelectedSite: (site: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  safeManHours,
  activeBreachesCount,
  isMuted,
  setIsMuted,
  openBroadcastModal,
  onSimulateHazard,
  onResetSimulation,
  isSimulated,
  selectedSite,
  setSelectedSite
}) => {
  const toggleAudio = () => {
    const newState = audioService.toggleMute();
    setIsMuted(newState);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-6 flex items-center justify-between gap-4">
      {/* Site Selector & Shift Badges */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <label htmlFor="site-select" className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Site Feed:
            </label>
            <select
              id="site-select"
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="text-xs font-bold text-[#0F172A] bg-[#F1F5F9] border border-[#CBD5E1] rounded px-2.5 py-1 focus:outline-none focus:border-[#2563EB] font-['Plus_Jakarta_Sans'] cursor-pointer"
            >
              <option value="metro-08">Mumbai Metro Line 4 · Viaduct Pkg 08</option>
              <option value="pier-12">Coastal Road Sea Link · Pier 14-22</option>
              <option value="terminal-03">Navi Mumbai Airport · Cargo Terminal 3</option>
            </select>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-md">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium">Shift A: 06:00 - 14:00</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Normal Operations
          </span>
        </div>
      </div>

      {/* KPI Ticker & Quick Controls */}
      <div className="flex items-center gap-3">
        {/* Safe Man-Hours Counter */}
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
          <HardHat className="w-4 h-4 text-[#2563EB]" />
          <div>
            <div className="text-[10px] uppercase font-bold text-blue-900 tracking-wider font-mono">
              Safe Man-Hours
            </div>
            <div className="text-sm font-extrabold text-[#004AC6] tabular-nums font-['Plus_Jakarta_Sans']">
              {safeManHours.toLocaleString()} <span className="text-[10px] font-normal text-blue-600">LTI-Free</span>
            </div>
          </div>
        </div>

        {/* Active Breaches Indicator */}
        {activeBreachesCount > 0 ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FEE2E2] border border-[#FECACA] rounded-lg text-[#991B1B] text-xs font-bold">
            <ShieldAlert className="w-4 h-4 text-[#EF4444] animate-pulse" />
            <span className="tabular-nums font-mono">{activeBreachesCount} Active Breaches</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#D1FAE5] border border-[#A7F3D0] rounded-lg text-[#065F46] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>100% Compliant</span>
          </div>
        )}

        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleAudio}
          className={`p-2 rounded-lg border transition-colors ${
            isMuted
              ? 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'
              : 'bg-blue-50 border-blue-300 text-[#2563EB] hover:bg-blue-100'
          }`}
          title={isMuted ? 'Audio Alerts Muted (Click to Unmute)' : 'Audio Alerts Active (Click to Mute)'}
          aria-label={isMuted ? 'Unmute Audio Alerts' : 'Mute Audio Alerts'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Site Broadcast PA Trigger */}
        <button
          onClick={openBroadcastModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#0F172A] text-xs font-semibold rounded-lg transition-colors shadow-xs"
          title="Broadcast PA to Field Zones"
        >
          <Megaphone className="w-3.5 h-3.5 text-[#2563EB]" />
          <span className="hidden sm:inline">PA Broadcast</span>
        </button>

        {/* Simulation Event Trigger */}
        {!isSimulated ? (
          <button
            onClick={onSimulateHazard}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95"
            title="Simulate Real-time Safety Violation Event"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Simulate Hazard Incursion</span>
            <span className="md:hidden">Simulate</span>
          </button>
        ) : (
          <button
            onClick={onResetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
            title="Reset Simulated State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        )}
      </div>
    </header>
  );
};
