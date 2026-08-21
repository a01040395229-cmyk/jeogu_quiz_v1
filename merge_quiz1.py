import re
import os

html_sections = []

for i in range(1, 8):
    filepath = f'quiz1/screen{i}.html'
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract game-wrapper
    match = re.search(r'(<div class="game-wrapper">.*?)<script', content, re.DOTALL)
    if not match:
        # Fallback if no script tag follows immediately
        match = re.search(r'(<div class="game-wrapper">.*?)\s*</body>', content, re.DOTALL)
        
    if match:
        wrapper = match.group(1)
        wrapper = wrapper.replace('id="gameContainer"', '')
        
        # Remove popups
        wrapper = re.sub(r'<!-- 8\. Layer 8: Result Popup Container Overlay.*?</div>\s*</div>\s*</div>', '</div>', wrapper, flags=re.DOTALL)
        
        # Remove empty lines and trailing spaces for clean up
        wrapper = "\n".join([line for line in wrapper.split('\n') if line.strip() != ''])
        
        display = "block" if i == 1 else "none"
        
        section = f'\n<!-- ================= SCREEN {i} ================= -->\n'
        section += f'<div id="section-screen{i}" class="quiz-section" style="display: {display};">\n'
        section += wrapper
        section += '\n</div>\n'
        html_sections.append(section)

# Global Popup Structure
global_popup = """
<!-- GLOBAL QUIZ1 POPUP -->
<div class="popup-overlay-wrapper hidden" id="globalQuiz1Popup" style="position: absolute; top: 0; left: 0; width: 1080px; height: 1920px; background: rgba(0, 0, 0, 0.6); z-index: 9000; display: none; justify-content: center; align-items: center; pointer-events: auto;">
  <div class="popup-content" id="globalQuiz1PopupContent" style="position: relative; display: flex; justify-content: center; align-items: center;">
    <img id="globalQuiz1PopupImg" src="" alt="결과 팝업">
  </div>
</div>
"""

# HTML Shell
html_shell = f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <style>html, body {{ background-color: #000 !important; }}</style>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Quiz 1 (Merged)</title>
  <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
  <link rel="stylesheet" href="style.css">
  <style>
    .quiz-section {{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }}
  </style>
</head>
<body style="background-color: #000; margin: 0; padding: 0; overflow: hidden; touch-action: none;">

{''.join(html_sections)}

{global_popup}

<!-- GLOBAL BACK BUTTON & POPUP -->
<script>
(function() {{
    function initBackBtn() {{
        if (document.getElementById('globalBackBtnContainer')) return; 

        const container = document.body;

        const backBtnContainer = document.createElement('div');
        backBtnContainer.id = 'globalBackBtnContainer';
        backBtnContainer.style.cssText = 'position: absolute; top: 40px; left: 40px; z-index: 9999;';
        
        const backBtn = document.createElement('img');
        backBtn.src = '../back_assets/bt-back.svg';
        backBtn.alt = '뒤로가기';
        backBtn.style.cssText = 'width: 131px; height: 132px; cursor: pointer; pointer-events: auto;';
        backBtnContainer.appendChild(backBtn);

        const popupOverlay = document.createElement('div');
        popupOverlay.id = 'globalBackPopup';
        popupOverlay.style.cssText = 'position: absolute; top: 0; left: 0; width: 1080px; height: 1920px; background: rgba(0, 0, 0, 0.6); z-index: 10000; display: none; justify-content: center; align-items: center; pointer-events: auto;';

        const popupContent = document.createElement('div');
        popupContent.style.cssText = 'position: relative; display: flex; justify-content: center; align-items: center;';
        
        const popupBg = document.createElement('img');
        popupBg.src = '../back_assets/view-main.svg';
        popupBg.alt = '메인 팝업';
        popupBg.style.cssText = 'width: 799px; height: 863px;';
        
        const popupButtons = document.createElement('div');
        popupButtons.style.cssText = 'position: absolute; display: flex; flex-direction: column; align-items: center; top: 76%; transform: translateY(-50%);';
        
        const mainBtn = document.createElement('img');
        mainBtn.src = '../back_assets/view-main-bt.svg';
        mainBtn.alt = '메인화면으로';
        mainBtn.style.cssText = 'width: 553px; height: 119px; cursor: pointer; margin-top: -40px; margin-bottom: 60px; pointer-events: auto;';
        
        const closeText = document.createElement('div');
        closeText.textContent = '닫기';
        closeText.style.cssText = 'color: #35D047; font-size: 50px; font-weight: bold; cursor: pointer; text-align: center; padding: 10px; pointer-events: auto;';

        popupButtons.appendChild(mainBtn);
        popupButtons.appendChild(closeText);
        popupContent.appendChild(popupBg);
        popupContent.appendChild(popupButtons);
        popupOverlay.appendChild(popupContent);
        
        container.appendChild(backBtnContainer);
        container.appendChild(popupOverlay);

        const applyFeedback = (el) => {{
            el.style.transition = 'transform 0.1s, opacity 0.1s';
            const press = () => {{ el.style.transform = 'scale(0.90)'; el.style.opacity = '0.6'; }};
            const release = () => {{ el.style.transform = 'scale(1)'; el.style.opacity = '1'; }};
            el.addEventListener('touchstart', press, {{passive: true}});
            el.addEventListener('touchend', release);
            el.addEventListener('mousedown', press);
            el.addEventListener('mouseup', release);
            el.addEventListener('mouseleave', release);
        }};
        applyFeedback(backBtn);
        applyFeedback(mainBtn);
        applyFeedback(closeText);

        const handleTouch = (e, callback) => {{
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.opacity = '1';
            callback();
        }};

        const openPopup = () => {{ 
            if (backBtnContainer.style.display !== 'none') {{
                popupOverlay.style.display = 'flex'; 
            }}
        }};
        const closePopup = () => {{ popupOverlay.style.display = 'none'; }};
        const goMain = () => {{ 
            window.location.href = '../index.html'; 
        }};

        backBtn.addEventListener('touchend', (e) => handleTouch(e, openPopup));
        backBtn.addEventListener('click', (e) => handleTouch(e, openPopup));
        
        closeText.addEventListener('touchend', (e) => handleTouch(e, closePopup));
        closeText.addEventListener('click', (e) => handleTouch(e, closePopup));
        
        mainBtn.addEventListener('touchend', (e) => handleTouch(e, goMain));
        mainBtn.addEventListener('click', (e) => handleTouch(e, goMain));
    }}

    if (document.readyState === 'loading') {{
        document.addEventListener('DOMContentLoaded', initBackBtn);
    }} else {{
        initBackBtn();
    }}
}})();
</script>

<script src="script_merged.js"></script>
</body>
</html>
"""

with open('quiz1/index.html', 'w', encoding='utf-8') as f:
    f.write(html_shell)

print("Created quiz1/index.html")
