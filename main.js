import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, player, house, granny;
const loader = new GLTFLoader();

// Инициализация сцены
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#gameCanvas') });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Свет
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Камера
    camera.position.set(0, 1.6, 5);

    // Загрузка карты дома
    loader.load('https://raw.githubusercontent.com/endladosOficial2/Granny-Web/main/granny_1_house.glb', function (gltf) {
        house = gltf.scene;
        house.position.set(0, 0, 0);
        scene.add(house);
    });

    // Загрузка модели игрока
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.6, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    player = new THREE.Mesh(geometry, material);
    player.position.set(0, 1.6, 0);
    scene.add(player);

    // Загрузка модели Granny
    loader.load('https://raw.githubusercontent.com/endladosOficial2/Granny-Web/main/granny_animated_fbx.glb', function (gltf) {
        granny = gltf.scene;
        granny.position.set(Math.random() * 10 - 5, 0, Math.random() * 10 - 5);
        scene.add(granny);

        // Анимация случайных передвижений Granny
        setInterval(() => {
            granny.position.x = Math.random() * 10 - 5;
            granny.position.z = Math.random() * 10 - 5;
        }, 3000); // меняет позицию каждые 3 секунды
    });

    // Добавляем текстуры для модели дома и врага (при необходимости)

    // Начинаем анимацию
    animate();
}

// Логика передвижения игрока
function movePlayer() {
    const speed = 0.1;
    document.addEventListener('keydown', (event) => {
        if (event.key === 'w') {
            player.position.z -= speed;
        }
        if (event.key === 's') {
            player.position.z += speed;
        }
        if (event.key === 'a') {
            player.position.x -= speed;
        }
        if (event.key === 'd') {
            player.position.x += speed;
        }
    });
}

// Проверка столкновения
function checkCollision() {
    const distance = player.position.distanceTo(granny.position);
    if (distance < 1) {
        alert("You lost! Granny caught you!");
        // Можно перезагрузить страницу или сбросить игру
        window.location.reload();
    }
}

// Анимация сцены
function animate() {
    requestAnimationFrame(animate);

    movePlayer();
    checkCollision();

    renderer.render(scene, camera);
}

init();
