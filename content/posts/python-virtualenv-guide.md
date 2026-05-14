Title: Python 虚拟环境完全指南
Date: 2026-05-14 14:00
Modified: 2026-05-14 14:00
Category: 技术
Tags: python, 虚拟环境, venv, pip
Slug: python-virtualenv-guide
Authors: Your Name
Summary: 详细介绍 Python 虚拟环境的原理、用法和最佳实践，帮助初学者理解为什么需要使用虚拟环境以及如何正确使用。

## 什么是虚拟环境？

Python 虚拟环境是一个独立的 Python 运行环境，它拥有自己的 Python 解释器、
库和脚本。每个虚拟环境都是相互隔离的，这意味着你可以在不同项目中使用
不同版本的库而不会产生冲突。

## 为什么需要虚拟环境？

### 场景举例

假设你有两个项目：

- 项目 A 使用 Django 4.2
- 项目 B 使用 Django 5.0

如果没有虚拟环境，你只能在系统级别安装一个版本的 Django，这会导致
其中一个项目无法运行。

### 主要优势

1. **依赖隔离** — 每个项目拥有独立的依赖
2. **版本控制** — 可以精确记录项目依赖版本
3. **系统干净** — 不会污染系统的 Python 环境
4. **可复现** — 通过 `requirements.txt` 可以精确复现环境

## 基本用法

### 创建虚拟环境

```bash
# Python 3.3+ 内置 venv 模块
python -m venv .venv
```

### 激活虚拟环境

```bash
# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```

### 安装依赖

```bash
pip install requests flask django
pip freeze > requirements.txt
```

## 最佳实践

1. **始终使用虚拟环境** — 即使是最小的项目
2. **命名约定** — 通常命名为 `.venv` 或 `venv`
3. **加入 .gitignore** — 不要将虚拟环境提交到版本控制
4. **使用 requirements.txt** — 记录依赖版本
