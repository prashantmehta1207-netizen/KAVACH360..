import React, { useState } from 'react';
import { HazardZone, CameraFeed, Incident } from '../types/safety';
import {
  MapPin,
  ShieldAlert,
  PowerOff,
  Users,
  Eye,
  Volume2,
  HardHat,
  Crosshair,
  Maximize2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { audioService } from '../services/audioService';

interface DigitalTwinZonesProps {
  zones: HazardZone[];
  cameras: CameraFeed[];
  incidents: Incident[];
  onZoneLockoutToggle: (zoneId: string) => void;
  onSelectCamera: (cameraId: string) => void;
}

export const DigitalTwinZones: React.FC<DigitalTwinZonesProps> = ({
  zones,
  cameras,
  incidents,
  onZoneLockoutToggle,
  onSelectCamera
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id || 'zone-b');
  const [sirenActiveZone, setSirenActiveZone] = useState<string | null>(null);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || zones[0];
  const zoneCameras = cameras.filter((c) => c.zoneId === selectedZone.id);
  const zoneIncidents = incidents.filter((i) => i.zoneId === selectedZone.id && i.status !== 'resolved');

  const handleSoundZoneAlarm = (zone: HazardZone) => {
    setSirenActiveZone(zone.id);
    audioService.playCriticalAlarm();
    setTimeout(() => setSirenActiveZone(null), 2500);
  };

  return (
    <div className="space-y-4">
      {/* CAD Map & Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Interactive Site CAD Canvas (7 Cols) */}
        <div className="lg:col-span-8 bg-[#0B132B] rounded-xl border border-[#1E293B] p-4 shadow-lg flex flex-col justify-between relative overflow-hidden">
          {/* CAD Technical Grid Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #38BDF8 1px, transparent 1px), linear-gradient(to bottom, #38BDF8 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Blueprint Title Bar */}
          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-white tracking-wider">
                DIGITAL TWIN · GEOSPATIAL CAD SECTOR MAP
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
              <span>SCALE: 1:250</span>
              <span>·</span>
              <span>DATUM: WGS84 (CH-14+200)</span>
            </div>
          </div>

          {/* Interactive 2D Blueprint Canvas */}
          <div className="relative my-4 aspect-[16/10] bg-[#0A1022]/90 rounded-lg border border-[#1E293B] overflow-hidden select-none">
            {/* Structural Axis Markings */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-500">GRID: NORTH ↑</div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-500">SECTOR MATRIX ACTIVE</div>

            {/* Render Geofenced Zones */}
            {zones.map((zone) => {
              const isSelected = selectedZoneId === zone.id;
              const hasCriticalBreach = incidents.some(
                (i) => i.zoneId === zone.id && i.severity === 'critical' && i.status !== 'resolved'
              );

              let borderColor = 'border-blue-500/60 bg-blue-500/10 hover:bg-blue-500/20';
              let badgeBg = 'bg-blue-500/20 text-blue-300 border-blue-400/40';

              if (hasCriticalBreach) {
                borderColor = 'border-red-500 bg-red-500/20 animate-pulse';
                badgeBg = 'bg-red-500/30 text-red-300 border-red-500/50';
              } else if (zone.riskLevel === 'extreme') {
                borderColor = 'border-amber-500/80 bg-amber-500/15 hover:bg-amber-500/25';
                badgeBg = 'bg-amber-500/30 text-amber-300 border-amber-500/40';
              }

              if (isSelected) {
                borderColor += ' ring-2 ring-white shadow-xl shadow-cyan-500/20';
              }

              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  style={{
                    left: `${zone.bounds.x}%`,
                    top: `${zone.bounds.y}%`,
                    width: `${zone.bounds.width}%`,
                    height: `${zone.bounds.height}%`
                  }}
                  className={`absolute rounded-lg border-2 cursor-pointer transition-all p-2.5 flex flex-col justify-between ${borderColor}`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${badgeBg}`}>
                      {zone.code}
                    </span>
                    {zone.lockoutStatus && (
                      <span className="text-[9px] font-mono font-bold bg-red-600 text-white px-1.5 py-0.2 rounded">
                        LOCKOUT
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white font-['Plus_Jakarta_Sans'] truncate drop-shadow-sm">
                      {zone.name}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-300 font-mono mt-0.5">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-cyan-400" />
                        {zone.activeWorkers} / {zone.maxCapacity}
                      </span>
                      {hasCriticalBreach && (
                        <span className="text-red-400 font-bold flex items-center gap-1 animate-pulse">
                          <ShieldAlert className="w-3 h-3" />
                          Breach
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Camera Cones */}
            {cameras.map((cam, idx) => {
              const zone = zones.find((z) => z.id === cam.zoneId);
              if (!zone) return null;
              const posX = zone.bounds.x + 5 + (idx % 2) * (zone.bounds.width - 15);
              const posY = zone.bounds.y + 5 + (idx % 2) * (zone.bounds.height - 15);

              return (
                <button
                  key={cam.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedZoneId(cam.zoneId);
                    onSelectCamera(cam.id);
                  }}
                  style={{ left: `${posX}%`, top: `${posY}%` }}
                  className="absolute z-20 group -translate-x-1/2 -translate-y-1/2"
                  title={`Camera ${cam.code} (Click to View Feed)`}
                >
                  <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center border-2 border-white shadow-md hover:scale-125 transition-transform">
                    <Eye className="w-3 h-3" />
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap border border-slate-700 pointer-events-none transition-opacity">
                    {cam.code}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Blueprint Legend */}
          <div className="relative z-10 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-[#1E293B]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-red-500/40 border border-red-500" />
                Active Critical Incursion
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-amber-500/40 border border-amber-500" />
                Elevated Risk Zone
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-blue-500/40 border border-blue-500" />
                Monitored Sector
              </span>
            </div>
            <span>Click any sector to inspect telemetry</span>
          </div>
        </div>

        {/* Selected Zone Deep Dossier (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                  {selectedZone.code}
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mt-1 font-['Plus_Jakarta_Sans']">
                  {selectedZone.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedZone.category}</p>
              </div>

              <StatusBadge
                type={selectedZone.riskLevel === 'extreme' ? 'critical' : selectedZone.riskLevel === 'elevated' ? 'warning' : 'compliant'}
                label={`${selectedZone.riskLevel.toUpperCase()} RISK`}
                pulse={selectedZone.riskLevel === 'extreme'}
              />
            </div>

            {/* Occupancy & Live Status */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Personnel Density</div>
                <div className="text-lg font-bold text-[#0F172A] mt-0.5 font-['Plus_Jakarta_Sans'] tabular-nums">
                  {selectedZone.activeWorkers} <span className="text-xs text-slate-500 font-normal">/ {selectedZone.maxCapacity} Max</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-[#2563EB] h-full rounded-full"
                    style={{ width: `${Math.min(100, (selectedZone.activeWorkers / selectedZone.maxCapacity) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Active Breaches</div>
                <div className={`text-lg font-bold mt-0.5 font-['Plus_Jakarta_Sans'] tabular-nums ${
                  zoneIncidents.length > 0 ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  {zoneIncidents.length} Breaches
                </div>
                <div className="text-[10px] text-slate-500 mt-2 font-mono">
                  {zoneIncidents.length > 0 ? 'Action Required' : 'Zone Cleared'}
                </div>
              </div>
            </div>

            {/* Mandatory PPE Checklist */}
            <div>
              <div className="text-xs font-bold text-[#0F172A] mb-2 flex items-center gap-1.5">
                <HardHat className="w-4 h-4 text-[#2563EB]" />
                <span>Mandatory PPE Geofence Rules</span>
              </div>
              <div className="space-y-1.5">
                {selectedZone.ppeRequired.map((ppe, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-slate-700"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span>{ppe}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Associated Video Feeds */}
            <div>
              <div className="text-xs font-bold text-[#0F172A] mb-2">Live Feeds in Sector ({zoneCameras.length})</div>
              <div className="space-y-1.5">
                {zoneCameras.map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => onSelectCamera(cam.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:border-[#2563EB] hover:bg-blue-50/50 text-xs text-left transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Eye className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span className="font-mono text-slate-600">{cam.code}</span>
                      <span className="truncate font-semibold text-slate-800">{cam.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">View</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions: Siren Alarm & Lockout */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => handleSoundZoneAlarm(selectedZone)}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-colors ${
                  sirenActiveZone === selectedZone.id
                    ? 'bg-red-600 text-white animate-bounce'
                    : 'bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9]'
                }`}
              >
                <Volume2 className="w-4 h-4 text-[#EF4444]" />
                <span>Sound Sector Warning Siren</span>
              </button>

              <button
                onClick={() => onZoneLockoutToggle(selectedZone.id)}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-colors ${
                  selectedZone.lockoutStatus
                    ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
                    : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                }`}
              >
                <PowerOff className="w-4 h-4" />
                <span>{selectedZone.lockoutStatus ? 'DISENGAGE ZONE LOCKOUT' : 'ENGAGE MACHINERY LOCKOUT'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
