import xml.etree.ElementTree as ET

tree = ET.parse('assets/background3.svg')
root = tree.getroot()

colors = set()
for elem in root.iter():
    for k, v in elem.attrib.items():
        if k in ('fill', 'stroke', 'stop-color'):
            colors.add(v)
        if 'style' in k:
            colors.add(v)
print(colors)
