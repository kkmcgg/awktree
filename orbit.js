var isMouseDown = false;
var startX, startY;

// Add event listeners
document.addEventListener('mousedown', function(e) {
    isMouseDown = true;
    startX = e.clientX;
    startY = e.clientY;
}, false);

document.addEventListener('mousemove', function(e) {
    if(isMouseDown) {
        var diffX = e.clientX - startX;
        var diffY = e.clientY - startY;

        pointCloud.rotation.y += diffX * 0.01; // Adjust the '0.01' as needed
        pointCloud.rotation.x += diffY * 0.01; // Adjust the '0.01' as needed

        startX = e.clientX;
        startY = e.clientY;
    }
}, false);

document.addEventListener('mouseup', function() {
    isMouseDown = false;
}, false);
