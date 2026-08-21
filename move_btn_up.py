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
    
    # Replace margin to shift mainBtn up without moving closeText
    content = content.replace(
        "cursor: pointer; margin-bottom: 20px; pointer-events: auto;",
        "cursor: pointer; margin-top: -40px; margin-bottom: 60px; pointer-events: auto;"
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated: {filepath}")
