self.onmessage = function(e) {
    var node = e.data;
    fetch(node + ".csv")
    .then(response => response.text())
    .then(data => {
        var points = d3.csvParse(data, d => ({x: +d.x, y: +d.y, z: +d.z}));
        self.postMessage(points);
    })
    .catch(error => console.error('Error:', error));
};
