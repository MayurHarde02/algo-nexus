export interface SavedExperiment {
  id: string;
  title: string;
  createdAt: string;
  module: 'sorting' | 'pathfinding' | 'scheduling' | 'graph';
  algorithm: string;
  config: Record<string, any>;
  notes?: string;
}

const STORAGE_KEY = 'algo_nexus_saved_experiments';

export function getSavedExperiments(): SavedExperiment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedExperiment[];
  } catch (err) {
    console.error('Failed to load saved experiments from localStorage:', err);
    return [];
  }
}

export function saveExperiment(
  exp: Omit<SavedExperiment, 'id' | 'createdAt'>
): SavedExperiment {
  const current = getSavedExperiments();
  const newExp: SavedExperiment = {
    ...exp,
    id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newExp, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save experiment to localStorage:', err);
  }
  return newExp;
}

export function deleteExperiment(id: string): void {
  const current = getSavedExperiments();
  const updated = current.filter((e) => e.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete experiment from localStorage:', err);
  }
}

export function exportExperimentsJson(): string {
  const list = getSavedExperiments();
  return JSON.stringify(list, null, 2);
}

export function importExperimentsJson(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) return false;

    // Validate structure
    for (const item of parsed) {
      if (!item.id || !item.title || !item.module) return false;
    }

    const current = getSavedExperiments();
    // Merge without duplicates by id
    const existingIds = new Set(current.map((e) => e.id));
    const merged = [...current];
    for (const item of parsed) {
      if (!existingIds.has(item.id)) {
        merged.push(item);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return true;
  } catch (err) {
    console.error('Failed to import experiments:', err);
    return false;
  }
}
