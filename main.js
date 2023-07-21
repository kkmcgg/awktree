var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;
camera.position.set(0.5, 0.5, 2);

var material = new THREE.PointsMaterial({ color: 0x888888, size: 1 });
var pointCloud = new THREE.Object3D();
scene.add(pointCloud);

var pointArrays = [];


function loadLevel(level) {
    while (pointCloud.children.length > 0) {
        pointCloud.remove(pointCloud.children[0]);
    }
    pointArrays[level].forEach(function(points) {
        var geometry = new THREE.BufferGeometry().setFromPoints(points.map(pt => new THREE.Vector3(pt[0], pt[1], pt[2])));
        var pointsObject = new THREE.Points(geometry, material);
        pointCloud.add(pointsObject);
    });
}

// Define your maximum octree depth here.
var MAX_LEVEL = 3;

function loadNode(node, level = 0) {
    while (pointArrays.length <= level) {
        pointArrays.push([]);
    }
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

    pointArrays[level].push(points);
    if (node == "node") {
        loadLevel(0);
    }
    for (var i = 0; i < 8; i++) {
        var childNode = node + "_" + i;
        loadNode(childNode, level + 1);
    }
};

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

loadNode('node');


