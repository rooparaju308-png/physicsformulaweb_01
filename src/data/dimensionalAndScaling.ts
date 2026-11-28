export interface DimensionalDrill {
  id: string;
  topic: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  dimensionBreakdown: string;
  explanation: string;
  formulaId: string;
}

export interface ScalingParam {
  id: string;
  symbol: string;
  label: string;
  power: number; // output scales as param^power (when simple power law)
  minMult: number;
  maxMult: number;
  step: number;
  defaultMult: number;
}

export interface ScalingPreset {
  id: string;
  title: string;
  chapter: string;
  formulaLatex: string;
  outputSymbol: string;
  description: string;
  formulaId: string;
  params: ScalingParam[];
  /** Optional custom ratio function when non-power-law (e.g., Carnot or series/parallel) */
  customRatio?: (vals: Record<string, number>) => number;
  jeeTip: string;
}

export const DIMENSIONAL_DRILLS: DimensionalDrill[] = [
  {
    id: 'dim-stokes-terminal',
    topic: 'Fluids & Viscosity',
    prompt: 'Which expression for terminal velocity v_T of a sphere (radius r, density ρ) falling in a fluid (density σ, viscosity η) is dimensionally valid?',
    options: [
      'v_T = (2/9) r² (ρ − σ) g / η',
      'v_T = (2/9) r (ρ − σ) g / η',
      'v_T = (2/9) r² (ρ − σ) η / g',
      'v_T = (2/9) r² g / [η (ρ − σ)]',
    ],
    correctIndex: 0,
    dimensionBreakdown: '[r²] = L², [(ρ−σ)g] = M L⁻² T⁻², [η] = M L⁻¹ T⁻¹ → L²·(M L⁻² T⁻²)/(M L⁻¹ T⁻¹) = L T⁻¹.',
    explanation: 'Only Option A gives velocity dimensions [LT⁻¹]. Option B leaves [T⁻¹] (r·(ρ−σ)g/η = T⁻¹), Option C yields [M²L⁻¹T⁻³], and Option D yields [L⁵M⁻²T].',
    formulaId: 'c11-fluids-viscosity-surface-tension',
  },
  {
    id: 'dim-stefan-boltzmann',
    topic: 'Thermal Radiation',
    prompt: 'What are the SI dimensions of the Stefan–Boltzmann constant σ in P = σ A e T⁴?',
    options: [
      '[M L⁰ T⁻³ K⁻⁴]',
      '[M L² T⁻³ K⁻⁴]',
      '[M L⁻² T⁻³ K⁻⁴]',
      '[M L⁰ T⁻² K⁻⁴]',
    ],
    correctIndex: 0,
    dimensionBreakdown: '[σ] = [P] / ([A][T⁴]) = (M L² T⁻³) / (L² K⁴) = M L⁰ T⁻³ K⁻⁴.',
    explanation: 'Power P = [ML²T⁻³] divided by area A = [L²] cancels L² completely, leaving [MT⁻³K⁻⁴].',
    formulaId: 'c11-thermal-radiation-laws',
  },
  {
    id: 'dim-planck-length',
    topic: 'Units & Dimensions',
    prompt: 'Using fundamental constants ħ (Planck), G (gravity), and c (speed of light), which combination has the dimensions of length (Planck length l_P)?',
    options: [
      '√(ħ G / c³)',
      '√(ħ G / c⁵)',
      '√(ħ c / G)',
      'ħ G / c²',
    ],
    correctIndex: 0,
    dimensionBreakdown: '[ħG/c³] = (M L² T⁻¹)(M⁻¹ L³ T⁻²) / (L³ T⁻³) = L² → √(ħG/c³) = L.',
    explanation: '√(ħG/c³) gives length l_P, √(ħG/c⁵) gives Planck time t_P, and √(ħc/G) gives Planck mass m_P.',
    formulaId: 'c11-units-dimensions-constants',
  },
  {
    id: 'dim-self-inductance',
    topic: 'EMI & Inductance',
    prompt: 'Which expression gives the dimensions of self-inductance L in terms of M, L, T, and A?',
    options: [
      '[M L² T⁻² A⁻²]',
      '[M L² T⁻³ A⁻²]',
      '[M L² T⁻² A⁻¹]',
      '[M L T⁻² A⁻²]',
    ],
    correctIndex: 0,
    dimensionBreakdown: 'From U = ½ L I² → [L] = [U] / [I²] = (M L² T⁻²) / A² = M L² T⁻² A⁻².',
    explanation: 'Using magnetic energy U = ½LI² is the fastest 3-second check in JEE: Energy [ML²T⁻²] divided by A².',
    formulaId: 'emi-self-inductance',
  },
  {
    id: 'dim-permittivity',
    topic: 'Electrostatics',
    prompt: 'From Coulomb’s law F = q₁q₂ / (4πε₀ r²), identify the dimensions of vacuum permittivity ε₀:',
    options: [
      '[M⁻¹ L⁻³ T⁴ A²]',
      '[M⁻¹ L⁻³ T² A²]',
      '[M L³ T⁻⁴ A⁻²]',
      '[M⁻¹ L⁻² T⁴ A²]',
    ],
    correctIndex: 0,
    dimensionBreakdown: '[ε₀] = [q²]/([F][r²]) = (A² T²) / ((M L T⁻²) L²) = M⁻¹ L⁻³ T⁴ A².',
    explanation: 'Charge q = [AT], so q² = [A²T²]. Dividing by [MLT⁻²]·[L²] gives [M⁻¹L⁻³T⁴A²].',
    formulaId: 'elec-coulomb',
  },
  {
    id: 'dim-mu0-eps0',
    topic: 'EM Waves',
    prompt: 'Which quantity has the exact same dimensions as (μ₀ ε₀)⁻¹/²?',
    options: [
      'E / B (ratio of electric to magnetic field)',
      'B² / (2μ₀) (magnetic energy density)',
      '√(L / C) (characteristic impedance)',
      '1 / (R C) (decay rate)',
    ],
    correctIndex: 0,
    dimensionBreakdown: '[1/√(μ₀ε₀)] = [c] = L T⁻¹; also from velocity selector qE = qvB → [E/B] = [v] = L T⁻¹.',
    explanation: 'Both 1/√(μ₀ε₀) and E/B represent speed [LT⁻¹]. √(L/C) has dimensions of resistance [Ω].',
    formulaId: 'mag-velocity-selector',
  },
  {
    id: 'dim-rc-lc',
    topic: 'Circuits',
    prompt: 'Which triplet of circuit combinations ALL share the dimension of time [T]?',
    options: [
      'RC, L/R, and √(LC)',
      'RC, LR, and √(L/C)',
      'R/C, L/R, and LC',
      'RC, √(L/C), and C/R',
    ],
    correctIndex: 0,
    dimensionBreakdown: '[RC] = T, [L/R] = T, and [√(LC)] = √([RC]·[L/R]) = T.',
    explanation: 'Note that √(L/C) has dimensions of resistance (Ω), whereas √(LC) = 1/ω₀ has dimensions of time [T].',
    formulaId: 'curr-rc-tau-halflife',
  },
  {
    id: 'dim-em-energy-density',
    topic: 'Electrostatics & Magnetism',
    prompt: 'Which combination has the dimensions of energy density (energy per unit volume, [M L⁻¹ T⁻²])?',
    options: [
      'ε₀ E² and B² / μ₀',
      'ε₀ E and B / μ₀',
      'ε₀ E² / c and B² μ₀',
      'E × B / μ₀',
    ],
    correctIndex: 0,
    dimensionBreakdown: '[½ε₀E²] = [B²/(2μ₀)] = Energy / Volume = (M L² T⁻²) / L³ = M L⁻¹ T⁻².',
    explanation: 'Both ½ε₀E² and B²/(2μ₀) represent EM energy density (same dimensions as Pressure & Young’s Modulus!). E×B/μ₀ is Poynting flux (W/m²).',
    formulaId: 'elec-cap-energy',
  },
  {
    id: 'dim-surface-tension',
    topic: 'Fluids & Surface Tension',
    prompt: 'Which pair of physical quantities has identical dimensions?',
    options: [
      'Surface tension & Spring constant',
      'Surface tension & Pressure',
      'Angular momentum & Torque',
      'Viscosity & Thermal conductivity',
    ],
    correctIndex: 0,
    dimensionBreakdown: '[Surface Tension] = [F/l] = M T⁻²; [Spring constant k] = [F/x] = M T⁻².',
    explanation: 'Both surface tension (N/m) and spring constant (N/m) simplify to [M¹ L⁰ T⁻²].',
    formulaId: 'c11-fluids-viscosity-surface-tension',
  },
  {
    id: 'dim-solar-radiation-pressure',
    topic: 'EM Waves',
    prompt: 'If I is wave intensity (W/m²) and c is the speed of light, what are the dimensions of I / c?',
    options: [
      '[M L⁻¹ T⁻²] (Pressure)',
      '[M L⁻² T⁻²] (Force density)',
      '[M L⁰ T⁻³] (Power flux)',
      '[M L² T⁻²] (Energy)',
    ],
    correctIndex: 0,
    dimensionBreakdown: '[I/c] = (M T⁻³) / (L T⁻¹) = M L⁻¹ T⁻² = Force / Area = Pressure.',
    explanation: 'Radiation pressure on a perfectly absorbing surface is P_rad = I / c, confirming [I/c] = Pressure.',
    formulaId: 'mod-photon-energy',
  },
  {
    id: 'dim-solar-rydberg',
    topic: 'Atomic Physics',
    prompt: 'What is the dimensional formula of the Rydberg constant R_∞ in 1/λ = R_∞ (1/n₁² − 1/n₂²)?',
    options: [
      '[L⁻¹]',
      '[L]',
      '[T⁻¹]',
      '[M L² T⁻²]',
    ],
    correctIndex: 0,
    dimensionBreakdown: 'Since (1/n₁² − 1/n₂²) is dimensionless, [R_∞] = [1/λ] = L⁻¹.',
    explanation: 'R_∞ = 1.097 × 10⁷ m⁻¹; only when multiplied by hc does R_∞hc become energy (13.6 eV).',
    formulaId: 'mod-spectral-lines',
  },
  {
    id: 'dim-hall-voltage',
    topic: 'Magnetism',
    prompt: 'Which expression for magnetic dipole potential energy U = −m · B is dimensionally consistent with m = I A?',
    options: [
      '[I A B] = [M L² T⁻²]',
      '[I A / B] = [M L² T⁻²]',
      '[I B / A] = [M L² T⁻²]',
      '[B² A] = [M L² T⁻²]',
    ],
    correctIndex: 0,
    dimensionBreakdown: '[m] = A L², [B] = [F/(Il)] = M T⁻² A⁻¹ → [m·B] = M L² T⁻² (Joules).',
    explanation: 'Ampere-m² × Tesla = Joules ([M L² T⁻²]).',
    formulaId: 'mag-dipole-torque',
  },
];

export const SCALING_SANDBOX_PRESETS: ScalingPreset[] = [
  {
    id: 'scale-wire-stretch',
    title: 'Wire Resistance Under Stretching',
    chapter: 'Current Electricity',
    formulaLatex: 'R = \\rho\\,\\frac{L}{A} = \\rho\\,\\frac{V}{A^2} = \\rho\\,\\frac{L^2}{V}',
    outputSymbol: 'R',
    description: 'Adjust length factor (at constant volume V) or resistivity factor ρ to see how resistance scales.',
    formulaId: 'curr-stretch',
    params: [
      { id: 'rho', symbol: 'ρ', label: 'Resistivity (ρ)', power: 1, minMult: 0.5, maxMult: 3, step: 0.25, defaultMult: 1 },
      { id: 'L', symbol: 'L', label: 'Stretched Length (L, const V)', power: 2, minMult: 0.5, maxMult: 3, step: 0.25, defaultMult: 2 },
    ],
    jeeTip: 'Stretching a wire to nL at constant volume increases resistance by n² (doubling L → +300% R!).',
  },
  {
    id: 'scale-grav-g',
    title: 'Surface Gravity g(M, R) or g(ρ, R)',
    chapter: 'Gravitation',
    formulaLatex: 'g = \\frac{GM}{R^2} = \\frac{4}{3}\\pi G \\rho R',
    outputSymbol: 'g',
    description: 'Check how surface gravity changes when planet mass M and radius R vary independently.',
    formulaId: 'c11-grav-variation-of-g',
    params: [
      { id: 'M', symbol: 'M', label: 'Planet Mass (M)', power: 1, minMult: 0.25, maxMult: 4, step: 0.25, defaultMult: 2 },
      { id: 'R', symbol: 'R', label: 'Planet Radius (R)', power: -2, minMult: 0.5, maxMult: 3, step: 0.25, defaultMult: 2 },
    ],
    jeeTip: 'If M stays constant and R shrinks by 1%, Δg/g ≈ −2(ΔR/R) = +2%. Careful whether M or ρ is held constant!',
  },
  {
    id: 'scale-escape-vel',
    title: 'Escape Velocity (Constant Density)',
    chapter: 'Gravitation',
    formulaLatex: 'v_e = \\sqrt{\\frac{2GM}{R}} = R\\sqrt{\\frac{8}{3}\\pi G\\rho}',
    outputSymbol: 'v_e',
    description: 'Vary mean density ρ and planet radius R to see exact scaling of escape speed.',
    formulaId: 'c11-grav-escape-orbital-kepler',
    params: [
      { id: 'rho', symbol: 'ρ', label: 'Mean Density (ρ)', power: 0.5, minMult: 0.25, maxMult: 4, step: 0.25, defaultMult: 0.5 },
      { id: 'R', symbol: 'R', label: 'Radius (R)', power: 1, minMult: 0.5, maxMult: 3, step: 0.25, defaultMult: 2 },
    ],
    jeeTip: 'At constant density ρ, v_e ∝ R (linear!). At constant mass M, v_e ∝ R⁻¹/².',
  },
  {
    id: 'scale-mag-loop',
    title: 'Magnetic Field at Center of Circular Loop',
    chapter: 'Magnetism',
    formulaLatex: 'B = \\frac{\\mu_0 N I}{2 R}',
    outputSymbol: 'B',
    description: 'Adjust number of turns N, current I, and coil radius R (assuming total wire length fixed or free).',
    formulaId: 'mag-arc-loop-ring',
    params: [
      { id: 'N', symbol: 'N', label: 'Turns (N)', power: 1, minMult: 1, maxMult: 4, step: 0.5, defaultMult: 2 },
      { id: 'I', symbol: 'I', label: 'Current (I)', power: 1, minMult: 0.5, maxMult: 3, step: 0.25, defaultMult: 1 },
      { id: 'R', symbol: 'R', label: 'Loop Radius (R)', power: -1, minMult: 0.5, maxMult: 3, step: 0.25, defaultMult: 0.5 },
    ],
    jeeTip: 'Rewinding a fixed-length wire from 1 turn to N turns shrinks radius R → R/N, so B scales as N²!',
  },
  {
    id: 'scale-cap-energy-constq',
    title: 'Isolated Capacitor Energy (Constant Q)',
    chapter: 'Electrostatics',
    formulaLatex: 'U = \\frac{Q^2}{2C} = \\frac{Q^2 d}{2 \\varepsilon_0 K A}',
    outputSymbol: 'U',
    description: 'Battery disconnected (Q fixed): vary plate separation d, area A, and dielectric constant K.',
    formulaId: 'elec-cap-battery-toggle',
    params: [
      { id: 'd', symbol: 'd', label: 'Plate Separation (d)', power: 1, minMult: 0.5, maxMult: 3, step: 0.25, defaultMult: 2 },
      { id: 'K', symbol: 'K', label: 'Dielectric Constant (K)', power: -1, minMult: 1, maxMult: 4, step: 0.5, defaultMult: 1 },
      { id: 'A', symbol: 'A', label: 'Plate Area (A)', power: -1, minMult: 0.5, maxMult: 3, step: 0.25, defaultMult: 1 },
    ],
    jeeTip: 'With battery disconnected, inserting K reduces energy by 1/K; pulling plates apart INCREASES energy.',
  },
  {
    id: 'scale-bohr-radius',
    title: 'Bohr Orbit Radius rₙ',
    chapter: 'Modern Physics',
    formulaLatex: 'r_n = 0.529\\,\\frac{n^2}{Z}\\text{ Å}',
    outputSymbol: 'r_n',
    description: 'Compare Hydrogen-like ion shells by scaling principal quantum number n and atomic number Z.',
    formulaId: 'mod-bohr-quantization',
    params: [
      { id: 'n', symbol: 'n', label: 'Quantum State (n / n₀)', power: 2, minMult: 1, maxMult: 4, step: 0.5, defaultMult: 2 },
      { id: 'Z', symbol: 'Z', label: 'Atomic Number (Z / Z₀)', power: -1, minMult: 1, maxMult: 4, step: 0.5, defaultMult: 1 },
    ],
    jeeTip: 'Energy scales as Z²/n², speed as Z/n, and time period Tₙ ∝ n³/Z².',
  },
  {
    id: 'scale-ydse-fringe',
    title: 'YDSE Fringe Width β',
    chapter: 'Wave Optics',
    formulaLatex: '\\beta = \\frac{\\lambda D}{d \\mu}',
    outputSymbol: 'β',
    description: 'Adjust wavelength λ, screen distance D, slit separation d, and medium index μ.',
    formulaId: 'wave-ydse',
    params: [
      { id: 'lambda', symbol: 'λ', label: 'Wavelength (λ)', power: 1, minMult: 0.5, maxMult: 2, step: 0.25, defaultMult: 1.5 },
      { id: 'D', symbol: 'D', label: 'Screen Distance (D)', power: 1, minMult: 0.5, maxMult: 3, step: 0.25, defaultMult: 1 },
      { id: 'd', symbol: 'd', label: 'Slit Separation (d)', power: -1, minMult: 0.5, maxMult: 3, step: 0.25, defaultMult: 0.5 },
      { id: 'mu', symbol: 'μ', label: 'Medium Index (μ)', power: -1, minMult: 1, maxMult: 2, step: 0.25, defaultMult: 1 },
    ],
    jeeTip: 'Immersing entire YDSE setup in water (μ = 4/3) shrinks fringe width β by 25% (to ¾β).',
  },
  {
    id: 'scale-poiseuille',
    title: 'Poiseuille Laminar Flow Rate Q',
    chapter: 'Fluids',
    formulaLatex: 'Q = \\frac{\\pi \\Delta P\\, r^4}{8 \\eta L}',
    outputSymbol: 'Q',
    description: 'Observe extreme 4th-power sensitivity to capillary radius r.',
    formulaId: 'c11-fluids-viscosity-surface-tension',
    params: [
      { id: 'r', symbol: 'r', label: 'Tube Radius (r)', power: 4, minMult: 0.5, maxMult: 2, step: 0.25, defaultMult: 1.5 },
      { id: 'dP', symbol: 'ΔP', label: 'Pressure Drop (ΔP)', power: 1, minMult: 0.5, maxMult: 3, step: 0.25, defaultMult: 1 },
      { id: 'L', symbol: 'L', label: 'Tube Length (L)', power: -1, minMult: 0.5, maxMult: 3, step: 0.25, defaultMult: 1 },
    ],
    jeeTip: 'Doubling capillary radius boosts flow rate 16× (+1500%)! Always check r⁴ traps in series pipe questions.',
  },
  {
    id: 'scale-stefan-power',
    title: 'Blackbody Radiated Power P',
    chapter: 'Thermal Physics',
    formulaLatex: 'P = \\sigma e (4\\pi R^2) T^4',
    outputSymbol: 'P',
    description: 'Explore T⁴ radiation power scaling with sphere radius R and absolute temperature T.',
    formulaId: 'c11-thermal-radiation-laws',
    params: [
      { id: 'R', symbol: 'R', label: 'Radius (R)', power: 2, minMult: 0.5, maxMult: 3, step: 0.25, defaultMult: 1 },
      { id: 'T', symbol: 'T', label: 'Temp (T in Kelvin)', power: 4, minMult: 0.5, maxMult: 2.5, step: 0.25, defaultMult: 1.5 },
    ],
    jeeTip: 'If T rises by 50% (1.5×), radiated power jumps by 1.5⁴ = 5.0625× (+406.25%)!',
  },
  {
    id: 'scale-carnot',
    title: 'Carnot Engine Efficiency η',
    chapter: 'Thermodynamics',
    formulaLatex: '\\eta = 1 - \\frac{T_C}{T_H}',
    outputSymbol: 'η',
    description: 'Baseline T_C = 300 K, T_H = 600 K (η₀ = 50%). Scale T_C and T_H independently.',
    formulaId: 'c11-thermo-carnot-refrigerator',
    params: [
      { id: 'Tc', symbol: 'T_C', label: 'Sink Temp Factor (×300 K)', power: 0, minMult: 0.5, maxMult: 1.8, step: 0.1, defaultMult: 1 },
      { id: 'Th', symbol: 'T_H', label: 'Source Temp Factor (×600 K)', power: 0, minMult: 0.6, maxMult: 2, step: 0.1, defaultMult: 1.5 },
    ],
    customRatio: (vals) => {
      const baseEta = 1 - 300 / 600; // 0.5
      const newTc = 300 * (vals.Tc ?? 1);
      const newTh = 600 * (vals.Th ?? 1);
      const newEta = Math.max(0, 1 - newTc / Math.max(1, newTh));
      return newEta / baseEta;
    },
    jeeTip: 'Lowering T_C by ΔT boosts Carnot efficiency MORE than raising T_H by the same ΔT!',
  },
];
