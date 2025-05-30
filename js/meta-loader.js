async function loadMetaTags() {
    const lang = localStorage.getItem('selectedLanguage') || (navigator.language.startsWith('zh') ? 'zh' : 'en');
    const localePath = `/locale/${lang}/index.json`; // Use root-relative path

    try {
        const response = await fetch(localePath);
        if (!response.ok) {
            console.error(`Failed to load locale file: ${localePath}`);
            return;
        }
        const data = await response.json();

        if (data.seo) {
            if (data.seo.title) {
                document.title = data.seo.title;
            }

            let descriptionTag = document.querySelector('meta[name="description"]');
            if (!descriptionTag) {
                descriptionTag = document.createElement('meta');
                descriptionTag.name = "description";
                document.head.appendChild(descriptionTag);
            }
            if (data.seo.description) {
                descriptionTag.content = data.seo.description;
            }

            let keywordsTag = document.querySelector('meta[name="keywords"]');
            if (!keywordsTag) {
                keywordsTag = document.createElement('meta');
                keywordsTag.name = "keywords";
                document.head.appendChild(keywordsTag);
            }
            if (data.seo.keywords) {
                keywordsTag.content = data.seo.keywords;
            }
        }
    } catch (error) {
        console.error('Error loading or applying meta tags:', error);
    }
}

// Load meta tags when the script is executed
loadMetaTags();
