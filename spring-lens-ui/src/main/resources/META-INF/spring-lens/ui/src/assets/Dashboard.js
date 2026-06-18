import { beansData } from './mockData.js';
import { TEMPLATES } from './constants.js';

/**
 * Controller class for the Beans Definitions dashboard tab.
 * Renders list tables and aggregates bean metrics via Chart.js doughnut charts.
 */
export default class Dashboard {
    constructor() {
        this.charts = {
            scopeChart: null,
            roleChart: null
        };
    }

    /**
     * Initializes the view by rendering tables and starting up charts.
     */
    enter() {
        this.renderTable();
        this.initCharts();
    }

    /**
     * Handles cleaning up charts when transitioning away from the dashboard.
     */
    leave() {
        this.cleanupCharts();
    }

    /**
     * Renders the bean definitions list table, minimizing DOM reflows
     * by batch writing content.
     */
    renderTable() {
        const tbody = document.getElementById('beanTableBody');
        if (!tbody) return;

        const rowsHtml = beansData.map(bean => {
            const primaryIcon = bean.primary ? TEMPLATES.checkCircle : TEMPLATES.uncheckedCircle;
            const lazyIcon = bean.lazy ? TEMPLATES.checkCircle : TEMPLATES.uncheckedCircle;

            return TEMPLATES.dashboardRow({
                ...bean,
                primaryIcon,
                lazyIcon
            });
        });

        tbody.innerHTML = rowsHtml.join('');
    }

    /**
     * Initializes all doughnut distribution charts.
     */
    initCharts() {
        this.charts.scopeChart = this._createDoughnutChart(
            'scopeChart',
            ['Singleton', 'Prototype', 'Session', 'Request'],
            [34, 10, 8, 23],
            ['#6b46c1', '#3b82f6', '#22c55e', '#f59e0b']
        );

        this.charts.roleChart = this._createDoughnutChart(
            'roleChart',
            ['Application', 'Support', 'Infrastructure'],
            [64, 20, 16],
            ['#3b82f6', '#f59e0b', '#e2e8f0']
        );
    }

    /**
     * Helper to instantiate a pre-styled doughnut chart on a target canvas.
     * @private
     * @param {string} canvasId - Target HTML element ID.
     * @param {string[]} labels - Legend labels.
     * @param {number[]} data - Metric values.
     * @param {string[]} colors - Colors matching values.
     * @returns {Chart|null}
     */
    _createDoughnutChart(canvasId, labels, data, colors) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors,
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

    /**
     * Destroys existing charts to avoid memory leaks or canvas drawing conflicts.
     */
    cleanupCharts() {
        for (const [key, chart] of Object.entries(this.charts)) {
            if (chart) {
                chart.destroy();
                this.charts[key] = null;
            }
        }
    }
}
