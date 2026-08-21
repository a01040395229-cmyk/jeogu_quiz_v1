import xml.etree.ElementTree as ET
from collections import Counter
tree = ET.parse('quiz1/assets/background2.svg')
fills = Counter()
for elem in tree.getroot().iter():
    fill = elem.attrib.get('fill')
    if fill:
        fills[fill] += 1
print(fills.most_common(10))
