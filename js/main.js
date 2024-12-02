// Main application logic
class EndoCalc {
    constructor() {
        this.baseUrl = this.getBaseUrl();
        // Initialize containers after DOM is loaded
        this.mainContainer = null;
        this.calculatorContainer = null;
        this.initializeApp();
        this.registerServiceWorker();
    }

    getBaseUrl() {
        const baseElement = document.querySelector('base');
        if (baseElement) {
            return new URL(baseElement.href).pathname;
        }
        return '/';
    }

    initializeApp() {
        // Initialize DOM elements
        this.mainContainer = document.getElementById('main-container');
        this.calculatorContainer = document.getElementById('calculator-container');

        if (!this.mainContainer || !this.calculatorContainer) {
            console.error('Required DOM elements not found');
            return;
        }

        this.setupEventListeners();

        // Handle initial route
        const hash = window.location.hash;
        if (hash) {
            this.loadCalculator(hash.substring(1));
        } else {
            this.showMainMenu();
        }
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                // Force reload service worker on each page load during development
                if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
                    await navigator.serviceWorker.getRegistrations().then(function(registrations) {
                        for(let registration of registrations) {
                            registration.unregister();
                        }
                    });
                }

                const registration = await navigator.serviceWorker.register('./sw.js');
                console.log('Service Worker registered successfully:', registration.scope);

                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                this.showUpdateNotification();
                            } else {
                                console.log('Service Worker installed for the first time');
                            }
                        }
                    });
                });

                // Handle offline/online events
                window.addEventListener('online', () => {
                    this.updateOnlineStatus(true);
                    this.syncContent();
                });
                window.addEventListener('offline', () => this.updateOnlineStatus(false));
                this.updateOnlineStatus(navigator.onLine);

                // Check if we're loading from cache
                if (registration.active) {
                    const cachedResponse = await caches.match(window.location.href);
                    if (cachedResponse) {
                        console.log('Loading from cache');
                        this.updateOnlineStatus(navigator.onLine);
                    }
                }

            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    async syncContent() {
        // Reload calculators when coming back online
        const hash = window.location.hash;
        if (hash) {
            const calculatorId = hash.substring(1);
            await this.loadCalculator(calculatorId);
        }
    }

    setupEventListeners() {
        // Handle navigation
        window.addEventListener('hashchange', (e) => {
            const calculator = window.location.hash.substring(1);
            if (calculator) {
                this.loadCalculator(calculator);
            } else {
                this.showMainMenu();
            }
        });

        // Handle calculator links
        document.querySelectorAll('.calculator-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const calculator = e.target.getAttribute('href').substring(1);
                window.location.hash = calculator;
            });
        });

        // Handle back button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('back-button')) {
                e.preventDefault();
                this.navigateBack();
            }
        });
    }

    async loadCalculator(calculatorId) {
        if (!this.mainContainer || !this.calculatorContainer) {
            console.error('Required DOM elements not found');
            return;
        }

        try {
            console.log(`Loading calculator: ${calculatorId}`);
            
            // Hide main menu and show calculator container
            this.mainContainer.classList.add('hidden');
            this.calculatorContainer.classList.remove('hidden');

            // Get the current script's path
            const scriptPath = document.currentScript?.src || import.meta.url;
            const baseUrl = new URL('.', scriptPath).href;
            const modulePath = new URL(`calculators/${calculatorId}.js`, baseUrl).href;
            
            console.log('Loading module from:', modulePath);

            const module = await import(modulePath);
            console.log('Module loaded successfully');
            const calculator = new module.default();
            this.renderCalculator(calculator);
        } catch (error) {
            console.error(`Failed to load calculator: ${calculatorId}`, error);
            this.showError(`Failed to load calculator: ${calculatorId}`);
            
            // Try alternate path if first attempt fails
            try {
                const alternatePath = `/js/calculators/${calculatorId}.js`;
                console.log('Trying alternate path:', alternatePath);
                const module = await import(alternatePath);
                console.log('Module loaded successfully from alternate path');
                const calculator = new module.default();
                this.renderCalculator(calculator);
            } catch (secondError) {
                console.error('Both path attempts failed:', secondError);
                this.showError(`Failed to load calculator: ${calculatorId}`);
            }
        }
    }

    renderCalculator(calculator) {
        if (!this.calculatorContainer) return;

        this.calculatorContainer.innerHTML = `
            <div class="calculator-page">
                <div class="calculator-header">
                    <button class="back-button">← Back to Menu</button>
                    <h2>${calculator.name}</h2>
                </div>
                <div class="calculator-content"></div>
            </div>
        `;

        const contentContainer = this.calculatorContainer.querySelector('.calculator-content');
        calculator.render(contentContainer);
    }

    showMainMenu() {
        if (!this.mainContainer || !this.calculatorContainer) return;

        this.mainContainer.classList.remove('hidden');
        this.calculatorContainer.classList.add('hidden');
        window.location.hash = '';
    }

    navigateBack() {
        this.showMainMenu();
    }

    showError(message) {
        if (!this.calculatorContainer) return;

        this.calculatorContainer.innerHTML = `
            <div class="calculator-page">
                <div class="calculator-header">
                    <button class="back-button">← Back to Menu</button>
                    <h2>Error</h2>
                </div>
                <div class="error-message">
                    <p>${message}</p>
                </div>
            </div>
        `;
    }

    updateOnlineStatus(isOnline) {
        const statusElement = document.getElementById('connection-status');
        if (!statusElement) {
            const header = document.querySelector('.header');
            if (!header) return;

            const status = document.createElement('div');
            status.id = 'connection-status';
            status.style.fontSize = '0.8rem';
            status.style.marginTop = '0.5rem';
            header.appendChild(status);
        }

        const status = document.getElementById('connection-status');
        if (status) {
            status.textContent = isOnline ? '🟢 Online' : '🔴 Offline - Using Cached Data';
            status.style.color = isOnline ? '#68D391' : '#FC8181';
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '1rem';
        notification.style.right = '1rem';
        notification.style.backgroundColor = '#2c7a9e';
        notification.style.color = 'white';
        notification.style.padding = '1rem';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        notification.style.zIndex = '1000';
        notification.innerHTML = `
            New version available! 
            <button onclick="window.location.reload()" 
                    style="margin-left: 1rem; background: white; color: #2c7a9e; 
                           border: none; padding: 0.25rem 0.5rem; border-radius: 2px; 
                           cursor: pointer;">
                Refresh
            </button>
        `;
        document.body.appendChild(notification);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.endoCalc = new EndoCalc();
});
