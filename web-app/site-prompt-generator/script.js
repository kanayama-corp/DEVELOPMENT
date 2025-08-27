// グローバル変数
let analyzedSites = {};

// 通知表示関数
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${isError ? 'error' : ''} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}



// 一括URL分析関数
async function analyzeAllUrls() {
    // 入力されたURLを収集
    const urls = [];
    for (let i = 1; i <= 5; i++) {
        const urlInput = document.getElementById(`url${i}`);
        const url = urlInput.value.trim();
        if (url && isValidUrl(url)) {
            urls.push({ index: i, url: url });
        }
    }
    
    if (urls.length === 0) {
        showNotification('少なくとも1つの有効なURLを入力してください', true);
        return;
    }
    
    try {
        showNotification(`${urls.length}個のサイトを一括解析中...`);
        
        // 全URLを並行して分析
        analyzedSites = {};
        const analysisPromises = urls.map(async ({ index, url }) => {
            const analysis = await simulateAnalysis(url);
            analyzedSites[index] = { ...analysis, url: url };
        });
        
        await Promise.all(analysisPromises);
        
        generateAllDocuments();
        showNotification('解析完了！要件定義書とプロンプトを生成しました');
        
    } catch (error) {
        showNotification('分析に失敗しました', true);
        console.error('Analysis error:', error);
    }
}

// URL有効性チェック
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// サイト分析シミュレーション
async function simulateAnalysis(url) {
    // 実際の実装では、ここでサイトの情報を取得
    await new Promise(resolve => setTimeout(resolve, 1500)); // 分析時間をシミュレート
    
    const domain = new URL(url).hostname;
    
    // サンプル分析結果（汎用テンプレート）
    const sampleAnalyses = {
        'apple.com': {
            title: 'Apple - 革新的なテクノロジー企業',
            description: 'ミニマルで洗練されたデザインと高品質なユーザーエクスペリエンス',
            design: 'ミニマリストデザイン、大きな商品写真、白を基調とした洗練されたレイアウト',
            colors: '#ffffff, #f5f5f7, #1d1d1f, #0071e3',
            features: '製品紹介、オンラインストア、サポート、企業情報'
        },
        'airbnb.com': {
            title: 'Airbnb - グローバル宿泊プラットフォーム',
            description: '世界中のユニークな宿泊施設を提供するシェアリングエコノミーサービス',
            design: '温かみのあるビジュアル、写真中心のレイアウト、直感的なユーザーインターフェース',
            colors: '#ffffff, #ff5a5f, #00a699, #484848',
            features: '検索機能、物件詳細、予約システム、ユーザーレビュー'
        },
        'stripe.com': {
            title: 'Stripe - オンライン決済ソリューション',
            description: '開発者フレンドリーな決済インフラを提供するFintech企業',
            design: 'クリーンでプロフェッショナル、グラデーションとアニメーションを活用',
            colors: '#ffffff, #6772e5, #24b47e, #32325d',
            features: 'サービス紹介、APIドキュメント、価格表、開発者リソース'
        },
        'default': {
            title: `${domain} - プロフェッショナルサービス`,
            description: '高品質なサービスを提供するプロフェッショナルな企業サイト',
            design: 'モダンで洗練されたデザイン、ユーザーフレンドリーなインターフェース',
            colors: '#ffffff, #f8f9fa, #007bff, #343a40',
            features: 'サービス紹介、会社案内、実績紹介、お問い合わせ'
        }
    };
    
    return sampleAnalyses[domain] || sampleAnalyses['default'];
}



// 要件定義書生成関数
function generateAllDocuments() {
    if (Object.keys(analyzedSites).length === 0) {
        showNotification('まず少なくとも1つのサイトを分析してください', true);
        return;
    }
    
    const requirementsDoc = generateRequirementsDocument();
    document.getElementById('requirements-text').value = requirementsDoc;
}



// ドキュメントコピー関数
async function copyPrompt(type) {
    const textArea = document.getElementById(`${type}-text`);
    const text = textArea.value;
    
    if (!text) {
        showNotification('コピーする内容がありません', true);
        return;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        showNotification('要件定義書をコピーしました！');
    } catch (err) {
        // フォールバック: テキストエリアを選択
        textArea.select();
        document.execCommand('copy');
        showNotification('要件定義書をコピーしました！');
    }
}

// 要件定義書生成関数
function generateRequirementsDocument() {
    const sites = Object.values(analyzedSites);
    
    // 入力されたURLを収集
    const inputUrls = [];
    for (let i = 1; i <= 5; i++) {
        const urlInput = document.getElementById(`url${i}`);
        const url = urlInput.value.trim();
        if (url) {
            inputUrls.push(url);
        }
    }
    
    let doc = `""フォルダは簡潔な名前で新しく作成して。回答やプロセスは可能な限り日本語で表示して。""

""作成したいHPのテーマ【】""

""参考URL""
`;
    
    // 入力されたURLを追加
    if (inputUrls.length > 0) {
        inputUrls.forEach(url => {
            doc += `${url}\n`;
        });
    } else {
        doc += '"複数ある場合は複数出して"\n';
    }
    
    // 分析されたサイトの特徴を収集
    const siteDescriptions = sites.map(site => site.description).join('、');
    const allFeatures = [...new Set(sites.flatMap(site => site.features.split('、')))];
    
    doc += `
## 1. プロジェクト概要

### 1.1 目的
以下の参考サイトの分析結果を基に、ユーザーエクスペリエンスとブランド価値を重視したプロフェッショナルなウェブサイトを開発する。

**参考サイトの特徴**: ${siteDescriptions}

モダンで機能的、かつ信頼感のあるデザインで、ターゲットユーザーに適切な価値を提供することを目指す。

## 2. サイト構成要件

### 2.1 メインコンテンツ
**参考サイトの特徴を反映した構成**:
${allFeatures.slice(0, 6).map((feature, index) => `${index + 1}. **${feature}**: ユーザーエクスペリエンスを重視したコンテンツ構成`).join('\n')}



### 2.2 ユーザビリティ要件
- 直感的で使いやすいユーザーインターフェース
- レスポンシブデザイン（モバイル・タブレット・デスクトップ対応）
- 高速なページ読み込みとスムーズな操作感
- アクセシビリティ対応（WCAG 2.1 AA準拠）

## 3. デザイン要件

### 3.1 デザインコンセプト
**参考サイトの特徴を統合**:
`;
    
    const designElements = sites.map(site => site.design).join('、');
    doc += `${designElements}

**デザインアプローチ**:
- モダンで洗練されたビジュアルデザイン
- ユーザーエクスペリエンスを重視したインターフェース
- ブランドアイデンティティと一貫性のあるデザイン
- 信頼感とプロフェッショナリズムを表現

**推奨カラー構成**:
- ベースカラー: 白またはライトグレー系
- アクセントカラー: ブランドを表現するメインカラー
- テキストカラー: 高い可読性を保つダーク系
- サポートカラー: 情報伝達や状態表示用

### 3.2 レイアウト要件
- モバイルファーストアプローチ
- グリッドシステムを使った整理されたレイアウト
- 適切な余白とコンテンツのバランス
- 直感的なナビゲーションと情報構造
- アニメーションやトランジションの適切な使用`;

    return doc;
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    showNotification('要件定義書生成ツールへようこそ！');
    
    // Enterキーでの一括解析実行
    document.querySelectorAll('.url-input').forEach((input) => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                analyzeAllUrls();
            }
        });
    });
});
