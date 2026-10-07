# 橋本将 | Portfolio

3Dの自己紹介サイト（日本語 / English 切替対応）。
[JavaScript Mastery の 3D Developer Portfolio](https://github.com/adrianhajdin/project_3D_developer_portfolio) をベースに、以下を変更しています。

- 日英切替（右上の JA / EN。`?lang=en` のURLで英語版を直接開ける。選んだ言語はブラウザに記憶）
- 構成を「ヒーロー → プロフィール → 経歴 → (スキル) → 制作物 → 連絡先」に整理（推薦文・EmailJSフォームは削除。制作物はブラウザ風のリンクカード）
- 内容を `src/constants/index.js` の1ファイルに集約
- 3Dモデルを最適化（15.7MB → 3.1MB）し、スマホでも机全体が収まるよう自動調整
- スマホでは3Dのドラッグ操作を無効にして、スクロールを妨げないように
- 日本語フォント（Noto Sans JP）と文節単位の改行
- 暖色系の配色テーマ3種（背景の線・PCのRGBライト・星もテーマ色に追従）
- **3DのPCを操作できる**：モニターをクリックすると画面へズームし、画面内のミニデスクトップで「プロフィール」アプリ（自己紹介・経歴・スキル）を操作できる。カーソルに合わせて机の上の3Dマウスも動く（Esc または「戻る」で元の視点へ。スマホはタップで全画面表示）

## 内容の編集

`src/constants/index.js` だけを編集すればOKです。

| 項目 | 変数 |
| --- | --- |
| 配色テーマ（`ember` / `terracotta` / `cream`） | `siteTheme` |
| 名前・所属・ひとこと・自己紹介文・メール | `profile` |
| 見出しなど画面の文言 | `ui` |
| 自己紹介下のカード | `services` |
| スキル（3Dボール） | `technologies` |
| 経歴タイムライン | `experiences` |
| 制作物（リンクカード） | `works` |
| フォト（写真とキャプション） | `photos` |
| 連絡先リンク | `socials` |

文章は `{ ja: "日本語", en: "English" }` の形で書きます。
`services`（得意分野カード）・`technologies`（スキル）・`experiences`（経歴）は空にするとその欄ごと非表示になり、ナビや画面内アプリのタブからも自動で外れます。
配色の中身（色コード）は `src/theme.js` で調整できます。URL に `?theme=cream` などを付けると、公開後でも他のテーマを試せます。
写真は `src/assets/photos/` に「名前.webp」と一覧用の「名前-thumb.webp」を置き、`photos` に `photo("名前")` とキャプションを書きます（クリックで拡大表示、← → で移動）。
スキルのアイコン画像は `src/assets/tech/` に置き、`src/assets/index.js` で読み込みます。

### 画面内デスクトップについて

- 中身は `src/constants/index.js` のデータ（`profile` / `services` / `experiences` / `technologies`）をそのまま使うので、別途編集は不要です。
- 画面内の文言は `ui.pc` で変更できます。
- 仕組み：`src/components/canvas/Computers.jsx`（カメラのズーム・3Dマウス）、`src/components/pc/`（画面内のUI）、`src/pc/store.js`（両者で共有する状態）。
- 3Dモデル `public/desktop_pc/scene.glb` は、スピーカーを外し、マウスを普通の黒マウスにして1つのノード（`Mouse`）にまとめ、モニター画面を `Screen` として扱えるよう再構成・最適化したものです（作り直し用スクリプト：`tools/build-model.cjs`）。

## ローカルで動かす

Node.js 18 以上が必要です。

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 本番用ビルド（dist/）
```

## 公開（GitHub + Vercel）

1. GitHub で空のリポジトリ（例：`portfolio`）を作成
2. このフォルダで：
   ```bash
   git remote add origin https://github.com/<ユーザー名>/portfolio.git
   git branch -M main
   git push -u origin main
   ```
3. [vercel.com](https://vercel.com) に GitHub でログイン →「Add New… → Project」→ リポジトリを Import → そのまま「Deploy」
   （Framework Preset は自動で **Vite** になります。Build Command `npm run build` / Output `dist`）
4. 以降は `main` に push するたびに自動で再デプロイされます。

## クレジット

- テンプレート: [adrianhajdin/project_3D_developer_portfolio](https://github.com/adrianhajdin/project_3D_developer_portfolio)
- 3Dモデル: “[Gaming Desktop PC](https://sketchfab.com/3d-models/gaming-desktop-pc-d1d8282c9916438091f11aeb28787b66)” by [Yolala1232](https://sketchfab.com/Yolala1232) — [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)（サイトのフッターにも表記。削除しないでください）
- SNSアイコン: [Simple Icons](https://simpleicons.org)（CC0）
