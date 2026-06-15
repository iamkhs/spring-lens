$(document).ready(() => {

    // Global variables
    let totalElements = 0;
    let totalPages = 0;
    let isFirstPage = false;
    let isLastPage = false;
    let currentPage = 1;
    let pageSize = 10;
    let sortField = "startTime";
    let sortDirection = "desc";
    const expandedRows = new Set();
    let charts = {};

    const pathname = window.location.pathname;
    const CONTEXT_PATH = pathname.replace("/spring-lens/ui/index.html",  "");
    const API_BASE_URL = CONTEXT_PATH.concat("/api/spring-lens");
    const ENDPOINTS = {
        REQUEST : API_BASE_URL.concat("/api/request"),
        LIST_OF_BEANS: API_BASE_URL.concat("/api/beans"),
    };

    const beansData = [
        { name: 'userService', type: 'com.app.service.UserServiceImpl', scope: 'SINGLETON', role: 'Application', primary: true, lazy: false, contextId: 'application:8080', icon: 'settings_input_component', color: 'text-primary' },
        { name: 'dataSource', type: 'com.zaxxer.hikari.HikariDataSource', scope: 'SINGLETON', role: 'Infrastructure', primary: true, lazy: false, contextId: 'application:8080', icon: 'database', color: 'text-success' },
        { name: 'securityConfig', type: 'com.app.config.SecurityConfig', scope: 'SINGLETON', role: 'Application', primary: false, lazy: true, contextId: 'application:8080', icon: 'lock', color: 'text-warning' },
        { name: 'userController', type: 'com.app.rest.UserController', scope: 'SINGLETON', role: 'Application', primary: false, lazy: false, contextId: 'application:8080', icon: 'api', color: 'text-info' },
        { name: 'userService', type: 'com.app.service.UserServiceImpl', scope: 'SINGLETON', role: 'Application', primary: true, lazy: false, contextId: 'application:8080', icon: 'settings_input_component', color: 'text-primary' },
        { name: 'securityConfig', type: 'com.app.config.SecurityConfig', scope: 'SINGLETON', role: 'Application', primary: false, lazy: true, contextId: 'application:8080', icon: 'lock', color: 'text-warning' },
        { name: 'userService', type: 'com.app.service.UserServiceImpl', scope: 'SINGLETON', role: 'Application', primary: true, lazy: false, contextId: 'application:8080', icon: 'settings_input_component', color: 'text-primary' },
        { name: 'cacheManager', type: 'org.springframework.cache.CacheManager', scope: 'SINGLETON', role: 'Support', primary: false, lazy: false, contextId: 'application:8080', icon: 'memory', color: 'text-gray-500' },
        { name: 'transactionManager', type: 'org.springframework.jdbc.datasource.DataSourceTransactionManager', scope: 'SINGLETON', role: 'Infrastructure', primary: false, lazy: false, contextId: 'application:8080', icon: 'sync_alt', color: 'text-success' },
        { name: 'taskScheduler', type: 'org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler', scope: 'SINGLETON', role: 'Support', primary: false, lazy: false, contextId: 'application:8080', icon: 'schedule', color: 'text-info' },
    ];

    function renderTable() {
        const tbody = document.getElementById('beanTableBody');
        tbody.innerHTML = '';

        beansData.forEach(bean => {
            const primaryIcon = bean.primary
                ? `<span class="material-symbols-outlined text-[18px] text-success" style="font-variation-settings: 'FILL' 1;">check_circle</span>`
                : `<span class="material-symbols-outlined text-[18px] text-gray-300">radio_button_unchecked</span>`;

            const lazyIcon = bean.lazy
                ? `<span class="material-symbols-outlined text-[18px] text-success" style="font-variation-settings: 'FILL' 1;">check_circle</span>`
                : `<span class="material-symbols-outlined text-[18px] text-gray-300">radio_button_unchecked</span>`;

            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 cursor-pointer transition-colors';
            row.innerHTML = `
            <td class="px-5 py-3">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[16px] ${bean.color}">${bean.icon}</span>
                    <span class="font-medium text-gray-800">${bean.name}</span>
                </div>
            </td>
            <td class="px-5 py-3 font-mono text-[11px] text-gray-500 truncate max-w-[200px]" title="${bean.type}">${bean.type}</td>
            <td class="px-5 py-3">
                <span class="px-2 py-0.5 rounded-sm bg-success-light text-success text-[10px] font-bold tracking-wide">${bean.scope}</span>
            </td>
            <td class="px-5 py-3 text-gray-600">${bean.role}</td>
            <td class="px-5 py-3 text-center">${primaryIcon}</td>
            <td class="px-5 py-3 text-center">${lazyIcon}</td>
            <td class="px-5 py-3 font-mono text-[11px] text-gray-500">${bean.contextId}</td>
            <td class="px-5 py-3 text-right">
                <button class="text-gray-400 hover:text-gray-600">
                    <span class="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
            </td>
        `;
            tbody.appendChild(row);
        });
    }

    function initCharts() {
        // Scope Chart
        const scopeCtx = document.getElementById('scopeChart');
        if (scopeCtx) {
            new Chart(scopeCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Singleton', 'Prototype', 'Session', 'Request'],
                    datasets: [{
                        data: [34, 10, 8, 23],
                        backgroundColor: ['#6b46c1', '#3b82f6', '#22c55e', '#f59e0b'],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    cutout: '70%',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: true }
                    }
                }
            });
        }

        // Role Chart
        const roleCtx = document.getElementById('roleChart');
        if (roleCtx) {
            new Chart(roleCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Application', 'Support', 'Infrastructure'],
                    datasets: [{
                        data: [64, 20, 16],
                        backgroundColor: ['#3b82f6', '#f59e0b', '#e2e8f0'],
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    cutout: '70%',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: true }
                    }
                }
            });
        }
    }

    renderTable();
    initCharts();
});