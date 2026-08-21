import xml.etree.ElementTree as ET

tree = ET.parse('assets/question_prompt.svg')
root = tree.getroot()
for elem in root.iter():
    if elem.tag.endswith('path'):
        print(elem.attrib.get('d')[:30])
