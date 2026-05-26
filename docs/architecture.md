# 架构决策记录 (ADR) & AI 开发约束

## 1. 核心架构模式
本项目采用“分离式读写”架构：
- **写入端 (Write)**: Windows 环境下，通过浏览器打开纯静态 Web 页面进行记录。
- **持久化 (Storage)**: 无传统后端，直接使用 GitHub REST API，将命令数据存储在 GitHub Gist 或 Repo JSON 文件中。
- **消费端 (Read & Execute)**: Linux Xfce 终端下，使用纯 Bash 脚本拉取数据并执行。

## 2. LLM 开发约束 (严格遵守)
1. **安全性第一**: 
   - 绝对不允许在前端 `js/` 目录下的任何文件中硬编码 (Hardcode) GitHub Personal Access Token 或 LLM API Key。
   - 必须通过页面 UI 引导用户输入 Token，并存储在浏览器的 `LocalStorage` 中。
2. **终端交互原则**: 
   - Linux 端的 Bash 脚本 `cli/lcn` 绝不能静默执行任意命令。
   - 必须使用 `read -e -i "命令"` 的方式预填到终端，强制需要人工确认（回车或修改后回车）才可执行。
3. **技术栈纯净度**:
   - 前端坚决不使用 React/Vue/Node.js 构建工具 (Webpack/Vite 等)，保持纯 HTML5 + 浏览器原生 JS (Vanilla JS)。
   - 后端坚决不引入 Python/Node.js 运行时，保持纯 Bash 以最大化兼容 Linux。