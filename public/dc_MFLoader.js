(() => {
    /*** Show a simple loader inside a container */
    function showLoader(containerId) {
        if (!containerId) return;
        const container = document.getElementById(containerId);
        if (!container) return;

        const loader = document.createElement('div');
        loader.id = 'microappLoader';
        loader.style = `
            padding: 2rem;
            text-align: center;
            font-weight: bold;
            font-family: sans-serif;
        `;
        loader.textContent = 'Loading...';
        container.appendChild(loader);
    }

    function hideLoader(containerId) {
        document.getElementById(containerId)?.querySelector('#microappLoader')?.remove();
    }

    /*** Remove previous assets for the same microapp */
    function clearAssets(appName, containerId) {
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) container.innerHTML = '';
        }

        document.querySelectorAll(`script[data-microapp="${appName}"]`).forEach((s) => s.remove());
        document.querySelectorAll(`link[data-microapp="${appName}"]`).forEach((l) => l.remove());
    }

    /*** Inject CSS with retry-once */
    function injectCSS(cssUrl, appName, retry = false) {
        return new Promise((resolve, reject) => {
            document.querySelectorAll(`link[data-microapp="${appName}"]`).forEach((l) => l.remove());

            const link = document.createElement('link');
            link.href = cssUrl;
            link.id = `${appName}-css`;
            link.rel = 'stylesheet';
            link.crossOrigin = 'anonymous';
            link.type = 'text/css';
            link.setAttribute('data-microapp', appName);

            link.onload = () => {
                console.log(`[MFE Loader] CSS loaded: ${cssUrl}`);
                resolve();
            };
            link.onerror = () => {
                if (!retry) {
                    console.warn(`[MFE Loader] Retrying CSS: ${cssUrl}`);
                    injectCSS(cssUrl, appName, true).then(resolve).catch(reject);
                } else {
                    console.error(`[MFE Loader] CSS failed after retry: ${cssUrl}`);
                    reject(new Error(`CSS load failed: ${cssUrl}`));
                }
            };

            document.head.appendChild(link);
        });
    }

    /*** Inject JS with retry-once */
    function injectScript(scriptUrl, appName, retry = false) {
        return new Promise((resolve, reject) => {
            document.querySelectorAll(`script[data-microapp="${appName}"]`).forEach((s) => s.remove());

            const script = document.createElement('script');
            script.src = scriptUrl;
            script.id = `${appName}-script`;
            script.type = 'module';
            script.crossOrigin = 'anonymous';
            script.async = true;
            script.setAttribute('data-microapp', appName);

            script.onload = () => {
                console.log(`[MFE Loader] Script loaded: ${scriptUrl}`);
                resolve();
            };
            script.onerror = () => {
                if (!retry) {
                    console.warn(`[MFE Loader] Retrying script: ${scriptUrl}`);
                    injectScript(scriptUrl, appName, true).then(resolve).catch(reject);
                } else {
                    console.error(`[MFE Loader] Script failed after retry: ${scriptUrl}`);
                    reject(new Error(`Script load failed: ${scriptUrl}`));
                }
            };

            document.body.appendChild(script);
        });
    }

    /*** Fetch and inject assets for a microapp */
    async function loadMicroApp({ microapp, microappUrl, containerId }) {
        try {
            showLoader(containerId);
            clearAssets(microapp, containerId);

            // Fetch manifest.json
            const manifestUrl = `${microappUrl}/${microapp}/app/assets/${microapp}-manifest.json`;
            const response = await fetch(manifestUrl, { cache: 'no-store', mode: 'cors' });

            if (!response.ok) throw new Error(`Failed to fetch manifest for ${microapp}`);

            const manifest = await response.json();
            const scripts = [];
            const styles = [];

            Object.values(manifest).forEach((entry) => {
                if (entry.file?.endsWith('.js')) scripts.push(entry.file.split('/').pop());
                if (entry.file?.endsWith('.css')) styles.push(entry.file.split('/').pop());
            });

            // Inject CSS and JS
            await Promise.all(styles.map((style) =>
                injectCSS(`${microappUrl}/${microapp}/app/assets/css/${style}`, microapp)
            ));
            await Promise.all(scripts.map((script) =>
                injectScript(`${microappUrl}/${microapp}/app/assets/js/${script}`, microapp)
            ));

            console.info(`[MFE Loader] Microapp "${microapp}" loaded successfully.`);
        } catch (error) {
            console.error(`[MFE Loader] Error loading microapp "${microapp}": ${error}`);
            if (containerId) {
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = `<div style="padding:2rem;text-align:center;color:red;">
                        Failed to load microapp "${microapp}"
                    </div>`;
                }
            }
        } finally {
            hideLoader(containerId);
        }
    }
    
    async function init(microapps) {
        if (!Array.isArray(microapps)) {
            console.error('[MFE Loader] Invalid config: must be an array');
            return;
        }

        for (const mfa of microapps) {
            await loadMicroApp(mfa);
        }
    }

    /*** Public API: init multiple microapps */
    window['dcMicroFrontendLoader'] = {
        init
    };
})();
