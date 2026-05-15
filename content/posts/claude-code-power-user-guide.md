Title: Claude Code 高手进阶：Sub-Agent、Hooks 与 15 个提效技巧
Date: 2026-05-15 18:00
Modified: 2026-05-15 18:00
Category: 技术
Tags: claude, AI, 开发工具, 效率提升, 工具链
Slug: claude-code-power-user-guide
Authors: chen5677
Summary: 继上篇源码分析后，本文从实战角度系统梳理 Claude Code 的 15 个核心功能——从日常高频的快捷键、Memory 系统，到进阶的 Sub-Agent 并行、Hooks 自动化、定时任务，助你把这把"瑞士军刀"用到极致。

> 上篇[源码分析](/posts/2026/05/claude-code-internals/)讲的是 Claude Code "怎么工作的"，这篇讲"怎么用好它"。

用好一个工具的关键，不是记住所有功能，而是**知道什么场景下该掏哪个功能**。本文按使用频率和难度，把 Claude Code 的核心功能分为四层：日常必备、进阶提效、高级定制、专家玩法。

## 一、日常必备（每天都会用到）

### 1.1 权限模式切换（Shift+Tab）

这是使用频率最高的快捷键。按 `Shift+Tab` 在四种模式间循环：

| 模式 | 行为 | 典型场景 |
|------|------|---------|
| **default** | 读文件自由；编辑和命令需审批 | 日常开发，每步都看一眼 |
| **acceptEdits** | 编辑自动批准；命令仍需审批 | 信任编辑，但要审命令 |
| **plan** | 纯只读，不能修改任何东西 | 调研、看代码、设计方案 |
| **bypass** | 全部放行 | 隔离环境或高度信任时 |

**实际用法：** 接手一个新项目时，先切到 **plan** 模式让 Claude 读代码给方案；确认方案后切回 **default** 执行。这样既安全又高效。

### 1.2 细粒度权限配置

如果你频繁批准同一类命令（比如 `npm test`），与其每次都点"允许"，不如写进配置：

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git diff *)",
      "Bash(git status)"
    ],
    "deny": [
      "Bash(curl *)",
      "Bash(rm -rf *)",
      "Read(./.env)",
      "Read(./secrets/**)"
    ]
  }
}
```

规则优先级是 **deny > allow > 默认询问**，首个匹配即生效。建议把 `deny` 用在安全边界上（环境变量、密钥文件），`allow` 用在重复性操作上。

### 1.3 常用快捷键速查

| 快捷键 | 功能 |
|--------|------|
| `Ctrl+C` | 取消当前生成 |
| `Ctrl+D` | 退出会话 |
| `Ctrl+R` | 反向搜索历史命令 |
| `Ctrl+B` | 当前命令送入后台运行 |
| `Esc` | 中断正在执行的工具调用 |
| `Esc` ×2 | 回溯到上一条消息重新编辑 |

### 1.4 `/compact` vs `/clear`

这是最容易混淆的两个命令：

- **`/compact`** — 上下文压缩。对话太长、Claude 开始"忘事"时用。它会总结前面的对话，保留关键信息，释放上下文空间。压缩后你能继续当前任务。
- **`/clear`** — 彻底清空。开始一个完全不同的新任务时用。之前的对话全部丢弃。

> 简单判断：当前任务还没做完但对话太长了 → `/compact`；任务做完了开始新任务 → `/clear`。

### 1.5 `/cost` 与 `/doctor`

- **`/cost`** — 查看当前会话的 token 用量和费用估算。
- **`/doctor`** — 诊断安装配置是否有问题。出问题时先跑这个。

---

## 二、进阶提效（用好了事半功倍）

### 2.1 CLAUDE.md：项目的"使用说明书"

这是 Claude Code 最重要的文件。每个会话启动时，`CLAUDE.md` 自动加载到上下文中。它应该写什么？

**应该写的：**
- 构建/测试/lint 的具体命令
- 项目架构决策和不明显的坑
- 导入规范、命名约定
- 关键文件的位置说明

**不该写的：**
- 可以通过工具配置文件表达的内容（ESLint、Prettier 配置已有专门文件）
- 长篇理论性文档（换成外部链接）
- 显而易见的通用实践

**三层优先级（高覆盖低）：**

```
CLAUDE.local.md      → 你的个人偏好（gitignore，不提交）
    ↑
./CLAUDE.md          → 团队共享指令（提交到 git）
    ↑
~/.claude/CLAUDE.md  → 你所有项目的全局偏好
```

如果你还没创建，直接运行 `/init`，Claude 会分析项目自动生成。

### 2.2 Memory 系统：让 Claude 记住你

Claude Code 有一个基于文件的自动记忆系统。它会在对话中判断哪些信息值得跨会话保留，自动存入 `memory/` 目录：

```
~/.claude/projects/<project-hash>/memory/
├── MEMORY.md          # 索引文件（会话启动时自动加载）
├── debugging.md       # 具体主题记忆
└── preferences.md     # 偏好记忆
```

**四种记忆类型：**

| 类型 | 存什么 | 示例 |
|------|--------|------|
| **user** | 你的角色、偏好、知识背景 | "用户是数据科学家，偏好简洁输出" |
| **feedback** | 你纠正或肯定过的行为 | "不要 mock 数据库做测试" |
| **project** | 项目目标、决策原因 | "Auth 模块重构是因为合规要求" |
| **reference** | 外部系统指针 | "Bug 跟踪在 Linear 项目 INGEST" |

你随时可以说"记住 XXX"或"忘掉 XXX"手动控制。用 `/memory` 查看当前记忆。

### 2.3 Sub-Agent：独立上下文的任务分身

这是 Claude Code 最强大的功能之一。子智能体在**独立上下文窗口**中运行，执行完只把压缩结果返回主会话——不会撑爆你的上下文。

**内置类型：**

| 类型 | 用途 | 工具权限 |
|------|------|---------|
| **Explore** | 大规模代码搜索和分析 | 只读 |
| **Plan** | 架构调研和方案设计 | 只读 |
| **General-purpose** | 通用任务 | 可自定义 |

**什么时候该用 Sub-Agent？**
- 需要同时研究多个独立问题（并行分派）
- 搜索结果量大，不想污染主会话
- 需要隔离权限的操作

**什么时候不该用？** 简单单文件编辑——启动子代理的开销大于直接改。

**自定义子代理** — 在 `.claude/agents/` 目录创建 `.md` 文件：

```markdown
---
name: code-reviewer
description: 代码审查专家。当用户提到"审查"、"review"、"检查代码"时自动调用。
model: sonnet
tools: Read, Grep, Glob
---

你是一个资深代码审查专家。审查时关注：
1. 逻辑错误和边界情况
2. 安全漏洞（SQL 注入、XSS、敏感信息泄露）
3. 项目编码规范一致性
4. 性能明显劣化的写法

审查完成后给出分级结论：🔴 必须修改 / 🟡 建议优化 / 🟢 通过。
```

配置完成后，当你在对话中说"帮我审查一下这段代码"，Claude 会自动启动这个子代理。

### 2.4 `!` 前缀与 `@` 文件引用

两个微操但高频的技巧：

- **`!` 前缀** — 直接在当前 shell 执行命令，输出自动注入对话上下文。比如 `! npm test` 的结果 Claude 能直接看到并分析。
- **`@` 文件引用** — 输入 `@` 触发文件路径模糊匹配，快速引用项目文件。比手动敲路径快得多。

### 2.5 Background Tasks：不用干等的后台任务

长任务（测试套件、构建、大量搜索）可以扔到后台：

- 直接在对话中说"在后台运行测试"
- 或者在 `!` 命令运行时按 `Ctrl+B`
- 用 `/tasks` 查看所有后台任务状态

后台任务跑完后会自动通知你。这样主会话可以继续干别的事。

---

## 三、高级定制（打造你的专属工作流）

### 3.1 Hooks：事件驱动的自动化

Hooks 是 Claude Code 的"自动化引擎"——在特定事件发生时自动触发 shell 脚本。配置在 `.claude/settings.json`。

**核心事件：**

| 事件 | 触发时机 | 最常用途 |
|------|---------|---------|
| `PostToolUse` | 工具调用成功后 | 自动运行 linter/formatter |
| `PreToolUse` | 工具调用前 | 拦截危险命令 |
| `UserPromptSubmit` | 用户提交消息前 | 注入额外上下文 |
| `PreCompact` | 上下文压缩前 | 保存关键信息 |
| `SessionStart` | 会话开始时 | 环境初始化 |
| `FileChanged` | 文件被外部修改 | 同步状态 |

**实战案例 1：每次写文件后自动格式化**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "npx eslint --fix \"$CLAUDE_FILE_PATH\" 2>/dev/null || true",
        "timeout": 30
      }
    ]
  }
}
```

**实战案例 2：拦截危险的 Git 操作**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "echo \"$CLAUDE_TOOL_INPUT\" | grep -qE 'git (push --force|reset --hard)' && exit 2 || exit 0"
      }
    ]
  }
}
```

> 退出码说明：`0` = 放行；`1` = 警告但放行；`2` = **阻塞操作**，不允许执行。

**实战案例 3：压缩前保存调试上下文**

当对话快满触发压缩时，`PreCompact` 钩子可以把当前的关键信息（如 bug 复现步骤、错误日志）写入临时文件，防止丢失。

### 3.2 Skills：自动匹配的可复用工作流

Skills 和 Commands 都用于封装工作流，但触发方式不同：

| | Commands | Skills |
|------|---------|--------|
| **触发方式** | 手动输入 `/命令名` | 根据对话内容**自动匹配** |
| **结构** | 单个 `.md` 文件 | 文件夹 + `SKILL.md` + 辅助文件 |
| **适用场景** | 固定流程的手动操作 | 需要 AI 判断时机的自动化 |

**Skill 定义示例**（`.claude/skills/deploy/SKILL.md`）：

```yaml
---
name: deploy
description: 部署到 staging 或 production。当用户提到"部署"、"上线"、"发布"时自动激活。
argument-hint: [staging|production]
allowed-tools: Read, Bash, Grep
---

## 部署流程

目标环境: $ARGUMENTS（默认 staging）

### 第一步：部署前检查
!`npm run lint && npm test && npm run build`

任何检查失败立即停止，不要部署有问题的代码。

### 第二步：执行部署
根据目标环境执行对应的部署命令……
```

创建后，当你对 Claude 说"帮我部署到 staging"，Skill 自动激活。

### 3.3 自定义 Slash Commands

在 `.claude/commands/` 下创建 `.md` 文件即可定义新命令：

```markdown
<!-- .claude/commands/weekly-report.md -->
你是周报助手。基于最近的 git 提交记录生成周报。

1. `git log --since="7 days ago" --oneline --no-merges`
2. 按功能模块分类整理
3. 输出格式：
   - 本周完成
   - 进行中
   - 下周计划
```

之后直接输入 `/weekly-report` 即可使用。

---

## 四、专家玩法（把 Claude Code 当基础设施用）

### 4.1 `/loop` 与 `/schedule`：定时自动化

| | `/loop` | `/schedule` |
|------|---------|------------|
| **持久性** | 会话级（关闭终端即失效） | 系统级（跨会话持久化） |
| **配置方式** | 自然语言 | Cron 表达式 |
| **典型间隔** | 分钟 ~ 天 | 精确时间点 |

**`/loop` 示例：**

```
/loop 30m 运行测试套件，如果有失败就告诉我
/loop 2h 检查 main 分支是否有新的合并冲突
```

**`/schedule` 适合的场景：**
- 每天早上 9 点检查依赖是否有安全漏洞
- 每周五下午生成代码健康度报告
- CI 失败时自动通知你排查

### 4.2 Worktree 隔离：安全的并行实验

Claude Code 深度集成了 Git Worktree。当需要同时开发多个独立功能、或者想安全地实验破坏性改动时，Worktree 提供物理隔离的文件系统：

- CLI 启动：`claude -w feature-branch`
- 搭配 tmux：`claude -w feature-branch --tmux`
- 子代理中配置 `isolation: worktree` 实现完全隔离运行

每个 worktree 有独立的工作目录，互不影响。实验失败直接删掉 worktree，主分支毫发无伤。

### 4.3 Agent Teams：多智能体协作

当任务特别复杂时，可以把主 Agent 作为"项目经理"，派发子任务给多个专业子代理并行执行：

```
                          ┌── 子Agent: 审查后端代码 ──┐
                          │                          │
主Agent（项目经理）────────┼── 子Agent: 审查前端代码 ──┼── 汇总 → 统一报告
                          │                          │
                          └── 子Agent: 检查测试覆盖 ──┘
```

每个子代理跑在自己的 worktree 中，有独立的上下文和权限范围。主 Agent 只收最终结果，不被中间过程撑爆上下文。

### 4.4 组合策略：从入门到专家

```
第 1 层（新手）   CLAUDE.md + /init + /compact + 权限模式
第 2 层（熟练）   + Memory + Sub-Agent + Background Tasks
第 3 层（高级）   + Hooks + Skills + 自定义 Commands + 细粒度权限
第 4 层（专家）   + Agent Teams + Worktree + /schedule + 自动记忆
```

不用一次全部掌握。建议用熟一层再进下一层，每个阶段的收益都是实实在在的。

---

## 五、总结

| 功能 | 一句话 | 优先级 |
|------|--------|--------|
| 权限模式 | `Shift+Tab` 切换，默认用 default | ★★★★★ |
| CLAUDE.md | 项目的"说明书"，`/init` 自动生成 | ★★★★★ |
| `/compact` | 对话太长时压缩上下文，保留状态 | ★★★★ |
| Memory 系统 | 自动记住偏好，`/memory` 查看 | ★★★★ |
| Sub-Agent | 独立上下文并行跑，不撑爆主会话 | ★★★★ |
| `!` 前缀 / `@` 引用 | 两个微操，高频使用 | ★★★★ |
| Background Tasks | 长任务扔后台，不阻塞主会话 | ★★★ |
| Hooks | 事件驱动自动化，拦截危险操作 | ★★★ |
| Skills | 自动匹配工作流，用了就回不去 | ★★★ |
| `/loop` `/schedule` | 定时检查、定时报告 | ★★ |
| Worktree | 物理隔离的并行实验空间 | ★★ |
| Agent Teams | 多 Agent 协作，解决复杂任务 | ★ |

工具的价值不在于功能多少，而在于你在正确的时候掏出正确的那个。希望这篇指南能帮你做到这一点。

---

*本文中提到的功能基于 Claude Code 2026 年 5 月版本。Claude Code 更新频繁，部分功能细节可能有变化。*
