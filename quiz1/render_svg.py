import sys
from xml.dom import minidom
doc = minidom.parse('assets/background3.svg')
# I don't have cairosvg installed probably, let's just check if there is any element with fill #FFFFFF or #FFF or white
