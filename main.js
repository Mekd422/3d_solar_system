import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 40, 100);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 1.5, 300);
scene.add(sunLight);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Sun
const sunTexture = textureLoader.load('./assets/sun.jpg');
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(8, 32, 32),
  new THREE.MeshBasicMaterial({ map: sunTexture })
);
scene.add(sun);

// Planet factory
function createPlanet(radius, distance, texturePath, orbitSpeed, rotationSpeed) {
  const texture = textureLoader.load(texturePath);
  const planetMesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshStandardMaterial({ map: texture })
  );
  planetMesh.position.x = distance;

  const planetGroup = new THREE.Object3D();
  planetGroup.add(planetMesh);
  scene.add(planetGroup);

  return {
    mesh: planetMesh,
    group: planetGroup,
    orbitSpeed,
    rotationSpeed,
  };
}

// Planets
const planets = [
  createPlanet(1, 12, './assets/mercury.jpg', 0.04, 0.01),
  createPlanet(2, 18, './assets/venus.jpg', 0.015, 0.008),
  createPlanet(2.2, 26, './assets/earth.jpg', 0.01, 0.02),
  createPlanet(1.2, 32, './assets/mars.jpg', 0.008, 0.01),
];

// Moon (around Earth)
const moonTexture = textureLoader.load('./assets/moon.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshStandardMaterial({ map: moonTexture })
);
moon.position.x = 3;
const moonOrbit = new THREE.Object3D();
moonOrbit.add(moon);
planets[2].mesh.add(moonOrbit); // Add to Earth

// Resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animate
function animate() {
  requestAnimationFrame(animate);

  // Rotate planets and orbit them
  planets.forEach(p => {
    p.group.rotation.y += p.orbitSpeed;
    p.mesh.rotation.y += p.rotationSpeed;
  });

  // Rotate moon
  moonOrbit.rotation.y += 0.05;

  renderer.render(scene, camera);
}
animate();
