import os

files_to_update = [
    'road/scene1.html',
    'road/scene2.html',
    'road/scene3.html',
    'quiz1/screen1.html',
    'quiz1/screen2.html',
    'quiz1/screen4.html',
    'quiz1/screen5.html',
    'quiz1/screen6.html',
    'quiz1/screen7.html',
    'quiz2/screen1.html',
    'quiz2/screen2.html'
]

for filepath in files_to_update:
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace press feedback
    content = content.replace(
        "const press = () => { el.style.transform = 'scale(0.95)'; el.style.opacity = '0.8'; };",
        "const press = () => { el.style.transform = 'scale(0.90)'; el.style.opacity = '0.6'; };"
    )
    
    # Replace popup position (from 70% to 76%)
    content = content.replace(
        "top: 70%; transform: translateY(-50%);",
        "top: 76%; transform: translateY(-50%);"
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated: {filepath}")
