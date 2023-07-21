self.onmessage = function(e) {
    var node = e.data.node;
    var level = e.data.level;
    fetch(node + ".csv")
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.text();
    })
    .then(data => {
        var points = data.trim().split('\n').map(row => row.split(',').map(Number));
        self.postMessage({node: node, level: level, points: points});
    })
    .catch(error => {
        console.error('Error loading node ' + node + ':', error);
        if (error.message.includes("404")) {
            console.log("Node not found: " + node);
            
        } else {
            console.error('Error:', error);
        }
    });
};
