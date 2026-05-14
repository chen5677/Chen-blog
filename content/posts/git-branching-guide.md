Title: Git 分支管理与协作实战
Date: 2026-05-14 18:00
Modified: 2026-05-14 19:00
Category: 技术
Tags: git, 版本控制, 分支管理, 协作开发
Slug: git-branching-guide
Authors: chen5677
Summary: 从手绘分支图到实战理解——本文系统梳理 Git 的核心工作流、分支操作与远程协作，涵盖日常开发中最常用的场景和避坑指南。

> 版本控制是软件工程的基石。无论是单人开发还是团队协作，掌握 Git 都是一项必备技能。

## 一、版本控制的演进：从 SVN 到 Git

### 集中式版本控制（SVN）

SVN 采用**集中式**架构，所有版本数据存储在中央服务器上，开发者从中央服务器获取最新版本，修改后再提交回服务器。

**缺点：** 如果中央服务器宕机或网络不可用，无法提交新版本，也无法查看历史版本。本质上是一个"单点故障"模型。

### 分布式版本控制（Git）

Git 采用**分布式**架构，每台电脑上都有一份完整的版本库，包含完整的项目历史和分支信息。

**优点：**
- **离线可用：** 没有网络也能进行版本控制（本地提交）
- **数据安全：** 每个客户端都备份了完整的项目历史
- **安全性更高：** 每次提交都通过 SHA-1 哈希校验，内容不可篡改

## 二、Git 的核心工作流

Git 的本地工作流可以分为三个区域：

```
+---------------+   git add   +-----------+   git commit  +--------------+
|  Working Dir  | ----------> |   Index   | ------------> |  Repository  |
|    (工作区)   |             |  (暂存区)  |               |  (本地仓库)  |
+---------------+             +-----------+               +--------------+
                                                                 |
                                                                 | git push
                                                                 v
                                                          +--------------+
                                                          |    Remote    |
                                                          |  (远程仓库)   |
                                                          +--------------+
```

三个区域的转换是 Git 最核心的操作模式：

- `git add .` — 将工作区的修改添加到暂存区
- `git commit -m "msg"` — 将暂存区的快照提交到本地仓库
- `git push` — 将本地仓库的提交推送到远程仓库
- `git pull` — 从远程仓库拉取最新代码
- `git rm --cached <file>` — 将文件从暂存区移除（不再跟踪）

## 三、本地仓库操作速查

### 初始化与配置

```bash
# 初始化一个新仓库
git init

# 配置用户签名（首次使用必须设置）
git config --global user.name "你的名字"
git config --global user.email "your@email.com"

# 查看配置
git config user.name
git config user.email
```

> `--global` 表示全局配置，会影响当前用户的所有 Git 仓库。也可以不加 `--global` 为单个仓库设置独立身份。

### 日常操作

```bash
# 查看仓库状态（最常用的命令之一）
git status

# 添加所有修改到暂存区
git add .

# 提交到本地仓库
git commit -m "feat: 添加用户登录功能"

# 查看提交历史（详细）
git log

# 查看所有历史操作（包括已删除的提交记录）
git reflog
```

### 版本回退

```bash
# 先查看历史版本
git reflog
# 输出示例：
# a1b2c3d (HEAD -> main) HEAD@{0}: commit: feat: 添加登录功能
# e4f5a6b HEAD@{1}: commit: fix: 修复注册页样式
# c7d8e9f HEAD@{2}: commit (initial): init: 项目初始化

# 回退到指定版本
git reset --hard e4f5a6b
```

> `git reflog` 是 Git 的"后悔药"，记录了所有 HEAD 指针的移动历史。即使回退错了，也能通过它找到原来的版本号恢复。

## 四、分支管理：从手绘图到实战

### 分支的本质

Git 的分支本质上是一个**指向提交对象的指针**。创建新分支就是创建一个新的指针，而不是复制一份文件。

```
main:             o---o---o---o---o
                       \       \
feature/login:          o---o   \
                                 \
feature/payment:                  o---o---o
```

### 分支基本操作

```bash
# 查看所有分支（当前分支前有 * 标记）
git branch

# 创建新分支（基于当前所在的提交节点）
git branch feature/login

# 切换分支（切换前必须把当前分支的修改提交到仓库）
git checkout feature/login

# 创建并切换到新分支（一步完成）
git checkout -b feature/login

# 删除分支
git branch -d feature/login

# 强制删除（分支有未合并的修改时使用）
git branch -D feature/login
```

### 分支合并

```bash
# 先切换到目标分支（比如 main）
git checkout main

# 合并源分支（比如 feature/login）
git merge feature/login
```

合并发生时，Git 会按照以下逻辑自动处理：

**Fast-forward 合并**（main 没有新提交时）：

```
Before:
    main:            o---o---o
                              \
    feature/login:             o---o---o

After:
    main:            o---o---o---o---o---o
```

**三方合并**（两个分支都有独立提交时），Git 会创建一个新的合并提交：

```
Before:
    main:            o---o---o---A---B
                              \
    feature/login:             o---C---D

After:
    main:            o---o---o---A---B---M (merge commit)
                              \         /
    feature/login:             o---C---D
```

### 合并冲突

当两个分支**修改了同一个文件的同一部分**时，Git 无法自动决定保留谁的修改，就会产生冲突。

```bash
# 合并时产生冲突，Git 会提示：
# Auto-merging src/index.js
# CONFLICT (content): Merge conflict in src/index.js
# Automatic merge failed; fix conflicts and then commit the result.

# 查看冲突文件
git status
```

冲突文件内容示例如下：

```javascript
<<<<<<< HEAD
console.log("登录成功");
=======
console.log("欢迎回来，" + username);
>>>>>>> feature/login
```

**解决步骤：**

1. 打开冲突文件，手动编辑保留需要的代码
2. 删除 `<<<<<<<`、`=======`、`>>>>>>>` 标记行
3. `git add` 标记为已解决
4. `git commit` 完成合并

```bash
# 手动编辑解决冲突后
git add src/index.js
git commit -m "fix: 解决登录提示冲突"
```

## 五、远程仓库协作

### 关联远程仓库

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/仓库名.git

# 查看远程仓库列表
git remote -v
```

### 推送与拉取

```bash
# 推送本地分支到远程（-u 建立追踪关系）
git push -u origin main

# 强制推送（覆盖远程历史，谨慎使用！）
git push -f origin main

# 拉取远程更新（推荐，相当于 fetch + merge）
git pull origin main

# 当远程和本地没有共同祖先时（如不同仓库合并）
git pull origin main --allow-unrelated-histories
```

### 克隆仓库

```bash
# HTTPS 方式（需要验证账号密码）
git clone https://github.com/用户名/仓库名.git

# SSH 方式（配置密钥后无需密码）
git clone git@github.com:用户名/仓库名.git
```

### 基于远程分支创建本地分支

```bash
# 从远程分支创建本地分支并切换
git checkout -b daily/0.0.3 origin/daily/0.0.2
```

> 这种操作在团队协作中非常常见：远程已有某个功能分支，本地需要拉取并在此基础上开发。

## 六、配置 SSH 密钥

SSH 方式比 HTTPS 更方便，配置一次后推送代码无需重复输入密码。

```bash
# 1. 生成密钥（使用 ed25519 算法，更安全高效）
ssh-keygen -t ed25519 -C "your@email.com"

# 2. 查看公钥
cat ~/.ssh/id_ed25519.pub
# 输出类似：ssh-ed25519 AAAAC3... your@email.com

# 3. 复制公钥，添加到 GitHub/Gitee 的 SSH Keys 设置中

# 4. 测试连接
ssh -T git@github.com
# 成功会显示：Hi username! You've successfully authenticated.

# 5. 克隆仓库
git clone git@github.com:用户名/仓库名.git
```

## 七、团队协作最佳实践

### 分支命名规范

- **功能分支：** `feature/功能名称`，如 `feature/user-login`
- **修复分支：** `fix/问题描述`，如 `fix/login-timeout`
- **发布分支：** `release/版本号`，如 `release/1.2.0`
- **日常分支：** `daily/版本号`，如 `daily/0.0.3`

### 提交信息规范（Conventional Commits）

- `feat` — 新功能
- `fix` — 修复 bug
- `docs` — 文档更新
- `style` — 代码格式调整
- `refactor` — 代码重构
- `test` — 测试相关
- `chore` — 构建/工具变动

### 常用工作流

```bash
# 1. 拉取最新代码
git checkout main
git pull origin main

# 2. 创建功能分支
git checkout -b feature/user-login

# 3. 开发过程中多次提交
git add .
git commit -m "feat: 添加登录表单"
git add .
git commit -m "feat: 添加表单验证"

# 4. 合并前先同步 main
git checkout main
git pull origin main
git checkout feature/user-login
git merge main

# 5. 提交 PR/MR 请求合并到 main

# 6. 合入后删除本地分支
git branch -d feature/user-login
```

## 八、VS Code 配置

如果使用 VS Code 开发，推荐以下配置：

```json
{
  "git.path": "D:/Program Files/Git/mingw64/bin/git.exe",
  "editor.renameOnType": true
}
```

配合 **GitLens** 插件，可以在 VS Code 中直观地看到每行代码的最后修改时间、作者和提交信息，极大提升效率。

---

## 总结

Git 的核心思想其实很简单：

1. **本地三步走：** 工作区 → 暂存区 → 本地仓库
2. **分支即指针：** 创建和切换分支的成本极低，鼓励多建分支
3. **冲突不可怕：** 冲突是正常的协作现象，手动解决后提交即可
4. **远程同步：** push / pull / clone 三种操作覆盖所有远程场景

掌握以上内容，日常开发和团队协作基本够用了。建议在本地多建几个仓库、多试试分支操作，动手实践是最好的学习方式。
