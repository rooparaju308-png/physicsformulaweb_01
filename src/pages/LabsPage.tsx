import React, { useState } from 'react';
import { ArcWireLab } from '../components/labs/ArcWireLab';
import { RlcAcLab } from '../components/labs/RlcAcLab';
import { RcDcLab } from '../components/labs/RcDcLab';
import { CapacitorLab } from '../components/labs/CapacitorLab';
import { MagnetismLab } from '../components/labs/MagnetismLab';
import { CavityLab } from '../components/labs/CavityLab';
import { ModernPhysicsLab } from '../components/labs/ModernPhysicsLab';
import { SemiconductorLab } from '../components/labs/SemiconductorLab';
import { RayOpticsLab } from '../components/labs/RayOpticsLab';
import { WaveOpticsLab } from '../components/labs/WaveOpticsLab';
import { Physics3DLabs } from '../components/labs/Physics3DLabs';
import { MistakeErrorType, MistakeSource } from '../types/physics';

export type LabId =
  | 'arc-wire'
  | 'rlc'
  | 'rc-dc'
  | 'capacitor'
  | 'magnetism'
  | 'cavity'
  | 'modern'
  | 'semiconductor'
  | 'ray-optics'
  | 'wave-optics'
  | 'lorentz-3d'
  | 'biot-savart-3d'
  | 'bohr-orbitals-3d';

interface LabsPageProps {
  activeLab: LabId;
  onSelectLab: (lab: LabId) => void;
  knownIds: string[];
  bookmarkedIds: string[];
  onToggleKnown: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onJumpToFormula: (id: string) => void;
  onFlagMistake?: (entry: {
    source: MistakeSource;
    chapter: string;
    title: string;
    prompt: string;
    formulaId?: string;
    errorType?: MistakeErrorType;
    explanation?: string;
  }) => void;
}

const LAB_TABS: {
  id: LabId;
  label: string;
  subtitle: string;
  group: 'em' | 'optics-modern' | '3d';
}[] = [
  { id: 'lorentz-3d', label: '3D · Lorentz Force', subtitle: 'Interactive 3D F = q(v × B) cross-product & helical orbit', group: '3d' },
  { id: 'biot-savart-3d', label: '3D · Biot–Savart & Dipole', subtitle: 'Interactive 3D loop, solenoid & magnetic field probe', group: '3d' },
  { id: 'bohr-orbitals-3d', label: '3D · Bohr Orbitals', subtitle: 'Interactive 3D de Broglie standing waves (2πr = nλ) & transitions', group: '3d' },
  { id: 'arc-wire', label: '1. Arc / Wire', subtitle: 'Unified E, V, B geometry morphing', group: 'em' },
  { id: 'rlc', label: '2. Master RLC (AC)', subtitle: 'Phasor, resonance & L=0/C=∞/R=0 switches', group: 'em' },
  { id: 'rc-dc', label: '3. RC / LR / LC (DC)', subtitle: 'Universal X(t) transient & energy split', group: 'em' },
  { id: 'capacitor', label: '4. Capacitor Dielectric', subtitle: 'Battery connected vs disconnected', group: 'em' },
  { id: 'magnetism', label: '5. Magnetism', subtitle: 'Circle/helix orbit, wire force, loop torque', group: 'em' },
  { id: 'cavity', label: '6. Cavity Superposition', subtitle: 'Uniform E & B inside spherical/cylindrical cavities', group: 'em' },
  { id: 'modern', label: '7. Photoelectric & Bohr', subtitle: 'Stopping potential V₀, I–V curves, Bohr transitions & de-Broglie', group: 'optics-modern' },
  { id: 'semiconductor', label: '8. Semi, Diodes & Gates', subtitle: '4-quadrant diode I–V, Zener regulator & universal logic gates', group: 'optics-modern' },
  { id: 'ray-optics', label: '9. Ray Optics & Prism', subtitle: 'Thin lens/mirror rays, immersion flip & prism δ(i) TIR curve', group: 'optics-modern' },
  { id: 'wave-optics', label: '10. YDSE & Polarization', subtitle: 'YDSE vs single-slit diffraction, sheet shift & Malus/Brewster', group: 'optics-modern' },
];

export const LabsPage: React.FC<LabsPageProps> = ({
  activeLab,
  onSelectLab,
  knownIds,
  bookmarkedIds,
  onToggleKnown,
  onToggleBookmark,
  onJumpToFormula,
  onFlagMistake,
}) => {
  const [groupFilter, setGroupFilter] = useState<'all' | '3d' | 'em' | 'optics-modern'>('all');
  const currentMeta = LAB_TABS.find((t) => t.id === activeLab) ?? LAB_TABS[0];

  const visibleTabs =
    groupFilter === 'all'
      ? LAB_TABS
      : LAB_TABS.filter((t) => t.group === groupFilter || t.id === activeLab);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Interactive Physics Simulations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {currentMeta.subtitle}
          </p>
        </div>

        <div className="inline-flex flex-wrap rounded-xl studio-surface-subtle border p-1 gap-1 self-start sm:self-auto">
          {(
            [
              { id: 'all', label: 'All (13)' },
              { id: '3d', label: '3D Interactive (3)' },
              { id: 'em', label: 'EM (6)' },
              { id: 'optics-modern', label: 'Modern & Optics (4)' },
            ] as const
          ).map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroupFilter(g.id)}
              className={`min-h-[34px] px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                groupFilter === g.id
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulation Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectLab(tab.id)}
            className={`min-h-[44px] px-4 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors ${
              activeLab === tab.id
                ? tab.group === '3d'
                  ? 'border-violet-400 bg-violet-500/15 text-violet-700 dark:text-violet-200'
                  : 'border-cyan-400 bg-cyan-500/15 text-cyan-700 dark:text-cyan-200'
                : 'studio-surface-subtle text-slate-600 dark:text-slate-300 hover:border-cyan-500/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(activeLab === 'lorentz-3d' || activeLab === 'biot-savart-3d' || activeLab === 'bohr-orbitals-3d') && (
        <Physics3DLabs
          labId={activeLab}
          knownIds={knownIds}
          bookmarkedIds={bookmarkedIds}
          onToggleKnown={onToggleKnown}
          onToggleBookmark={onToggleBookmark}
          onJumpToFormula={onJumpToFormula}
          onFlagMistake={onFlagMistake}
        />
      )}

      {activeLab === 'arc-wire' && (
        <ArcWireLab
          knownIds={knownIds}
          bookmarkedIds={bookmarkedIds}
          onToggleKnown={onToggleKnown}
          onToggleBookmark={onToggleBookmark}
          onJumpToFormula={onJumpToFormula}
        />
      )}
      {activeLab === 'rlc' && (
        <RlcAcLab
          knownIds={knownIds}
          bookmarkedIds={bookmarkedIds}
          onToggleKnown={onToggleKnown}
          onToggleBookmark={onToggleBookmark}
          onJumpToFormula={onJumpToFormula}
        />
      )}
      {activeLab === 'rc-dc' && (
        <RcDcLab
          knownIds={knownIds}
          bookmarkedIds={bookmarkedIds}
          onToggleKnown={onToggleKnown}
          onToggleBookmark={onToggleBookmark}
          onJumpToFormula={onJumpToFormula}
        />
      )}
      {activeLab === 'capacitor' && (
        <CapacitorLab
          knownIds={knownIds}
          bookmarkedIds={bookmarkedIds}
          onToggleKnown={onToggleKnown}
          onToggleBookmark={onToggleBookmark}
          onJumpToFormula={onJumpToFormula}
        />
      )}
      {activeLab === 'magnetism' && (
        <MagnetismLab
          knownIds={knownIds}
          bookmarkedIds={bookmarkedIds}
          onToggleKnown={onToggleKnown}
          onToggleBookmark={onToggleBookmark}
          onJumpToFormula={onJumpToFormula}
        />
      )}
      {activeLab === 'cavity' && (
        <CavityLab
          knownIds={knownIds}
          bookmarkedIds={bookmarkedIds}
          onToggleKnown={onToggleKnown}
          onToggleBookmark={onToggleBookmark}
          onJumpToFormula={onJumpToFormula}
        />
      )}
      {activeLab === 'modern' && (
        <ModernPhysicsLab
          knownIds={knownIds}
          bookmarkedIds={bookmarkedIds}
          onToggleKnown={onToggleKnown}
          onToggleBookmark={onToggleBookmark}
          onJumpToFormula={onJumpToFormula}
        />
      )}
      {activeLab === 'semiconductor' && (
        <SemiconductorLab
          knownIds={knownIds}
          bookmarkedIds={bookmarkedIds}
          onToggleKnown={onToggleKnown}
          onToggleBookmark={onToggleBookmark}
          onJumpToFormula={onJumpToFormula}
        />
      )}
      {activeLab === 'ray-optics' && (
        <RayOpticsLab
          knownIds={knownIds}
          bookmarkedIds={bookmarkedIds}
          onToggleKnown={onToggleKnown}
          onToggleBookmark={onToggleBookmark}
          onJumpToFormula={onJumpToFormula}
        />
      )}
      {activeLab === 'wave-optics' && (
        <WaveOpticsLab
          knownIds={knownIds}
          bookmarkedIds={bookmarkedIds}
          onToggleKnown={onToggleKnown}
          onToggleBookmark={onToggleBookmark}
          onJumpToFormula={onJumpToFormula}
        />
      )}
    </div>
  );
};
