# PLIDEPLI 品牌网站

面向美国用户的 Kickstarter 预热网站。React + TypeScript + Vite，四个独立页面静态部署到 GitHub Pages，字体自托管。

页面地址：`/` 首页、`/product/` 产品详情、`/stories/` 完整故事、`/installation/` 安装图解。Vite 会为每个地址生成真实的 HTML 文件，支持直接打开、刷新和独立分享。

## 本地查看

```bash
npm install
npm run dev
```

打开终端显示的本地地址。检查与构建：

```bash
npm run lint
npm run build
npm run preview
```

## 文件位置

| 文件 | 用途 |
| --- | --- |
| `src/App.tsx` | 首页、表单、安装示意图、FAQ 和隐私说明 |
| `src/index.css` | 配色、字体、电脑及手机布局 |
| `src/stories.ts` | 七章研发日志文案及原始媒体引用 |
| `src/pages/StoriesPage.tsx` | 完整七章故事、27 张精选图片、7 支 30 秒短片、章节目录 |
| `src/pages/ProductPage.tsx` | 产品图库、结构、三种模式、套装和适用条件 |
| `src/pages/InstallationPage.tsx` | 墙面、横杆、顶部三套安装步骤图解 |
| `src/HomeSections.tsx` | 首页产品入口和生活场景横幅 |
| `src/HomeBench.tsx` | 首页团队开场白、30 秒调试短片和工作台照片 |
| `src/components/HashNavigation.tsx` | 跨页锚点在内容和字体加载完成后的准确定位 |
| `src/home-refinements.css` | 四页统一配色、宽幅安装示意图和团队媒体布局 |
| `src/components/PhotoViewer.tsx` | 公用照片放大、左右切换和键盘操作 |
| `src/pages.css` | 多页设计、图库和手机布局 |
| `src/story-editorial.css` | 创始故事、精选图集和短片排版 |
| `src/story-media.ts` | 由剪辑脚本生成的精选素材索引 |
| `public/story-edits/` | 8 支 30 秒成片、精选图片、封面和分场景原创配乐 |
| `scripts/build-story-media.py` | 可复现剪辑、配乐合成与素材导出 |
| `docs/story-media-editing.md` | 整理规则、素材来源、重建方法 |
| `src/main.tsx` | React 入口和字体加载 |
| `public/stories/` | 原有研发照片与视频 |
| `public/video/` | 宣传片与封面；目前按要求保留原视频 |
| `public/fcc/` | FCC 授权书、完整测试报告及原有截图 |
| `public/product/` | 套装、零件、安装步骤的压缩图片及场景图 |
| `public/bench/` | 首页指定的两段未剪辑原视频、视频封面和工作台照片 |
| `index.html`、各页面目录下的 `index.html` | 各页面独立标题、描述、社交分享信息 |
| `docs/product-assets.json` | 新增渲染素材与网页图片文件的对应表 |
| `docs/image-generation.md` | 内置绘图模型生成图片的路径、提示词和使用说明 |
| `docs/redesign-notes.md` | 设计取舍、数据出处、后续内容与验证说明 |

## 邮箱订阅与联系地址

在 `.env` 设置（该文件不上传）：

```dotenv
VITE_FORMSPREE_ID=你的表单ID
VITE_CONTACT_EMAIL=你的公开联系邮箱
```

`VITE_FORMSPREE_ID` 沿用现有 Formspree 配置。表单只发送用户主动填写的邮箱和表单位置信息，不自动提交测试数据。成功、失败、重试、提交中与超时均有处理。

`VITE_CONTACT_EMAIL` 可选。提供真实地址后，FAQ、页脚和隐私说明会显示联系入口；未配置时隐藏，不使用虚构邮箱。

上线环境在 GitHub 仓库 Settings → Secrets and variables → Actions → Variables 中配置同名变量。现有工作流已接入这两个变量。修改变量后需重新构建。

## 发布

当前工作流在 push 到 `main` 时自动构建并部署至 https://plidepli.github.io/。本地改动和本地构建不会更新线上页面。

发布前先检查 Git diff，再提交和推送经确认的文件。

## 内容维护

- 目标价约 $275，不是已确定的销售价格；众筹上线前公布最终价格、配件、交付和售后条款。
- 首屏强调室内天线内置；室外天线及连接线仍然需要安装。
- 以固定住宅、小屋场景为主，不宣传行驶中使用。
- 实测增益按完整 FCC 报告第 18 页标明为 61.27–64.69 dB，不将天线增益相加后称为 FCC 实测系统增益。
- 运营商支持取决于当地频段；实验室合规测试不能替代家庭覆盖/测速证据。
- 首页已移除未验证的覆盖面积和笼统“半价”比较。
- 新的实地测试结果应同时标明手机、运营商、频段、测试位置、安装条件和测量方法。
- 桌面的原始说明书含历史品牌信息和需核对的说明，未直接发布为用户安装指南，详见设计记录。

已生成的预览图位于桌面的 `plidepli-preview` 文件夹，最新截图以 `v6-` 开头。
