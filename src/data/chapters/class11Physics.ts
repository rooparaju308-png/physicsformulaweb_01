import { Formula } from '../../types/physics';

export const CLASS_11_PHYSICS_FORMULAS: Formula[] = [
  {
    "id": "c11-units-dimensions-constants",
    "chapter": "c11-units-and-measurement",
    "subtopic": "Dimensions of Constants & Planck Units",
    "chain": "c11-units-and-measurement",
    "title": "Dimensions of Constants, Shortcut Groups & Planck Units",
    "latex": "[RC] = \\left[\\frac{L}{R}\\right] = [\\sqrt{LC}] = T;\\qquad \\left[\\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}}\\right] = \\left[\\frac{E}{B}\\right] = LT^{-1};\\qquad l_P = \\sqrt{\\frac{\\hbar G}{c^3}},\\ t_P = \\sqrt{\\frac{\\hbar G}{c^5}},\\ m_P = \\sqrt{\\frac{\\hbar c}{G}}",
    "conditions": [
      "Dimensional shortcuts: [RC] = [L/R] = [√(LC)] = T; [1/√(μ₀ε₀)] = [E/B] = c = LT⁻¹.",
      "Energy density [½ε₀E²] = [B²/(2μ₀)] = ML⁻¹T⁻².",
      "Planck units use ħ, G, c as fundamental base quantities. Express any mechanical dimension via product powers.",
      "Trigonometric, exponential, and logarithmic arguments must always be strictly dimensionless."
    ],
    "variables": [
      {
        "symbol": "LC",
        "meaning": "Inductance-Capacitance combination (dimension of time squared T²)"
      },
      {
        "symbol": "l_P, t_P, m_P",
        "meaning": "Planck length, Planck time, and Planck mass"
      },
      {
        "symbol": "\\hbar, G, c",
        "meaning": "Reduced Planck constant, gravitational constant, speed of light"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "What are the dimensions of √(LC), 1/√(μ₀ε₀), and the Planck length formula?",
      "back": "[√(LC)] = T (time); [1/√(μ₀ε₀)] = LT⁻¹ (speed of light); l_P = √(ħG/c³) (dimension L)."
    },
    "tags": [
      "units",
      "dimensions",
      "planck-units",
      "shortcuts",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-units-error-propagation",
    "chapter": "c11-units-and-measurement",
    "subtopic": "Error Analysis & Significant Digits",
    "chain": "c11-units-and-measurement",
    "title": "Error Propagation in Powers & Mean Absolute Uncertainty",
    "latex": "Z = \\frac{A^p B^q}{C^r} \\implies \\frac{\\Delta Z}{Z} = p\\frac{\\Delta A}{A} + q\\frac{\\Delta B}{B} + r\\frac{\\Delta C}{C};\\qquad \\Delta Z_{\\max} = \\sum \\left|\\frac{\\partial Z}{\\partial X_i}\\right| \\Delta X_i",
    "conditions": [
      "Errors NEVER cancel: even in quotients (A/B) or subtractions (A − B), fractional or absolute errors add.",
      "For small independent errors (< 10%), fractional errors add weighted by absolute powers.",
      "Significant digits: in multiplication/division, round to least s.f.; in addition/subtraction, round to least decimal places.",
      "Leading zeros after decimal are never significant (0.0025 has 2 s.f.)."
    ],
    "variables": [
      {
        "symbol": "\\Delta Z / Z",
        "meaning": "Maximum relative/fractional error in derived quantity Z"
      },
      {
        "symbol": "p, q, r",
        "meaning": "Powers of measured independent variables A, B, C"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "How do percentage errors propagate for Z = A^p B^q / C^r? Do errors in the denominator subtract?",
      "back": "%ΔZ = p(%ΔA) + q(%ΔB) + r(%ΔC). Errors NEVER subtract, they always add."
    },
    "tags": [
      "errors",
      "significant-figures",
      "uncertainty",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-units-vernier-screw-gauge",
    "chapter": "c11-units-and-measurement",
    "subtopic": "Vernier Calipers & Screw Gauge",
    "chain": "c11-units-and-measurement",
    "title": "Least Count, Zero Error & Corrected Reading of Instruments",
    "latex": "\\text{LC}_{\\text{vernier}} = \\frac{1\\text{ MSD}}{N};\\quad \\text{LC}_{\\text{screw}} = \\frac{\\text{Pitch}}{\\text{No. of circular divisions}};\\quad \\text{True Reading} = \\text{Observed} - (\\pm \\text{Zero Error})",
    "conditions": [
      "N vernier divisions = (N − 1) main scale divisions => LC = 1 MSD − 1 VSD = (1 MSD)/N.",
      "Positive zero error (vernier zero to right of main zero, or circular zero below reference line) must be SUBTRACTED.",
      "Negative zero error (vernier zero to left of main zero) has a negative sign; subtracting it ADDS to observed reading.",
      "Pitch is the axial distance advanced by screw in one complete 360° turn of the thimble."
    ],
    "variables": [
      {
        "symbol": "\\text{LC}",
        "meaning": "Least Count: minimum measurable dimension of instrument"
      },
      {
        "symbol": "N",
        "meaning": "Total number of vernier scale or circular divisions"
      },
      {
        "symbol": "\\text{Zero Error}",
        "meaning": "Systematic index error with algebraic sign"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Formulas for Least Count of Vernier Calipers and Screw Gauge? How is zero error applied?",
      "back": "Vernier LC = 1 MSD / N; Screw gauge LC = Pitch / Total circular divisions. True Reading = Observed − (Signed Zero Error)."
    },
    "tags": [
      "vernier",
      "screw-gauge",
      "least-count",
      "zero-error",
      "experimental",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-kinematics-1d-equations",
    "chapter": "c11-motion-in-a-straight-line",
    "subtopic": "Uniform Acceleration & nth-Second Displacement",
    "chain": "c11-motion-in-a-straight-line",
    "title": "Kinematics Equations & nth-Second Displacement Formula",
    "latex": "v = u + at,\\quad s = ut + \\frac{1}{2}at^2,\\quad v^2 = u^2 + 2as;\\qquad s_{n\\text{th}} = u + \\frac{a}{2}(2n - 1);\\qquad s = \\frac{u + v}{2}t",
    "conditions": [
      "Strictly applicable ONLY when acceleration a is constant in magnitude and direction.",
      "Displacement in nth second: s_nth has dimension of length (the hidden 1 second interval is suppressed in shorthand).",
      "Choose a positive coordinate direction at the start and maintain consistent algebraic signs for u, a, and s.",
      "Average velocity over interval equals (u + v)/2 ONLY for uniform acceleration."
    ],
    "variables": [
      {
        "symbol": "s_{n\\text{th}}",
        "meaning": "Displacement during the nth second interval (m)"
      },
      {
        "symbol": "u, v",
        "meaning": "Initial and final velocities (m/s)"
      },
      {
        "symbol": "a",
        "meaning": "Uniform linear acceleration (m/s²)"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "What is the displacement formula for the nth second of uniformly accelerated motion?",
      "back": "s_nth = u + (a/2)(2n − 1). Valid only for constant acceleration a."
    },
    "tags": [
      "kinematics",
      "1d-motion",
      "nth-second",
      "acceleration",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-kinematics-calculus-variable",
    "chapter": "c11-motion-in-a-straight-line",
    "subtopic": "Variable Acceleration & Calculus Form",
    "chain": "c11-motion-in-a-straight-line",
    "title": "Calculus Kinematics: a(t), v(x) and Turning Point Analysis",
    "latex": "v = \\frac{dx}{dt},\\quad a = \\frac{dv}{dt} = v\\frac{dv}{dx} = \\frac{d^2x}{dt^2};\\qquad \\Delta x = \\int v\\,dt,\\quad \\Delta v = \\int a\\,dt",
    "conditions": [
      "When a = f(t), integrate dv = a(t) dt. When a = f(x), use a = v(dv/dx) => ∫ v dv = ∫ a(x) dx.",
      "Area under v–t curve gives displacement; area of |v|–t gives total distance travelled.",
      "Turning point occurs when instantaneous velocity v = 0, but acceleration a may be non-zero.",
      "Slope of v–x curve times velocity gives acceleration: a = v · (dv/dx)."
    ],
    "variables": [
      {
        "symbol": "a = v\\frac{dv}{dx}",
        "meaning": "Acceleration expressed as a function of position x"
      },
      {
        "symbol": "\\Delta x",
        "meaning": "Displacement from definite integral of velocity"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "How do you find acceleration when velocity is given as a function of position v(x)?",
      "back": "a = v (dv/dx). Integral form: ∫ v dv = ∫ a dx."
    },
    "tags": [
      "calculus",
      "variable-acceleration",
      "turning-point",
      "graphs",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-kinematics-free-fall-galileo",
    "chapter": "c11-motion-in-a-straight-line",
    "subtopic": "Free Fall & Galileo Odd Number Law",
    "chain": "c11-motion-in-a-straight-line",
    "title": "Free Fall Max Height, Flight Time & Galileo Odd Numbers",
    "latex": "H_{\\max} = \\frac{u^2}{2g},\\quad t_{\\text{up}} = t_{\\text{down}} = \\frac{u}{g};\\quad d_s = \\frac{u^2}{2a};\\quad s_1 : s_2 : s_3 : \\ldots = 1 : 3 : 5 : 7 \\ldots",
    "conditions": [
      "Near Earth surface under gravity with no air drag: a = −g ≈ 9.8 m/s² downwards.",
      "Body dropped from rest covers distances in successive equal time intervals in ratio 1 : 3 : 5 : 7... (Galileo law).",
      "Body dropped from an ascending balloon or lift begins with the instantaneous velocity of the vehicle.",
      "Stopping distance d_s ∝ u²: doubling vehicle speed quadruples stopping distance under same braking force."
    ],
    "variables": [
      {
        "symbol": "H_{\\max}",
        "meaning": "Maximum height reached above projection point (m)"
      },
      {
        "symbol": "d_s",
        "meaning": "Stopping distance under constant retardation a"
      }
    ],
    "derivedFrom": [
      "c11-kinematics-1d-equations"
    ],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "What is Galileo’s law of odd numbers in free fall from rest? How does stopping distance scale with speed?",
      "back": "Distances in successive equal intervals are in ratio 1 : 3 : 5 : 7... Stopping distance d_s ∝ u²."
    },
    "tags": [
      "free-fall",
      "galileo-law",
      "stopping-distance",
      "gravity",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-projectile-ground-to-ground",
    "chapter": "c11-motion-in-a-plane",
    "subtopic": "Projectile Flight, Range & Height",
    "chain": "c11-motion-in-a-plane",
    "title": "Ground-to-Ground Projectile Motion & Complementary Angles",
    "latex": "T = \\frac{2u\\sin\\theta}{g},\\quad H = \\frac{u^2\\sin^2\\theta}{2g},\\quad R = \\frac{u^2\\sin 2\\theta}{g};\\qquad R = 4H\\cot\\theta,\\quad T_1 T_2 = \\frac{2R}{g}",
    "conditions": [
      "Horizontal acceleration a_x = 0; vertical acceleration a_y = −g (ideal vacuum projectile).",
      "Complementary projection angles θ and (90° − θ) give identical horizontal range R.",
      "Product of times of flight for complementary angles: T₁T₂ = 2R/g.",
      "Maximum horizontal range R_max = u²/g achieved at θ = 45°, where H = R/4.",
      "At peak: velocity is horizontal v = u cosθ, KE = K_0 cos²θ."
    ],
    "variables": [
      {
        "symbol": "T",
        "meaning": "Total time of flight (s)"
      },
      {
        "symbol": "H",
        "meaning": "Maximum vertical height attained (m)"
      },
      {
        "symbol": "R",
        "meaning": "Horizontal range on level ground (m)"
      },
      {
        "symbol": "\\theta",
        "meaning": "Angle of projection with horizontal"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "What is the relation between Range R, Max Height H, and the product of flight times T₁T₂ for complementary angles?",
      "back": "R = 4H cotθ; T₁T₂ = 2R/g. R_max = u²/g at θ = 45°."
    },
    "tags": [
      "projectile",
      "range",
      "time-of-flight",
      "complementary-angles",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-projectile-trajectory-height",
    "chapter": "c11-motion-in-a-plane",
    "subtopic": "Trajectory Equation & Horizontal Launch",
    "chain": "c11-motion-in-a-plane",
    "title": "Equation of Trajectory & Horizontal Projection from Height",
    "latex": "y = x\\tan\\theta - \\frac{gx^2}{2u^2\\cos^2\\theta} = x\\tan\\theta\\left(1 - \\frac{x}{R}\\right);\\qquad t = \\sqrt{\\frac{2h}{g}},\\quad R_{\\text{horiz}} = u\\sqrt{\\frac{2h}{g}}",
    "conditions": [
      "Trajectory equation y(x) is a concave downward parabola passing through (0, 0) and (R, 0).",
      "For horizontal launch from cliff of height h: initial vertical velocity u_y = 0, time to ground t = √(2h/g).",
      "Instantaneous angle of velocity vector: tan α = v_y / v_x = (u sinθ − gt) / (u cosθ).",
      "Speed on ground after horizontal launch: v = √(u² + 2gh)."
    ],
    "variables": [
      {
        "symbol": "y(x)",
        "meaning": "Vertical displacement at horizontal position x"
      },
      {
        "symbol": "R_{\\text{horiz}}",
        "meaning": "Horizontal range for horizontal launch from cliff of height h"
      }
    ],
    "derivedFrom": [
      "c11-projectile-ground-to-ground"
    ],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "What is the equation of projectile trajectory in terms of Range R? Time of flight for horizontal launch from height h?",
      "back": "y = x tanθ (1 − x/R). For horizontal launch: t = √(2h/g) and range = u√(2h/g)."
    },
    "tags": [
      "trajectory",
      "horizontal-launch",
      "cliff-projectile",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-relative-motion-river-rain",
    "chapter": "c11-motion-in-a-plane",
    "subtopic": "Relative Velocity: River Crossing & Rain-Man",
    "chain": "c11-motion-in-a-plane",
    "title": "River Swimmer Minimum Time, Shortest Drift & Umbrella Tilt",
    "latex": "\\vec v_{AB} = \\vec v_A - \\vec v_B;\\quad t_{\\min} = \\frac{d}{v_b}\\ (\\text{drift } x = v_r\\frac{d}{v_b});\\quad \\sin\\theta = \\frac{v_r}{v_b},\\ t = \\frac{d}{\\sqrt{v_b^2 - v_r^2}};\\quad \\tan\\alpha = \\frac{v_m}{v_r}",
    "conditions": [
      "Minimum crossing time: head straight across perpendicular to flow (drift = v_river · d / v_boat).",
      "Shortest path (zero drift): swim upstream at sinθ = v_r / v_b (possible ONLY if v_boat > v_river).",
      "Rain-man: velocity of rain relative to man is v_rm = v_rain − v_man. Tilt umbrella along v_rm.",
      "Circular relative velocity: angular velocity of particle A about B is ω_AB = (v_A⊥ − v_B⊥) / r_AB."
    ],
    "variables": [
      {
        "symbol": "v_b, v_r",
        "meaning": "Speed of boat relative to still water, and speed of river flow"
      },
      {
        "symbol": "d",
        "meaning": "Width of the river (m)"
      },
      {
        "symbol": "v_m",
        "meaning": "Speed of running man (m/s)"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Conditions for minimum crossing time vs zero drift in river crossing?",
      "back": "Min time: head ⊥ to river bank, t_min = d/v_b. Zero drift: head upstream at sinθ = v_r/v_b (requires v_b > v_r)."
    },
    "tags": [
      "relative-velocity",
      "river-boat",
      "rain-man",
      "drift",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-nlm-second-law-atwood",
    "chapter": "c11-laws-of-motion",
    "subtopic": "Newton's Laws, Momentum & Atwood Machine",
    "chain": "c11-laws-of-motion",
    "title": "Atwood Machine, Impulse & Pseudo Force in Accelerating Frames",
    "latex": "\\vec F_{\\text{net}} = \\frac{d\\vec p}{dt} = m\\vec a;\\quad \\vec J = \\int \\vec F\\,dt = \\Delta \\vec p;\\quad a = \\frac{m_1 - m_2}{m_1 + m_2}g,\\ T = \\frac{2m_1 m_2}{m_1 + m_2}g;\\quad \\vec F_{\\text{pseudo}} = -m\\vec a_0",
    "conditions": [
      "Light ideal string has uniform tension throughout; light ideal frictionless pulley has zero net torque.",
      "Atwood machine acceleration a = (m₁ − m₂)g / (m₁ + m₂); tension T = 2m₁m₂g / (m₁ + m₂).",
      "In a non-inertial frame accelerating with a₀, add pseudo force −m a₀ to all bodies.",
      "Variable mass (rocket propulsion): F_thrust = v_rel · (dm/dt)."
    ],
    "variables": [
      {
        "symbol": "\\vec J",
        "meaning": "Impulse of force: area under F–t curve (N·s)"
      },
      {
        "symbol": "T",
        "meaning": "Tension in string of Atwood system (N)"
      },
      {
        "symbol": "\\vec F_{\\text{pseudo}}",
        "meaning": "Fictitious inertia force in frame of acceleration a₀"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Formulas for acceleration and string tension in a standard Atwood machine?",
      "back": "a = (m₁ − m₂)g / (m₁ + m₂); T = 2m₁m₂g / (m₁ + m₂). Pseudo force is −m a_frame."
    },
    "tags": [
      "newton-laws",
      "atwood-machine",
      "impulse",
      "pseudo-force",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-friction-incline-minimum-force",
    "chapter": "c11-laws-of-motion",
    "subtopic": "Friction, Incline Dynamics & Minimum Pull",
    "chain": "c11-laws-of-motion",
    "title": "Rough Incline Time Ratio, Angle of Repose & Minimum Pulling Force",
    "latex": "f_s \\le \\mu_s N,\\ f_k = \\mu_k N;\\quad \\theta_{\\text{repose}} = \\tan^{-1}\\mu_s;\\quad \\mu_k = \\tan\\theta\\left(1 - \\frac{1}{n^2}\\right);\\quad F_{\\min} = \\frac{\\mu mg}{\\sqrt{1 + \\mu^2}}",
    "conditions": [
      "Static friction is self-adjusting: 0 ≤ f_s ≤ μ_s N. Kinetic friction f_k = μ_k N opposes relative slip.",
      "Angle of repose: block just starts sliding when tilt angle tanθ = μ_s.",
      "If time on rough incline is n times smooth incline: μ_k = tanθ (1 − 1/n²).",
      "Minimum force to pull a block on a horizontal rough surface: F_min = μmg / √(1 + μ²) at angle tanθ = μ above horizontal."
    ],
    "variables": [
      {
        "symbol": "n",
        "meaning": "Ratio of time taken on rough incline to that on smooth incline"
      },
      {
        "symbol": "F_{\\min}",
        "meaning": "Minimum force magnitude required to initiate or maintain motion"
      },
      {
        "symbol": "\\mu_s, \\mu_k",
        "meaning": "Coefficients of static and kinetic friction (μ_s > μ_k)"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Formula for coefficient of friction if time to slide down a rough incline is n times that of a smooth incline? What is minimum pulling force on flat ground?",
      "back": "μ_k = tanθ (1 − 1/n²). Minimum pulling force: F_min = μmg / √(1 + μ²) at tanθ = μ."
    },
    "tags": [
      "friction",
      "angle-of-repose",
      "incline",
      "minimum-force",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-circular-dynamics-banking-vertical",
    "chapter": "c11-laws-of-motion",
    "subtopic": "Banked Road & Vertical Circular Motion",
    "chain": "c11-laws-of-motion",
    "title": "Banked Curves, Conical Pendulum & Vertical Circle Slack Bounds",
    "latex": "v_{\\text{banked}} = \\sqrt{rg\\frac{\\mu + \\tan\\theta}{1 - \\mu\\tan\\theta}};\\quad T_{\\text{bot}} - T_{\\text{top}} = 6mg;\\quad v_{\\text{bottom}} \\ge \\sqrt{5gr};\\quad \\text{Slack: } \\sqrt{2gr} < v_{\\text{bottom}} < \\sqrt{5gr}",
    "conditions": [
      "Unbanked flat curve max safe speed: v_max = √(μ_s rg).",
      "Optimum banking speed without friction: v_0 = √(rg tanθ).",
      "Vertical circle (string): complete loop requires v_bot ≥ √(5gr) and v_top ≥ √(gr).",
      "String goes slack before top (oscillates or leaves circle) if √(2gr) < v_bot < √(5gr). Oscillates as pendulum if v_bot ≤ √(2gr).",
      "Tension difference between bottom and top of complete vertical circle is always exactly 6mg."
    ],
    "variables": [
      {
        "symbol": "v_{\\text{banked}}",
        "meaning": "Maximum safe negotiation speed on banked rough curve"
      },
      {
        "symbol": "T_{\\text{bot}} - T_{\\text{top}}",
        "meaning": "Difference in string tension between lowest and highest points"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "What are the critical bottom speeds for a vertical circle with string (complete circle, slack, pure oscillation)?",
      "back": "Complete circle: v_bot ≥ √(5gr). String slacks: √(2gr) < v_bot < √(5gr). Pure oscillation: v_bot ≤ √(2gr). T_bot − T_top = 6mg."
    },
    "tags": [
      "circular-motion",
      "banking",
      "vertical-circle",
      "tension-difference",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-wep-work-energy-power",
    "chapter": "c11-work-energy-and-power",
    "subtopic": "Work-Energy Theorem & Instantaneous Power",
    "chain": "c11-work-energy-and-power",
    "title": "Work-Energy Theorem & Instantaneous Mechanical Power",
    "latex": "W_{\\text{net}} = \\Delta K = \\frac{1}{2}mv_f^2 - \\frac{1}{2}mv_i^2;\\quad W = \\int \\vec F\\cdot d\\vec r;\\quad P = \\frac{dW}{dt} = \\vec F\\cdot\\vec v = Fv\\cos\\theta",
    "conditions": [
      "Work-energy theorem holds in all inertial frames and includes work done by ALL forces: conservative, non-conservative, and pseudo.",
      "Work done by variable force equals area under F–x curve.",
      "Instantaneous power P = F · v: for vehicle accelerating under constant power P, velocity v(t) = √(2Pt/m) and x(t) ∝ t^(3/2).",
      "Work done by static friction on a rolling body with no slip is zero."
    ],
    "variables": [
      {
        "symbol": "W_{\\text{net}}",
        "meaning": "Net work done by all acting forces (Joules)"
      },
      {
        "symbol": "P",
        "meaning": "Instantaneous mechanical power delivered (Watts)"
      },
      {
        "symbol": "\\vec F\\cdot\\vec v",
        "meaning": "Dot product of force vector and instantaneous velocity"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "State the Work-Energy Theorem and the formula for instantaneous power. How does velocity scale with time under constant power?",
      "back": "W_net = ΔK. P = F · v. For vehicle starting from rest under constant power: v(t) = √(2Pt/m) ∝ t^(1/2)."
    },
    "tags": [
      "work-energy",
      "kinetic-energy",
      "power",
      "constant-power",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-wep-potential-energy-equilibrium",
    "chapter": "c11-work-energy-and-power",
    "subtopic": "Potential Energy & Types of Equilibrium",
    "chain": "c11-work-energy-and-power",
    "title": "Conservative Force F = −dU/dx & Stability of Equilibrium",
    "latex": "F = -\\frac{dU}{dx};\\quad U_{\\text{spring}} = \\frac{1}{2}kx^2;\\quad \\text{Equilibrium: } \\frac{dU}{dx} = 0;\\quad \\frac{d^2U}{dx^2} > 0\\ (\\text{Stable}),\\ \\frac{d^2U}{dx^2} < 0\\ (\\text{Unstable})",
    "conditions": [
      "Potential energy U is defined ONLY for conservative forces via F = −dU/dx (or F = −∇U in 3D).",
      "Spring potential energy U = ½ k x² (always positive whether compressed or stretched).",
      "Equilibrium condition: net force F = 0 => dU/dx = 0.",
      "Stable equilibrium: local potential minimum (d²U/dx² > 0); small displacement produces restoring force (SHM).",
      "Unstable equilibrium: local potential maximum (d²U/dx² < 0); neutral equilibrium: d²U/dx² = 0."
    ],
    "variables": [
      {
        "symbol": "U(x)",
        "meaning": "Potential energy function of position (J)"
      },
      {
        "symbol": "k",
        "meaning": "Spring constant / stiffness coefficient (N/m)"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "How is conservative force related to potential energy U(x)? What are the mathematical tests for stable and unstable equilibrium?",
      "back": "F = −dU/dx. Equilibrium: dU/dx = 0. Stable: d²U/dx² > 0 (U minimum). Unstable: d²U/dx² < 0 (U maximum)."
    },
    "tags": [
      "potential-energy",
      "conservative-force",
      "equilibrium",
      "stability",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-wep-collisions-restitution",
    "chapter": "c11-work-energy-and-power",
    "subtopic": "Collisions in 1D & Loss of Kinetic Energy",
    "chain": "c11-work-energy-and-power",
    "title": "Coefficient of Restitution & Inelastic Kinetic Energy Loss",
    "latex": "e = \\frac{v_2 - v_1}{u_1 - u_2};\\quad \\Delta K_{\\text{loss}} = \\frac{1}{2}\\frac{m_1 m_2}{m_1 + m_2}(u_1 - u_2)^2 (1 - e^2);\\quad h_n = e^{2n}h_0,\\ v_n = e^n v_0",
    "conditions": [
      "Total linear momentum is ALWAYS conserved during collisions (no external net impulsive force).",
      "e = 1: perfectly elastic (KE conserved); e = 0: perfectly inelastic (bodies stick together, max KE loss); 0 < e < 1: inelastic.",
      "Ball bouncing repeatedly on floor from height h₀: height after nth bounce is h_n = e^(2n) h₀; total distance S = h₀ (1 + e²)/(1 − e²).",
      "Total time until bouncing ceases: T_total = √(2h₀/g) · (1 + e)/(1 − e)."
    ],
    "variables": [
      {
        "symbol": "e",
        "meaning": "Newtonian coefficient of restitution (velocity of separation / velocity of approach)"
      },
      {
        "symbol": "\\Delta K_{\\text{loss}}",
        "meaning": "Kinetic energy converted to heat/deformation in inelastic collision"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Formula for kinetic energy loss in 1D collision with restitution e? Total distance for ball bouncing on floor?",
      "back": "ΔK_loss = ½ [m₁m₂/(m₁+m₂)] (u₁ − u₂)² (1 − e²). Total distance S = h₀(1 + e²)/(1 − e²)."
    },
    "tags": [
      "collisions",
      "restitution",
      "kinetic-energy-loss",
      "bouncing-ball",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-rot-centre-of-mass",
    "chapter": "c11-system-of-particles-and-rotational-motion",
    "subtopic": "Centre of Mass of Standard Bodies",
    "chain": "c11-system-of-particles-and-rotational-motion",
    "title": "Centre of Mass Coordinates & Standard Continuous Geometries",
    "latex": "\\vec r_{\\text{cm}} = \\frac{\\sum m_i\\vec r_i}{\\sum m_i} = \\frac{1}{M}\\int \\vec r\\,dm;\\quad y_{\\text{semi-ring}} = \\frac{2R}{\\pi},\\ y_{\\text{semi-disc}} = \\frac{4R}{3\\pi},\\ y_{\\text{hemi-shell}} = \\frac{R}{2},\\ y_{\\text{solid-hemi}} = \\frac{3R}{8}",
    "conditions": [
      "Internal forces cannot accelerate the centre of mass: a_cm = F_ext / M.",
      "Semicircular thin wire/ring: y_cm = 2R/π from diameter base.",
      "Semicircular uniform plate/disc: y_cm = 4R/(3π) from base.",
      "Hemispherical hollow shell: y_cm = R/2; Solid uniform hemisphere: y_cm = 3R/8.",
      "Solid uniform cone: y_cm = h/4 from base (or 3h/4 from vertex). Hollow cone: y_cm = h/3 from base."
    ],
    "variables": [
      {
        "symbol": "\\vec r_{\\text{cm}}",
        "meaning": "Position vector of the mass centre of system"
      },
      {
        "symbol": "y_{\\text{semi-disc}}",
        "meaning": "Height of centre of mass of semicircular disc of radius R"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "What are the COM heights from base for: semicircular ring, semicircular disc, solid hemisphere, and solid cone?",
      "back": "Semi-ring: 2R/π. Semi-disc: 4R/(3π). Solid hemisphere: 3R/8. Solid cone: h/4."
    },
    "tags": [
      "centre-of-mass",
      "continuous-bodies",
      "standard-geometries",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-rot-moment-of-inertia",
    "chapter": "c11-system-of-particles-and-rotational-motion",
    "subtopic": "Moment of Inertia & Parallel/Perpendicular Theorems",
    "chain": "c11-system-of-particles-and-rotational-motion",
    "title": "Moment of Inertia Theorems & Master Geometrical Values",
    "latex": "I = \\sum m_i r_i^2 = \\int r^2\\,dm;\\quad I = I_{\\text{cm}} + Md^2;\\quad I_z = I_x + I_y\\ (\\text{planar});\\quad I_{\\text{solid sphere}} = \\frac{2}{5}MR^2,\\ I_{\\text{disc}} = \\frac{1}{2}MR^2",
    "conditions": [
      "Perpendicular axis theorem (I_z = I_x + I_y) applies ONLY to flat 2D planar lamina bodies.",
      "Parallel axis theorem (I = I_cm + Md²) requires the first axis to pass through the CENTRE OF MASS.",
      "Ring/Hollow cylinder: I_axis = MR²; Disc/Solid cylinder: I_axis = ½ MR².",
      "Solid sphere: I_diam = 2/5 MR²; Hollow spherical shell: I_diam = 2/3 MR².",
      "Thin rod: I_centre = 1/12 ML²; I_end = 1/3 ML²."
    ],
    "variables": [
      {
        "symbol": "I_{\\text{cm}}",
        "meaning": "Moment of inertia about axis through COM"
      },
      {
        "symbol": "d",
        "meaning": "Perpendicular distance between parallel axes"
      },
      {
        "symbol": "k = \\sqrt{I/M}",
        "meaning": "Radius of gyration of the body"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Moments of inertia of solid sphere, hollow sphere, uniform disc, and thin rod about its end?",
      "back": "Solid sphere: 2/5 MR². Hollow sphere: 2/3 MR². Disc: 1/2 MR². Rod about end: 1/3 ML²."
    },
    "tags": [
      "moment-of-inertia",
      "parallel-axis",
      "perpendicular-axis",
      "rotation",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-rot-pure-rolling",
    "chapter": "c11-system-of-particles-and-rotational-motion",
    "subtopic": "Rolling Motion on Inclines & Angular Momentum",
    "chain": "c11-system-of-particles-and-rotational-motion",
    "title": "Pure Rolling Kinetic Energy, Incline Acceleration & Torque",
    "latex": "K_{\\text{roll}} = \\frac{1}{2}Mv_{\\text{cm}}^2\\left(1 + \\frac{k^2}{R^2}\\right);\\quad a = \\frac{g\\sin\\theta}{1 + \\frac{k^2}{R^2}};\\quad \\mu_{\\min} = \\frac{\\tan\\theta}{1 + \\frac{R^2}{k^2}};\\quad \\vec\\tau = I\\vec\\alpha,\\ \\vec L = I\\vec\\omega",
    "conditions": [
      "Pure rolling on stationary surface: contact point instantaneous velocity is zero => v_cm = Rω and a_cm = Rα.",
      "Total rolling kinetic energy splits into translation and rotation: K_trans / K_total = 1 / (1 + k²/R²).",
      "Race down an incline: smaller k²/R² rolls faster. Order of reaching bottom: Solid sphere (0.4) > Disc (0.5) > Hollow sphere (0.67) > Ring (1.0).",
      "Static friction provides torque for pure rolling; if μ < μ_min, slipping occurs with a_slip = g(sinθ − μ_k cosθ)."
    ],
    "variables": [
      {
        "symbol": "k^2/R^2",
        "meaning": "Shape factor: 2/5 (solid sphere), 1/2 (disc), 2/3 (shell), 1 (ring)"
      },
      {
        "symbol": "\\mu_{\\min}",
        "meaning": "Minimum static friction coefficient to prevent slipping on incline θ"
      }
    ],
    "derivedFrom": [
      "c11-rot-moment-of-inertia"
    ],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Formula for acceleration of a body pure rolling down an incline of angle θ? Which shape reaches the bottom first?",
      "back": "a = g sinθ / (1 + k²/R²). Solid sphere arrives first (k²/R² = 0.4), ring arrives last (k²/R² = 1.0)."
    },
    "tags": [
      "rolling",
      "incline-race",
      "shape-factor",
      "angular-momentum",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-grav-field-potential-ring-sphere",
    "chapter": "c11-gravitation",
    "subtopic": "Gravitational Field & Potential: Ring & Sphere",
    "chain": "c11-gravitation",
    "title": "Field & Potential of Ring on Axis and Uniform Solid Sphere",
    "latex": "E_{\\text{ring}}(x) = \\frac{GMx}{(a^2 + x^2)^{3/2}}\\ \\left(\\max\\text{ at } x = \\frac{a}{\\sqrt{2}}\\right);\\quad V_{\\text{solid}}(r \\le R) = -\\frac{GM}{2R^3}(3R^2 - r^2);\\quad V(0) = -\\frac{3}{2}\\frac{GM}{R}",
    "conditions": [
      "Gravitational field of uniform ring on its axis: zero at centre (x = 0), maximum at x = a/√2 with E_max = 2GM / (3√3 a²).",
      "Thin spherical shell: field inside E = 0; potential inside is constant V = −GM/R.",
      "Uniform solid sphere: inside field E(r) = GMr/R³ (linear with r); inside potential is parabolic.",
      "Potential at centre of solid uniform sphere is 1.5 times the potential at the surface: V(0) = 1.5 V_surface."
    ],
    "variables": [
      {
        "symbol": "a",
        "meaning": "Radius of gravitating mass ring (m)"
      },
      {
        "symbol": "x = a/\\sqrt{2}",
        "meaning": "Axial distance where ring gravitational field attains absolute maximum"
      },
      {
        "symbol": "V(0)",
        "meaning": "Gravitational potential at the exact centre of a solid sphere"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "At what axial distance is the gravitational field of a ring of radius a maximum? What is potential at centre of solid sphere?",
      "back": "Maximum field at x = a/√2. Potential at centre of solid sphere is V(0) = −(3/2)(GM/R) = 1.5 V_surface."
    },
    "tags": [
      "gravitation",
      "ring-field",
      "solid-sphere",
      "potential",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-grav-variation-of-g",
    "chapter": "c11-gravitation",
    "subtopic": "Variation of g with Altitude, Depth & Latitude",
    "chain": "c11-gravitation",
    "title": "Acceleration Due to Gravity: Height, Depth & Earth Rotation",
    "latex": "g_h = g\\left(1 + \\frac{h}{R}\\right)^{-2} \\approx g\\left(1 - \\frac{2h}{R}\\right)\\ (h \\ll R);\\quad g_d = g\\left(1 - \\frac{d}{R}\\right);\\quad g' = g - \\omega^2 R\\cos^2\\lambda",
    "conditions": [
      "Variation with height: exact is g_h = g R² / (R + h)². Approximation g(1 − 2h/R) valid ONLY when h ≪ R (error < 5% for h < 320 km).",
      "Variation with depth: g_d = g(1 − d/R) is strictly linear and exact at all depths; at centre d = R => g = 0.",
      "Earth rotation reduces effective g: maximum reduction at equator (λ = 0° => g_eq = g − ω²R), zero reduction at poles (λ = 90° => g_pole = g).",
      "If Earth rotated 17 times faster (ω = √(g/R)), bodies at the equator would become weightless."
    ],
    "variables": [
      {
        "symbol": "g_h, g_d",
        "meaning": "Acceleration due to gravity at altitude h and depth d"
      },
      {
        "symbol": "\\lambda",
        "meaning": "Latitude angle measured from the equator"
      },
      {
        "symbol": "\\omega",
        "meaning": "Angular speed of Earth rotation (7.29 × 10⁻⁵ rad/s)"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "How does g vary with height h (small h) and depth d? What is the effect of Earth’s rotation at latitude λ?",
      "back": "Height: g_h ≈ g(1 − 2h/R). Depth: g_d = g(1 − d/R). Latitude: g' = g − ω²R cos²λ (max at poles, min at equator)."
    },
    "tags": [
      "gravity",
      "variation-of-g",
      "depth",
      "latitude",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-grav-escape-orbital-kepler",
    "chapter": "c11-gravitation",
    "subtopic": "Orbital Speed, Escape Velocity & Kepler 3rd Law",
    "chain": "c11-gravitation",
    "title": "Escape Speed, Satellite Orbits & Total Mechanical Energy",
    "latex": "v_e = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR} = \\sqrt{2}v_o \\approx 11.2\\text{ km/s};\\quad v_o = \\sqrt{\\frac{GM}{r}};\\quad T^2 = \\frac{4\\pi^2}{GM}r^3;\\quad E = -K = \\frac{1}{2}U = -\\frac{GMm}{2r}",
    "conditions": [
      "Escape speed from Earth surface is independent of mass of launched body and angle of projection: v_e = √(2gR) ≈ 11.2 km/s.",
      "Escape speed from surface is √2 times the near-surface orbital velocity: v_e = √2 v_o.",
      "Kepler’s 3rd Law: T² ∝ r³ (where r is semi-major axis of orbit).",
      "Bound satellite energy: kinetic K = GMm/(2r), potential U = −GMm/r, total E = −GMm/(2r). Binding Energy = |E| = GMm/(2r)."
    ],
    "variables": [
      {
        "symbol": "v_e, v_o",
        "meaning": "Escape velocity from surface and circular orbital speed at radius r"
      },
      {
        "symbol": "E, K, U",
        "meaning": "Total mechanical, kinetic, and gravitational potential energy of satellite"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Relation between escape velocity v_e and orbital velocity v_o? What is the relation between K, U, and total energy E of satellite?",
      "back": "v_e = √2 v_o ≈ 11.2 km/s. E = −K = ½ U = −GMm/(2r). Binding energy is |E|."
    },
    "tags": [
      "escape-velocity",
      "orbital-speed",
      "kepler-law",
      "satellite-energy",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-solids-hooke-moduli",
    "chapter": "c11-mechanical-properties-of-solids",
    "subtopic": "Hooke's Law & Elastic Moduli",
    "chain": "c11-mechanical-properties-of-solids",
    "title": "Hooke's Law, Young's, Bulk, Shear Moduli & Poisson's Ratio",
    "latex": "Y = \\frac{FL}{A\\Delta L};\\quad B = -V\\frac{\\Delta P}{\\Delta V};\\quad \\eta = \\frac{F/A}{\\theta};\\quad \\sigma = -\\frac{\\Delta d/d}{\\Delta L/L};\\quad Y = 3B(1 - 2\\sigma) = 2\\eta(1 + \\sigma)",
    "conditions": [
      "Hooke’s law (stress ∝ strain) is valid strictly within the proportional elastic limit.",
      "Young’s modulus Y applies to longitudinal stress/strain (solids only). Bulk modulus B applies to solids, liquids, gases.",
      "Compressibility K = 1/B. For an incompressible fluid, B → ∞ and compressibility K = 0.",
      "Poisson’s ratio σ: theoretical limits −1 < σ < 0.5; practical physical limits 0 < σ < 0.5 (for rubber σ ≈ 0.5)."
    ],
    "variables": [
      {
        "symbol": "Y, B, \\eta",
        "meaning": "Young’s modulus, Bulk modulus, and Shear modulus (N/m² or Pa)"
      },
      {
        "symbol": "\\sigma",
        "meaning": "Poisson’s ratio: lateral strain / longitudinal strain (dimensionless)"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Definitions and units of Young's Modulus Y, Bulk Modulus B, and Poisson's ratio σ?",
      "back": "Y = FL/(AΔL); B = −V(ΔP/ΔV); σ = −(Δd/d)/(ΔL/L). Y, B, η have unit N/m²; σ is dimensionless (practical range 0 to 0.5)."
    },
    "tags": [
      "elasticity",
      "youngs-modulus",
      "bulk-modulus",
      "poissons-ratio",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-solids-energy-density-thermal",
    "chapter": "c11-mechanical-properties-of-solids",
    "subtopic": "Elastic Energy Density & Thermal Stress",
    "chain": "c11-mechanical-properties-of-solids",
    "title": "Elastic Energy Density, Wire Sag & Clamped Thermal Stress",
    "latex": "u = \\frac{1}{2}\\sigma\\varepsilon = \\frac{1}{2}Y\\varepsilon^2 = \\frac{\\sigma^2}{2Y};\\quad U = \\frac{1}{2}F\\Delta L;\\quad \\Delta L_{\\text{self}} = \\frac{\\rho g L^2}{2Y} = \\frac{MgL}{2AY};\\quad \\sigma_{\\text{thermal}} = Y\\alpha\\Delta T",
    "conditions": [
      "Strain energy density u is potential energy per unit volume: area under stress–strain curve in elastic region.",
      "Elongation of heavy suspended vertical wire due to its own weight: ΔL = ρgL²/(2Y) = MgL/(2AY) (half of equivalent tip load).",
      "Thermal stress in a rigidly clamped rod: rod cannot expand => compressive thermal stress σ = Y α ΔT.",
      "Thermal force exerted on rigid clamps: F = Y A α ΔT."
    ],
    "variables": [
      {
        "symbol": "u",
        "meaning": "Elastic strain energy density: energy per unit volume (J/m³)"
      },
      {
        "symbol": "\\Delta L_{\\text{self}}",
        "meaning": "Elongation produced by gravitational self-weight of uniform wire"
      },
      {
        "symbol": "\\sigma_{\\text{thermal}}",
        "meaning": "Thermal stress developed when free expansion is prevented"
      }
    ],
    "derivedFrom": [
      "c11-solids-hooke-moduli"
    ],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Formulas for elastic strain energy density u, wire elongation under own weight, and thermal stress?",
      "back": "u = ½ stress × strain = ½ Y(strain)². Elongation under own weight: ΔL = ρgL²/(2Y). Thermal stress: σ = YαΔT."
    },
    "tags": [
      "strain-energy",
      "thermal-stress",
      "self-weight-elongation",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-fluids-hydrostatic-buoyancy",
    "chapter": "c11-mechanical-properties-of-fluids",
    "subtopic": "Hydrostatic Pressure & Archimedes Principle",
    "chain": "c11-mechanical-properties-of-fluids",
    "title": "Hydrostatic Pressure Variation & Archimedes Buoyant Force",
    "latex": "P = P_0 + \\rho g h;\\quad F_B = \\rho_{\\text{fluid}} V_{\\text{sub}} g;\\quad \\frac{V_{\\text{sub}}}{V_{\\text{total}}} = \\frac{\\rho_{\\text{body}}}{\\rho_{\\text{fluid}}};\\quad P_{\\text{gauge}} = \\rho gh",
    "conditions": [
      "Hydrostatic pressure depends solely on vertical depth h and fluid density ρ, NOT on shape of container (hydrostatic paradox).",
      "Pascal’s Law: pressure change applied to enclosed fluid is transmitted undiminished in all directions (hydraulic lift: F₁/A₁ = F₂/A₂).",
      "Archimedes principle: buoyant force equals weight of displaced fluid, acting upwards through centre of buoyancy.",
      "Floating equilibrium: fraction of submerged volume equals density ratio ρ_body / ρ_fluid."
    ],
    "variables": [
      {
        "symbol": "P_0",
        "meaning": "Atmospheric pressure (1.013 × 10⁵ Pa)"
      },
      {
        "symbol": "F_B",
        "meaning": "Archimedes upthrust / buoyant force (N)"
      },
      {
        "symbol": "V_{\\text{sub}}",
        "meaning": "Volume of floating body submerged inside fluid"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "State Pascal’s Law and Archimedes’ Principle. What fraction of volume is submerged for a floating body?",
      "back": "P = P₀ + ρgh. Buoyant force F_B = ρ_fluid V_sub g. Fraction submerged: V_sub / V_total = ρ_body / ρ_fluid."
    },
    "tags": [
      "hydrostatics",
      "pascals-law",
      "archimedes",
      "buoyancy",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-fluids-bernoulli-torricelli",
    "chapter": "c11-mechanical-properties-of-fluids",
    "subtopic": "Continuity, Bernoulli Equation & Torricelli Efflux",
    "chain": "c11-mechanical-properties-of-fluids",
    "title": "Equation of Continuity, Bernoulli Principle & Torricelli Efflux",
    "latex": "A_1 v_1 = A_2 v_2;\\quad P + \\frac{1}{2}\\rho v^2 + \\rho gh = \\text{const};\\quad v = \\sqrt{2gh};\\quad R = 2\\sqrt{h(H - h)}\\ (R_{\\max} = H\\text{ at } h = H/2)",
    "conditions": [
      "Continuity equation A v = const represents mass conservation for steady incompressible flow.",
      "Bernoulli’s theorem represents mechanical energy conservation for steady, streamline, non-viscous, incompressible flow.",
      "Torricelli’s Law of efflux from tank hole at depth h below free surface: v = √(2gh).",
      "Horizontal range on ground from orifice at depth h in tank of depth H: R = 2√[h(H − h)]. Max range R_max = H occurs at h = H/2."
    ],
    "variables": [
      {
        "symbol": "A v",
        "meaning": "Volume flow rate / discharge rate (m³/s)"
      },
      {
        "symbol": "v = \\sqrt{2gh}",
        "meaning": "Torricelli speed of efflux through a small orifice"
      },
      {
        "symbol": "R_{\\max} = H",
        "meaning": "Maximum horizontal water jet range when hole is at mid-height H/2"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "State Bernoulli’s Equation and Torricelli’s efflux speed. Where should a hole be made in a tank of height H for maximum range?",
      "back": "P + ½ ρv² + ρgh = const. Efflux speed v = √(2gh). Maximum horizontal range R_max = H when hole is at depth h = H/2."
    },
    "tags": [
      "bernoulli",
      "continuity",
      "torricelli",
      "efflux-speed",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-fluids-viscosity-surface-tension",
    "chapter": "c11-mechanical-properties-of-fluids",
    "subtopic": "Stokes Law, Terminal Velocity & Surface Tension",
    "chain": "c11-mechanical-properties-of-fluids",
    "title": "Terminal Velocity, Excess Pressure in Drops & Capillary Rise",
    "latex": "v_t = \\frac{2r^2(\\rho - \\sigma)g}{9\\eta};\\quad \\Delta P_{\\text{drop}} = \\frac{2T}{R},\\ \\Delta P_{\\text{bubble}} = \\frac{4T}{R};\\quad h = \\frac{2T\\cos\\theta}{\\rho g r};\\quad U = T\\Delta A",
    "conditions": [
      "Stokes’ viscous drag on small sphere: F = 6πηrv (valid for laminar low Reynolds number flow).",
      "Terminal velocity v_t ∝ r²: large raindrops fall much faster than small mist droplets.",
      "Excess pressure: liquid drop in air has ONE surface => ΔP = 2T/R; soap bubble in air has TWO surfaces => ΔP = 4T/R.",
      "Capillary ascent (Jurin’s Law): h = 2T cosθ / (ρgr). Water rises (θ < 90°), mercury depresses (θ > 90°)."
    ],
    "variables": [
      {
        "symbol": "v_t",
        "meaning": "Terminal steady fall velocity of sphere of radius r in viscous fluid"
      },
      {
        "symbol": "T",
        "meaning": "Surface tension of liquid (N/m or J/m²)"
      },
      {
        "symbol": "\\theta",
        "meaning": "Angle of contact between liquid and capillary wall"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Formulas for terminal velocity v_t of falling sphere, excess pressure inside a soap bubble, and capillary rise h?",
      "back": "v_t = 2r²(ρ − σ)g / (9η) ∝ r². Soap bubble ΔP = 4T/R. Capillary rise h = 2T cosθ / (ρgr)."
    },
    "tags": [
      "viscosity",
      "stokes-law",
      "terminal-velocity",
      "surface-tension",
      "capillary",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-thermal-expansion-calorimetry",
    "chapter": "c11-thermal-properties-of-matter",
    "subtopic": "Thermal Expansion & Calorimetry Principle",
    "chain": "c11-thermal-properties-of-matter",
    "title": "Expansion Coefficients Ratio & Calorimetric Equilibrium",
    "latex": "\\alpha = \\frac{\\beta}{2} = \\frac{\\gamma}{3};\\quad \\gamma_{\\text{app}} = \\gamma_{\\text{real}} - \\gamma_{\\text{vessel}};\\quad Q = ms\\Delta T = C\\Delta T;\\quad Q_{\\text{latent}} = mL",
    "conditions": [
      "Coefficients of linear (α), superficial (β), and cubical (γ) expansion satisfy α : β : γ = 1 : 2 : 3 for isotropic solids.",
      "Apparent expansion of liquid in container: γ_app = γ_real − 3α_container.",
      "Calorimetry principle: in an isolated system, Heat Lost by hotter bodies = Heat Gained by colder bodies.",
      "Water has anomalous expansion between 0°C and 4°C (density maximum at 4°C, volume minimum)."
    ],
    "variables": [
      {
        "symbol": "\\alpha, \\beta, \\gamma",
        "meaning": "Coefficients of linear, area, and volume expansion (/°C or /K)"
      },
      {
        "symbol": "s",
        "meaning": "Specific heat capacity (J/(kg·K))"
      },
      {
        "symbol": "L",
        "meaning": "Specific latent heat of fusion or vaporisation (J/kg)"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "What is the ratio between coefficients of linear, superficial, and cubical thermal expansion? What is the calorimetry principle?",
      "back": "α : β : γ = 1 : 2 : 3 (α = β/2 = γ/3). Heat Lost = Heat Gained. Liquid expansion: γ_app = γ_real − γ_vessel."
    },
    "tags": [
      "thermal-expansion",
      "calorimetry",
      "latent-heat",
      "anomalous-water",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-thermal-conduction-resistance",
    "chapter": "c11-thermal-properties-of-matter",
    "subtopic": "Heat Conduction & Thermal Resistance",
    "chain": "c11-thermal-properties-of-matter",
    "title": "Fourier Law of Conduction & Series/Parallel Thermal Resistance",
    "latex": "\\frac{dQ}{dt} = \\frac{kA(T_1 - T_2)}{L} = \\frac{\\Delta T}{R_{\\text{th}}};\\quad R_{\\text{th}} = \\frac{L}{kA};\\quad R_{\\text{series}} = R_1 + R_2;\\quad \\frac{1}{R_{\\text{parallel}}} = \\frac{1}{R_1} + \\frac{1}{R_2}",
    "conditions": [
      "Heat conduction is strictly analogous to Ohm’s law in current electricity: Current I_th = ΔT / R_th.",
      "Thermal resistance R_th = L / (kA). Higher thermal conductivity k means lower thermal resistance.",
      "Slabs in series share identical heat current dQ/dt; interface temperature found by equating heat flow.",
      "Equivalent thermal conductivity for two slabs of equal length in series: k_eq = 2k₁k₂ / (k₁ + k₂)."
    ],
    "variables": [
      {
        "symbol": "k",
        "meaning": "Coefficient of thermal conductivity of material (W/(m·K))"
      },
      {
        "symbol": "R_{\\text{th}}",
        "meaning": "Thermal resistance: temperature difference per unit heat current (K/W)"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [
      "curr-ohm-power"
    ],
    "flashcard": {
      "front": "Formula for thermal resistance of a slab? What is equivalent k for two equal-length slabs in series?",
      "back": "R_th = L/(kA). Slabs in series: R_eq = R₁ + R₂ => k_eq = 2k₁k₂ / (k₁ + k₂)."
    },
    "tags": [
      "conduction",
      "thermal-resistance",
      "fourier-law",
      "series-slabs",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-thermal-radiation-laws",
    "chapter": "c11-thermal-properties-of-matter",
    "subtopic": "Radiation: Stefan-Boltzmann & Wien Displacement",
    "chain": "c11-thermal-properties-of-matter",
    "title": "Stefan-Boltzmann Law, Wien Displacement & Newton Cooling",
    "latex": "P = e\\sigma A(T^4 - T_0^4);\\quad \\lambda_m T = b \\approx 2.898\\times 10^{-3}\\text{ m}\\cdot\\text{K};\\quad \\frac{T_1 - T_2}{t} = K\\left(\\frac{T_1 + T_2}{2} - T_0\\right)",
    "conditions": [
      "Stefan-Boltzmann law: total radiated power P = e σ A T⁴ (where σ = 5.67 × 10⁻⁸ W/(m²·K⁴) and e is emissivity).",
      "Net heat loss rate to surroundings at T₀: P_net = e σ A (T⁴ − T₀⁴). Absolute temperatures in Kelvin MUST be used.",
      "Wien’s law: peak radiation wavelength λ_m is inversely proportional to absolute temperature T.",
      "Newton’s Law of Cooling holds ONLY when temperature excess (T − T₀) is small (< 30°C)."
    ],
    "variables": [
      {
        "symbol": "\\sigma",
        "meaning": "Stefan-Boltzmann constant (5.67 × 10⁻⁸ W/(m²·K⁴))"
      },
      {
        "symbol": "b",
        "meaning": "Wien’s displacement constant (2.898 × 10⁻³ m·K)"
      },
      {
        "symbol": "K",
        "meaning": "Newton cooling constant depending on area, emissivity, mass, and specific heat"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "State Stefan-Boltzmann law and Wien’s displacement law. Approximate formula for Newton’s law of cooling?",
      "back": "Stefan-Boltzmann: P = eσA(T⁴ − T₀⁴). Wien: λ_m T = b. Newton: (T₁ − T₂)/t = K[(T₁ + T₂)/2 − T₀]."
    },
    "tags": [
      "radiation",
      "stefan-boltzmann",
      "wien-law",
      "newton-cooling",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-thermo-first-law-work",
    "chapter": "c11-thermodynamics",
    "subtopic": "First Law & Work in Thermodynamic Processes",
    "chain": "c11-thermodynamics",
    "title": "First Law of Thermodynamics & Work Done Across Processes",
    "latex": "\\Delta Q = \\Delta U + W;\\quad \\Delta U = nC_v\\Delta T;\\quad W_{\\text{isothermal}} = nRT\\ln\\left(\\frac{V_2}{V_1}\\right);\\quad W_{\\text{adiabatic}} = \\frac{P_1 V_1 - P_2 V_2}{\\gamma - 1}",
    "conditions": [
      "First Law (energy conservation): ΔQ is heat supplied to gas, W is work done BY gas (area under P–V curve).",
      "Internal energy U is a STATE function: for an ideal gas, ΔU = n C_v ΔT in ALL processes (cyclic process ΔU = 0).",
      "Isochoric (V = const): W = 0, ΔQ = ΔU = n C_v ΔT.",
      "Isobaric (P = const): W = P ΔV = n R ΔT, ΔQ = n C_p ΔT.",
      "Isothermal (T = const): ΔU = 0, Q = W = nRT ln(V₂/V₁).",
      "Adiabatic (Q = 0): PV^γ = const, TV^(γ−1) = const, W = −ΔU = (P₁V₁ − P₂V₂) / (γ − 1)."
    ],
    "variables": [
      {
        "symbol": "\\Delta Q, \\Delta U, W",
        "meaning": "Heat added to system, change in internal energy, work done by system"
      },
      {
        "symbol": "\\gamma = C_p / C_v",
        "meaning": "Ratio of specific heats (adiabatic exponent)"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Formulas for work done in isothermal and adiabatic expansions of an ideal gas?",
      "back": "Isothermal: W = nRT ln(V₂/V₁). Adiabatic: W = (P₁V₁ − P₂V₂)/(γ − 1) = nR(T₁ − T₂)/(γ − 1)."
    },
    "tags": [
      "first-law",
      "isothermal",
      "adiabatic",
      "work-done",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-thermo-capacities-mayer",
    "chapter": "c11-thermodynamics",
    "subtopic": "Mayer's Relation & Degrees of Freedom",
    "chain": "c11-thermodynamics",
    "title": "Mayer's Relation, Degrees of Freedom & Polytropic Heat Capacity",
    "latex": "C_p - C_v = R;\\quad \\gamma = 1 + \\frac{2}{f};\\quad C_v = \\frac{f}{2}R,\\ C_p = \\left(\\frac{f}{2} + 1\\right)R;\\quad C_{\\text{polytropic}} = C_v + \\frac{R}{1 - n}",
    "conditions": [
      "Mayer’s relation C_p − C_v = R holds for all ideal gases.",
      "Monoatomic gas (He, Ar, Ne): f = 3 (translational), C_v = 1.5R, C_p = 2.5R, γ = 5/3 ≈ 1.67.",
      "Diatomic gas at room temp (O₂, N₂, H₂): f = 5 (3 trans + 2 rot), C_v = 2.5R, C_p = 3.5R, γ = 7/5 = 1.40.",
      "Polyatomic non-linear gas (H₂O, NH₃): f = 6, C_v = 3R, C_p = 4R, γ = 4/3 ≈ 1.33.",
      "Polytropic process PV^n = const: molar heat capacity C = C_v + R / (1 − n)."
    ],
    "variables": [
      {
        "symbol": "f",
        "meaning": "Number of active mechanical degrees of freedom of gas molecule"
      },
      {
        "symbol": "n",
        "meaning": "Polytropic process index in equation PV^n = constant"
      }
    ],
    "derivedFrom": [
      "c11-thermo-first-law-work"
    ],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "What are C_v, C_p, and γ in terms of degrees of freedom f? What is the molar heat capacity in a polytropic process PV^n = const?",
      "back": "C_v = (f/2)R, C_p = (f/2 + 1)R, γ = 1 + 2/f. For PV^n = const: C = C_v + R/(1 − n)."
    },
    "tags": [
      "mayers-relation",
      "degrees-of-freedom",
      "gamma",
      "polytropic-process",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-thermo-carnot-refrigerator",
    "chapter": "c11-thermodynamics",
    "subtopic": "Carnot Heat Engine & Refrigerator COP",
    "chain": "c11-thermodynamics",
    "title": "Carnot Engine Efficiency, Refrigerator COP & Second Law",
    "latex": "\\eta = 1 - \\frac{T_C}{T_H} = \\frac{W}{Q_H} = 1 - \\frac{Q_C}{Q_H};\\quad \\beta = \\frac{Q_C}{W} = \\frac{T_C}{T_H - T_C};\\quad \\eta = \\frac{1}{1 + \\beta}",
    "conditions": [
      "Carnot cycle consists of 4 reversible operations: 2 isotherms and 2 adiabatics. Max efficiency between T_H and T_C.",
      "Second Law: no heat engine operating between two reservoirs can have higher efficiency than a reversible Carnot engine.",
      "Temperatures T_H (source) and T_C (sink) MUST be expressed in KELVIN.",
      "Refrigerator / Heat pump coefficient of performance β = Q_C / W = T_C / (T_H − T_C). Connection: η = 1 / (1 + β)."
    ],
    "variables": [
      {
        "symbol": "\\eta",
        "meaning": "Thermal efficiency of Carnot heat engine (dimensionless fraction < 1)"
      },
      {
        "symbol": "\\beta",
        "meaning": "Coefficient of Performance (COP) of ideal refrigerator"
      },
      {
        "symbol": "T_H, T_C",
        "meaning": "Absolute temperatures of hot source and cold sink in Kelvin"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Formula for efficiency of a Carnot engine and COP of a refrigerator? How are η and β related?",
      "back": "η = 1 − T_C/T_H = W/Q_H. Refrigerator COP: β = T_C/(T_H − T_C). Relation: η = 1/(1 + β)."
    },
    "tags": [
      "carnot-engine",
      "efficiency",
      "refrigerator",
      "cop",
      "second-law",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-ktg-pressure-kinetic-energy",
    "chapter": "c11-kinetic-theory",
    "subtopic": "Kinetic Theory Pressure & Total Internal Energy",
    "chain": "c11-kinetic-theory",
    "title": "Ideal Gas Pressure, Average Kinetic Energy & Equipartition",
    "latex": "P = \\frac{1}{3}\\rho v_{\\text{rms}}^2 = \\frac{1}{3}\\frac{M}{V}v_{\\text{rms}}^2;\\quad E_{\\text{trans}} = \\frac{3}{2}nRT = \\frac{3}{2}PV;\\quad \\bar\\varepsilon_{\\text{molecule}} = \\frac{3}{2}k_B T",
    "conditions": [
      "Microscopic gas model: point particles in random motion colliding elastically with container walls.",
      "Pressure P = ⅓ ρ v_rms²: directly proportional to mass density ρ and mean-square speed.",
      "Total translational kinetic energy of gas depends solely on temperature: E = 1.5 nRT = 1.5 PV.",
      "Average kinetic energy per molecule is 1.5 k_B T (independent of chemical nature or molecular mass)."
    ],
    "variables": [
      {
        "symbol": "v_{\\text{rms}}",
        "meaning": "Root-mean-square speed of gas molecules (m/s)"
      },
      {
        "symbol": "k_B",
        "meaning": "Boltzmann constant (1.38 × 10⁻²³ J/K)"
      },
      {
        "symbol": "\\rho",
        "meaning": "Mass density of gas (kg/m³)"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Microscopic formula for gas pressure P and average translational KE of an ideal gas molecule?",
      "back": "P = ⅓ ρ v_rms² = ⅓ (M/V)v_rms². Average KE per molecule = (3/2)k_B T. Total KE = (3/2)nRT = (3/2)PV."
    },
    "tags": [
      "ktg",
      "pressure",
      "kinetic-energy",
      "boltzmann-constant",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-ktg-molecular-speeds",
    "chapter": "c11-kinetic-theory",
    "subtopic": "Molecular Speed Distributions: RMS, Average & Most Probable",
    "chain": "c11-kinetic-theory",
    "title": "Maxwell Speeds: RMS, Average & Most Probable Speed Ratios",
    "latex": "v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}},\\quad v_{\\text{avg}} = \\sqrt{\\frac{8RT}{\\pi M}},\\quad v_{\\text{mp}} = \\sqrt{\\frac{2RT}{M}};\\qquad v_{\\text{mp}} : v_{\\text{avg}} : v_{\\text{rms}} = \\sqrt{2} : \\sqrt{\\frac{8}{\\pi}} : \\sqrt{3}",
    "conditions": [
      "Speed ordering always: v_rms > v_avg > v_mp. Numerical ratio ≈ 1.224 : 1.128 : 1.000 (RAM: RMS > Average > Most Probable).",
      "All three characteristic speeds are proportional to √(T/M): higher temperature or lighter gas yields higher speeds.",
      "Speed of sound in ideal gas: v_sound = √(γRT/M). Since γ < 3 always, v_sound < v_rms.",
      "M is molar mass in kg/mol (e.g., O₂ has M = 0.032 kg/mol, H₂ has M = 0.002 kg/mol)."
    ],
    "variables": [
      {
        "symbol": "v_{\\text{rms}}",
        "meaning": "Root-mean-square speed: √(3RT/M)"
      },
      {
        "symbol": "v_{\\text{avg}}",
        "meaning": "Arithmetic mean speed: √(8RT/(πM))"
      },
      {
        "symbol": "v_{\\text{mp}}",
        "meaning": "Most probable speed: peak of Maxwell-Boltzmann distribution √(2RT/M)"
      }
    ],
    "derivedFrom": [
      "c11-ktg-pressure-kinetic-energy"
    ],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Formulas for v_rms, v_avg, and v_mp of a gas? What is the order and ratio of these speeds?",
      "back": "v_rms = √(3RT/M), v_avg = √(8RT/πM), v_mp = √(2RT/M). Order: v_rms > v_avg > v_mp (ratio √3 : √(8/π) : √2)."
    },
    "tags": [
      "molecular-speeds",
      "v-rms",
      "v-avg",
      "v-mp",
      "maxwell-distribution",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-ktg-mean-free-path-graham",
    "chapter": "c11-kinetic-theory",
    "subtopic": "Mean Free Path & Graham Effusion Law",
    "chain": "c11-kinetic-theory",
    "title": "Mean Free Path & Graham’s Law of Gas Effusion / Diffusion",
    "latex": "\\lambda = \\frac{1}{\\sqrt{2}\\pi d^2 n_V} = \\frac{k_B T}{\\sqrt{2}\\pi d^2 P};\\quad r \\propto \\frac{1}{\\sqrt{\\rho}} \\propto \\frac{1}{\\sqrt{M}};\\quad \\bar\\varepsilon = \\frac{f}{2}k_B T",
    "conditions": [
      "Mean free path λ is average distance between successive collisions: λ ∝ T/P (at const V, λ is independent of T).",
      "Graham’s law: rate of effusion/diffusion through a pinhole is inversely proportional to square root of density or molar mass: r₁/r₂ = √(M₂/M₁).",
      "Law of equipartition of energy: every active mechanical quadratic degree of freedom contributes ½ k_B T of energy per molecule.",
      "Collisions per unit time (frequency) ν = v_avg / λ ∝ P / √T."
    ],
    "variables": [
      {
        "symbol": "\\lambda",
        "meaning": "Mean free path of gas molecules (m)"
      },
      {
        "symbol": "d",
        "meaning": "Collision diameter of spherical molecule (m)"
      },
      {
        "symbol": "n_V = N/V",
        "meaning": "Number density: molecules per unit volume (m⁻³)"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Formula for mean free path λ in terms of temperature T and pressure P? What is Graham’s law of diffusion?",
      "back": "λ = k_B T / (√2 π d² P). Graham’s law: rate of effusion r ∝ 1/√M ∝ 1/√ρ. Equipartition: ½ k_B T per degree of freedom."
    },
    "tags": [
      "mean-free-path",
      "grahams-law",
      "effusion",
      "equipartition",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-shm-kinematics-energy",
    "chapter": "c11-oscillations",
    "subtopic": "SHM Kinematics & Energy Exchange",
    "chain": "c11-oscillations",
    "title": "Kinematics of SHM & Equipartition Energy Point x = A/√2",
    "latex": "x = A\\sin(\\omega t + \\phi),\\ v = \\omega\\sqrt{A^2 - x^2},\\ a = -\\omega^2 x;\\quad K = \\frac{1}{2}m\\omega^2(A^2 - x^2),\\ U = \\frac{1}{2}m\\omega^2 x^2;\\quad K = U\\text{ at } x = \\frac{A}{\\sqrt{2}}",
    "conditions": [
      "Linear SHM defining differential equation: d²x/dt² + ω²x = 0; restoring force F = −kx = −mω²x.",
      "Velocity leads displacement by phase π/2; acceleration leads displacement by phase π.",
      "Energy conservation: total energy E = K + U = ½ m ω² A² = const.",
      "Special position: Kinetic energy equals Potential energy (K = U = E/2) at x = ± A/√2.",
      "At midpoint x = A/2: U = E/4 and K = 3E/4 => ratio U : K = 1 : 3.",
      "Time average over a full cycle: <K> = <U> = E/2 = ¼ mω²A²."
    ],
    "variables": [
      {
        "symbol": "A",
        "meaning": "Amplitude of oscillation (maximum displacement from mean position)"
      },
      {
        "symbol": "\\omega = 2\\pi / T",
        "meaning": "Angular frequency of oscillation (rad/s)"
      },
      {
        "symbol": "x = A/\\sqrt{2}",
        "meaning": "Position where kinetic energy equals potential energy in SHM"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "At what displacement from the mean position does K = U in SHM? What is the ratio U : K at x = A/2?",
      "back": "K = U at x = A/√2. At x = A/2, U : K = 1 : 3. Total energy E = ½ mω²A²."
    },
    "tags": [
      "shm",
      "oscillations",
      "energy-exchange",
      "equipartition-point",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-shm-springs-pendulums",
    "chapter": "c11-oscillations",
    "subtopic": "Spring Combinations, Simple & Physical Pendulums",
    "chain": "c11-oscillations",
    "title": "Spring-Mass Period, Series/Parallel Springs & Physical Pendulum",
    "latex": "T_{\\text{spring}} = 2\\pi\\sqrt{\\frac{m}{k}};\\quad k_{\\text{series}} = \\frac{k_1 k_2}{k_1 + k_2},\\ k_{\\text{parallel}} = k_1 + k_2;\\quad T_{\\text{simple}} = 2\\pi\\sqrt{\\frac{L}{g}};\\quad T_{\\text{phys}} = 2\\pi\\sqrt{\\frac{I}{mgd}}",
    "conditions": [
      "Spring-mass time period T = 2π√(m/k) is independent of gravity and acceleration of reference frame.",
      "Cutting spring into ratio m : n increases stiffness: k₁ = [(m + n)/m] k and k₂ = [(m + n)/n] k.",
      "Two masses connected by spring: oscillate with period T = 2π√(μ/k) where μ = m₁m₂/(m₁ + m₂) is reduced mass.",
      "Physical pendulum: I is moment of inertia about pivot axis, d is distance from pivot to COM. Minimum period T_min = 2π√(2k/g) when d = radius of gyration."
    ],
    "variables": [
      {
        "symbol": "k_{\\text{eq}}",
        "meaning": "Equivalent spring stiffness constant (N/m)"
      },
      {
        "symbol": "\\mu = \\frac{m_1 m_2}{m_1 + m_2}",
        "meaning": "Reduced mass of a 2-body vibrating system"
      },
      {
        "symbol": "T_{\\text{phys}}",
        "meaning": "Time period of rigid body compound physical pendulum"
      }
    ],
    "derivedFrom": [
      "c11-shm-kinematics-energy"
    ],
    "specialCasesTo": [],
    "analogTo": [
      "ac-resonance"
    ],
    "flashcard": {
      "front": "Formulas for spring period, series and parallel springs, and physical pendulum period?",
      "back": "Spring: T = 2π√(m/k). Series: 1/k_eq = 1/k₁ + 1/k₂. Parallel: k_eq = k₁ + k₂. Physical pendulum: T = 2π√(I/(mgd))."
    },
    "tags": [
      "springs",
      "simple-pendulum",
      "physical-pendulum",
      "reduced-mass",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-shm-damped-resonance",
    "chapter": "c11-oscillations",
    "subtopic": "Damped & Forced Oscillations, Resonance",
    "chain": "c11-oscillations",
    "title": "Damped Oscillation Amplitude Decay & Resonance Quality Factor",
    "latex": "A(t) = A_0 e^{-\\frac{bt}{2m}};\\quad E(t) = E_0 e^{-\\frac{bt}{m}};\\quad \\omega' = \\sqrt{\\omega_0^2 - \\left(\\frac{b}{2m}\\right)^2};\\quad Q = \\frac{\\omega_0 m}{b} = \\frac{\\omega_0}{\\Delta \\omega}",
    "conditions": [
      "Damping force F_d = −b v (viscous resistance proportional to velocity).",
      "Oscillatory motion amplitude decays exponentially with time constant τ = 2m/b.",
      "Energy of damped oscillator decays twice as fast as amplitude: E(t) = E₀ e^(−bt/m).",
      "Forced oscillations exhibit amplitude resonance when driving frequency ω_d ≈ natural frequency ω₀.",
      "Sharpness of resonance is governed by Quality Factor Q = ω₀ m / b = ω₀ / Δω (higher Q = narrower peak)."
    ],
    "variables": [
      {
        "symbol": "b",
        "meaning": "Damping coefficient (kg/s)"
      },
      {
        "symbol": "A(t)",
        "meaning": "Instantaneous amplitude of damped oscillator at time t"
      },
      {
        "symbol": "Q",
        "meaning": "Quality factor of resonant mechanical system"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [
      "ac-q-factor"
    ],
    "flashcard": {
      "front": "How does amplitude and mechanical energy decay with time in damped SHM? What is the condition for resonance?",
      "back": "A(t) = A₀ e^(−bt/2m). Energy decays twice as fast: E(t) = E₀ e^(−bt/m). Resonance occurs when driving frequency ω_d → ω₀."
    },
    "tags": [
      "damped-shm",
      "decay",
      "forced-oscillations",
      "resonance",
      "q-factor",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-waves-string-sound-speed",
    "chapter": "c11-waves",
    "subtopic": "Wave Speed on Strings & Laplace Sound Speed",
    "chain": "c11-waves",
    "title": "Transverse String Speed & Laplace Gas Sound Velocity",
    "latex": "v = \\frac{\\omega}{k} = \\nu\\lambda;\\quad v_{\\text{string}} = \\sqrt{\\frac{T}{\\mu}};\\quad v_{\\text{sound}} = \\sqrt{\\frac{\\gamma P}{\\rho}} = \\sqrt{\\frac{\\gamma RT}{M}};\\quad v \\propto \\sqrt{T}",
    "conditions": [
      "Transverse wave speed on stretched string depends only on tension T and linear mass density μ = m/L.",
      "Newton’s isothermal sound speed formula gave v = √(P/ρ) (underestimated by ~15%).",
      "Laplace correction: sound propagation is an ADIABATIC process (too fast for heat transfer) => v = √(γP/ρ).",
      "Sound speed in gas depends on temperature (v ∝ √T in Kelvin), independent of pressure at constant temperature.",
      "Sound speed increases with humidity because humid air has lower density than dry air (M_H2O = 18 < M_air ≈ 29)."
    ],
    "variables": [
      {
        "symbol": "v_{\\text{string}}",
        "meaning": "Wave velocity on string under tension T with linear density μ (m/s)"
      },
      {
        "symbol": "v_{\\text{sound}}",
        "meaning": "Speed of acoustic longitudinal wave in ideal gas (Laplace formula)"
      },
      {
        "symbol": "\\mu = m/L",
        "meaning": "Linear mass density of stretched string (kg/m)"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Formulas for wave speed on stretched string and Laplace speed of sound in a gas? How does sound speed vary with temperature and humidity?",
      "back": "String: v = √(T/μ). Sound: v = √(γP/ρ) = √(γRT/M). Speed v ∝ √T; v increases with humidity (denser dry air has lower speed)."
    },
    "tags": [
      "waves",
      "string-speed",
      "laplace-sound",
      "sound-speed",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-waves-standing-sonometer",
    "chapter": "c11-waves",
    "subtopic": "Standing Waves in Strings & Sonometer Laws",
    "chain": "c11-waves",
    "title": "Harmonics in Fixed Strings, Sonometer Laws & Water Immersion",
    "latex": "f_n = \\frac{nv}{2L} = \\frac{n}{2L}\\sqrt{\\frac{T}{\\mu}}\\ (n = 1, 2, 3\\ldots);\\quad \\nu \\propto \\frac{1}{L},\\ \\sqrt{T},\\ \\frac{1}{\\sqrt{\\mu}};\\quad \\frac{\\nu'}{\\nu} = \\sqrt{1 - \\frac{\\sigma}{\\rho}}",
    "conditions": [
      "String fixed at both ends forms nodes at boundaries: λ_n = 2L/n, harmonics f_n = n f₁ (all harmonics present).",
      "Distance between adjacent nodes or antinodes is λ/2; distance between consecutive node and antinode is λ/4.",
      "Sonometer laws: frequency ν ∝ 1/L (length law), ν ∝ √T (tension law), ν ∝ 1/√μ (mass law).",
      "Hanging load of density ρ immersed in liquid of density σ reduces tension by upthrust => new frequency ν'/ν = √(1 − σ/ρ)."
    ],
    "variables": [
      {
        "symbol": "f_1 = \\frac{v}{2L}",
        "meaning": "Fundamental frequency (1st harmonic) of fixed string"
      },
      {
        "symbol": "\\sigma / \\rho",
        "meaning": "Ratio of liquid density to suspended hanging weight density"
      }
    ],
    "derivedFrom": [
      "c11-waves-string-sound-speed"
    ],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Harmonic frequencies of string fixed at both ends? How does sonometer frequency change when hanging mass is immersed in water?",
      "back": "f_n = n v / (2L) = (n/2L)√(T/μ) (all harmonics present). Immersed in liquid: ν'/ν = √(1 − σ/ρ)."
    },
    "tags": [
      "standing-waves",
      "sonometer",
      "harmonics",
      "buoyancy-tension",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-waves-pipes-end-correction",
    "chapter": "c11-waves",
    "subtopic": "Organ Pipes, Resonance Tube & End Correction",
    "chain": "c11-waves",
    "title": "Open & Closed Organ Pipes, Resonance Tube & End Correction",
    "latex": "f_{\\text{open}} = \\frac{nv}{2(L + 2e)}\\ (n=1,2,3\\ldots);\\quad f_{\\text{closed}} = \\frac{(2n - 1)v}{4(L + e)}\\ (n=1,2,3\\ldots);\\quad e = 0.6r;\\quad v = 2(l_2 - l_1)f",
    "conditions": [
      "Open organ pipe (both ends open): forms antinodes at ends; all harmonics present: f_n = n v / (2L). Fundamental is octave higher than closed pipe.",
      "Closed organ pipe (one end closed): forms node at closed end, antinode at open end; ONLY ODD harmonics present: f_n = (2n − 1) v / (4L).",
      "End correction e = 0.6 r (acoustic reflection takes place slightly outside physical tube opening).",
      "Resonance tube experiment: first resonance at l₁ + e = λ/4, second resonance at l₂ + e = 3λ/4 => v = 2(l₂ − l₁)f; end correction e = (l₂ − 3l₁)/2."
    ],
    "variables": [
      {
        "symbol": "e = 0.6r",
        "meaning": "Lord Rayleigh end correction for pipe of internal radius r"
      },
      {
        "symbol": "l_1, l_2",
        "meaning": "First and second resonant air column lengths in resonance tube apparatus"
      }
    ],
    "derivedFrom": [
      "c11-waves-string-sound-speed"
    ],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Frequencies of open vs closed organ pipes? Formula for sound speed and end correction in resonance tube experiment?",
      "back": "Open pipe: f_n = nv/(2L) (all harmonics). Closed pipe: f_n = (2n−1)v/(4L) (odd harmonics only). Resonance tube: v = 2(l₂ − l₁)f; e = (l₂ − 3l₁)/2."
    },
    "tags": [
      "organ-pipes",
      "resonance-tube",
      "end-correction",
      "harmonics",
      "class11"
    ],
    "jeeWeight": 3
  },
  {
    "id": "c11-waves-beats-doppler",
    "chapter": "c11-waves",
    "subtopic": "Beat Frequency & Acoustic Doppler Effect",
    "chain": "c11-waves",
    "title": "Beat Frequency, Tuning Fork Loading & Acoustic Doppler Effect",
    "latex": "f_{\\text{beat}} = |f_1 - f_2|;\\qquad f' = f\\left(\\frac{v \\pm v_o}{v \\mp v_s}\\right);\\qquad \\frac{\\Delta f}{f} \\approx \\frac{v_{\\text{rel}}}{v}\\ (v_{\\text{rel}} \\ll v)",
    "conditions": [
      "Beats result from interference of two waves of slightly differing frequencies: beat frequency f_beat = |f₁ − f₂|.",
      "Loading tuning fork with wax decreases its frequency; filing prong tips increases its frequency.",
      "Doppler effect in sound: upper signs for approach (frequency increases), lower signs for recede (frequency decreases).",
      "v is speed of sound in medium; v_o is observer velocity; v_s is source velocity.",
      "If source approaches stationary observer at v_s ≪ v: apparent frequency f' ≈ f (1 + v_s/v).",
      "No Doppler shift when source and observer move perpendicular to line of sight at closest approach."
    ],
    "variables": [
      {
        "symbol": "f_{\\text{beat}}",
        "meaning": "Number of intensity beats heard per second (|f₁ − f₂|)"
      },
      {
        "symbol": "f'",
        "meaning": "Apparent acoustic frequency detected by observer"
      },
      {
        "symbol": "v_o, v_s",
        "meaning": "Speeds of observer and sound source relative to medium"
      }
    ],
    "derivedFrom": [],
    "specialCasesTo": [],
    "analogTo": [],
    "flashcard": {
      "front": "Formula for beat frequency and Doppler effect for sound? What happens to tuning fork frequency when loaded with wax or filed?",
      "back": "f_beat = |f₁ − f₂|. Doppler: f' = f(v ± v_o)/(v ∓ v_s) (upper sign = approach). Waxing DECREASES frequency; filing INCREASES frequency."
    },
    "tags": [
      "beats",
      "doppler-effect",
      "tuning-fork",
      "acoustic",
      "class11"
    ],
    "jeeWeight": 3
  }
];
