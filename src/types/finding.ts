/**
 * Finding (vulnerability) related types
 */

import { ScanType } from './scan';

export interface Finding {
  id: string;
  scan_id: string;
  scan_type: ScanType;
  severity: Severity;
  title: string;
  description: string;
  file_path?: string;
  line_number?: number;
  code_snippet?: string;
  cve_id?: string;
  cwe_id?: string;
  references?: string[];
  created_at: string;
}

export enum Severity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFO = 'INFO',
}

export interface FindingFilters {
  scan_type?: ScanType;
  severity?: Severity;
  search?: string;
}

export interface FindingStats {
  total: number;
  by_severity: Record<Severity, number>;
  by_scan_type: Record<ScanType, number>;
}

export interface FindingExport {
  format: 'json' | 'csv' | 'pdf';
  findings: Finding[];
}