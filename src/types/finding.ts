/**
 * Finding (vulnerability) related types
 */

import { ScanType } from './scan';

export interface Finding {
  id: string;
  scanId: string;
  scanType: ScanType;
  severity: Severity;
  title: string;
  description: string;
  filePath?: string;
  lineNumber?: number;
  codeSnippet?: string;
  cveId?: string;
  cweId?: string;
  references?: string[];
  createdAt: string;
}

export enum Severity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

export interface FindingFilters {
  scanType?: ScanType;
  severity?: Severity;
  search?: string;
}

export interface FindingStats {
  total: number;
  bySeverity: Record<Severity, number>;
  byScanType: Record<ScanType, number>;
}

export interface FindingExport {
  format: 'json' | 'csv' | 'pdf';
  findings: Finding[];
}