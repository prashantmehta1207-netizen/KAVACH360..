import React, { useState } from 'react';
import {
  CameraFeed,
  BoundingBox,
  Incident
} from '../types/safety';
import {
  Maximize2,
  Minimize2,
  Grid3X3,
  LayoutGrid,
  Square,
  Volume2,
  Camera,
  PowerOff,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
  Crosshair,
  UserCheck,
  Cpu,
  Layers
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { audioService } from '../services/audioService';

interface LiveVisionMatrixProps {
  cameras: CameraFeed[];
  onLockoutToggle: (cameraId: string) => void;
  onTriggerInspection: (camera: CameraFeed) => void;
  onDispatchMarshal: (incidentId: string) => void;
  incidents: Incident[];
}

export const LiveVisionMatrix: React.FC<LiveVisionMatrixProps> = ({
  cameras,
  onLockoutToggle,
  onTriggerInspection
}) => {
  const [layoutMode, setLayoutMode] = useState<'3x2' | '2x2' | '1x1'>('3x2');
  const [selectedCameraId, setSelectedCameraId] = useState<string>(cameras[1]?.id || cameras[0]?.id);
  const [selectedBox, setSelectedBox] = useState<BoundingBox | null>(null);
  const [filterPpe, setFilterPpe] = useState<'all' | 'critical' | 'warning' | 'compliant'>('all');
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [activeZoneSiren, setActiveZoneSiren] = useState<string | null>(null);
  const [snapshotSuccess, setSnapshotSuccess] = useState<string | null>(null);

  const handleSoundHorn = (cam: CameraFeed) => {
    setActiveZoneSiren(cam.id);
    audioService.playCriticalAlarm();
    setTimeout(() => {
      setActiveZoneSiren(null);
    }, 2500);
  };

  const handleCaptureSnapshot = (cam: CameraFeed) => {
    audioService.playRadioChirp();
    setSnapshotSuccess(cam.code);
    setTimeout(() => setSnapshotSuccess(null), 3000);
  };

  const activeCam = cameras.find((c) => c.id === selectedCameraId) || cameras[0];

  return (
    <div className="space-y-4">
      {/* Control Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
            <span>Computer Vision Feeds</span>
            <span className="text-xs font-mono font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              6 Edge Cameras Synchronized
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time inference via YOLO-v11 Edge Pipeline · PPE & Proximity Verification
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Overlays Toggle */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              showOverlays
                ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]'
                : 'bg-white border-[#CBD5E1] text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AI Bounding Boxes: {showOverlays ? 'ON' : 'OFF'}</span>
          </button>

          {/* Filter Detections */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setFilterPpe('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterPpe === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Labels
            </button>
            <button
              onClick={() => setFilterPpe('critical')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterPpe === 'critical' ? 'bg-red-50 text-red-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Breaches Only
            </button>
            <button
              onClick={() => setFilterPpe('compliant')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterPpe === 'compliant' ? 'bg-emerald-50 text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Compliant
            </button>
          </div>

          {/* Layout Grid Buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setLayoutMode('1x1')}
              className={`p-1.5 rounded-md transition-colors ${
                layoutMode === '1x1' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Single Inspection Mode (1x1)"
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('2x2')}
              className={`p-1.5 rounded-md transition-colors ${
                layoutMode === '2x2' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Quad View (2x2)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('3x2')}
              className={`p-1.5 rounded-md transition-colors ${
                layoutMode === '3x2' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Complete Matrix (3x2)"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Toast */}
      {snapshotSuccess && (
        <div className="bg-[#D1FAE5] border border-[#A7F3D0] text-[#065F46] p-3 rounded-lg text-xs font-semibold flex items-center justify-between animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>
              High-resolution frame captured from <span className="font-mono font-bold">{snapshotSuccess}</span> with detection metadata embedded. Logged to OSHA Incident Archive.
            </span>
          </div>
          <button onClick={() => setSnapshotSuccess(null)} className="text-[#065F46] hover:text-black">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1x1 Focused Inspection Mode */}
      {layoutMode === '1x1' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
            <CameraCard
              camera={activeCam}
              isFullView={true}
              showOverlays={showOverlays}
              filterPpe={filterPpe}
              onSelectBox={setSelectedBox}
              selectedBox={selectedBox}
              onSoundHorn={handleSoundHorn}
              isSirenPlaying={activeZoneSiren === activeCam.id}
              onCaptureSnapshot={handleCaptureSnapshot}
              onLockoutToggle={onLockoutToggle}
              onExpand={() => onTriggerInspection(activeCam)}
            />
          </div>

          {/* Deep Inspection Panel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
              <h3 className="text-sm font-bold text-[#0F172A] border-b border-slate-100 pb-2 mb-3 flex items-center justify-between">
                <span>Active Stream Telemetry</span>
                <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {activeCam.precision}% PRECISION
                </span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Camera Identifier:</span>
                  <span className="font-mono font-bold text-[#0F172A]">{activeCam.code}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Zone Assignment:</span>
                  <span className="font-semibold text-slate-800">{activeCam.zoneName}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Stream Specs:</span>
                  <span className="font-mono text-slate-700">{activeCam.streamResolution} @ {activeCam.fps} FPS</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Active Workers Tracked:</span>
                  <span className="font-bold text-[#2563EB] font-mono">{activeCam.activeWorkers} Personnel</span>
                </div>
                {activeCam.elevationMeters !== undefined && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Sensor Elevation:</span>
                    <span className="font-mono text-slate-700">{activeCam.elevationMeters > 0 ? `+${activeCam.elevationMeters}m Above Ground` : `${activeCam.elevationMeters}m Below Subgrade`}</span>
                  </div>
                )}
                {activeCam.equipmentAttached && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Equipment Interlock:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[180px]">{activeCam.equipmentAttached}</span>
                  </div>
                )}
              </div>

              {/* Machinery Lockout Switch */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">Machinery Interlock</div>
                  <div className="text-[11px] text-slate-500">Stop machinery in this camera zone</div>
                </div>
                <button
                  onClick={() => onLockoutToggle(activeCam.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeCam.lockoutActive
                      ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  {activeCam.lockoutActive ? 'LOCKOUT ENGAGED' : 'ENGAGE LOCKOUT'}
                </button>
              </div>
            </div>

            {/* Select Different Camera */}
            <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                Switch Primary Feed
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {cameras.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCameraId(c.id)}
                    className={`text-left p-2 rounded-lg border text-xs transition-all ${
                      c.id === selectedCameraId
                        ? 'border-[#2563EB] bg-[#EFF6FF] text-[#004AC6] font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="font-mono text-[10px] text-slate-500">{c.code}</div>
                    <div className="truncate font-semibold mt-0.5">{c.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Feed Grids (2x2 or 3x2) */}
      {layoutMode !== '1x1' && (
        <div
          className={`grid gap-4 ${
            layoutMode === '2x2' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
          }`}
        >
          {cameras.map((cam) => (
            <div
              key={cam.id}
              className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              <CameraCard
                camera={cam}
                isFullView={false}
                showOverlays={showOverlays}
                filterPpe={filterPpe}
                onSelectBox={setSelectedBox}
                selectedBox={selectedBox}
                onSoundHorn={handleSoundHorn}
                isSirenPlaying={activeZoneSiren === cam.id}
                onCaptureSnapshot={handleCaptureSnapshot}
                onLockoutToggle={onLockoutToggle}
                onExpand={() => {
                  setSelectedCameraId(cam.id);
                  setLayoutMode('1x1');
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Bounding Box Detail Modal / Drawer */}
      {selectedBox && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-2xl max-w-md w-full p-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-bold text-sm text-[#0F172A]">AI Vision Detection Telemetry</h3>
              </div>
              <button
                onClick={() => setSelectedBox(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Classification:</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  selectedBox.type === 'critical'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : selectedBox.type === 'warning'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {selectedBox.label}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Detection Confidence:</span>
                <span className="font-mono font-bold text-[#0F172A]">
                  {(selectedBox.confidence * 100).toFixed(1)}% Precision
                </span>
              </div>

              {selectedBox.workerName && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                      Identified Personnel:
                    </span>
                    <span className="font-mono text-blue-700">{selectedBox.workerId}</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900">{selectedBox.workerName}</div>
                  <div className="text-slate-500 text-[11px]">{selectedBox.contractor}</div>
                </div>
              )}

              <div className="text-[11px] text-slate-500 bg-blue-50/70 p-2.5 rounded-lg border border-blue-100">
                Spatial Coordinates: X:{selectedBox.x}% · Y:{selectedBox.y}% · W:{selectedBox.width}% · H:{selectedBox.height}%
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedBox(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
              {selectedBox.type === 'critical' && (
                <button
                  onClick={() => {
                    audioService.speakBroadcast(`Warning: Fall protection compliance required for personnel ${selectedBox.workerName || 'in sector'}`);
                    setSelectedBox(null);
                  }}
                  className="px-3 py-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Broadcast Warning to Personnel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface CameraCardProps {
  camera: CameraFeed;
  isFullView: boolean;
  showOverlays: boolean;
  filterPpe: 'all' | 'critical' | 'warning' | 'compliant';
  onSelectBox: (box: BoundingBox) => void;
  selectedBox: BoundingBox | null;
  onSoundHorn: (cam: CameraFeed) => void;
  isSirenPlaying: boolean;
  onCaptureSnapshot: (cam: CameraFeed) => void;
  onLockoutToggle: (camId: string) => void;
  onExpand: () => void;
}

const CameraCard: React.FC<CameraCardProps> = ({
  camera,
  isFullView,
  showOverlays,
  filterPpe,
  onSelectBox,
  selectedBox,
  onSoundHorn,
  isSirenPlaying,
  onCaptureSnapshot,
  onLockoutToggle,
  onExpand
}) => {
  const filteredDetections = camera.detections.filter((d) => {
    if (filterPpe === 'all') return true;
    return d.type === filterPpe;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Telemetry Header */}
      <div className="px-3.5 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="font-mono font-bold text-slate-800 text-[11px] bg-slate-200/80 px-2 py-0.5 rounded tracking-wider">
            {camera.code}
          </span>
          <span className="font-semibold text-slate-900 truncate font-['Plus_Jakarta_Sans'] text-xs">
            {camera.name}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            {camera.precision}% Precision
          </span>
          <StatusBadge
            type={camera.status}
            label={camera.status === 'alert' ? 'CRITICAL' : camera.status}
            pulse={camera.status === 'alert'}
          />
        </div>
      </div>

      {/* Video Viewport with Bounding Boxes */}
      <div className="relative bg-slate-950 aspect-video overflow-hidden group select-none">
        {/* Underlay Image (Simulated Stream) */}
        <img
          src={camera.imageUrl}
          alt={camera.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />

        {/* Scanline Animation */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-20 animate-scanline" />

        {/* Machine Lockout Alert Banner if active */}
        {camera.lockoutActive && (
          <div className="absolute inset-0 bg-red-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 p-4 text-center">
            <PowerOff className="w-10 h-10 text-red-500 animate-pulse mb-2" />
            <h4 className="text-base font-extrabold tracking-widest font-mono uppercase text-red-400">
              MACHINERY INTERLOCK ENGAGED
            </h4>
            <p className="text-xs text-red-200 max-w-sm mt-1">
              Power supply safely interrupted by KAVACH360 command. Work stoppage active in this zone.
            </p>
            <button
              onClick={() => onLockoutToggle(camera.id)}
              className="mt-3 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-lg"
            >
              DISENGAGE LOCKOUT
            </button>
          </div>
        )}

        {/* Live HUD Overlay */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 text-[10px] font-mono text-white/90 bg-slate-950/80 px-2 py-0.5 rounded backdrop-blur-xs border border-white/10">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>LIVE</span>
          <span>·</span>
          <span>{camera.fps} FPS</span>
          <span>·</span>
          <span>{camera.streamResolution.split(' ')[0]}</span>
        </div>

        {/* Zone Badge */}
        <div className="absolute top-2 right-2 z-10 text-[10px] font-mono text-white/90 bg-slate-950/80 px-2 py-0.5 rounded backdrop-blur-xs border border-white/10">
          {camera.zoneName}
        </div>

        {/* Real-Time Bounding Box Layer */}
        {showOverlays && (
          <div className="absolute inset-0 z-10 pointer-events-auto">
            {filteredDetections.map((box) => {
              const isSelected = selectedBox?.id === box.id;
              let borderClass = 'border-[#10B981]';
              let tagBgClass = 'bg-[#10B981] text-white';

              if (box.type === 'critical') {
                borderClass = 'border-[#EF4444] animate-pulse';
                tagBgClass = 'bg-[#EF4444] text-white';
              } else if (box.type === 'warning') {
                borderClass = 'border-[#F59E0B]';
                tagBgClass = 'bg-[#F59E0B] text-slate-900 font-bold';
              } else if (box.type === 'neutral') {
                borderClass = 'border-dashed border-sky-400/80';
                tagBgClass = 'bg-sky-500/80 text-white';
              }

              return (
                <div
                  key={box.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBox(box);
                  }}
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`
                  }}
                  className={`absolute border-2 rounded-xs cursor-pointer transition-all ${borderClass} ${
                    isSelected ? 'ring-2 ring-white ring-offset-1' : ''
                  }`}
                  title={`${box.label} (${(box.confidence * 100).toFixed(0)}%)`}
                >
                  <span
                    className={`absolute -top-5 left-0 px-1.5 py-0.2 text-[9px] font-mono font-semibold rounded-xs whitespace-nowrap shadow-xs ${tagBgClass}`}
                  >
                    {box.label} · {(box.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Quick Action Overlay Controls on Hover */}
        <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          {/* Sound Zone Horn */}
          <button
            onClick={() => onSoundHorn(camera)}
            className={`p-1.5 rounded-lg text-white backdrop-blur-md transition-colors ${
              isSirenPlaying ? 'bg-red-600 animate-bounce' : 'bg-slate-900/80 hover:bg-red-600 border border-white/20'
            }`}
            title="Sound Zone Alarm Horn"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          {/* Capture Snapshot */}
          <button
            onClick={() => onCaptureSnapshot(camera)}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-[#2563EB] text-white backdrop-blur-md transition-colors border border-white/20"
            title="Capture & Log Violation Snapshot"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen / Expand */}
          <button
            onClick={onExpand}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-700 text-white backdrop-blur-md transition-colors border border-white/20"
            title="Expand Camera Feed"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Detection Legend Footer */}
      <div className="px-3.5 py-2 bg-white flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            PPE OK
          </span>
          {camera.detections.some((d) => d.type === 'critical') && (
            <span className="flex items-center gap-1 font-mono text-red-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
              Fall Arrest Alert
            </span>
          )}
          {camera.detections.some((d) => d.type === 'warning') && (
            <span className="flex items-center gap-1 font-mono text-amber-700">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              Exclusion Incursion
            </span>
          )}
        </div>

        <button
          onClick={onExpand}
          className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold text-xs flex items-center gap-1"
        >
          <span>Deep Inspect</span>
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
