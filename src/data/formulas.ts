import { ChapterMeta, Formula } from '../types/physics';
import { MASTER_MAP_FORMULAS } from './chapters/masterMap';
import { LINE_ARC_RING_FORMULAS } from './chapters/lineArcRing';
import { ELECTROSTATICS_FORMULAS } from './chapters/electrostatics';
import { CURRENT_FORMULAS } from './chapters/current';
import { MAGNETISM_FORMULAS } from './chapters/magnetism';
import { EMI_FORMULAS } from './chapters/emi';
import { AC_FORMULAS } from './chapters/ac';
import { EM_WAVES_FORMULAS } from './chapters/emWaves';
import { MODERN_PHYSICS_FORMULAS } from './chapters/modernPhysics';
import { SEMICONDUCTORS_FORMULAS } from './chapters/semiconductors';
import { RAY_OPTICS_FORMULAS } from './chapters/rayOptics';
import { WAVE_OPTICS_FORMULAS } from './chapters/waveOptics';
import { EXPERIMENTAL_SKILLS_FORMULAS } from './chapters/experimentalSkills';
import { CLASS_11_PHYSICS_FORMULAS } from './chapters/class11Physics';

export const CONSTANTS = [
  { symbol: 'k = \\frac{1}{4\\pi\\varepsilon_0}', value: '9 \\times 10^9\\text{ N}\\cdot\\text{m}^2/\\text{C}^2' },
  { symbol: "k' = \\frac{\\mu_0}{4\\pi}", value: '10^{-7}\\text{ T}\\cdot\\text{m/A}' },
  { symbol: '\\varepsilon_0', value: '8.85 \\times 10^{-12}\\text{ C}^2/\\text{N}\\cdot\\text{m}^2' },
  { symbol: '\\mu_0', value: '4\\pi \\times 10^{-7}\\text{ T}\\cdot\\text{m/A}' },
  { symbol: 'c', value: '3 \\times 10^8\\text{ m/s}' },
  { symbol: 'e', value: '1.6 \\times 10^{-19}\\text{ C}' },
  { symbol: 'h', value: '6.626 \\times 10^{-34}\\text{ J}\\cdot\\text{s}' },
  { symbol: 'hc', value: '1240\\text{ eV}\\cdot\\text{nm}' },
  { symbol: 'R_\\infty', value: '1.097 \\times 10^7\\text{ m}^{-1}' },
];

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'master-map',
    order: 0,
    title: '0. Master Map',
    shortTitle: 'Master Map',
    subtitle: 'Cross-chapter analogies, integration chains & circuit limit rules',
    accentColor: '#22d3ee',
  },
  {
    id: 'line-arc-ring',
    order: 1,
    title: '1. Line / Arc / Ring / Disc',
    shortTitle: 'Line · Arc · Ring',
    subtitle: 'Master Setup 1: E, V & B unified by geometry',
    accentColor: '#38bdf8',
  },
  {
    id: 'electrostatics',
    order: 2,
    title: '2. Electrostatics',
    shortTitle: 'Electrostatics',
    subtitle: 'Coulomb, Gauss law, dipoles & capacitor networks',
    accentColor: '#818cf8',
  },
  {
    id: 'current',
    order: 3,
    title: '3. Current Electricity & RC',
    shortTitle: 'Current & RC',
    subtitle: 'Drift, Kirchhoff, cells, bridges, meters & RC transients',
    accentColor: '#a855f7',
  },
  {
    id: 'magnetism',
    order: 4,
    title: '4. Magnetism & Moving Charges',
    shortTitle: 'Magnetism',
    subtitle: 'Biot–Savart, Ampere, Lorentz force, dipoles & materials',
    accentColor: '#c084fc',
  },
  {
    id: 'emi',
    order: 5,
    title: '5. EMI & Inductance',
    shortTitle: 'EMI & L',
    subtitle: 'Faraday–Lenz, motional EMF, inductance, LR & LC',
    accentColor: '#2dd4bf',
  },
  {
    id: 'ac',
    order: 6,
    title: '6. Alternating Current',
    shortTitle: 'AC & RLC',
    subtitle: 'Series RLC master circuit, resonance, Q-factor & transformer',
    accentColor: '#06b6d4',
  },
  {
    id: 'em-waves',
    order: 7,
    title: '7. EM Waves',
    shortTitle: 'EM Waves',
    subtitle: 'Displacement current, Maxwell wave eq, intensity & spectrum',
    accentColor: '#f472b6',
  },
  {
    id: 'modern-physics',
    order: 8,
    title: '8. Modern Physics',
    shortTitle: 'Modern Physics',
    subtitle: 'Photoelectric, de-Broglie, Rutherford, Bohr atom & nuclear Q-value',
    accentColor: '#38bdf8',
  },
  {
    id: 'semiconductors',
    order: 9,
    title: '9. Semiconductors & Logic Gates',
    shortTitle: 'Semiconductors',
    subtitle: 'Mass action, mobility, special diodes, Zener, rectifiers & Boolean gates',
    accentColor: '#34d399',
  },
  {
    id: 'ray-optics',
    order: 10,
    title: '10. Ray Optics & Instruments',
    shortTitle: 'Ray Optics',
    subtitle: 'Mirrors, refraction/TIR, Lens Maker, dispersion, prisms & microscopes',
    accentColor: '#fbbf24',
  },
  {
    id: 'wave-optics',
    order: 11,
    title: '11. Wave Optics',
    shortTitle: 'Wave Optics',
    subtitle: 'Huygens, YDSE, optical path shift, single-slit diffraction, resolving power & polarization',
    accentColor: '#fb7185',
  },
  {
    id: 'experimental-skills',
    order: 12,
    title: '12. Class 12 Experimental Skills (Unit 20)',
    shortTitle: 'Unit 20 · Labs',
    subtitle: 'u–v & displacement method, travelling microscope, metre bridge, half-deflection & diode I–V',
    accentColor: '#f59e0b',
  },
  {
    id: 'c11-units-and-measurement',
    order: 13,
    title: '13. Units and Measurement',
    shortTitle: '02 · Units',
    subtitle: 'Dimensions of constants, SI base units, error propagation & screw gauge/vernier',
    accentColor: '#38bdf8',
  },
  {
    id: 'c11-motion-in-a-straight-line',
    order: 14,
    title: '14. Motion in a Straight Line',
    shortTitle: '03 · 1D Motion',
    subtitle: 'Calculus derivatives, uniform acceleration, graphs & Galileo odd numbers ratio',
    accentColor: '#818cf8',
  },
  {
    id: 'c11-motion-in-a-plane',
    order: 15,
    title: '15. Motion in a Plane',
    shortTitle: '04 · 2D Motion',
    subtitle: 'Dot/cross products, projectile range relations & river-man relative velocity',
    accentColor: '#c084fc',
  },
  {
    id: 'c11-laws-of-motion',
    order: 16,
    title: '16. Laws of Motion',
    shortTitle: '05 · NLOM',
    subtitle: "Newton's laws, pseudo force, friction, banking of roads & vertical circle slack limit",
    accentColor: '#2dd4bf',
  },
  {
    id: 'c11-work-energy-and-power',
    order: 17,
    title: '17. Work, Energy and Power',
    shortTitle: '06 · Work/Energy',
    subtitle: 'Work-energy theorem, potential energy wells, power & restitution in collisions',
    accentColor: '#34d399',
  },
  {
    id: 'c11-system-of-particles-and-rotational-motion',
    order: 18,
    title: '18. System of Particles & Rotational Motion',
    shortTitle: '07 · Rotation',
    subtitle: 'Centre of mass, parallel/perpendicular axes, torque Γ = Iα & incline pure rolling',
    accentColor: '#fbbf24',
  },
  {
    id: 'c11-gravitation',
    order: 19,
    title: '19. Gravitation',
    shortTitle: '08 · Gravitation',
    subtitle: 'Gravitational PE, variation of g, ring field maximum at a/√2 & escape velocity',
    accentColor: '#f472b6',
  },
  {
    id: 'c11-mechanical-properties-of-solids',
    order: 20,
    title: '20. Mechanical Properties of Solids',
    shortTitle: '09 · Solids',
    subtitle: "Hooke's law, Young's modulus, wire own weight elongation & elastic energy density",
    accentColor: '#a78bfa',
  },
  {
    id: 'c11-mechanical-properties-of-fluids',
    order: 21,
    title: '21. Mechanical Properties of Fluids',
    shortTitle: '10 · Fluids',
    subtitle: "Pascal's law, continuity, Bernoulli, Torricelli efflux, Stokes drag & surface tension",
    accentColor: '#38bdf8',
  },
  {
    id: 'c11-thermal-properties-of-matter',
    order: 22,
    title: '22. Thermal Properties of Matter',
    shortTitle: '11 · Thermal',
    subtitle: 'Thermal expansion, calorimetry, series conduction, radiation & Newton cooling',
    accentColor: '#fb923c',
  },
  {
    id: 'c11-thermodynamics',
    order: 23,
    title: '23. Thermodynamics',
    shortTitle: '12 · Thermo',
    subtitle: 'First law, isobaric 7:5:2 partition, adiabatic work & Carnot efficiency',
    accentColor: '#facc15',
  },
  {
    id: 'c11-kinetic-theory',
    order: 24,
    title: '24. Kinetic Theory of Gases',
    shortTitle: '13 · KTG',
    subtitle: "Kinetic pressure, RMS speed, Graham's law v ∝ 1/√ρ & mean free path",
    accentColor: '#4ade80',
  },
  {
    id: 'c11-oscillations',
    order: 25,
    title: '25. Oscillations',
    shortTitle: '14 · Oscillations',
    subtitle: 'SHM kinematics, mass-spring, K = U at x = A/√2, pendulums & resonance',
    accentColor: '#f43f5e',
  },
  {
    id: 'c11-waves',
    order: 26,
    title: '26. Waves',
    shortTitle: '15 · Waves',
    subtitle: 'Wave equation, speed on string, organ pipe harmonics & sonometer in water',
    accentColor: '#06b6d4',
  },
];

export const FORMULAS: Formula[] = [
  ...MASTER_MAP_FORMULAS,
  ...LINE_ARC_RING_FORMULAS,
  ...ELECTROSTATICS_FORMULAS,
  ...CURRENT_FORMULAS,
  ...MAGNETISM_FORMULAS,
  ...EMI_FORMULAS,
  ...AC_FORMULAS,
  ...EM_WAVES_FORMULAS,
  ...MODERN_PHYSICS_FORMULAS,
  ...SEMICONDUCTORS_FORMULAS,
  ...RAY_OPTICS_FORMULAS,
  ...WAVE_OPTICS_FORMULAS,
  ...EXPERIMENTAL_SKILLS_FORMULAS,
  ...CLASS_11_PHYSICS_FORMULAS,
];

export const FORMULA_MAP: Record<string, Formula> = Object.fromEntries(
  FORMULAS.map((f) => [f.id, f])
);

export function getFormulaById(id: string): Formula | undefined {
  return FORMULA_MAP[id];
}

export function getFormulasByChapter(chapterId: string): Formula[] {
  return FORMULAS.filter((f) => f.chapter === chapterId);
}
