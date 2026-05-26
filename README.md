# 🐧 Linux-Command-Note (LCN)

> 一个专为“双系统/跨环境”开发者打造的 Linux 运维命令管理与执行工具。

## 💡 设计理念 (Philosophy)
本项目的核心解决跨系统学习与工作流的痛点：**在 Windows 下利用丰富的生态进行学习、记录和 AI 辅助生成命令，随后在 Linux 终端下安全、优雅地提取并执行。**

- **分离式读写**：Windows 网页端负责“写入”，Linux 终端负责“消费”。
- **绝对掌控**：拒绝盲目的自动化执行。在终端拉取命令后，提供 `预填 -> 审核 -> 修改 -> 执行` 的安全工作流。
- **无服务器 (Serverless)**：利用 GitHub API (Gists/Repos) 作为跨系统的数据同步桥梁，零运维成本。

## 🛠️ 技术栈 (Tech Stack)
- **Web 端 (Windows)**: HTML5, Bootstrap 5, Vanilla JS, GitHub REST API, LLM API
- **CLI 端 (Linux/Xfce)**: Bash, `jq`, `curl`

## 📂 目录结构说明
- `docs/` - 🧠 AI 协同开发记录与架构设计 (SSOT)
- `web/` - 🌐 静态网页录入端源码
- `cli/` - 💻 Linux 终端读取与交互执行脚本

## 🚀 状态 (Status)
正在与 AI 协同开发中... (AI-Assisted Development in Progress)