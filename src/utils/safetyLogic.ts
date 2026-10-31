/**
 * Core pure business logic for KAVACH360 AI Safety Intelligence
 * Decoupled from UI components for high reliability, deterministic verification, and unit testing.
 */

export interface BoundingBoxDetection {
  label: string;
  confidence: number;
  type: 'compliant' | 'warning' | 'critical' | 'neutral';
}

export interface WorkerSafetyRecord {
  id: string;
  name: string;
  contractor: string;
  totalChecks: number;
  violationsCount: number;
  certifications: string[];
}

/**
 * Calculates real-time compliance rate percentage from an array of visual detections
 */
export function calculateFeedComplianceRate(detections: BoundingBoxDetection[]): number {
  if (!detections || detections.length === 0) return 100;
  
  // Neutral zones don't count towards PPE checks
  const ppeDetections = detections.filter(d => d.type !== 'neutral');
  if (ppeDetections.length === 0) return 100;

  const nonViolations = ppeDetections.filter(d => d.type === 'compliant').length;
  const rawScore = (nonViolations / ppeDetections.length) * 100;
  return Math.round(rawScore * 10) / 10;
}

/**
 * Determines overall site safety index from multi-zone metrics
 */
export function calculateOverallSafetyIndex(
  zoneScores: { zoneId: string; complianceRate: number; activeCriticalBreaches: number }[]
): number {
  if (!zoneScores || zoneScores.length === 0) return 100;

  let totalWeightedCompliance = 0;
  let totalDeductions = 0;

  for (const zone of zoneScores) {
    totalWeightedCompliance += zone.complianceRate;
    // Each active critical breach directly deducts 3.5 points from overall site safety index
    totalDeductions += zone.activeCriticalBreaches * 3.5;
  }

  const averageCompliance = totalWeightedCompliance / zoneScores.length;
  const finalScore = Math.max(0, Math.min(100, averageCompliance - totalDeductions));
  return Math.round(finalScore * 10) / 10;
}

/**
 * Classifies an incoming safety event into appropriate status & color token
 */
export function classifyEventSeverity(
  violationType: 'missing_hardhat' | 'missing_vest' | 'missing_harness' | 'exclusion_incursion' | 'machinery_proximity'
): { severity: 'critical' | 'warning'; priorityRank: number; requiresEmergencyStop: boolean } {
  switch (violationType) {
    case 'missing_harness':
    case 'exclusion_incursion':
    case 'machinery_proximity':
      return { severity: 'critical', priorityRank: 1, requiresEmergencyStop: violationType === 'machinery_proximity' || violationType === 'exclusion_incursion' };
    case 'missing_hardhat':
    case 'missing_vest':
    default:
      return { severity: 'warning', priorityRank: 2, requiresEmergencyStop: false };
  }
}

/**
 * Evaluates contractor safety compliance standing based on contractor's aggregated personnel history
 */
export function evaluateContractorSafetyGrade(compliancePercentage: number): {
  grade: 'A+' | 'A' | 'B' | 'C' | 'PROBATION';
  statusText: string;
  statusColor: string;
} {
  if (compliancePercentage >= 98.0) {
    return { grade: 'A+', statusText: 'Exemplary Compliance', statusColor: '#10B981' };
  }
  if (compliancePercentage >= 95.0) {
    return { grade: 'A', statusText: 'Standard Compliant', statusColor: '#2563EB' };
  }
  if (compliancePercentage >= 90.0) {
    return { grade: 'B', statusText: 'Observation Required', statusColor: '#F59E0B' };
  }
  if (compliancePercentage >= 85.0) {
    return { grade: 'C', statusText: 'Corrective Action Issued', statusColor: '#D97706' };
  }
  return { grade: 'PROBATION', statusText: 'Work Stoppage Risk', statusColor: '#EF4444' };
}

/**
 * Formats duration into industrial safe hours counter string (e.g. 148,290 Safe Hours)
 */
export function formatSafeManHours(hours: number): string {
  return new Intl.NumberFormat('en-US').format(Math.max(0, Math.floor(hours)));
}
