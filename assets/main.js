(() => {
  "use strict";
  const profile = window.PROFILE || {};
  const papers = Array.isArray(window.PUBLICATIONS) ? window.PUBLICATIONS : [];
  const translations = {
    en: { skip: "Skip to content", nav: "Main navigation", navAbout: "About", navPapers: "Publications", profile: "Profile", sidebarNote: "Research & publications", eyebrow: "ACADEMIC HOMEPAGE", aboutTitle: "Welcome.", browse: "Browse publications", papersEyebrow: "RESEARCH", papersTitle: "Publications & preprints", papersIntro: "Papers, preprints, and links to the full text.", footerNote: "Academic homepage", citationTitle: "Cite this paper", citationNote: "BibTeX", close: "Close", copy: "Copy citation", copied: "Citation copied.", copyFallback: "Select the citation and press Ctrl+C (⌘C on Mac).", abstract: "Abstract", cite: "Cite", empty: "The publication list is being prepared.", paperSingular: "paper", paperPlural: "papers", undated: "Undated", email: "Email", scholar: "Google Scholar" },
    zh: { skip: "跳至正文", nav: "主导航", navAbout: "关于", navPapers: "论文", profile: "个人资料", sidebarNote: "研究与论文", eyebrow: "个人学术主页", aboutTitle: "欢迎。", browse: "浏览论文", papersEyebrow: "学术研究", papersTitle: "论文与预印本", papersIntro: "研究论文、预印本及全文链接。", footerNote: "个人学术主页", citationTitle: "引用这篇论文", citationNote: "BibTeX 引用格式", close: "关闭", copy: "复制引用", copied: "已复制引用。", copyFallback: "请选择引用文字，按 Ctrl+C（Mac 使用 ⌘C）复制。", abstract: "摘要", cite: "引用", empty: "论文列表正在整理。", paperSingular: "篇论文", paperPlural: "篇论文", undated: "未标年份", email: "电子邮箱", scholar: "Google Scholar" }
  };
  let language = profile.defaultLanguage === "zh" ? "zh" : "en";
  translations.en.abstract = "Summary";
  translations.zh.abstract = "简介";
  Object.assign(translations.en, { papersIntro: "Completed papers and drafts, with PDFs and LaTeX sources.", categories: "Paper categories", completedTitle: "Completed papers", draftsTitle: "Drafts", completedEmpty: "No completed papers listed yet.", draftsEmpty: "No drafts shared yet.", manage: "Manage papers", nonpublic: "Non-public", nonpublicNote: "No arXiv link; attachments are public." });
  Object.assign(translations.zh, { papersIntro: "按完成版与草稿分类，提供 PDF、LaTeX 源文件及可选的 arXiv 链接。", categories: "论文分类", completedTitle: "完成版", draftsTitle: "草稿", completedEmpty: "暂无完成版论文。", draftsEmpty: "暂无公开的草稿。", manage: "管理论文", nonpublic: "非公开", nonpublicNote: "未提供 arXiv 链接；附件仍公开下载。" });
  Object.assign(translations.en, { navAbout: "Research", aboutTitle: "Research", aboutSubtitle: "研究简介", papersTitle: "Papers", papersSubtitle: "论文与预印本", papersIntro: "Completed papers and drafts, with PDF and LaTeX downloads.", interestsLabel: "Research areas" });
  Object.assign(translations.zh, { navAbout: "研究", aboutTitle: "研究简介", aboutSubtitle: "Research", papersTitle: "论文", papersSubtitle: "Papers & Preprints", papersIntro: "完成版与草稿，提供 PDF 和 LaTeX 源码下载。", draftsEmpty: "暂无草稿。", interestsLabel: "研究方向" });
  try { const saved = localStorage.getItem("academic-homepage-language"); if (saved === "en" || saved === "zh") language = saved; } catch (_) {}
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
  const localized = value => typeof value === "string" ? value : value?.[language] || value?.en || value?.zh || "";
  const normalizeName = name => String(name).toLowerCase().replace(/[\s-]/g, "");
  const safeURL = value => { if (typeof value !== "string" || !value.trim()) return null; try { const url = new URL(value, window.location.href); return ["http:", "https:", "file:"].includes(url.protocol) && !/^\s*\/\//.test(value) ? url : null; } catch (_) { return null; } };
  const makeLink = (label, href, className) => { const url = safeURL(href); if (!url) return null; const link = el("a", className, label); link.href = href; if (url.origin !== window.location.origin) { link.target = "_blank"; link.rel = "noopener noreferrer"; } return link; };
  function showCitation(paper, trigger) { const dialog = document.getElementById("citation-dialog"); document.getElementById("citation-text").value = paper.bibtex; document.getElementById("copy-status").textContent = ""; dialog.returnFocus = trigger; dialog.showModal(); }
  function renderPaper(paper) {
    const t = translations[language];
    const article = el("article", "paper");
    const heading = el("h5", "paper-title");
    heading.lang = typeof paper.title === "string" ? "en" : language;
    const title = localized(paper.title);
    heading.append(makeLink(title, paper.links?.arxiv || paper.links?.doi || paper.links?.pdf, "") || el("span", "", title));
    article.append(heading);
    const authors = el("p", "authors"); authors.lang = "en";
    const authorNames = Array.isArray(paper.authors) ? paper.authors : [];
    authorNames.forEach((author, index) => { if (index) authors.append(document.createTextNode(", ")); const own = [localized(profile.name), profile.name?.en, profile.name?.zh].filter(Boolean).some(name => normalizeName(name) === normalizeName(author)); authors.append(own ? el("strong", "", author) : document.createTextNode(author)); });
    article.append(authors);
    const meta = el("div", "publication-meta");
    if (paper.year) meta.append(el("span", "publication-year", String(paper.year)));
    if (paper.status) meta.append(el("span", "status-badge", localized(paper.status)));
    if (!paper.links?.arxiv?.trim()) { const badge = el("span", "status-badge nonpublic-badge", t.nonpublic); badge.title = t.nonpublicNote; badge.setAttribute("aria-label", `${t.nonpublic}: ${t.nonpublicNote}`); meta.append(badge, el("span", "nonpublic-note", t.nonpublicNote)); }
    if (paper.venue) meta.append(el("span", "", localized(paper.venue)));
    article.append(meta);
    const actions = el("div", "paper-actions");
    [["PDF", paper.links?.pdf], ["LaTeX", paper.links?.latex], ["arXiv", paper.links?.arxiv], ["DOI", paper.links?.doi], [language === "zh" ? "代码" : "Code", paper.links?.code]].forEach(([label, href]) => { const link = makeLink(label, href, "paper-link"); if (link) { link.dataset.kind = label.toLowerCase(); link.setAttribute("aria-label", `${label}: ${title}`); if (label === "LaTeX" && !/^[a-z]+:/i.test(href)) link.setAttribute("download", ""); if (label === "PDF") { link.target = "_blank"; link.rel = "noopener noreferrer"; } actions.append(link); } });
    if (paper.bibtex) { const button = el("button", "cite-button", t.cite); button.type = "button"; button.setAttribute("aria-label", `${t.cite}: ${title}`); button.addEventListener("click", () => showCitation(paper, button)); actions.append(button); }
    article.append(actions);
    const abstract = localized(paper.abstract);
    if (abstract) { const details = el("details", "abstract"); details.append(el("summary", "", t.abstract), el("p", "", abstract)); article.append(details); }
    return article;
  }
  function render() {
    const t = translations[language];
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = `${localized(profile.name)} · ${language === "zh" ? "个人学术主页" : "Research & Publications"}`;
    document.querySelectorAll("[data-text]").forEach(node => { node.textContent = t[node.dataset.text]; });
    document.querySelectorAll(".section-subtitle").forEach(node => { node.lang = language === "zh" ? "en" : "zh-CN"; });
    document.querySelectorAll("[data-aria]").forEach(node => { node.setAttribute("aria-label", t[node.dataset.aria]); });
    ["header-name", "profile-name", "footer-name"].forEach(id => { document.getElementById(id).textContent = localized(profile.name); });
    const alternate = document.getElementById("alternate-name"); alternate.textContent = localized(profile.alternateName); alternate.lang = language === "en" ? "zh" : "en";
    document.getElementById("affiliation").textContent = localized(profile.affiliation);
    const role = document.getElementById("role"); role.textContent = localized(profile.role); role.hidden = !role.textContent;
    document.getElementById("bio").textContent = localized(profile.bio);
    const alternateBio = document.getElementById("alternate-bio"); const alternateLanguage = language === "zh" ? "en" : "zh";
    alternateBio.textContent = typeof profile.bio === "object" ? profile.bio?.[alternateLanguage] || "" : ""; alternateBio.lang = alternateLanguage === "zh" ? "zh-CN" : "en"; alternateBio.hidden = !alternateBio.textContent;
    const repository = profile.repository || { owner: "Blowa-hub", name: "math-homepage", branch: "main" };
    const managementURL = profile.adminURL || `https://github.com/${encodeURIComponent(repository.owner)}/${encodeURIComponent(repository.name)}/edit/${encodeURIComponent(repository.branch)}/publications.js`;
    const managementLink = document.getElementById("manage-papers"); managementLink.href = safeURL(managementURL)?.href || "https://github.com/Blowa-hub";
    const tags = document.getElementById("research-interests"); tags.replaceChildren(); const interests = Array.isArray(profile.researchInterests) ? profile.researchInterests : []; interests.forEach(item => tags.append(el("span", "interest-tag", localized(item)))); tags.hidden = !interests.length;
    const links = document.getElementById("profile-links"); links.replaceChildren();
    [["github", "GitHub"], ["scholar", t.scholar], ["orcid", "ORCID"]].forEach(([key, label]) => { const link = makeLink(label, profile.links?.[key], ""); if (link) { link.append(el("span", "external-arrow", "↗")); links.append(link); } });
    const email = profile.links?.email; if (typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { const link = el("a", "", t.email); link.href = `mailto:${encodeURIComponent(email).replace(/%40/g, "@")}`; links.prepend(link); }
    const langButton = document.getElementById("language-button"); langButton.textContent = language === "en" ? "中文" : "EN"; langButton.lang = language === "en" ? "zh-CN" : "en"; langButton.setAttribute("aria-label", language === "en" ? "切换为中文" : "Switch to English");
    const list = document.getElementById("publication-list"); list.replaceChildren();
    const validPapers = papers.filter(paper => paper && localized(paper.title));
    document.getElementById("paper-count").textContent = language === "zh" ? `${validPapers.length} 篇论文` : `${validPapers.length} ${validPapers.length === 1 ? t.paperSingular : t.paperPlural}`;
    const sorted = [...validPapers].sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0) || String(b.date || "").localeCompare(String(a.date || "")));
    [["completed", "completed-papers", t.completedTitle, t.completedEmpty], ["draft", "draft-papers", t.draftsTitle, t.draftsEmpty]].forEach(([stage, id, title, empty]) => {
      const category = el("section", "paper-category"); category.id = id;
      const items = sorted.filter(paper => (paper.stage || "completed") === stage);
      if (!items.length) category.className += " is-empty";
      const categoryHeading = el("div", "category-heading"); const heading = el("h3", "", title); heading.id = `${id}-title`; category.setAttribute("aria-labelledby", heading.id); categoryHeading.append(heading, el("span", "category-count", String(items.length))); category.append(categoryHeading);
      if (!items.length) category.append(el("p", "category-empty", empty));
      const groups = new Map(); items.forEach(paper => { const year = paper.year || t.undated; if (!groups.has(year)) groups.set(year, []); groups.get(year).push(paper); });
      groups.forEach((yearItems, year) => { const section = el("section", "year-group"); section.setAttribute("aria-label", String(year)); section.append(el("h4", "year-label", String(year))); const entries = el("div", "year-papers"); yearItems.forEach(paper => entries.append(renderPaper(paper))); section.append(entries); category.append(section); });
      list.append(category);
    });
  }
  document.getElementById("language-button").addEventListener("click", () => { language = language === "en" ? "zh" : "en"; try { localStorage.setItem("academic-homepage-language", language); } catch (_) {} render(); });
  const dialog = document.getElementById("citation-dialog");
  document.getElementById("close-citation").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener("close", () => dialog.returnFocus?.focus());
  document.getElementById("copy-citation").addEventListener("click", async () => { const field = document.getElementById("citation-text"); const status = document.getElementById("copy-status"); try { await navigator.clipboard.writeText(field.value); status.textContent = translations[language].copied; } catch (_) { field.focus(); field.select(); status.textContent = translations[language].copyFallback; } });
  render();
})();
