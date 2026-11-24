# Laws of Motion

- Class: 11 Physics
- Chapter no.: 5
- Weightage: High

> Draw the free-body diagram, choose a frame, write $\sum F=ma$ for each body, then add the constraint relations.

## First Law & Inertial Frames

1. First law: if the net external force on a body is zero, its acceleration is zero. A frame in which the first law holds is an inertial frame. Any frame moving with constant velocity relative to it is also inertial.
2. The earth is only approximately inertial (rotation and revolution are small effects). An accelerating car or a rotating table is non-inertial.

## Second Law & Working with Newton's Laws

3. Second law (in an inertial frame): acceleration ∝ net force, in the direction of the force. The unit is the newton: 1 N = 1 kg m s⁻².

$$\vec F_{net}=m\vec a=\frac{d\vec p}{dt},\qquad F_x=ma_x,\ F_y=ma_y,\ F_z=ma_z$$

4. Method: (1) choose the system, (2) list the forces on it (the free-body diagram), (3) choose axes, (4) write the component equations, (5) add constraints (inextensible string means equal acceleration magnitudes; a light string has the same tension throughout).
5. Atwood machine (light pulley, $m_1>m_2$):

$$a=\frac{(m_1-m_2)g}{m_1+m_2},\qquad T=\frac{2m_1m_2g}{m_1+m_2}$$

6. Block on a smooth incline: $a=g\sin\theta$ down the incline, $N=mg\cos\theta$. Normal force on a body in a lift: $N=m(g+a)$ going up with acceleration $a$ ("apparent weight").
7. Momentum form: $\vec F=d\vec p/dt$ also covers variable mass. Impulse $=\int F\,dt=\Delta p$ (area under the $F$–$t$ graph). A machine gun firing $n$ bullets per second at speed $v$ feels a force $F=nmv$.

> Most common question types here: pulley/Atwood and tension in multi-block strings. For "force on the pulley/clamp" add the string tensions as vectors ($2T$ for vertical strings).

*Asked: 2024 • 31 Jan • Evening; 2022 • 26 Jul • Evening; 2025 • 2 Apr • Evening*

## Third Law

8. Third law: if A exerts $\vec F$ on B, then B exerts $-\vec F$ on A. They act on different bodies, so they never cancel in one FBD. They are of the same type and act at the same time.
9. Horse and cart: the cart moves because the ground's friction on the horse exceeds the cart's backward pull on the horse. Action–reaction pairs don't cancel because they act on different bodies.

## Pseudo Forces (Non-inertial Frames)

10. In a frame moving with acceleration $\vec a_0$, Newton's laws can be used if a pseudo force $-m\vec a_0$ is added to every body.

$$\vec F_{pseudo}=-m\vec a_{frame}$$

Pendulum in an accelerating car: $\tan\theta=a_0/g$.

11. Accelerating lift: $g_{eff}=g+a$ (going up with acceleration) or $g-a$ (accelerating down). In free fall $g_{eff}=0$: weightlessness.

> Wedge or accelerating-incline problems: go to the wedge frame, add $ma_0$ opposite to the wedge's acceleration, then resolve along the incline. In 2026 a pulled wedge with a block on it appeared.

*Asked: 2026 • 5 Apr • Morning; 2026 • 28 Jan • Evening; 2022 • 27 Jul • Evening*

## Inertia & Mass

12. Inertia: a body's tendency to resist a change in its state of rest or uniform motion. Mass is its quantitative measure (inertial mass), and it equals gravitational mass (see Gravitation).

## Friction

Friction is the component of the contact force parallel to the surface. It opposes relative sliding (or the tendency to slide).

### Friction as Component of Contact Force

13. The contact force $\vec F$ resolves into normal force $N$ (⊥ surface) and friction $f$ (∥ surface). The resultant contact force makes angle $\lambda$ with the normal.

$$F_{contact}=\sqrt{N^2+f^2},\qquad \tan\lambda=\frac fN$$

### Kinetic & Static Friction, Laws

14. Kinetic friction (surfaces sliding): opposes relative velocity. Its magnitude is independent of the area of contact and, roughly, of speed.

$$f_k=\mu_kN$$

15. Static friction (no sliding): self-adjusting. It takes whatever value is needed to prevent slipping, up to a maximum (limiting friction).

$$f_s\le\mu_sN,\qquad f_{s,max}=\mu_sN,\qquad \mu_s>\mu_k$$

(Graph of friction vs applied force: static $f=F$, then kinetic $\mu_kN$.)

> Never write $f=\mu N$ for static friction unless the body is just about to slide. First find the friction needed from Newton's laws and compare it with $\mu_sN$.

16. Angle of repose / friction: a block just starts sliding on an incline when $\tan\theta=\mu_s$. The angle of friction $\lambda$ satisfies $\tan\lambda=\mu$.

$$\theta_{repose}:\ \tan\theta=\mu_s$$

17. Laws of friction: (1) $f_k=\mu_kN$, nearly independent of area and speed; (2) $\mu_k<\mu_s$; (3) $\mu$ depends on the pair of surfaces (and their condition).
18. Block on a rough incline:

$$\text{sliding down: }a=g(\sin\theta-\mu_k\cos\theta)$$

$$\text{projected up: }a=g(\sin\theta+\mu_k\cos\theta)\ \text{(retardation)}$$

19. Pulling at angle $\theta$ to the horizontal reduces $N$: $N=mg-F\sin\theta$. The minimum force to move the block is $F_{min}=\dfrac{\mu mg}{\sqrt{1+\mu^2}}$ at $\tan\theta=\mu$.

> "Time to slide down a rough incline is $n$ times that on the smooth one" ⇒ $\mu_k=\tan\theta\left(1-\dfrac1{n^2}\right)$. This appeared in two of the April-2026 shifts you uploaded and in 2023–24 papers.

*Asked: 2026 • 4 Apr • Morning; 2026 • 6 Apr • Evening; 2024 • 8 Apr • Evening; 2023 • 29 Jan • Evening*

### Atomic Picture & Measuring μ

20. At the atomic level, real contact happens only at small points that form cold welds (electromagnetic bonds). Pressing harder increases the true contact area ∝ $N$, which is why $f\propto N$ and is independent of the apparent area.
21. Lab method (Experimental Skills): increase the incline angle until the block just slides, then $\mu_s=\tan\theta$. For $\mu_k$, find the angle at which it slides with uniform velocity after a tap.
22. Two-block problems: friction between blocks acts in opposite directions on each block (Newton's third law). Check for common motion first: $a=F/(m_1+m_2)$, then compare the friction needed with $\mu_sN$.

> Rotor/drum and rotating-disc questions combine friction with circular motion: the mass stays on the wall if $\mu\omega^2R\ge g$ (see circular motion).

*Asked: 2026 • 2 Apr • Evening*

## Dynamics: Circular Turnings & Banked Roads

23. The net force towards the centre must equal $mv^2/r$. This is not a new force: it is supplied by tension, friction, gravity, normal force, etc.

$$\sum F_{\text{towards centre}}=\frac{mv^2}{r}$$

24. Level road (friction supplies $mv^2/r$): $f=mv^2/r\le\mu mg\Rightarrow v\le\sqrt{\mu rg}$.

$$v_{max}=\sqrt{\mu_s rg}$$

25. Banked road at angle $\theta$: without friction, $N\sin\theta$ supplies $mv^2/r$ (and $N\cos\theta=mg$).

$$v_0=\sqrt{rg\tan\theta}\ \text{(no friction needed)}$$

$$v_{max}=\sqrt{rg\,\frac{\mu+\tan\theta}{1-\mu\tan\theta}},\qquad v_{min}=\sqrt{rg\,\frac{\tan\theta-\mu}{1+\mu\tan\theta}}$$

26. Friction acts down the slope if $v>v_0$ and up the slope if $v<v_0$.
27. Conical pendulum / pendulum in a turning car ($T\cos\theta=mg$, $T\sin\theta=mv^2/r$):

$$\tan\theta=\frac{v^2}{rg},\qquad T=2\pi\sqrt{\frac{l\cos\theta}{g}}$$

A cyclist on a turn leans by the same angle.

28. Vertical circle (string, length $r$): the speed needed at the bottom to complete the circle is $\sqrt{5gr}$, at the top it is $\sqrt{gr}$, and $T_{bottom}-T_{top}=6mg$. For a rod or a tube: $\sqrt{4gr}$ at the bottom (it can be zero at the top).

> Rotor/drum, rotating disc and banking-with-friction questions are the most common in circular motion. Conical pendulum / pendulum-in-car questions came in 2023 and 2026.

*Asked: 2026 • 2 Apr • Evening; 2024 • 31 Jan • Morning; 2025 • 24 Jan • Morning; 2026 • 8 Apr • Evening*

## Centrifugal Force

29. In a frame rotating with angular speed $\omega$, a pseudo force $m\omega^2r$ acts outward on every body. This is the centrifugal force. Use it only in the rotating frame, never together with "centripetal force" in the ground frame.

$$F_{cf}=m\omega^2r\ \text{(outward, rotating frame only)}$$

> Spring + circular motion: a mass on a spring whirled on a table satisfies $kx=m\omega^2(L_0+x)$.

*Asked: 2023 • 24 Jan • Evening; 2022 • 30 Jul • Evening*

## Effect of Earth's Rotation on Apparent Weight

30. At latitude $\lambda$ the rotation reduces the apparent weight. The effect is maximum at the equator and zero at the poles.

$$g'\approx g-\omega^2R\cos^2\lambda$$

31. If the earth spun fast enough that $\omega^2R=g$ (about 17 times faster), bodies at the equator would feel weightless.

## JEE Main Focus

### Newton's laws, pulleys and pseudo forces

**Question patterns asked again and again**
- Atwood / multi-pulley acceleration and tension — e.g. 2024 • 31 Jan • Evening; 2022 • 26 Jul • Evening; 2026 • 5 Apr • Morning
- Pseudo force: wedge, lift, pendulum in a car — e.g. 2026 • 28 Jan • Evening; 2022 • 27 Jul • Evening
- Time-dependent force → velocity/position (integrate $F/m$) — e.g. 2026 • 21 Jan • Morning; 2023 • 11 Apr • Evening
- Impulse when catching a ball / bouncing off a wall — e.g. 2024 • 8 Apr • Morning; 2024 • 1 Feb • Evening
- Variable mass (balloon releasing gas, conveyor belt, rocket thrust $v_r\,dm/dt$) — e.g. 2025 • 28 Jan • Evening; 2022 • 28 Jul • Morning

**Concepts combined in one question**
- Pulley + incline (two inclines and one string)
- Pseudo force + friction
- Pulley + energy conservation (speed on hitting the ground)

**Tricky points**
- The spring force cannot change instantly, but string tension can. Just after a string is cut, the spring forces are unchanged.
- The normal force is not always $mg\cos\theta$: pseudo or applied forces change it.

**Mistakes to avoid**
- Adding a pseudo force while working in the ground (inertial) frame.
- Wrong constraint relation for movable pulleys (a block on a movable pulley moves at half the speed of the free end).

**Asked in April 2026**
- 2 Apr S2 • Q27 — Rotor/drum: μ_min = g/(ω²R)
- 4 Apr S1 • Q28 — Time on rough incline 1.5× smooth: μ = tanθ(1 − 1/n²)
- 4 Apr S2 • Q28 — Constant force from rest: r = ½(F/m)t² ⇒ ratio x : y
- 5 Apr S1 • Q29 — Pulley system with three masses: tension ratio
- 5 Apr S1 • Q30 — Block on moving wedge: pseudo force, relative acceleration along incline
- 6 Apr S2 • Q44 — Pulley system: speed when mass strikes ground (constraint + energy)
- 6 Apr S2 • Q46 — Rough vs smooth incline time t vs t/2 (n = 2) ⇒ μ = 1 − 1/n²
- 8 Apr S2 • Q28 — Pendulum in turning car: tanθ = v²/(rg)

### Friction

**Question patterns asked again and again**
- Rough vs smooth incline time ratio → $\mu_k$ — e.g. 2024 • 8 Apr • Evening; 2023 • 29 Jan • Evening; 2026 • 4 Apr • Morning
- Minimum force to push up / hold a block on an incline — e.g. 2023 • 25 Jan • Evening; 2024 • 31 Jan • Evening
- Block–trolley / two-block friction, common acceleration — e.g. 2021–24 (several)
- Work done by friction (static friction can do work on a moving incline) — e.g. 2026 • 5 Apr • Evening

**Tricky points**
- $F\cos\theta=\mu(mg-F\sin\theta)$ for a pull at an angle (the normal force is reduced).
- Friction can act along the direction of motion (walking, a block on an accelerating truck).

**Mistakes to avoid**
- Taking friction $=\mu N$ when the block is at rest below the limiting value.

**Asked in April 2026**
- 2 Apr S2 • Q27 — Rotor/drum: μ_min = g/(ω²R)
- 4 Apr S1 • Q28 — Time on rough incline 1.5× smooth: μ = tanθ(1 − 1/n²)
- 5 Apr S1 • Q30 — Block on moving wedge: pseudo force, relative acceleration along incline
- 6 Apr S2 • Q46 — Rough vs smooth incline time t vs t/2 (n = 2) ⇒ μ = 1 − 1/n²

### Circular motion dynamics

**Question patterns asked again and again**
- Friction limit on a rotating drum/disc/coin ($\mu\omega^2R\ge g$; $\mu g\ge\omega^2r$) — e.g. 2026 • 2 Apr • Evening; 2024 • 31 Jan • Morning
- Banking with friction, maximum speed — e.g. 2025 • 24 Jan • Morning; 2024 • 6 Apr • Evening
- Vertical circle: tension, speed, KE ratios at different points — e.g. 2025 • 29 Jan • Morning; 2024 • 29 Jan • Evening
- Conical pendulum / pendulum in a turning car — e.g. 2026 • 8 Apr • Evening; 2023 • 25 Jan • Morning
- Arc vs chord displacement, clock hands, angular kinematics — e.g. 2024 • 8 Apr • Morning; 2024 • 4 Apr • Evening

**Tricky points**
- Chord displacement $2R\sin(\theta/2)$ is not the arc length $R\theta$.
- String goes slack ($T=0$) before the top if $\sqrt{2gr}<v_{bottom}<\sqrt{5gr}$.

**Mistakes to avoid**
- Adding "centripetal force" as an extra force in the FBD.
