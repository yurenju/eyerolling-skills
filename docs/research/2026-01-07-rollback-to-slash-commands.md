# Rollback 到 Slash Commands 的影響分析

## 執行摘要

本研究分析從 commit `66458da3`（slash commands 時期）到目前 `31b2e38`（skills 結構）之間的所有變更，識別哪些是與 skill 遷移無關的功能性改進。經過詳細檢視，發現只有 **1 個 commit** 包含與 skill 遷移無關的實質變更。

**關鍵發現：**
- 共 15 個 commit 在這段期間
- 14 個 commit 與 skill 遷移相關（結構性變更或 skill 特有的修正）
- 1 個 commit 包含需要考慮的變更（專案重命名）

## 背景與脈絡

你計畫將專案 rollback 到 commit `66458da3c8b8614f0d2ab82a11d230f0b6764f0c`，這是移除 TDD workflow 並引入 Completion Checks 機制的版本。當時專案使用的是 slash commands 結構（`commands/` 目錄），而不是目前的 skills 結構（`skills/` 目錄）。

這段期間的主要變更是將整個專案從 slash commands 遷移到 skills 架構，但在遷移過程中也進行了一些功能性的改進和 bug fixes。

## Commit 分析

### 完整 Commit 清單（從舊到新）

| Commit | 類型 | 說明 |
|--------|------|------|
| `ff4a2b5` | 遷移 | 新增 skills 遷移的研究和規格文件 |
| `032ed79` | 遷移 | 建立 skills 目錄結構和基礎 SKILL.md 檔案 |
| `f0a93a6` | 遷移 | 遷移 research 和 create-prd skills |
| `96d3d5b` | 遷移 | 遷移 create-impl-plan skill |
| `1029968` | 遷移 | 遷移 process-task-list skill |
| `6be08a8` | **Bug fix** | 統一 Implementation.md → implementation.md 小寫 |
| `2e4f214` | 遷移 | 遷移 acceptance-test skill |
| `8fe670f` | 遷移 | 更新驗收測試呼叫方式 |
| `8638f5e` | 遷移 | 更新安裝腳本支援 skills 目錄 |
| `b483368` | 遷移 | 移除舊的 commands 和 agents 目錄 |
| `6f8f0c4` | 遷移 | 新增 skills 遷移的驗收測試報告 |
| `3d4d915` | 遷移 | 更新專案文件 |
| `089bbf9` | **文件** | 專案重新命名為 Eye-Rolling Skills |
| `ff2de42` | Skill 修正 | 釐清完成檢查和實作備註的輸出格式 |
| `cd09988` | Skill 修正 | 防止 AI 在生成時填寫實作備註 |
| `31b2e38` | Skill 修正 | 強制相關檔案使用列表格式 |

### 需要考慮的變更（1 個）

#### `089bbf9` - 專案重新命名

**變更內容：**
- 專案名稱改為 "Eye-Rolling Skills（翻白眼技能包）"
- 更新 CLAUDE.md 和 README.md 的專案說明

**影響檔案：**
- `CLAUDE.md`
- `README.md`

**為什麼考慮：** 這是品牌/文件變更。如果 rollback 到 slash commands 架構，名稱中的 "Skills" 可能不太適合，可考慮改為 "Eye-Rolling Commands" 或其他名稱。

### Skill 特有的修正（3 個）

以下 3 個 commit 是遷移到 skills 結構後，因為 skill 無法照著指令做而額外加強的約束。這些修正是 skill 架構特有的問題，在 slash commands 架構下不需要：

| Commit | 說明 |
|--------|------|
| `ff2de42` | 釐清完成檢查使用純條列、實作備註生成時留空 |
| `cd09988` | 任務標題改用描述性名稱、實作備註改用 TBD 標記 |
| `31b2e38` | 相關檔案禁止使用表格，強制列表格式 |

**為什麼不需要保留：** 這些都是因為 skill 架構下 AI 的遵循度較低，需要額外加強約束。Slash commands 架構本身沒有這些問題。

### 純遷移相關的 Commit（11 個）

這些 commit 在 rollback 後不需要處理，因為它們只涉及：
- 建立 skills 目錄結構
- 將內容從 commands 移動到 skills
- 更新安裝腳本
- 移除舊目錄
- 更新文件引用

## 建議與決策指引

基於分析結果，rollback 非常單純：

### 專案名稱決定

專案將重新命名為 **Eye-Rolling Workflow（翻白眼工作流）**，這個名稱：
- 移除了 Skills/Commands 等實作細節
- 保留了「翻白眼」的自嘲幽默感
- 「Workflow」準確描述這是一套開發工作流程

## 下一步行動計畫

### 執行步驟

1. 使用 revert 建立新 commit（不需 force push）：
   ```bash
   # 一次 revert 多個 commits（從新到舊）
   git revert --no-commit HEAD~14..HEAD
   git commit -m "revert: rollback to slash commands structure"
   ```

2. 更新專案名稱為 "Eye-Rolling Workflow" 並 commit

## 參考資料

- **目標 rollback commit**: `66458da3c8b8614f0d2ab82a11d230f0b6764f0c`
- **新專案名稱**: Eye-Rolling Workflow（翻白眼工作流）
- **Skill 特有修正 commits**（不需保留）: `ff2de42`, `cd09988`, `31b2e38`
