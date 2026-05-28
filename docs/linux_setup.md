# 🐧 LCN Linux 端部署与测试手册

> 本文档用于在 Ubuntu 环境下，快速配置和测试 Linux-Command-Note (LCN) 的 CLI 消费端。请依次复制以下命令到终端执行。

## 1. 安装必备依赖
LCN 的 CLI 脚本依赖 `curl` (拉取网络数据) 和 `jq` (解析 JSON)。Ubuntu 通常自带 `curl`，但我们需要确保 `jq` 已安装：
\`\`\`bash
sudo apt update
sudo apt install jq curl -y
\`\`\`

## 2. 配置本地安全凭证
为了安全，GitHub Token 不能写在代码里。我们需要在 家目录创建一个隐藏文件 `~/.lcnrc`，并设置极其严格的权限（仅自己可读写）。

**第一步：创建文件并修改权限**
\`\`\`bash
touch ~/.lcnrc
chmod 600 ~/.lcnrc
\`\`\`

**第二步：编辑配置文件**
\`\`\`bash
nano ~/.lcnrc
\`\`\`
*(在打开的 nano 编辑器中，粘贴以下两行内容，并替换为你自己的真实 Token 和 Gist ID。修改完成后按 `Ctrl+O` 回车保存，`Ctrl+X` 退出)*
> GH_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
> GIST_ID="e761bb71c80a8c9462ad037630ce6f01"

## 3. 赋予脚本执行权限
确保你当前正处于 `linux-command-note` 项目的根目录下，给 `cli/lcn` 脚本赋予可执行权限：
\`\`\`bash
chmod +x cli/lcn
\`\`\`

## 4. 运行测试！
现在，激动人心的时刻到了。在项目根目录运行你的专属 CLI 工具：
\`\`\`bash
./cli/lcn
\`\`\`

---

## 💡 进阶：全局安装 (可选)
如果测试一切完美，你想在 Ubuntu 的任何目录下（不管是不是在代码文件夹里）都能直接敲 `lcn` 命令，可以创建一个软链接到系统路径：
\`\`\`bash
sudo ln -s $(pwd)/cli/lcn /usr/local/bin/lcn
\`\`\`
*(配置好后，你在任何文件夹下直接输入 `lcn` 回车，就能唤出你的命令笔记本了！)*