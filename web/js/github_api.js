// web/js/github_api.js

const GIST_FILENAME = 'lcn_tasks.json';

class GitHubAPI {
    constructor() {
        // 每次实例化时从 LocalStorage 读取最新配置
        this.token = localStorage.getItem('lcn_gh_token') || '';
        this.gistId = localStorage.getItem('lcn_gist_id') || '';
        this.headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${this.token}`,
            'Content-Type': 'application/json'
        };
    }

    isValid() {
        return this.token.trim() !== '' && this.gistId.trim() !== '';
    }

    // 1. 从 Gist 拉取所有任务数据
    async fetchTasks() {
        if (!this.isValid()) {
            console.warn("未配置 GitHub Token 或 Gist ID");
            return [];
        }
        try {
            const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
                method: 'GET',
                headers: this.headers
            });
            if (!response.ok) throw new Error(`拉取失败: HTTP ${response.status}`);
            
            const data = await response.json();
            if (data.files && data.files[GIST_FILENAME]) {
                const content = data.files[GIST_FILENAME].content;
                return JSON.parse(content || '[]');
            }
            return [];
        } catch (error) {
            console.error("API 获取错误:", error);
            alert("拉取数据失败，请检查 Token 或网络状态！\n详细信息请看控制台。");
            return [];
        }
    }

    // 2. 将整个任务数组保存覆盖到 Gist
    async saveTasks(tasksArray) {
        if (!this.isValid()) throw new Error("请先配置 GitHub Token 和 Gist ID");

        const payload = {
            files: {
                [GIST_FILENAME]: {
                    content: JSON.stringify(tasksArray, null, 2)
                }
            }
        };

        try {
            const response = await fetch(`https://api.github.com/gists/${this.gistId}`, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) throw new Error(`保存失败: HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("API 保存错误:", error);
            throw error;
        }
    }
}