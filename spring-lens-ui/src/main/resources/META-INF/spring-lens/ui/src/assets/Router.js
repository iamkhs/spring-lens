import { CLASSES, TEMPLATES } from './constants.js';

export default class Router {
    constructor(config = {}) {
        this.routes = config.routes || {};
        this.container = $(config.container || '#main-content');
        this.pagesDir = config.pagesDir || './src/pages/';
        this.defaultRoute = config.defaultRoute || 'definitions';
        this.templateCache = {};
        this.activeRouteKey = null;
    }

    /**
     * Initialize Route Listeners
     */
    init() {
        $(window).on('hashchange', () => this.resolve());
        
        // Listen to links marked with .nav-link class
        $(document).on('click', '.nav-link', (e) => {
            e.preventDefault();
            const page = $(e.currentTarget).data('page');
            if (page) {
                this.navigate(page);
            }
        });

        this.resolve();
    }

    /**
     * Programmatic navigation
     */
    navigate(routeKey) {
        window.location.hash = `#/${routeKey}`;
    }

    /**
     * Match active route and load associated template and hooks
     */
    async resolve() {
        const hash = window.location.hash || `#/${this.defaultRoute}`;
        const routeKey = hash.replace('#/', '');
        const route = this.routes[routeKey];

        if (!route) {
            this.navigate(this.defaultRoute);
            return;
        }

        // 1. Run cleanup (onLeave) hook for the previous active route
        if (this.activeRouteKey) {
            const prevRoute = this.routes[this.activeRouteKey];
            if (prevRoute?.onLeave) {
                try {
                    prevRoute.onLeave();
                } catch (e) {
                    console.error(`Error executing onLeave hook for route ${this.activeRouteKey}:`, e);
                }
            }
        }

        this.activeRouteKey = routeKey;

        // 2. Render dynamic loading state
        this.container.html(TEMPLATES.loading);

        try {
            // 3. Load template (retrieve from cache or fetch via GET)
            const html = this.templateCache[routeKey] || await $.get(`${this.pagesDir}${route.template}.html`);
            this.templateCache[routeKey] = html;

            // 4. Inject into container and update sidebar states
            this.container.html(html);
            this.updateSidebarVisuals(routeKey);

            // 5. Run setup (onEnter) hook for the newly active route
            if (route.onEnter) {
                route.onEnter();
            }

        } catch (error) {
            console.error(`Routing error loading template for ${routeKey}:`, error);
            this._renderError(error.message);
        }
    }

    /**
     * Render routing error panel and bind retry action
     */
    _renderError(message) {
        this.container.html(TEMPLATES.error(message));
        this.container.find('#retry-load-btn').on('click', () => this.resolve());
    }

    /**
     * Manage visual sidebar selections
     */
    updateSidebarVisuals(activePage) {
        $('aside nav a').each((index, element) => {
            const $link = $(element);
            const pageAttr = $link.data('page');
            const isSubLink = $link.parent().parent().hasClass('ml-10') || $link.parent().hasClass('ml-10');
            const isActive = pageAttr === activePage;

            if (isSubLink) {
                $link.toggleClass(CLASSES.subnavActive, isActive)
                     .toggleClass(CLASSES.subnavInactive, !isActive);
            } else {
                $link.toggleClass(CLASSES.navActive, isActive)
                     .toggleClass(CLASSES.navInactive, !isActive);
            }
        });
    }
}