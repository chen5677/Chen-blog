Title: 用 Pelican 搭建个人技术博客：从零到部署
Date: 2026-05-14 12:00
Modified: 2026-05-14 12:00
Category: 技术
Tags: python, pelican, 博客搭建, github-pages
Slug: my-first-post
Authors: chen5677
Summary: 记录使用 Pelican 静态站点生成器搭建个人技术博客的完整过程，包括技术选型思考、环境搭建、主题定制与部署上线。

> 写博客是一种对抗遗忘的方式。把零散的知识整理成文章，既是给未来的自己留一份参考，也是与他人分享的桥梁。

## 为什么要写技术博客

作为开发者，我们每天都在学习新技术、解决新问题。但如果只停留在"看懂了"的阶段，知识的留存率其实很低。研究表明，通过**费曼学习法**——用自己的话把概念解释出来——能显著加深理解。

写博客就是费曼学习法的绝佳实践：

- **强迫你理清思路**：写不出来的地方，往往就是理解模糊的地方
- **形成知识积累**：半年后遇到类似问题，翻自己的文章比搜索引擎靠谱
- **建立技术影响力**：长期坚持输出，是最好的个人品牌建设

## 技术选型：为什么是 Pelican

在静态站点生成器的选择上，我对比了几个主流方案：

| 生成器 | 语言 | 特点 | 适合场景 |
|:-------|:-----|:-----|:---------|
| Hugo | Go | 速度极快，模板语法独特 | 大型站点 |
| Hexo | Node.js | 生态丰富，中文社区活跃 | 个人博客 |
| Jekyll | Ruby | GitHub 原生支持 | 简单博客 |
| **Pelican** | **Python** | **Python 生态，灵活可扩展** | **技术博客** |

最终选择 Pelican 的理由：

1. **Python 原生**：作为 Python 开发者，不需要额外安装 Node.js 或 Ruby 环境
2. **Markdown + reStructuredText**：支持多种标记语言
3. **插件系统成熟**：sitemap、SEO、代码高亮等插件一应俱全
4. **Jinja2 模板**：修改主题非常直观，和 Flask 一脉相承

## 搭建过程

### 环境准备

```bash
# 创建项目目录
mkdir pelican-blog && cd pelican-blog

# 创建虚拟环境
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 安装 Pelican 及必要依赖
pip install pelican[markdown] pelican-sitemap
```

### 初始化项目

```bash
# 交互式创建项目结构
pelican-quickstart
```

Pelican 会生成以下目录结构：

```
pelican-blog/
├── content/           # 文章目录
│   ├── posts/         # 博客文章（Markdown）
│   ├── pages/         # 独立页面（关于、联系等）
│   └── images/        # 图片资源
├── output/            # 生成的静态文件
├── themes/            # 主题目录
├── pelicanconf.py     # 开发配置
└── publishconf.py     # 发布配置
```

### 写一篇文章

文章使用 Markdown 编写，文件头包含元数据：

```markdown
Title: 文章标题
Date: 2026-05-14 12:00
Category: 技术
Tags: python, tutorial
Slug: article-slug
Summary: 文章摘要

正文内容从这里开始...
```

### 本地预览

```bash
# 生成站点
pelican content

# 启动本地服务器
pelican --listen
# 访问 http://localhost:8000 查看效果
```

## 主题定制

默认主题比较简陋，我选择了 [Flex](https://github.com/alexandrevicenzi/Flex) 主题作为基础，并做了以下定制：

- **Swiss Modernism 设计语言**：使用 IBM Plex Sans + JetBrains Mono 字体组合
- **暗色模式支持**：自动跟随系统设置
- **可折叠侧边栏**：提升阅读时的专注度
- **动漫风格背景**：半透明叠加，增加视觉层次感

主题定制的核心是通过 `CUSTOM_CSS` 覆盖默认样式：

```python
# pelicanconf.py
CUSTOM_CSS = "theme/css/custom.css"
```

## 部署到 GitHub Pages

静态站点最大的优势就是部署简单。GitHub Pages 提供免费托管：

```bash
# 1. 创建 GitHub 仓库
# 2. 构建站点
pelican content -s publishconf.py

# 3. 将 output 目录推送到 gh-pages 分支
ghp-import output -b gh-pages
git push origin gh-pages
```

也可以配置 GitHub Actions 实现推送后自动构建部署，彻底解放双手。

## 写在最后

工具和平台只是载体，持续输出高质量内容才是核心。给自己定一个小目标：**每周至少产出一篇技术文章**，不求长篇大论，但求条理清晰、对他人有参考价值。

这个博客会持续记录我在 Python、Web 开发、工具链等方面的学习和实践。欢迎交流。
