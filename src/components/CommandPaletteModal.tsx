import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Atom,
  BookMarked,
  BookOpen,
  FlaskConical,
  Network,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { CONSTANTS, FORMULAS } from '../data/formulas';
import { CLASS_11_CHAPTERS } from '../data/class11NotesData';
import { SHORT_NOTES } from '../data/shortNotes';
import { PHYSICS_GLOSSARY } from '../data/glossary';
import { LabId } from '../pages/LabsPage';

export interface CommandPaletteAction {
  type: 'note-c11' | 'note-c12' | 'formula' | 'lab' | 'glossary' | 'constant' | 'about';
  id: string;
  label: string;
  subtitle: string;
  payloadId: string;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToFormula: (formulaId: string) => void;
  onOpenLab: (labId: LabId) => void;
  onOpenNote: (cls: 'class11' | 'class12', chapterId: string) => void;
  onOpenGlossary: () => void;
  onOpenAbout?: () => void;
}

const LAB_ENTRIES: { id: LabId; label: string; subtitle: string }[] = [
  { id: 'lorentz-3d', label: '3D · Lorentz Force & Helical Orbit', subtitle: 'Interactive 3D F = q(v × B) cross-product' },
  { id: 'biot-savart-3d', label: '3D · Biot–Savart & Magnetic Dipole', subtitle: 'Interactive 3D loop, solenoid & field probe' },
  { id: 'bohr-orbitals-3d', label: '3D · Bohr Orbitals & Standing Waves', subtitle: 'Interactive 3D 2πr = nλ + transitions' },
  { id: 'arc-wire', label: 'Lab 1 · Arc / Wire Geometry Morph', subtitle: 'Unified E, V, B from line, arc & ring' },
  { id: 'rlc', label: 'Lab 2 · Master RLC (AC)', subtitle: 'Phasor diagram & resonance curves' },
  { id: 'rc-dc', label: 'Lab 3 · RC / LR / LC (DC)', subtitle: 'Transient growth/decay & energy split' },
  { id: 'capacitor', label: 'Lab 4 · Capacitor Dielectric', subtitle: 'Battery connected vs disconnected' },
  { id: 'magnetism', label: 'Lab 5 · Magnetism', subtitle: 'Orbit radius, wire force & loop torque' },
  { id: 'cavity', label: 'Lab 6 · Cavity Superposition', subtitle: 'Spherical & cylindrical cavities' },
  { id: 'modern', label: 'Lab 7 · Photoelectric & Bohr', subtitle: 'Stopping potential & de Broglie' },
  { id: 'semiconductor', label: 'Lab 8 · Semi, Diodes & Gates', subtitle: 'I–V curve, Zener & logic gates' },
  { id: 'ray-optics', label: 'Lab 9 · Ray Optics & Prism', subtitle: 'Lens/mirror, immersion & TIR curve' },
  { id: 'wave-optics', label: 'Lab 10 · YDSE & Polarization', subtitle: 'YDSE, single slit & Malus law' },
];

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onJumpToFormula,
  onOpenLab,
  onOpenNote,
  onOpenGlossary,
  onOpenAbout,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIdx(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isOpen]);

  const allItems = useMemo<CommandPaletteAction[]>(() => {
    const items: CommandPaletteAction[] = [
      {
        type: 'about',
        id: 'about-philosophy',
        label: 'About & App Philosophy',
        subtitle: "The Vision & Story behind India's #1 JEE Physics Revision Web · by Kushal",
        payloadId: 'about',
      },
    ];

    for (const c11 of CLASS_11_CHAPTERS) {
      items.push({
        type: 'note-c11',
        id: `c11-${c11.id}`,
        label: `${c11.prefix}. ${c11.title}`,
        subtitle: `Class 11 Short Notes · Ch ${c11.number} · ${c11.weightage}`,
        payloadId: c11.id,
      });
    }

    for (const c12 of SHORT_NOTES) {
      items.push({
        type: 'note-c12',
        id: `c12-${c12.id}`,
        label: `Ch ${c12.number}. ${c12.title}`,
        subtitle: `Class 12 Short Notes · ${c12.weightage}`,
        payloadId: c12.id,
      });
    }

    for (const lab of LAB_ENTRIES) {
      items.push({
        type: 'lab',
        id: `lab-${lab.id}`,
        label: lab.label,
        subtitle: `Interactive Simulator · ${lab.subtitle}`,
        payloadId: lab.id,
      });
    }

    for (const f of FORMULAS) {
      items.push({
        type: 'formula',
        id: `f-${f.id}`,
        label: f.title,
        subtitle: `Formula · ${f.subtopic} (${f.chapter})`,
        payloadId: f.id,
      });
    }

    for (const g of PHYSICS_GLOSSARY) {
      items.push({
        type: 'glossary',
        id: `g-${g.id}`,
        label: g.term,
        subtitle: `Glossary · ${g.unitLabel}${g.siUnit ? ` · ${g.siUnit}` : ''}`,
        payloadId: g.formulaIds[0] || g.id,
      });
    }

    CONSTANTS.forEach((c, idx) => {
      items.push({
        type: 'constant',
        id: `const-${idx}`,
        label: c.symbol.replace(/\\/g, ''),
        subtitle: `Physical Constant · ${c.value.replace(/\\/g, '')}`,
        payloadId: 'c11-units-dimensions-constants',
      });
    });

    return items;
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Show curated highlights when empty: 3D labs + high yield chapters
      return allItems.slice(0, 14);
    }
    const tokens = q.split(/\s+/).filter(Boolean);
    return allItems
      .filter((item) => {
        const hay = `${item.label} ${item.subtitle}`.toLowerCase();
        return tokens.every((t) => hay.includes(t));
      })
      .slice(0, 24);
  }, [allItems, query]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const executeItem = (item: CommandPaletteAction) => {
    if (item.type === 'note-c11') {
      onOpenNote('class11', item.payloadId);
    } else if (item.type === 'note-c12') {
      onOpenNote('class12', item.payloadId);
    } else if (item.type === 'lab') {
      onOpenLab(item.payloadId as LabId);
    } else if (item.type === 'formula' || item.type === 'constant') {
      onJumpToFormula(item.payloadId);
    } else if (item.type === 'glossary') {
      onOpenGlossary();
    } else if (item.type === 'about') {
      onOpenAbout?.();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 flex items-start justify-center pt-14 sm:pt-20 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
          <Search className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onClose();
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIdx((i) => Math.min(results.length - 1, i + 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIdx((i) => Math.max(0, i - 1));
              } else if (e.key === 'Enter' && results[selectedIdx]) {
                e.preventDefault();
                executeItem(results[selectedIdx]);
              }
            }}
            placeholder="Jump to any of 29 Chapters, Formulas, 13 Labs, Constants, or Glossary..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No matching chapters, formulas, labs, or glossary terms found.
            </div>
          ) : (
            results.map((item, idx) => {
              const active = idx === selectedIdx;
              const Icon =
                item.type === 'lab'
                  ? FlaskConical
                  : item.type === 'formula'
                  ? Network
                  : item.type === 'glossary'
                  ? BookMarked
                  : item.type === 'constant'
                  ? Atom
                  : item.type === 'note-c12'
                  ? Sparkles
                  : BookOpen;

              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setSelectedIdx(idx)}
                  onClick={() => executeItem(item)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-left flex items-center gap-3 transition-colors ${
                    active ? 'bg-cyan-500/20 border border-cyan-500/40' : 'border border-transparent hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className="h-4 w-4 text-cyan-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-white truncate">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{item.subtitle}</div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                    {item.type.replace('note-', '')}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
          <span>↑↓ Navigate · Enter to jump · Esc to close</span>
          <span className="font-mono">Ctrl+K / ⌘K</span>
        </div>
      </div>
    </div>
  );
};
