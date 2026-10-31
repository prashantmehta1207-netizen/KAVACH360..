import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFeedComplianceRate,
  calculateOverallSafetyIndex,
  classifyEventSeverity,
  evaluateContractorSafetyGrade,
  formatSafeManHours,
  BoundingBoxDetection
} from './safetyLogic.ts';

test('calculateFeedComplianceRate computes correct ratio ignoring neutral detections', () => {
  const detections: BoundingBoxDetection[] = [
    { label: 'Hardhat', confidence: 0.98, type: 'compliant' },
    { label: 'Hi-Vis Vest', confidence: 0.95, type: 'compliant' },
    { label: 'Missing Harness', confidence: 0.92, type: 'critical' },
    { label: 'Machinery Danger Zone', confidence: 0.99, type: 'neutral' }
  ];

  // 2 compliant out of 3 non-neutral = 66.7%
  const rate = calculateFeedComplianceRate(detections);
  assert.equal(rate, 66.7);
});

test('calculateFeedComplianceRate returns 100 on empty or all neutral detections', () => {
  assert.equal(calculateFeedComplianceRate([]), 100);
  assert.equal(calculateFeedComplianceRate([{ label: 'Zone boundary', confidence: 0.99, type: 'neutral' }]), 100);
});

test('calculateOverallSafetyIndex applies breach penalties correctly', () => {
  const zoneScores = [
    { zoneId: 'zone-a', complianceRate: 98, activeCriticalBreaches: 0 },
    { zoneId: 'zone-b', complianceRate: 94, activeCriticalBreaches: 1 } // penalty 3.5
  ];

  // Average = 96, penalty = 3.5 => 92.5
  const index = calculateOverallSafetyIndex(zoneScores);
  assert.equal(index, 92.5);
});

test('classifyEventSeverity flags critical and stop-work events appropriately', () => {
  const harness = classifyEventSeverity('missing_harness');
  assert.equal(harness.severity, 'critical');
  assert.equal(harness.requiresEmergencyStop, false);

  const proximity = classifyEventSeverity('machinery_proximity');
  assert.equal(proximity.severity, 'critical');
  assert.equal(proximity.requiresEmergencyStop, true);

  const vest = classifyEventSeverity('missing_vest');
  assert.equal(vest.severity, 'warning');
  assert.equal(vest.requiresEmergencyStop, false);
});

test('evaluateContractorSafetyGrade correctly maps thresholds', () => {
  assert.equal(evaluateContractorSafetyGrade(99.1).grade, 'A+');
  assert.equal(evaluateContractorSafetyGrade(96.0).grade, 'A');
  assert.equal(evaluateContractorSafetyGrade(92.4).grade, 'B');
  assert.equal(evaluateContractorSafetyGrade(87.0).grade, 'C');
  assert.equal(evaluateContractorSafetyGrade(78.5).grade, 'PROBATION');
});

test('formatSafeManHours formats large numbers with commas', () => {
  assert.equal(formatSafeManHours(148290), '148,290');
  assert.equal(formatSafeManHours(0), '0');
});
