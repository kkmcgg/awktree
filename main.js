var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

var material = new THREE.PointsMaterial({ color: 0x888888, size: 0.1 });
var pointCloud = new THREE.Object3D();
scene.add(pointCloud);

var pointArrays = [];

function loadLevel(level) {
    while (pointCloud.children.length > 0) {
        pointCloud.remove(pointCloud.children[0]);
    }
    pointArrays[level].forEach(function(points) {
        var geometry = new THREE.Geometry();
        points.forEach(function(point) {
            geometry.vertices.push(new THREE.Vector3(point[0], point[1], point[2]));
        });
        var points = new THREE.Points(geometry, material);
        pointCloud.add(points);
    });
}

function loadNode(node, level = 0) {
    while (pointArrays.length <= level) {
        pointArrays.push([]);
    }
    worker.postMessage(node);
}

var worker = new Worker('loadDataWorker.js');

worker.onmessage = function(e) {
    var points = e.data;
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
