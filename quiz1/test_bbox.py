import xml.etree.ElementTree as ET
import re

tree = ET.parse('assets/background3.svg')
root = tree.getroot()

def get_path_bbox(d):
    # Extremely simplified path bbox calculator
    coords = [float(x) for x in re.findall(r'-?\d+\.?\d*', d)]
    if not coords: return None
    # This is a very rough approximation because we don't separate x and y properly for curves, 
    # but let's just look at min/max of all numbers? No, they alternate x, y for lines, but curves have 6 numbers.
    # Let's just find if the path has any point in the region.
    return True

for elem in root.iter():
    if 'fill' in elem.attrib and elem.attrib['fill'] == 'white':
        print(elem.tag, elem.attrib)
