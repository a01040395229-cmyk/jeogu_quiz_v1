import xml.etree.ElementTree as ET

def print_blend_modes(filename):
    print(f"--- {filename} ---")
    tree = ET.parse(filename)
    for elem in tree.getroot().iter():
        if 'style' in elem.attrib and 'mix-blend-mode' in elem.attrib['style']:
            print(elem.tag, elem.attrib['style'])
        if elem.attrib.get('style'):
            if 'mix-blend-mode: multiply' in elem.attrib['style']:
                pass # print(elem.tag, elem.attrib)

print_blend_modes('assets/background3.svg')
print_blend_modes('assets/background4.svg')
