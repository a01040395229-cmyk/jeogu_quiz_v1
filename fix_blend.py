import sys

with open('quiz1/assets/background3.svg', 'r') as f:
    content = f.read()

content = content.replace('fill="#E1F8E0"', 'fill="#E1F8E0" style="mix-blend-mode: multiply;"')
content = content.replace('fill="#D0F6CF"', 'fill="#D0F6CF" style="mix-blend-mode: multiply;"')

with open('quiz1/assets/background3.svg', 'w') as f:
    f.write(content)

print("Fixed background3.svg")
