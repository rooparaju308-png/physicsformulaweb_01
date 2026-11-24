# System of Particles and Rotational Motion

- Class: 11 Physics
- Chapter no.: 7
- Weightage: Very high

## Centre of Mass

1. For discrete particles:

$$\vec r_{cm}=\frac{\sum m_i\vec r_i}{\sum m_i},\qquad x_{cm}=\frac{m_1x_1+m_2x_2}{m_1+m_2}$$

2. For two particles the COM lies on the joining line and divides it in the inverse ratio of the masses: $r_1=\dfrac{m_2d}{m_1+m_2}$. ($m_1r_1=m_2r_2$, nearer the heavier.)
3. Continuous bodies: $x_{cm}=\dfrac1M\int x\,dm$. Use symmetry wherever possible.

| Body | COM position |
|---|---|
| Uniform rod | midpoint |
| Semicircular ring (radius $R$) | $2R/\pi$ from centre |
| Semicircular disc | $4R/3\pi$ from centre |
| Hemispherical shell | $R/2$ from centre |
| Solid hemisphere | $3R/8$ from centre |
| Solid cone (height $h$) | $h/4$ from base |
| Triangular lamina | centroid ($h/3$ from base) |

4. Body with a cavity: treat the removed part as negative mass. The COM shifts away from the hole.

$$x_{cm}=\frac{M_1x_1-M_2x_2}{M_1-M_2}$$

> Composite COM (disc with a hole, bent rod, L-shaped plate) is the commonest COM type recently.

*Asked: 2025 • 23 Jan • Morning; 2021 • 24 Feb • Evening*

## Motion of COM, Linear Momentum Conservation

5. Internal forces cancel in pairs, so only external forces accelerate the COM:

$$M\vec a_{cm}=\vec F_{ext},\qquad \vec P=M\vec v_{cm}=\sum m_i\vec v_i$$

6. If $\vec F_{ext}=0$: $\vec v_{cm}$ is constant and the total linear momentum is conserved (explosions, recoil, a man walking on a boat).

$$\sum m_i\vec v_i=\text{constant}$$

7. A shell exploding in flight: the fragments' COM continues on the original parabola (internal forces only). Recoil of a gun: $MV=mv$.
8. Path of the COM: straight line if $\vec v_{cm}\parallel\vec a_{cm}$ (or $a_{cm}=0$), otherwise parabolic.

> Explosion questions: the fragments share momentum equally and opposite, so $K\propto1/m$. Splitting into equal parts at rest gives equal and opposite velocities.

*Asked: 2024 • 8 Apr • Morning; 2024 • 31 Jan • Morning*

## Rocket Propulsion (Variable Mass)

9. Gas ejected at relative speed $u$ at rate $|dm/dt|$ gives a thrust $u\left|\dfrac{dm}{dt}\right|$.

$$F_{thrust}=u\left|\frac{dm}{dt}\right|,\qquad v=v_0+u\ln\frac{m_0}{m}\ \text{(no gravity)}$$

> Every rotation formula is the translational one with $x\to\theta$, $m\to I$, $F\to\tau$, $p\to L$. Rotational Motion has 27–37 JEE questions every year.

## Rigid Body Rotation & Kinematics

10. A rigid body keeps all inter-particle distances fixed. In rotation about a fixed axis, every particle moves in a circle centred on the axis with the same $\omega$ and $\alpha$.
11. Kinematics with constant $\alpha$ (same form as linear):

$$\omega=\omega_0+\alpha t,\qquad \theta=\omega_0t+\tfrac12\alpha t^2,\qquad \omega^2=\omega_0^2+2\alpha\theta$$

$$v=\omega r,\qquad a_t=\alpha r,\qquad a_c=\omega^2r$$

> From rest with uniform $\alpha$, the angles turned in successive equal intervals are in the ratio 1 : 3 : 5…

*Asked: 2026 • 5 Apr • Evening (uploaded paper)*

## Torque & Γ = Iα

12. Torque about a point: $\vec\tau=\vec r\times\vec F$. Magnitude = force × perpendicular distance of the line of action from the point. Torque about an axis = component along the axis.

$$\vec\tau=\vec r\times\vec F,\qquad |\tau|=rF\sin\theta=F\,r_\perp$$

13. Moment of inertia about an axis: $I=\sum m_ir_i^2$ (unit kg m²). It depends on the mass distribution and the axis.

$$\Gamma_{net}=I\alpha$$

14. Pulley with mass (disc, radius $R$) with a block of mass $m$ hanging from a light string:

$$a=\frac{mg}{m+I/R^2},\qquad T=mg\,\frac{I/R^2}{m+I/R^2}$$

## Equilibrium of Rigid Bodies

15. Conditions: $\sum\vec F=0$ (translational) and $\sum\vec\tau=0$ about any point (rotational). Take torques about the point where unknown forces act, to eliminate them.

$$\sum\vec F_{ext}=0,\qquad \sum\vec\tau_{ext}=0$$

16. Bending of a cyclist on a turn: $\tan\theta=\dfrac{v^2}{rg}$ (from torque balance in the rotating frame).
17. Ladder against a smooth wall (friction $f=N_2$ at the wall's normal, $N_1=mg$ at the floor), metre scale balanced with coins (Experimental Skill: principle of moments $m_1l_1=m_2l_2$).

## Angular Momentum & its Conservation

18. For a particle: $\vec L=\vec r\times\vec p$ (it depends on the chosen origin). For a rigid body about a fixed axis:

$$L=I\omega,\qquad \vec\tau_{ext}=\frac{d\vec L}{dt}$$

19. Conservation: if $\tau_{ext}=0$, $L$ is constant ⇒ $I_1\omega_1=I_2\omega_2$ (ice skater, diver, a person on a turntable folding the arms). KE is not conserved: $K=L^2/2I$.
20. Angular impulse $=\int\tau\,dt=\Delta L$.

> Two discs brought into contact / a person jumping onto a platform: conserve $L$, then find the loss of KE. Earth shrinking at constant mass: $\omega\propto1/R^2$, so the day becomes shorter.

*Asked: 2024 • 8 Apr • Evening; 2021 • 18 Mar • Morning*

## Rotational KE, Work & Power

21. For rotation about a fixed axis:

$$K=\tfrac12I\omega^2,\qquad W=\int\Gamma\,d\theta,\qquad P=\Gamma\omega$$

22. Work–energy theorem for rotation: $W=\tfrac12I\omega_2^2-\tfrac12I\omega_1^2$.

## Moment of Inertia & the Two Theorems

| Body (mass $M$) | Axis | $I$ |
|---|---|---|
| Thin ring, radius $R$ | through centre ⊥ plane | $MR^2$ |
| Ring | diameter | $MR^2/2$ |
| Uniform disc | through centre ⊥ plane | $MR^2/2$ |
| Disc | diameter | $MR^2/4$ |
| Thin rod, length $l$ | through centre ⊥ rod | $Ml^2/12$ |
| Rod | through end ⊥ rod | $Ml^2/3$ |
| Rectangular plate $a\times b$ | through centre ⊥ plate | $M(a^2+b^2)/12$ |
| Hollow cylinder | its axis | $MR^2$ |
| Solid cylinder | its axis | $MR^2/2$ |
| Solid cylinder | ⊥ axis through centre | $M(R^2/4+l^2/12)$ |
| Spherical shell | diameter | $2MR^2/3$ |
| Solid sphere | diameter | $2MR^2/5$ |

23. Radius of gyration: $I=Mk^2$ ⇒ $k=\sqrt{I/M}$.
24. Parallel-axis theorem (from an axis through the COM):

$$I=I_{cm}+Md^2$$

25. Perpendicular-axis theorem (plane laminae only): $I_z=I_x+I_y$, with $x$, $y$ in the plane (and $z$ ⊥ to it).

> The parallel-axis theorem must start from the COM axis. Never shift directly between two non-COM axes. The perpendicular-axis theorem does not work for 3-D bodies (spheres, cylinders).

> MI of composite bodies and point masses is the most asked rotation topic. Typical: a sphere melted into a disc + a sphere (mass conservation), ring with spokes, rod + spheres, square of masses about a diagonal.

*Asked: 2024 • 27 Jan • Morning; 2021 • 24 Feb • Morning; 2026 • 4 Apr • Morning*

## Combined Rotation & Translation: Rolling

26. General motion = translation of the COM + rotation about the COM. Pure rolling (no slipping): the contact point is momentarily at rest. Top point moves at $2v$.

$$v_{cm}=\omega R,\qquad a_{cm}=\alpha R$$

27. KE of a rolling body:

$$K=\tfrac12Mv^2+\tfrac12I_{cm}\omega^2=\tfrac12Mv^2\left(1+\frac{k^2}{R^2}\right)$$

| Body | $k^2/R^2$ | $K_{rot}/K_{total}$ | $a$ down incline |
|---|---|---|---|
| Ring / hollow cylinder | 1 | 1/2 | $\dfrac{g\sin\theta}{2}$ |
| Disc / solid cylinder | 1/2 | 1/3 | $\dfrac{2g\sin\theta}{3}$ |
| Hollow sphere | 2/3 | 2/5 | $\dfrac{3g\sin\theta}{5}$ |
| Solid sphere | 2/5 | 2/7 | $\dfrac{5g\sin\theta}{7}$ |

28. Rolling down an incline (height $h$):

$$a=\frac{g\sin\theta}{1+k^2/R^2},\qquad v=\sqrt{\frac{2gh}{1+k^2/R^2}},\qquad \mu_{min}=\frac{\tan\theta}{1+R^2/k^2}$$

Static friction gives the torque; it does no work.

29. The solid sphere reaches the bottom first, then the disc, the hollow sphere, and the ring last (independent of mass and radius). Static friction does no work in pure rolling.
30. Angular momentum of a rolling body about a point: $\vec L=\vec L_{cm}+M\vec r_{cm}\times\vec v_{cm}$. About the contact point, $L$ is conserved when friction is the only horizontal force (used in slipping → rolling).
31. Slipping → rolling: kinetic friction decelerates translation and speeds up rotation until $v=\omega R$. For a body launched with $v_0$, $\omega_0=0$:

$$v_f=\frac{v_0}{1+k^2/R^2},\qquad t=\frac{v_0-v_f}{\mu g}$$

32. A rolling sphere slows down in practice because of rolling friction: deformation shifts the normal force ahead of the centre and produces an opposing torque.

> Rolling ratios (speed, time, KE for ring/disc/sphere) and "identify the body from the height it rolls up to" ($h=\dfrac{v^2}{2g}\left(1+\dfrac{k^2}{R^2}\right)$) are the most repeated rolling questions. A force applied at the top of a rolling body gives $a=\dfrac{2F}{M(1+k^2/R^2)}$.

*Asked: 2021 • 20 Jul • Evening; 2024 • 27 Jan • Evening; 2026 • 5 Apr • Evening; 2026 • 6 Apr • Evening*

## JEE Main Focus

### Impulse, collisions and centre of mass

**Question patterns asked again and again**
- Impulse from $F$–$t$ graph or rebound — e.g. 2023 • 1 Feb • Evening; 2023 • 31 Jan • Morning
- Gun recoil / bullets per second ($F=nmv$) — e.g. 2023 • 11 Apr • Morning; 2023 • 30 Jan • Evening
- Elastic 1-D exchange, fraction of KE transferred — e.g. 2025 • 29 Jan • Morning; 2022 • 27 Jun • Morning
- Ballistic pendulum height — e.g. 2024 • 1 Feb • Morning; 2021 • 16 Mar • Evening
- COM of composite bodies; COM of an Atwood system — e.g. 2025 • 23 Jan • Morning; 2026 • 2 Apr • Evening

**Tricky points**
- KE of a system = KE of the COM + KE relative to the COM.
- Velocity of separation uses the components along the line of impact.

**Mistakes to avoid**
- Conserving KE in an inelastic collision.
- Conserving momentum when an external impulsive force acts (e.g. a pivot or a rigid string).

**Asked in April 2026**
- 2 Apr S2 • Q28 — Atwood machine: displacement of centre of mass a_cm = (m₁a₁+m₂a₂)/M
- 6 Apr S2 • Q32 — Path of COM from v_cm, a_cm (parallel ⇒ straight, else parabola)

### Rotational motion

**Question patterns asked again and again**
- Rolling on an incline: ratios of speed, time, KE — e.g. 2021 • 20 Jul • Evening; 2024 • 27 Jan • Evening
- MI of composite bodies / parallel-axis — e.g. 2024 • 27 Jan • Morning; 2021 • 24 Feb • Morning; 2026 • 2 Apr • Evening
- Radius of gyration ratios — e.g. 2024 • 5 Apr • Morning; 2023 • 15 Apr • Morning
- Angular momentum conservation (discs merging, person on a platform) — e.g. 2024 • 8 Apr • Evening; 2021 • 18 Mar • Morning
- Torque $\vec r\times\vec F$ / $\vec L=\vec r\times\vec p$ in vector form — e.g. 2022 • 25 Jun • Morning; 2026 • 2 Apr • Morning
- String-driven rotation (pulley with mass) — e.g. 2023 • 13 Apr • Evening; 2022 • 28 Jun • Evening
- Angular momentum of a projectile about the launch point — e.g. 2025 • 24 Jan • Morning; 2024 • 30 Jan • Morning
- Slipping → pure rolling time — e.g. 2026 • 8 Apr • Evening

**Concepts combined in one question**
- Rotation + SHM (physical pendulum, Oscillations)
- Rolling + string + block
- MI + torque (metre scale with coins)

**Tricky points**
- $K_{rot}/K_{total}=\dfrac{k^2}{k^2+R^2}$: 2/7 sphere, 1/3 disc, 1/2 ring.
- $L$ depends on the origin chosen. A particle moving in a straight line has constant non-zero $L$ about a point off the line.
- When $L$ is conserved, KE generally changes.

**Mistakes to avoid**
- Using $I_{cm}$ instead of $I$ about the pivot.
- Assuming friction acts backwards in every rolling case.

**Asked in April 2026**
- 2 Apr S1 • Q29 — Given r(t): find p, F, L = r×p, τ = r×F at t = 1 s (multi-statement)
- 2 Apr S2 • Q28 — Atwood machine: displacement of centre of mass a_cm = (m₁a₁+m₂a₂)/M
- 2 Apr S2 • Q50 — MOI of rod = MOI of sphere about parallel axis (parallel axis theorem)
- 4 Apr S1 • Q30 — Sphere melted into sphere + disc: ratio of MOIs (mass conservation)
- 5 Apr S2 • Q30 — Uniform α from rest: θ in successive equal intervals (1 : 3)
- 5 Apr S2 • Q31 — Rolling up a curve: h = v²(1 + k²/R²)/2g identifies the body
- 6 Apr S2 • Q28 — Force at top of sphere vs shell: rolling acceleration a = 2F/(m(1+k²/R²))
- 6 Apr S2 • Q32 — Path of COM from v_cm, a_cm (parallel ⇒ straight, else parabola)
- 8 Apr S2 • Q32 — Slipping cylinder → pure rolling: time with friction torque
