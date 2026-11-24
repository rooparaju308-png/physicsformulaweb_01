# Oscillations

- Class: 11 Physics
- Chapter no.: 14
- Weightage: High

> SHM: the restoring force is proportional to the displacement, $F=-kx$. Find $k$ (or the torque constant), and $\omega=\sqrt{k/m}$ follows.

## SHM & its Equation of Motion

1. A particle executes SHM if the resultant force is directed towards a fixed point and is proportional to the displacement from it. The restoring force always points to the mean position.

$$F=-kx\ \Rightarrow\ \frac{d^2x}{dt^2}=-\omega^2x,\qquad \omega=\sqrt{\frac km}$$

2. General solution ($A$ = amplitude, $\delta$ = phase constant):

$$x=A\sin(\omega t+\delta)$$

$$v=A\omega\cos(\omega t+\delta)=\omega\sqrt{A^2-x^2},\qquad a=-\omega^2x$$

3. Periodic motion repeats after time $T$. Oscillatory motion goes to and fro. Every SHM is periodic, but not every periodic motion is SHM. SHM needs a single sinusoid (or a sum of sin and cos with the same $\omega$).

## Terms: Amplitude, Period, Phase

4. Time period, frequency and angular frequency:

$$T=\frac{2\pi}{\omega}=2\pi\sqrt{\frac mk},\qquad \nu=\frac1T$$

5. Phase $(\omega t+\delta)$ fixes the state of motion. Velocity leads displacement by $\pi/2$, and acceleration is opposite to displacement (phase $\pi$).
6. Max speed $A\omega$ (at the mean position), max acceleration $A\omega^2$ (at the extremes). The $v$–$x$ graph is an ellipse; the $a$–$x$ graph is a line with slope $-\omega^2$.

> If $v^2=a-bx^2$, compare with $v^2=\omega^2(A^2-x^2)$: $\omega^2=b$, $A^2=a/b$. The particle is at rest at the extremes and has zero acceleration at the mean position.

*Asked: 2026 • 4 Apr • Morning; 2026 • 2 Apr • Evening*

## SHM as Projection of Circular Motion

7. The projection on a diameter of a point moving uniformly on a circle (the reference circle) performs SHM with the same $\omega$ ($x=A\cos\omega t$). Use this for time taken between two positions: from $x=0$ to $x=A/2$ takes $T/12$, from $A/2$ to $A$ takes $T/6$.

## Energy in SHM

8. Total energy is constant. KE and PE interchange, each oscillating with frequency $2\nu$.

$$K=\tfrac12m\omega^2\left(A^2-x^2\right),\qquad U=\tfrac12m\omega^2x^2,\qquad E=\tfrac12kA^2$$

9. $K=U$ at $x=A/\sqrt2$. At $x=A/2$, $U:K=1:3$. The average KE over a cycle equals the average PE, $=E/2$.

> KE oscillates at angular frequency $2\omega$. If the question gives the KE frequency, the SHM frequency is half of it.

*Asked: 2026 • 21 Jan • Evening; 2023 • 13 Apr • Evening*

## Angular SHM & Pendulums

10. Angular SHM: $\Gamma=-k\theta$ ⇒ $\omega=\sqrt{k/I}$.
11. Simple pendulum (small amplitude):

$$T=2\pi\sqrt{\frac lg}$$

- In a lift accelerating up: $g\to g+a$. Accelerating down: $g-a$. In free fall: $T\to\infty$.
- In a car with horizontal acceleration $a$: $g_{eff}=\sqrt{g^2+a^2}$.
- Very long pendulum: $T=2\pi\sqrt{\dfrac{1}{g\,(1/l+1/R)}}$, maximum 84.6 min.
- A bob of density $\rho$ in a liquid of density $\sigma$: $g_{eff}=g(1-\sigma/\rho)$.

12. Physical (compound) pendulum, pivot at distance $d$ from the COM:

$$T=2\pi\sqrt{\frac{I}{mgd}}=2\pi\sqrt{\frac{k^2+d^2}{gd}}$$

($I$ about the pivot $O$.)

13. Torsional pendulum: $\Gamma=-k\theta$ (wire's torsion constant) ⇒ $T=2\pi\sqrt{I/k}$.

> Pendulum in a lift, at altitude or on another planet (frequently asked). Physical pendulum: a disc pivoted at its rim has $T=2\pi\sqrt{3R/2g}$.

*Asked: 2022 • 30 Jul • Evening; 2025 • 22 Jan • Evening; 2026 • 4 Apr • Evening*

## Springs

14. Vertical spring: at equilibrium $kx_0=mg$, and the period is the same as horizontal: $T=2\pi\sqrt{m/k}=2\pi\sqrt{x_0/g}$. The mean position shifts; $T$ stays the same.
15. Combinations: series $\dfrac1k=\dfrac1{k_1}+\dfrac1{k_2}$, parallel $k=k_1+k_2$. A spring cut into $n$ equal parts gives each part $nk$ ($k\propto1/l$).

$$\text{two blocks on a spring: }T=2\pi\sqrt{\frac\mu k},\qquad \mu=\frac{m_1m_2}{m_1+m_2}$$

> Cut or combined springs appear every year: half the spring gives $k\to2k$ and $\nu\to\sqrt2\,\nu$.

*Asked: 2026 • 24 Jan • Morning; 2026 • 8 Apr • Evening; 2021 • 26 Feb • Morning*

## Composition, Damping, Resonance

16. Two SHMs in the same direction (same $\omega$): the result is SHM with

$$A=\sqrt{A_1^2+A_2^2+2A_1A_2\cos\delta},\qquad \tan\epsilon=\frac{A_2\sin\delta}{A_1+A_2\cos\delta}$$

17. Perpendicular SHMs with the same $\omega$ ($x=A\sin\omega t$, $y=B\sin(\omega t+\delta)$): a line ($\delta=0,\pi$), a circle ($\delta=\pi/2$, equal amplitudes), or an ellipse in general.
18. Damped oscillation (drag $-bv$): the amplitude decays exponentially and the energy decays twice as fast.

$$A(t)=A_0e^{-bt/2m},\qquad E(t)=E_0e^{-bt/m}$$

19. Forced oscillation: the body finally oscillates at the driving frequency. Resonance: the amplitude is maximum when the driving frequency ≈ the natural frequency. Less damping gives a sharper and higher peak.
20. Classifying functions: $\sin\omega t+\cos\omega t$ is SHM. $\sin^2\omega t$ is SHM about ½ (period $\pi/\omega$). $\sin^3\omega t$ and $\sin\omega t+\cos2\omega t$ are periodic, not SHM. $e^{-\omega t}$ and $\log\omega t$ are non-periodic.

> A match-list question on periodic / SHM / non-periodic functions appeared in 2026. Simple pendulum damping (amplitude² vs time graph) is in Experimental Skills.

*Asked: 2026 • 5 Apr • Evening*

## JEE Main Focus

**Question patterns asked again and again**
- Pendulum in a lift / at height / on a planet — e.g. 2022 • 30 Jul • Evening; 2023 • 25 Jan • Morning
- Cut/combined springs — e.g. 2026 • 24 Jan • Morning; 2021 • 26 Feb • Morning
- KE = PE position, energy fractions — e.g. 2023 • 13 Apr • Evening; 2021 • 17 Mar • Morning
- Phase/time from the displacement equation — e.g. 2022 • 27 Jun • Morning; 2023 • 10 Apr • Evening
- Damping: time for the amplitude to halve — e.g. 2021 • 16 Mar • Evening; 2021 • 17 Mar • Evening
- Assertion–reason on SHM / pendulum — e.g. 2025 • 28 Jan • Evening; 2025 • 29 Jan • Morning

**Concepts combined in one question**
- SHM + rotation (physical pendulum)
- SHM + electrostatics (dipole in a field: $T=2\pi\sqrt{I/pE}$)
- SHM + buoyancy (floating cylinder: $T=2\pi\sqrt{h/g}$)

**Tricky points**
- Mass–spring $T$ doesn't depend on $g$ (same on the moon). Pendulum $T$ does.
- Energy $\propto A^2$, so when the amplitude halves, the energy becomes 1/4.

**Mistakes to avoid**
- Measuring the energy of a vertical spring from the natural length instead of the equilibrium position.

**Asked in April 2026**
- 2 Apr S2 • Q45 — x = a sin(ωt+φ): v = 0 and a = 0 instants
- 4 Apr S1 • Q48 — v² = a − bx² ⇒ ω² = b, find amplitude/period
- 4 Apr S2 • Q35 — Physical pendulum (disc about rim): T = 2π√(3R/2g)
- 5 Apr S2 • Q35 — Match list: periodic / SHM / non-periodic functions
- 6 Apr S2 • Q36 — Spring: f = (1/2π)√(g/x₀), energy ½kA²
- 8 Apr S2 • Q37 — Spring cut in half ⇒ k doubles ⇒ ν × √2
