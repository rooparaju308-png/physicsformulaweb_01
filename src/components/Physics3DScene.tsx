import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { AccentPalette, Background3DPreset } from '../types/physics';

interface Physics3DSceneProps {
  variant: 'backdrop' | 'hero';
  preset: Background3DPreset;
  enabled: boolean;
  isDark: boolean;
  accent: AccentPalette;
  className?: string;
}

interface PaletteHex {
  primary: number;
  secondary: number;
  positive: number;
  negative: number;
  bgDark: number;
  bgLight: number;
}

function getPaletteColors(accent: AccentPalette): PaletteHex {
  if (accent === 'emerald-teal') {
    return {
      primary: 0x10b981,
      secondary: 0x14b8a6,
      positive: 0x34d399,
      negative: 0x06b6d4,
      bgDark: 0x060913,
      bgLight: 0xf1f5f9,
    };
  }
  if (accent === 'amber-rose') {
    return {
      primary: 0xf59e0b,
      secondary: 0xf43f5e,
      positive: 0xfbbf24,
      negative: 0xfb7185,
      bgDark: 0x060913,
      bgLight: 0xf1f5f9,
    };
  }
  return {
    primary: 0x22d3ee,
    secondary: 0xa855f7,
    positive: 0x22d3ee,
    negative: 0xa855f7,
    bgDark: 0x060913,
    bgLight: 0xf1f5f9,
  };
}

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

function createDipoleCurve(phi: number, rMax: number, separationHalf: number): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const steps = 28;
  for (let i = 0; i <= steps; i++) {
    // theta from 0.22 to PI - 0.22 so endpoints meet near the dipole poles
    const t = i / steps;
    const theta = 0.22 + t * (Math.PI - 0.44);
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);
    const r = rMax * sinT * sinT;
    const rho = r * sinT;
    const y = r * cosT;
    const x = rho * Math.cos(phi);
    const z = rho * Math.sin(phi);
    // Slight smooth pull toward pole separation along Y
    const yShifted = y + (y >= 0 ? separationHalf * 0.25 : -separationHalf * 0.25);
    pts.push(new THREE.Vector3(x, yShifted, z));
  }
  return new THREE.CatmullRomCurve3(pts);
}

// Module-scope reusable scratch objects (zero allocations in render loop)
const _vec3 = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3(1, 1, 1);
const _mat4 = new THREE.Matrix4();
const _color = new THREE.Color();

export const Physics3DScene: React.FC<Physics3DSceneProps> = ({
  variant,
  preset,
  enabled,
  isDark,
  accent,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [contextFailed, setContextFailed] = useState(false);

  // Live mutable refs so prop updates adjust scene without tearing down WebGL
  const stateRef = useRef({
    preset,
    isDark,
    accent,
    pointerX: 0,
    pointerY: 0,
    scrollRatio: 0,
  });

  useEffect(() => {
    stateRef.current.preset = preset;
    stateRef.current.isDark = isDark;
    stateRef.current.accent = accent;
  }, [preset, isDark, accent]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const shouldRender3D = enabled && !reducedMotion && !contextFailed;

  useEffect(() => {
    if (!shouldRender3D) return;
    const container = mountRef.current;
    if (!container) return;

    const isBackdrop = variant === 'backdrop';
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

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = false;

    const initialW = isBackdrop ? window.innerWidth : Math.max(240, container.clientWidth);
    const initialH = isBackdrop ? window.innerHeight : Math.max(200, container.clientHeight);
    renderer.setSize(initialW, initialH);

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const initialPalette = getPaletteColors(stateRef.current.accent);
    const initialBg = stateRef.current.isDark ? initialPalette.bgDark : initialPalette.bgLight;
    scene.fog = new THREE.FogExp2(initialBg, isBackdrop ? 0.055 : 0.032);

    // Studio RoomEnvironment reflection for metallic & glass PBR fidelity
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      isBackdrop ? 46 : 42,
      initialW / Math.max(1, initialH),
      0.1,
      100
    );
    camera.position.set(0, isBackdrop ? 1.2 : 1.0, isBackdrop ? 10.5 : 7.6);
    camera.lookAt(0, 0, 0);

    // Three-point warm/cool studio lighting
    const hemiLight = new THREE.HemisphereLight(0xcffafe, 0x1e1b4b, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1e6, 1.5);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(initialPalette.secondary, 3.2, 24, 1.5);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    // =========================================================================
    // PRESET 1: ELECTROMAGNETIC FIELD & INSTANCED CHARGED PARTICLES
    // =========================================================================
    const emGroup = new THREE.Group();
    scene.add(emGroup);

    const dipoleAssembly = new THREE.Group();
    emGroup.add(dipoleAssembly);

    const poleSep = 1.18;

    // 1. Machined core shaft between dipole poles
    const shaftGeo = new THREE.CylinderGeometry(0.09, 0.09, poleSep * 2, 20);
    const shaftMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.25,
    });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    dipoleAssembly.add(shaftMesh);

    // 2. Central dielectric collar
    const collarGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.24, 24);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.35,
      roughness: 0.65,
    });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    dipoleAssembly.add(collarMesh);

    // 3. Positive (+q) & Negative (-q) pole cores + outer glass containment shells
    const poleCoreGeo = new THREE.SphereGeometry(0.32, 24, 24);
    const posCoreMat = new THREE.MeshStandardMaterial({
      color: initialPalette.positive,
      emissive: initialPalette.positive,
      emissiveIntensity: 0.85,
      metalness: 0.45,
      roughness: 0.18,
    });
    const negCoreMat = new THREE.MeshStandardMaterial({
      color: initialPalette.negative,
      emissive: initialPalette.negative,
      emissiveIntensity: 0.85,
      metalness: 0.45,
      roughness: 0.18,
    });
    const posPole = new THREE.Mesh(poleCoreGeo, posCoreMat);
    posPole.position.y = poleSep;
    const negPole = new THREE.Mesh(poleCoreGeo, negCoreMat);
    negPole.position.y = -poleSep;
    dipoleAssembly.add(posPole, negPole);

    const shellGeo = new THREE.SphereGeometry(0.46, 24, 24);
    const glassShellMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      metalness: 0.05,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
    });
    const posShell = new THREE.Mesh(shellGeo, glassShellMat);
    posShell.position.y = poleSep;
    posShell.renderOrder = 2;
    const negShell = new THREE.Mesh(shellGeo, glassShellMat);
    negShell.position.y = -poleSep;
    negShell.renderOrder = 2;
    dipoleAssembly.add(posShell, negShell);

    // 4. Metallic collar rings around each pole + equatorial flux ring
    const poleRingGeo = new THREE.TorusGeometry(0.42, 0.032, 12, 36);
    const metalRingMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.92,
      roughness: 0.16,
    });
    const topCollarRing = new THREE.Mesh(poleRingGeo, metalRingMat);
    topCollarRing.position.y = poleSep * 0.65;
    topCollarRing.rotation.x = Math.PI / 2;

    const botCollarRing = new THREE.Mesh(poleRingGeo, metalRingMat);
    botCollarRing.position.y = -poleSep * 0.65;
    botCollarRing.rotation.x = Math.PI / 2;

    const eqFluxGeo = new THREE.TorusGeometry(2.15, 0.025, 12, 64);
    const eqFluxMat = new THREE.MeshStandardMaterial({
      color: initialPalette.primary,
      emissive: initialPalette.primary,
      emissiveIntensity: 0.4,
      metalness: 0.7,
      roughness: 0.25,
      transparent: true,
      opacity: 0.65,
    });
    const eqFluxRing = new THREE.Mesh(eqFluxGeo, eqFluxMat);
    eqFluxRing.rotation.x = Math.PI / 2.2;
    dipoleAssembly.add(topCollarRing, botCollarRing, eqFluxRing);

    // 5. Parametric Dipole Field Tubes
    const fieldLinesGroup = new THREE.Group();
    emGroup.add(fieldLinesGroup);

    const dipoleCurves: THREE.CatmullRomCurve3[] = [];
    const fieldLineMatPrimary = new THREE.MeshStandardMaterial({
      color: initialPalette.primary,
      emissive: initialPalette.primary,
      emissiveIntensity: 0.35,
      roughness: 0.35,
      metalness: 0.2,
      transparent: true,
      opacity: isBackdrop ? 0.24 : 0.46,
      depthWrite: false,
    });
    const fieldLineMatSecondary = new THREE.MeshStandardMaterial({
      color: initialPalette.secondary,
      emissive: initialPalette.secondary,
      emissiveIntensity: 0.3,
      roughness: 0.35,
      metalness: 0.2,
      transparent: true,
      opacity: isBackdrop ? 0.2 : 0.4,
      depthWrite: false,
    });

    const azimuthCount = 8;
    const shells = [2.35, 3.65];
    for (let sIdx = 0; sIdx < shells.length; sIdx++) {
      const rMax = shells[sIdx];
      for (let a = 0; a < azimuthCount; a++) {
        const phi = (a / azimuthCount) * Math.PI * 2 + sIdx * 0.2;
        const curve = createDipoleCurve(phi, rMax, poleSep);
        dipoleCurves.push(curve);
        const tubeGeo = new THREE.TubeGeometry(curve, 36, sIdx === 0 ? 0.016 : 0.012, 6, false);
        const tubeMesh = new THREE.Mesh(
          tubeGeo,
          sIdx === 0 ? fieldLineMatPrimary : fieldLineMatSecondary
        );
        fieldLinesGroup.add(tubeMesh);
      }
    }

    // 6. Instanced Charged Particles flowing along the dipole curves
    const particleCount = isBackdrop ? 160 : 120;
    const particleGeo = new THREE.SphereGeometry(0.055, 8, 8);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: initialPalette.primary,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.3,
    });
    const particleInstances = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    particleInstances.frustumCulled = false;

    const particleMeta: { curveIdx: number; phase: number; speed: number; size: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      const curveIdx = i % dipoleCurves.length;
      const phase = (i * 0.6180339) % 1;
      const speed = 0.12 + (i % 5) * 0.025;
      const size = 0.65 + (i % 4) * 0.22;
      particleMeta.push({ curveIdx, phase, speed, size });
      _color.setHex(i % 2 === 0 ? initialPalette.primary : initialPalette.secondary);
      particleInstances.setColorAt(i, _color);
    }
    if (particleInstances.instanceColor) {
      particleInstances.instanceColor.needsUpdate = true;
    }
    particleInstances.computeBoundingSphere();
    emGroup.add(particleInstances);

    // =========================================================================
    // PRESET 2: QUANTUM WAVE MESH & COMPOSITE ORBITAL RINGS
    // =========================================================================
    const quantumGroup = new THREE.Group();
    scene.add(quantumGroup);

    // 1. Undulating Wave-Function Coordinate Surface
    const waveSize = isBackdrop ? 16 : 11.5;
    const waveSegs = isBackdrop ? 38 : 34;
    const waveGeo = new THREE.PlaneGeometry(waveSize, waveSize, waveSegs, waveSegs);
    waveGeo.rotateX(-Math.PI / 2);
    const waveMat = new THREE.MeshBasicMaterial({
      color: initialPalette.primary,
      wireframe: true,
      transparent: true,
      opacity: isBackdrop ? 0.22 : 0.36,
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.position.y = -1.65;
    quantumGroup.add(waveMesh);

    const wavePosAttr = waveGeo.attributes.position as THREE.BufferAttribute;
    const waveBaseXZ = new Float32Array(wavePosAttr.count * 2);
    for (let i = 0; i < wavePosAttr.count; i++) {
      waveBaseXZ[i * 2] = wavePosAttr.getX(i);
      waveBaseXZ[i * 2 + 1] = wavePosAttr.getZ(i);
    }

    // 2. Composite Atomic Nucleus Cluster (multi-part 3-12 sub-spheres)
    const atomAssembly = new THREE.Group();
    atomAssembly.position.y = 0.35;
    quantumGroup.add(atomAssembly);

    const nucleonGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const protonMat = new THREE.MeshStandardMaterial({
      color: initialPalette.primary,
      emissive: initialPalette.primary,
      emissiveIntensity: 0.75,
      metalness: 0.55,
      roughness: 0.18,
    });
    const neutronMat = new THREE.MeshStandardMaterial({
      color: initialPalette.secondary,
      emissive: initialPalette.secondary,
      emissiveIntensity: 0.45,
      metalness: 0.3,
      roughness: 0.52,
    });
    const nucleonOffsets: [number, number, number][] = [
      [0.14, 0.08, 0.06],
      [-0.14, -0.06, 0.09],
      [0.04, -0.14, -0.11],
      [-0.08, 0.13, -0.1],
      [0.11, -0.05, 0.13],
      [-0.12, 0.04, 0.02],
    ];
    nucleonOffsets.forEach(([ox, oy, oz], idx) => {
      const m = new THREE.Mesh(nucleonGeo, idx % 2 === 0 ? protonMat : neutronMat);
      m.position.set(ox, oy, oz);
      atomAssembly.add(m);
    });

    // Translucent quantum probability cloud shell
    const probShellGeo = new THREE.IcosahedronGeometry(0.62, 2);
    const probShellMat = new THREE.MeshPhysicalMaterial({
      color: initialPalette.primary,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    const probShell = new THREE.Mesh(probShellGeo, probShellMat);
    probShell.renderOrder = 2;
    atomAssembly.add(probShell);

    // 3. Three Inclined Orbital Torus Rings + Orbiting Electron Nodes
    const orbitalConfigs = [
      { radius: 1.95, tiltX: 1.05, tiltY: 0.3, tiltZ: 0.25, speed: 1.35 },
      { radius: 2.45, tiltX: 0.55, tiltY: -0.75, tiltZ: -0.6, speed: -1.05 },
      { radius: 2.95, tiltX: -0.95, tiltY: 0.6, tiltZ: 0.9, speed: 0.85 },
    ];

    const orbitPlaneGroups: THREE.Group[] = [];
    const electronNodes: THREE.Mesh[] = [];
    const orbitRingMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.9,
      roughness: 0.18,
      transparent: true,
      opacity: isBackdrop ? 0.42 : 0.72,
    });
    const electronGeo = new THREE.SphereGeometry(0.11, 16, 16);
    const electronMat = new THREE.MeshStandardMaterial({
      color: initialPalette.primary,
      emissive: initialPalette.primary,
      emissiveIntensity: 1.1,
      roughness: 0.15,
      metalness: 0.4,
    });

    for (let i = 0; i < orbitalConfigs.length; i++) {
      const cfg = orbitalConfigs[i];
      const planeGroup = new THREE.Group();
      planeGroup.rotation.set(cfg.tiltX, cfg.tiltY, cfg.tiltZ);
      atomAssembly.add(planeGroup);
      orbitPlaneGroups.push(planeGroup);

      const ringGeo = new THREE.TorusGeometry(cfg.radius, 0.022, 12, 72);
      const ringMesh = new THREE.Mesh(ringGeo, orbitRingMat);
      planeGroup.add(ringMesh);

      const electron = new THREE.Mesh(electronGeo, electronMat);
      electron.position.set(cfg.radius, 0, 0);
      planeGroup.add(electron);
      electronNodes.push(electron);
    }

    // Track applied theme/accent to smoothly update materials only on change
    let appliedDark = stateRef.current.isDark;
    let appliedAccent = stateRef.current.accent;

    const applyThemeAndPalette = (dark: boolean, palKey: AccentPalette) => {
      const p = getPaletteColors(palKey);
      const bgHex = dark ? p.bgDark : p.bgLight;
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.setHex(bgHex);
      }

      hemiLight.color.setHex(dark ? 0xcffafe : 0xe0f2fe);
      hemiLight.groundColor.setHex(dark ? 0x1e1b4b : 0xcbd5e1);
      hemiLight.intensity = dark ? 0.75 : 1.05;
      keyLight.intensity = dark ? 1.5 : 1.35;
      rimLight.color.setHex(p.secondary);

      posCoreMat.color.setHex(p.positive);
      posCoreMat.emissive.setHex(p.positive);
      negCoreMat.color.setHex(p.negative);
      negCoreMat.emissive.setHex(p.negative);
      eqFluxMat.color.setHex(p.primary);
      eqFluxMat.emissive.setHex(p.primary);

      fieldLineMatPrimary.color.setHex(p.primary);
      fieldLineMatPrimary.emissive.setHex(p.primary);
      fieldLineMatPrimary.opacity = isBackdrop ? (dark ? 0.24 : 0.34) : dark ? 0.48 : 0.56;
      fieldLineMatSecondary.color.setHex(p.secondary);
      fieldLineMatSecondary.emissive.setHex(p.secondary);
      fieldLineMatSecondary.opacity = isBackdrop ? (dark ? 0.2 : 0.28) : dark ? 0.42 : 0.5;

      particleMat.emissive.setHex(p.primary);
      for (let i = 0; i < particleCount; i++) {
        _color.setHex(i % 2 === 0 ? p.primary : p.secondary);
        particleInstances.setColorAt(i, _color);
      }
      if (particleInstances.instanceColor) {
        particleInstances.instanceColor.needsUpdate = true;
      }

      waveMat.color.setHex(p.primary);
      waveMat.opacity = isBackdrop ? (dark ? 0.2 : 0.26) : dark ? 0.38 : 0.42;

      protonMat.color.setHex(p.primary);
      protonMat.emissive.setHex(p.primary);
      neutronMat.color.setHex(p.secondary);
      neutronMat.emissive.setHex(p.secondary);
      probShellMat.color.setHex(p.primary);
      electronMat.color.setHex(p.primary);
      electronMat.emissive.setHex(p.primary);
      orbitRingMat.color.setHex(dark ? 0xcbd5e1 : 0x475569);
    };

    applyThemeAndPalette(appliedDark, appliedAccent);

    // Pre-warm shaders on GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Event listeners: pointer parallax, scroll depth, resize, context loss
    const onPointerMove = (ev: PointerEvent) => {
      if (isBackdrop) {
        stateRef.current.pointerX = (ev.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
        stateRef.current.pointerY = (ev.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
      } else {
        const rect = container.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          stateRef.current.pointerX = ((ev.clientX - rect.left) / rect.width - 0.5) * 2;
          stateRef.current.pointerY = ((ev.clientY - rect.top) / rect.height - 0.5) * 2;
        }
      }
    };

    const onPointerLeave = () => {
      stateRef.current.pointerX = 0;
      stateRef.current.pointerY = 0;
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      stateRef.current.scrollRatio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    if (isBackdrop) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
    } else {
      container.addEventListener('pointermove', onPointerMove, { passive: true });
      container.addEventListener('pointerleave', onPointerLeave);
    }

    const handleResize = (w: number, h: number) => {
      const safeW = Math.max(1, w);
      const safeH = Math.max(1, h);
      camera.aspect = safeW / safeH;
      camera.updateProjectionMatrix();
      renderer.setSize(safeW, safeH);
    };

    const onWindowResize = () => {
      if (isBackdrop) {
        handleResize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', onWindowResize);

    let resizeObserver: ResizeObserver | null = null;
    if (!isBackdrop && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          handleResize(entry.contentRect.width, entry.contentRect.height);
        }
      });
      resizeObserver.observe(container);
    }

    const onContextLost = (ev: Event) => {
      ev.preventDefault();
      setContextFailed(true);
    };
    const onContextRestored = () => {
      setContextFailed(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    // Animation loop with software WebGL pacing
    let disposed = false;
    let frameId = 0;
    const clock = new THREE.Clock();
    let emBlend = stateRef.current.preset === 'em-field' ? 1 : 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync && gl.deleteSync) gl.deleteSync(sync);
          return;
        }
        const status = sync && gl.getSyncParameter ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync && gl.deleteSync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const { preset: activePreset, isDark: darkNow, accent: accentNow, pointerX, pointerY, scrollRatio } =
        stateRef.current;

      if (darkNow !== appliedDark || accentNow !== appliedAccent) {
        appliedDark = darkNow;
        appliedAccent = accentNow;
        applyThemeAndPalette(appliedDark, appliedAccent);
      }

      // Smooth preset transition
      const targetEm = activePreset === 'em-field' ? 1 : 0;
      emBlend = THREE.MathUtils.damp(emBlend, targetEm, 6.5, delta);
      const qBlend = 1 - emBlend;

      emGroup.visible = emBlend > 0.015;
      quantumGroup.visible = qBlend > 0.015;
      emGroup.scale.setScalar(Math.max(0.001, emBlend));
      quantumGroup.scale.setScalar(Math.max(0.001, qBlend));

      // Camera smooth parallax & subtle scroll depth
      const swayStrength = isBackdrop ? 0.65 : 1.05;
      const targetCamX = pointerX * swayStrength;
      const targetCamY = (isBackdrop ? 1.2 : 1.0) - pointerY * (swayStrength * 0.5) - scrollRatio * (isBackdrop ? 1.4 : 0);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 4.2, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4.2, delta);
      camera.lookAt(0, 0, 0);

      // Animate EM Field preset
      if (emGroup.visible) {
        dipoleAssembly.rotation.y = elapsed * 0.22;
        dipoleAssembly.rotation.z = Math.sin(elapsed * 0.35) * 0.12;
        fieldLinesGroup.rotation.y = elapsed * 0.14;
        eqFluxRing.rotation.z = elapsed * 0.45;

        for (let i = 0; i < particleCount; i++) {
          const meta = particleMeta[i];
          const t = (meta.phase + elapsed * meta.speed) % 1;
          dipoleCurves[meta.curveIdx].getPointAt(t, _vec3);
          _vec3.applyAxisAngle(THREE.Object3D.DEFAULT_UP, fieldLinesGroup.rotation.y);
          _scale.setScalar(meta.size);
          _mat4.compose(_vec3, _quat, _scale);
          particleInstances.setMatrixAt(i, _mat4);
        }
        particleInstances.instanceMatrix.needsUpdate = true;
      }

      // Animate Quantum Wave & Orbital Rings preset
      if (quantumGroup.visible) {
        const tWave = elapsed * 1.4;
        for (let i = 0; i < wavePosAttr.count; i++) {
          const bx = waveBaseXZ[i * 2];
          const bz = waveBaseXZ[i * 2 + 1];
          const dist = Math.sqrt(bx * bx + bz * bz);
          const wy =
            Math.cos(dist * 1.15 - tWave) * Math.exp(-dist * 0.12) * 0.85 +
            Math.sin(bx * 0.55 + tWave * 0.6) * Math.cos(bz * 0.55 - tWave * 0.4) * 0.28;
          wavePosAttr.setY(i, wy);
        }
        wavePosAttr.needsUpdate = true;

        atomAssembly.rotation.y = elapsed * 0.25;
        probShell.rotation.y = -elapsed * 0.4;
        probShell.rotation.x = elapsed * 0.22;

        for (let i = 0; i < orbitalConfigs.length; i++) {
          const cfg = orbitalConfigs[i];
          const angle = elapsed * cfg.speed + i * 2.1;
          electronNodes[i].position.set(
            Math.cos(angle) * cfg.radius,
            Math.sin(angle) * cfg.radius,
            0
          );
        }
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);

      if (isBackdrop) {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('scroll', onScroll);
      } else {
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', onPointerLeave);
      }
      window.removeEventListener('resize', onWindowResize);
      resizeObserver?.disconnect();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.InstancedMesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
      envTarget.dispose();
      renderer.dispose();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
    };
  }, [shouldRender3D, variant]);

  if (!shouldRender3D) {
    if (variant === 'backdrop') return null;
    // Styled fallback showcase inside Home Hero when 3D is toggled off or reduced motion is on
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-gradient-to-br from-slate-100 via-cyan-50/70 to-violet-100/60 dark:from-slate-900/90 dark:via-cyan-950/35 dark:to-violet-950/40 flex items-center justify-center ${className}`}
      >
        <div className="text-center px-4 py-6 space-y-1.5">
          <div className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">
            {preset === 'em-field' ? 'EM Dipole Field' : 'Quantum Wave Orbitals'}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            {reducedMotion
              ? 'Paused (Reduced Motion active)'
              : '3D Animation Paused'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={
        variant === 'backdrop'
          ? `fixed inset-0 z-0 pointer-events-none print:hidden ${className}`
          : `relative overflow-hidden ${className}`
      }
    />
  );
};
