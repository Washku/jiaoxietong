-- 创建轻微交通事故责任划分数据库
CREATE DATABASE IF NOT EXISTS accident_rules;
USE accident_rules;

-- 事故类型表
CREATE TABLE IF NOT EXISTS accident_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE COMMENT '事故类型编码',
    name VARCHAR(100) NOT NULL COMMENT '事故类型名称',
    description TEXT COMMENT '事故类型描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 事故场景表
CREATE TABLE IF NOT EXISTS accident_scenarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_id INT NOT NULL COMMENT '关联事故类型ID',
    code VARCHAR(20) NOT NULL UNIQUE COMMENT '场景编码',
    name VARCHAR(100) NOT NULL COMMENT '场景名称',
    description TEXT COMMENT '场景描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES accident_types(id)
);

-- 责任划分规则表
CREATE TABLE IF NOT EXISTS responsibility_rules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    scenario_id INT NOT NULL COMMENT '关联事故场景ID',
    rule_code VARCHAR(20) NOT NULL UNIQUE COMMENT '规则编码',
    rule_name VARCHAR(100) NOT NULL COMMENT '规则名称',
    description TEXT COMMENT '规则描述',
    party_a_responsibility DECIMAL(5,2) NOT NULL COMMENT '甲方责任比例',
    party_b_responsibility DECIMAL(5,2) NOT NULL COMMENT '乙方责任比例',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (scenario_id) REFERENCES accident_scenarios(id)
);

-- 赔偿项目表
CREATE TABLE IF NOT EXISTS compensation_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE COMMENT '赔偿项目编码',
    name VARCHAR(100) NOT NULL COMMENT '赔偿项目名称',
    description TEXT COMMENT '赔偿项目描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 赔偿标准表
CREATE TABLE IF NOT EXISTS compensation_standards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL COMMENT '关联赔偿项目ID',
    rule_id INT NOT NULL COMMENT '关联责任规则ID',
    standard_amount DECIMAL(10,2) NOT NULL COMMENT '标准赔偿金额',
    description TEXT COMMENT '赔偿标准描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES compensation_items(id),
    FOREIGN KEY (rule_id) REFERENCES responsibility_rules(id)
);

-- 插入常见事故类型数据
INSERT INTO accident_types (code, name, description) VALUES
('A001', '追尾事故', '后车与前车发生碰撞的事故'),
('A002', '变道事故', '车辆在变道过程中发生的事故'),
('A003', '倒车事故', '车辆在倒车过程中发生的事故'),
('A004', '转弯事故', '车辆在转弯过程中发生的事故'),
('A005', '停车事故', '车辆在停车过程中发生的事故'),
('A006', '开门事故', '车辆开门时发生的事故'),
('A007', '超车事故', '车辆在超车过程中发生的事故'),
('A008', '掉头事故', '车辆在掉头过程中发生的事故');

-- 插入事故场景数据
INSERT INTO accident_scenarios (type_id, code, name, description) VALUES
-- 追尾事故场景
(1, 'A001-01', '正常行驶追尾', '前车正常行驶，后车追尾'),
(1, 'A001-02', '前车急刹车追尾', '前车急刹车，后车追尾'),
(1, 'A001-03', '前车倒车追尾', '前车倒车，后车追尾'),

-- 变道事故场景
(2, 'A002-01', '正常变道碰撞', '车辆正常变道时发生碰撞'),
(2, 'A002-02', '强行变道碰撞', '车辆强行变道时发生碰撞'),
(2, 'A002-03', '变道未打转向灯', '变道时未打转向灯发生碰撞'),

-- 倒车事故场景
(3, 'A003-01', '倒车碰撞静止车辆', '倒车时碰撞静止车辆'),
(3, 'A003-02', '倒车碰撞行人', '倒车时碰撞行人'),
(3, 'A003-03', '倒车碰撞障碍物', '倒车时碰撞障碍物');

-- 插入责任划分规则数据
INSERT INTO responsibility_rules (scenario_id, rule_code, rule_name, description, party_a_responsibility, party_b_responsibility) VALUES
-- 追尾事故责任规则
(1, 'R001-01', '后车全责', '后车未保持安全距离，承担全部责任', 0.00, 100.00),
(1, 'R001-02', '前车部分责任', '前车急刹车且未保持安全距离，前车承担30%责任', 30.00, 70.00),
(1, 'R001-03', '前车全责', '前车倒车时发生追尾，前车承担全部责任', 100.00, 0.00),

-- 变道事故责任规则
(4, 'R002-01', '变道车全责', '变道车辆未确保安全距离，承担全部责任', 100.00, 0.00),
(4, 'R002-02', '双方部分责任', '变道车辆未打转向灯，直行车辆未注意避让，变道车承担70%责任', 70.00, 30.00),
(4, 'R002-03', '直行车全责', '直行车辆故意加速阻止变道，承担全部责任', 0.00, 100.00);

-- 插入赔偿项目数据
INSERT INTO compensation_items (code, name, description) VALUES
('C001', '车辆维修费', '事故造成的车辆维修费用'),
('C002', '车辆贬值损失', '事故造成的车辆贬值损失'),
('C003', '误工费', '事故造成的误工损失'),
('C004', '交通费', '事故造成的额外交通费用'),
('C005', '精神损失费', '事故造成的精神损失赔偿');

-- 插入赔偿标准数据
INSERT INTO compensation_standards (item_id, rule_id, standard_amount, description) VALUES
-- 追尾事故赔偿标准
(1, 1, 2000.00, '轻微追尾事故标准维修费用'),
(2, 1, 1000.00, '轻微追尾事故标准贬值损失'),
(3, 1, 500.00, '轻微追尾事故标准误工费'),

-- 变道事故赔偿标准
(1, 4, 3000.00, '轻微变道事故标准维修费用'),
(2, 4, 1500.00, '轻微变道事故标准贬值损失'),
(3, 4, 800.00, '轻微变道事故标准误工费'); 