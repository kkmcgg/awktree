
var isMouseDown = false;
var startX;

// Add event listeners
document.addEventListener('mousedown', function(e) {
    isMouseDown = true;
    startX = e.clientX;
}, false);

document.addEventListener('mousemove', function(e) {
    if(isMouseDown) {
        var diffX = e.clientX - startX;
        pointCloud.rotation.y += diffX * 0.01; // Adjust the '0.01' as needed
        startX = e.clientX;
    }
}, false);

document.addEventListener('mouseup', function() {
    isMouseDown = false;
}, false);
