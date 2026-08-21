import re
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

script_content = """
<!-- GLOBAL BACK BUTTON & POPUP -->
<script>
(function() {
    function initBackBtn() {
        if (document.getElementById('globalBackBtnContainer')) return; // already injected

        const container = document.querySelector('.game-container') || 
                          document.querySelector('.screen-container') || 
                          document.querySelector('#scene') || 
                          document.body;

        const backBtnContainer = document.createElement('div');
        backBtnContainer.id = 'globalBackBtnContainer';
        backBtnContainer.style.cssText = 'position: absolute; top: 40px; right: 40px; z-index: 9999;';
        
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
        popupButtons.style.cssText = 'position: absolute; display: flex; flex-direction: column; align-items: center; top: 58%; transform: translateY(-50%);';
        
        const mainBtn = document.createElement('img');
        mainBtn.src = '../back_assets/view-main-bt.svg';
        mainBtn.alt = '메인화면으로';
        mainBtn.style.cssText = 'width: 553px; height: 119px; cursor: pointer; margin-bottom: 20px; pointer-events: auto;';
        
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

        const handleTouch = (e, callback) => {
            e.preventDefault();
            e.stopPropagation();
            callback();
        };

        const openPopup = () => { popupOverlay.style.display = 'flex'; };
        const closePopup = () => { popupOverlay.style.display = 'none'; };
        const goMain = () => { 
            localStorage.removeItem('quiz1_solved_answers');
            window.location.href = '../index.html'; 
        };

        backBtn.addEventListener('touchend', (e) => handleTouch(e, openPopup));
        backBtn.addEventListener('click', (e) => handleTouch(e, openPopup));
        
        closeText.addEventListener('touchend', (e) => handleTouch(e, closePopup));
        closeText.addEventListener('click', (e) => handleTouch(e, closePopup));
        
        mainBtn.addEventListener('touchend', (e) => handleTouch(e, goMain));
        mainBtn.addEventListener('click', (e) => handleTouch(e, goMain));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBackBtn);
    } else {
        initBackBtn();
    }
})();
</script>
"""

for filepath in files_to_update:
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'globalBackBtnContainer' in content:
        print(f"Already injected in: {filepath}")
        continue

    # Insert just before </body>
    new_content = re.sub(r'(</body>)', lambda m: script_content + '\n' + m.group(1), content, flags=re.IGNORECASE)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")
    else:
        print(f"Failed to find </body> in: {filepath}")
