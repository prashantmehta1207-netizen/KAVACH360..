export type SeverityType = 'critical' | 'warning' | 'resolved' | 'processing';

export interface BoundingBox {
  id: string;
  label: string;
  confidence: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage
  height: number; // percentage
  type: 'compliant' | 'warning' | 'critical' | 'neutral';
  workerName?: string;
  workerId?: string;
  contractor?: string;
  detectedAt?: string;
}

export interface CameraFeed {
  id: string;
  code: string;
  name: string;
  zoneId: string;
  zoneName: string;
  status: 'active' | 'warning' | 'alert' | 'standby';
  imageUrl: string;
  streamResolution: string;
  fps: number;
  precision: number;
  modelName: string;
  detections: BoundingBox[];
  activeWorkers: number;
  lockoutActive: boolean;
  equipmentAttached?: string;
  elevationMeters?: number;
}

export interface Incident {
  id: string;
  code: string;
  title: string;
  severity: SeverityType;
  zoneId: string;
  zoneName: string;
  cameraId: string;
  cameraCode: string;
  workerName: string;
  workerId: string;
  contractor: string;
  trade: string;
  timestamp: string;
  oshaRegulation: string;
  description: string;
  status: 'active' | 'acknowledged' | 'dispatched' | 'resolved';
  snapshotUrl: string;
  dispatchedTo?: string;
  resolutionTime?: string;
  resolutionNotes?: string;
}

export interface HazardZone {
  id: string;
  code: string;
  name: string;
  category: 'Excavation' | 'Structural Deck' | 'Crane Lift Radius' | 'Logistics Yard' | 'Precast Fabrication';
  riskLevel: 'extreme' | 'elevated' | 'moderate' | 'low';
  activeWorkers: number;
  maxCapacity: number;
  camerasCount: number;
  activeIncidents: number;
  lockoutStatus: boolean;
  ppeRequired: string[];
  bounds: { x: number; y: number; width: number; height: number }; // percentage on site map
  center: { x: number; y: number };
}

export interface WorkerCertification {
  name: string;
  code: string;
  expiry: string;
  valid: boolean;
}

export interface Worker {
  id: string;
  code: string;
  name: string;
  trade: string;
  contractor: string;
  zoneId: string;
  zoneName: string;
  status: 'compliant' | 'warning' | 'breach';
  ppeComplianceRate: number;
  certifications: WorkerCertification[];
  rfidBeacon: string;
  shift: string;
  avatar: string;
  infractionsCount: number;
  inductionDate: string;
  emergencyContact: string;
  bloodGroup: string;
}

export interface ContractorSummary {
  name: string;
  code: string;
  personnelCount: number;
  complianceRate: number;
  activeViolations: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'PROBATION';
  supervisor: string;
  contact: string;
}
