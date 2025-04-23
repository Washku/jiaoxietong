# 事故责任划分检索系统安装指南

## 前提条件

- Python 3.11 或更高版本
- Git（用于克隆仓库）
- Node.js 16.0 或更高版本
- MySQL 8.0 或更高版本

## 选项1：本地安装

### 步骤1：克隆仓库

```bash
git clone https://github.com/your-username/accident-rules-system.git
cd accident-rules-system
```

### 步骤2：设置Python环境

我们推荐使用uv来管理Python环境。

使用uv（推荐）：

```bash
uv venv --python 3.11
```

激活虚拟环境：

- Windows (命令提示符)：
```bash
.venv\Scripts\activate
```

- Windows (PowerShell)：
```bash
.\.venv\Scripts\Activate.ps1
```

- macOS/Linux：
```bash
source .venv/bin/activate
```

### 步骤3：安装依赖

安装Python包：

```bash
uv pip install -r requirements.txt
```

安装Playwright浏览器：

```bash
playwright install --with-deps chromium
```

或者安装所有浏览器：

```bash
playwright install
```

### 步骤4：配置环境

1. 创建环境文件副本：

- Windows (命令提示符)：
```bash
copy .env.example .env
```

- macOS/Linux/Windows (PowerShell)：
```bash
cp .env.example .env
```

2. 在您喜欢的文本编辑器中打开.env文件，添加您的API密钥和其他设置

### 步骤5：设置数据库

1. 创建MySQL数据库：

```sql
CREATE DATABASE accident_rules CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 导入数据库结构：

```bash
mysql -u your_username -p accident_rules < server/config/accident_rules.sql
```

### 步骤6：启动后端服务

```bash
cd server
npm install
npm run dev
```

### 步骤7：启动前端服务

```bash
cd ..
npm install
npm run dev:h5
```

## 选项2：Docker安装

### 前提条件

- 已安装Docker和Docker Compose
  - Docker Desktop（适用于Windows/macOS）
  - Docker Engine和Docker Compose（适用于Linux）

### 安装步骤

1. 克隆仓库：

```bash
git clone https://github.com/your-username/accident-rules-system.git
cd accident-rules-system
```

2. 创建并配置环境文件：

- Windows (命令提示符)：
```bash
copy .env.example .env
```

- macOS/Linux/Windows (PowerShell)：
```bash
cp .env.example .env
```

3. 使用您喜欢的文本编辑器编辑.env文件，添加您的API密钥

4. 使用Docker运行：

```bash
# 使用默认设置构建并启动容器（AI任务后浏览器关闭）
docker compose up --build

# 或者使用持久化浏览器运行（AI任务之间浏览器保持打开）
CHROME_PERSISTENT_SESSION=true docker compose up --build
```

5. 访问应用：

- Web界面：在浏览器中打开 http://localhost:7788
- VNC查看器（用于观看浏览器交互）：打开 http://localhost:6080/vnc.html
  - 默认VNC密码："youvncpassword"
  - 可以通过在.env文件中设置VNC_PASSWORD来更改

## 配置说明

### 环境变量

在.env文件中，您需要配置以下变量：

```
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=accident_rules

# API密钥
OPENAI_API_KEY=your_openai_api_key
BAIDU_API_KEY=your_baidu_api_key
BAIDU_SECRET_KEY=your_baidu_secret_key

# 服务器配置
PORT=3000
NODE_ENV=development

# 文件上传配置
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880  # 5MB
```

### 数据库配置

数据库包含以下主要表：

- `accident_types`: 事故类型表
- `accident_scenarios`: 事故场景表
- `accident_rules`: 责任规则表
- `compensation_items`: 赔偿项目表
- `compensation_standards`: 赔偿标准表

## 故障排除

### 常见问题

1. **无法连接到数据库**
   - 检查数据库服务是否正在运行
   - 验证.env文件中的数据库凭据是否正确
   - 确保数据库用户有适当的权限

2. **图片上传失败**
   - 检查上传目录是否存在且有写入权限
   - 验证文件大小是否超过限制
   - 确保文件格式受支持

3. **AI识别服务无响应**
   - 验证API密钥是否正确
   - 检查网络连接
   - 查看服务器日志以获取详细错误信息

### 日志位置

- 后端日志: `server/logs/`
- 前端日志: 浏览器控制台
- Docker日志: `docker logs <container_id>`

## 更新和维护

### 更新系统

```bash
git pull
npm install
cd server && npm install
cd ..
npm run build
```

### 数据库备份

```bash
mysqldump -u your_username -p accident_rules > backup_$(date +%Y%m%d).sql
```

### 数据库恢复

```bash
mysql -u your_username -p accident_rules < backup_file.sql
``` 