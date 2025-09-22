document.addEventListener('DOMContentLoaded', function() {
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const resultDiv = document.getElementById('result');
    const settingsBtn = document.getElementById('settingsBtn');

    // 畳の計測方法定義
    const tatamiMethods = {
        'edoma': { name: '江戸間', length: 1760, width: 880 },
        'kyoma': { name: '京間', length: 1910, width: 955 },
        'chukyoma': { name: '中京間', length: 1820, width: 910 },
        'danchima': { name: '団地間', length: 1700, width: 850 },
        'rokuichima': { name: '六一間', length: 1850, width: 925 },
        'sabashakuhachima': { name: '三八間', length: 1727, width: 864 }
    };

    let selectedMethods = ['edoma'];

    // 設定の読み込み
    function loadSettings() {
        chrome.storage.sync.get(['selectedTatamiMethods'], function(result) {
            if (result.selectedTatamiMethods) {
                selectedMethods = result.selectedTatamiMethods;
            }
        });
    }

    function calculateTatami() {
        const length = parseFloat(lengthInput.value);
        const width = parseFloat(widthInput.value);

        if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
            resultDiv.textContent = '正しい数値を入力してください';
            return;
        }

        const inputArea = length * width;
        let resultText = '';

        selectedMethods.forEach((methodKey, index) => {
            const method = tatamiMethods[methodKey];
            if (method) {
                const tatamiArea = method.length * method.width;
                const tatamiCount = inputArea / tatamiArea;
                if (index > 0) resultText += '<br>';
                resultText += `${method.name}: ${tatamiCount.toFixed(2)} 畳`;
            }
        });

        resultDiv.innerHTML = resultText || '計測方法が選択されていません';
    }

    // 設定画面を開く
    function openSettings() {
        document.getElementById('mainView').style.display = 'none';
        document.getElementById('settingsView').style.display = 'block';
        loadSettingsView();
    }

    function loadSettingsView() {
        const checkboxContainer = document.getElementById('methodCheckboxes');
        checkboxContainer.innerHTML = '';

        Object.keys(tatamiMethods).forEach(key => {
            const method = tatamiMethods[key];
            const div = document.createElement('div');
            div.className = 'checkbox-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = key;
            checkbox.checked = selectedMethods.includes(key);

            const label = document.createElement('label');
            label.htmlFor = key;
            label.textContent = `${method.name} (${method.length}×${method.width}mm)`;

            div.appendChild(checkbox);
            div.appendChild(label);
            checkboxContainer.appendChild(div);
        });

    }

    function saveSettings() {
        const checkboxes = document.querySelectorAll('#methodCheckboxes input[type="checkbox"]');
        selectedMethods = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedMethods.push(checkbox.id);
            }
        });

        chrome.storage.sync.set({ selectedTatamiMethods: selectedMethods }, function() {
            document.getElementById('settingsView').style.display = 'none';
            document.getElementById('mainView').style.display = 'block';
            calculateTatami();
        });
    }

    function cancelSettings() {
        document.getElementById('settingsView').style.display = 'none';
        document.getElementById('mainView').style.display = 'block';
    }

    loadSettings();

    // 起動時に最初の入力フィールドにフォーカス
    lengthInput.focus();

    // エンターキーで次のフィールドに移動
    lengthInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            widthInput.focus();
        }
    });

    widthInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            // 最後のフィールドでエンターを押したら最初のフィールドに戻る
            lengthInput.focus();
        }
    });

    lengthInput.addEventListener('input', calculateTatami);
    widthInput.addEventListener('input', calculateTatami);
    settingsBtn.addEventListener('click', openSettings);
    document.getElementById('saveBtn').addEventListener('click', saveSettings);
    document.getElementById('cancelBtn').addEventListener('click', cancelSettings);

    // ショートカット設定画面を開く
    document.getElementById('openShortcutSettings').addEventListener('click', function() {
        chrome.tabs.create({
            url: 'chrome://extensions/shortcuts'
        });
    });
});