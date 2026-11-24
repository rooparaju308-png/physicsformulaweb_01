# Motion in a Straight Line

- Class: 11 Physics
- Chapter no.: 3
- Weightage: Very high

## Calculus

1. Differentiation gives the rate of change, which is the slope of the $y$–$x$ graph: $\dfrac{dy}{dx}=\lim_{\Delta x\to0}\dfrac{\Delta y}{\Delta x}$.

$$\frac{d}{dx}x^n=nx^{n-1},\ \ \frac{d}{dx}\sin x=\cos x,\ \ \frac{d}{dx}\cos x=-\sin x,\ \ \frac{d}{dx}e^x=e^x,\ \ \frac{d}{dx}\ln x=\frac1x$$

*Figure: y(x) with the tangent drawn — slope = dy/dx.*

2. Rules: product $(uv)'=u'v+uv'$, quotient $(u/v)'=\dfrac{u'v-uv'}{v^2}$, chain $\dfrac{dy}{dx}=\dfrac{dy}{dz}\dfrac{dz}{dx}$.
3. Maxima and minima: at an extremum $\dfrac{dy}{dx}=0$. Maximum if $\dfrac{d^2y}{dx^2}<0$, minimum if $>0$.

*Figure: a maximum — slope 0, y'' < 0.*

4. Integration is the reverse of differentiation (summing small pieces). The definite integral is the area under the curve between the limits.

$$\int x^n\,dx=\frac{x^{n+1}}{n+1}+C\ (n\ne-1),\qquad \int\frac{dx}{x}=\ln x,\qquad \int\sin x\,dx=-\cos x$$

$$\int_a^b f(x)\,dx=F(b)-F(a)=\text{area under }y=f(x)$$

> Calculus questions are increasing: $v(x)\to a=v\,dv/dx$, $B$ varying with $r\to\varepsilon=\int B\omega r\,dr$, magnetic moment of a flat spiral $\to\int dN\,\pi r^2$, work $\int F\,dx$.

*Asked: 2026 • 5 Apr • Evening; 2026 • 4 Apr • Morning (uploaded papers)*

## Rest, Motion, Distance & Displacement

5. A body is at rest or in motion only with respect to a chosen frame of reference. Its position is given by the position vector $\vec r$ from the origin of that frame.
6. Distance = actual path length (scalar, never decreases). Displacement = change in position vector $\Delta\vec r=\vec r_2-\vec r_1$ (vector, depends only on the end points).

$$|\Delta\vec r|\le\text{distance}$$

## Speed, Velocity, Acceleration

7. Average speed = distance / time. Instantaneous speed = $\dfrac{ds}{dt}$ = slope of the distance–time graph.
8. Average velocity = displacement / time. Instantaneous velocity is the derivative of position. Its magnitude equals the instantaneous speed.

$$\vec v_{av}=\frac{\Delta\vec r}{\Delta t},\qquad \vec v=\frac{d\vec r}{dt}$$

9. Acceleration = rate of change of velocity (a change in magnitude or direction).

$$\vec a=\frac{d\vec v}{dt}=\frac{d^2\vec r}{dt^2};\qquad a=v\frac{dv}{dx}\ \text{(1-D)}$$

> Average speed ≥ |average velocity|. They are equal only for straight-line motion without turning back. Average velocity = $(u+v)/2$ only for constant acceleration.

> Rebound/round-trip questions: average velocity = 0 but average speed ≠ 0. Use total path / total time.

*Asked: 2021 • 17 Mar • Evening; 2023 • 1 Feb • Morning*

## Motion in a Straight Line

10. Uniform acceleration along a line (take one direction as positive, keep signs):

$$v=u+at,\qquad x=ut+\tfrac12at^2,\qquad v^2=u^2+2ax$$

$$x=\frac{u+v}{2}\,t,\qquad s_{n\text{th}}=u+\frac a2(2n-1)$$

11. Graphs: slope of $x$–$t$ = velocity. Slope of $v$–$t$ = acceleration. Area under $v$–$t$ = displacement (area of $|v|$ = distance). Area under $a$–$t$ = change in velocity.
12. Free fall (near the earth, no air resistance): $a=g$ downward ≈ 9.8 m s⁻². Thrown up with $u$:

$$H_{max}=\frac{u^2}{2g},\qquad t_{up}=t_{down}=\frac ug$$

13. Displacement in the last 1 s of a time $t$. The short form $u+\frac a2(2n-1)$ only looks dimensionally wrong because the "1 s" is hidden:

$$s_t-s_{t-1}=u(1\,\text{s})+\frac a2(2t-1\,\text{s})(1\,\text{s})$$

14. Free fall sign conventions: upward positive gives $v=u-gt$, $y=ut-\tfrac12gt^2$, $v^2=u^2-2gy$. Downward positive gives $a=+g$. Pick one and keep it for the whole problem.
15. From rest, distances in successive equal intervals are in the ratio 1 : 3 : 5 : 7 … (Galileo's law of odd numbers).

> At the top point, $v=0$ but $a=g\ne0$. A body released from a rising balloon or lift starts with the balloon's upward velocity.

> Variable acceleration: when $a$ depends on $x$ use $a=v\,dv/dx$, when it depends on $t$ use $dv=a\,dt$. Converting a $v$–$x$ graph to an $a$–$x$ graph uses $a=v\,dv/dx$.

*Asked: 2026 • 24 Jan • Evening; 2021 • 24 Feb • Morning*

## Motion Graphs: x–t, v–t, a–t

16. Reading graphs: slope of $x$–$t$ = $v$; slope of $v$–$t$ = $a$; area under $v$–$t$ = displacement; area under $a$–$t$ = $\Delta v$. Curvature of $x$–$t$ tells the sign of $a$: bending up means $a>0$, bending down means $a<0$.

| Case | x–t | v–t | a–t |
|---|---|---|---|
| ① At rest | horizontal line | $v=0$ | $a=0$ |
| ② Uniform velocity ($a=0$) | straight line, slope = $v$ | horizontal line | $a=0$ |
| ③ Uniform acceleration, speeding up ($a>0$) | parabola bending up | straight line, slope = $a$, intercept = $u$ | horizontal line |
| ④ Uniform retardation / ball thrown up ($a=-g$) | parabola bending down, top at $t=u/g$ | line crossing the $t$-axis, $v=0$ at the top | constant, negative ($a=-g$ throughout) |

⑤ $v$–$x$ and $a$–$v$ graphs (constant $a$): $v$–$x$ is a parabola, $v^2=u^2+2ax$ (for $a>0$ and $a<0$). $a$–$v$ is a flat line for constant $a$, or $a=-kv$ (drag).

Distance–time for a ball thrown up: distance never decreases.

> Impossible graphs: $x$–$t$ with two $x$ values at one $t$; a vertical part in $x$–$t$ or $v$–$t$ (infinite $v$ or $a$); speed or distance going negative; a sharp corner in $x$–$t$ (sudden change of $v$ needs infinite force, except in idealised collisions).

> Graph conversion is a favourite: given $v$–$t$, draw $a$–$t$ or $x$–$t$; given $v$–$x$, find $a$ using $a=v\,dv/dx$; displacement vs distance from the area of a $v$–$t$ graph that crosses the axis.

*Asked: 2023 • 11 Apr • Morning; 2023 • 24 Jan • Evening*

## JEE Main Focus

**Question patterns asked again and again**
- Graph conversion and areas ($v$–$t$ to $a$–$t$, $v$–$x$ to $a$–$x$, distance/displacement ratio) — e.g. 2023 • 11 Apr • Morning; 2023 • 24 Jan • Evening
- Staggered drops / free fall from height — e.g. 2026 • 28 Jan • Morning; 2021 • 25 Feb • Evening
- $n$th-second displacement — e.g. 2024 • 29 Jan • Morning; 2024 • 4 Apr • Morning
- Projectile: range ratio, $R=nH$, $T$ from equal ranges — e.g. 2026 • 4 Apr • Morning; 2022 • 25 Jul • Evening; 2025 • 7 Apr • Morning
- Given $x(t)$, $y(t)$: velocity direction / acceleration — e.g. 2024 • 27 Jan • Morning; 2026 • 4 Apr • Evening
- River crossing and relative velocity — e.g. 2026 • 21 Jan • Evening; 2025 • 2 Apr • Morning

**Concepts combined in one question**
- Projectile + energy (KE at top, $K\cos^2\theta$)
- Projectile + Torricelli's efflux (Fluids)
- Kinematics + de Broglie wavelength in a field (Dual Nature)

**Tricky points**
- Direction of velocity at time $t$: $\tan\alpha=\dfrac{u\sin\theta-gt}{u\cos\theta}$.
- For $x=at$, $y=bt-ct^2$: $g=2c$, $u_x=a$, $u_y=b$.
- A turning point has $v=0$ but $a\ne0$.

**Mistakes to avoid**
- Using $v^2=u^2+2as$ when $a$ is not constant.
- Forgetting the release velocity of an object dropped from a moving balloon.

### Asked in April 2026
- 2 Apr S1 • Q28 — Acceleration from a velocity field v(x,y,z): a = (v•∇)v
- 2 Apr S1 • Q31 — Angular acceleration from θ(t) of a particle in a circle
- 4 Apr S1 • Q31 — Ranges at 15° and 30°: R ∝ sin2θ
- 4 Apr S2 • Q27 — Relative velocity of stone thrown between moving cars
- 4 Apr S2 • Q29 — Projectile x(t), y(t) ⇒ angle at t: tanθ = v_y/v_x
- 4 Apr S2 • Q47 — Max range u²/g ⇒ u
- 5 Apr S1 • Q47 — Free fall: height where |v| = g numerically
- 5 Apr S2 • Q29 — v–t graph: distance (area) vs displacement
- 8 Apr S2 • Q29 — Stone dropped from rising balloon: initial velocity = balloon velocity
- 8 Apr S2 • Q31 — Complementary angles: T₁T₂ = 2R/g
- 8 Apr S2 • Q50 — Uniformly accelerated motion & momentum ratio
