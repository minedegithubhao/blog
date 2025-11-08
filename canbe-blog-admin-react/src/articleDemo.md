# MySQL中int和int unsigned数据类型的区别详解

在MySQL数据库设计中，正确选择数据类型对于数据库性能和存储效率至关重要。本文将详细介绍int和int unsigned这两种数据类型的区别及其使用场景。

## 问题现象

在创建或查看MySQL表结构时，你可能会注意到字段定义中存在以下两种形式：

```sql
age int
age int unsigned
```

这两种定义有什么区别？在什么情况下应该使用int unsigned？

## 基本概念

### int数据类型

int是MySQL中的整数类型，用于存储整数值。它是一个有符号整数类型，可以存储正数、负数和零。

### int unsigned数据类型

int unsigned是在int基础上添加unsigned修饰符的数据类型，用于存储无符号整数，只能存储零和正数，不能表示负数。

## 存储范围对比

MySQL中，int类型（无论有符号还是无符号）都占用4个字节（32位）的存储空间，但它们的取值范围不同：

| 数据类型 | 存储空间 | 取值范围 | 说明 |
|---------|---------|---------|------|
| int | 4字节 | -2147483648 到 2147483647 | 有符号整数 |
| int unsigned | 4字节 | 0 到 4294967295 | 无符号整数 |

**关键差异：**
- **int（有符号）**：取值范围是 -2^31 到 2^31-1，即 -2147483648 到 2147483647
- **int unsigned（无符号）**：取值范围是 0 到 2^32-1，即 0 到 4294967295

## 实际应用示例

### 创建表时使用示例

在创建表时，可以根据业务需求选择合适的数据类型：

```sql
-- 创建一个用户表
CREATE TABLE users (
    id int unsigned PRIMARY KEY AUTO_INCREMENT,  -- 用户ID，无符号整数，作为主键并自增
    age int unsigned NOT NULL,                   -- 年龄，无符号整数，不允许为空
    score int,                                   -- 分数，有符号整数（可能为负）
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);
```

### 插入数据示例

```sql
-- 正常插入数据
INSERT INTO users (age, score) VALUES (25, 95);
INSERT INTO users (age, score) VALUES (30, -10);  -- age字段不能为负数，会报错

-- 正确的插入方式
INSERT INTO users (age, score) VALUES (30, -10);  -- 只有score为负数是可以的
```

## 运算规则和注意事项

### 运算规则

对int unsigned类型的字段进行运算时，结果也会是unsigned类型：

```sql
-- 假设有一个int unsigned字段
SELECT CAST(1 AS UNSIGNED) - CAST(2 AS UNSIGNED);
-- 结果不是-1，而是4294967295（无符号整数溢出）
```

### 与有符号整数混合运算

当int unsigned和int（有符号整数）在表达式中混合运算时，MySQL会将int隐式转换为int unsigned：

```sql
-- 混合运算示例
SELECT CAST(-1 AS SIGNED) > CAST(1 AS UNSIGNED);
-- 结果为1（true），因为-1被转换为4294967295
```

### 排序规则

在对int unsigned类型的字段进行排序时，其规则基于无符号整数的值，从最小值（0）到最大值进行升序排列：

```sql
-- 创建测试表
CREATE TABLE test_numbers (
    num int unsigned
);

-- 插入测试数据
INSERT INTO test_numbers VALUES (0), (1), (100), (4294967295);

-- 排序查询
SELECT * FROM test_numbers ORDER BY num ASC;
-- 结果：0, 1, 100, 4294967295
```

## 使用场景建议

### 适合使用int unsigned的场景

1. **自增主键ID**：通常从1开始递增，不会出现负数
2. **年龄字段**：人的年龄不可能为负数
3. **数量、计数字段**：商品数量、访问次数等
4. **状态码字段**：各种状态标识通常为非负数
5. **时间戳相关**：Unix时间戳等非负数值

### 适合使用int的场景

1. **温度等可能为负的数值**：温度、海拔等
2. **财务相关字段**：可能需要表示正负金额
3. **坐标位置**：经纬度等可能为负的数值
4. **评分系统**：支持负分的评分机制

## 常见问题FAQ

### 1. 什么时候应该使用int unsigned？

当你确定该字段永远不会存储负数时，应该使用int unsigned。这样可以充分利用存储空间，并在语义上更准确地表达字段含义。

### 2. 使用int unsigned会带来什么风险？

主要风险是溢出问题。如果数值超出范围，会发生溢出而不是报错，可能导致数据错误。

### 3. int unsigned和int在性能上有区别吗？

在存储空间和查询性能上基本没有区别，因为它们都占用4个字节。但在某些运算场景下，int unsigned可能有轻微的性能优势。

### 4. 如何在现有表中修改字段类型？

可以使用ALTER TABLE语句修改字段类型：

```sql
-- 将有符号int改为无符号int
ALTER TABLE users MODIFY age int unsigned NOT NULL;

-- 将无符号int改为有符号int
ALTER TABLE users MODIFY age int NOT NULL;
```

## 最佳实践建议

1. **根据业务语义选择**：根据字段的实际业务含义选择合适的数据类型
2. **考虑取值范围**：确保选择的数据类型能够满足业务需求的最大值
3. **注意运算溢出**：在进行数学运算时要注意可能的溢出问题
4. **保持一致性**：在同一项目中保持数据类型使用的一致性
5. **文档化设计决策**：记录为什么选择特定的数据类型，便于后续维护

## 总结

int和int unsigned是MySQL中常用的两种整数类型，它们的主要区别在于是否支持负数以及取值范围：

- **int**：支持负数，取值范围 -2147483648 到 2147483647
- **int unsigned**：不支持负数，取值范围 0 到 4294967295

选择哪种类型应该基于业务需求：
- 当字段明确不会出现负数时，推荐使用int unsigned
- 当字段可能需要存储负数时，必须使用int

正确选择数据类型不仅能提高存储效率，还能在语义上更准确地表达业务含义，有助于数据库设计的规范性和可维护性。