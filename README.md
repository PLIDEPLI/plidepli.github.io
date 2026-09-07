# PLIDEPLI 落地页

PLIDEPLI 蜂窝信号放大器（Kickstarter 预热）的单页落地页。纯英文、极客人设、透明硬核风格。

- 线上地址：https://plidepli.github.io/
- 技术栈：React + TypeScript + Vite（纯静态站，无后端）
- 字体自托管（`@fontsource`），不依赖 Google Fonts CDN

---

## 一、本地开发

```bash
cd plidepli-landing
npm install          # 首次运行
npm run dev          # 启动本地开发服务器，浏览器打开终端提示的地址（默认 http://localhost:5173）
```

改完代码后开发服务器会自动热更新，无需手动刷新。

## 二、构建（本地打包预览）

```bash
npm run build        # 产出 dist/ 静态文件
npm run preview      # 本地预览构建产物
```

## 三、部署（GitHub Pages，自动）

项目已配置好 GitHub Actions，**push 到 `main` 分支即自动构建并部署**，1–2 分钟后生效。

```bash
git add .
git commit -m "说明这次改了什么"
git push
```

> 如果 push 失败（国内网络偶尔连不上 github.com），多试几次，或改用：
> ```bash
> gh workflow run deploy.yml --ref main   # 手动触发一次构建，无需 push
> ```

## 四、邮箱收集（Formspree）

「Get notified」表单通过 Formspree 收集邮箱。

- 当前 form ID：`xqpkylrv`（配置在 GitHub 仓库变量 `VITE_FORMSPREE_ID` 中）
- 查看收集到的邮箱：登录 https://formspree.io → 对应 form → Submissions

**更换 form ID 的方法**：

```bash
gh variable set VITE_FORMSPREE_ID --repo PLIDEPLI/plidepli.github.io --body "你的新ID"
```

然后触发一次构建（`gh workflow run deploy.yml --ref main`）。

本地 `.env`（已 gitignore，不会上传）里也可写一行 `VITE_FORMSPREE_ID=xxx` 供本地调试。

## 五、文件结构（改文案看这里）

```
src/
  App.tsx        # 页面全部内容与文案（改文字、改卖点都在这）
  index.css      # 全部样式（配色、字体、间距）
  main.tsx       # 入口 + 字体引入
public/
  video/         # 宣传视频 promo.mp4 与封面 poster.jpg
  favicon.svg    # 网站图标
index.html       # 页面标题、SEO 描述
```

改页面文字：直接编辑 `src/App.tsx`，搜索对应英文句子替换即可。

## 六、内容红线（上线前务必核对）

以下内容来自 FCC 授权文件（FCC ID `2BWMS-L5-5B-2006`），对外文案不要超出：

- **增益**：放大器增益实测约 62–65 dB，页面统一写「65–70 dB」（65 dB 放大增益 + 含天线约 70 dB 系统增益）。700/850 频段的 FCC 增益上限仅 63.5–65 dB，**不要宣称单频段 70 dB**。
- **设备类型**：FCC 认证为 **Fixed（固定式）**，仅限建筑内/固定位置使用；营地仅指「停靠状态下」。不要宣传为车载/移动中使用。
- **天线**：套装含室外对数周期天线（7.5–9 dBi），室内侧可选内置或天花板天线。**不要写「免走线/免钻孔」**，正确说法是「室内天线内置，室外只需装一根天线，比双天线系统少装一半」。
- **持证主体**：品牌为 PLIDEPLI，FCC 授权由香港主体 Light Folding Science and Technology Co., Limited 持有（页面已注明）。
- **竞品**：对比时不直接点名竞品品牌（避免法律/公关风险），统一用「市场主流产品」等泛指。

## 七、常用维护命令

| 操作 | 命令 |
|---|---|
| 本地跑起来 | `npm run dev` |
| 打包检查 | `npm run build` |
| 推送上线 | `git add . && git commit -m "更新" && git push` |
| 手动触发构建 | `gh workflow run deploy.yml --ref main` |
| 看构建状态 | `gh run list` |
