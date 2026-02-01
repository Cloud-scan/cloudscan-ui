/**
 * Finding detail modal component
 */

import React from 'react';
import { Modal } from '../common';
import { SeverityIcon } from './SeverityIcon';
import { ScanTypeLabel } from '../scans';
import { Finding } from '../../types';

export interface FindingDetailModalProps {
  finding: Finding | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FindingDetailModal: React.FC<FindingDetailModalProps> = ({
  finding,
  isOpen,
  onClose,
}) => {
  if (!finding) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title="Finding Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {finding.title}
            </h2>
            <div className="flex items-center gap-3">
              <SeverityIcon severity={finding.severity} showLabel />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                <ScanTypeLabel type={finding.scan_type} />
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </h3>
          <p className="text-sm text-gray-900 dark:text-white">{finding.description}</p>
        </div>

        {/* Location */}
        {finding.file_path && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm font-mono text-gray-900 dark:text-white">
                {finding.file_path}
                {finding.line_number && ` : line ${finding.line_number}`}
              </p>
            </div>
          </div>
        )}

        {/* Code Snippet */}
        {finding.code_snippet && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Code Snippet
            </h3>
            <pre className="bg-gray-900 dark:bg-black rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-green-400 font-mono">{finding.code_snippet}</code>
            </pre>
          </div>
        )}

        {/* CVE/CWE IDs */}
        {(finding.cve_id || finding.cwe_id) && (
          <div className="grid grid-cols-2 gap-4">
            {finding.cve_id && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CVE ID
                </h3>
                <a
                  href={`https://nvd.nist.gov/vuln/detail/${finding.cve_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-mono"
                >
                  {finding.cve_id}
                </a>
              </div>
            )}
            {finding.cwe_id && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CWE ID
                </h3>
                <a
                  href={`https://cwe.mitre.org/data/definitions/${finding.cwe_id.replace('CWE-', '')}.html`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-mono"
                >
                  {finding.cwe_id}
                </a>
              </div>
            )}
          </div>
        )}

        {/* References */}
        {finding.references && finding.references.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              References
            </h3>
            <ul className="space-y-1">
              {finding.references.map((ref, index) => (
                <li key={index}>
                  <a
                    href={ref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {ref}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};