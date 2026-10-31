import React, { useState, useEffect } from 'react';
import { NavTab, Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LiveVisionMatrix } from './components/LiveVisionMatrix';
import { IncidentCommand } from './components/IncidentCommand';
import { DigitalTwinZones } from './components/DigitalTwinZones';
import { PersonnelPassports } from './components/PersonnelPassports';
import { SafetyAnalytics } from './components/SafetyAnalytics';
import { EmergencyLockoutModal } from './components/EmergencyLockoutModal';
import { BroadcastModal } from './components/BroadcastModal';

import {
  INITIAL_CAMERAS,
  INITIAL_INCIDENTS,
  INITIAL_ZONES,
  INITIAL_WORKERS,
  INITIAL_CONTRACTORS
} from './data/mockData';
import {
  CameraFeed,
  Incident,
  HazardZone,
  Worker,
  ContractorSummary
} from './types/safety';
import {
  calculateOverallSafetyIndex,
  calculateFeedComplianceRate
} from './utils/safetyLogic';
import { audioService } from './services/audioService';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('vision');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedSite, setSelectedSite] = useState('metro-08');

  // Core Data States
  const [cameras, setCameras] = useState<CameraFeed[]>(INITIAL_CAMERAS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [zones, setZones] = useState<HazardZone[]>(INITIAL_ZONES);
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [contractors, setContractors] = useState<ContractorSummary[]>(INITIAL_CONTRACTORS);

  // Telemetry & Metrics
  const [safeManHours, setSafeManHours] = useState(148290);
  const [isMuted, setIsMuted] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  // Modals
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastPreset, setBroadcastPreset] = useState({ message: '', zone: '' });

  // Increment safe man hours periodically to simulate live shift progress
  useEffect(() => {
    const timer = setInterval(() => {
      setSafeManHours((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Compute active critical breaches
  const activeCriticalBreaches = incidents.filter(
    (i) => i.severity === 'critical' && i.status !== 'resolved'
  ).length;

  // Calculate live Safety Index
  const zoneScores = zones.map((z) => {
    const zIncidents = incidents.filter((i) => i.zoneId === z.id && i.status !== 'resolved');
    const zCriticals = zIncidents.filter((i) => i.severity === 'critical').length;
    const baseCompliance = zIncidents.length === 0 ? 99 : Math.max(70, 98 - zIncidents.length * 6);
    return {
      zoneId: z.id,
      complianceRate: baseCompliance,
      activeCriticalBreaches: zCriticals
    };
  });
  const currentSafetyIndex = calculateOverallSafetyIndex(zoneScores);

  // Toggle Camera Machinery Lockout
  const handleLockoutToggle = (cameraId: string) => {
    setCameras((prev) =>
      prev.map((c) => {
        if (c.id === cameraId) {
          const nextState = !c.lockoutActive;
          if (nextState) {
            audioService.playEmergencyLockout();
          } else {
            audioService.playComplianceChime();
          }
          return { ...c, lockoutActive: nextState };
        }
        return c;
      })
    );
  };

  // Toggle Zone Lockout
  const handleZoneLockoutToggle = (zoneId: string) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const nextState = !z.lockoutStatus;
          if (nextState) {
            audioService.playEmergencyLockout();
          } else {
            audioService.playComplianceChime();
          }
          return { ...z, lockoutStatus: nextState };
        }
        return z;
      })
    );
    // Also update all cameras belonging to that zone
    setCameras((prev) =>
      prev.map((c) => (c.zoneId === zoneId ? { ...c, lockoutActive: !c.lockoutActive } : c))
    );
  };

  // Confirm Emergency Lockout from modal
  const handleConfirmLockout = (target: 'all' | string) => {
    audioService.playEmergencyLockout();
    if (target === 'all') {
      setZones((prev) => prev.map((z) => ({ ...z, lockoutStatus: true })));
      setCameras((prev) => prev.map((c) => ({ ...c, lockoutActive: true })));
    } else {
      handleZoneLockoutToggle(target);
    }
  };

  // Resolve an Incident
  const handleResolveIncident = (incidentId: string, notes: string) => {
    audioService.playComplianceChime();
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'resolved',
            resolutionTime: 'Just now',
            resolutionNotes: notes
          };
        }
        return inc;
      })
    );

    // Update worker status if associated
    const targetIncident = incidents.find((i) => i.id === incidentId);
    if (targetIncident) {
      setWorkers((prev) =>
        prev.map((w) =>
          w.code === targetIncident.workerId ? { ...w, status: 'compliant' } : w
        )
      );
    }
  };

  // Dispatch Marshal
  const handleDispatchMarshal = (incidentId: string, team: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'dispatched',
            dispatchedTo: team
          };
        }
        return inc;
      })
    );
  };

  // Open Broadcast for specific incident
  const handleBroadcastIncident = (incident: Incident) => {
    setBroadcastPreset({
      message: `Attention ${incident.zoneName}: Safety breach detected for ${incident.workerName}. Immediate corrective action mandatory under OSHA code ${incident.oshaRegulation}.`,
      zone: incident.zoneName
    });
    setIsBroadcastModalOpen(true);
  };

  // Simulate safety breach scenario
  const handleSimulateHazard = () => {
    audioService.playCriticalAlarm();
    setIsSimulated(true);

    const simulatedIncident: Incident = {
      id: `inc-sim-${Date.now()}`,
      code: 'INC-2026-0901',
      title: 'Suspended Load Blindspot Incursion · Rigger Proximity Breach',
      severity: 'critical',
      zoneId: 'zone-b',
      zoneName: 'Tower Crane 02 Swing Arc',
      cameraId: 'cam-01',
      cameraCode: 'CAM-01-CRANE-TOWER',
      workerName: 'Rajesh Sharma',
      workerId: 'WRK-8921',
      contractor: 'Larsen & Toubro Heavy Civil',
      trade: 'Tower Crane Lead Rigger',
      timestamp: 'Just now (Simulated)',
      oshaRegulation: 'OSHA 1926.1425 - Keeping Clear of Suspended Structural Loads',
      description: 'Worker walked under 12-ton counterweight swing radius while slewing gear was engaged.',
      status: 'active',
      snapshotUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861563?q=80&w=600&auto=format&fit=crop'
    };

    setIncidents((prev) => [simulatedIncident, ...prev]);

    // Update camera feed status to alert with a critical detection box
    setCameras((prev) =>
      prev.map((c) => {
        if (c.id === 'cam-01') {
          return {
            ...c,
            status: 'alert',
            detections: [
              {
                id: 'det-sim-alert',
                label: 'Exclusion Incursion · Crane Swing Arc',
                confidence: 0.99,
                x: 38,
                y: 34,
                width: 24,
                height: 38,
                type: 'critical',
                workerName: 'Rajesh Sharma',
                workerId: 'WRK-8921',
                contractor: 'Larsen & Toubro Heavy Civil',
                detectedAt: 'Live'
              },
              ...c.detections
            ]
          };
        }
        return c;
      })
    );

    setActiveTab('vision');
  };

  // Reset simulation state
  const handleResetSimulation = () => {
    audioService.playComplianceChime();
    setIsSimulated(false);
    setIncidents(INITIAL_INCIDENTS);
    setCameras(INITIAL_CAMERAS);
    setZones(INITIAL_ZONES);
    setWorkers(INITIAL_WORKERS);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex">
      {/* Bi-Modal Command Dark Navy Sidebar Shell */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        activeBreachesCount={activeCriticalBreaches}
        openEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div
        className={`flex-1 transition-all duration-300 flex flex-col min-w-0 ${
          sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'
        }`}
      >
        {/* Persistent Top Header */}
        <Header
          safeManHours={safeManHours}
          activeBreachesCount={activeCriticalBreaches}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          openBroadcastModal={() => {
            setBroadcastPreset({ message: '', zone: 'Global Site Broadcast' });
            setIsBroadcastModalOpen(true);
          }}
          onSimulateHazard={handleSimulateHazard}
          onResetSimulation={handleResetSimulation}
          isSimulated={isSimulated}
          selectedSite={selectedSite}
          setSelectedSite={setSelectedSite}
        />

        {/* Dynamic Screen Canvas */}
        <main className="flex-1 p-5 md:p-6 max-w-[1600px] w-full mx-auto">
          {activeTab === 'vision' && (
            <LiveVisionMatrix
              cameras={cameras}
              onLockoutToggle={handleLockoutToggle}
              onTriggerInspection={(cam) => {
                setActiveTab('vision');
              }}
              onDispatchMarshal={(incId) => handleDispatchMarshal(incId, 'Unit Alpha')}
              incidents={incidents}
            />
          )}

          {activeTab === 'incidents' && (
            <IncidentCommand
              incidents={incidents}
              onResolveIncident={handleResolveIncident}
              onDispatchMarshal={handleDispatchMarshal}
              onBroadcastIncident={handleBroadcastIncident}
            />
          )}

          {activeTab === 'zones' && (
            <DigitalTwinZones
              zones={zones}
              cameras={cameras}
              incidents={incidents}
              onZoneLockoutToggle={handleZoneLockoutToggle}
              onSelectCamera={(camId) => {
                setActiveTab('vision');
              }}
            />
          )}

          {activeTab === 'personnel' && <PersonnelPassports workers={workers} />}

          {activeTab === 'analytics' && (
            <SafetyAnalytics
              safeManHours={safeManHours}
              safetyIndex={currentSafetyIndex}
              contractors={contractors}
              incidents={incidents}
              onTriggerConfetti={() => {}}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <EmergencyLockoutModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        zones={zones}
        onConfirmLockout={handleConfirmLockout}
      />

      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        defaultMessage={broadcastPreset.message}
        defaultZoneName={broadcastPreset.zone}
      />
    </div>
  );
}
