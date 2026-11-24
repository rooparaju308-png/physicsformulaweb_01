# Thermodynamics

- Class: 11 Physics
- Chapter no.: 12
- Weightage: High

> The first law is energy conservation including heat. The second law sets the direction of natural processes and the limit on engine efficiency.

## First Law of Thermodynamics

1. Heat given to a system = increase in internal energy + work done by the system.

$$\Delta Q=\Delta U+\Delta W$$

2. Internal energy $U$ is a state function (depends only on the state). For an ideal gas it depends only on $T$: $\Delta U=nC_v\Delta T$ for any process. $Q$ and $W$ depend on the path. ($\Delta U$ is the same for every path between two states; $W$ and $Q$ differ.)

| Process | Condition | $W$ | $\Delta U$ | $Q$ |
|---|---|---|---|---|
| Isochoric | $V$ const | 0 | $nC_v\Delta T$ | $nC_v\Delta T$ |
| Isobaric | $p$ const | $p\Delta V=nR\Delta T$ | $nC_v\Delta T$ | $nC_p\Delta T$ |
| Isothermal | $T$ const | $nRT\ln\dfrac{V_2}{V_1}$ | 0 | $=W$ |
| Adiabatic | $Q=0$ | $\dfrac{p_1V_1-p_2V_2}{\gamma-1}$ | $=-W$ | 0 |
| Cyclic | returns to start | enclosed area | 0 | $=W$ |
| Free expansion | into vacuum | 0 | 0 | 0 |

> Isobaric heating: $\Delta Q:\Delta U:\Delta W=C_p:C_v:R$ = 7 : 5 : 2 for a diatomic gas (5 : 3 : 2 monatomic). Free expansion is adiabatic and irreversible, with $\Delta T=0$ for an ideal gas (assertion–reason).

*Asked: 2026 • 2 Apr • Morning; 2024 • 8 Apr • Evening; 2025 • 24 Jan • Evening*

## Work Done by a Gas

3. For a quasi-static process the work is the area under the $p$–$V$ curve. It is positive for expansion. In a cycle the net work = enclosed area (clockwise on $p$–$V$ means work done by the gas, as in an engine). On a $p$–$V$ diagram the adiabatic is steeper than the isothermal.

$$W=\int_{V_1}^{V_2}p\,dV$$

> Net work or heat over a cycle drawn on $p$–$V$ or $V$–$T$ axes. Convert other graphs to $p$–$V$ first.

*Asked: 2023 • 15 Apr • Morning; 2024 • 5 Apr • Morning*

## Heat Engines, Second Law, Reversibility

4. A heat engine takes $Q_1$ from the source (temperature $T_1$), does work $W$, and rejects $Q_2$ to the sink ($T_2$):

$$\eta=\frac{W}{Q_1}=1-\frac{Q_2}{Q_1}$$

5. Second law. Kelvin–Planck: no engine can convert heat completely into work in a cycle. Clausius: heat cannot flow from cold to hot by itself (without work). The two statements are equivalent.
6. Refrigerator (heat pump): coefficient of performance $\beta=\dfrac{Q_2}{W}=\dfrac{Q_2}{Q_1-Q_2}$.
7. Reversible process: quasi-static, no friction or dissipation. It can be retraced exactly. All real processes (heat flow across a finite $\Delta T$, free expansion, friction) are irreversible.

## Entropy & Carnot Engine

8. Entropy: $dS=\dfrac{dQ_{rev}}{T}$. For an isolated system, $S$ never decreases (it stays constant only for reversible processes).
9. Carnot cycle: two isotherms + two adiabats between $T_1$ and $T_2$. It is the most efficient engine possible between those temperatures, and its efficiency is independent of the working substance (Carnot's theorem).

$$\eta_{Carnot}=1-\frac{T_2}{T_1},\qquad \frac{Q_1}{Q_2}=\frac{T_1}{T_2}$$

$$\beta_{Carnot}=\frac{T_2}{T_1-T_2}$$

> Carnot questions: efficiency changes when one reservoir temperature is changed, and an irreversible engine is always less efficient than Carnot.

*Asked: 2022 • 28 Jul • Morning; 2021 • 25 Jul • Evening; 2023 • 12 Apr • Morning*

### JEE Main Focus — first law, engines and cycles

**Question patterns asked again and again**
- Carnot efficiency change with reservoir temperature — e.g. 2022 • 28 Jul • Morning; 2021 • 25 Jul • Evening
- Net work/heat over a cycle — e.g. 2023 • 15 Apr • Morning; 2024 • 5 Apr • Morning
- Match-list: processes with signs of $W$, $Q$, $\Delta U$ — e.g. 2025 • 7 Apr • Evening; 2023 • 25 Jan • Evening
- Statements: zeroth/first law, intensive/extensive variables — e.g. 2026 • 5 Apr • Morning
- Isobaric heat split into $\Delta U$ and $W$ — e.g. 2024 • 8 Apr • Evening; 2026 • 8 Apr • Evening

**Tricky points**
- Isothermal: $\Delta U=0$ but $Q\ne0$ ($Q=W$).
- (Extensive variable)/mass is intensive, e.g. specific heat.
- $\Delta U=nC_v\Delta T$ holds for every process, not only isochoric.

**Mistakes to avoid**
- Sign of $W$ (by the gas or on the gas).
- Using the net heat instead of the heat absorbed in $\eta=W/Q_{in}$.

**Asked in April 2026**
- 5 Apr S1 • Q33 — Statements: zeroth/first law, intensive & extensive variables

## Specific Heats and Gas Processes

A gas has many specific heats (it depends on the process). $C_p$ and $C_v$, and the adiabatic process, are the core of most thermodynamics numericals.

### Cp, Cv & Mayer's Relation

10. Molar heat capacity at constant volume $C_v=\dfrac1n\left(\dfrac{dQ}{dT}\right)_V$ and at constant pressure $C_p$. At constant $p$, extra heat goes into doing work, so $C_p>C_v$.

$$C_p-C_v=R,\qquad \gamma=\frac{C_p}{C_v}$$

### Determination of Cp, Cv

11. Regnault's method ($C_p$: gas flowing through a heated coil into a calorimeter) and Joly's differential steam calorimeter ($C_v$). For reading only.

### Isothermal & Adiabatic Processes

12. Isothermal: $pV$ = const (slow, in a diathermic container). Adiabatic: $Q=0$ (fast, or in an insulated container):

$$pV^\gamma=\text{const},\qquad TV^{\gamma-1}=\text{const},\qquad T^\gamma p^{1-\gamma}=\text{const}$$

13. The adiabatic curve is steeper than the isotherm through the same point:

$$\left(\frac{dp}{dV}\right)_{adia}=\gamma\left(\frac{dp}{dV}\right)_{iso}=-\gamma\frac pV$$

14. Work in an adiabatic process (depends only on $\gamma$ and $\Delta T$):

$$W=\frac{p_1V_1-p_2V_2}{\gamma-1}=\frac{nR(T_1-T_2)}{\gamma-1}$$

15. Polytropic $pV^x$ = const: $W=\dfrac{nR\Delta T}{1-x}$, molar heat capacity $C=C_v+\dfrac{R}{1-x}$.

> Adiabatic processes are the most asked thermodynamics topic: $p$–$V$–$T$ ratios, finding $\gamma$ from "$p\propto T^3$" ($\dfrac{\gamma}{\gamma-1}=3$ ⇒ $\gamma=3/2$), work when the volume doubles, $\Delta U$ in adiabatic expansion when the volume becomes 27 times.

*Asked: 2025 • 8 Apr • Evening; 2024 • 5 Apr • Evening; 2024 • 4 Apr • Evening; 2026 • 8 Apr • Evening*

### Equipartition of Energy

16. Each quadratic degree of freedom gets $\tfrac12k_BT$. Therefore:

$$C_v=\frac f2R,\qquad C_p=\left(\frac f2+1\right)R,\qquad \gamma=1+\frac2f$$

| Gas | $f$ | $C_v$ | $C_p$ | $\gamma$ |
|---|---|---|---|---|
| Monatomic (He, Ar) | 3 | $3R/2$ | $5R/2$ | $5/3\approx1.67$ |
| Diatomic rigid (O₂, N₂) | 5 | $5R/2$ | $7R/2$ | $7/5=1.4$ |
| Diatomic with vibration | 7 | $7R/2$ | $9R/2$ | $9/7$ |
| Non-linear polyatomic | 6 | $3R$ | $4R$ | $4/3$ |

17. Solids (Dulong–Petit): molar heat capacity ≈ $3R$.

> "Diatomic gas with rotational modes only" means $f=5$. An extra vibrational mode adds $R$ to $C_v$. Insulated cylinder with a piston: the unheated side is compressed adiabatically.

*Asked: 2026 • 8 Apr • Evening; 2023 • 25 Jan • Evening; 2026 • 6 Apr • Evening*

### JEE Main Focus — adiabatic processes and $C_p$, $C_v$

**Question patterns asked again and again**
- Adiabatic ratios / $\gamma$ from a $p$–$T$ relation — e.g. 2024 • 5 Apr • Evening; 2024 • 27 Jan • Evening
- Adiabatic work — e.g. 2024 • 4 Apr • Evening; 2023 • 1 Feb • Morning; 2026 • 2 Apr • Morning
- Isothermal vs adiabatic assertion–reason — e.g. 2025 • 29 Jan • Evening; 2023 • 10 Apr • Morning
- $C_p-C_v=R$, $f$ and $\gamma$ statements — e.g. 2026 • 5 Apr • Morning

**Concepts combined in one question**
- Adiabatic + first law + KTG
- Thermodynamics + mechanics (piston displacement, $W=pAx$)

**Tricky points**
- For expansion between the same volumes, isothermal work > adiabatic work.
- Adiabatic ≠ isothermal even though both can be "slow". Adiabatic just means $Q=0$.

**Mistakes to avoid**
- Using $\gamma=1.4$ for a monatomic gas.

**Asked in April 2026**
- 2 Apr S1 • Q33 — Isobaric heating of diatomic gas: ΔQ:ΔU:ΔW = 7:5:2
- 2 Apr S1 • Q47 — Adiabatic expansion work W = (P₁V₁ − P₂V₂)/(γ−1) from Cp, Cv
- 2 Apr S2 • Q48 — ΔU at constant volume = nC_vΔT, C_v = C_p − R (calorie units)
- 5 Apr S1 • Q32 — ΔU = nC_vΔT = nRΔT/(γ−1); γ = 1 + 2/f
- 6 Apr S2 • Q30 — Adiabatic piston: right side compressed adiabatically, P V^γ = const
- 8 Apr S2 • Q35 — Isobaric heating of diatomic gas: Q = nC_pΔT
- 8 Apr S2 • Q36 — Adiabatic expansion: ΔU = (P₂V₂ − P₁V₁)/(γ−1)
