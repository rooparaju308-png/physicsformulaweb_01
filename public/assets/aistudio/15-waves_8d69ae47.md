# Waves

- Class: 11 Physics
- Chapter no.: 15
- Weightage: Medium

> A wave carries energy and momentum without carrying matter. Strings are the model system for travelling and standing waves.

## Wave Motion & Sine Waves

1. A disturbance travelling with speed $v$ along $+x$ keeps its shape: $y=f(t-x/v)$ (or $f(x-vt)$). Along $-x$: $f(t+x/v)$.
2. Sine wave travelling along $+x$:

$$y=A\sin(\omega t-kx+\phi)=A\sin\omega\left(t-\frac xv\right)$$

$$k=\frac{2\pi}{\lambda},\qquad \omega=2\pi\nu,\qquad v=\nu\lambda=\frac\omega k$$

3. If the signs of $\omega t$ and $kx$ are opposite, the wave moves along $+x$. If they are the same, along $-x$. Particle velocity $\dfrac{\partial y}{\partial t}$ (max $A\omega$) is different from the wave speed $v$:

$$v_{particle}=-v\,\frac{\partial y}{\partial x}$$

> Reading $v$, $\lambda$, $f$ from $y(x,t)$ is the most common wave question. Bring it to the standard form first and watch the units ($x$ in cm).

*Asked: 2023 • 11 Apr • Morning; 2026 • 2 Apr • Morning; 2026 • 5 Apr • Morning*

## Speed on a String & Power

4. Speed of a transverse wave on a string with tension $F$ and linear mass density $\mu$ (independent of amplitude and frequency):

$$v=\sqrt{\frac F\mu},\qquad \mu=\frac ml=\rho\pi r^2$$

5. Power transmitted and intensity:

$$P=2\pi^2\mu vA^2\nu^2,\qquad P\propto A^2\nu^2$$

> $\mu\propto r^2$: halving the wire radius doubles the wave speed (same tension).

*Asked: 2025 • 8 Apr • Evening*

## Superposition, Interference, Reflection

6. Principle of superposition: the net displacement is the algebraic sum. Two waves with the same $\omega$ and $k$ and phase difference $\delta$:

$$A=\sqrt{A_1^2+A_2^2+2A_1A_2\cos\delta}$$

$$\text{constructive: }\delta=2n\pi;\qquad \text{destructive: }\delta=(2n+1)\pi$$

7. Reflection at a fixed end (or denser string): the wave is inverted (phase change $\pi$). At a free end (or rarer string): no phase change. The transmitted wave is never inverted.

## Standing Waves on Strings

8. Two identical waves moving in opposite directions form a standing wave. Nodes are at $\sin kx=0$, antinodes at $|\sin kx|=1$. Node–node distance = $\lambda/2$, node–antinode = $\lambda/4$. No net energy flows.

$$y=2A\sin kx\cos\omega t$$

9. String fixed at both ends (length $L$): all harmonics are present.

$$L=\frac{n\lambda}{2}\ \Rightarrow\ \nu_n=\frac{n}{2L}\sqrt{\frac F\mu},\qquad n=1,2,3,\ldots$$

10. String fixed at one end (other end free): only odd harmonics, $\nu=\dfrac{(2n+1)}{4L}\sqrt{F/\mu}$.
11. Laws of transverse vibration (sonometer): $\nu\propto1/L$ (at fixed $F$, $\mu$), $\nu\propto\sqrt F$, $\nu\propto1/\sqrt\mu$. Resonance shows when the paper rider on the sonometer wire flies off.

$$\nu=\frac1{2L}\sqrt{\frac F\mu}$$

> Sonometer questions (change length or tension, find the new frequency or number of loops) appear each year. Hanging a mass in water reduces the tension: $\nu'/\nu=\sqrt{1-\sigma/\rho}$.

*Asked: 2023 • 13 Apr • Evening; 2023 • 8 Apr • Evening*

## Transverse/Longitudinal Waves & Polarisation

12. Transverse: particles vibrate ⊥ to propagation (strings, light). Longitudinal: parallel (sound in gases; compressions and rarefactions). Only transverse waves can be polarised (vibrations confined to one plane). A slit allows only the component along it.

## Sound Waves

Sound is a longitudinal mechanical wave. It can be described as a displacement wave or as a pressure wave.

### Nature; Displacement & Pressure Waves

13. Sound needs a medium (it can't travel through a vacuum). Audible range: about 20 Hz – 20 kHz. Below that is infrasonic, above it ultrasonic.
14. If the displacement wave is $s=s_0\sin\omega(t-x/v)$, the pressure wave is $90^\circ$ out of phase with it:

$$\delta P=-B\frac{\partial s}{\partial x},\qquad \delta P_0=Bks_0=\rho v\omega s_0$$

15. Pressure nodes are displacement antinodes, and the other way round.

### Speed of Sound

16. In a medium with bulk modulus $B$ (or Young's modulus $Y$ for a solid rod) and density $\rho$:

$$v=\sqrt{\frac B\rho}\ \text{(fluid)},\qquad v=\sqrt{\frac Y\rho}\ \text{(rod)}$$

17. Newton's formula assumed isothermal compression, $v=\sqrt{P/\rho}$ (≈ 280 m/s, too low). Laplace's correction: the compressions are adiabatic.

$$v=\sqrt{\frac{\gamma P}{\rho}}=\sqrt{\frac{\gamma RT}{M}}$$

18. Effect of pressure: none at constant $T$ ($P/\rho$ stays constant). Temperature: $v\propto\sqrt T$ (in K). Humidity: moist air is less dense, so sound is faster.

> Sound speed in an ideal gas depends on $\sqrt{\gamma RT/M}$, not on pressure (assertion–reason). Sound is faster in solids because $B$ or $Y$ is much larger, not because the density is smaller.

*Asked: 2023 • 6 Apr • Evening; 2025 • 28 Jan • Morning*

### Intensity & Loudness

19. Intensity $I=\dfrac{\delta P_0^2}{2\rho v}\propto(\text{amplitude})^2$. Sound level in decibels:

$$\beta=10\log_{10}\frac I{I_0},\qquad I_0=10^{-12}\ \text{W m}^{-2}$$

20. Pitch ↔ frequency, loudness ↔ intensity, quality (timbre) ↔ overtones (waveform). Point source: $I\propto1/r^2$.

### Interference, Standing Waves, Organ Pipes

21. Two sources with path difference $\Delta x$: phase difference $\delta=\dfrac{2\pi}{\lambda}\Delta x$. Constructive (loud) for $\Delta x=n\lambda$, destructive (quiet) for $\left(n+\tfrac12\right)\lambda$.
22. Open (both ends) pipe: antinodes at both ends, so all harmonics.

$$\nu_n=\frac{nv}{2L},\qquad n=1,2,3,\ldots$$

23. Closed (one end) pipe: a node at the closed end and an antinode at the open end, so only odd harmonics.

$$\nu=\frac{(2n+1)v}{4L},\qquad n=0,1,2,\ldots$$

24. End correction: the antinode is slightly outside the open end, $e\approx0.6r$. Effective length $L+e$ (closed) or $L+2e$ (open).
25. Resonance tube (Experimental Skill): successive resonance lengths $l_1$, $l_2$ give the speed without needing the end correction.

$$v=2\nu(l_2-l_1),\qquad e=\frac{l_2-3l_1}{2}$$

($l_2-l_1=\lambda/2$.)

26. Kundt's tube measures the speed of sound in a gas or rod from the spacing of the powder heaps (= $\lambda/2$).

> Closed vs open pipe questions ("the first overtone of an open pipe equals the fundamental of a closed pipe", harmonic ratios) are asked repeatedly.

*Asked: 2026 • 24 Jan • Evening; 2024 • 31 Jan • Morning; 2022 • 25 Jun • Morning*

### Beats & Diffraction

27. Two sounds with slightly different frequencies produce beats: the intensity rises and falls $|\nu_1-\nu_2|$ times per second.

$$\nu_{beat}=|\nu_1-\nu_2|$$

28. Loading a tuning fork with wax lowers its frequency. Filing it raises the frequency. Use this to decide the sign of the unknown frequency.
29. Sound diffracts easily around obstacles because its wavelength (cm to m) is comparable to everyday objects.

> Beats with a waxed or filed fork, and resonance-tube water levels, appear most years.

*Asked: 2026 • 28 Jan • Evening; 2021 • 26 Feb • Evening; 2022 • 29 Jun • Evening*

### Doppler Effect, Sonic Boom, Musical Scale, Acoustics

> The Doppler effect is not in the current JEE Main syllabus (removed after 2023). Formula for reference: $\nu'=\nu\,\dfrac{v+v_o}{v-v_s}$ (observer moving towards, source moving towards).

30. Sonic boom: a source faster than sound produces a shock-wave cone with $\sin\theta=v/v_s$ (Mach number $v_s/v$). Musical scale and acoustics of buildings (reverberation time, Sabine's formula $T=0.16V/\sum a_iS_i$) are for reading only.

## JEE Main Focus

### Wave motion and strings

**Question patterns asked again and again**
- Wave equation → $v$, $\lambda$, $f$, particle velocity — e.g. 2023 • 11 Apr • Morning; 2021 • 24 Feb • Evening
- Superposition: resultant amplitude/phase — e.g. 2023 • 31 Jan • Evening; 2023 • 29 Jan • Morning
- Sonometer / string harmonics — e.g. 2023 • 13 Apr • Evening; 2023 • 8 Apr • Evening

**Tricky points**
- Maximum particle speed $A\omega$ ≠ wave speed $\omega/k$.
- Distance between successive crests = $\lambda=2\pi/k$.

**Mistakes to avoid**
- Forgetting the $\pi$ inside the bracket, e.g. $y=A\cos\pi(200t-x/150)$.

**Asked in April 2026**
- 2 Apr S1 • Q35 — Wave speed from y = A cos π(at − bx): v = ω/k
- 5 Apr S1 • Q48 — Wavelength from wave equation: λ = 2π/k

### Sound

**Question patterns asked again and again**
- Closed vs open pipe harmonics — e.g. 2026 • 24 Jan • Evening; 2024 • 31 Jan • Morning
- Beats with loaded/filed fork — e.g. 2026 • 28 Jan • Evening; 2021 • 26 Feb • Evening
- Resonance tube, water level — e.g. 2022 • 29 Jun • Evening; 2021 • 25 Feb • Morning
- Speed of sound vs $T$, $\gamma$, $M$ — e.g. 2023 • 6 Apr • Evening

**Tricky points**
- A closed pipe has only odd harmonics. Its first overtone is the 3rd harmonic.
- Speed of sound doesn't depend on pressure at constant $T$.

**Mistakes to avoid**
- Using $T$ in °C in $v\propto\sqrt T$.
