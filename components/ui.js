// Shared chrome for emre.xyz and its subdomains: <emre-header> and <emre-footer>.
// Styling reads the design tokens from tokens.css (custom properties inherit into shadow DOM).

const MAIN_SITE_ORIGIN = 'https://emre.xyz';
// Hosts that serve the main site itself, so internal links can stay relative (keeps local dev local).
const MAIN_SITE_HOSTS = new Set(['emre.xyz', 'www.emre.xyz', 'localhost', '127.0.0.1']);
const THEME_STORAGE_KEY = 'theme';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';
const DARK_CLASS = 'dark';
const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const MOBILE_QUERY = '(max-width: 48rem)';

const BOOKING_URL = 'https://cal.emre.xyz';
const EMAIL = 'z@emre.xyz';
const OWNER_NAME = 'Emre Yılmaz';
const OWNER_ROLE = 'Full-stack architect & consultant';

const siteUrl = (path) => (MAIN_SITE_HOSTS.has(window.location.hostname) ? path : `${MAIN_SITE_ORIGIN}${path}`);

const NAV_ITEMS = [
    { id: 'projects', label: 'Projects', href: () => siteUrl('/projects/') },
    { id: 'blog', label: 'Blog', href: () => 'https://blog.emre.xyz' },
    { id: 'news', label: 'News', href: () => 'https://news.emre.xyz' },
    { id: 'nostr', label: 'Nostr', href: () => 'https://nostr.emre.xyz' },
];

const ICON_SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
const ICON_MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
const ICON_MENU = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
const ICON_CLOSE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

const readStoredTheme = () => {
    try {
        return window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
        // Storage can be blocked (private mode, disabled site data); fall back to the system preference.
        console.warn('emre-header: reading theme preference failed', error);
        return null;
    }
};

const storeTheme = (theme) => {
    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
        console.warn('emre-header: saving theme preference failed', error);
    }
};

const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

class EmreHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._isMenuOpen = false;
        this._abort = null;
    }

    connectedCallback() {
        this._abort = new AbortController();
        this.render();
        this.setupThemeToggle(this._abort.signal);
        this.setupMobileMenu(this._abort.signal);
    }

    disconnectedCallback() {
        if (this._abort) this._abort.abort();
        this._abort = null;
    }

    render() {
        const activePage = this.getAttribute('active-page') || 'home';
        const navLinks = NAV_ITEMS.map(
            (item) =>
                `<a href="${escapeHtml(item.href())}" class="nav-link"${item.id === activePage ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a>`,
        ).join('');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: sticky;
                    top: 0;
                    z-index: 50;
                    background: var(--color-nav-bg);
                    border-bottom: var(--rule-width) solid var(--color-rule);
                    font-family: var(--font-body);
                }
                * { box-sizing: border-box; }
                .bar {
                    max-width: var(--page-max);
                    min-height: var(--nav-height);
                    margin: 0 auto;
                    padding: 0 var(--page-gutter);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--space-md);
                }
                .wordmark {
                    font-family: var(--font-display);
                    font-size: var(--text-base);
                    font-weight: 600;
                    letter-spacing: -0.01em;
                    color: var(--color-ink);
                    text-decoration: none;
                    white-space: nowrap;
                }
                .wordmark:hover { color: var(--color-accent); }
                .nav {
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                }
                .links {
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                }
                .nav-link {
                    position: relative;
                    font-size: var(--text-sm);
                    font-weight: 500;
                    color: var(--color-ink-3);
                    text-decoration: none;
                    white-space: nowrap;
                    padding: var(--space-3xs) 0;
                    transition: color var(--dur-fast) var(--ease-out);
                }
                .nav-link::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: -2px;
                    height: 1px;
                    background: var(--color-accent);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform var(--dur-base) var(--ease-out);
                }
                .nav-link:hover { color: var(--color-ink); }
                .nav-link:hover::after,
                .nav-link[aria-current="page"]::after { transform: scaleX(1); }
                .nav-link[aria-current="page"] { color: var(--color-ink); }
                .cta {
                    display: inline-flex;
                    align-items: center;
                    min-height: 2.25rem;
                    padding: 0 var(--space-sm);
                    border-radius: var(--radius-sm);
                    background: var(--color-accent);
                    color: var(--color-on-accent);
                    font-size: var(--text-sm);
                    font-weight: 600;
                    text-decoration: none;
                    white-space: nowrap;
                    transition: background-color var(--dur-fast) var(--ease-out);
                }
                .cta:hover { background: var(--color-accent-hover); }
                .icon-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 2.25rem;
                    height: 2.25rem;
                    padding: 0;
                    border: var(--rule-width) solid var(--color-rule);
                    border-radius: var(--radius-sm);
                    background: transparent;
                    color: var(--color-ink-2);
                    cursor: pointer;
                    transition: border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
                }
                .icon-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }
                a:focus-visible,
                button:focus-visible {
                    outline: 2px solid var(--color-focus);
                    outline-offset: 3px;
                }
                .menu-btn { display: none; }
                .panel {
                    display: none;
                    border-top: var(--rule-width) solid var(--color-rule);
                    padding: var(--space-xs) var(--page-gutter) var(--space-md);
                }
                .panel[data-open="true"] { display: block; }
                .panel-links {
                    display: flex;
                    flex-direction: column;
                }
                .panel-links .nav-link {
                    font-size: var(--text-base);
                    padding: var(--space-xs) 0;
                    border-bottom: var(--rule-width) solid var(--color-rule);
                }
                .panel-links .nav-link::after { display: none; }
                .panel-links .nav-link[aria-current="page"] { color: var(--color-accent); }
                .panel .cta {
                    margin-top: var(--space-md);
                    width: 100%;
                    justify-content: center;
                    min-height: 2.75rem;
                }
                @media ${MOBILE_QUERY} {
                    .links, .bar .cta { display: none; }
                    .menu-btn { display: inline-flex; }
                    .icon-btn { width: 2.75rem; height: 2.75rem; }
                }
                @media not all and ${MOBILE_QUERY} {
                    .panel[data-open="true"] { display: none; }
                }
                @media (prefers-reduced-motion: reduce) {
                    * { transition-duration: 0ms !important; }
                }
            </style>
            <div class="bar">
                <a href="${escapeHtml(siteUrl('/'))}" class="wordmark"${activePage === 'home' ? ' aria-current="page"' : ''}>${OWNER_NAME}</a>
                <nav class="nav" aria-label="Main">
                    <div class="links">${navLinks}</div>
                    <a href="${BOOKING_URL}" class="cta" target="_blank" rel="noopener noreferrer">Book a call</a>
                    <button type="button" class="icon-btn" id="theme-toggle" aria-label="Switch colour theme"></button>
                    <button type="button" class="icon-btn menu-btn" id="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="menu-panel">${ICON_MENU}</button>
                </nav>
            </div>
            <div class="panel" id="menu-panel" data-open="false">
                <nav class="panel-links" aria-label="Main (mobile)">${navLinks}</nav>
                <a href="${BOOKING_URL}" class="cta" target="_blank" rel="noopener noreferrer">Book a call</a>
            </div>
        `;
    }

    setupMobileMenu(signal) {
        const toggleBtn = this.shadowRoot.getElementById('menu-toggle');
        const panel = this.shadowRoot.getElementById('menu-panel');
        if (!toggleBtn || !panel) return;

        const setOpen = (open) => {
            this._isMenuOpen = open;
            panel.dataset.open = String(open);
            toggleBtn.setAttribute('aria-expanded', String(open));
            toggleBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            toggleBtn.innerHTML = open ? ICON_CLOSE : ICON_MENU;
        };

        toggleBtn.addEventListener('click', () => setOpen(!this._isMenuOpen), { signal });
        panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false), { signal }));

        window.addEventListener(
            'keydown',
            (event) => {
                if (event.key !== 'Escape' || !this._isMenuOpen) return;
                setOpen(false);
                toggleBtn.focus();
            },
            { signal },
        );

        document.addEventListener(
            'click',
            (event) => {
                if (this._isMenuOpen && !event.composedPath().includes(this)) setOpen(false);
            },
            { signal },
        );
    }

    setupThemeToggle(signal) {
        const toggleBtn = this.shadowRoot.getElementById('theme-toggle');
        const root = document.documentElement;
        const systemDark = window.matchMedia(DARK_SCHEME_QUERY);

        const isDark = () => root.classList.contains(DARK_CLASS);

        const updateButton = () => {
            if (!toggleBtn) return;
            const dark = isDark();
            toggleBtn.innerHTML = dark ? ICON_SUN : ICON_MOON;
            toggleBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
        };

        const apply = (theme) => {
            root.classList.toggle(DARK_CLASS, theme === THEME_DARK);
            updateButton();
        };

        // A saved choice wins; otherwise follow the operating-system preference.
        const stored = readStoredTheme();
        if (stored === THEME_DARK || stored === THEME_LIGHT) {
            apply(stored);
        } else {
            apply(systemDark.matches ? THEME_DARK : THEME_LIGHT);
        }

        systemDark.addEventListener(
            'change',
            (event) => {
                const saved = readStoredTheme();
                if (saved === THEME_DARK || saved === THEME_LIGHT) return;
                apply(event.matches ? THEME_DARK : THEME_LIGHT);
            },
            { signal },
        );

        if (toggleBtn) {
            toggleBtn.addEventListener(
                'click',
                () => {
                    const next = isDark() ? THEME_LIGHT : THEME_DARK;
                    storeTheme(next);
                    apply(next);
                },
                { signal },
            );
        }

        // Keep the icon right if another script toggles the class.
        const observer = new MutationObserver(updateButton);
        observer.observe(root, { attributes: true, attributeFilter: ['class'] });
        signal.addEventListener('abort', () => observer.disconnect());
    }
}

class EmreFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const year = new Date().getFullYear();

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin-top: auto;
                    border-top: var(--rule-width) solid var(--color-rule);
                    font-family: var(--font-body);
                }
                * { box-sizing: border-box; }
                .line {
                    max-width: var(--page-max);
                    margin: 0 auto;
                    padding: var(--space-lg) var(--page-gutter);
                    display: flex;
                    flex-wrap: wrap;
                    align-items: baseline;
                    justify-content: space-between;
                    gap: var(--space-sm) var(--space-lg);
                    font-size: var(--text-sm);
                    color: var(--color-ink-3);
                }
                .who { margin: 0; }
                .who strong {
                    font-family: var(--font-display);
                    font-weight: 600;
                    color: var(--color-ink);
                }
                ul {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--space-2xs) var(--space-md);
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                a {
                    color: var(--color-ink-2);
                    text-decoration: none;
                    white-space: nowrap;
                    transition: color var(--dur-fast) var(--ease-out);
                }
                a:hover { color: var(--color-accent); }
                a:focus-visible {
                    outline: 2px solid var(--color-focus);
                    outline-offset: 3px;
                }
                @media (max-width: 40rem) {
                    .line { flex-direction: column; }
                }
                @media (prefers-reduced-motion: reduce) {
                    * { transition-duration: 0ms !important; }
                }
            </style>
            <div class="line">
                <p class="who"><strong>${OWNER_NAME}</strong> · ${escapeHtml(OWNER_ROLE)} · © ${year}</p>
                <ul>
                    <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
                    <li><a href="https://github.com/delirehberi" target="_blank" rel="noopener noreferrer me">GitHub</a></li>
                    <li><a href="${escapeHtml(siteUrl('/resume.pdf'))}">Résumé</a></li>
                    <li><a href="${escapeHtml(siteUrl('/projects/'))}">Projects</a></li>
                </ul>
            </div>
        `;
    }
}

if (!customElements.get('emre-header')) customElements.define('emre-header', EmreHeader);
if (!customElements.get('emre-footer')) customElements.define('emre-footer', EmreFooter);
