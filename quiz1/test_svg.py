import sys

def point_in_polygon(x, y, poly):
    n = len(poly)
    inside = False
    p1x, p1y = poly[0]
    for i in range(n+1):
        p2x, p2y = poly[i % n]
        if y > min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        xints = (y-p1y)*(p2x-p1x)/(p2y-p1y)+p1x
                    if p1x == p2x or x <= xints:
                        inside = not inside
        p1x, p1y = p2x, p2y
    return inside

# Approximate the path with polygon points
# M426.062 1511.32
# C304.93 1702.03 573.739 1685.72 270.616 2054.93
# L-26.7962 2054.93
# L-26.7961 45.7524
# L1149.77 45.7526
# L1149.77 502.87
# L1148.97 502.87
# C951.942 813.067 1100.47 867.748 935.776 1127.04
# C771.08 1386.33 547.193 1320.62 426.062 1511.32
# Z

poly = [
    (426.062, 1511.32),
    (270.616, 2054.93),
    (-26.796, 2054.93),
    (-26.796, 45.752),
    (1149.77, 45.752),
    (1148.97, 502.87),
    (935.776, 1127.04),
    (426.062, 1511.32)
]

# Check center of the question prompt: x = 140 + 800/2 = 540, y = 101 + 380/2 = 291
print("Point (540, 291) is inside:", point_in_polygon(540, 291, poly))
