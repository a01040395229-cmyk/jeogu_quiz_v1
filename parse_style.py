import xml.etree.ElementTree as ET
import glob

for filename in glob.glob("quiz1/assets/*.svg"):
    try:
        tree = ET.parse(filename)
        for elem in tree.getroot().iter():
            if 'style' in elem.attrib:
                print(f"{filename}: {elem.attrib['style']}")
    except:
        pass
