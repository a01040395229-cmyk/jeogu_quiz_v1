import xml.etree.ElementTree as ET

tree = ET.parse('assets/background3.svg')
root = tree.getroot()
ns = {'svg': 'http://www.w3.org/2000/svg'}

for elem in root.iter():
    tag = elem.tag.split('}')[-1]
    fill = elem.attrib.get('fill', 'none')
    if tag == 'path':
        print(f"Path: d_length={len(elem.attrib.get('d', ''))} fill={fill}")
    elif tag == 'rect':
        print(f"Rect: w={elem.attrib.get('width')} h={elem.attrib.get('height')} fill={fill}")
    elif tag == 'ellipse':
        print(f"Ellipse: rx={elem.attrib.get('rx')} fill={fill}")
