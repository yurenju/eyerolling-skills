# Eye-Rolling Workflow（翻白眼工作流）

一套專注於規格導向開發的 Claude Code 工作流程命令集，透過結構化的三步驟流程，從需求澄清到完整實作，確保開發過程清晰可追蹤。

這個名稱帶有自嘲意味——從旁觀者的角度來看，與 AI 來回釐清需求的過程可能顯得煩人到讓人翻白眼。但這正是重點：寫程式之前先想清楚。

![claude-code-config](assets/claude-code-config-intro.png)

## 🎯 核心理念

**從想法到實作的完整流程：** 透過 PRD (產品需求文件) 驅動開發，確保每個功能都有清晰的需求定義、完整的實作計畫，以及可執行的驗收標準。

## 🚀 核心工作流程

### 三步驟開發流程

這套工作流程從模糊的功能想法開始，透過結構化的方法逐步細化為可執行的實作任務：

**第一步：需求澄清** - 當你有一個功能想法時，使用 `/create-prd` 讓 AI 透過互動問答幫助你釐清需求細節，最終產生清晰完整的產品需求文件 (PRD)。

**第二步：實作規劃** - 有了明確的 PRD 後，使用 `/create-impl-plan` 讓 AI 分析你的程式碼架構，將 PRD 拆解成 5-7 個具體的實作任務，並生成對應的驗收測試場景。

**第三步：任務執行** - 透過 `/process-task-list` 逐一執行實作任務。每完成一個任務會自動 git commit，並詢問是否繼續下一個任務。對於複雜的長期專案，你可以多次執行此命令來分階段完成所有任務。

這個流程的核心價值在於確保每個功能都經過充分的需求分析，有明確的實作計畫，並且執行過程可追蹤、可中斷、可恢復。

### 1️⃣ `/create-prd` - 需求澄清與 PRD 生成

**用途：** 將模糊的功能需求轉化為清晰的產品需求文件

**流程：**
- 接收功能描述（如：「我要開發一個 Obsidian 筆記可以直接發布在靜態網站的網站」）
- AI 主動詢問澄清問題，促使開發者深入思考
- 基於問答結果生成完整 PRD 文件

**輸出：** `docs/specs/[date]-[feature-name]/prd.md`

**範例互動：**
```
開發者：「我想要一個筆記發布系統」
AI：「這個系統主要解決什麼問題？目標用戶是誰？需要支援哪些筆記格式？...」
```

### 2️⃣ `/create-impl-plan` - 實作計畫制定

**用途：** 讀取 PRD，分析專案架構，制定詳細的實作任務清單

**流程：**
- 讀取並分析 PRD 內容
- 檢視現有程式碼架構和慣例
- 生成 5-7 個主要實作任務，每個任務包含詳細的實作要點
- 為每個任務生成「完成檢查」，提供具體可執行的驗證方法
- 自動生成 Gherkin 格式的驗收測試場景
- 最後一個任務固定為驗收測試

**輸出：**
- `docs/specs/[prd-slug]/implementation.md` - 任務清單
- `docs/specs/[prd-slug]/acceptance.feature` - 驗收測試場景

### 3️⃣ `/process-task-list` - 任務執行與管理

**用途：** 逐一執行實作計畫中的每個任務，支援分階段完成長期開發流程

**執行模式：**
- **單任務執行：** 每次執行完成一個任務後會暫停，等待開發者確認是否繼續
- **多次執行：** 可以重複執行此命令來處理剩餘任務，適合長期開發流程
- **彈性管理：** 對話過長時可選擇使用 `/compact` 精簡對話或 `/clear` 重新開始

**功能特色：**
- **任務追蹤：** 與 Claude Code 的 TodoWrite 工具整合，即時追蹤進度
- **完成檢查：** 每個任務包含具體可執行的驗證方法（單元測試、MCP 工具檢查、指令執行等）
- **驗收測試：** 遇到驗收測試任務時，啟用專門的 acceptance-tester subagent
- **Git 整合：** 每完成一個任務自動執行 git commit
- **狀態持久化：** 任務狀態保存在 `implementation.md` 中，支援跨對話追蹤

## 🔍 輔助功能

### `/research` - 研究與調查

**用途：** 在還未確定實作方向時，進行深度研究和分析

**適用場景：**
- 技術選型調研
- 問題根因分析  
- 架構設計評估
- 最佳實踐研究

**輸出：** `docs/research/[date]-[topic].md`

**與主流程整合：** 研究結果可作為後續 PRD 撰寫的參考依據

## 📦 快速開始

### 安裝

將所有命令安裝到 Claude Code 環境：

```bash
# 首次安裝
npm run install-config

# 強制覆蓋現有命令（注意 -- 和 overwrite 之間需要空格）
npm run install-config -- overwrite
```

**安裝位置：**
- Windows: `C:\Users\[username]\.claude\commands`
- macOS/Linux: `~/.claude/commands`

### 使用範例

**完整開發流程：**

1. **需求澄清**
   ```
   /create-prd
   我想開發一個部落格文章管理系統
   ```

2. **制定計畫**
   ```
   /create-impl-plan
   請基於剛才生成的 PRD 制定實作計畫
   ```

3. **執行開發**
   ```
   /process-task-list
   開始執行實作任務
   
   # 完成一個任務後，可以：
   # - 繼續下一個任務
   # - 稍後重新執行 /process-task-list 繼續剩餘任務
   # - 對話過長時可使用 /compact 或 /clear（可選）
   ```

## 🏗️ 專案架構

```
eye-rolling-workflow/
├── commands/                   # 核心命令
│   ├── create-prd.md          # PRD 生成流程
│   ├── create-impl-plan.md    # 實作計畫流程  
│   ├── process-task-list.md   # 任務執行流程
│   └── research.md            # 研究分析流程
├── scripts/
│   └── install-config.js      # 安裝腳本
├── docs/                      # 輸出目錄
│   ├── research/              # 研究文件
│   │   └── [date]-[topic].md
│   └── specs/                 # 產品規格
│       └── [date]-[feature]/
│           ├── prd.md
│           ├── implementation.md
│           └── acceptance.feature
└── README.md
```

## ✨ 核心特色

- **🎯 規格導向開發：** 透過 PRD 驅動整個開發流程，確保需求清晰可追蹤
- **🛠️ Claude Code 整合：** 與 TodoWrite 同步任務狀態，自動化 Git 提交流程
- **🧪 完成檢查與驗收測試：** 每個任務包含具體驗證方法，支援 Gherkin 格式驗收測試

## 🎨 適用場景

適合重視開發流程規範、需要清晰需求文件、希望透過完成檢查確保實作品質的個人開發者或團隊專案。

## 📋 最佳實踐

1. **循序執行** PRD → 實作計畫 → 任務執行的完整流程
2. **充分澄清** 在 PRD 階段確保需求清晰無歧義  
3. **持續同步** 保持任務狀態即時更新並定期提交

## 🤝 貢獻與回饋

本專案基於 [snarktank/ai-dev-tasks](https://github.com/snarktank/ai-dev-tasks) 的概念，針對 Claude Code 和繁體中文環境進行了深度客製化。

## 📄 授權

本專案採用 Apache 2.0 授權條款。