import xml.etree.ElementTree as ET
tree = ET.parse('assets/background3.svg')
for elem in tree.getroot().iter():
    if elem.attrib.get('fill', '').lower() == 'white':
        print(elem.tag, elem.attrib)
