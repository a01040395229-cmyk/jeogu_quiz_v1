import xml.etree.ElementTree as ET
tree = ET.parse('quiz1/assets/background2.svg')
for elem in tree.getroot().iter():
    if elem.tag.endswith('rect'):
        print(elem.attrib)
