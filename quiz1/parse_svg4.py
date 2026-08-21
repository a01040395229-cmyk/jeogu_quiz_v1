import xml.etree.ElementTree as ET

tree = ET.parse('assets/background3.svg')
root = tree.getroot()

for elem in root.iter():
    if elem.attrib.get('fill') == 'white':
        print(elem.tag, elem.attrib)
