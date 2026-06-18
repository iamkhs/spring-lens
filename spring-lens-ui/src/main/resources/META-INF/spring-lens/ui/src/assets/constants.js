// UI layout constants for Spring Lens
export const NW = 196;
export const NH = 44;
export const RX = 10;
export const GAP_X = 36;
export const GAP_Y = 80;
export const ICON = 'M10 2l8 4v8l-8 4-8-4V6l8-4z M2 6l8 4 M18 6l-8 4 M10 10v8';
export const ZOOM_SCALE_EXTENT = [0.05, 4];
export const METHOD_PILL_STYLES = {
    get: 'bg-blue-50 text-blue-700 border-blue-100',
    post: 'bg-green-50 text-green-700 border-green-100',
    put: 'bg-amber-50 text-amber-700 border-amber-100',
    delete: 'bg-red-50 text-red-700 border-red-100'
};

export const STATUS_PILL_STYLES = {
    green: 'bg-success-light text-success border-success/15',
    amber: 'bg-amber-50 text-warning border-warning/15',
    red: 'bg-red-50 text-red-600 border-red-200'
};

export const NODE_STYLES = {
    root: { fill: '#eff6ff', stroke: '#3b82f6', icon: '#3b82f6', text: '#1d4ed8' },
    leaf: { fill: '#fffbeb', stroke: '#eab308', icon: '#eab308', text: '#a16207' },
    intermediate: { fill: '#f0fdf4', stroke: '#22c55e', icon: '#22c55e', text: '#15803d' }
};

export const DEFAULT_NODE_STYLE = { fill: '#faf5ff', stroke: '#a855f7', icon: '#a855f7', text: '#7e22ce' };

export const CLASSES = {
    navActive: 'text-primary bg-primary-light border-l-2 border-primary',
    navInactive: 'text-gray-500 hover:text-gray-800 hover:bg-gray-50',
    subnavActive: 'text-primary',
    subnavInactive: 'text-gray-500 hover:text-gray-800'
};

export const TEMPLATES = {
    loading: `
        <div class="flex flex-col items-center justify-center h-full gap-3 py-24">
            <span class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></span>
            <span class="text-xs font-semibold text-gray-400">Loading module...</span>
        </div>
    `,
    error: (message) => `
        <div class="flex flex-col items-center justify-center h-full p-8 text-center bg-white m-6 rounded-xl border border-gray-200 shadow-sm">
            <span class="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
            <h3 class="text-lg font-bold text-gray-800 mb-1">Application Error</h3>
            <p class="text-sm text-gray-500 max-w-sm mb-2">Could not load this module. Please ensure the backend is active.</p>
            <p class="text-[10px] text-red-500 font-mono mb-4 bg-red-50/50 border border-red-100 rounded px-2 py-1 select-all">${message}</p>
            <button id="retry-load-btn" class="px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-md text-sm font-semibold transition-colors">Retry</button>
        </div>
    `,
    requestRow: ({ method, status, url, time, ip, timestamp, reqId, methodClass, statusColor }) => `
        <tr class="hover:bg-gray-50 cursor-pointer transition-colors">
            <td class="px-5 py-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold inline-block border ${METHOD_PILL_STYLES[methodClass] || 'bg-gray-50 text-gray-700 border-gray-200'}">${method}</span>
            </td>
            <td class="px-5 py-3 font-mono text-[11px] text-gray-700 truncate max-w-[200px]" title="${url}">${url}</td>
            <td class="px-5 py-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold inline-block border ${STATUS_PILL_STYLES[statusColor]}">${status}</span>
            </td>
            <td class="px-5 py-3 text-gray-600">${time}</td>
            <td class="px-5 py-3 font-mono text-[11px] text-gray-500">${ip}</td>
            <td class="px-5 py-3 text-gray-600">${timestamp}</td>
            <td class="px-5 py-3 text-right">
                <button class="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md text-xs font-semibold transition-colors cursor-pointer btn-request-view animate-none" data-id="${reqId}">
                    View
                </button>
            </td>
        </tr>
    `,
    checkCircle: `<span class="material-symbols-outlined text-[18px] text-success" style="font-variation-settings: 'FILL' 1;">check_circle</span>`,
    uncheckedCircle: `<span class="material-symbols-outlined text-[18px] text-gray-300">radio_button_unchecked</span>`,
    dashboardRow: ({ color, icon, name, type, scope, role, primaryIcon, lazyIcon, contextId }) => `
        <tr class="hover:bg-gray-50 cursor-pointer transition-colors">
            <td class="px-5 py-3">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[16px] ${color}">${icon}</span>
                    <span class="font-medium text-gray-800">${name}</span>
                </div>
            </td>
            <td class="px-5 py-3 font-mono text-[11px] text-gray-500 truncate max-w-[200px]" title="${type}">${type}</td>
            <td class="px-5 py-3">
                <span class="px-2 py-0.5 rounded-sm bg-success-light text-success text-[10px] font-bold tracking-wide">${scope}</span>
            </td>
            <td class="px-5 py-3 text-gray-600">${role}</td>
            <td class="px-5 py-3 text-center">${primaryIcon}</td>
            <td class="px-5 py-3 text-center">${lazyIcon}</td>
            <td class="px-5 py-3 font-mono text-[11px] text-gray-500">${contextId}</td>
            <td class="px-5 py-3 text-right">
                <button class="text-gray-400 hover:text-gray-600">
                    <span class="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
            </td>
        </tr>
    `,
    tooltip: `
        <div id="tip" class="absolute hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg pointer-events-none z-50 text-xs text-gray-600 dark:text-gray-300 min-w-[150px] transition-opacity duration-150">
            <div id="tip-name" class="font-bold text-gray-800 dark:text-white mb-1 font-mono text-[11px]"></div>
            <div id="tip-type" class="text-[10px] text-gray-500 mb-0.5"></div>
            <div id="tip-scope" class="text-[10px] text-gray-500 mb-0.5"></div>
            <div id="tip-meta" class="text-[10px] text-gray-500"></div>
        </div>
    `,
    dependencyItem: ({ depName, displayName, catColor }) => `
        <div class="dep-item flex items-center justify-between py-1.5 hover:bg-gray-50 px-2 rounded-md transition-colors">
            <div class="dep-item-left flex items-center gap-2 cursor-pointer" data-fullname="${depName}">
                <span class="w-2 h-2 rounded-full bg-${catColor}-500"></span>
                <span class="font-medium text-gray-700 font-mono text-[11px]">${displayName}</span>
            </div>
            <span class="dep-link flex items-center text-gray-400 hover:text-gray-600 cursor-pointer" data-fullname="${depName}" title="Focus in graph">
                <span class="material-symbols-outlined text-[16px]">east</span>
            </span>
        </div>
    `,
    suggestionItem: ({ fullName, displayName, type }) => `
        <div class="suggestion-item p-2 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0" data-fullname="${fullName}">
            <strong class="text-xs font-semibold text-gray-700 block">${displayName}</strong>
            <span class="text-[10px] text-gray-400 block font-mono truncate">${type}</span>
        </div>
    `
};