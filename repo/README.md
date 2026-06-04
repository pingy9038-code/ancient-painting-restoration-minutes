# 古建彩画修复色谱纪要系统

面向古建彩画修复专家论证会的全栈应用，实现音频分析、颜料识别、技法提取和档案管理。

## 功能特性

### 后端服务
- **音频处理**: 使用 librosa 进行轻量去噪
- **语音识别**: Whisper 识别矿物颜料成分和传统技法名
- **说话人分离**: pyannote.audio 区分分析检测方和修复方
- **AI 分析**: OpenAI GPT 生成会议摘要、配色方案和保养建议
- **档案管理**: Markdown 格式存入建筑遗产档案

### 前端展示
- **显微取样数据**: 样品管理、图像查看
- **色度计数据**: Lab色彩空间可视化、光谱分析
- **分析结果**: 颜料成分、传统技法、配色方案展示
- **档案管理**: 历史记录查看和检索

## 项目结构

```
auto107/
├── backend/
│   ├── main.py              # FastAPI 主应用
│   └── services/
│       ├── audio_processor.py    # 音频处理模块
│       ├── ai_analyzer.py        # AI分析模块
│       └── archive_manager.py    # 档案管理模块
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── UploadPanel.js
│   │   ├── AnalysisResult.js
│   │   ├── ArchiveList.js
│   │   └── ChromatographyViewer.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── requirements.txt
├── package.json
└── tailwind.config.js
```

## 安装与运行

### 后端服务

```bash
cd auto107
pip install -r requirements.txt
cp .env.example .env
# 配置 OPENAI_API_KEY 和 PYANNOTE_AUTH_TOKEN
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 前端应用

```bash
cd auto107
npm install
npm start
```

## API 接口

- `POST /api/analyze` - 上传音频并进行完整分析
- `POST /api/chromatography/upload` - 上传色谱数据
- `GET /api/archives` - 获取档案列表
- `GET /api/archives/{project_id}` - 获取档案详情

## 技术栈

- **后端**: Python 3.9+, FastAPI, librosa, Whisper, pyannote.audio, OpenAI
- **前端**: React 18, Tailwind CSS, Recharts, Lucide Icons
