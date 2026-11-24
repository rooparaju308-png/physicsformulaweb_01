import { ChapterId, Formula } from '../types/physics';

export interface ShortNoteFormulaItem {
  label: string;
  latex: string;
  formulaId: string;
}

export interface ShortNoteTable {
  title?: string;
  headers: string[];
  rows: string[][];
}

export interface ShortNoteBullet {
  text: string;
  equations?: string[];
  subBullets?: string[];
  formulaId?: string;
}

export interface ShortNoteSection {
  title: string;
  formulaId?: string;
  bullets: ShortNoteBullet[];
  tables?: ShortNoteTable[];
  items: ShortNoteFormulaItem[];
}

export interface ShortNoteChapter {
  id: string;
  chapterId: ChapterId;
  number: number;
  unitTag: string;
  title: string;
  shortTitle: string;
  weightage: string;
  isReferenceOnly?: boolean;
  keyConcepts: string[];
  accentColor: string;
  labId?: NonNullable<Formula['labId']>;
  simTitle?: string;
  simDescription?: string;
  sections: ShortNoteSection[];
}

export const NTA_SYLLABUS_REMOVALS: { unit: string; topics: string }[] = [
  {
    unit: 'Current Electricity (Ch 3)',
    topics: 'Colour code for carbon resistors, Potentiometer and its applications.',
  },
  {
    unit: 'Magnetism (Ch 4 & 5)',
    topics:
      "Cyclotron, Tangent Galvanometer, Earth's magnetic field and magnetic elements, Hysteresis loop, Electromagnets and permanent magnets.",
  },
  {
    unit: 'Alternating Current (Ch 7)',
    topics: 'LC Oscillations, Quality Factor (Q-factor) formula derivations.',
  },
  {
    unit: 'Atoms, Nuclei & Comm. (Ch 12–15)',
    topics:
      'Radioactive decay laws (α, β, γ decay law, half-life, activity A = λN), Davisson–Germer experiment, and Communication Systems (Ch 15).',
  },
];

export const SHORT_NOTES: ShortNoteChapter[] = [
  {
    id: 'ch1-electric-charges-and-fields',
    chapterId: 'electrostatics',
    number: 1,
    unitTag: 'Class 12 · Chapter 1',
    title: 'Electric Charges and Fields',
    shortTitle: 'Ch 1 · Electric Charges',
    weightage: 'Very High Weightage',
    keyConcepts: [
      "Charge & Coulomb's Law",
      'Electric Field & Field Lines',
      'Electric Dipole',
      "Flux, Solid Angle & Gauss's Law",
      "Applications of Gauss's Law",
    ],
    accentColor: '#22d3ee',
    labId: 'arc-wire',
    simTitle: 'Line, Arc & Ring E-Field Lab',
    simDescription:
      'Visualise electric field vectors for finite lines, circular arcs, and charged rings along the axis.',
    sections: [
      {
        title: "Charge & Coulomb's Law",
        formulaId: 'elec-coulomb',
        bullets: [
          {
            text: String.raw`**Properties of Charge:** Charge is quantised ($q = ne$, where $e = 1.6 \times 10^{-19}\text{ C}$), conserved, additive, and invariant (independent of frame speed). Bodies are charged by friction, conduction, or induction.`,
            formulaId: 'elec-quantization',
          },
          {
            text: String.raw`**Coulomb's Law** (in vacuum; divide by dielectric constant $K$ when charges are immersed in a medium):`,
            equations: [
              String.raw`\vec{F}_{12} = \frac{1}{4\pi\varepsilon_0}\frac{q_1 q_2}{r^2}\hat{r}_{12} = \frac{k q_1 q_2}{|\vec{r}_1 - \vec{r}_2|^3}(\vec{r}_1 - \vec{r}_2), \qquad k = \frac{1}{4\pi\varepsilon_0} = 9 \times 10^9\text{ N}\cdot\text{m}^2/\text{C}^2`,
            ],
            subBullets: [
              'Like charges repel; unlike charges attract along the line joining them.',
            ],
            formulaId: 'elec-coulomb',
          },
          {
            text: '**Superposition & Equilibrium:**',
            subBullets: [
              'Forces obey the principle of superposition.',
              String.raw`Electric force $\gg$ gravitational force: $\frac{F_e}{F_g} \approx 2.3 \times 10^{39}$ between a proton and an electron, $\approx 4.2 \times 10^{42}$ between two electrons, and $\approx 1.2 \times 10^{36}$ between two protons.`,
              String.raw`Exam patterns: Coulomb force in vector form from position vectors; three collinear charges in equilibrium (stable/unstable); two hanging charged pith balls at equilibrium ($\tan\theta = \frac{F_e}{mg}$). *(Asked: 2026 • 8 Apr • Evening; 2026 • 2 Apr • Evening)*`,
            ],
          },
        ],
        items: [
          {
            label: "Coulomb's Law (Vacuum & Vector Form)",
            latex: String.raw`\vec{F}_{12} = \frac{k q_1 q_2}{|\vec{r}_1 - \vec{r}_2|^3}(\vec{r}_1 - \vec{r}_2),\quad F_{\text{med}} = \frac{F_{\text{vac}}}{K}`,
            formulaId: 'elec-coulomb',
          },
        ],
      },
      {
        title: 'Electric Field & Field Lines',
        formulaId: 'elec-point-evu',
        bullets: [
          {
            text: '**Electric Field:** Force per unit positive test charge. For a point charge $q$:',
            equations: [String.raw`\vec{E} = \frac{\vec{F}}{q_0} = \frac{kq}{r^2}\hat{r}`],
            formulaId: 'elec-point-evu',
          },
          {
            text: '**Uniformly Charged Ring** (charge $Q$, radius $a$), at point $P$ on the axis at distance $x$: Components perpendicular to the axis cancel in pairs; only axial components add:',
            equations: [
              String.raw`E = \frac{kQx}{(a^2 + x^2)^{3/2}}, \qquad V = \frac{kQ}{\sqrt{a^2 + x^2}}, \qquad E_{\max} = \frac{2kQ}{3\sqrt{3}a^2}\text{ at } x = \pm\frac{a}{\sqrt{2}}`,
            ],
            formulaId: 'lar-ring-e-axis',
          },
          {
            text: String.raw`**Infinite Line Charge** (linear charge density $\lambda\text{ C/m}$), at perpendicular distance $r$: Field is radial (away for $+\lambda$) and $E \propto 1/r$. Using a Gaussian cylinder of length $l$, $E(2\pi r l) = \frac{\lambda l}{\varepsilon_0}$:`,
            equations: [String.raw`E = \frac{\lambda}{2\pi\varepsilon_0 r} = \frac{2k\lambda}{r}`],
            formulaId: 'lar-wire-infinite',
          },
          {
            text: String.raw`**Finite Line Charge:** Angles $\theta_1, \theta_2$ measured at $P$ from the perpendicular to the two ends:`,
            equations: [
              String.raw`E_\perp = \frac{k\lambda}{r}(\sin\theta_1 + \sin\theta_2), \qquad E_\parallel = \frac{k\lambda}{r}\lvert\cos\theta_2 - \cos\theta_1\rvert`,
            ],
            subBullets: [
              String.raw`Infinite line: $\theta_1 = \theta_2 = 90^\circ \implies E_\perp = \frac{2k\lambda}{r}, \; E_\parallel = 0$.`,
              String.raw`Semi-infinite line ($P$ opposite one end, $\theta_1 = 90^\circ, \theta_2 = 0^\circ$): $E_\perp = E_\parallel = \frac{k\lambda}{r}$, so net field is $\frac{\sqrt{2}k\lambda}{r}$ at $45^\circ$ to the line.`,
              String.raw`$P$ on the perpendicular bisector ($\theta_1 = \theta_2$): $E_\parallel = 0$.`,
            ],
            formulaId: 'lar-wire-e-perp',
          },
          {
            text: String.raw`**Uniformly Charged Arc** (radius $r$, density $\lambda$, subtending angle $\theta$ at centre $O$): By symmetry, the field at $O$ lies along the angle bisector (away from the arc for $+\lambda$):`,
            equations: [String.raw`E_O = \frac{2k\lambda}{r}\sin\left(\frac{\theta}{2}\right)`],
            subBullets: [
              String.raw`Semicircle ($\theta = \pi$): $E_O = \frac{2k\lambda}{r} = \frac{2kQ}{\pi r^2}$.`,
              String.raw`Quarter circle ($\theta = \pi/2$): $E_O = \frac{\sqrt{2}k\lambda}{r}$.`,
              String.raw`Full ring ($\theta = 2\pi$): $E_O = 0$ at the centre, while $V_O = \frac{kQ}{r}$.`,
            ],
            formulaId: 'lar-arc-e',
          },
          {
            text: String.raw`**Properties of Electric Field Lines:** Start on positive charges and end on negative charges; never intersect; are perpendicular to conductor surfaces in electrostatic equilibrium; line density $\propto |\vec{E}|$. Electrostatic field lines never form closed loops.`,
          },
          {
            text: String.raw`**Charged Particle in a Uniform Field:** Acceleration $\vec{a} = \frac{q\vec{E}}{m}$. It follows a parabolic trajectory when projected transverse to $\vec{E}$.`,
            subBullets: [
              'Millikan oil drop balanced between plates: $qE = mg$.',
              String.raw`Polygon symmetry: Identical charges at all vertices of a regular polygon produce $\vec{E} = \vec{0}$ (but non-zero potential $V = \frac{nkq}{r}$) at the centre. If one charge is removed, the net field at the centre equals the field of the removed charge in the opposite direction. *(Asked: 2026 • 22 Jan • Evening & Morning)*`,
            ],
            formulaId: 'elec-uniform-motion',
          },
        ],
        tables: [
          {
            title: 'Standard Charge Configuration Fields',
            headers: ['Charge Configuration', 'Electric Field ($E$)'],
            rows: [
              [
                'Ring (charge $Q$, radius $a$), on axis at $x$',
                String.raw`$\frac{kQx}{(a^2+x^2)^{3/2}}$ (zero at centre, max at $x = \pm\frac{a}{\sqrt{2}}$)`,
              ],
              [
                'Infinite line charge ($\\lambda$)',
                String.raw`$\frac{\lambda}{2\pi\varepsilon_0 r} = \frac{2k\lambda}{r}$`,
              ],
              [
                String.raw`Finite line, $\perp$ distance $r$`,
                String.raw`$E_\perp = \frac{k\lambda}{r}(\sin\theta_1 + \sin\theta_2)$, $\; E_\parallel = \frac{k\lambda}{r}\lvert\cos\theta_2 - \cos\theta_1\rvert$`,
              ],
              [
                'Infinite non-conducting sheet ($\\sigma$)',
                String.raw`$\frac{\sigma}{2\varepsilon_0}$`,
              ],
              [
                'Arc subtending angle $\\theta$ at centre',
                String.raw`$\frac{2k\lambda}{r}\sin\left(\frac{\theta}{2}\right)$`,
              ],
            ],
          },
        ],
        items: [
          {
            label: 'Ring Axial Electric Field & Max Point',
            latex: String.raw`E = \frac{kQx}{(a^2+x^2)^{3/2}},\qquad E_{\max}\text{ at } x = \pm\frac{a}{\sqrt{2}}`,
            formulaId: 'lar-ring-e-axis',
          },
          {
            label: 'Finite Line & Circular Arc E-Field',
            latex: String.raw`E_\perp = \frac{k\lambda}{r}(\sin\theta_1 + \sin\theta_2);\qquad E_{\text{arc}} = \frac{2k\lambda}{r}\sin\left(\frac{\theta}{2}\right)`,
            formulaId: 'lar-arc-e',
          },
        ],
      },
      {
        title: 'Electric Dipole',
        formulaId: 'elec-dipole-general',
        bullets: [
          {
            text: String.raw`**Dipole Moment & Field:** $\vec{p} = q\vec{d}$ (directed from $-q$ to $+q$). Far-field ($r \gg d$) potential and electric field at $(r, \theta)$:`,
            equations: [
              String.raw`V = \frac{kp\cos\theta}{r^2}, \qquad E = \frac{kp}{r^3}\sqrt{1 + 3\cos^2\theta}, \qquad \tan\alpha = \frac{1}{2}\tan\theta`,
            ],
            subBullets: [
              String.raw`Axial ($\theta = 0^\circ$): $E_{\text{axial}} = \frac{2kp}{r^3}$ (along $\vec{p}$). Equatorial ($\theta = 90^\circ$): $E_{\text{eq}} = \frac{kp}{r^3}$ (opposite to $\vec{p}$).`,
            ],
            formulaId: 'elec-dipole-general',
          },
          {
            text: '**Dipole in a Uniform Electric Field:**',
            subBullets: [
              String.raw`Net force $\vec{F}_{\text{net}} = \vec{0}$.`,
              String.raw`Torque: $\vec{\tau} = \vec{p} \times \vec{E}$ ($\tau = pE\sin\theta$).`,
              String.raw`Potential energy: $U = -\vec{p} \cdot \vec{E} = -pE\cos\theta$.`,
              String.raw`Stable equilibrium at $\theta = 0^\circ$; unstable equilibrium at $\theta = 180^\circ$.`,
              String.raw`Work done by external agent to rotate from $\theta_1$ to $\theta_2$: $W_{\text{ext}} = U_2 - U_1 = pE(\cos\theta_1 - \cos\theta_2)$.`,
              String.raw`Small angular oscillations about stable equilibrium: $T = 2\pi\sqrt{\frac{I}{pE}}$.`,
            ],
            formulaId: 'elec-dipole-torque-u',
          },
          {
            text: String.raw`**Dipole in a Non-Uniform Field:** Experiences both a torque and a net translational force; when aligned with the field along $x$, $F = p\frac{dE}{dx}$ (along the field gradient). *(Asked: 2026 • 2 Apr • Morning; 2026 • 23 Jan • Evening; 2026 • 4 Apr • Evening)*`,
            formulaId: 'elec-dipole-nonuniform',
          },
        ],
        items: [
          {
            label: 'Electric Dipole Field, Torque & Oscillation Period',
            latex: String.raw`E = \frac{kp}{r^3}\sqrt{1 + 3\cos^2\theta},\quad \tau = pE\sin\theta,\quad T = 2\pi\sqrt{\frac{I}{pE}}`,
            formulaId: 'elec-dipole-general',
          },
        ],
      },
      {
        title: "Flux, Solid Angle & Gauss's Law",
        formulaId: 'elec-gauss',
        bullets: [
          {
            text: '**Electric Flux:**',
            equations: [
              String.raw`\Phi_E = \int \vec{E} \cdot d\vec{S} = EA\cos\theta\quad(\text{for uniform }\vec{E}\text{ on flat area }A)`,
            ],
            formulaId: 'elec-gauss',
          },
          {
            text: String.raw`**Solid Angle:** $d\Omega = \frac{dS\cos\theta}{r^2}\text{ sr}$. A full sphere subtends $4\pi\text{ sr}$. A cone of semi-vertical angle $\alpha$ subtends $\Omega = 2\pi(1 - \cos\alpha)$.`,
          },
          {
            text: String.raw`**Gauss's Law:** The total electric flux through any closed surface equals $\frac{q_{\text{enclosed}}}{\varepsilon_0}$:`,
            equations: [
              String.raw`\Phi_E = \oint \vec{E} \cdot d\vec{S} = \frac{q_{\text{enclosed}}}{\varepsilon_0}`,
            ],
            subBullets: [
              String.raw`External charges contribute zero net flux, though they do contribute to the electric field $\vec{E}$ at points on the surface.`,
            ],
            formulaId: 'elec-gauss',
          },
          {
            text: '**Cube Symmetry Results (Charge $q$):**',
            subBullets: [
              String.raw`At the centre of a cube: total flux $= \frac{q}{\varepsilon_0}$; flux through each of the 6 faces $= \frac{q}{6\varepsilon_0}$.`,
              String.raw`At a corner (vertex) of a cube: shared by 8 cubes $\implies$ total flux through the cube $= \frac{q}{8\varepsilon_0}$ ($0$ through the 3 adjacent faces touching the corner, and $\frac{q}{24\varepsilon_0}$ through each of the 3 far faces).`,
              String.raw`At the centre of a face: shared by 2 cubes $\implies$ total flux through the cube $= \frac{q}{2\varepsilon_0}$.`,
              String.raw`At the midpoint of an edge: shared by 4 cubes $\implies$ total flux through the cube $= \frac{q}{4\varepsilon_0}$.`,
            ],
            formulaId: 'elec-cube-flux',
          },
        ],
        items: [
          {
            label: "Gauss's Law & Cube Symmetry Shortcuts",
            latex: String.raw`\oint\vec{E}\cdot d\vec{S} = \frac{q_{\text{enc}}}{\varepsilon_0};\quad \text{Corner: }\Phi_{\text{cube}}=\frac{q}{8\varepsilon_0},\ \Phi_{\text{far face}}=\frac{q}{24\varepsilon_0}`,
            formulaId: 'elec-cube-flux',
          },
        ],
      },
      {
        title: "Applications of Gauss's Law",
        formulaId: 'elec-solid-sphere',
        bullets: [
          {
            text: String.raw`**General Method:** Choose a symmetric Gaussian surface on which $E$ is constant and either $\perp$ or $\parallel$ to $d\vec{S}$, then apply $E \times A_{\text{eff}} = \frac{q_{\text{enc}}}{\varepsilon_0}$.`,
          },
          {
            text: String.raw`**Infinite Line Charge ($\lambda$):** Cylindrical Gaussian surface of radius $r$, length $l$. Flux passes only through the curved surface: $E(2\pi r l) = \frac{\lambda l}{\varepsilon_0} \implies E = \frac{\lambda}{2\pi\varepsilon_0 r}$.`,
            formulaId: 'elec-gauss-line',
          },
          {
            text: String.raw`**Infinite Non-Conducting Plane Sheet ($\sigma$):** Pillbox across the sheet. Flux leaves both flat ends: $2EA = \frac{\sigma A}{\varepsilon_0} \implies E = \frac{\sigma}{2\varepsilon_0}$ (uniform, independent of distance).`,
            formulaId: 'elec-gauss-sheet',
          },
          {
            text: String.raw`**Two Oppositely Charged Parallel Sheets ($\pm\sigma$):** Fields add between the plates and cancel outside:`,
            equations: [String.raw`E_{\text{between}} = \frac{\sigma}{\varepsilon_0}, \qquad E_{\text{outside}} = 0`],
            formulaId: 'elec-sheet-dv',
          },
          {
            text: String.raw`**Just Outside a Charged Conductor ($\sigma$):** Since $E = 0$ inside the conductor, a Gaussian pillbox has flux only through its outer face: $EA = \frac{\sigma A}{\varepsilon_0} \implies E = \frac{\sigma}{\varepsilon_0}$ (normal to the surface).`,
            formulaId: 'elec-conductor-props',
          },
          {
            text: '**Uniformly Charged Spherical Shell** (or Conducting Sphere, charge $Q$, radius $R$):',
            equations: [
              String.raw`E_{\text{out}} = \frac{kQ}{r^2}\ (r \ge R), \qquad E_{\text{in}} = 0\ (r < R), \qquad V_{\text{in}} = V_{\text{surface}} = \frac{kQ}{R}`,
            ],
            formulaId: 'elec-shell',
          },
          {
            text: String.raw`**Uniformly Charged Non-Conducting Solid Sphere** (charge $Q$, radius $R$, volume density $\rho = \frac{Q}{\frac{4}{3}\pi R^3}$): For $r < R$, enclosed charge is $q_{\text{enc}} = Q\frac{r^3}{R^3}$:`,
            equations: [
              String.raw`E_{\text{out}} = \frac{kQ}{r^2}\ (r \ge R), \qquad E_{\text{in}} = \frac{kQr}{R^3} = \frac{\rho r}{3\varepsilon_0}\ (r < R), \qquad V_{\text{in}} = \frac{kQ}{2R^3}(3R^2 - r^2)`,
            ],
            formulaId: 'elec-solid-sphere',
          },
          {
            text: String.raw`**Long Uniformly Charged Non-Conducting Solid Cylinder** (radius $R$, volume density $\rho$, linear density $\lambda = \rho\pi R^2$):`,
            equations: [
              String.raw`E_{\text{out}} = \frac{\rho R^2}{2\varepsilon_0 r} = \frac{\lambda}{2\pi\varepsilon_0 r}\ (r \ge R), \qquad E_{\text{in}} = \frac{\rho r}{2\varepsilon_0}\ (r < R)`,
            ],
            formulaId: 'elec-cylinder-dist',
          },
          {
            text: String.raw`**Earthing Concentric Conductors:** Earthing forces a conductor's potential to $V = 0$:`,
            subBullets: [
              String.raw`Inner sphere (radius $r_{\text{in}}$) earthed inside a shell of radius $r_{\text{out}}$ carrying net charge $Q$:`,
              String.raw`Outer shell (radius $r_{\text{out}}$) earthed while inner sphere carries charge $Q$:`,
            ],
            equations: [
              String.raw`q_{\text{inner}} = -\frac{r_{\text{in}}}{r_{\text{out}}}Q\quad(\text{inner earthed}), \qquad q_{\text{outer}} = -Q\quad(\text{outer earthed})`,
            ],
            formulaId: 'elec-concentric-shells',
          },
        ],
        items: [
          {
            label: 'Solid Sphere & Cylinder Interior Fields',
            latex: String.raw`E_{\text{sphere, in}} = \frac{\rho r}{3\varepsilon_0},\qquad E_{\text{cyl, in}} = \frac{\rho r}{2\varepsilon_0}`,
            formulaId: 'elec-solid-sphere',
          },
        ],
      },
    ],
  },
  {
    id: 'ch2-electrostatic-potential-and-capacitance',
    chapterId: 'electrostatics',
    number: 2,
    unitTag: 'Class 12 · Chapter 2',
    title: 'Electrostatic Potential and Capacitance',
    shortTitle: 'Ch 2 · Potential & Cap',
    weightage: 'Very High Weightage',
    keyConcepts: [
      'Potential Energy, Potential & $\\vec{E}$–$V$ Relation',
      'Conductors, Insulators & Merging Drops',
      'Capacitance & Combinations',
      'Stored Energy, Force & Charge Sharing',
      'Dielectrics, Polarisation & RC Transients',
    ],
    accentColor: '#818cf8',
    labId: 'capacitor',
    simTitle: 'Capacitor & Dielectric Battery Simulator',
    simDescription:
      'Toggle battery connected vs disconnected while inserting dielectric K, and check E, V, Q, U & F live.',
    sections: [
      {
        title: String.raw`Potential Energy, Potential & $\vec{E}$–$V$ Relation`,
        formulaId: 'elec-e-v-relation',
        bullets: [
          {
            text: '**Potential Energy & Potential:**',
            equations: [String.raw`U = \frac{k q_1 q_2}{r}, \qquad V = \frac{U}{q_0} = \frac{kq}{r}`],
            subBullets: [
              String.raw`Work done by the electric field moving charge $q$ from $A$ to $B$: $W_{\text{field}(A \to B)} = -\Delta U = q(V_A - V_B)$.`,
              String.raw`Work done by an external agent (quasi-statically) from $A$ to $B$: $W_{\text{ext}(A \to B)} = +\Delta U = q(V_B - V_A)$.`,
            ],
            formulaId: 'elec-system-pe',
          },
          {
            text: String.raw`**Superposition:** Potential is a scalar ($V = \sum V_i$). For a system of point charges, sum $U_{ij} = \frac{kq_i q_j}{r_{ij}}$ over all unique pairs.`,
          },
          {
            text: '**Electric Field from Potential:**',
            equations: [
              String.raw`\vec{E} = -\nabla V = -\left(\frac{\partial V}{\partial x}\hat{i} + \frac{\partial V}{\partial y}\hat{j} + \frac{\partial V}{\partial z}\hat{k}\right), \qquad V_B - V_A = -\int_A^B \vec{E} \cdot d\vec{r}`,
            ],
            formulaId: 'elec-e-v-relation',
          },
          {
            text: '**Equipotential Surfaces:** Always perpendicular to electric field lines. Zero work is required to move a charge along an equipotential surface.',
          },
        ],
        items: [
          {
            label: 'Electric Field–Potential Gradient & Work',
            latex: String.raw`\vec{E} = -\nabla V,\qquad W_{\text{field}(A\to B)} = q(V_A - V_B),\quad W_{\text{ext}(A\to B)} = q(V_B - V_A)`,
            formulaId: 'elec-e-v-relation',
          },
        ],
      },
      {
        title: 'Conductors, Insulators & Merging Drops',
        formulaId: 'elec-sphere-sharing',
        bullets: [
          {
            text: '**Conductor in Electrostatic Equilibrium:**',
            subBullets: [
              String.raw`$\vec{E} = \vec{0}$ everywhere inside the bulk material.`,
              'All net excess charge resides on the outer surface.',
              'The entire conductor (volume and surface) is an equipotential.',
              String.raw`Just outside the surface, $\vec{E}$ is perpendicular to the surface with magnitude $E = \frac{\sigma}{\varepsilon_0}$.`,
            ],
            formulaId: 'elec-conductor-props',
          },
          {
            text: '**Curvature & Connected Spheres:**',
            subBullets: [
              String.raw`Surface charge density is largest where radius of curvature is smallest ($\sigma \propto 1/R_{\text{local}}$), leading to corona discharge at sharp points.`,
              String.raw`Two distant conducting spheres of radii $r_1, r_2$ joined by a thin wire share a common potential ($V_1 = V_2$):`,
            ],
            equations: [
              String.raw`\frac{q_1}{q_2} = \frac{r_1}{r_2}, \qquad \frac{\sigma_1}{\sigma_2} = \frac{r_2}{r_1}, \qquad \frac{E_1}{E_2} = \frac{r_2}{r_1}`,
            ],
            formulaId: 'elec-sphere-sharing',
          },
          {
            text: '**Merging of $n$ Identical Charged Liquid Drops** (each of radius $r$, charge $q$, capacitance $c$, potential $v$, energy $u$):',
            equations: [
              String.raw`R = n^{1/3}r, \qquad Q = nq, \qquad C = n^{1/3}c, \qquad V = n^{2/3}v, \qquad U = n^{5/3}u`,
            ],
          },
        ],
        items: [
          {
            label: 'Connected Spheres & Merging Liquid Drops',
            latex: String.raw`\frac{q_1}{q_2} = \frac{r_1}{r_2},\ \frac{\sigma_1}{\sigma_2} = \frac{r_2}{r_1};\qquad V_{\text{big}} = n^{2/3}v,\ U_{\text{big}} = n^{5/3}u`,
            formulaId: 'elec-sphere-sharing',
          },
        ],
      },
      {
        title: 'Capacitance & Combinations',
        formulaId: 'elec-cap-combo-dielectric',
        bullets: [
          {
            text: '**Capacitance** ($C = Q/V$, in farads): Depends only on conductor geometry and the surrounding dielectric medium.',
            formulaId: 'elec-cap-basic',
          },
          {
            text: '**Parallel-Plate Capacitor with a Dielectric Slab** (thickness $t < d$, dielectric constant $K$):',
            equations: [String.raw`C = \frac{\varepsilon_0 A}{d - t + \frac{t}{K}}`],
            formulaId: 'elec-cap-dielectric',
          },
          {
            text: '**Series & Parallel Combinations:**',
            subBullets: [
              String.raw`Series (same $Q$): $\frac{1}{C_{\text{eq}}} = \sum \frac{1}{C_i}$`,
              String.raw`Parallel (same $V$): $C_{\text{eq}} = \sum C_i$`,
            ],
            formulaId: 'elec-cap-series-parallel',
          },
          {
            text: '**Partially Filled Parallel-Plate Capacitors:**',
            subBullets: [
              String.raw`Side-by-side (area divided, parallel combination): $C = \frac{\varepsilon_0}{d}(K_1 A_1 + K_2 A_2)$. If half the area has dielectric $K$ and half has air: $C' = \frac{C(K + 1)}{2}$.`,
              String.raw`Stacked/layered (thickness divided, series combination): $\frac{1}{C} = \frac{t_1}{K_1 \varepsilon_0 A} + \frac{t_2}{K_2 \varepsilon_0 A}$. If half the thickness has dielectric $K$ and half has air: $C' = \frac{2KC}{K + 1}$.`,
            ],
            formulaId: 'elec-cap-combo-dielectric',
          },
          {
            text: String.raw`**Wheatstone Bridge Network:** Balanced when $\frac{C_1}{C_2} = \frac{C_3}{C_4}$ (middle capacitor carries zero charge and can be removed).`,
          },
        ],
        tables: [
          {
            title: 'Standard Capacitor Geometries',
            headers: ['Capacitor Type', 'Capacitance ($C$)'],
            rows: [
              ['Parallel-plate capacitor (area $A$, separation $d$)', String.raw`$\frac{\varepsilon_0 A}{d}$`],
              ['Isolated spherical conductor (radius $R$)', String.raw`$4\pi\varepsilon_0 R$`],
              [
                'Spherical capacitor (radii $a < b$, outer shell earthed)',
                String.raw`$\frac{4\pi\varepsilon_0 ab}{b - a}$`,
              ],
              [
                'Cylindrical capacitor (length $l$, radii $a < b$)',
                String.raw`$\frac{2\pi\varepsilon_0 l}{\ln(b/a)}$`,
              ],
            ],
          },
        ],
        items: [
          {
            label: 'Dielectric Slab & Area/Thickness Split Capacitors',
            latex: String.raw`C = \frac{\varepsilon_0 A}{d - t + t/K};\quad C_{\text{side}} = \frac{\varepsilon_0}{d}(K_1 A_1 + K_2 A_2)`,
            formulaId: 'elec-cap-combo-dielectric',
          },
        ],
      },
      {
        title: 'Stored Energy, Force & Charge Sharing',
        formulaId: 'elec-cap-sharing',
        bullets: [
          {
            text: '**Energy Stored & Field Energy Density:**',
            equations: [
              String.raw`U = \frac{1}{2}CV^2 = \frac{Q^2}{2C} = \frac{1}{2}QV, \qquad u = \frac{1}{2}\varepsilon_0 E^2\ \left(\text{or }\frac{1}{2}K\varepsilon_0 E^2\text{ in medium}\right)`,
            ],
            formulaId: 'elec-cap-energy',
          },
          {
            text: String.raw`**Attractive Force Between Capacitor Plates:** Each plate sits in the field of the other single sheet ($E_1 = \frac{\sigma}{2\varepsilon_0}$):`,
            equations: [String.raw`F = Q E_1 = \frac{Q^2}{2\varepsilon_0 A} = \frac{1}{2}\varepsilon_0 A E^2`],
            formulaId: 'elec-cap-force',
          },
          {
            text: '**Charge Sharing Between Two Capacitors** ($C_1, V_1$ and $C_2, V_2$):',
            subBullets: [
              'Connected with same polarity ($+$ to $+$):',
              'Connected with opposite polarity ($+$ to $-$):',
            ],
            equations: [
              String.raw`V_{\text{same}} = \frac{C_1 V_1 + C_2 V_2}{C_1 + C_2}, \quad V_{\text{opp}} = \frac{|C_1 V_1 - C_2 V_2|}{C_1 + C_2}; \qquad \Delta H = \frac{1}{2}\frac{C_1 C_2}{C_1 + C_2}(V_1 \mp V_2)^2`,
            ],
            formulaId: 'elec-cap-sharing',
          },
          {
            text: String.raw`**Effect of Inserting a Dielectric ($K$):** Pulling plates apart with battery connected ($V$ constant): $U(x) = \frac{\varepsilon_0 A V^2}{2x} \implies \left|\frac{dU}{dx}\right| \propto x^{-2}$ (and for constant separation speed $v$, $\left|\frac{dU}{dt}\right| \propto x^{-2}$).`,
            formulaId: 'elec-cap-battery-toggle',
          },
        ],
        tables: [
          {
            title: 'Effect of Inserting a Dielectric ($K$)',
            headers: [
              'Quantity',
              'Battery Disconnected ($Q = \\text{const}$)',
              'Battery Connected ($V = \\text{const}$)',
            ],
            rows: [
              ['Capacitance ($C$)', '$K C_0$', '$K C_0$'],
              ['Charge ($Q$)', '$Q_0$ (unchanged)', '$K Q_0$'],
              ['Potential Difference ($V$)', '$V_0 / K$', '$V_0$ (unchanged)'],
              ['Electric Field ($E$)', '$E_0 / K$', '$E_0$ (unchanged)'],
              ['Stored Energy ($U$)', '$U_0 / K$', '$K U_0$'],
            ],
          },
        ],
        items: [
          {
            label: 'Common Potential, Heat Loss & Plate Force',
            latex: String.raw`V_c = \frac{C_1 V_1 \pm C_2 V_2}{C_1 + C_2},\quad \Delta H = \frac{C_1 C_2}{2(C_1 + C_2)}(V_1 \mp V_2)^2,\quad F = \frac{Q^2}{2\varepsilon_0 A}`,
            formulaId: 'elec-cap-sharing',
          },
        ],
      },
      {
        title: 'Dielectrics, Polarisation & RC Transients',
        formulaId: 'curr-rc-charging',
        bullets: [
          {
            text: String.raw`**Dielectric Polarisation & Gauss's Law:** Induced bound surface charge reduces the internal electric field to $E = \frac{E_0}{K}$:`,
            equations: [
              String.raw`\sigma_b = \sigma\left(1 - \frac{1}{K}\right), \qquad q_b = q\left(1 - \frac{1}{K}\right), \qquad \oint K\varepsilon_0 \vec{E} \cdot d\vec{S} = q_{\text{free}}`,
            ],
            formulaId: 'elec-cap-induced-charge',
          },
          {
            text: '**Leaky Dielectric & Dielectric Strength:**',
            subBullets: [
              String.raw`Dielectric strength $=$ maximum electric field a material can withstand without breakdown ($\approx 3 \times 10^6\text{ V/m}$ for dry air).`,
              String.raw`For a capacitor filled with a leaky medium of resistivity $\rho$ and dielectric constant $K$:`,
            ],
            equations: [String.raw`RC = \rho K \varepsilon_0\quad(\text{independent of plate area }A\text{ and spacing }d)`],
          },
          {
            text: String.raw`**RC Circuit Charging & Discharging** (time constant $\tau = RC$):`,
            subBullets: [
              String.raw`Charging: $q(t) = C\varepsilon\left(1 - e^{-t/RC}\right), \quad i(t) = \frac{\varepsilon}{R}e^{-t/RC}$`,
              String.raw`Discharging: $q(t) = Q_0 e^{-t/RC}, \quad i(t) = \frac{Q_0}{RC}e^{-t/RC}$`,
            ],
            formulaId: 'curr-rc-charging',
          },
          {
            text: '**DC Behaviour of a Capacitor:**',
            subBullets: [
              'At $t = 0$ (uncharged): acts as a short circuit (closed wire).',
              String.raw`At $t \to \infty$ (steady state): acts as an open circuit (zero current flows through the capacitor branch).`,
            ],
            formulaId: 'curr-rc-limits',
          },
        ],
        items: [
          {
            label: 'RC Charging/Discharging & Induced Dielectric Charge',
            latex: String.raw`q(t) = C\varepsilon(1 - e^{-t/RC}),\quad q_b = q\left(1 - \frac{1}{K}\right),\quad RC = \rho K\varepsilon_0`,
            formulaId: 'curr-rc-charging',
          },
        ],
      },
    ],
  },
  {
    id: 'ch3-current-electricity',
    chapterId: 'current',
    number: 3,
    unitTag: 'Class 12 · Chapter 3',
    title: 'Current Electricity',
    shortTitle: 'Ch 3 · Current Electricity',
    weightage: 'Very High Weightage',
    keyConcepts: [
      "Current, Drift Speed & Ohm's Law",
      'EMF, Internal Resistance & Maximum Power Transfer',
      "Kirchhoff's Laws, Resistor Networks & Grouping of Cells",
      'Measuring Instruments',
      "Joule's Laws of Heating",
    ],
    accentColor: '#34d399',
    labId: 'rc-dc',
    simTitle: 'RC DC Transient & Circuit Lab',
    simDescription:
      'Explore DC charging/discharging exponentials, energy split (50% heat / 50% stored), and steady-state open/short capacitor limits.',
    sections: [
      {
        title: "Current, Drift Speed & Ohm's Law",
        formulaId: 'curr-drift',
        bullets: [
          {
            text: String.raw`**Current & Drift Velocity:** where $\tau$ is the relaxation time (mean time between successive collisions).`,
            equations: [
              String.raw`i = \frac{dq}{dt} = neAv_d, \qquad \vec{v}_d = -\frac{e\vec{E}}{m}\tau, \qquad \mu = \frac{v_d}{E} = \frac{e\tau}{m}`,
            ],
            formulaId: 'curr-drift',
          },
          {
            text: "**Microscopic & Macroscopic Ohm's Law:**",
            equations: [
              String.raw`\vec{J} = \sigma\vec{E} = \frac{\vec{E}}{\rho}, \quad \rho = \frac{m}{ne^2\tau}; \qquad V = iR, \quad R = \rho\frac{l}{A}`,
            ],
            formulaId: 'curr-resistivity',
          },
          {
            text: '**Stretching a Wire** (Constant Volume $V = Al$):',
            subBullets: [
              String.raw`Stretched to $n$ times original length ($l' = nl \implies A' = A/n$): $R' = n^2 R$.`,
              String.raw`Drawn so radius becomes $1/n$ of original ($r' = r/n \implies A' = A/n^2$): $R' = n^4 R$.`,
            ],
            formulaId: 'curr-stretch',
          },
          {
            text: '**Temperature Dependence of Resistivity:**',
            equations: [
              String.raw`\rho_T = \rho_0[1 + \alpha(T - T_0)], \qquad R_T = R_0[1 + \alpha(T - T_0)]`,
            ],
            subBullets: [
              String.raw`Metals: $\alpha > 0$ ($\rho$ increases with $T$ as $\tau$ decreases).`,
              String.raw`Semiconductors & Insulators: $\alpha < 0$ ($\rho$ decreases exponentially with $T$ as carrier density $n$ increases rapidly).`,
              String.raw`Standard Resistor Alloys (manganin, constantan, nichrome): high resistivity $\rho$ and very small $\alpha$.`,
            ],
            formulaId: 'curr-temp',
          },
        ],
        items: [
          {
            label: 'Drift Speed, Wire Stretching & Temp Coefficient',
            latex: String.raw`i = neAv_d,\quad v_d = \frac{eE\tau}{m};\quad R' = n^2 R\text{ (length }n\times\text{)};\quad R_T = R_0[1 + \alpha\Delta T]`,
            formulaId: 'curr-stretch',
          },
        ],
      },
      {
        title: 'EMF, Internal Resistance & Maximum Power Transfer',
        formulaId: 'curr-max-power',
        bullets: [
          {
            text: String.raw`**Terminal Voltage of a Cell** (EMF $\varepsilon$, internal resistance $r$):`,
            equations: [
              String.raw`V = \varepsilon - ir\text{ (discharging)}, \qquad V = \varepsilon + ir\text{ (charging)}, \qquad i = \frac{\varepsilon}{R + r}`,
            ],
            subBullets: [
              String.raw`From two external load readings $(i_1, R_1)$ and $(i_2, R_2)$: $\varepsilon = i_1(R_1 + r) = i_2(R_2 + r) \implies r = \frac{i_2 R_2 - i_1 R_1}{i_1 - i_2}$.`,
            ],
            formulaId: 'curr-cell-terminal',
          },
          {
            text: String.raw`**Maximum Power Transfer Theorem:** Power delivered to external load $R$: $P = i^2 R = \frac{\varepsilon^2 R}{(R + r)^2}$.`,
            equations: [
              String.raw`P_{\max} = \frac{\varepsilon^2}{4r}\quad\text{at } R = r\quad(\text{efficiency }\eta = 50\%)`,
            ],
            formulaId: 'curr-max-power',
          },
        ],
        items: [
          {
            label: 'Terminal Voltage & Max Power Transfer',
            latex: String.raw`V = \varepsilon - ir;\qquad P_{\max} = \frac{\varepsilon^2}{4r}\text{ at }R = r`,
            formulaId: 'curr-max-power',
          },
        ],
      },
      {
        title: "Kirchhoff's Laws, Resistor Networks & Grouping of Cells",
        formulaId: 'curr-cells-grouping',
        bullets: [
          {
            text: "**Kirchhoff's Laws:**",
            subBullets: [
              String.raw`Junction Law (KCL — conservation of charge): $\sum i_{\text{in}} = \sum i_{\text{out}}$.`,
              String.raw`Loop Law (KVL — conservation of energy): $\sum \Delta V = 0$ around any closed loop.`,
            ],
            formulaId: 'curr-kcl-kvl',
          },
          {
            text: '**Resistor Combinations:**',
            subBullets: [
              String.raw`Series: $R_{\text{eq}} = \sum R_i$`,
              String.raw`Parallel: $\frac{1}{R_{\text{eq}}} = \sum \frac{1}{R_i}$`,
              String.raw`Uniform wire of total resistance $R$ bent into an equilateral triangle (each side $= R/3$), measured across two vertices: $R_{\text{eq}} = \frac{(R/3)(2R/3)}{R} = \frac{2}{9}R$. (If each side has resistance $R$, $R_{\text{eq}} = \frac{2}{3}R$).`,
            ],
            formulaId: 'curr-resistors-divider',
          },
          {
            text: '**Grouping of Cells:**',
            subBullets: [
              String.raw`$n$ identical cells in series: $i = \frac{n\varepsilon}{R + nr}$ (if $m$ cells are connected in reverse polarity, $\varepsilon_{\text{net}} = (n - 2m)\varepsilon$, while $r_{\text{net}} = nr$).`,
              String.raw`$n$ identical cells in parallel: $i = \frac{\varepsilon}{R + r/n}$.`,
              String.raw`Non-identical cells in parallel (if cell 2 is reversed, replace $\varepsilon_2$ with $-\varepsilon_2$; $r_{\text{eq}}$ remains unchanged):`,
            ],
            equations: [
              String.raw`\varepsilon_{\text{eq}} = \frac{\frac{\varepsilon_1}{r_1} + \frac{\varepsilon_2}{r_2}}{\frac{1}{r_1} + \frac{1}{r_2}} = \frac{\varepsilon_1 r_2 + \varepsilon_2 r_1}{r_1 + r_2}, \qquad \frac{1}{r_{\text{eq}}} = \frac{1}{r_1} + \frac{1}{r_2}`,
            ],
            formulaId: 'curr-cells-grouping',
          },
        ],
        items: [
          {
            label: 'Grouping of Cells (Series & Parallel)',
            latex: String.raw`i_{\text{series}} = \frac{n\varepsilon}{R + nr},\qquad \varepsilon_{\text{eq}} = \frac{\varepsilon_1 r_2 + \varepsilon_2 r_1}{r_1 + r_2},\quad r_{\text{eq}} = \frac{r_1 r_2}{r_1 + r_2}`,
            formulaId: 'curr-cells-grouping',
          },
        ],
      },
      {
        title: 'Measuring Instruments',
        formulaId: 'curr-metre-bridge',
        bullets: [
          {
            text: '**Wheatstone Bridge & Metre Bridge:**',
            subBullets: [
              String.raw`Balanced when $\frac{P}{Q} = \frac{R}{S}$ (zero current through galvanometer $G$).`,
              String.raw`Metre Bridge: $\frac{R}{S} = \frac{l}{100 - l}$. Most sensitive when $l \approx 50\text{ cm}$. Resistivity of wire $S$ of length $L$ and radius $r$: $\rho = \frac{S\pi r^2}{L}$.`,
            ],
            formulaId: 'curr-metre-bridge',
          },
          {
            text: '**Galvanometer Conversions** (Resistance $G$, full-scale current $i_g$):',
            subBullets: [
              String.raw`To Ammeter (range $0 \to i$): Small shunt resistance $S$ in parallel:`,
              String.raw`To Voltmeter (range $0 \to V$): Large resistance $R$ in series:`,
            ],
            equations: [
              String.raw`S = \frac{i_g G}{i - i_g}, \qquad R = \frac{V}{i_g} - G`,
            ],
            formulaId: 'curr-ammeter',
          },
          {
            text: String.raw`**Potentiometer** *(Reference — excluded from rationalised syllabus)*: Potential gradient $k = \frac{V_{\text{AB}}}{L}$. Compares EMFs at null point without drawing current:`,
            equations: [
              String.raw`\frac{\varepsilon_1}{\varepsilon_2} = \frac{l_1}{l_2}, \qquad r = R\left(\frac{l_1}{l_2} - 1\right)`,
            ],
            formulaId: 'curr-potentiometer',
          },
        ],
        items: [
          {
            label: 'Metre Bridge, Ammeter Shunt & Voltmeter Multiplier',
            latex: String.raw`S_{\text{bridge}} = R\frac{100-l}{l};\qquad S = \frac{i_g G}{i - i_g},\quad R_{\text{series}} = \frac{V}{i_g} - G`,
            formulaId: 'curr-metre-bridge',
          },
        ],
      },
      {
        title: "Joule's Laws of Heating",
        formulaId: 'curr-bulb',
        bullets: [
          {
            text: '**Electrical Energy & Power:**',
            equations: [
              String.raw`P = Vi = i^2 R = \frac{V^2}{R}, \qquad H = \int i^2 R\,dt = i^2 R t\text{ (steady current)}`,
            ],
            formulaId: 'curr-ohm-power',
          },
          {
            text: String.raw`**Bulbs & Heaters** (Rated $P_1, P_2$ at the same rated voltage $V_{\text{rated}}$): Resistance of an appliance: $R = \frac{V_{\text{rated}}^2}{P_{\text{rated}}}$.`,
            subBullets: [
              String.raw`Connected in series across $V_{\text{rated}}$: $\frac{1}{P_{\text{total}}} = \frac{1}{P_1} + \frac{1}{P_2}$ (the lower-wattage bulb has higher resistance $R$ and glows brighter because $P = i^2 R$).`,
              String.raw`Connected in parallel across $V_{\text{rated}}$: $P_{\text{total}} = P_1 + P_2$.`,
            ],
            formulaId: 'curr-bulb',
          },
        ],
        items: [
          {
            label: 'Rated Bulbs in Series & Parallel',
            latex: String.raw`R = \frac{V_{\text{rated}}^2}{P_{\text{rated}}};\quad P_{\text{series}} = \frac{P_1 P_2}{P_1 + P_2},\quad P_{\text{parallel}} = P_1 + P_2`,
            formulaId: 'curr-bulb',
          },
        ],
      },
    ],
  },
  {
    id: 'ch4-moving-charges-and-magnetism',
    chapterId: 'magnetism',
    number: 4,
    unitTag: 'Class 12 · Chapter 4',
    title: 'Moving Charges and Magnetism',
    shortTitle: 'Ch 4 · Moving Charges & B',
    weightage: 'Very High Weightage',
    keyConcepts: [
      'Lorentz Force & Charged Particle Motion in Uniform $\\vec{B}$',
      'Magnetic Force on a Current-Carrying Wire & Torque on a Loop',
      'Biot–Savart Law & Standard Field Configurations',
      "Ampere's Circuital Law & Galvanometers",
    ],
    accentColor: '#a855f7',
    labId: 'magnetism',
    simTitle: 'Charge in B-Field, Helical & Wire Force Lab',
    simDescription:
      'Simulate circular and helical trajectories of proton, deuteron & alpha particles, plus parallel wire attraction/repulsion.',
    sections: [
      {
        title: String.raw`Lorentz Force & Charged Particle Motion in Uniform $\vec{B}$`,
        formulaId: 'mag-circle',
        bullets: [
          {
            text: String.raw`**Magnetic & Lorentz Force:** Since $\vec{F}_B \perp \vec{v}$ and $\vec{F}_B \perp \vec{B}$ ($\vec{a} \cdot \vec{v} = 0$ and $\vec{a} \cdot \vec{B} = 0$), the magnetic force does zero work and never changes a particle's speed or kinetic energy.`,
            equations: [
              String.raw`\vec{F}_B = q(\vec{v} \times \vec{B}), \qquad \vec{F}_{\text{Lorentz}} = q(\vec{E} + \vec{v} \times \vec{B})`,
            ],
            formulaId: 'mag-lorentz',
          },
          {
            text: String.raw`**Circular Motion ($\vec{v} \perp \vec{B}$):**`,
            equations: [
              String.raw`r = \frac{mv}{qB} = \frac{p}{qB} = \frac{\sqrt{2mK}}{qB} = \frac{1}{B}\sqrt{\frac{2mV}{q}}, \qquad T = \frac{2\pi m}{qB}, \qquad \omega = \frac{qB}{m}`,
            ],
            formulaId: 'mag-circle',
          },
          {
            text: String.raw`**Helical Motion ($\vec{v}$ at angle $\theta$ to $\vec{B}$):**`,
            equations: [
              String.raw`r = \frac{mv\sin\theta}{qB}, \qquad T = \frac{2\pi m}{qB}, \qquad \text{Pitch } p = (v\cos\theta)T = \frac{2\pi m v\cos\theta}{qB}`,
            ],
            formulaId: 'mag-helix',
          },
          {
            text: String.raw`**Velocity Selector** (Crossed $\vec{E} \perp \vec{B} \perp \vec{v}$): Net force is zero when $qE = qvB \implies v = \frac{E}{B}$.`,
            formulaId: 'mag-velocity-selector',
          },
        ],
        items: [
          {
            label: 'Circular & Helical Motion in Uniform Magnetic Field',
            latex: String.raw`r = \frac{mv\sin\theta}{qB},\qquad T = \frac{2\pi m}{qB},\qquad p = \frac{2\pi m v\cos\theta}{qB}`,
            formulaId: 'mag-helix',
          },
        ],
      },
      {
        title: 'Magnetic Force on a Current-Carrying Wire & Torque on a Loop',
        formulaId: 'mag-loop-torque',
        bullets: [
          {
            text: '**Force on a Wire:**',
            subBullets: [
              String.raw`Straight wire of length $l$: $\vec{F} = i(\vec{l} \times \vec{B})$.`,
              String.raw`Arbitrarily curved wire in a uniform $\vec{B}$: $\vec{F} = i(\vec{L}_{\text{eff}} \times \vec{B})$, where $\vec{L}_{\text{eff}}$ is the straight displacement vector from start point to end point.`,
              String.raw`For any closed current loop in a uniform magnetic field, $\vec{F}_{\text{net}} = \vec{0}$.`,
            ],
            formulaId: 'mag-wire-force',
          },
          {
            text: '**Magnetic Dipole Moment & Torque on a Current Loop** ($N$ turns):',
            equations: [
              String.raw`\vec{\mu} = Ni\vec{A}, \qquad \vec{\tau} = \vec{\mu} \times \vec{B}\ (\tau = NiAB\sin\theta), \qquad U = -\vec{\mu} \cdot \vec{B}`,
            ],
            subBullets: [
              String.raw`Watch the angle: $\theta$ is the angle between the area normal $\hat{n}$ and $\vec{B}$. If $\alpha$ is the angle between the plane of the loop and $\vec{B}$, then $\tau = NiAB\cos\alpha$.`,
              String.raw`Rotating charged body (charge $q$, mass $m$): Gyromagnetic ratio is constant: $\frac{\mu}{L} = \frac{q}{2m}$. For a ring of radius $R$ rotating at angular speed $\omega$: $i = \frac{q\omega}{2\pi} \implies \mu = \frac{1}{2}q\omega R^2$. (For a uniformly charged disc: $\mu = \frac{1}{4}q\omega R^2$; solid sphere: $\mu = \frac{1}{5}q\omega R^2$).`,
            ],
            formulaId: 'mag-loop-torque',
          },
        ],
        items: [
          {
            label: 'Wire Force, Loop Torque & Gyromagnetic Ratio',
            latex: String.raw`\vec{F} = i(\vec{L}_{\text{eff}} \times \vec{B}),\quad \tau = NiAB\sin\theta,\quad \frac{\mu}{L} = \frac{q}{2m}`,
            formulaId: 'mag-loop-torque',
          },
        ],
      },
      {
        title: 'Biot–Savart Law & Standard Field Configurations',
        formulaId: 'mag-biot-savart',
        bullets: [
          {
            text: '**Biot–Savart Law:**',
            equations: [
              String.raw`d\vec{B} = \frac{\mu_0}{4\pi}\frac{i\,(d\vec{l} \times \hat{r})}{r^2} = \frac{\mu_0}{4\pi}\frac{i\,(d\vec{l} \times \vec{r})}{r^3}`,
            ],
            formulaId: 'mag-biot-savart',
          },
          {
            text: String.raw`**Straight Current-Carrying Wire** (at perpendicular distance $d$, angles $\theta_1, \theta_2$ from the perpendicular):`,
            equations: [String.raw`B = \frac{\mu_0 i}{4\pi d}(\sin\theta_1 + \sin\theta_2)`],
            subBullets: [
              String.raw`Infinite straight wire ($\theta_1 = \theta_2 = 90^\circ$): $B = \frac{\mu_0 i}{2\pi d}$.`,
              String.raw`Semi-infinite straight wire (opposite one end, $\theta_1 = 90^\circ, \theta_2 = 0^\circ$): $B = \frac{\mu_0 i}{4\pi d}$.`,
              'Point lying on the line of the wire (or its extension): $B = 0$.',
            ],
            formulaId: 'lar-wire-b',
          },
          {
            text: '**Regular $n$-Sided Polygon Loop** (current $i$):',
            subBullets: [
              String.raw`In terms of perpendicular distance $r$ from centre to a side (inradius):`,
              String.raw`In terms of distance $R$ from centre to a vertex (circumradius, $r = R\cos\frac{\pi}{n}$):`,
            ],
            equations: [
              String.raw`B = \frac{\mu_0 n i}{2\pi r}\sin\left(\frac{\pi}{n}\right) = \frac{\mu_0 n i}{2\pi R}\tan\left(\frac{\pi}{n}\right)`,
            ],
          },
          {
            text: '**Force Between Two Long Parallel Currents** ($i_1, i_2$ separated by $d$):',
            equations: [
              String.raw`\frac{F}{l} = \frac{\mu_0 i_1 i_2}{2\pi d}\quad(\text{attractive if same direction, repulsive if opposite})`,
            ],
            formulaId: 'mag-parallel-wires',
          },
          {
            text: String.raw`**Circular Current Loop & Circular Arc** (radius $a$): Far along the axis ($x \gg a$): $B_{\text{axis}} \approx \frac{\mu_0}{4\pi}\frac{2\mu}{x^3}$, where $\mu = Ni\pi a^2$.`,
            equations: [
              String.raw`B_{\text{centre}} = \frac{\mu_0 N i}{2a}, \qquad B_{\text{arc}} = \frac{\mu_0 i\theta}{4\pi a}, \qquad B_{\text{axis}} = \frac{\mu_0 N i a^2}{2(a^2 + x^2)^{3/2}}`,
            ],
            formulaId: 'lar-arc-b',
          },
        ],
        items: [
          {
            label: 'Straight Wire, Polygon & Circular Loop B-Field',
            latex: String.raw`B = \frac{\mu_0 i}{4\pi d}(\sin\theta_1 + \sin\theta_2),\quad B_{\text{arc}} = \frac{\mu_0 i\theta}{4\pi a},\quad \frac{F}{l} = \frac{\mu_0 i_1 i_2}{2\pi d}`,
            formulaId: 'lar-wire-b',
          },
        ],
      },
      {
        title: "Ampere's Circuital Law & Galvanometers",
        formulaId: 'mag-solenoid-toroid',
        bullets: [
          {
            text: "**Ampere's Circuital Law:**",
            equations: [String.raw`\oint \vec{B} \cdot d\vec{l} = \mu_0 i_{\text{enclosed}}`],
            formulaId: 'mag-ampere',
          },
          {
            text: '**Long Cylindrical Wire** (radius $R$, current $i$):',
            subBullets: [
              'Solid cylinder (uniform current density):',
              String.raw`Hollow thin cylindrical tube: $B_{\text{in}} = 0$ ($r < R$), $B_{\text{out}} = \frac{\mu_0 i}{2\pi r}$ ($r > R$).`,
            ],
            equations: [
              String.raw`B_{\text{in}} = \frac{\mu_0 i r}{2\pi R^2}\ (r < R), \qquad B_{\text{out}} = \frac{\mu_0 i}{2\pi r}\ (r \ge R)`,
            ],
            formulaId: 'mag-thick-wire',
          },
          {
            text: '**Long Solenoid** ($n = N/l$ turns per unit length) & **Toroid** ($N$ total turns):',
            equations: [
              String.raw`B_{\text{solenoid}} = \mu_0 n i\ (\text{interior}), \quad B_{\text{end}} = \frac{1}{2}\mu_0 n i; \qquad B_{\text{toroid}} = \frac{\mu_0 N i}{2\pi r}`,
            ],
            formulaId: 'mag-solenoid-toroid',
          },
          {
            text: String.raw`**Moving-Coil Galvanometer:** Radial magnetic field ensures constant maximum torque $\tau = NiAB$, balanced by restoring spring torque $k\theta$:`,
            equations: [
              String.raw`NiAB = k\theta \implies I_s = \frac{\theta}{i} = \frac{NAB}{k}, \qquad V_s = \frac{\theta}{V} = \frac{NAB}{k R_g}`,
            ],
            formulaId: 'mag-mcg',
          },
          {
            text: String.raw`**Tangent Galvanometer** *(Reference)*: $B_{\text{coil}} = B_H\tan\theta \implies \frac{\mu_0 N i}{2r} = B_H\tan\theta$.`,
            formulaId: 'mag-tangent-galv',
          },
        ],
        items: [
          {
            label: 'Solenoid, Thick Wire & Moving-Coil Galvanometer',
            latex: String.raw`B_{\text{sol}} = \mu_0 ni,\quad B_{\text{in}} = \frac{\mu_0 ir}{2\pi R^2};\qquad I_s = \frac{NAB}{k},\quad V_s = \frac{I_s}{R_g}`,
            formulaId: 'mag-mcg',
          },
        ],
      },
    ],
  },
  {
    id: 'ch5-magnetism-and-matter',
    chapterId: 'magnetism',
    number: 5,
    unitTag: 'Class 12 · Chapter 5',
    title: 'Magnetism and Matter',
    shortTitle: 'Ch 5 · Magnetism & Matter',
    weightage: 'High Weightage',
    keyConcepts: [
      'Bar Magnet & Magnetic Dipole',
      'Magnetisation, Magnetic Intensity & Magnetic Materials',
    ],
    accentColor: '#c084fc',
    labId: 'magnetism',
    simTitle: 'Magnetic Dipoles & Materials Lab',
    simDescription:
      'Compare dipole torque, oscillation periods, and diamagnetic/paramagnetic/ferromagnetic susceptibility curves.',
    sections: [
      {
        title: 'Bar Magnet & Magnetic Dipole',
        formulaId: 'mag-bar-magnet',
        bullets: [
          {
            text: String.raw`**Bar Magnet as an Equivalent Solenoid / Dipole:** Pole strength $m$, magnetic length $2l \approx 0.85 \times L_{\text{geometric}}$. Magnetic dipole moment $\vec{M} = m(2\vec{l})$ (directed from South pole to North pole, in $\text{A m}^2$ or $\text{J/T}$).`,
            formulaId: 'mag-bar-magnet',
          },
          {
            text: String.raw`**Torque & Potential Energy in Uniform $\vec{B}$:**`,
            equations: [
              String.raw`\vec{\tau} = \vec{M} \times \vec{B}\ (\tau = MB\sin\theta), \qquad U = -\vec{M} \cdot \vec{B} = -MB\cos\theta, \qquad W_{\text{ext}} = MB(\cos\theta_1 - \cos\theta_2)`,
            ],
            formulaId: 'mag-dipole-torque',
          },
          {
            text: '**Magnetic Field & Scalar Potential of a Short Dipole** ($r \gg l$):',
            equations: [
              String.raw`B_{\text{axial}} = \frac{\mu_0}{4\pi}\frac{2M}{r^3}, \quad B_{\text{eq}} = \frac{\mu_0}{4\pi}\frac{M}{r^3}, \quad B(r,\theta) = \frac{\mu_0 M}{4\pi r^3}\sqrt{1 + 3\cos^2\theta}, \quad V_m = \frac{\mu_0 M\cos\theta}{4\pi r^2}`,
            ],
            formulaId: 'mag-bar-magnet',
          },
          {
            text: "**Gauss's Law for Magnetism:** Magnetic monopoles do not exist; magnetic field lines always form closed loops.",
            equations: [String.raw`\Phi_B = \oint \vec{B} \cdot d\vec{S} = 0`],
          },
          {
            text: String.raw`**Terrestrial Magnetism & Magnetometers** *(Reference — excluded from rationalised syllabus, though dipole SHM appears)*:`,
            subBullets: [
              String.raw`Horizontal and vertical components with angle of dip $\delta$: $B_H = B\cos\delta$, $B_V = B\sin\delta$, $\tan\delta = \frac{B_V}{B_H}$.`,
              String.raw`Apparent dip $\delta'$ in a vertical plane at angle $\theta$ to magnetic meridian: $\tan\delta' = \frac{\tan\delta}{\cos\theta}$, and in two perpendicular vertical planes: $\cot^2\delta = \cot^2\delta_1 + \cot^2\delta_2$.`,
              String.raw`Oscillation period of a magnetic dipole: $T = 2\pi\sqrt{\frac{I}{MB_H}} \implies \text{oscillation frequency } f \propto \sqrt{B_H}$.`,
            ],
            formulaId: 'mag-earth',
          },
        ],
        items: [
          {
            label: 'Bar Magnet Dipole Field & Oscillation Period',
            latex: String.raw`B_{\text{axial}} = \frac{\mu_0}{4\pi}\frac{2M}{r^3},\quad B_{\text{eq}} = \frac{\mu_0}{4\pi}\frac{M}{r^3},\quad T = 2\pi\sqrt{\frac{I}{MB_H}}`,
            formulaId: 'mag-bar-magnet',
          },
        ],
      },
      {
        title: 'Magnetisation, Magnetic Intensity & Magnetic Materials',
        formulaId: 'mag-materials',
        bullets: [
          {
            text: String.raw`**Fundamental Relations ($\vec{B}, \vec{H}, \vec{I}$):**`,
            subBullets: [
              String.raw`Magnetisation $I$ (or $M_{\text{mag}}$) $=$ net magnetic moment per unit volume ($\text{A/m}$).`,
              String.raw`Magnetic intensity $H = \frac{B_0}{\mu_0}$ ($\text{A/m}$; inside a solenoid, $H = ni$).`,
              String.raw`Fractional increase in field when a solenoid is filled with material of susceptibility $\chi$: $\frac{\Delta B}{B_0} = \chi$.`,
            ],
            equations: [
              String.raw`\vec{B} = \mu_0(\vec{H} + \vec{I}), \qquad \chi = \frac{I}{H}, \qquad \mu_r = 1 + \chi = \frac{\mu}{\mu_0}`,
            ],
            formulaId: 'mag-materials',
          },
          {
            text: '**Hysteresis Loop** *(Reference)*:',
            subBullets: [
              'Retentivity: Value of $B$ remaining when $H$ is reduced to $0$.',
              'Coercivity: Reverse $H$ required to reduce $B$ to $0$.',
              'Area of $B$–$H$ loop: Energy dissipated as heat per unit volume per magnetisation cycle.',
              'Permanent magnets (Steel, Alnico): Require high retentivity and high coercivity.',
              'Electromagnets & Transformer cores (Soft Iron): Require high permeability, low coercivity, and narrow hysteresis loop.',
            ],
            formulaId: 'mag-hysteresis',
          },
        ],
        tables: [
          {
            title: 'Diamagnetic vs Paramagnetic vs Ferromagnetic Materials',
            headers: ['Property', 'Diamagnetic', 'Paramagnetic', 'Ferromagnetic'],
            rows: [
              [
                'Susceptibility ($\\chi$)',
                'Small, negative ($-1 \\le \\chi < 0$)',
                'Small, positive ($\\chi > 0$)',
                'Very large, positive ($\\chi \\gg 1$)',
              ],
              [
                'Relative Permeability ($\\mu_r$)',
                '$0 \\le \\mu_r < 1$',
                '$\\mu_r > 1$ (slightly)',
                '$\\mu_r \\gg 1$',
              ],
              [
                'In Non-Uniform Field',
                'Moves from stronger to weaker field',
                'Moves from weaker to stronger field',
                'Strongly attracted to stronger field',
              ],
              [
                'Temperature Dependence',
                'Independent of $T$',
                String.raw`$\chi = \frac{C}{T}$ (Curie's Law)`,
                String.raw`$\chi = \frac{C}{T - T_c}$ for $T > T_c$ (Curie–Weiss)`,
              ],
              [
                'Physical Origin',
                String.raw`Induced atomic moments oppose $\vec{B}$`,
                'Permanent atomic dipoles align weakly',
                'Spontaneous alignment in domains',
              ],
              [
                'Examples',
                String.raw`$\text{Bi, Cu, Ag, H}_2\text{O, N}_2$; Superconductors ($\chi = -1, B = 0$)`,
                String.raw`$\text{Al, Na, Ca, O}_2\text{, Pt}$`,
                String.raw`$\text{Fe, Co, Ni, Gd, Alnico}$`,
              ],
            ],
          },
        ],
        items: [
          {
            label: 'Magnetic Intensity, Susceptibility & Curie-Weiss Law',
            latex: String.raw`\vec{B} = \mu_0(\vec{H}+\vec{I}),\quad \mu_r = 1+\chi,\quad \chi_{\text{para}} = \frac{C}{T},\quad \chi_{\text{ferro}} = \frac{C}{T - T_c}`,
            formulaId: 'mag-materials',
          },
        ],
      },
    ],
  },
  {
    id: 'ch6-electromagnetic-induction',
    chapterId: 'emi',
    number: 6,
    unitTag: 'Class 12 · Chapter 6',
    title: 'Electromagnetic Induction',
    shortTitle: 'Ch 6 · EMI & Inductance',
    weightage: 'High Weightage',
    keyConcepts: [
      "Faraday's Law & Lenz's Law",
      'Motional EMF & Induced Electric Field',
      'Self-Inductance, Mutual Inductance & LR Circuits',
    ],
    accentColor: '#2dd4bf',
    labId: 'rlc',
    simTitle: 'Inductance, Transients & RLC Lab',
    simDescription:
      'Test inductive reactance, LR growth/decay time constants τ = L/R, and resonance curves.',
    sections: [
      {
        title: "Faraday's Law & Lenz's Law",
        formulaId: 'emi-motional',
        bullets: [
          {
            text: "**Magnetic Flux & Faraday's Law:**",
            equations: [
              String.raw`\Phi_B = \int \vec{B} \cdot d\vec{A} = BA\cos\theta, \qquad \varepsilon = -N\frac{d\Phi_B}{dt}, \qquad |\Delta q| = \frac{N|\Delta\Phi_B|}{R}`,
            ],
          },
          {
            text: "**Lenz's Law:** The polarity of induced EMF is such that it opposes the change in magnetic flux that produces it. Directly follows from conservation of energy.",
          },
        ],
        items: [
          {
            label: "Faraday's Law & Induced Charge",
            latex: String.raw`\varepsilon = -N\frac{d\Phi_B}{dt},\qquad |\Delta q| = \frac{|\Delta\Phi_B|}{R}`,
            formulaId: 'emi-motional',
          },
        ],
      },
      {
        title: 'Motional EMF & Induced Electric Field',
        formulaId: 'emi-sliding-rod',
        bullets: [
          {
            text: '**Motional EMF in a Moving Conductor:**',
            equations: [
              String.raw`\varepsilon = \int (\vec{v} \times \vec{B}) \cdot d\vec{l} = Bvl\quad(\text{when }\vec{v} \perp \vec{B} \perp \vec{l};\text{ replace bent wire with }\vec{L}_{\text{eff}})`,
            ],
            formulaId: 'emi-motional',
          },
          {
            text: String.raw`**Rotating Conductors in Uniform $\vec{B}$** ($\vec{B} \perp$ plane of rotation):`,
            subBullets: [
              String.raw`Rod of length $l$ pivoted at one end: $\varepsilon = \frac{1}{2}B\omega l^2 = B\pi f l^2 = BA_{\text{swept}}f$.`,
              String.raw`Rod in radially varying $B(r)$: $\varepsilon = \int_0^l B(r)\omega r\,dr$.`,
              String.raw`Rod rotating about its own midpoint: $\varepsilon_{\text{end-to-end}} = 0$ (both ends are at the same potential relative to the centre).`,
              String.raw`Conducting disc of radius $R$ (Faraday disc): $\varepsilon = \frac{1}{2}B\omega R^2$ between centre and rim.`,
            ],
          },
          {
            text: String.raw`**Conducting Rod Sliding on Parallel Rails** (circuit resistance $R$): Terminal velocity is reached when the external driving force (e.g., $mg\sin\theta$) equals $\frac{B^2 l^2 v_T}{R}$.`,
            equations: [
              String.raw`i = \frac{Blv}{R}, \qquad F_m = ilB = \frac{B^2 l^2 v}{R}, \qquad v_T = \frac{F_{\text{ext}} R}{B^2 l^2}`,
            ],
            formulaId: 'emi-sliding-rod',
          },
          {
            text: String.raw`**Induced Electric Field from a Time-Varying Magnetic Field:** Induced electric field is non-conservative and its field lines form closed loops. For a cylindrical region of radius $R$ with uniform $\frac{dB}{dt}$:`,
            equations: [
              String.raw`\oint \vec{E} \cdot d\vec{l} = -\frac{d\Phi_B}{dt}; \qquad E_{\text{in}} = \frac{r}{2}\left|\frac{dB}{dt}\right|\ (r < R), \qquad E_{\text{out}} = \frac{R^2}{2r}\left|\frac{dB}{dt}\right|\ (r \ge R)`,
            ],
          },
          {
            text: '**Eddy Currents:** Circulating currents induced in bulk conductors experiencing changing magnetic flux; cause Joule heating and electromagnetic damping. Minimised in transformer cores by using laminated sheets.',
            formulaId: 'emi-eddy',
          },
        ],
        items: [
          {
            label: 'Motional EMF, Rail Terminal Speed & Induced E-Field',
            latex: String.raw`\varepsilon_{\text{rot}} = \frac{1}{2}B\omega l^2,\quad v_T = \frac{F_{\text{ext}}R}{B^2 l^2},\quad E_{\text{in}} = \frac{r}{2}\left|\frac{dB}{dt}\right|`,
            formulaId: 'emi-sliding-rod',
          },
        ],
      },
      {
        title: 'Self-Inductance, Mutual Inductance & LR Circuits',
        formulaId: 'emi-lr-circuit',
        bullets: [
          {
            text: '**Self-Inductance** ($L$, in henry):',
            equations: [String.raw`\Phi = Li, \qquad \varepsilon = -L\frac{di}{dt}`],
            subBullets: [
              String.raw`Long solenoid (length $l$, cross-section $A$, turn density $n = N/l$, core relative permeability $\mu_r$):`,
            ],
            formulaId: 'emi-self-inductance',
          },
          {
            text: '**Long Solenoid Self-Inductance:**',
            equations: [String.raw`L = \mu_0 \mu_r n^2 A l = \frac{\mu_0 \mu_r N^2 A}{l}`],
            formulaId: 'emi-self-inductance',
          },
          {
            text: '**Stored Magnetic Energy & Energy Density:**',
            equations: [String.raw`U = \frac{1}{2}Li^2, \qquad u_B = \frac{B^2}{2\mu_0}`],
          },
          {
            text: String.raw`**LR Circuit Transients** (Time constant $\tau = L/R$):`,
            subBullets: [
              String.raw`Current growth: $i(t) = \frac{\varepsilon}{R}\left(1 - e^{-t/\tau}\right)$`,
              String.raw`Current decay: $i(t) = i_0 e^{-t/\tau}$`,
              String.raw`DC behaviour of an inductor: At $t = 0$, acts as an open circuit (current cannot change instantaneously); at $t \to \infty$ (steady state), acts as an ideal short circuit (plain wire).`,
            ],
            formulaId: 'emi-lr-circuit',
          },
          {
            text: '**Mutual Inductance ($M$):**',
            equations: [
              String.raw`\Phi_2 = M i_1, \qquad \varepsilon_2 = -M\frac{di_1}{dt}, \qquad M \le \sqrt{L_1 L_2}\ \left(k = \frac{M}{\sqrt{L_1 L_2}}\right)`,
            ],
            subBullets: [
              String.raw`Two coaxial solenoids (inner radius $r_1$, common length $l$): $M = \mu_0 n_1 n_2 \pi r_1^2 l = \frac{\mu_0 N_1 N_2 \pi r_1^2}{l}$.`,
              String.raw`Small circular loop (radius $a$) coaxial and concentric with large circular loop (radius $R \gg a$): $M = \frac{\mu_0 \pi a^2}{2R}$.`,
              String.raw`Small loop at the centre of a large square loop of side $L$ (where $B_{\text{centre}} = \frac{2\sqrt{2}\mu_0 i}{\pi L}$): if inner loop is a small circle of radius $a$ ($A = \pi a^2$), $M = \frac{2\sqrt{2}\mu_0 a^2}{L}$; if inner loop is a small square of side $a$ ($A = a^2$), $M = \frac{2\sqrt{2}\mu_0 a^2}{\pi L}$.`,
            ],
            formulaId: 'emi-mutual',
          },
          {
            text: '**Combination of Inductors** (with no mutual flux coupling):',
            subBullets: [
              String.raw`Series: $L_{\text{eq}} = L_1 + L_2$ (with coupling: $L_{\text{eq}} = L_1 + L_2 \pm 2M$)`,
              String.raw`Parallel: $\frac{1}{L_{\text{eq}}} = \frac{1}{L_1} + \frac{1}{L_2}$`,
            ],
            formulaId: 'emi-inductor-combo',
          },
        ],
        items: [
          {
            label: 'Self/Mutual Inductance & LR Transient',
            latex: String.raw`L = \mu_0 n^2 Al,\quad M \le \sqrt{L_1 L_2},\quad L_{\text{eq}} = L_1 + L_2 \pm 2M,\quad \tau = \frac{L}{R}`,
            formulaId: 'emi-inductor-combo',
          },
        ],
      },
    ],
  },
  {
    id: 'ch7-alternating-current',
    chapterId: 'ac',
    number: 7,
    unitTag: 'Class 12 · Chapter 7',
    title: 'Alternating Current',
    shortTitle: 'Ch 7 · Alternating Current',
    weightage: 'High Weightage',
    keyConcepts: [
      'AC Generator, Mean & RMS Values',
      'Phasors, Series LCR Circuit & Resonance',
      'Power in AC, Choke Coil & Transformer',
    ],
    accentColor: '#f59e0b',
    labId: 'rlc',
    simTitle: 'Series RLC Phasor, Resonance & Impedance Lab',
    simDescription:
      'Sweep ω around ω₀ = 1/√LC to watch X_L vs X_C dominance, phase φ, power factor cosφ, and resonance current peak live.',
    sections: [
      {
        title: 'AC Generator, Mean & RMS Values',
        formulaId: 'ac-rms-mean',
        bullets: [
          {
            text: String.raw`**AC Generator:** Coil of $N$ turns, area $A$, rotating at angular speed $\omega$ in uniform field $B$:`,
            equations: [
              String.raw`\Phi(t) = NBA\cos(\omega t), \qquad \varepsilon(t) = NBA\omega\sin(\omega t) = \varepsilon_0\sin(\omega t)`,
            ],
            formulaId: 'ac-generator',
          },
          {
            text: '**Average & RMS Values for Sinusoidal AC:**',
            equations: [
              String.raw`i_{\text{avg (half-cycle)}} = \frac{2i_0}{\pi} \approx 0.637\,i_0, \quad i_{\text{avg (full-cycle)}} = 0, \qquad i_{\text{rms}} = \frac{i_0}{\sqrt{2}} \approx 0.707\,i_0`,
            ],
            formulaId: 'ac-rms-mean',
          },
          {
            text: '**General RMS Results:**',
            subBullets: [
              String.raw`Symmetric square wave of amplitude $i_0$: $i_{\text{rms}} = i_0$.`,
              String.raw`Superposition $i(t) = a + b\sin(\omega t)$: $i_{\text{rms}} = \sqrt{a^2 + \frac{b^2}{2}}$.`,
              String.raw`Time taken for sinusoidal current to change from peak ($i_0$) to RMS ($i_0/\sqrt{2}$) [or from $0$ to $i_{\text{rms}}$]: $\Delta t = \frac{T}{8}$.`,
            ],
            formulaId: 'ac-rms-mean',
          },
        ],
        items: [
          {
            label: 'AC Generator & DC+AC RMS Superposition',
            latex: String.raw`\varepsilon(t) = NBA\omega\sin(\omega t),\qquad i(t) = a + b\sin(\omega t) \implies i_{\text{rms}} = \sqrt{a^2 + \frac{b^2}{2}}`,
            formulaId: 'ac-rms-mean',
          },
        ],
      },
      {
        title: 'Phasors, Series LCR Circuit & Resonance',
        formulaId: 'ac-rlc-impedance',
        bullets: [
          {
            text: '**Series LCR Circuit:**',
            equations: [
              String.raw`Z = \sqrt{R^2 + (X_L - X_C)^2}, \qquad i_{\text{rms}} = \frac{V_{\text{rms}}}{Z}, \qquad V = \sqrt{V_R^2 + (V_L - V_C)^2}, \qquad \tan\phi = \frac{X_L - X_C}{R}`,
            ],
            subBullets: [
              String.raw`$X_L > X_C \implies$ net inductive ($V$ leads $i$).`,
              String.raw`$X_C > X_L \implies$ net capacitive ($i$ leads $V$).`,
            ],
            formulaId: 'ac-rlc-impedance',
          },
          {
            text: '**Resonance in Series LCR** ($X_L = X_C$):',
            subBullets: [
              'Impedance is minimum ($Z = R$) and current is maximum ($i_{\\max} = V/R$).',
              String.raw`Phase angle $\phi = 0^\circ$ and power factor $\cos\phi = 1$.`,
            ],
            equations: [
              String.raw`\omega_0 = \frac{1}{\sqrt{LC}}, \qquad f_0 = \frac{1}{2\pi\sqrt{LC}}, \qquad Q = \frac{\omega_0 L}{R} = \frac{1}{R}\sqrt{\frac{L}{C}}`,
            ],
            formulaId: 'ac-resonance',
          },
        ],
        tables: [
          {
            title: 'AC Circuit Element Phase & Reactance',
            headers: [
              'Circuit Element',
              'Reactance / Resistance',
              'Phase of Voltage $V$ relative to Current $i$',
            ],
            rows: [
              ['Resistor ($R$)', '$R$ (independent of $\\omega$)', 'In phase ($\\phi = 0^\\circ$)'],
              ['Inductor ($L$)', '$X_L = \\omega L = 2\\pi f L$', '$V$ leads $i$ by $90^\\circ$ ($\\pi/2$)'],
              [
                'Capacitor ($C$)',
                String.raw`$X_C = \frac{1}{\omega C} = \frac{1}{2\pi f C}$`,
                '$V$ lags $i$ by $90^\\circ$ ($\\pi/2$)',
              ],
            ],
          },
        ],
        items: [
          {
            label: 'Series LCR Impedance & Resonance',
            latex: String.raw`Z = \sqrt{R^2 + (X_L - X_C)^2},\quad \tan\phi = \frac{X_L - X_C}{R},\quad \omega_0 = \frac{1}{\sqrt{LC}}`,
            formulaId: 'ac-resonance',
          },
        ],
      },
      {
        title: 'Power in AC, Choke Coil & Transformer',
        formulaId: 'ac-power',
        bullets: [
          {
            text: '**Average Power & Power Factor:**',
            equations: [
              String.raw`P_{\text{av}} = V_{\text{rms}} i_{\text{rms}} \cos\phi = i_{\text{rms}}^2 R, \qquad \cos\phi = \frac{R}{Z}`,
            ],
            subBullets: [
              String.raw`Wattless current: $i_{\text{wattless}} = i_{\text{rms}}\sin\phi$.`,
              String.raw`For a purely inductive or purely capacitive circuit ($\phi = \pm 90^\circ$), $\cos\phi = 0 \implies P_{\text{av}} = 0$.`,
              String.raw`Choke coil: High-$L$, negligible-$R$ inductor used to control AC without dissipating power ($\cos\phi \approx 0$).`,
            ],
            formulaId: 'ac-power',
          },
          {
            text: '**Transformer:**',
            equations: [
              String.raw`\frac{V_s}{V_p} = \frac{N_s}{N_p}, \qquad \eta = \frac{P_{\text{out}}}{P_{\text{in}}} = \frac{V_s i_s}{V_p i_p}`,
            ],
            subBullets: [
              String.raw`For an ideal transformer ($\eta = 100\%, \; P_{\text{out}} = P_{\text{in}}$): $\frac{V_s}{V_p} = \frac{N_s}{N_p} = \frac{i_p}{i_s}$.`,
              String.raw`Transformer energy losses: Copper loss ($i^2 R$ heating in windings), eddy current loss (reduced by laminated core), hysteresis loss (reduced by soft iron core), and flux leakage.`,
            ],
            formulaId: 'ac-transformer',
          },
          {
            text: String.raw`**LC Oscillations** *(Reference)*: $\omega = \frac{1}{\sqrt{LC}}, \; q(t) = q_0\cos(\omega t), \; i_{\max} = \omega q_0$. Total energy $\frac{q_0^2}{2C} = \frac{1}{2}L i_{\max}^2$ oscillates between electric and magnetic fields.`,
            formulaId: 'emi-lc-osc',
          },
        ],
        items: [
          {
            label: 'AC Power Factor & Transformer Relations',
            latex: String.raw`P_{\text{av}} = V_{\text{rms}}i_{\text{rms}}\cos\phi;\qquad \frac{V_s}{V_p} = \frac{N_s}{N_p},\quad \eta = \frac{V_s i_s}{V_p i_p}`,
            formulaId: 'ac-transformer',
          },
        ],
      },
    ],
  },
  {
    id: 'ch8-electromagnetic-waves',
    chapterId: 'em-waves',
    number: 8,
    unitTag: 'Class 12 · Chapter 8',
    title: 'Electromagnetic Waves',
    shortTitle: 'Ch 8 · EM Waves',
    weightage: 'High Weightage',
    keyConcepts: [
      "Displacement Current & Maxwell's Equations",
      'Properties of Plane EM Waves, Energy & Momentum',
      'Electromagnetic Spectrum',
    ],
    accentColor: '#ec4899',
    labId: 'wave-optics',
    simTitle: 'Wave Interference & Phase Propagation Lab',
    simDescription:
      'Visualise transverse sinusoidal oscillations, wavelength/phase shifts & intensity energy distributions.',
    sections: [
      {
        title: "Displacement Current & Maxwell's Equations",
        formulaId: 'em-displacement',
        bullets: [
          {
            text: '**Displacement Current:** Total current $i_c + i_d$ is continuous across a charging capacitor ($i_d$ between plates equals conduction current $i_c$ in the leads).',
            equations: [String.raw`i_d = \varepsilon_0 \frac{d\Phi_E}{dt}`],
            formulaId: 'em-displacement',
          },
          {
            text: "**Maxwell's Four Equations:**",
            subBullets: [
              String.raw`Gauss's Law for Electricity: $\oint \vec{E} \cdot d\vec{S} = \frac{q_{\text{enc}}}{\varepsilon_0}$`,
              String.raw`Gauss's Law for Magnetism: $\oint \vec{B} \cdot d\vec{S} = 0$`,
              String.raw`Faraday's Law: $\oint \vec{E} \cdot d\vec{l} = -\frac{d\Phi_B}{dt}$`,
              String.raw`Ampere–Maxwell Law: $\oint \vec{B} \cdot d\vec{l} = \mu_0\left(i_c + \varepsilon_0\frac{d\Phi_E}{dt}\right)$`,
            ],
          },
        ],
        items: [
          {
            label: "Displacement Current & Ampere–Maxwell Law",
            latex: String.raw`i_d = \varepsilon_0 \frac{d\Phi_E}{dt},\qquad \oint \vec{B}\cdot d\vec{l} = \mu_0(i_c + i_d)`,
            formulaId: 'em-displacement',
          },
        ],
      },
      {
        title: 'Properties of Plane EM Waves, Energy & Momentum',
        formulaId: 'em-wave-eq',
        bullets: [
          {
            text: '**Transverse Wave Relations:**',
            subBullets: [
              String.raw`$\vec{E} \perp \vec{B} \perp \vec{k}$; $\vec{E}$ and $\vec{B}$ oscillate in phase and the wave propagates in the direction of $\vec{E} \times \vec{B}$.`,
              'Produced by accelerated charges (an oscillating charge radiates EM waves at its oscillation frequency).',
              String.raw`Ratio of maximum electric force to magnetic force on a charge moving at speed $v$: $\frac{F_E}{F_B} = \frac{qE_0}{qvB_0} = \frac{c}{v}$.`,
            ],
            equations: [
              String.raw`c = \frac{1}{\sqrt{\mu_0 \varepsilon_0}} = 3 \times 10^8\text{ m/s}, \quad v = \frac{1}{\sqrt{\mu \varepsilon}} = \frac{c}{\sqrt{\mu_r \varepsilon_r}} = \frac{\omega}{k}, \quad \frac{E_0}{B_0} = c\text{ (or }v\text{ in medium)}`,
            ],
            formulaId: 'em-wave-eq',
          },
          {
            text: '**Energy Density, Intensity & Radiation Pressure:**',
            subBullets: [
              String.raw`Electric and magnetic energy densities are equal: $u_E = u_B \implies \langle u_E \rangle = \langle u_B \rangle = \frac{1}{4}\varepsilon_0 E_0^2 = \frac{B_0^2}{4\mu_0}$.`,
              'Total Average Energy Density:',
              'Intensity:',
              'Momentum & Radiation Pressure (normal incidence):',
            ],
            equations: [
              String.raw`u_{\text{av}} = \frac{1}{2}\varepsilon_0 E_0^2 = \varepsilon_0 E_{\text{rms}}^2 = \frac{B_0^2}{2\mu_0}, \qquad I = u_{\text{av}} c = \frac{1}{2}\varepsilon_0 E_0^2 c`,
              String.raw`p = \frac{U}{c}\ (\text{abs}),\ \frac{2U}{c}\ (\text{refl}); \qquad P_{\text{rad}} = \frac{I}{c}\ (\text{absorbing}),\ \frac{2I}{c}\ (\text{reflecting})`,
            ],
            formulaId: 'em-intensity',
          },
        ],
        items: [
          {
            label: 'EM Wave Speed, Energy Density & Radiation Pressure',
            latex: String.raw`c = \frac{1}{\sqrt{\mu_0\varepsilon_0}} = \frac{E_0}{B_0},\quad I = \frac{1}{2}\varepsilon_0 E_0^2 c,\quad P_{\text{rad}} = \frac{I}{c}\text{ or }\frac{2I}{c}`,
            formulaId: 'em-momentum-pressure',
          },
        ],
      },
      {
        title: 'Electromagnetic Spectrum',
        formulaId: 'em-spectrum',
        bullets: [
          {
            text: 'Ordered from longest wavelength (lowest frequency) to shortest wavelength (highest frequency): Radio $\\to$ Microwaves $\\to$ Infrared $\\to$ Visible $\\to$ Ultraviolet $\\to$ X-Rays $\\to$ Gamma Rays.',
            formulaId: 'em-spectrum',
          },
        ],
        tables: [
          {
            title: 'Electromagnetic Spectrum Summary',
            headers: ['Region', 'Typical Wavelength Range', 'Source', 'Common Application'],
            rows: [
              [
                'Radio Waves',
                '$> 0.1\\text{ m}$',
                'Oscillating LC circuits / antennas',
                'Radio & TV broadcasting',
              ],
              [
                'Microwaves',
                '$1\\text{ mm}$ – $0.1\\text{ m}$',
                'Klystron, magnetron, Gunn diode',
                'Radar, satellite links, microwave ovens',
              ],
              [
                'Infrared (IR)',
                '$700\\text{ nm}$ – $1\\text{ mm}$',
                'Hot bodies, vibrational transitions',
                'Thermal imaging, TV remotes, greenhouse effect',
              ],
              [
                'Visible Light',
                '$400\\text{ nm}$ – $700\\text{ nm}$',
                'Atomic outer-shell electron transitions',
                'Human vision, photography',
              ],
              [
                'Ultraviolet (UV)',
                '$1\\text{ nm}$ – $400\\text{ nm}$',
                'Sun, mercury vapour arc, inner transitions',
                'Water sterilisation, LASIK (absorbed by ozone)',
              ],
              [
                'X-Rays',
                '$0.01\\text{ nm}$ – $10\\text{ nm}$',
                'X-ray tubes (high-energy electrons hitting target)',
                'Medical radiography, crystal diffraction',
              ],
              [
                'Gamma ($\\gamma$) Rays',
                '$< 0.01\\text{ nm}$',
                'Radioactive nuclear decay',
                'Cancer radiotherapy, nuclear reactions',
              ],
            ],
          },
        ],
        items: [
          {
            label: 'Electromagnetic Spectrum Wavelength Order',
            latex: String.raw`\lambda_{\text{radio}} > \lambda_{\text{micro}} > \lambda_{\text{IR}} > \lambda_{\text{vis}} > \lambda_{\text{UV}} > \lambda_{\text{X}} > \lambda_\gamma`,
            formulaId: 'em-spectrum',
          },
        ],
      },
    ],
  },
  {
    id: 'ch9-ray-optics-and-optical-instruments',
    chapterId: 'ray-optics',
    number: 9,
    unitTag: 'Class 12 · Chapter 9',
    title: 'Ray Optics and Optical Instruments',
    shortTitle: 'Ch 9 · Ray Optics',
    weightage: 'Very High Weightage',
    keyConcepts: [
      'Reflection at Plane & Spherical Mirrors',
      'Refraction at Plane Surfaces, TIR & Prisms',
      'Refraction at Spherical Surfaces & Thin Lenses',
      'Optical Instruments',
    ],
    accentColor: '#fbbf24',
    labId: 'ray-optics',
    simTitle: 'Ray Optics Bench & Prism δ(i) Lab',
    simDescription:
      'Trace principal rays across convex/concave mirrors & lenses, test liquid immersion (n_med > n_lens), and inspect the prism δ vs i U-curve.',
    sections: [
      {
        title: 'Reflection at Plane & Spherical Mirrors',
        formulaId: 'ray-mirror-formula',
        bullets: [
          {
            text: '**Plane Mirrors:**',
            subBullets: [
              'Forms a virtual, erect, laterally inverted, same-size image at equal distance behind the mirror ($v = -u$).',
              String.raw`Rotating a plane mirror by angle $\theta$ (with incident ray fixed) rotates the reflected ray by $2\theta$.`,
              String.raw`Two plane mirrors inclined at angle $\theta$ (let $m = \frac{360^\circ}{\theta}$): if $m$ is an even integer, number of images $n = m - 1$ for all object positions; if $m$ is an odd integer, $n = m - 1$ (if object is on the angle bisector) and $n = m$ (if off the bisector).`,
            ],
          },
          {
            text: '**Spherical Mirrors** ($f = R/2$):',
            equations: [
              String.raw`\frac{1}{v} + \frac{1}{u} = \frac{1}{f} = \frac{2}{R}, \qquad m = \frac{h_i}{h_o} = -\frac{v}{u} = \frac{f}{f - u}`,
            ],
            subBullets: [
              'Sign convention: All distances measured from the pole $P$; direction of incident light is positive ($f < 0$ for concave mirror, $f > 0$ for convex mirror).',
              String.raw`Longitudinal magnification for a very short axial object ($du$): $m_L = \frac{dv}{du} = -m^2$. For a finite rod along the axis, find $v_1$ and $v_2$ for the two ends separately.`,
              String.raw`For a concave mirror producing magnification of magnitude $|m|$ at two object distances $u_1$ (real image) and $u_2$ (virtual image): $|u| = |f|\left(1 \pm \frac{1}{|m|}\right)$ and $\frac{u_1 + u_2}{2} = |f|$.`,
            ],
            formulaId: 'ray-mirror-formula',
          },
        ],
        items: [
          {
            label: 'Spherical Mirror Formula & Magnification',
            latex: String.raw`\frac{1}{v} + \frac{1}{u} = \frac{1}{f} = \frac{2}{R},\qquad m = -\frac{v}{u} = \frac{f}{f-u},\quad m_L = -m^2`,
            formulaId: 'ray-mirror-formula',
          },
        ],
      },
      {
        title: 'Refraction at Plane Surfaces, TIR & Prisms',
        formulaId: 'ray-prism',
        bullets: [
          {
            text: "**Snell's Law, Apparent Depth & Shift:**",
            equations: [
              String.raw`\mu_1 \sin i = \mu_2 \sin r, \qquad d_{\text{app}} = \frac{d_{\text{real}}}{\mu_{\text{rel}}}, \qquad \text{Normal shift } \Delta x = t\left(1 - \frac{1}{\mu}\right)`,
            ],
            formulaId: 'ray-snell-tir-slab',
          },
          {
            text: '**Critical Angle & Total Internal Reflection** (Denser to Rarer Medium):',
            equations: [
              String.raw`\sin C = \frac{\mu_{\text{rarer}}}{\mu_{\text{denser}}} = \frac{1}{\mu}\quad(\text{TIR occurs when }i > C)`,
            ],
            subBullets: [
              'Circle of illumination on water surface above a point source at depth $h$:',
              String.raw`$r = h\tan C = \frac{h}{\sqrt{\mu^2 - 1}}$, Area $A = \frac{\pi h^2}{\mu^2 - 1}$.`,
            ],
            formulaId: 'ray-snell-tir-slab',
          },
          {
            text: '**Refraction Through a Prism** (Apex angle $A$):',
            equations: [
              String.raw`A = r_1 + r_2, \qquad \delta = i + e - A; \qquad \mu = \frac{\sin\left(\frac{A + \delta_m}{2}\right)}{\sin\left(\frac{A}{2}\right)}\ (\text{at min deviation }i = e,\ r_1 = r_2 = \tfrac{A}{2})`,
            ],
            subBullets: [
              String.raw`For an equilateral prism ($A = 60^\circ$): if $\delta_m = 30^\circ = A/2 \implies \mu = \sqrt{2}$; if $\delta_m = 60^\circ = A \implies \mu = \sqrt{3}$.`,
              String.raw`In general, if $\delta_m = A \implies \mu = 2\cos(A/2)$.`,
              String.raw`Thin Prism ($A \le 10^\circ$): $\delta = (\mu - 1)A$ (independent of small angle of incidence $i$).`,
              String.raw`Grazing Emergence ($e = 90^\circ$): $r_2 = C \implies r_1 = A - C$.`,
              'Condition for No Emergence (TIR for all angles of incidence): $A > 2C$.',
            ],
            formulaId: 'ray-prism',
          },
        ],
        items: [
          {
            label: "Snell's Law, TIR & Prism Minimum Deviation",
            latex: String.raw`\sin C = \frac{\mu_{\text{rarer}}}{\mu_{\text{denser}}};\qquad A = r_1 + r_2,\ \delta = i+e-A,\quad \mu = \frac{\sin\left(\frac{A+\delta_m}{2}\right)}{\sin\left(\frac{A}{2}\right)}`,
            formulaId: 'ray-prism',
          },
        ],
      },
      {
        title: 'Refraction at Spherical Surfaces & Thin Lenses',
        formulaId: 'ray-lens-maker',
        bullets: [
          {
            text: String.raw`**Single Spherical Refracting Surface** (light travelling from $\mu_1$ to $\mu_2$):`,
            equations: [String.raw`\frac{\mu_2}{v} - \frac{\mu_1}{u} = \frac{\mu_2 - \mu_1}{R}`],
            formulaId: 'ray-spherical-surface',
          },
          {
            text: "**Lens Maker's Formula & Thin Lens Formula:**",
            equations: [
              String.raw`\frac{1}{f} = \left(\frac{\mu_{\text{lens}}}{\mu_{\text{med}}} - 1\right)\left(\frac{1}{R_1} - \frac{1}{R_2}\right), \qquad \frac{1}{v} - \frac{1}{u} = \frac{1}{f}, \quad m = \frac{v}{u} = \frac{f}{f + u}`,
            ],
            subBullets: [
              String.raw`Equiconvex lens ($R_1 = +R, R_2 = -R$) with $\mu = 1.5$ in air: $f = R$.`,
              "Cut vertically (perpendicular to principal axis) into two plano-convex lenses: focal length of each half doubles ($f' = 2f$).",
              "Cut horizontally (along principal axis): focal length remains unchanged ($f' = f$), intensity reduces.",
              String.raw`Displacement method: $f = \frac{D^2 - d^2}{4D}$ (requires screen distance $D \ge 4f$, and $h_o = \sqrt{h_1 h_2}$).`,
            ],
            formulaId: 'ray-lens-maker',
          },
          {
            text: '**Combination of Thin Lenses & Silvered Lens:**',
            subBullets: [
              String.raw`In contact: $\frac{1}{F} = \frac{1}{f_1} + \frac{1}{f_2}, \quad P = P_1 + P_2$.`,
              String.raw`Separated by distance $d$: $\frac{1}{F} = \frac{1}{f_1} + \frac{1}{f_2} - \frac{d}{f_1 f_2}, \quad P = P_1 + P_2 - d P_1 P_2$.`,
              'Silvered Lens (behaves as an equivalent spherical mirror):',
            ],
            equations: [
              String.raw`\frac{1}{f_{\text{eq}}} = \frac{1}{f_m} - \frac{2}{f_L}\qquad\left(\text{or }P_{\text{eq}} = 2P_L + P_m\right)`,
            ],
            formulaId: 'ray-power-combo',
          },
          {
            text: '**Dispersion by a Thin Prism** *(Reference)*:',
            subBullets: [
              String.raw`Angular dispersion: $\theta = \delta_v - \delta_r = (\mu_v - \mu_r)A$.`,
              String.raw`Dispersive power: $\omega = \frac{\delta_v - \delta_r}{\delta_y} = \frac{\mu_v - \mu_r}{\mu_y - 1}$.`,
            ],
            formulaId: 'ray-dispersion-achromatic',
          },
        ],
        items: [
          {
            label: "Lens Maker's Formula & Silvered Lens",
            latex: String.raw`\frac{1}{f} = \left(\frac{\mu_L}{\mu_m}-1\right)\left(\frac{1}{R_1}-\frac{1}{R_2}\right);\qquad \frac{1}{f_{\text{eq}}} = \frac{1}{f_m} - \frac{2}{f_L}`,
            formulaId: 'ray-lens-maker',
          },
        ],
      },
      {
        title: 'Optical Instruments',
        formulaId: 'ray-instruments',
        bullets: [
          {
            text: '**Simple Microscope** (Magnifying Glass, near point $D = 25\\text{ cm}$):',
            equations: [
              String.raw`M_D = 1 + \frac{D}{f}\ (\text{image at }D), \qquad M_\infty = \frac{D}{f}\ (\text{relaxed eye})`,
            ],
            formulaId: 'ray-instruments',
          },
          {
            text: '**Compound Microscope:**',
            equations: [
              String.raw`M_D = \frac{v_o}{|u_o|}\left(1 + \frac{D}{f_e}\right), \qquad M_\infty = \frac{v_o}{|u_o|}\left(\frac{D}{f_e}\right), \qquad L = v_o + |u_e|`,
            ],
            formulaId: 'ray-instruments',
          },
          {
            text: '**Astronomical Refracting Telescope:**',
            equations: [
              String.raw`M_D = \frac{f_o}{f_e}\left(1 + \frac{f_e}{D}\right), \qquad M_\infty = \frac{f_o}{f_e}\quad(\text{tube length } L = f_o + f_e)`,
            ],
            formulaId: 'ray-instruments',
          },
        ],
        items: [
          {
            label: 'Microscope & Telescope Magnifying Power',
            latex: String.raw`M_{\text{comp}} = \frac{v_o}{|u_o|}\left(1+\frac{D}{f_e}\right),\qquad M_{\text{tel},\infty} = \frac{f_o}{f_e}\ (L = f_o + f_e)`,
            formulaId: 'ray-instruments',
          },
        ],
      },
    ],
  },
  {
    id: 'ch10-wave-optics',
    chapterId: 'wave-optics',
    number: 10,
    unitTag: 'Class 12 · Chapter 10',
    title: 'Wave Optics',
    shortTitle: 'Ch 10 · Wave Optics',
    weightage: 'High Weightage',
    keyConcepts: [
      "Huygens' Principle & Interference (YDSE)",
      'Diffraction & Resolving Power',
      'Polarisation of Light',
    ],
    accentColor: '#fb7185',
    labId: 'wave-optics',
    simTitle: 'YDSE, Diffraction & Polarization Lab',
    simDescription:
      'Explore live YDSE vs single-slit diffraction fringes, liquid immersion, transparent sheet shift Δy, and Malus/Brewster polarization.',
    sections: [
      {
        title: "Huygens' Principle & Interference (YDSE)",
        formulaId: 'wave-ydse',
        bullets: [
          {
            text: String.raw`**Wavefront & Refraction:** Every point on a wavefront acts as a source of secondary spherical wavelets. Upon entering a medium of refractive index $\mu$:`,
            equations: [
              String.raw`v = \frac{c}{\mu}, \qquad \lambda' = \frac{\lambda}{\mu}, \qquad \nu' = \nu\text{ (frequency remains unchanged)}`,
            ],
            formulaId: 'wave-huygens-resolving',
          },
          {
            text: '**Coherent Superposition of Two Waves:**',
            equations: [
              String.raw`\Delta\phi = \frac{2\pi}{\lambda}\Delta x, \qquad I = I_1 + I_2 + 2\sqrt{I_1 I_2}\cos\Delta\phi, \qquad \frac{I_{\max}}{I_{\min}} = \left(\frac{\sqrt{I_1} + \sqrt{I_2}}{\sqrt{I_1} - \sqrt{I_2}}\right)^2`,
            ],
            subBullets: [
              String.raw`For two equal-intensity sources ($I_1 = I_2 = I_0$): $I = 4I_0\cos^2\left(\frac{\Delta\phi}{2}\right)$.`,
            ],
            formulaId: 'wave-superposition-intensity',
          },
          {
            text: "**Young's Double Slit Experiment** (Slit separation $d$, screen distance $D \\gg d$):",
            subBullets: [
              String.raw`Path difference: $\Delta x = d\sin\theta \approx \frac{yd}{D}$.`,
              String.raw`Bright fringes (maxima, $\Delta x = n\lambda$): $y_n = \frac{n\lambda D}{d}$ ($n = 0, \pm 1, \pm 2, \dots$).`,
              String.raw`Dark fringes (minima, $\Delta x = \left(n + \frac{1}{2}\right)\lambda$): $y_n = \left(n + \frac{1}{2}\right)\frac{\lambda D}{d}$ ($n = 0, 1, 2, \dots$).`,
              String.raw`Fringe width: $\beta = \frac{\lambda D}{d}$, Angular fringe width: $\theta_0 = \frac{\beta}{D} = \frac{\lambda}{d}$.`,
              String.raw`Immersed in liquid of index $\mu$: $\beta' = \frac{\beta}{\mu}$ and $\theta_0' = \frac{\theta_0}{\mu}$.`,
            ],
            formulaId: 'wave-ydse',
          },
          {
            text: String.raw`**Optical Path & Thin-Sheet Shift in YDSE:** Inserting a transparent sheet of thickness $t$ and index $\mu$ in front of one slit adds optical path $(\mu - 1)t$ and shifts the entire fringe pattern towards the covered slit by:`,
            equations: [
              String.raw`\Delta y = \frac{D}{d}(\mu - 1)t = \frac{\beta}{\lambda}(\mu - 1)t, \qquad \text{Fringes shifted} = \frac{(\mu - 1)t}{\lambda}`,
            ],
            formulaId: 'wave-slab-shift',
          },
          {
            text: '**Thin-Film Interference in Reflected Light** (film of thickness $d$, index $\mu$ surrounded by air, near-normal incidence):',
            subBullets: [
              String.raw`Constructive (Bright): $2\mu d = \left(n + \frac{1}{2}\right)\lambda$`,
              String.raw`Destructive (Dark): $2\mu d = n\lambda$`,
            ],
          },
        ],
        items: [
          {
            label: 'YDSE Fringe Width, Intensity & Sheet Shift',
            latex: String.raw`\beta = \frac{\lambda D}{d},\quad I = I_1 + I_2 + 2\sqrt{I_1 I_2}\cos\Delta\phi,\quad \Delta y = \frac{D}{d}(\mu-1)t`,
            formulaId: 'wave-ydse',
          },
        ],
      },
      {
        title: 'Diffraction & Resolving Power',
        formulaId: 'wave-single-slit',
        bullets: [
          {
            text: '**Fraunhofer Single-Slit Diffraction** (Slit width $b$ or $a$):',
            subBullets: [
              String.raw`Condition for Minima (Dark fringes): $b\sin\theta = n\lambda$ ($n = \pm 1, \pm 2, \pm 3, \dots$).`,
              String.raw`Secondary Maxima: $b\sin\theta \approx \left(n + \frac{1}{2}\right)\lambda$ ($n = \pm 1, \pm 2, \dots$).`,
              String.raw`Angular width of Central Maximum: $2\theta_1 = \frac{2\lambda}{b}$.`,
              String.raw`Linear width of Central Maximum: $W_c = \frac{2\lambda D}{b}$ (twice the width of any secondary maximum).`,
              String.raw`Distance between 1st and 3rd minima on the same side: $y_3 - y_1 = \frac{2\lambda D}{b}$ (on opposite sides: $\frac{4\lambda D}{b}$).`,
            ],
            formulaId: 'wave-single-slit',
          },
          {
            text: '**Limit of Resolution (Rayleigh Criterion):**',
            subBullets: [
              String.raw`Telescope (objective diameter $D$): $\Delta\theta = \frac{1.22\lambda}{D}$ ($\text{RP} = \frac{1}{\Delta\theta} = \frac{D}{1.22\lambda}$).`,
              String.raw`Microscope: $d_{\min} = \frac{1.22\lambda}{2\mu\sin\theta}$ ($\text{RP} = \frac{1}{d_{\min}} = \frac{2\mu\sin\theta}{1.22\lambda}$).`,
            ],
            formulaId: 'wave-huygens-resolving',
          },
        ],
        items: [
          {
            label: 'Single-Slit Diffraction & Rayleigh Resolving Power',
            latex: String.raw`b\sin\theta = n\lambda\text{ (minima)},\quad W_c = \frac{2\lambda D}{b};\qquad \Delta\theta = \frac{1.22\lambda}{D}`,
            formulaId: 'wave-single-slit',
          },
        ],
      },
      {
        title: 'Polarisation of Light',
        formulaId: 'wave-polarization',
        bullets: [
          {
            text: "**Malus's Law:**",
            subBullets: [
              String.raw`Unpolarised light of intensity $I_0$ passing through the first ideal polariser always emerges with intensity $I_1 = \frac{I_0}{2}$.`,
              String.raw`Polarised light of intensity $I_1$ passing through an analyser whose pass-axis is at angle $\theta$ to the polarisation direction:`,
            ],
            equations: [String.raw`I = I_1 \cos^2\theta`],
            formulaId: 'wave-polarization',
          },
          {
            text: "**Brewster's Law (Polarisation by Reflection):** When light is incident at the Brewster (polarising) angle $\\theta_B$, the reflected light is 100% plane-polarised perpendicular to the plane of incidence, and the reflected and refracted rays are mutually perpendicular:",
            equations: [String.raw`\mu = \tan\theta_B, \qquad \theta_B + r = 90^\circ`],
            formulaId: 'wave-polarization',
          },
        ],
        items: [
          {
            label: "Malus's Law & Brewster's Angle",
            latex: String.raw`I = I_1\cos^2\theta\ (\text{unpolarised}\to \tfrac{1}{2}I_0),\qquad \mu = \tan\theta_B`,
            formulaId: 'wave-polarization',
          },
        ],
      },
    ],
  },
  {
    id: 'ch11-dual-nature-of-radiation-and-matter',
    chapterId: 'modern-physics',
    number: 11,
    unitTag: 'Class 12 · Chapter 11',
    title: 'Dual Nature of Radiation and Matter',
    shortTitle: 'Ch 11 · Dual Nature',
    weightage: 'High Weightage',
    keyConcepts: ['Photon Theory & Photoelectric Effect', 'Matter Waves (de Broglie Hypothesis)'],
    accentColor: '#38bdf8',
    labId: 'modern',
    simTitle: 'Photoelectric Effect & Bohr Atom Lab',
    simDescription:
      'Adjust metal φ, wavelength λ (nm), intensity & voltage V to see K_max, V₀, and λ_e/λ_p/λ_α live.',
    sections: [
      {
        title: 'Photon Theory & Photoelectric Effect',
        formulaId: 'mod-einstein-pe',
        bullets: [
          {
            text: '**Photon Properties:**',
            equations: [
              String.raw`E = h\nu = \frac{hc}{\lambda} \approx \frac{1240\text{ eV}\cdot\text{nm}}{\lambda\text{ (nm)}}, \qquad p = \frac{h}{\lambda} = \frac{E}{c}`,
            ],
            subBullets: [
              String.raw`Photon flux (number of photons emitted/incident per second) for beam power $P$: $\dot{N} = \frac{P}{E} = \frac{P\lambda}{hc}$.`,
              String.raw`Radiation force on a surface (normal incidence): $F = \frac{P}{c}$ (100% absorbing), $F = \frac{2P}{c}$ (100% reflecting).`,
            ],
            formulaId: 'mod-photon-energy',
          },
          {
            text: String.raw`**Einstein's Photoelectric Equation:** where $\phi = h\nu_0 = \frac{hc}{\lambda_0}$ is the work function and $V_0$ is the stopping potential.`,
            equations: [
              String.raw`K_{\max} = eV_0 = h\nu - \phi = h(\nu - \nu_0) = hc\left(\frac{1}{\lambda} - \frac{1}{\lambda_0}\right)`,
            ],
            formulaId: 'mod-einstein-pe',
          },
          {
            text: '**Key Experimental Laws:**',
            subBullets: [
              String.raw`No photoemission occurs if $\nu < \nu_0$ (or $\lambda > \lambda_0$), regardless of light intensity.`,
              String.raw`Stopping potential $V_0$ and $K_{\max}$ depend linearly on frequency $\nu$ and are independent of intensity:`,
              'Saturation photocurrent is directly proportional to light intensity (for $\\nu > \\nu_0$).',
            ],
            equations: [
              String.raw`V_0 = \frac{h}{e}\nu - \frac{\phi}{e}\quad\left(\text{slope of }V_0\text{ vs }\nu = \frac{h}{e},\text{ universal for all metals}\right)`,
            ],
            formulaId: 'mod-einstein-pe',
          },
        ],
        items: [
          {
            label: "Einstein's Photoelectric Equation & Photon Shortcut",
            latex: String.raw`E = \frac{1240\text{ eV}\cdot\text{nm}}{\lambda\text{ (nm)}},\qquad eV_0 = K_{\max} = h\nu - \phi`,
            formulaId: 'mod-einstein-pe',
          },
        ],
      },
      {
        title: 'Matter Waves (de Broglie Hypothesis)',
        formulaId: 'mod-debroglie',
        bullets: [
          {
            text: '**de Broglie Wavelength:**',
            equations: [
              String.raw`\lambda = \frac{h}{p} = \frac{h}{mv} = \frac{h}{\sqrt{2mK}} = \frac{h}{\sqrt{2mqV}}`,
            ],
            subBullets: [
              String.raw`For an electron accelerated through potential difference $V$ (in volts): $\lambda_e = \frac{1.227}{\sqrt{V}}\text{ nm} = \frac{12.27}{\sqrt{V}}\text{ \AA}$.`,
              String.raw`For a gas particle in thermal equilibrium at temperature $T$ ($K = \frac{3}{2}k_B T$): $\lambda = \frac{h}{\sqrt{3mk_B T}}$.`,
            ],
            formulaId: 'mod-debroglie',
          },
          {
            text: '**Important Scaling Ratios & Time-Dependent Field Motion:**',
            subBullets: [
              String.raw`At equal accelerating potential $V$: $\lambda \propto \frac{1}{\sqrt{mq}} \implies \frac{\lambda_e}{\lambda_p} = \sqrt{\frac{m_p}{m_e}}$, and $\lambda_p : \lambda_d : \lambda_\alpha = 1 : \frac{1}{\sqrt{2}} : \frac{1}{2\sqrt{2}}$.`,
              String.raw`At equal kinetic energy $K$: $\lambda \propto \frac{1}{\sqrt{m}}$.`,
              String.raw`At equal de Broglie wavelength $\lambda$: momenta are equal ($p_1 = p_2$), so $K = \frac{p^2}{2m} \propto \frac{1}{m}$.`,
              String.raw`Particle with initial velocity $\vec{v}_0 \parallel \vec{E}$ accelerated by uniform electric field:`,
            ],
            equations: [
              String.raw`\lambda(t) = \frac{\lambda_0}{1 + \frac{qEt}{mv_0}}\quad\left(\text{where }\lambda_0 = \frac{h}{mv_0}\right)`,
            ],
            formulaId: 'mod-debroglie',
          },
        ],
        items: [
          {
            label: 'de Broglie Wavelength & Electron Accelerating Voltage',
            latex: String.raw`\lambda = \frac{h}{\sqrt{2mK}} = \frac{h}{\sqrt{2mqV}};\qquad \lambda_e = \frac{12.27}{\sqrt{V}}\text{ \AA}`,
            formulaId: 'mod-debroglie',
          },
        ],
      },
    ],
  },
  {
    id: 'ch12-atoms',
    chapterId: 'modern-physics',
    number: 12,
    unitTag: 'Class 12 · Chapter 12',
    title: 'Atoms',
    shortTitle: 'Ch 12 · Atoms',
    weightage: 'Very High Weightage',
    keyConcepts: [
      'Rutherford $\\alpha$-Scattering & Distance of Closest Approach',
      "Bohr's Model for Hydrogen-Like Atoms ($Z$)",
      'Hydrogen Spectrum',
    ],
    accentColor: '#0ea5e9',
    labId: 'modern',
    simTitle: 'Photoelectric Effect & Bohr Atom Lab',
    simDescription:
      'Explore Bohr orbital radius, speed, energy levels, and Lyman/Balmer/Paschen spectral transitions interactively.',
    sections: [
      {
        title: String.raw`Rutherford $\alpha$-Scattering & Distance of Closest Approach`,
        formulaId: 'mod-rutherford-scattering',
        bullets: [
          {
            text: '**Rutherford Scattering Relations:**',
            subBullets: [
              'Distance of closest approach (head-on collision, impact parameter $b = 0$):',
              String.raw`Impact parameter & scattering angle $\theta$:`,
            ],
            equations: [
              String.raw`r_0 = \frac{1}{4\pi\varepsilon_0}\frac{2Ze^2}{K}, \qquad b = \frac{Ze^2\cot(\theta/2)}{4\pi\varepsilon_0 K}, \qquad N(\theta) \propto \frac{1}{\sin^4(\theta/2)}`,
            ],
            formulaId: 'mod-rutherford-scattering',
          },
        ],
        items: [
          {
            label: 'Rutherford Closest Approach & Impact Parameter',
            latex: String.raw`r_0 = \frac{1}{4\pi\varepsilon_0}\frac{2Ze^2}{K},\qquad b = \frac{Ze^2\cot(\theta/2)}{4\pi\varepsilon_0 K}`,
            formulaId: 'mod-rutherford-scattering',
          },
        ],
      },
      {
        title: String.raw`Bohr's Model for Hydrogen-Like Atoms ($Z$)`,
        formulaId: 'mod-bohr-quantization',
        bullets: [
          {
            text: "**Bohr's Postulates:**",
            equations: [
              String.raw`\frac{mv^2}{r} = \frac{kZe^2}{r^2}, \qquad L = mvr = \frac{nh}{2\pi}, \qquad \Delta E = E_i - E_f = h\nu`,
            ],
            subBullets: [
              String.raw`de Broglie standing-wave condition: $2\pi r_n = n\lambda$.`,
            ],
            formulaId: 'mod-bohr-quantization',
          },
          {
            text: '**Orbital Radius, Speed & Energy in the $n$-th Stationary State:**',
            equations: [
              String.raw`r_n = 0.529\frac{n^2}{Z}\text{ \AA}, \qquad v_n = 2.18\times 10^6\frac{Z}{n}\text{ m/s}, \qquad E_n = -13.6\frac{Z^2}{n^2}\text{ eV} = -K_n = \frac{U_n}{2}`,
            ],
            subBullets: [
              String.raw`Time period & current of orbiting electron: $T_n \propto \frac{n^3}{Z^2}, \quad i_n \propto \frac{Z^2}{n^3}$.`,
              String.raw`Magnetic field at the nucleus: $B_n = \frac{\mu_0 i_n}{2r_n} \propto \frac{Z^3}{n^5}$.`,
              String.raw`Orbital magnetic dipole moment: $\mu_n = \frac{neh}{4\pi m_e} = n\mu_B$.`,
            ],
            formulaId: 'mod-bohr-quantization',
          },
        ],
        items: [
          {
            label: "Bohr's Radius, Velocity & Energy",
            latex: String.raw`r_n = 0.529\frac{n^2}{Z}\text{ \AA},\quad v_n = 2.18\times 10^6\frac{Z}{n}\text{ m/s},\quad E_n = -13.6\frac{Z^2}{n^2}\text{ eV}`,
            formulaId: 'mod-bohr-quantization',
          },
        ],
      },
      {
        title: 'Hydrogen Spectrum',
        formulaId: 'mod-spectral-lines',
        bullets: [
          {
            text: String.raw`**Rydberg Formula** ($R = 1.097 \times 10^7\text{ m}^{-1}, \; Rch = 13.6\text{ eV}$):`,
            equations: [
              String.raw`\frac{1}{\lambda} = R Z^2\left(\frac{1}{n_f^2} - \frac{1}{n_i^2}\right)`,
            ],
            formulaId: 'mod-spectral-lines',
          },
          {
            text: '**Spectral Line Count & Atomic Recoil:**',
            subBullets: [
              String.raw`Maximum number of spectral lines emitted by a gas sample excited to level $n$ returning to ground state: $N = \frac{n(n - 1)}{2}$ (or from $n_2$ to $n_1$: $\frac{(n_2 - n_1)(n_2 - n_1 + 1)}{2}$).`,
              String.raw`Recoil momentum & kinetic energy of atom of mass $M$ emitting photon $\Delta E$:`,
            ],
            equations: [
              String.raw`p_{\text{recoil}} = \frac{\Delta E}{c}, \qquad K_{\text{recoil}} = \frac{p^2}{2M} = \frac{(\Delta E)^2}{2Mc^2}`,
            ],
            formulaId: 'mod-spectral-lines',
          },
        ],
        tables: [
          {
            title: 'Hydrogen Spectral Series',
            headers: [
              'Spectral Series',
              'Final Level ($n_f$)',
              'Initial Levels ($n_i$)',
              'Spectral Region',
            ],
            rows: [
              ['Lyman', '$1$', '$2, 3, 4, \\dots$', 'Ultraviolet (UV)'],
              [
                'Balmer',
                '$2$',
                '$3, 4, 5, \\dots$',
                String.raw`Visible ($\text{H}_\alpha = 656\text{ nm}$, $\text{H}_\beta = 486\text{ nm}$)`,
              ],
              ['Paschen', '$3$', '$4, 5, 6, \\dots$', 'Near Infrared (IR)'],
              ['Brackett', '$4$', '$5, 6, 7, \\dots$', 'Infrared (IR)'],
              ['Pfund', '$5$', '$6, 7, 8, \\dots$', 'Far Infrared (IR)'],
            ],
          },
        ],
        items: [
          {
            label: 'Rydberg Transitions & Spectral Line Count',
            latex: String.raw`\frac{1}{\lambda} = RZ^2\left(\frac{1}{n_f^2}-\frac{1}{n_i^2}\right),\qquad N_{\max} = \frac{n(n-1)}{2}`,
            formulaId: 'mod-spectral-lines',
          },
        ],
      },
    ],
  },
  {
    id: 'ch13-nuclei',
    chapterId: 'modern-physics',
    number: 13,
    unitTag: 'Class 12 · Chapter 13',
    title: 'Nuclei',
    shortTitle: 'Ch 13 · Nuclei',
    weightage: 'Very High Weightage',
    keyConcepts: [
      'Nuclear Size, Mass Defect & Binding Energy',
      'Nuclear Reactions, Fission, Fusion & Decay',
    ],
    accentColor: '#6366f1',
    labId: 'modern',
    simTitle: 'Nuclear Binding Energy & Reactions Lab',
    simDescription:
      'Inspect binding energy per nucleon, mass defects, Q-values, and reaction thresholds.',
    sections: [
      {
        title: 'Nuclear Size, Mass Defect & Binding Energy',
        formulaId: 'mod-binding-energy',
        bullets: [
          {
            text: String.raw`**Nuclear Composition & Radius:** For nuclide $ {}_Z^A X$: $Z$ protons, $N = A - Z$ neutrons. $1\text{ u} = 1.6605 \times 10^{-27}\text{ kg} \equiv 931.5\text{ MeV}/c^2$.`,
            equations: [String.raw`R = R_0 A^{1/3}\quad(R_0 \approx 1.2 \times 10^{-15}\text{ m} = 1.2\text{ fm})`],
            subBullets: [
              String.raw`Nuclear density: $\rho = \frac{A m_N}{\frac{4}{3}\pi R_0^3 A} = \frac{3m_N}{4\pi R_0^3} \approx 2.3 \times 10^{17}\text{ kg/m}^3$ (independent of mass number $A$).`,
            ],
            formulaId: 'mod-nuclear-radius-density',
          },
          {
            text: '**Mass Defect & Binding Energy:**',
            equations: [
              String.raw`\Delta m = [Z m_p + (A - Z) m_n] - M_{\text{nucleus}}, \qquad \text{BE} = \Delta m \times 931.5\text{ MeV}\ (\Delta m\text{ in u})`,
            ],
            subBullets: [
              String.raw`$\text{BE}/A$ peaks at $\approx 8.8\text{ MeV}$ for $ {}^{56}\text{Fe}$ and is nearly constant ($\sim 8\text{ MeV}$) for $30 < A < 170$ due to short-range saturation of the strong nuclear force.`,
            ],
            formulaId: 'mod-binding-energy',
          },
          {
            text: '**Reaction $Q$-Value:**',
            equations: [
              String.raw`Q = \left(\sum m_R - \sum m_P\right)c^2 = \sum \text{BE}_P - \sum \text{BE}_R`,
            ],
            subBullets: [
              String.raw`$Q > 0 \implies$ exothermic (spontaneous/energy-releasing); $Q < 0 \implies$ endothermic.`,
            ],
            formulaId: 'mod-nuclear-qvalue',
          },
        ],
        items: [
          {
            label: 'Nuclear Radius, Binding Energy & Q-Value',
            latex: String.raw`R = R_0 A^{1/3},\quad \text{BE} = \Delta m\cdot 931.5\text{ MeV},\quad Q = (m_R - m_P)c^2 = \text{BE}_P - \text{BE}_R`,
            formulaId: 'mod-nuclear-qvalue',
          },
        ],
      },
      {
        title: 'Nuclear Reactions, Fission, Fusion & Decay',
        formulaId: 'mod-nuclear-qvalue',
        bullets: [
          {
            text: '**Radioactive Decay Modes:**',
            subBullets: [
              String.raw`$\alpha$-decay ($ {}_Z^A X \to {}_{Z-2}^{A-4}Y + {}_2^4\text{He}$): By momentum conservation from rest, the $\alpha$-particle carries most of the kinetic energy:`,
              String.raw`$\beta^-$-decay: $n \to p + e^- + \bar{\nu}_e$ ($Z \to Z + 1$, $A$ unchanged).`,
              String.raw`$\beta^+$-decay: $p \to n + e^+ + \nu_e$ ($Z \to Z - 1$, $A$ unchanged; occurs only inside a nucleus since $m_p < m_n$).`,
              String.raw`$\gamma$-decay: Excited nucleus de-excites by emitting a photon ($A$ and $Z$ unchanged).`,
            ],
            equations: [
              String.raw`K_\alpha = \left(\frac{A - 4}{A}\right)Q, \qquad K_Y = \frac{4}{A}Q`,
            ],
          },
          {
            text: '**Radioactive Decay Law** *(Reference — excluded from rationalised Physics syllabus)*:',
            equations: [
              String.raw`N = N_0 e^{-\lambda t}, \qquad A = \lambda N = A_0 e^{-\lambda t}, \qquad T_{1/2} = \frac{\ln 2}{\lambda} = \frac{0.693}{\lambda}, \qquad \tau_{\text{avg}} = \frac{1}{\lambda}`,
            ],
            subBullets: [
              String.raw`Parallel decay modes ($\lambda_1, \lambda_2$): $\lambda_{\text{eff}} = \lambda_1 + \lambda_2 \implies \frac{1}{T_{\text{eff}}} = \frac{1}{T_1} + \frac{1}{T_2}$.`,
            ],
          },
          {
            text: '**Nuclear Fission & Fusion:**',
            subBullets: [
              String.raw`Fission: $ {}_{92}^{235}\text{U} + {}_0^1 n \to \text{fragments} + 2.5\,n + 200\text{ MeV}$.`,
              String.raw`Fusion: $4\,{}_1^1\text{H} \to {}_2^4\text{He} + 2e^+ + 2\nu_e + 26.7\text{ MeV}$ (requires $T \sim 10^7\text{ K}$ to overcome Coulomb repulsion; yields higher energy per unit mass than fission).`,
            ],
          },
        ],
        items: [
          {
            label: 'Alpha Decay Kinetic Energy Split & Fission/Fusion',
            latex: String.raw`K_\alpha = \left(\frac{A-4}{A}\right)Q;\qquad N = N_0 e^{-\lambda t},\quad T_{1/2} = \frac{0.693}{\lambda}`,
            formulaId: 'mod-nuclear-qvalue',
          },
        ],
      },
    ],
  },
  {
    id: 'ch14-semiconductor-electronics',
    chapterId: 'semiconductors',
    number: 14,
    unitTag: 'Class 12 · Chapter 14',
    title: 'Semiconductor Electronics',
    shortTitle: 'Ch 14 · Semiconductors',
    weightage: 'Very High Weightage',
    keyConcepts: [
      'Energy Bands & Carrier Concentrations',
      'p–n Junction Diode, Rectifiers & Optoelectronic Devices',
      'Digital Logic Gates',
    ],
    accentColor: '#10b981',
    labId: 'semiconductor',
    simTitle: 'Semiconductor Quadrants, Zener & Logic Gate Lab',
    simDescription:
      'Inspect all 4 diode I–V quadrants, test live Zener voltage regulation (I_s = I_Z + I_L), and toggle universal NAND/NOR truth tables.',
    sections: [
      {
        title: 'Energy Bands & Carrier Concentrations',
        formulaId: 'semi-mass-action-neutrality',
        bullets: [
          {
            text: '**Classification by Band Gap ($E_g$):**',
            subBullets: [
              'Conductors: Overlapping valence and conduction bands ($E_g \\approx 0$).',
              String.raw`Semiconductors: $E_g \sim 1\text{ eV}$ ($\text{Si} = 1.1\text{ eV}$, $\text{Ge} = 0.7\text{ eV}$). Negative temperature coefficient of resistivity.`,
              'Insulators: $E_g > 3\\text{ eV}$.',
            ],
          },
          {
            text: '**Intrinsic & Extrinsic Semiconductors:**',
            subBullets: [
              'Intrinsic: $n_e = n_h = n_i$.',
              String.raw`$n$-type: Pentavalent donor impurities ($\text{P, As, Sb}$); $n_e \approx N_D \gg n_h$. Donor energy level lies just below the conduction band ($\sim 0.01\text{–}0.05\text{ eV}$).`,
              String.raw`$p$-type: Trivalent acceptor impurities ($\text{B, Al, In, Ga}$); $n_h \approx N_A \gg n_e$. Acceptor energy level lies just above the valence band.`,
              'Both $n$-type and $p$-type semiconductors are macroscopically electrically neutral.',
              'Mass-Action Law & Conductivity:',
            ],
            equations: [
              String.raw`n_e n_h = n_i^2, \qquad n_e + N_A = n_h + N_D, \qquad \sigma = \frac{1}{\rho} = e(n_e \mu_e + n_h \mu_h)`,
            ],
            formulaId: 'semi-conductivity',
          },
        ],
        items: [
          {
            label: 'Mass-Action Law, Neutrality & Conductivity',
            latex: String.raw`n_e n_h = n_i^2,\qquad n_e + N_A = n_h + N_D,\qquad \sigma = e(n_e\mu_e + n_h\mu_h)`,
            formulaId: 'semi-conductivity',
          },
        ],
      },
      {
        title: 'p–n Junction Diode, Rectifiers & Optoelectronic Devices',
        formulaId: 'semi-zener-regulator',
        bullets: [
          {
            text: '**p–n Junction & Depletion Layer:**',
            subBullets: [
              String.raw`Diffusion of majority carriers leaves uncovered immobile ions, creating a space-charge depletion region and barrier electric field (barrier potential $V_B \approx 0.7\text{ V}$ for $\text{Si}$, $\approx 0.3\text{ V}$ for $\text{Ge}$).`,
              String.raw`Charge equality across the junction ($N_A x_p = N_D x_n$) means the depletion region penetrates deeper into the more lightly doped side.`,
              String.raw`Forward bias: Lowers barrier, narrows depletion layer; majority-carrier current (in $\text{mA}$). With threshold drop $V_D$, $i = \frac{V - V_D}{R}$.`,
              String.raw`Reverse bias: Raises barrier, widens depletion layer; small saturation current (in $\mu\text{A}$) due to minority carriers.`,
            ],
            formulaId: 'semi-diode-characteristics',
          },
          {
            text: '**Rectifiers:**',
            subBullets: [
              'Half-Wave Rectifier: Conducts during one half-cycle; output ripple frequency $= f_{\\text{in}}$.',
              'Full-Wave Rectifier (Centre-Tap or Bridge): Conducts during both half-cycles; output ripple frequency $= 2f_{\\text{in}}$.',
            ],
            formulaId: 'semi-rectifier',
          },
          {
            text: String.raw`**Zener Diode Voltage Regulator:** For input voltage $V_{\text{in}}$, series resistor $R_s$, and load resistor $R_L$ across a Zener diode (breakdown voltage $V_Z$, max power $P_{\max}$):`,
            equations: [
              String.raw`I_s = \frac{V_{\text{in}} - V_Z}{R_s}, \qquad I_L = \frac{V_Z}{R_L}, \qquad I_Z = I_s - I_L, \qquad I_{Z,\max} = \frac{P_{\max}}{V_Z}`,
            ],
            subBullets: [
              String.raw`Minimum series resistance to prevent Zener burnout: $R_{s,\min} = \frac{V_{\text{in},\max} - V_Z}{I_{Z,\max} + I_{L,\min}}$ (unloaded: $\frac{V_{\text{in}} - V_Z}{I_{Z,\max}}$).`,
            ],
            formulaId: 'semi-zener-regulator',
          },
        ],
        tables: [
          {
            title: 'Special Diodes & Operating Quadrants',
            headers: ['Special Diode', 'Operating Bias', 'Key Principle & Condition'],
            rows: [
              [
                'LED',
                'Forward biased',
                String.raw`Heavily doped; spontaneous radiative recombination ($\lambda = \frac{hc}{E_g}$)`,
              ],
              [
                'Photodiode',
                'Reverse biased',
                'Fractional change in minority current $\\propto$ incident light intensity ($h\\nu > E_g$)',
              ],
              [
                'Solar Cell',
                'No external bias (4th quadrant of $I$–$V$)',
                'Photovoltaic generation ($E_g \\approx 1.4$–$1.5\\text{ eV}$ for max solar absorption)',
              ],
              [
                'Zener Diode',
                'Reverse biased (in breakdown)',
                'Heavily doped, sharp breakdown voltage $V_Z$; used as DC voltage regulator',
              ],
            ],
          },
        ],
        items: [
          {
            label: 'Zener Regulator & Rectifier Ripple Frequency',
            latex: String.raw`I_s = \frac{V_{\text{in}}-V_Z}{R_s} = I_Z + I_L;\qquad f_{\text{full-wave}} = 2f_{\text{in}}`,
            formulaId: 'semi-zener-regulator',
          },
        ],
      },
      {
        title: 'Digital Logic Gates',
        formulaId: 'semi-boolean-gates',
        bullets: [
          {
            text: "**De Morgan's Theorems & Universal Gate Equivalents:**",
            equations: [
              String.raw`\overline{A \cdot B} = \bar{A} + \bar{B}, \qquad \overline{A + B} = \bar{A} \cdot \bar{B}`,
            ],
            subBullets: [
              'NOT: NAND with inputs shorted together, or NOR with inputs shorted together.',
              String.raw`AND: NAND followed by NOT, or NOR with both inputs inverted ($\overline{\bar{A} + \bar{B}} = A \cdot B$).`,
              String.raw`OR: NOR followed by NOT, or NAND with both inputs inverted ($\overline{\bar{A} \cdot \bar{B}} = A + B$).`,
            ],
            formulaId: 'semi-boolean-gates',
          },
        ],
        tables: [
          {
            title: 'Digital Logic Gates Truth Summary',
            headers: ['Logic Gate', 'Boolean Expression', 'Output $Y = 1$ Condition'],
            rows: [
              ['OR', '$Y = A + B$', 'Any input is $1$'],
              ['AND', '$Y = A \\cdot B$', 'All inputs are $1$'],
              ['NOT', '$Y = \\bar{A}$', 'Input is $0$'],
              [
                'NAND (Universal)',
                String.raw`$Y = \overline{A \cdot B} = \bar{A} + \bar{B}$`,
                'Any input is $0$ (not all $1$)',
              ],
              [
                'NOR (Universal)',
                String.raw`$Y = \overline{A + B} = \bar{A} \cdot \bar{B}$`,
                'All inputs are $0$',
              ],
              ['XOR', '$Y = A\\bar{B} + \\bar{A}B$', 'Inputs are different'],
              ['XNOR', '$Y = AB + \\bar{A}\\bar{B}$', 'Inputs are identical'],
            ],
          },
        ],
        items: [
          {
            label: "De Morgan's Laws & Universal NAND/NOR Gates",
            latex: String.raw`\overline{A\cdot B} = \bar{A}+\bar{B},\qquad \overline{A+B} = \bar{A}\cdot\bar{B}`,
            formulaId: 'semi-boolean-gates',
          },
        ],
      },
    ],
  },
  {
    id: 'ch15-communication-systems',
    chapterId: 'em-waves',
    number: 15,
    unitTag: 'Class 12 · Chapter 15',
    title: 'Communication Systems',
    shortTitle: 'Ch 15 · Communication',
    weightage: 'Reference Only — Excluded from JEE Main Syllabus',
    isReferenceOnly: true,
    keyConcepts: [
      'Block Diagram & Terminology',
      'Propagation of Electromagnetic Waves',
      'Amplitude Modulation (AM)',
    ],
    accentColor: '#94a3b8',
    sections: [
      {
        title: 'Block Diagram & Terminology',
        bullets: [
          {
            text: String.raw`**Communication System Flow:** $\text{Information Source} \to \text{Transmitter} \to \text{Channel (Noise enters)} \to \text{Receiver} \to \text{User}$.`,
          },
          {
            text: String.raw`**Standard Signal Bandwidths:** Speech $\approx 2800\text{ Hz}$ ($300\text{–}3100\text{ Hz}$), Music $\approx 20\text{ kHz}$, Video $\approx 4.2\text{ MHz}$, TV channel $\approx 6\text{ MHz}$.`,
          },
        ],
        items: [
          {
            label: 'Signal Bandwidths & Communication Block Chain',
            latex: String.raw`\text{BW}_{\text{speech}} \approx 2.8\text{ kHz},\quad \text{BW}_{\text{video}} \approx 4.2\text{ MHz},\quad \text{BW}_{\text{TV}} \approx 6\text{ MHz}`,
            formulaId: 'em-spectrum',
          },
        ],
      },
      {
        title: 'Propagation of Electromagnetic Waves',
        bullets: [
          {
            text: '**Ground Wave** ($< 2\\text{ MHz}$): Follows Earth’s curvature; attenuation increases with frequency.',
          },
          {
            text: '**Sky Wave** ($2\\text{–}30\\text{ MHz}$): Reflected by the ionosphere via total internal reflection. Critical frequency:',
            equations: [String.raw`f_c = 9\sqrt{N_{\max}}\text{ Hz}\quad(N_{\max}\text{ in m}^{-3})`],
          },
          {
            text: '**Space Wave / Line-of-Sight** ($> 40\\text{ MHz}$): Direct propagation and satellite communication. Maximum line-of-sight range (Earth radius $R \\approx 6400\\text{ km}$):',
            equations: [String.raw`d_{\max} = \sqrt{2Rh_T} + \sqrt{2Rh_R}`],
          },
        ],
        items: [
          {
            label: 'Ionosphere Critical Frequency & Line-of-Sight Range',
            latex: String.raw`f_c = 9\sqrt{N_{\max}},\qquad d_{\max} = \sqrt{2Rh_T} + \sqrt{2Rh_R}`,
            formulaId: 'em-spectrum',
          },
        ],
      },
      {
        title: 'Amplitude Modulation (AM)',
        bullets: [
          {
            text: String.raw`**Antenna Height & Power:** Quarter-wave antenna height requirement: $l \approx \frac{\lambda}{4}$, and radiated power $P \propto \left(\frac{l}{\lambda}\right)^2$.`,
          },
          {
            text: '**Modulation Index:**',
            equations: [
              String.raw`\mu = \frac{A_m}{A_c} = \frac{A_{\max} - A_{\min}}{A_{\max} + A_{\min}}`,
            ],
          },
          {
            text: '**Sideband Frequencies & Bandwidth:**',
            equations: [
              String.raw`\text{USB} = f_c + f_m, \qquad \text{LSB} = f_c - f_m, \qquad \text{Bandwidth} = 2f_m`,
            ],
          },
          {
            text: String.raw`**Total Power in AM Wave:** $P_t = P_c\left(1 + \frac{\mu^2}{2}\right)$.`,
          },
        ],
        items: [
          {
            label: 'AM Modulation Index, Sidebands & Total Power',
            latex: String.raw`\mu = \frac{A_m}{A_c} = \frac{A_{\max}-A_{\min}}{A_{\max}+A_{\min}},\quad \text{BW} = 2f_m,\quad P_t = P_c\left(1 + \frac{\mu^2}{2}\right)`,
            formulaId: 'em-wave-eq',
          },
        ],
      },
    ],
  },
];
