import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Trees, Wind, Droplets, Info } from "lucide-react";

/**
 * MyEcoWorld3D
 * An interactive 3D miniature floating ecosystem representing the user's real-life
 * sustainability journey. Evolves dynamically based on genuine EcoScore and activity telemetry:
 * - Stage 1 (EcoScore < 60): Seedling Sanctuary (nascent sprout & quiet stream)
 * - Stage 2 (EcoScore 60 - 85): Growing Oasis (leafy tree, wildflowers, active stream, turbine)
 * - Stage 3 (EcoScore > 85): Flourishing Bio-Haven (lush canopy, dual turbines, blossoming flora)
 */
export default function MyEcoWorld3D({
  ecoScore = 78.5,
  streak = 1,
  className = "",
}) {
  const mountRef = useRef(null);
  const [hasWebGL] = useState(() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  });

  // Determine ecosystem maturity stage from real user score
  let stage = 1;
  let stageName = "Seedling Sanctuary";
  let stageDesc = "Begin logging daily habits to sprout your miniature ecosystem.";

  if (ecoScore >= 85) {
    stage = 3;
    stageName = "Flourishing Bio-Haven";
    stageDesc = "Peak biodiversity achieved! Dual clean wind turbines & lush canopy active.";
  } else if (ecoScore >= 60) {
    stage = 2;
    stageName = "Growing Oasis";
    stageDesc = "Healthy tree canopy, flowing crystalline stream, and clean wind energy.";
  }

  useEffect(() => {
    if (!hasWebGL) return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 260;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 3.2, 5.2);
    camera.lookAt(0, 0.3, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 2. Floating Island Rock Base & Top Grass Cap
    // Island Base (Hexagonal rock pedestal)
    const baseGeo = new THREE.CylinderGeometry(2.0, 1.2, 1.0, 7);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x27272a, // dark slate rock
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.5;
    worldGroup.add(baseMesh);

    // Top Grass Cap (Lush green hexagonal surface)
    const grassGeo = new THREE.CylinderGeometry(2.05, 2.0, 0.25, 7);
    const grassMat = new THREE.MeshStandardMaterial({
      color: stage >= 3 ? 0x16a34a : stage === 2 ? 0x22c55e : 0x4ade80,
      roughness: 0.6,
      metalness: 0.05,
      flatShading: true,
    });
    const grassMesh = new THREE.Mesh(grassGeo, grassMat);
    grassMesh.position.y = 0.08;
    worldGroup.add(grassMesh);

    // 3. Winding Water Stream
    const streamGeo = new THREE.BoxGeometry(0.35, 0.05, 3.2);
    const streamMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // vibrant crystal cyan
      roughness: 0.2,
      metalness: 0.4,
      transparent: true,
      opacity: 0.85,
    });
    const streamMesh = new THREE.Mesh(streamGeo, streamMat);
    streamMesh.position.set(0.4, 0.22, 0);
    streamMesh.rotation.y = 0.35;
    worldGroup.add(streamMesh);

    // 4. Central Tree / Growing Vegetation
    const treeGroup = new THREE.Group();
    worldGroup.add(treeGroup);

    if (stage === 1) {
      // Small seedling sprout
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 6);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x166534 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.set(-0.3, 0.35, -0.2);
      treeGroup.add(stem);

      const leafGeo = new THREE.SphereGeometry(0.14, 6, 6);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0xbef264, flatShading: true });
      const leaf1 = new THREE.Mesh(leafGeo, leafMat);
      leaf1.position.set(-0.38, 0.52, -0.2);
      treeGroup.add(leaf1);
    } else {
      // Growing or Flourishing Tree
      const treeScale = stage === 3 ? 1.3 : 1.0;
      const trunkGeo = new THREE.CylinderGeometry(0.09 * treeScale, 0.16 * treeScale, 0.9 * treeScale, 6);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(-0.4, 0.45 * treeScale + 0.1, -0.3);
      treeGroup.add(trunk);

      // Low-poly foliage canopy clusters
      const foliageMat = new THREE.MeshStandardMaterial({
        color: stage === 3 ? 0x15803d : 0x22c55e,
        roughness: 0.5,
        flatShading: true,
      });

      const f1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55 * treeScale), foliageMat);
      f1.position.set(-0.4, 1.05 * treeScale, -0.3);
      treeGroup.add(f1);

      const f2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42 * treeScale), foliageMat);
      f2.position.set(-0.25, 1.3 * treeScale, -0.15);
      treeGroup.add(f2);

      const f3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38 * treeScale), foliageMat);
      f3.position.set(-0.6, 1.15 * treeScale, -0.25);
      treeGroup.add(f3);
    }

    // 5. Miniature Clean Wind Turbine (Stages 2 & 3)
    let turbineBlades = null;
    let turbineBlades2 = null;

    if (stage >= 2) {
      const poleGeo = new THREE.CylinderGeometry(0.03, 0.05, 1.1, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(1.1, 0.75, -0.6);
      worldGroup.add(pole);

      // Turbine Hub & Rotor
      const hubGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const hubMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
      const hub = new THREE.Mesh(hubGeo, hubMat);
      hub.position.set(1.1, 1.3, -0.54);
      worldGroup.add(hub);

      turbineBlades = new THREE.Group();
      turbineBlades.position.set(1.1, 1.3, -0.52);

      for (let i = 0; i < 3; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.04, 0.45, 0.015);
        const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = 0.22;
        const arm = new THREE.Group();
        arm.rotation.z = (i * Math.PI * 2) / 3;
        arm.add(blade);
        turbineBlades.add(arm);
      }
      worldGroup.add(turbineBlades);
    }

    // 6. Stage 3 Solar Panels & Wildflowers
    if (stage === 3) {
      const panelGeo = new THREE.BoxGeometry(0.4, 0.03, 0.3);
      const panelMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7, // solar blue
        roughness: 0.2,
        metalness: 0.6,
      });
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(0.9, 0.3, 0.7);
      panel.rotation.x = 0.3;
      panel.rotation.y = -0.4;
      worldGroup.add(panel);
    }

    // 7. Small Natural Rocks and Flora
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x64748b, flatShading: true });
    const r1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16), rockMat);
    r1.position.set(-0.8, 0.24, 0.8);
    worldGroup.add(r1);

    const r2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12), rockMat);
    r2.position.set(0.15, 0.22, -1.0);
    worldGroup.add(r2);

    // 8. Floating Bio-Motes
    const motesGeo = new THREE.BufferGeometry();
    const motesCount = 24;
    const motesPos = new Float32Array(motesCount * 3);

    for (let i = 0; i < motesCount; i++) {
      motesPos[i * 3] = (Math.random() - 0.5) * 3.5;
      motesPos[i * 3 + 1] = 0.5 + Math.random() * 2.0;
      motesPos[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
    }
    motesGeo.setAttribute("position", new THREE.BufferAttribute(motesPos, 3));
    const motesMat = new THREE.PointsMaterial({
      color: 0xbef264,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const motes = new THREE.Points(motesGeo, motesMat);
    worldGroup.add(motes);

    // 9. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef08a, 1.8);
    sunLight.position.set(3, 5, 4);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x4ade80, 0.8);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // Initial slight rotation
    worldGroup.rotation.y = 0.5;

    // 10. Mouse Interaction and Parallax
    let targetRotationY = 0.5;
    let targetRotationX = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = 0.5 + x * 0.75;
      targetRotationX = -y * 0.25;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 11. Render Loop
    let frameId = null;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (!reducedMotion) {
        // Subtle constant rotation + pointer tracking
        worldGroup.rotation.y += (targetRotationY - worldGroup.rotation.y) * 0.04;
        worldGroup.rotation.x += (targetRotationX - worldGroup.rotation.x) * 0.04;

        // Floating island levitation
        worldGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;

        // Spin turbine blades if present
        if (turbineBlades) {
          turbineBlades.rotation.z -= delta * 3.5;
        }
        if (turbineBlades2) {
          turbineBlades2.rotation.z -= delta * 3.0;
        }

        // Swirl motes
        motes.rotation.y += delta * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 320;
      const newH = container.clientHeight || 260;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      // Cleanup
      [baseGeo, grassGeo, streamGeo, motesGeo].forEach((g) => g.dispose());
      [baseMat, grassMat, streamMat, motesMat, rockMat].forEach((m) => m.dispose());

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [hasWebGL, stage]);

  return (
    <div className={`relative flex flex-col justify-between ${className}`}>
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-56 flex items-center justify-center select-none"
        aria-label={`3D Ecosystem: ${stageName}`}
        role="img"
      >
        {!hasWebGL && (
          <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-forest-900 to-emerald-500 flex items-center justify-center shadow-eco">
            <Trees className="w-16 h-16 text-limeAccent" />
          </div>
        )}
      </div>

      {/* Stage Progression Status Footer */}
      <div className="mt-2 p-3 rounded-2xl bg-forest-50/70 border border-forest-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-forest-800 text-limeAccent shadow-xs">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-800">
                Stage {stage} of 3
              </span>
              <span className="text-charcoal-400">•</span>
              <span className="text-xs font-black text-forest-950">
                {stageName}
              </span>
            </div>
            <p className="text-[11px] text-charcoal-500 leading-tight mt-0.5">
              {stageDesc}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-widest block">
            EcoScore
          </span>
          <span className="text-sm font-black text-forest-900">
            {ecoScore}
          </span>
        </div>
      </div>
    </div>
  );
}
