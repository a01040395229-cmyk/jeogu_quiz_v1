import xml.etree.ElementTree as ET

tree = ET.parse('assets/background3.svg')
root = tree.getroot()

for elem in root.iter():
    stroke = elem.attrib.get('stroke')
    if stroke:
        print(f"{elem.tag}: stroke={stroke}")
