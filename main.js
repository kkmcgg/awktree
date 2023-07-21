// import * as THREE from 'three';
// import { OrbitControls } from '.\external\OrbitControls.js'

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Add OrbitControls
// var controls = OrbitControls( camera, renderer.domElement );
// const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.update();

camera.position.z = 5;
camera.position.set(0.5, 0.5, 2);

// var material = new THREE.PointsMaterial({ color: 0x888888, size: .1 });
var material = new THREE.PointsMaterial({size: 0.05, vertexColors: THREE.VertexColors});
var pointCloud = new THREE.Object3D();
scene.add(pointCloud);

var pointArrays = [];

// Add a few hardcoded points
var geometry = new THREE.BufferGeometry();
geometry.setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.2, 0.2, 0.2),
    new THREE.Vector3(0.4, 0.4, 0.4)
]);
var pointsObject = new THREE.Points(geometry, material);
pointCloud.add(pointsObject);


// Define your maximum octree depth here.
var MAX_LEVEL = 3;

function loadNode(node, level = 0) {
    worker.postMessage({node: node, level: level});

    // If the current level is less than the maximum depth, load child nodes.
    if (level < MAX_LEVEL) {
        for (var i = 0; i < 8; i++) {
            var childNode = node + "_" + i;
            loadNode(childNode, level + 1);
        }
    }
}

var worker = new Worker('loadDataWorker.js');

worker.onmessage = function(e) {
    var data = e.data;
    var points = data.points;
    var level = data.level;
    var node = data.node;

    console.log(`Loaded points for node ${node} at level ${level}:`, points); 

    // Create a geometry from the loaded points and add it to the point cloud
    var geometry = new THREE.BufferGeometry().setFromPoints(points.map(pt => new THREE.Vector3(pt[0], pt[1], pt[2])));
    
    var material = new THREE.PointsMaterial({ color: getRandomColor(), size: 0.1 });

    var pointsObject = new THREE.Points(geometry, material);
    pointCloud.add(pointsObject);

};
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

loadNode('node');


