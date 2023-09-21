import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	52,
	window.innerWidth / window.innerHeight,
	0.5,
	1000
);

//create a light and add into the scene
const ambientLight1 = new THREE.AmbientLight(0xead6b8, 6);
scene.add(ambientLight1);

camera.position.set(5, 10, 40);

//Create a WebGL renderer and set its properties
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector("#canvas"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Import OrbitControls for camera interaction
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Create OrbitControls to control the camera and renderer
const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
	renderer.render(scene, camera);
	controls.update();

	saturn.rotation.y += 0.007;
	ring.rotation.z -= 0.005;
	moon1.rotation.y += 0.005;
	moon2.rotation.y += 0.01;
	moon1obj.rotation.y += 0.0005;
	moon2obj.rotation.y += 0.003;
	uranus.rotation.y += 0.005;

	if (mixer) {
		mixer.update(0.01);
	}

	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

import starTexture from "./Images/stars.jpg";

// Set the scene background with a cube texture
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
	starTexture,
	starTexture,
	starTexture,
	starTexture,
	starTexture,
	starTexture,
]);

// Load textures for objects
const saturnTexture = new THREE.TextureLoader().load("Images/saturn.jpg");
const normalTexture = new THREE.TextureLoader().load("Images/normalMap.jpg");

// Create Saturn mesh with textures
const saturn = new THREE.Mesh(
	new THREE.SphereGeometry(3, 32, 32),
	new THREE.MeshStandardMaterial({
		map: saturnTexture,
		normalMap: normalTexture,
	})
);
scene.add(saturn); //saturn is now visible in the center of the screen

//create ring mesh with textures
const ringTexture = new THREE.TextureLoader().load("Images/saturn_ring.jpg");
const ring = new THREE.Mesh(
	new THREE.RingGeometry(4, 7, 32),
	new THREE.MeshStandardMaterial({
		map: ringTexture,
		side: THREE.DoubleSide, //this is use for map both side of the ring
	})
);
ring.rotation.x = 1.5;
scene.add(ring);

//create sun mesh with textures
const sunTexture = new THREE.TextureLoader().load("Images/sun.jpg");
const sun = new THREE.Mesh(
	new THREE.SphereGeometry(7, 32, 32),
	new THREE.MeshStandardMaterial({
		map: sunTexture,
	})
);
scene.add(sun);
sun.position.set(40, 12, -30);

// Create directional light and position it at the Sun's position
const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(sun.position.x, sun.position.y, sun.position.z);
scene.add(directionalLight);

//create moon1 mesh with textures
const moon1Texture = new THREE.TextureLoader().load("Images/Moon1.jpg");
const moon1 = new THREE.Mesh(
	new THREE.SphereGeometry(0.8, 32, 32),
	new THREE.MeshStandardMaterial({
		map: moon1Texture,
	})
);

const moon1obj = new THREE.Object3D();
moon1obj.add(moon1);
scene.add(moon1obj);
moon1.position.set(7, 2, 5);

//create moon2 mesh with textures
const moon2Texture = new THREE.TextureLoader().load("Images/Moon2.jpg");
const moon2 = new THREE.Mesh(
	new THREE.SphereGeometry(0.6, 32, 32),
	new THREE.MeshStandardMaterial({  //surface Apperance
		map: moon2Texture,
	})
);

const moon2obj = new THREE.Object3D();
moon2obj.add(moon2);
scene.add(moon2obj);
moon2.position.set(1, -1, 10);

//create uranus mesh with texture
const uranusTexture = new THREE.TextureLoader().load("Images/uranus.jpg");
const uranus = new THREE.Mesh(
	new THREE.SphereGeometry(3, 32, 32),
	new THREE.MeshStandardMaterial({
		map: uranusTexture,
	})
);
scene.add(uranus);
uranus.position.set(-40, -32, -30);


//add space ship
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
let mixer; // Animation mixer

loader.load("./spaceShip/scene.gltf", (gltf) => {
	const model = gltf.scene;

	// Set initial position, rotation, and scale if needed
	model.position.set(-15, 10, 10);

	function animate() {
		requestAnimationFrame(animate);
		model.position.x += 0.01;
		if (model.position.x > 20) {
			model.position.x = -20;
		}
	}
	animate();

	//set rotatio of spaceship
	model.rotation.set(0, -5, 0);
	model.scale.set(0.5, 0.5, 0.5);

	scene.add(model);

	// Create the animation mixer
	mixer = new THREE.AnimationMixer(model);

	// Load all animations and add them to the mixer
	gltf.animations.forEach((clip) => {
		mixer.clipAction(clip).play();
	});
});
