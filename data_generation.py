import numpy as np
import pandas as pd

class OctreeNode:
    def __init__(self, points, limit=10):
        self.children = []
        if len(points) > limit:
            center = points.mean(axis=0)
            for i in range(2):
                for j in range(2):
                    for k in range(2):
                        in_octant = points[
                            ((points[:, 0] <= center[0]) if i else (points[:, 0] > center[0])) &
                            ((points[:, 1] <= center[1]) if j else (points[:, 1] > center[1])) &
                            ((points[:, 2] <= center[2]) if k else (points[:, 2] > center[2]))
                        ]
                        if in_octant.shape[0] > 0:
                            self.children.append(OctreeNode(in_octant, limit))
        else:
            self.points = points

def write_tree(node, path='node', depth=0):
    if hasattr(node, 'points'):
        df = pd.DataFrame(node.points, columns=['x', 'y', 'z'])
        df.to_csv(f'{path}.csv', index=False)
    else:
        for i, child in enumerate(node.children):
            write_tree(child, path=f'{path}_{i}', depth=depth+1)

points = np.random.rand(1000, 3)
write_tree(OctreeNode(points))
