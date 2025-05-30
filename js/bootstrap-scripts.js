// bootstrap-scripts.js
(function() {
    const scriptsToLoad = [
        '/js/meta-loader.js', // Use root-relative path
        '/js/canonical-loader.js', // Use root-relative path
        '/js/alternate-loader.js', // Use root-relative path
        '/js/ldjson-loader.js', // Use root-relative path
        '/js/main.js' // Use root-relative path
    ];

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false; // Load scripts sequentially
            script.onload = () => {
                console.log(`${src} loaded successfully.`);
                resolve();
            };
            script.onerror = () => {
                console.error(`Failed to load script: ${src}`);
                reject(new Error(`Failed to load script: ${src}`));
            };
            document.head.appendChild(script);
        });
    }

    async function loadAllScripts() {
        for (const scriptSrc of scriptsToLoad) {
            try {
                await loadScript(scriptSrc + '?v=' + Date.now()); // Add cache busting
            } catch (error) {
                console.error(error.message);
                // Decide if you want to stop loading other scripts on error
            }
        }
        console.log('All bootstrap scripts loaded.');
    }

    // Start loading scripts when the DOM is ready, or immediately if already ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllScripts);
    } else {
        loadAllScripts();
    }
})();