# 王鹏超的论文主页

公开主页是静态文件，无需安装依赖或运行构建。计划在 GitHub 账号 `Blowa-hub` 下建立仓库 `math-homepage`，预期网址为 https://blowa-hub.github.io/math-homepage/ 。**目前尚未部署。**

GitHub 连接恢复后，可以继续由助手协助发布；以下手动步骤是连接暂未解决时的备用方式。

## 第一次发布

1. 登录 GitHub，点击右上角 **＋ → New repository**，名称填 `math-homepage`，选择 **Public**，创建仓库。
2. 选择 **Add file → Upload files**。在 Windows 中打开解压后的文件夹，把里面的文件以及 **assets、papers 两个文件夹直接拖入 GitHub 的上传区域**，不要再包一层 `academic-homepage`。上传列表应包含 `assets/style.css`、`assets/main.js`、`papers/2610.10493/paper.pdf` 等带目录的路径。包括 `index.html`、`profile.js`、`publications.js`、`assets/`、`papers/`、本说明及空文件 `.nojekyll`。**不要上传 `admin-service/`**，它是另行部署的后台服务包。点击 **Commit changes** 保存；若 `.nojekyll` 被遗漏，用 **Add file → Create new file** 在根目录补建。
3. 打开 **Settings → Pages → Build and deployment**，选择 **Deploy from a branch**，分支选 `main`，目录选 `/(root)`，点击 **Save**。
4. 等待发布（可能约 10 分钟），在 Pages 设置中点击 **Visit site**。核对姓名、论文分类及 PDF、LaTeX 下载链接。以后提交到 `main` 会自动更新。

## 更新外观

本版采用简洁的左右两栏学术版式、白色阅读区、蓝色链接及双语栏目标题；在手机上改为上下排列。默认中文，可在页顶切换英文。

解压最新版上传包，按第 2 步再次上传全部内容并提交，GitHub 会覆盖同名文件。提交前核对上传列表包含 `assets/` 与 `papers/` 下的文件；只上传根目录文件会导致样式、论文列表与附件无法加载。更新后稍等自动发布，再刷新主页。

## 个人资料与管理入口

修改 `profile.js` 中的姓名、单位、简介、研究方向和联系方式；双语内容使用 `en`、`zh`。`repository` 默认是 `{ owner: "Blowa-hub", name: "math-homepage", branch: "main" }`，若换仓库也应同步修改。

`adminURL` 目前留空。页脚“管理论文”因此会打开 GitHub 上 `publications.js` 的编辑页面；需要登录拥有仓库写入权限的 GitHub 账号。访客不能因此修改你的论文。

独立的站内管理服务已准备在 `admin-service/`，但**尚未部署、尚未配置 GitHub 登录**。完成单独部署及登录配置后，再把服务网址填入 `adminURL`。当前不能把它当成已经可用的登录后台；不要把登录密钥写入公开文件。

## 添加、分类与删除论文

现有五篇论文均归为 `completed`（完成版），已核验的 PDF 和源码 ZIP 放在 `papers/<arxivId>/paper.pdf`、`papers/<arxivId>/latex-source.zip`。

新论文可先在 `papers/` 下建一个简短英文名称的文件夹，放入 **PDF** 和 **LaTeX 文件（`.tex` 或包含所需源码的 `.zip`）**。然后在 `publications.js` 中复制一个完整条目，更新唯一 `id`、标题、作者、年份、日期、简介、BibTeX 等字段。条目之间保留逗号。下面只展示需要特别留意的字段，其余字段沿用现有格式：

```json
{
  "id": "my-new-paper",
  "title": "论文标题",
  "stage": "draft",
  "links": {
    "latex": "papers/my-new-paper/source.zip",
    "pdf": "papers/my-new-paper/paper.pdf",
    "arxiv": ""
  }
}
```

`stage: "draft"` 显示为“草稿”，改为 `"completed"` 就显示为“完成版”。这是写作阶段，与 `status` 中的 `Preprint`／预印本及 `venue` 中的 arXiv 或期刊信息分别记录；完成版不表示已正式发表。

LaTeX 和 PDF 链接必填，也可使用可下载的公开网址；arXiv 链接可选。arXiv 留空会自动显示“非公开”标签，**这只是标签，不是访问限制**：草稿及全部 PDF、LaTeX 附件仍可公开下载。上传相对路径时使用 `papers/...`，不要以 `/papers/...` 开头，以适配 `/math-homepage/` 网址。

论文简介是编辑性概括，并非原文摘要；正式引用请核对原文。删除 `publications.js` 中的条目会从列表移除论文，附件保留以便恢复，也仍可能通过原链接下载；独立管理服务的删除操作采用同样方式。

本地预览可直接用浏览器打开 `index.html`。GitHub Pages 已发布站点最多 1 GB；公开主页及附件应保持在该范围内。

官方参考：[创建站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) · [发布来源设置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [使用限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
