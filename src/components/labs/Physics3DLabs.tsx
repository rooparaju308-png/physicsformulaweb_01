import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { FormulaCard } from '../FormulaCard';
import { getFormulaById } from '../../data/formulas';
import { MistakeErrorType, MistakeSource } from '../../types/physics';

export type Lab3DId = 'lorentz-3d' | 'biot-savart-3d' | 'bohr-orbitals-3d';

interface Physics3DLabsProps {
  labId: Lab3DId;
  knownIds: string[];
  bookmarkedIds: string[];
  onToggleKnown: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onJumpToFormula: (id: string) => void;
  onFlagMistake?: (entry: {
    source: MistakeSource;
    chapter: string;
    title: string;
    prompt: string;
    formulaId?: string;
    errorType?: MistakeErrorType;
    explanation?: string;
  }) => void;
}

type BiotMode = 'loop' | 'solenoid' | 'dipole';
type BohrViewMode = 'standing-wave' | 'shell';

function detectSoftwareWebGL(): boolean {
  if (typeof document === 'undefined') return true;
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function makeVectorArrow(colorHex: number): THREE.Group {
  const grp = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: colorHex,
    emissive: colorHex,
    emissiveIntensity: 0.25,
    metalness: 0.25,
    roughness: 0.3,
  });
  const shaftGeom = new THREE.CylinderGeometry(0.045, 0.045, 1, 14);
  shaftGeom.translate(0, 0.5, 0);
  const shaft = new THREE.Mesh(shaftGeom, mat);
  shaft.name = 'shaft';

  const headGeom = new THREE.ConeGeometry(0.13, 0.34, 16);
  headGeom.translate(0, 0.17, 0);
  const head = new THREE.Mesh(headGeom, mat);
  head.name = 'head';

  grp.add(shaft);
  grp.add(head);
  return grp;
}

const _up = new THREE.Vector3(0, 1, 0);
const _dirNorm = new THREE.Vector3();

function setArrowFromVec(arrow: THREE.Group, origin: THREE.Vector3, vec: THREE.Vector3) {
  const len = vec.length();
  arrow.position.copy(origin);
  if (len < 0.02) {
    arrow.visible = false;
    return;
  }
  arrow.visible = true;
  _dirNorm.copy(vec).divideScalar(len);
  arrow.quaternion.setFromUnitVectors(_up, _dirNorm);

  const headLen = Math.min(0.34, len * 0.4);
  const shaftLen = Math.max(0.05, len - headLen);
  const shaft = arrow.getObjectByName('shaft') as THREE.Mesh | undefined;
  const head = arrow.getObjectByName('head') as THREE.Mesh | undefined;
  if (shaft) {
    shaft.scale.set(1, shaftLen, 1);
  }
  if (head) {
    head.position.set(0, shaftLen, 0);
    head.scale.set(1, headLen / 0.34, 1);
  }
}

function disposeObjectTree(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
  });
}

export const Physics3DLabs: React.FC<Physics3DLabsProps> = ({
  labId,
  knownIds,
  bookmarkedIds,
  onToggleKnown,
  onToggleBookmark,
  onJumpToFormula,
  onFlagMistake,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [contextFailed, setContextFailed] = useState(false);

  // Lorentz 3D controls
  const [speed, setSpeed] = useState(4.0); // x10^6 m/s
  const [bField, setBField] = useState(1.2); // T
  const [thetaDeg, setThetaDeg] = useState(60); // deg between v and B
  const [chargeSign, setChargeSign] = useState<1 | -1>(1);
  const [playing, setPlaying] = useState(true);

  // Biot-Savart 3D controls
  const [biotMode, setBiotMode] = useState<BiotMode>('loop');
  const [currentI, setCurrentI] = useState(6.0); // A
  const [loopRadius, setLoopRadius] = useState(1.4); // normalized unit (R)
  const [currentDir, setCurrentDir] = useState<1 | -1>(1);
  const [probeX, setProbeX] = useState(1.0); // x/R

  // Bohr Orbitals 3D controls
  const [quantumN, setQuantumN] = useState(3);
  const [bohrView, setBohrView] = useState<BohrViewMode>('standing-wave');
  const [nInitial, setNInitial] = useState(3);
  const [nFinal, setNFinal] = useState(2);

  // Mutable refs for live 3D frame updates without recreating WebGL context
  const paramsRef = useRef({
    labId,
    speed,
    bField,
    thetaDeg,
    chargeSign,
    playing,
    biotMode,
    currentI,
    loopRadius,
    currentDir,
    probeX,
    quantumN,
    bohrView,
  });

  useEffect(() => {
    paramsRef.current = {
      labId,
      speed,
      bField,
      thetaDeg,
      chargeSign,
      playing,
      biotMode,
      currentI,
      loopRadius,
      currentDir,
      probeX,
      quantumN,
      bohrView,
    };
  }, [
    labId,
    speed,
    bField,
    thetaDeg,
    chargeSign,
    playing,
    biotMode,
    currentI,
    loopRadius,
    currentDir,
    probeX,
    quantumN,
    bohrView,
  ]);

  const handleResetView = () => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    if (labId === 'lorentz-3d') {
      cam.position.set(5.4, 3.6, 6.2);
    } else if (labId === 'biot-savart-3d') {
      cam.position.set(4.8, 3.1, 6.0);
    } else {
      cam.position.set(0.2, 4.8, 6.2);
    }
    ctrl.target.set(0, 0, 0);
    ctrl.update();
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setContextFailed(true);
      return;
    }

    setContextFailed(false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));

    const w = Math.max(300, container.clientWidth);
    const h = Math.max(320, container.clientHeight);
    renderer.setSize(w, h);

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070d1b);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, w / Math.max(1, h), 0.1, 100);
    if (labId === 'lorentz-3d') camera.position.set(5.4, 3.6, 6.2);
    else if (labId === 'biot-savart-3d') camera.position.set(4.8, 3.1, 6.0);
    else camera.position.set(0.2, 4.8, 6.2);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.6;
    controls.maxDistance = 18;
    controlsRef.current = controls;

    // Three-point studio lighting
    const hemi = new THREE.HemisphereLight(0xcffafe, 0x0f172a, 0.7);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xa855f7, 0.75);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    // Subtle reference floor grid
    const grid = new THREE.GridHelper(12, 16, 0x1e293b, 0x0f172a);
    grid.position.y = -2.4;
    scene.add(grid);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Build mode-specific Three.js objects
    // 1. LORENTZ 3D OBJECTS
    let lorentzParticle: THREE.Mesh | null = null;
    let lorentzTrail: THREE.Line | null = null;
    let lorentzTrailPos: Float32Array | null = null;
    let arrowV: THREE.Group | null = null;
    let arrowB: THREE.Group | null = null;
    let arrowF: THREE.Group | null = null;
    const lorentzFieldArrows: THREE.Group[] = [];

    // 2. BIOT-SAVART 3D OBJECTS
    let loopTorus: THREE.Mesh | null = null;
    let solenoidGroup: THREE.Group | null = null;
    let dipoleRodGroup: THREE.Group | null = null;
    let probeSphere: THREE.Mesh | null = null;
    let probeArrowB: THREE.Group | null = null;
    let biotLinesGroup: THREE.Group | null = null;
    let lastBiotSignature = '';

    // 3. BOHR 3D OBJECTS
    let nucleusMesh: THREE.Mesh | null = null;
    let bohrWaveLine: THREE.Line | null = null;
    let bohrWaveGeom: THREE.BufferGeometry | null = null;
    let bohrBaseCircle: THREE.Line | null = null;
    let bohrElectron: THREE.Mesh | null = null;
    let bohrGhostRings: THREE.Line[] = [];
    let lastBohrN = -1;

    if (labId === 'lorentz-3d') {
      // Uniform B field background arrows pointing along +X
      for (let y = -1.2; y <= 1.2; y += 1.2) {
        for (let z = -1.2; z <= 1.2; z += 1.2) {
          if (Math.abs(y) < 0.1 && Math.abs(z) < 0.1) continue;
          const bGuide = makeVectorArrow(0x7c3aed);
          bGuide.scale.setScalar(0.65);
          setArrowFromVec(bGuide, new THREE.Vector3(-2.6, y, z), new THREE.Vector3(5.2, 0, 0));
          bGuide.traverse((c) => {
            const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
            if (m) {
              m.transparent = true;
              m.opacity = 0.28;
            }
          });
          rootGroup.add(bGuide);
          lorentzFieldArrows.push(bGuide);
        }
      }

      lorentzParticle = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 24, 24),
        new THREE.MeshStandardMaterial({
          color: 0x22d3ee,
          emissive: 0x22d3ee,
          emissiveIntensity: 0.45,
          metalness: 0.2,
          roughness: 0.2,
        })
      );
      rootGroup.add(lorentzParticle);

      const ptsCount = 220;
      lorentzTrailPos = new Float32Array(ptsCount * 3);
      const trailGeom = new THREE.BufferGeometry();
      trailGeom.setAttribute('position', new THREE.BufferAttribute(lorentzTrailPos, 3));
      lorentzTrail = new THREE.Line(
        trailGeom,
        new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
      );
      rootGroup.add(lorentzTrail);

      arrowV = makeVectorArrow(0x22d3ee); // Cyan velocity
      arrowB = makeVectorArrow(0xa855f7); // Violet magnetic field
      arrowF = makeVectorArrow(0x10b981); // Emerald Lorentz force
      rootGroup.add(arrowV, arrowB, arrowF);
    } else if (labId === 'biot-savart-3d') {
      loopTorus = new THREE.Mesh(
        new THREE.TorusGeometry(1.4, 0.065, 18, 64),
        new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xd97706,
          emissiveIntensity: 0.3,
          metalness: 0.75,
          roughness: 0.25,
        })
      );
      loopTorus.rotation.y = Math.PI / 2; // Loop sits in YZ plane, axis is X
      rootGroup.add(loopTorus);

      solenoidGroup = new THREE.Group();
      const coilMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xb45309,
        emissiveIntensity: 0.25,
        metalness: 0.75,
        roughness: 0.25,
      });
      for (let i = -3; i <= 3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.045, 14, 48), coilMat);
        ring.rotation.y = Math.PI / 2;
        ring.position.x = i * 0.42;
        solenoidGroup.add(ring);
      }
      rootGroup.add(solenoidGroup);

      dipoleRodGroup = new THREE.Group();
      const northMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.45, 0.45),
        new THREE.MeshStandardMaterial({ color: 0xf43f5e, metalness: 0.4, roughness: 0.35 })
      );
      northMesh.position.x = 0.55;
      const southMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.45, 0.45),
        new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.4, roughness: 0.35 })
      );
      southMesh.position.x = -0.55;
      dipoleRodGroup.add(northMesh, southMesh);
      rootGroup.add(dipoleRodGroup);

      // Axis line along X
      const axisGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-4.2, 0, 0),
        new THREE.Vector3(4.2, 0, 0),
      ]);
      const axisLine = new THREE.Line(
        axisGeom,
        new THREE.LineBasicMaterial({ color: 0x475569, transparent: true, opacity: 0.5 })
      );
      rootGroup.add(axisLine);

      biotLinesGroup = new THREE.Group();
      rootGroup.add(biotLinesGroup);

      probeSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 20, 20),
        new THREE.MeshStandardMaterial({
          color: 0x22d3ee,
          emissive: 0x22d3ee,
          emissiveIntensity: 0.5,
        })
      );
      probeArrowB = makeVectorArrow(0x22d3ee);
      rootGroup.add(probeSphere, probeArrowB);
    } else {
      // BOHR ORBITALS 3D
      nucleusMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 28, 28),
        new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xf97316,
          emissiveIntensity: 0.55,
          metalness: 0.3,
          roughness: 0.25,
        })
      );
      rootGroup.add(nucleusMesh);

      // Ghost shells for n = 1..5
      for (let n = 1; n <= 5; n++) {
        const rad = 0.55 * n;
        const pts: THREE.Vector3[] = [];
        for (let k = 0; k <= 64; k++) {
          const a = (k / 64) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(a) * rad, 0, Math.sin(a) * rad));
        }
        const g = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(
          g,
          new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.5 })
        );
        rootGroup.add(line);
        bohrGhostRings.push(line);
      }

      const wavePtsCount = 241;
      bohrWaveGeom = new THREE.BufferGeometry();
      bohrWaveGeom.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(wavePtsCount * 3), 3)
      );
      bohrWaveLine = new THREE.Line(
        bohrWaveGeom,
        new THREE.LineBasicMaterial({ color: 0x22d3ee })
      );
      rootGroup.add(bohrWaveLine);

      const basePts: THREE.Vector3[] = [];
      for (let k = 0; k <= 96; k++) {
        const a = (k / 96) * Math.PI * 2;
        basePts.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
      }
      bohrBaseCircle = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(basePts),
        new THREE.LineBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.55 })
      );
      rootGroup.add(bohrBaseCircle);

      bohrElectron = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 20, 20),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x22d3ee,
          emissiveIntensity: 0.6,
        })
      );
      rootGroup.add(bohrElectron);
    }

    const rebuildBiotFieldLines = (mode: BiotMode, rad: number, dir: 1 | -1) => {
      if (!biotLinesGroup) return;
      while (biotLinesGroup.children.length > 0) {
        const child = biotLinesGroup.children[0];
        biotLinesGroup.remove(child);
        disposeObjectTree(child);
      }
      const lineMat = new THREE.LineBasicMaterial({
        color: dir === 1 ? 0x38bdf8 : 0xa855f7,
        transparent: true,
        opacity: 0.45,
      });

      const phiAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
      phiAngles.forEach((phi) => {
        const offsets = mode === 'solenoid' ? [0.35, 0.7] : [rad * 0.55, rad * 0.9];
        offsets.forEach((off) => {
          const pts: THREE.Vector3[] = [];
          const span = mode === 'solenoid' ? 3.2 : 2.6;
          for (let i = 0; i <= 40; i++) {
            const t = i / 40;
            const x = -span + t * span * 2;
            const flare = mode === 'solenoid'
              ? 1 + 0.35 * Math.pow(Math.max(0, Math.abs(x) - 1.1), 1.6)
              : 1 + 0.45 * (x * x) / (rad * rad + 0.6);
            const rLocal = off * flare;
            pts.push(new THREE.Vector3(x, rLocal * Math.cos(phi), rLocal * Math.sin(phi)));
          }
          const geom = new THREE.BufferGeometry().setFromPoints(pts);
          biotLinesGroup!.add(new THREE.Line(geom, lineMat));
        });
      });
    };

    let simPhase = 0;
    let lastTime = performance.now();
    let rafId = 0;
    let intervalId: number | null = null;
    let stopped = false;

    const pOrigin = new THREE.Vector3();
    const vVec = new THREE.Vector3();
    const bVec = new THREE.Vector3();
    const fVec = new THREE.Vector3();

    const renderFrame = (now: number) => {
      if (stopped) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      const p = paramsRef.current;

      if (p.playing) {
        simPhase += dt * 1.9;
      }

      if (p.labId === 'lorentz-3d' && lorentzParticle && lorentzTrail && lorentzTrailPos && arrowV && arrowB && arrowF) {
        const thetaRad = (p.thetaDeg * Math.PI) / 180;
        const vMag = p.speed * 0.42;
        const omega = p.chargeSign * Math.max(0.5, p.bField * 1.4);
        const r = Math.max(0.25, Math.min(1.65, (vMag * Math.sin(thetaRad)) / Math.max(0.5, p.bField * 0.9)));
        const vx = vMag * Math.cos(thetaRad);

        // Centered periodic helix around X in [-2.6, 2.6]
        const rawX = vx * simPhase * 0.65;
        const xCentered = p.thetaDeg >= 87 ? 0 : ((rawX + 2.6) % 5.2) - 2.6;
        const ang = omega * simPhase;
        const yPos = r * Math.cos(ang);
        const zPos = r * Math.sin(ang);

        lorentzParticle.position.set(xCentered, yPos, zPos);
        const pMat = lorentzParticle.material as THREE.MeshStandardMaterial;
        pMat.color.setHex(p.chargeSign === 1 ? 0x22d3ee : 0xf43f5e);
        pMat.emissive.setHex(p.chargeSign === 1 ? 0x22d3ee : 0xf43f5e);

        // Instantaneous velocity tangent
        const vy = -r * omega * Math.sin(ang);
        const vz = r * omega * Math.cos(ang);
        vVec.set(vx * 0.95, vy, vz).normalize().multiplyScalar(0.9 + p.speed * 0.14);
        bVec.set(1, 0, 0).multiplyScalar(0.8 + p.bField * 0.35);
        // F = q (v x B)
        fVec.crossVectors(vVec, bVec).multiplyScalar(p.chargeSign * 0.72);
        if (fVec.length() > 1.8) fVec.setLength(1.8);

        pOrigin.copy(lorentzParticle.position);
        setArrowFromVec(arrowV, pOrigin, vVec);
        setArrowFromVec(arrowB, pOrigin, bVec);
        setArrowFromVec(arrowF, pOrigin, fVec);

        // Update trail path behind current phase
        const count = lorentzTrailPos.length / 3;
        for (let i = 0; i < count; i++) {
          const backT = simPhase - (i / count) * 4.4;
          const rx = vx * backT * 0.65;
          const tx = p.thetaDeg >= 87 ? 0 : ((rx + 2.6) % 5.2) - 2.6;
          const ta = omega * backT;
          lorentzTrailPos[i * 3] = tx;
          lorentzTrailPos[i * 3 + 1] = r * Math.cos(ta);
          lorentzTrailPos[i * 3 + 2] = r * Math.sin(ta);
        }
        lorentzTrail.geometry.attributes.position.needsUpdate = true;
      } else if (
        p.labId === 'biot-savart-3d' &&
        loopTorus &&
        solenoidGroup &&
        dipoleRodGroup &&
        probeSphere &&
        probeArrowB
      ) {
        loopTorus.visible = p.biotMode === 'loop';
        solenoidGroup.visible = p.biotMode === 'solenoid';
        dipoleRodGroup.visible = p.biotMode === 'dipole';

        const rScale = p.loopRadius / 1.4;
        loopTorus.scale.set(rScale, rScale, 1);
        solenoidGroup.scale.set(1, rScale * 0.9, rScale * 0.9);
        dipoleRodGroup.scale.set(p.currentDir, 1, 1);

        const sig = `${p.biotMode}:${p.loopRadius.toFixed(2)}:${p.currentDir}`;
        if (sig !== lastBiotSignature) {
          lastBiotSignature = sig;
          rebuildBiotFieldLines(p.biotMode, p.loopRadius, p.currentDir);
        }

        const xWorld = p.probeX * p.loopRadius;
        probeSphere.position.set(xWorld, 0, 0);

        let bRel = 1;
        if (p.biotMode === 'loop') {
          bRel = Math.pow(1 / (1 + p.probeX * p.probeX), 1.5);
        } else if (p.biotMode === 'solenoid') {
          bRel = Math.abs(xWorld) < 1.3 ? 1.0 : 1.0 / (1 + Math.pow(Math.abs(xWorld) - 1.3, 2));
        } else {
          bRel = 1 / Math.pow(Math.max(0.75, Math.abs(p.probeX)), 3);
        }
        const arrowLen = Math.max(0.3, Math.min(2.1, bRel * (p.currentI / 5) * 1.35));
        pOrigin.copy(probeSphere.position);
        bVec.set(p.currentDir * arrowLen, 0, 0);
        setArrowFromVec(probeArrowB, pOrigin, bVec);
      } else if (
        p.labId === 'bohr-orbitals-3d' &&
        bohrWaveLine &&
        bohrWaveGeom &&
        bohrBaseCircle &&
        bohrElectron
      ) {
        const n = p.quantumN;
        const rad = 0.55 * n;
        bohrBaseCircle.scale.setScalar(rad);

        if (n !== lastBohrN) {
          lastBohrN = n;
          bohrGhostRings.forEach((ring, idx) => {
            const mat = ring.material as THREE.LineBasicMaterial;
            mat.color.setHex(idx + 1 === n ? 0x22d3ee : 0x334155);
            mat.opacity = idx + 1 === n ? 0.65 : 0.28;
          });
        }

        bohrWaveLine.visible = p.bohrView === 'standing-wave';
        if (p.bohrView === 'standing-wave') {
          const posAttr = bohrWaveGeom.getAttribute('position') as THREE.BufferAttribute;
          const arr = posAttr.array as Float32Array;
          const pts = posAttr.count;
          const osc = Math.cos(simPhase * 2.2);
          const amp = 0.16 + 0.02 * n;
          for (let i = 0; i < pts; i++) {
            const a = (i / (pts - 1)) * Math.PI * 2;
            const wave = Math.sin(n * a) * osc;
            const rMod = rad + wave * amp * 0.72;
            const yMod = wave * amp * 0.85;
            arr[i * 3] = Math.cos(a) * rMod;
            arr[i * 3 + 1] = yMod;
            arr[i * 3 + 2] = Math.sin(a) * rMod;
          }
          posAttr.needsUpdate = true;
        }

        const speedScale = 1.6 / Math.sqrt(n);
        const eAngle = simPhase * speedScale;
        bohrElectron.position.set(Math.cos(eAngle) * rad, 0, Math.sin(eAngle) * rad);
      }

      controls.update();
      renderer.render(scene, camera);

      if (!isSoftwareGl && !stopped) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    if (isSoftwareGl) {
      renderFrame(performance.now());
      intervalId = window.setInterval(() => renderFrame(performance.now()), 50);
    } else {
      rafId = requestAnimationFrame(renderFrame);
    }

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextFailed(true);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    const ro = new ResizeObserver(() => {
      if (!container || stopped) return;
      const nw = Math.max(280, container.clientWidth);
      const nh = Math.max(300, container.clientHeight);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(container);

    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
      if (intervalId !== null) window.clearInterval(intervalId);
      ro.disconnect();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      controls.dispose();
      disposeObjectTree(scene);
      envTarget.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, [labId]);

  // Physics Readouts
  const lorentzReadout = useMemo(() => {
    const thetaRad = (thetaDeg * Math.PI) / 180;
    const qOverM = 1e8; // C/kg scaled
    const vSI = speed * 1e6;
    const radiusCm = ((vSI * Math.sin(thetaRad)) / (qOverM * bField)) * 100;
    const pitchCm = ((2 * Math.PI * vSI * Math.cos(thetaRad)) / (qOverM * bField)) * 100;
    const fRel = speed * bField * Math.sin(thetaRad);
    return {
      radiusCm: radiusCm.toFixed(2),
      pitchCm: pitchCm.toFixed(2),
      fRel: fRel.toFixed(2),
      shape: thetaDeg <= 5 ? 'Straight Line (F=0)' : thetaDeg >= 85 ? 'Pure Circle' : '3D Helix',
    };
  }, [speed, bField, thetaDeg]);

  const biotReadout = useMemo(() => {
    const mu0Over2 = 2 * Math.PI * 1e-7; // T·m/A
    const b0uT = (mu0Over2 * currentI) / (loopRadius * 0.05) * 1e6; // scaled R in cm (5cm * R)
    let ratio = 1;
    if (biotMode === 'loop') {
      ratio = Math.pow(1 / (1 + probeX * probeX), 1.5);
    } else if (biotMode === 'solenoid') {
      ratio = Math.abs(probeX) <= 1.0 ? 1.0 : 1.0 / (1 + Math.pow(Math.abs(probeX) - 1.0, 2));
    } else {
      ratio = 1 / Math.pow(Math.max(0.75, Math.abs(probeX)), 3);
    }
    return {
      bProbe: (b0uT * ratio).toFixed(1),
      ratioPct: (ratio * 100).toFixed(1),
    };
  }, [biotMode, currentI, loopRadius, probeX]);

  const bohrReadout = useMemo(() => {
    const rAngstrom = (0.529 * quantumN * quantumN).toFixed(2);
    const eN = (-13.6 / (quantumN * quantumN)).toFixed(2);
    const vKmS = (2188 / quantumN).toFixed(0);
    const dE = Math.abs(-13.6 * (1 / (nFinal * nFinal) - 1 / (nInitial * nInitial)));
    const lambdaNm = dE > 0.001 ? (1240 / dE).toFixed(1) : '∞';
    const seriesName =
      Math.min(nInitial, nFinal) === 1
        ? 'Lyman (UV)'
        : Math.min(nInitial, nFinal) === 2
        ? 'Balmer (Visible)'
        : Math.min(nInitial, nFinal) === 3
        ? 'Paschen (IR)'
        : 'Brackett/Pfund (IR)';
    return { rAngstrom, eN, vKmS, dE: dE.toFixed(2), lambdaNm, seriesName };
  }, [quantumN, nInitial, nFinal]);

  const linkedFormulaId =
    labId === 'lorentz-3d'
      ? 'mag-lorentz'
      : labId === 'biot-savart-3d'
      ? biotMode === 'solenoid'
        ? 'mag-solenoid-toroid'
        : biotMode === 'dipole'
        ? 'mag-dipole-torque'
        : 'mag-biot-savart'
      : 'mod-bohr-quantization';

  const linkedFormula = getFormulaById(linkedFormulaId);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* 3D Viewport */}
        <div className="lg:col-span-7 relative rounded-2xl border border-slate-700/75 bg-slate-950 overflow-hidden min-h-[360px] sm:min-h-[420px] flex flex-col">
          {contextFailed ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-amber-300">WebGL context unavailable on this device.</p>
              <p className="text-slate-400">Use the parameter controls on the right to inspect live physics values.</p>
            </div>
          ) : (
            <div ref={mountRef} className="w-full h-full min-h-[360px] sm:min-h-[420px] cursor-grab active:cursor-grabbing" />
          )}

          {/* Top overlay HUD (solid translucent dark pill, zero backdrop-blur over WebGL) */}
          <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-[11px] text-slate-200 font-semibold pointer-events-auto">
              {labId === 'lorentz-3d' && '3D Lorentz Force · F = q(v × B)'}
              {labId === 'biot-savart-3d' && '3D Magnetic Field Explorer'}
              {labId === 'bohr-orbitals-3d' && '3D Bohr Orbit & Standing Waves (2πr = nλ)'}
            </div>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              {(labId === 'lorentz-3d' || labId === 'bohr-orbitals-3d') && (
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  className="min-h-[32px] px-2.5 rounded-lg bg-slate-950/90 border border-slate-700 text-[11px] font-semibold text-cyan-300 inline-flex items-center gap-1 hover:border-cyan-400"
                >
                  {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{playing ? 'Pause' : 'Play'}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleResetView}
                className="min-h-[32px] px-2.5 rounded-lg bg-slate-950/90 border border-slate-700 text-[11px] font-semibold text-slate-200 inline-flex items-center gap-1 hover:border-cyan-400"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset View</span>
              </button>
            </div>
          </div>

          {/* Bottom Legend Bar */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-700/80 text-[11px] text-slate-300 flex flex-wrap items-center gap-3">
              {labId === 'lorentz-3d' && (
                <>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan-400" /> v vector</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-400" /> B (+x)</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> F = q(v×B)</span>
                </>
              )}
              {labId === 'biot-savart-3d' && (
                <>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> Conductor</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan-400" /> Probe B vector</span>
                </>
              )}
              {labId === 'bohr-orbitals-3d' && (
                <>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> Nucleus</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan-400" /> {quantumN} de Broglie wavelengths</span>
                </>
              )}
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/85 border border-slate-800 text-[10px] text-slate-400">
              Drag to orbit · Scroll to zoom
            </span>
          </div>
        </div>

        {/* Parameter Controls & Live Readouts */}
        <div className="lg:col-span-5 rounded-2xl border studio-surface p-4 sm:p-5 flex flex-col justify-between space-y-4">
          {labId === 'lorentz-3d' && (
            <>
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Lorentz Helix &amp; Cross-Product Controls
                  </h3>
                  <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setChargeSign(1)}
                      className={`px-2.5 py-1 rounded-md font-semibold ${
                        chargeSign === 1 ? 'bg-cyan-500 text-slate-950' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      +q (Proton)
                    </button>
                    <button
                      type="button"
                      onClick={() => setChargeSign(-1)}
                      className={`px-2.5 py-1 rounded-md font-semibold ${
                        chargeSign === -1 ? 'bg-rose-500 text-white' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      −q (Electron)
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Speed v</span>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-300 tabular-nums">{speed.toFixed(1)} × 10⁶ m/s</span>
                  </div>
                  <input type="range" min={1} max={8} step={0.5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Magnetic Field B</span>
                    <span className="font-mono font-bold text-violet-600 dark:text-violet-300 tabular-nums">{bField.toFixed(1)} T</span>
                  </div>
                  <input type="range" min={0.4} max={3.0} step={0.1} value={bField} onChange={(e) => setBField(Number(e.target.value))} className="w-full" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Pitch Angle θ (between v and B)</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-300 tabular-nums">{thetaDeg}°</span>
                  </div>
                  <input type="range" min={0} max={90} step={5} value={thetaDeg} onChange={(e) => setThetaDeg(Number(e.target.value))} className="w-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div className="rounded-xl studio-surface-subtle border p-2.5">
                  <div className="text-slate-500 dark:text-slate-400">Cyclotron Radius r</div>
                  <div className="font-mono font-bold text-sm text-cyan-600 dark:text-cyan-300 tabular-nums">{lorentzReadout.radiusCm} cm</div>
                </div>
                <div className="rounded-xl studio-surface-subtle border p-2.5">
                  <div className="text-slate-500 dark:text-slate-400">Helix Pitch p</div>
                  <div className="font-mono font-bold text-sm text-violet-600 dark:text-violet-300 tabular-nums">{lorentzReadout.pitchCm} cm</div>
                </div>
                <div className="rounded-xl studio-surface-subtle border p-2.5">
                  <div className="text-slate-500 dark:text-slate-400">Force Index (vB sinθ)</div>
                  <div className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-300 tabular-nums">{lorentzReadout.fRel}</div>
                </div>
                <div className="rounded-xl studio-surface-subtle border p-2.5">
                  <div className="text-slate-500 dark:text-slate-400">Trajectory</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{lorentzReadout.shape}</div>
                </div>
              </div>
            </>
          )}

          {labId === 'biot-savart-3d' && (
            <>
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Biot–Savart &amp; Field Probe
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCurrentDir((d) => (d === 1 ? -1 : 1))}
                    className="min-h-[32px] px-3 rounded-lg border border-cyan-500/35 bg-cyan-500/10 text-xs font-semibold text-cyan-700 dark:text-cyan-300"
                  >
                    Flip Current ({currentDir === 1 ? '+X Pole' : '−X Pole'})
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {([
                    { id: 'loop', label: 'Circular Loop' },
                    { id: 'solenoid', label: 'Solenoid' },
                    { id: 'dipole', label: 'Bar Dipole' },
                  ] as const).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setBiotMode(m.id)}
                      className={`min-h-[36px] rounded-xl text-xs font-semibold border transition-colors ${
                        biotMode === m.id
                          ? 'border-cyan-400 bg-cyan-500/15 text-cyan-700 dark:text-cyan-200'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Current I</span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-300 tabular-nums">{currentI.toFixed(1)} A</span>
                  </div>
                  <input type="range" min={1} max={12} step={0.5} value={currentI} onChange={(e) => setCurrentI(Number(e.target.value))} className="w-full" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Loop Radius Scale R</span>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-300 tabular-nums">{(loopRadius * 5).toFixed(1)} cm</span>
                  </div>
                  <input type="range" min={0.8} max={2.2} step={0.1} value={loopRadius} onChange={(e) => setLoopRadius(Number(e.target.value))} className="w-full" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Axial Probe Position (x / R)</span>
                    <span className="font-mono font-bold text-violet-600 dark:text-violet-300 tabular-nums">{probeX.toFixed(2)} R</span>
                  </div>
                  <input type="range" min={-2.5} max={2.5} step={0.1} value={probeX} onChange={(e) => setProbeX(Number(e.target.value))} className="w-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div className="rounded-xl studio-surface-subtle border p-2.5">
                  <div className="text-slate-500 dark:text-slate-400">Field B at Probe</div>
                  <div className="font-mono font-bold text-sm text-cyan-600 dark:text-cyan-300 tabular-nums">{biotReadout.bProbe} μT</div>
                </div>
                <div className="rounded-xl studio-surface-subtle border p-2.5">
                  <div className="text-slate-500 dark:text-slate-400">B / B₀ Ratio</div>
                  <div className="font-mono font-bold text-sm text-violet-600 dark:text-violet-300 tabular-nums">{biotReadout.ratioPct}%</div>
                </div>
              </div>
            </>
          )}

          {labId === 'bohr-orbitals-3d' && (
            <>
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Bohr Shell &amp; Standing Waves
                  </h3>
                  <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setBohrView('standing-wave')}
                      className={`px-2.5 py-1 rounded-md font-semibold ${
                        bohrView === 'standing-wave' ? 'bg-cyan-500 text-slate-950' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      de Broglie Wave
                    </button>
                    <button
                      type="button"
                      onClick={() => setBohrView('shell')}
                      className={`px-2.5 py-1 rounded-md font-semibold ${
                        bohrView === 'shell' ? 'bg-violet-500 text-white' : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Orbit Only
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                    Principal Quantum Number n (Hydrogen Z=1)
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setQuantumN(n)}
                        className={`min-h-[38px] rounded-xl font-mono text-xs font-bold border transition-colors ${
                          quantumN === n
                            ? 'border-cyan-400 bg-cyan-500 text-slate-950'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        n={n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl studio-surface-subtle border p-3 space-y-2">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Photon Transition Calculator (n_i → n_f)
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="space-y-1">
                      <span className="text-slate-500">Initial n_i</span>
                      <select
                        value={nInitial}
                        onChange={(e) => setNInitial(Number(e.target.value))}
                        className="w-full min-h-[34px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2"
                      >
                        {[1, 2, 3, 4, 5, 6].map((v) => (
                          <option key={v} value={v}>n = {v}</option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-1">
                      <span className="text-slate-500">Final n_f</span>
                      <select
                        value={nFinal}
                        onChange={(e) => setNFinal(Number(e.target.value))}
                        className="w-full min-h-[34px] rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2"
                      >
                        {[1, 2, 3, 4, 5].map((v) => (
                          <option key={v} value={v}>n = {v}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 tabular-nums">
                    <span className="text-slate-500 dark:text-slate-400">{bohrReadout.seriesName}</span>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-300">
                      ΔE = {bohrReadout.dE} eV · λ = {bohrReadout.lambdaNm} nm
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div className="rounded-xl studio-surface-subtle border p-2.5">
                  <div className="text-slate-500 dark:text-slate-400">Radius r_n</div>
                  <div className="font-mono font-bold text-cyan-600 dark:text-cyan-300 tabular-nums">{bohrReadout.rAngstrom} Å</div>
                </div>
                <div className="rounded-xl studio-surface-subtle border p-2.5">
                  <div className="text-slate-500 dark:text-slate-400">Energy E_n</div>
                  <div className="font-mono font-bold text-violet-600 dark:text-violet-300 tabular-nums">{bohrReadout.eN} eV</div>
                </div>
                <div className="rounded-xl studio-surface-subtle border p-2.5">
                  <div className="text-slate-500 dark:text-slate-400">Speed v_n</div>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-300 tabular-nums">{bohrReadout.vKmS} km/s</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {linkedFormula && (
        <FormulaCard
          formula={linkedFormula}
          isKnown={knownIds.includes(linkedFormula.id)}
          isBookmarked={bookmarkedIds.includes(linkedFormula.id)}
          onToggleKnown={onToggleKnown}
          onToggleBookmark={onToggleBookmark}
          onJumpToFormula={onJumpToFormula}
          onFlagMistake={onFlagMistake}
        />
      )}
    </div>
  );
};
