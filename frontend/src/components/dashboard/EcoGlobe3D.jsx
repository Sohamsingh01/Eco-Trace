import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * EcoGlobe3D
 * Spectacular, high-performance interactive 3D Earth built with Three.js:
 * - Dimensional emerald Earth sphere with procedural continents & terrain relief
 * - Multi-layered atmospheric green glow (inner & outer Fresnel layers)
 * - Orbiting planetary energy rings tilted at 23.5 degrees
 * - True 3D floating leaf meshes spiraling organically around the globe
 * - Interactive pointer parallax & smooth camera sway
 * - IntersectionObserver to pause rendering when off-screen
 * - Complete resource cleanup on unmount
 * - WebGL fallback
 */
export default function EcoGlobe3D({ className = "" }) {
  const mountRef = useRef(null);
  const [hasWebGL] = useState(() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!hasWebGL) return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 280;
    const height = container.clientHeight || 280;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // 2. Globe Group with Axial Tilt (23.5 deg)
    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = THREE.MathUtils.degToRad(23.5);
    scene.add(globeGroup);

    // Core Globe Sphere (Deep Forest Green / Emerald Oceans)
    const globeGeo = new THREE.SphereGeometry(1.22, 64, 64);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x0f3d24, // deep oceanic forest green
      roughness: 0.32,
      metalness: 0.25,
      emissive: 0x052e16,
      emissiveIntensity: 0.35,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Continent Landmass Points with Relief Elevation
    const landCount = 520;
    const landPositions = new Float32Array(landCount * 3);
    const landColors = new Float32Array(landCount * 3);

    const colorMint = new THREE.Color(0x4ade80);
    const colorEmerald = new THREE.Color(0x22c55e);
    const colorLime = new THREE.Color(0xbef264);
    const colorSage = new THREE.Color(0x86efac);

    for (let i = 0; i < landCount; i++) {
      // Clustered spherical coordinates modeling continent landmasses
      const phi = Math.acos(-1 + (2 * i) / landCount);
      const theta = Math.sqrt(landCount * Math.PI) * phi;

      // Subtle topography elevation
      const elevation = 1.235 + Math.sin(phi * 4) * Math.cos(theta * 3) * 0.02;
      const x = elevation * Math.sin(phi) * Math.cos(theta);
      const y = elevation * Math.sin(phi) * Math.sin(theta);
      const z = elevation * Math.cos(phi);

      landPositions[i * 3] = x;
      landPositions[i * 3 + 1] = y;
      landPositions[i * 3 + 2] = z;

      const pick = i % 4;
      const c = pick === 0 ? colorLime : pick === 1 ? colorMint : pick === 2 ? colorEmerald : colorSage;
      landColors[i * 3] = c.r;
      landColors[i * 3 + 1] = c.g;
      landColors[i * 3 + 2] = c.b;
    }

    const landGeo = new THREE.BufferGeometry();
    landGeo.setAttribute("position", new THREE.BufferAttribute(landPositions, 3));
    landGeo.setAttribute("color", new THREE.BufferAttribute(landColors, 3));

    const landMat = new THREE.PointsMaterial({
      size: 0.058,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
    });
    const landPoints = new THREE.Points(landGeo, landMat);
    globeGroup.add(landPoints);

    // Atmospheric Glow Outer Shell
    const atmoGeo = new THREE.SphereGeometry(1.32, 40, 40);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // Inner Atmospheric Fresnel Rim
    const innerAtmoGeo = new THREE.SphereGeometry(1.24, 32, 32);
    const innerAtmoMat = new THREE.MeshBasicMaterial({
      color: 0x6ee7b7,
      transparent: true,
      opacity: 0.08,
    });
    globeGroup.add(new THREE.Mesh(innerAtmoGeo, innerAtmoMat));

    // Dual Planetary Energy Orbit Rings
    const ring1Geo = new THREE.TorusGeometry(1.72, 0.014, 16, 90);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.3;
    ring1.rotation.y = 0.25;
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.85, 0.008, 12, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xbef264,
      transparent: true,
      opacity: 0.35,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 1.9;
    ring2.rotation.z = 0.4;
    scene.add(ring2);

    // True 3D Floating Leaf Meshes
    const leavesGroup = new THREE.Group();
    scene.add(leavesGroup);

    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.08, 0.15, 0, 0.3);
    leafShape.quadraticCurveTo(-0.08, 0.15, 0, 0);

    const leafGeo = new THREE.ShapeGeometry(leafShape);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      side: THREE.DoubleSide,
      roughness: 0.4,
      emissive: 0x14532d,
      emissiveIntensity: 0.2,
    });

    const leafMeshes = [];
    for (let i = 0; i < 8; i++) {
      const mesh = new THREE.Mesh(leafGeo, leafMat);
      const angle = (i / 8) * Math.PI * 2;
      const radius = 1.8 + (i % 3) * 0.25;
      mesh.position.set(Math.cos(angle) * radius, (i - 4) * 0.22, Math.sin(angle) * radius);
      mesh.scale.set(0.6, 0.6, 0.6);
      leavesGroup.add(mesh);
      leafMeshes.push({ mesh, angle, speed: 0.4 + (i % 4) * 0.1, radius, yOffset: (i - 4) * 0.22 });
    }

    // Glowing Bio-Energy Dust Particles
    const dustCount = 55;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 1.6 + Math.random() * 1.1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      dustPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dustPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dustPos[i * 3 + 2] = r * Math.cos(phi);
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xbef264,
      size: 0.045,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfef9c3, 2.0);
    sunLight.position.set(4, 4, 3.5);
    scene.add(sunLight);

    const atmosphereLight = new THREE.PointLight(0x4ade80, 2.8, 9);
    atmosphereLight.position.set(-2.5, 1.2, 2.0);
    scene.add(atmosphereLight);

    // 4. Pointer Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.6;
      targetRotationX = -y * 0.45;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 5. Animation Loop with Visibility Check
    let isVisible = true;
    let clock = new THREE.Clock();
    let frameId = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (!isVisible || document.hidden) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (!reducedMotion) {
        // Globe gentle rotation
        globeGroup.rotation.y += delta * 0.32;

        // Pointer spring interpolation
        globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05;
        globeGroup.rotation.y += (targetRotationY * 0.08);

        // Counter-rotating rings
        ring1.rotation.z += delta * 0.14;
        ring2.rotation.z -= delta * 0.10;

        // Animate floating leaves in 3D orbit
        leafMeshes.forEach((item) => {
          item.angle += delta * item.speed;
          item.mesh.position.x = Math.cos(item.angle) * item.radius;
          item.mesh.position.z = Math.sin(item.angle) * item.radius;
          item.mesh.position.y = item.yOffset + Math.sin(elapsed * 2 + item.angle) * 0.12;
          item.mesh.rotation.x += delta * 1.2;
          item.mesh.rotation.y += delta * 1.5;
        });

        // Dust particle rotation
        dust.rotation.y -= delta * 0.15;
        dust.rotation.x = Math.sin(elapsed * 0.3) * 0.1;

        // Gentle floating oscillation
        globeGroup.position.y = Math.sin(elapsed * 1.3) * 0.07;
      }

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 280;
      const newH = container.clientHeight || 280;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();

      // Dispose
      [globeGeo, landGeo, atmoGeo, innerAtmoGeo, ring1Geo, ring2Geo, leafGeo, dustGeo].forEach((g) => g.dispose());
      [globeMat, landMat, atmoMat, innerAtmoMat, ring1Mat, ring2Mat, leafMat, dustMat].forEach((m) => m.dispose());

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [hasWebGL]);

  return (
    <div
      ref={mountRef}
      className={`relative flex items-center justify-center pointer-events-none select-none transition-opacity duration-700 ${
        isLoaded ? "opacity-100" : "opacity-0"
      } ${className}`}
      aria-label="Interactive 3D Sustainability Earth"
      role="img"
    >
      {!hasWebGL && (
        <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-forest-900 via-forest-800 to-emerald-600 flex items-center justify-center shadow-eco-lg animate-pulse relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(190,242,100,0.3)_0%,transparent_60%)]"></div>
          <svg
            className="w-28 h-28 text-limeAccent/80 animate-spin-slow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        </div>
      )}
    </div>
  );
}
