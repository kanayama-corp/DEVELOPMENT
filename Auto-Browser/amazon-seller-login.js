const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000 // 操作を見やすくするため1秒の遅延
  });

  const page = await browser.newPage();

  try {
    const url = 'https://sellercentral.amazon.co.jp/ap/signin?clientContext=356-3238816-0212765&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fsellercentral.amazon.co.jp%2Freportcentral%2FLEDGER_REPORT%2F0&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=sc_jp_amazon_v2&openid.mode=checkid_setup&language=ja_JP&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&pageId=sc_amazon_v3_unified&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&ssoResponse=eyJ6aXAiOiJERUYiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiQTI1NktXIn0.B2O_lp_KxCLBRDgVJuXeVw1pI20Jncn8usgVIJjUGJYS6xR3Pqsy7g.ugP-tqhPXoTWF23-.IoGUZ9IMRh5lHgZ_jGpfWdiugjKvHFnXMvgszyrsFgbsX4gyqb1rFpHWW71EoNwBipdX9EXGwMyPugAN0Zqmtt0dB2OglCDDeDWQbYjEOhQTK4n2Gfoy7V9_zQTtRA3YiH59LwE8GxnhkGPT2ahKHI8WStF3jTLDs-WCp6uP60jaxa4EAOCRxR6Cl6_3Kbk5WODG_dVPJ9I1_XYqKP_KNIHltavGjBu-QL5gjOWFHOcg2_GsUZ3VhqgZ27UKXxNazKbJ8JuaEy33rqCGEB0FNE4tEEWPrr4WklycTKRAG081fPB6FuY-Hqp2qEfbFKnwx5gKd_6Ht3PxFm8FVQYJOaASgwmXmYQRhlvQPRe9G_vhQXJKeLq97NQ15NNzIU4n_WDuVQlxndGnlECYpciHhTF__8tudh3DJxW4qyWmPFJrCvf4Ke0KvnCQi9Yj8Sv-6HCB_QzCxAtGe8ZB0anl6B4s4b_WQpctztsB7oefKm1LAxiPKb5Bbu5qNLUplM_B4rgsfGA6HFkjDiqDLgDnTkN-RaPAb9iGGAcMW49PV2rNcPQ9kpTqtb2nv71dSbD7NPIFidpJBUUQ-7u-rpyXKkcyGKuemtXv.oBKjmVoNERNuuuWBVmGZZQ';

    console.log('Amazon Seller Centralを開いています...');
    await page.goto(url);

    // ページが読み込まれるまで少し待機
    await page.waitForTimeout(3000);

    // "No passkeys available" ダイアログをチェック
    const closeButton = page.locator('button:has-text("Close"), button:has-text("閉じる")');
    if (await closeButton.isVisible()) {
      console.log('"No passkeys available" ダイアログが表示されました。Closeボタンをクリックします...');
      await closeButton.click();
      await page.waitForTimeout(2000);
    }

    // Eメールまたは携帯電話番号の入力フィールドをチェック
    const emailField = page.locator('input[name="email"], input[type="email"], input[placeholder*="メール"], input[placeholder*="email"], input[id*="email"]');
    if (await emailField.isVisible()) {
      console.log('Eメールまたは携帯電話番号の入力が求められました。メールアドレスを入力します...');
      await emailField.fill('chrome.10.729@gmail.com');

      // 続行ボタンを探してクリック
      const continueButton = page.locator('input[type="submit"], button[type="submit"], button:has-text("続行"), button:has-text("Continue")');
      if (await continueButton.isVisible()) {
        await continueButton.click();
        console.log('続行ボタンをクリックしました。');
        await page.waitForTimeout(3000);
      }
    }

    // ログイン画面かどうかをチェック
    const passwordField = page.locator('input[type="password"], input[name="password"]');
    if (await passwordField.isVisible()) {
      console.log('ログイン画面が表示されました。パスワードを入力します...');
      await passwordField.fill('mako9957#');

      // サインインボタンを探してクリック（より具体的なセレクター）
      const signInButton = page.locator('#signInSubmit');
      if (await signInButton.isVisible()) {
        await signInButton.click();
        console.log('サインインボタンをクリックしました。');
      }
    }

    console.log('処理が完了しました。ブラウザを手動で閉じるまで待機します...');

    // ブラウザが閉じられるまで待機
    await page.waitForEvent('close').catch(() => {});

  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    await browser.close();
  }
})();