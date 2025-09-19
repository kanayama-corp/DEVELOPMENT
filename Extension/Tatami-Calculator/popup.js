document.addEventListener('DOMContentLoaded', function() {
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const resultDiv = document.getElementById('result');

    function calculateTatami() {
        const length = parseFloat(lengthInput.value);
        const width = parseFloat(widthInput.value);

        if (isNaN(length) || isNaN(width) || length <= 0 || width <= 0) {
            resultDiv.textContent = '正しい数値を入力してください';
            return;
        }

        // 畳のサイズ (mm)
        // 標準的な江戸間: 1760mm × 880mm
        const standardTatamiLength = 1760;
        const standardTatamiWidth = 880;

        // 面積計算 (平方mm から 畳に変換)
        const inputArea = length * width;
        const tatamiArea = standardTatamiLength * standardTatamiWidth;
        const tatamiCount = inputArea / tatamiArea;

        resultDiv.textContent = `${tatamiCount.toFixed(2)} 畳`;
    }

    // 入力時にリアルタイム計算
    lengthInput.addEventListener('input', calculateTatami);
    widthInput.addEventListener('input', calculateTatami);
});