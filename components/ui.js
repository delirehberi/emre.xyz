class EmreHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupThemeToggle();
    }

    render() {
        const activePage = this.getAttribute('active-page') || 'home';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    background: var(--emre-nav-bg);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    border-bottom: 1px solid var(--emre-nav-border);
                    position: sticky;
                    top: 0;
                    z-index: 50;
                    font-family: 'Fira Sans', sans-serif;
                }
                .nav-container {
                    max-width: 48rem;
                    margin: 0 auto;
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .logo {
                    font-weight: 700;
                    font-size: 1.25rem;
                    color: var(--emre-text);
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .logo-img {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                }
                .nav-links {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                }
                .nav-link {
                    color: var(--emre-text);
                    text-decoration: none;
                    font-size: 0.95rem;
                    font-weight: 500;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                }
                .nav-link:hover, .nav-link.active {
                    opacity: 1;
                    color: var(--emre-primary);
                }
                .theme-toggle {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--emre-text);
                    padding: 0.5rem;
                    border-radius: 9999px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }
                .theme-toggle:hover {
                    background: rgba(128, 128, 128, 0.1);
                }

                @media (max-width: 600px) {
                    .logo-text { display: none; }
                    .nav-links { gap: 1rem; }
                }
            </style>
            <div class="nav-container">
                <a href="https://emre.xyz" class="logo">
                    <img src="https://github.com/delirehberi.png" alt="Emre" class="logo-img">
                    <span class="logo-text">Emre Yılmaz</span>
                </a>
                <div class="nav-links">
                    <a href="https://emre.xyz" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
                    <a href="https://blog.emre.xyz" class="nav-link ${activePage === 'blog' ? 'active' : ''}">Blog</a>
                    <a href="https://news.emre.xyz" class="nav-link ${activePage === 'news' ? 'active' : ''}">News</a>
                    <a href="https://nostr.emre.xyz" class="nav-link ${activePage === 'nostr' ? 'active' : ''}">Nostr</a>
                    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle Dark Mode">
                        <span id="theme-icon"></span>
                    </button>
                </div>
            </div>
        `;
    }

    setupThemeToggle() {
        const toggleBtn = this.shadowRoot.getElementById('theme-toggle');
        const iconSpan = this.shadowRoot.getElementById('theme-icon');
        const htmlElement = document.documentElement;

        const updateIcon = () => {
            if (htmlElement.classList.contains('dark')) {
                iconSpan.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
            } else {
                iconSpan.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
            }
        };

        const setDark = () => {
            htmlElement.classList.add('dark');
            const darkStyle = document.getElementById('darkModeStyle');
            if (darkStyle) darkStyle.disabled = false;
        };

        const setLight = () => {
            htmlElement.classList.remove('dark');
            const darkStyle = document.getElementById('darkModeStyle');
            if (darkStyle) darkStyle.disabled = true;
        };

        // Initialize based on localStorage, default to dark mode
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setLight();
        } else {
            setDark();
        }
        updateIcon();

        // Listen for clicks
        toggleBtn.addEventListener('click', () => {
            if (htmlElement.classList.contains('dark')) {
                setLight();
                localStorage.setItem('theme', 'light');
            } else {
                setDark();
                localStorage.setItem('theme', 'dark');
            }
            updateIcon();
        });

        // Watch for external class changes
        const observer = new MutationObserver(() => updateIcon());
        observer.observe(htmlElement, { attributes: true, attributeFilter: ['class'] });
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
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    background: transparent;
                    border-top: 1px solid var(--emre-nav-border);
                    margin-top: auto;
                    font-family: 'Fira Sans', sans-serif;
                }
                .footer-container {
                    max-width: 48rem;
                    margin: 0 auto;
                    padding: 2rem 1rem;
                    text-align: center;
                    color: var(--emre-text);
                    opacity: 0.6;
                    font-size: 0.875rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: center;
                }
                .footer-links {
                    display: flex;
                    gap: 1rem;
                }
                .footer-links a {
                    color: var(--emre-text);
                    text-decoration: none;
                    font-size: 1.25rem;
                    transition: color 0.2s;
                }
                .footer-links a:hover {
                    color: var(--emre-primary);
                }
            </style>
            <div class="footer-container">
                <div class="footer-links">
                    <a href="https://github.com/delirehberi" aria-label="GitHub" target="_blank" rel="noopener">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                    </a>
                    <a href="https://linkedin.com/in/delirehberi" aria-label="LinkedIn" target="_blank" rel="noopener">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href="mailto:z@emre.xyz" aria-label="Email">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    </a>
                </div>
                <div>
                    &copy; ${new Date().getFullYear()} Emre Yılmaz. All rights reserved.
                </div>
            </div>
        `;
    }
}

customElements.define('emre-header', EmreHeader);
customElements.define('emre-footer', EmreFooter);
