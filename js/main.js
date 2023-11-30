// Import the necessary modules from the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Declare variables for the 3D scene components
let scene, camera, renderer, controls;
let ringShank, ringHead, combinedRing;
let isRotating = false;

// Initialize the 3D scene
function init() {
  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Get the container element for the 3D scene
  const container = document.getElementById('container3D');

  // Set up the camera with a perspective view
  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 5;

  // Create the WebGL renderer and append it to the container
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Add orbit controls to allow user interaction with the scene
  controls = new OrbitControls(camera, renderer.domElement);

  // Add lights to the scene
  addLights();

  // Handle window resize events
  window.addEventListener('resize', onWindowResize, false);

  // Start the animation loop
  animate();
}

// Add various lights to the scene for better illumination
function addLights() {
  // Ambient light for overall illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // Directional lights for more focused illumination
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight1.position.set(1, 1, 1);
  scene.add(directionalLight1);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(-1, -1, -1);
  scene.add(directionalLight2);

  // Point light for localized lighting
  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Spot light for a focused beam of light
  const spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(0, 5, 0);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 0.1;
  spotLight.decay = 2;
  spotLight.distance = 200;
  scene.add(spotLight);
}

// Adjust the camera and renderer upon window resizing
function onWindowResize() {
  const container = document.getElementById('container3D');
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

// Animation loop to continuously render the scene
function animate() {
  requestAnimationFrame(animate);

  // Rotate the combined ring model if the rotation is enabled
  if (isRotating && combinedRing) {
    combinedRing.rotation.y += 0.01;
  }

  // Update the controls and render the scene
  controls.update();
  renderer.render(scene, camera);
}

// Function to load a ring shank model
function loadRingShank(modelPath, scale = { x: 1, y: 1, z: 1 }) {
  const loader = new GLTFLoader();
  loader.load(modelPath, (gltf) => {
    // Remove the existing ring shank if present
    if (ringShank) combinedRing.remove(ringShank);

    // Set the loaded model as the new ring shank
    ringShank = gltf.scene;
    ringShank.scale.set(scale.x, scale.y, scale.z);

    // Create a group for the combined ring if it doesn't exist
    if (!combinedRing) {
      combinedRing = new THREE.Group();
      scene.add(combinedRing);
    }

    // Add the ring shank to the combined ring
    combinedRing.add(ringShank);

    // Adjust the position of the ring head relative to the shank
    adjustRingHeadPosition();

    // Update the controls target to the new combined ring position
    controls.target.copy(combinedRing.position);
  }, undefined, (error) => {
    console.error('An error happened', error);
  });
}

// Function to load a ring head model
function loadRingHead(modelPath, scale = { x: 0.4, y: 0.4, z: 0.4 }) {
  const loader = new GLTFLoader();
  loader.load(modelPath, (gltf) => {
    // Remove the existing ring head if present
    if (ringHead) combinedRing.remove(ringHead);

    // Set the loaded model as the new ring head
    ringHead = gltf.scene;
    ringHead.scale.set(scale.x, scale.y, scale.z);

    // Create a group for the combined ring if it doesn't exist
    if (!combinedRing) {
      combinedRing = new THREE.Group();
      scene.add(combinedRing);
    }

    // Add the ring head to the combined ring
    combinedRing.add(ringHead);

    // Adjust the position of the ring head relative to the shank
    adjustRingHeadPosition();

    // Update the controls target to the new combined ring position
    controls.target.copy(combinedRing.position);
  }, undefined, (error) => {
    console.error('An error happened', error);
  });
}

// Adjust the position of the ring head relative to the ring shank
function adjustRingHeadPosition() {
  if (ringShank && ringHead) {
    ringHead.position.y = ringShank.position.y + 1.5;
    ringHead.position.x = ringShank.position.x;
    ringHead.position.z = ringShank.position.z;
  }
}

// Toggle the rotation of the combined ring model
function toggleRotation() {
  isRotating = !isRotating;
}

// Set up event listeners after the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the 3D scene
  init();

  // Set up event listeners for the buttons to load different models and toggle rotation
  document.getElementById('loadRingShank1Button').addEventListener('click', () => loadRingShank('models/eye/newband6.glb', { x: 1, y: 1, z: 1 }));
  document.getElementById('loadRingShank2Button').addEventListener('click', () => loadRingShank('models/eye/shankdesign.glb', { x: 0.7, y: 0.7, z: 0.7 }));
  document.getElementById('loadRingHead1Button').addEventListener('click', () => loadRingHead('models/eye/gem2.glb', { x: 0.4, y: 0.4, z: 0.4 }));
  document.getElementById('loadRingHead2Button').addEventListener('click', () => loadRingHead('models/eye/gem.glb', { x: 0.4, y: 0.4, z: 0.4 }));
  document.getElementById('rotateButton').addEventListener('click', toggleRotation);
});
