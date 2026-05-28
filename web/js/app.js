// web/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // === DOM 元素引用 ===
    const btnNewTask = document.getElementById('btn-new-task');
    const btnAddStep = document.getElementById('btn-add-step');
    const stepsContainer = document.getElementById('steps-container');
    const editorCard = document.getElementById('editor-card');
    const welcomeMsg = document.getElementById('welcome-msg');
    
    const btnSaveSettings = document.getElementById('btn-save-settings');
    const configToken = document.getElementById('config-token');
    const configGist = document.getElementById('config-gist');

    // === 1. 设置管理 (LocalStorage) ===
    function loadSettings() {
        const token = localStorage.getItem('lcn_gh_token') || '';
        const gistId = localStorage.getItem('lcn_gist_id') || '';
        configToken.value = token;
        configGist.value = gistId;
    }
    
    btnSaveSettings.addEventListener('click', () => {
        localStorage.setItem('lcn_gh_token', configToken.value.trim());
        localStorage.setItem('lcn_gist_id', configGist.value.trim());
        alert('设置已保存到本地浏览器！');
        const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
        modal.hide();
    });

    loadSettings(); // 初始化加载设置

    // === 2. UI 交互控制 ===
    
    // 切换到编辑器视图
    function showEditor() {
        welcomeMsg.style.display = 'none';
        editorCard.style.display = 'block';
    }

    // 新建任务按钮点击
    btnNewTask.addEventListener('click', () => {
        document.getElementById('task-form').reset();
        document.getElementById('task-id').value = 'task_' + Date.now(); // 生成唯一ID
        stepsContainer.innerHTML = ''; // 清空步骤
        addStepUI(); // 默认给一个空步骤
        showEditor();
    });

    // 动态添加步骤 UI
    function addStepUI(desc = '', cmd = '') {
        const stepCount = stepsContainer.children.length + 1;
        const stepHtml = `
            <div class="card p-3 step-card">
                <div class="d-flex justify-content-between mb-2">
                    <strong class="text-primary">步骤 #${stepCount}</strong>
                    <button type="button" class="btn btn-sm btn-danger btn-remove-step"><i class="bi bi-trash"></i></button>
                </div>
                <div class="mb-2">
                    <input type="text" class="form-control step-desc" placeholder="操作说明 (例如: 更新系统源)" value="${desc}">
                </div>
                <div>
                    <input type="text" class="form-control font-monospace step-cmd" placeholder="Bash 命令 (例如: sudo apt update)" value="${cmd}">
                </div>
            </div>
        `;
        stepsContainer.insertAdjacentHTML('beforeend', stepHtml);
    }

    btnAddStep.addEventListener('click', () => addStepUI());

    // 使用事件委托处理动态生成的“删除步骤”按钮
    stepsContainer.addEventListener('click', (e) => {
        if (e.target.closest('.btn-remove-step')) {
            e.target.closest('.step-card').remove();
        }
    });

    // === 3. 数据组装与 GitHub API 联调 ===
    const ghAPI = new GitHubAPI();
    let allTasks = []; // 在内存中维护完整的任务列表

    // 页面加载时拉取现有数据
    async function initLoadTasks() {
        if (ghAPI.isValid()) {
            allTasks = await ghAPI.fetchTasks();
            renderTaskList();
        }
    }

    // 渲染左侧侧边栏的任务列表
    function renderTaskList() {
        const listContainer = document.getElementById('task-list');
        listContainer.innerHTML = '';
        allTasks.forEach(task => {
            const item = document.createElement('a');
            item.href = "#";
            item.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center";
            item.innerHTML = `
                <div>
                    <strong>${task.task_name}</strong>
                    <div class="text-muted" style="font-size: 0.8rem;">
                        ${task.tags ? task.tags.map(t => `<span class="badge bg-secondary me-1">${t}</span>`).join('') : ''}
                    </div>
                </div>
                <span class="badge bg-primary rounded-pill">${task.steps ? task.steps.length : 0} 步</span>
            `;
            // 点击左侧列表事件
            item.addEventListener('click', (e) => {
                e.preventDefault();
                alert(`你点击了任务: ${task.task_name}，目前仅供预览。`);
            });
            listContainer.appendChild(item);
        });
    }

    // 保存按钮点击事件
    document.getElementById('btn-save-task').addEventListener('click', async () => {
        const btnSave = document.getElementById('btn-save-task');
        
        // 1. 组装当前表单的数据
        const taskData = {
            task_id: document.getElementById('task-id').value,
            task_name: document.getElementById('task-name').value,
            tags: document.getElementById('task-tags').value.split(',').map(t => t.trim()).filter(t => t),
            steps: []
        };

        const stepCards = stepsContainer.querySelectorAll('.step-card');
        stepCards.forEach((card, index) => {
            taskData.steps.push({
                step_id: index + 1,
                desc: card.querySelector('.step-desc').value,
                cmd: card.querySelector('.step-cmd').value
            });
        });

        // 2. 更新到全局数组
        const existingIndex = allTasks.findIndex(t => t.task_id === taskData.task_id);
        if (existingIndex >= 0) {
            allTasks[existingIndex] = taskData;
        } else {
            allTasks.push(taskData);
        }

        // 3. 调用 API 保存到 GitHub Gist
        try {
            btnSave.disabled = true;
            btnSave.innerHTML = '<i class="bi bi-hourglass-split"></i> 保存中...';
            
            const currentApi = new GitHubAPI(); 
            await currentApi.saveTasks(allTasks);
            
            alert("✅ 成功保存到 GitHub Gist！");
            renderTaskList(); // 刷新左侧列表
        } catch (error) {
            alert("❌ 保存失败，请检查设置。错误信息：" + error.message);
        } finally {
            btnSave.disabled = false;
            btnSave.innerHTML = '<i class="bi bi-save"></i> 保存至 GitHub';
        }
    });

    // 初始化调用
    initLoadTasks();

}); // <--- 就是这个大括号之前被意外删除了