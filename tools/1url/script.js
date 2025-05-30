const rawIdeaInput = document.getElementById('rawIdea');
const targetStyleInput = document.getElementById('targetStyle');
const outputTypeSelect = document.getElementById('outputType'); 
const generateBtn = document.getElementById('generateBtn');
const loadingDiv = document.getElementById('loading');

// Tab elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');

const prdOutputPre = document.getElementById('prdOutput');
const csvOutputPre = document.getElementById('csvOutput');
const landingPageBriefOutputPre = document.getElementById('landingPageBriefOutput');
const landingPageIframe = document.getElementById('landingPageIframe');
const appDesignBriefOutputPre = document.getElementById('appDesignBriefOutput');
const appPrototypeIframe = document.getElementById('appPrototypeIframe');
const fullDemoLandingPageIframe = document.getElementById('fullDemoLandingPageIframe'); 
const fullDemoAppPrototypeIframe = document.getElementById('fullDemoAppPrototypeIframe'); 

// --- START: Google Generative AI SDK Integration ---
const GEMINI_API_KEY = "YOUR_API_KEY"; // !!! REPLACE WITH YOUR ACTUAL API KEY !!!
let genAI;

if (typeof window.GoogleGenerativeAI === "function") {
    try {
        genAI = new window.GoogleGenerativeAI(GEMINI_API_KEY);
        console.log("GoogleGenerativeAI SDK initialized.");
    } catch (e) {
        console.error("Error initializing GoogleGenerativeAI:", e);
        genAI = null; // Ensure genAI is null if initialization fails
    }
} else {
    console.error("GoogleGenerativeAI SDK not loaded. Please ensure it's included in your HTML.");
}
// --- END: Google Generative AI SDK Integration ---

let prompts = {}; 

// Function to load prompts from JSON
async function loadPrompts() {
    try {
        const response = await fetch('./prompts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        prompts = await response.json();
        console.log('Prompts loaded successfully.');
    } catch (error) {
        console.error('Failed to load prompts:', error);
        loadingDiv.textContent = 'Error loading prompts. See console for details.';
        generateBtn.disabled = true; 
        return false;
    }
    return true;
}

// Initially hide all tab panes and disable buttons
tabPanes.forEach(pane => pane.style.display = 'none');
tabButtons.forEach(button => button.disabled = true);

// Load prompts when the script starts
loadPrompts().then(success => {
    if (success) {
        if (!genAI) { // Check if genAI failed to initialize
            loadingDiv.textContent = 'Error: Google Generative AI SDK failed to initialize. Check API Key and console.';
            loadingDiv.style.display = 'block';
            generateBtn.disabled = true;
        } else {
            generateBtn.disabled = false; 
        }
    } else {
        loadingDiv.style.display = 'block'; // Prompts failed to load
    }
});

// Function to show a specific tab
function showTab(tabId) {
    tabPanes.forEach(pane => pane.style.display = 'none');
    tabButtons.forEach(button => button.classList.remove('active'));

    const targetPane = document.getElementById(tabId);
    const targetButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);

    if (targetPane && targetButton) {
        targetPane.style.display = 'block';
        targetButton.classList.add('active');
    }
}

// Add event listeners to tab buttons
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!button.disabled) {
            const tabId = button.getAttribute('data-tab');
            showTab(tabId);
        }
    });
});

// Function to safely set iframe srcdoc, checking for scripts
function setIframeSrcdoc(iframe, htmlContent) {
    if (!htmlContent) {
        iframe.srcdoc = "<p>No HTML content provided.</p>";
        return;
    }
    if (/<script\b[^>]*>.*?<\/script>/is.test(htmlContent)) {
        console.warn("Potential script tag detected in iframe content. Sanitizing.");
        htmlContent = htmlContent.replace(/<script\b[^>]*>.*?<\/script>/gis, '<!-- Script tag removed to prevent execution -->');
    }

    iframe.srcdoc = htmlContent;
}

generateBtn.addEventListener('click', async () => {
    const rawIdea = rawIdeaInput.value.trim();
    const targetStyle = targetStyleInput.value.trim();
    const outputType = outputTypeSelect.value; 

    if (!genAI) { // Double check before trying to use
        alert('Google Generative AI SDK is not initialized. Please check your API key and ensure the SDK is loaded.');
        return;
    }

    if (!rawIdea || !targetStyle) {
        alert('Please enter both a raw idea and a target art style.');
        return;
    }

    if (Object.keys(prompts).length === 0) {
        alert('Prompts not loaded. Please refresh the page or check for errors.');
        return;
    }

    generateBtn.disabled = true;
    loadingDiv.style.display = 'block';
    loadingDiv.textContent = 'Starting workflow...';

    prdOutputPre.textContent = '';
    csvOutputPre.textContent = '';
    landingPageBriefOutputPre.textContent = '';
    landingPageIframe.srcdoc = '';
    appDesignBriefOutputPre.textContent = '';
    appPrototypeIframe.srcdoc = '';
    fullDemoLandingPageIframe.srcdoc = ''; 
    fullDemoAppPrototypeIframe.srcdoc = ''; 

    tabPanes.forEach(pane => pane.style.display = 'none');
    tabButtons.forEach(button => {
        button.disabled = true;
        button.classList.remove('active');
    });

    let prdOutput = ''; 
    let appHtmlContent = ''; 
    let landingPageHtmlContent = ''; 


    try {
        loadingDiv.textContent = 'Step 1: Generating PRD excerpt...';
        const prdPrompt = prompts.prdPrompt.replace('{rawIdea}', rawIdea);

        const modelPrd = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const resultPrd = await modelPrd.generateContent(prdPrompt);
        const responsePrd = await resultPrd.response;
        prdOutput = responsePrd.text(); 
        prdOutputPre.textContent = prdOutput;
        document.querySelector('.tab-button[data-tab="prd"]').disabled = false;
        console.log("Step 1 (PRD) Complete.");

        loadingDiv.textContent = 'Step 2: Generating UI Assets CSV...';
        let csvPrompt = prompts.csvPrompt.replace(/{targetStyle}/g, targetStyle); 
        csvPrompt = csvPrompt.replace('{prdOutput}', prdOutput);

        const modelCsv = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const resultCsv = await modelCsv.generateContent(csvPrompt);
        const responseCsv = await resultCsv.response;
        const csvOutput = responseCsv.text();
        csvOutputPre.textContent = csvOutput;
        document.querySelector('.tab-button[data-tab="csv"]').disabled = false;
        console.log("Step 2 (CSV) Complete.");

        if (outputType === 'app' || outputType === 'website+app') {
            loadingDiv.textContent = 'Step 4: Generating App Prototype and Brief...';
            const appUIStyle = "卡通渲染/3D卡通风格"; 
            let appPrototypePrompt = prompts.appPrototypePrompt.replace('{rawIdea}', rawIdea);
            appPrototypePrompt = appPrototypePrompt.replace(/{targetStyle}/g, targetStyle);
            appPrototypePrompt = appPrototypePrompt.replace('{appUIStyle}', appUIStyle);
            // Ensure appPrototypePrompt instructs the model to return JSON

            const modelAppPrototype = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const resultAppPrototype = await modelAppPrototype.generateContent(appPrototypePrompt);
            const responseAppPrototype = await resultAppPrototype.response;
            const appPrototypeOutput = responseAppPrototype.text();

            try {
                const appPrototypeJson = JSON.parse(appPrototypeOutput);
                if (appPrototypeJson["app-design-brief.md"]) {
                    appDesignBriefOutputPre.textContent = appPrototypeJson["app-design-brief.md"];
                }
                if (appPrototypeJson["app.html"]) {
                    appHtmlContent = appPrototypeJson["app.html"]; 
                    setIframeSrcdoc(appPrototypeIframe, appHtmlContent);
                } else {
                    appDesignBriefOutputPre.textContent += "\n\nError: app.html content not found in JSON.";
                }
                document.querySelector('.tab-button[data-tab="appPrototype"]').disabled = false;
                console.log("Step 4 (App Prototype) Complete.");
            } catch (parseError) {
                console.error("Error parsing app prototype JSON:", parseError);
                try {
                    appDesignBriefOutputPre.textContent = "Error parsing JSON for app prototype: " + parseError.message + "\n\nRaw output:\n" + appPrototypeOutput;
                } catch (displayError) {
                    console.error("Error displaying raw app prototype output:", displayError);
                    appDesignBriefOutputPre.textContent = "Error parsing JSON for app prototype: " + parseError.message + "\n\nCould not display raw output due to error: " + displayError.message;
                }
                document.querySelector('.tab-button[data-tab="appPrototype"]').disabled = false;
            }
        }

        if (outputType === 'website' || outputType === 'website+app') {
            loadingDiv.textContent = 'Step 3: Generating Landing Page and Brief...';
            let landingPagePrompt = prompts.landingPagePrompt.replace('{rawIdea}', rawIdea);
            landingPagePrompt = landingPagePrompt.replace(/{targetStyle}/g, targetStyle);
            // Ensure landingPagePrompt instructs the model to return JSON

            const modelLandingPage = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const resultLandingPage = await modelLandingPage.generateContent(landingPagePrompt);
            const responseLandingPage = await resultLandingPage.response;
            const landingPageOutput = responseLandingPage.text();

            try {
                const landingPageJson = JSON.parse(landingPageOutput);
                if (landingPageJson["landing-page-brief.md"]) {
                    landingPageBriefOutputPre.textContent = landingPageJson["landing-page-brief.md"];
                }
                if (landingPageJson["index.html"]) {
                    landingPageHtmlContent = landingPageJson["index.html"]; 
                    setIframeSrcdoc(landingPageIframe, landingPageHtmlContent);
                } else {
                    landingPageBriefOutputPre.textContent = "Error: index.html content not found in JSON.";
                }
                document.querySelector('.tab-button[data-tab="landingPage"]').disabled = false;
                console.log("Step 3 (Landing Page) Complete.");
            } catch (parseError) {
                console.error("Error parsing landing page JSON:", parseError);
                try {
                    landingPageBriefOutputPre.textContent = "Error parsing JSON for landing page: " + parseError.message + "\n\nRaw output:\n" + landingPageOutput;
                } catch (displayError) {
                    console.error("Error displaying raw landing page output:", displayError);
                    landingPageBriefOutputPre.textContent = "Error parsing JSON for landing page: " + parseError.message + "\n\nCould not display raw output due to error: " + displayError.message;
                }
                document.querySelector('.tab-button[data-tab="landingPage"]').disabled = false;
            }
        }

        document.querySelector('.tab-button[data-tab="prd"]').disabled = false;
        document.querySelector('.tab-button[data-tab="csv"]').disabled = false;

        if (outputType === 'app') {
            showTab('appPrototype');
        } else if (outputType === 'website') {
            showTab('landingPage');
        } else if (outputType === 'website+app') {
            setIframeSrcdoc(fullDemoLandingPageIframe, landingPageHtmlContent);
            setIframeSrcdoc(fullDemoAppPrototypeIframe, appHtmlContent);
            document.querySelector('.tab-button[data-tab="fullDemo"]').disabled = false;
            showTab('fullDemo'); 
        }

    } catch (error) {
        console.error("An error occurred during workflow:", error);
        loadingDiv.textContent = `Error: ${error.message}`;
        if (prdOutput) document.querySelector('.tab-button[data-tab="prd"]').disabled = false;
        if (csvOutputPre.textContent) document.querySelector('.tab-button[data-tab="csv"]').disabled = false;

    } finally {
        generateBtn.disabled = false;
        loadingDiv.style.display = 'none';
    }
});