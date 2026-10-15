import React, { useState, useEffect } from 'react';
import type { SavedExperiment } from '../../lib/experiments';
import {
  getSavedExperiments,
  deleteExperiment,
  exportExperimentsJson,
  importExperimentsJson,
} from '../../lib/experiments';
import { Bookmark, Download, Upload, Trash2, Play, X } from 'lucide-react';

interface SavedExperimentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadExperiment: (exp: SavedExperiment) => void;
}

export const SavedExperimentsModal: React.FC<SavedExperimentsModalProps> = ({
  isOpen,
  onClose,
  onLoadExperiment,
}) => {
  const [experiments, setExperiments] = useState<SavedExperiment[]>([]);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const refreshList = () => {
    setExperiments(getSavedExperiments());
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
      setImportStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    deleteExperiment(id);
    refreshList();
  };

  const handleExport = () => {
    const json = exportExperimentsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algo-nexus-experiments-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importExperimentsJson(content);
      if (success) {
        setImportStatus('Experiments successfully imported.');
        refreshList();
      } else {
        setImportStatus('Failed to parse experiment JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-md max-w-2xl w-full p-4 flex flex-col gap-3 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-slate-200">
            <Bookmark className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-sm uppercase tracking-wider">
              Saved Experiments & Profiles
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1"
            title="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar: Export / Import */}
        <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded-sm border border-slate-800 text-xs">
          <span className="text-slate-400 font-mono">
            {experiments.length} Saved Experiment{experiments.length === 1 ? '' : 's'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={experiments.length === 0}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-sm font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <label className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm font-medium cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {importStatus && (
          <div className="text-xs font-mono text-sky-400 bg-sky-950/50 p-2 rounded-sm border border-sky-800">
            {importStatus}
          </div>
        )}

        {/* List of experiments */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
          {experiments.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-mono text-xs">
              No saved experiments found. Save current setups from within the modules to recall them later.
            </div>
          ) : (
            experiments.map((exp) => (
              <div
                key={exp.id}
                className="p-3 bg-slate-950 border border-slate-800 rounded-sm flex items-start justify-between gap-3 hover:border-slate-700 transition-colors text-xs"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200 text-sm">{exp.title}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded-xs text-sky-400">
                      {exp.module}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {exp.algorithm}
                    </span>
                  </div>
                  {exp.notes && <p className="text-slate-400 text-[11px]">{exp.notes}</p>}
                  <span className="text-[10px] text-slate-500 block font-mono">
                    Saved: {new Date(exp.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onLoadExperiment(exp);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-sm transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>LOAD</span>
                  </button>

                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete saved experiment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-sm text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
