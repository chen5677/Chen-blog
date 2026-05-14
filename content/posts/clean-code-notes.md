Title: 《代码整洁之道》读书笔记：写出人类能读懂的代码
Date: 2026-05-14 16:00
Modified: 2026-05-14 16:00
Category: 笔记
Tags: 读书笔记, 代码质量, clean-code, 重构
Slug: clean-code-notes
Authors: chen5677
Summary: 系统整理 Robert C. Martin《Clean Code》的核心观点，结合 Python 代码实例，从命名、函数设计、注释哲学到错误处理，探讨如何写出可维护的高质量代码。

> 代码是写给人看的，顺便能在机器上运行。—— Harold Abelson

这句话道出了软件工程的核心矛盾：我们写的代码，**读的次数远多于写的次数**。据统计，开发者花在阅读代码上的时间是编写代码的 10 倍。因此，代码的可读性直接决定了项目的维护成本。

## 一、有意义的命名

命名是编程中最难的事情之一。好的命名应该回答三个问题：**它是什么？它做什么？怎么用它？**

### 反面教材 vs 好的命名

```python
# 糟糕的命名
def calc(d, r):
    return d * r * 0.01

# 好的命名
def calculate_discount(price: float, discount_rate: float) -> float:
    """计算折扣后的减免金额"""
    return price * discount_rate * 0.01
```

```python
# 糟糕：需要注释来解释含义
d = 7  # elapsed time in days

# 好的：名字本身就是文档
elapsed_days = 7
max_retry_count = 3
is_authenticated = True
```

### 命名规则总结

| 类型 | 规则 | 好的示例 | 差的示例 |
|:-----|:-----|:---------|:---------|
| 变量 | 名词，表达含义 | `user_count` | `n`, `temp` |
| 函数 | 动词开头，表达行为 | `fetch_user()` | `data()` |
| 布尔值 | is/has/can 前缀 | `is_valid` | `flag` |
| 常量 | 全大写+下划线 | `MAX_CONNECTIONS` | `max` |
| 类名 | 名词，PascalCase | `HttpClient` | `Manager` |

### 避免误导

```python
# 误导：变量名暗示是列表，实际是集合
account_list = set()  # 应该叫 accounts 或 account_set

# 误导：两个名字太相似
XYZControllerForEfficientHandlingOfStrings
XYZControllerForEfficientStorageOfStrings
```

## 二、函数设计原则

### 原则 1：短小

Uncle Bob 的建议是函数不超过 20 行，理想情况 5-10 行。每个函数只做**一件事**，做好这件事，只做这件事。

```python
# 糟糕：一个函数做了太多事情
def process_order(order):
    # 验证订单
    if not order.items:
        raise ValueError("订单不能为空")
    if order.total < 0:
        raise ValueError("金额异常")
    # 计算折扣
    discount = 0
    if order.coupon:
        discount = order.total * order.coupon.rate
    # 扣减库存
    for item in order.items:
        item.product.stock -= item.quantity
    # 发送通知
    send_email(order.user.email, "订单已创建")
    send_sms(order.user.phone, "订单已创建")
    # 保存数据库
    db.session.add(order)
    db.session.commit()
```

```python
# 好的：拆分为职责单一的小函数
def process_order(order):
    validate_order(order)
    discount = calculate_discount(order)
    deduct_inventory(order)
    notify_user(order)
    save_order(order, discount)

def validate_order(order):
    if not order.items:
        raise ValueError("订单不能为空")
    if order.total < 0:
        raise ValueError("金额异常")

def calculate_discount(order) -> float:
    if not order.coupon:
        return 0.0
    return order.total * order.coupon.rate
```

### 原则 2：参数越少越好

```python
# 差：参数过多，调用时容易混淆位置
def create_user(name, email, age, role, department, is_active):
    ...

# 好：使用数据类封装相关参数
@dataclass
class UserCreateRequest:
    name: str
    email: str
    age: int
    role: str = "member"
    department: str = ""
    is_active: bool = True

def create_user(request: UserCreateRequest):
    ...
```

### 原则 3：无副作用

函数应该**做它名字承诺的事**，不做任何额外操作：

```python
# 有隐藏副作用：check_password 居然会初始化 session
def check_password(username: str, password: str) -> bool:
    user = User.find_by_name(username)
    if user and user.verify_password(password):
        Session.initialize()  # 副作用！调用者不知道会发生这个
        return True
    return False

# 好的：函数只做名字说的事
def check_password(username: str, password: str) -> bool:
    user = User.find_by_name(username)
    return user is not None and user.verify_password(password)
```

## 三、注释的哲学

### 核心观点：注释是对代码表达力不足的补偿

好代码应该是**自解释**的。如果你需要写注释来解释代码在做什么，首先考虑能否通过重命名或重构让代码自己说话。

### 好的注释

```python
# 法律信息
# Copyright (c) 2026 Chen5677. MIT License.

# 解释"为什么"而非"是什么"
# 使用 sleep 是因为第三方 API 有速率限制（5次/秒）
time.sleep(0.2)

# TODO 标记
# TODO: 数据库连接池满时需要排队机制

# 警示
# WARNING: 这个正则在超长字符串上可能触发 ReDoS
pattern = re.compile(r"(a+)+$")
```

### 坏的注释

```python
# 多余：代码已经很清楚了
i += 1  # i 自增 1

# 过时：代码改了注释没改
# 返回用户年龄
def get_user_name(user_id):  # 实际返回的是名字
    ...

# 注释掉的代码：直接删除，Git 会记住历史
# old_price = calculate_legacy_price(item)
# if old_price > threshold:
#     apply_discount(old_price)
```

## 四、错误处理

### 使用异常而非返回码

```python
# 差：返回特殊值表示错误
def find_user(user_id):
    user = db.query(User).get(user_id)
    if user is None:
        return -1  # 调用者容易忽略这个返回值
    return user

# 好：找不到就抛异常，语义明确
def find_user(user_id: int) -> User:
    user = db.query(User).get(user_id)
    if user is None:
        raise UserNotFoundError(f"用户 {user_id} 不存在")
    return user
```

### 不要返回 None（在可能被误用的场景）

```python
# 危险：调用者容易忘记检查 None
def get_discount_rate(user) -> float | None:
    if user.is_vip:
        return 0.2
    return None  # 后续 price * get_discount_rate(user) 会炸

# 更安全：返回默认值或使用 Optional 并强制处理
def get_discount_rate(user) -> float:
    return 0.2 if user.is_vip else 0.0
```

## 五、实践中的取舍

Clean Code 的原则不是教条。在实际项目中需要根据上下文做取舍：

### 什么时候"脏"一点也可以

- **原型验证阶段**：快速验证想法比代码质量重要
- **一次性脚本**：只运行一次的数据迁移脚本
- **性能热点**：极少数场景下可读性需要为性能让步

### 重构的时机

书中提出的**童子军军规**非常实用：

> 让代码比你发现它时更干净一点。

不需要一次性重构整个项目。每次修改代码时，顺手改善一个命名、拆分一个过长的函数、删除一段无用注释——积少成多，代码质量会持续提升。

## 六、个人实践清单

读完这本书后，我给自己定了几条规则：

1. **命名花 5 秒钟思考**：写下变量名前，问自己"别人能看懂吗？"
2. **函数超过 15 行就审视**：是否可以拆分？是否做了多件事？
3. **写注释前先重构**：能通过改名或拆分消除的注释就不写
4. **提交前 review 自己的 diff**：用阅读者的视角审视改动
5. **每次 PR 至少改善一个坏味道**：践行童子军军规

## 推荐阅读

- 《代码整洁之道》（Clean Code）— Robert C. Martin
- 《重构：改善既有代码的设计》— Martin Fowler
- 《程序员修炼之道》— Andrew Hunt & David Thomas

这三本书构成了"代码质量三部曲"，建议按顺序阅读。Clean Code 讲原则，Refactoring 讲手法，Pragmatic Programmer 讲心态。
