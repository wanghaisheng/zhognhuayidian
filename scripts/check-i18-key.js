// check-i18n.js
const fs = require('fs');
const path = require('path');

// Correctly determine the workspace root (parent directory of scripts/)
const workspaceRoot = path.resolve(__dirname, '..');
const localeDir = path.join(workspaceRoot, 'locale');

// Get all language directories
const languageDirs = fs.readdirSync(localeDir)
    .filter(item => fs.statSync(path.join(localeDir, item)).isDirectory());

// List of HTML files to check (relative to workspace root)
const htmlFilesToCheck = [
    'index.html',
    'about.html',
    'blog.html',
    'career.html',
    'faq.html',
    'login.html',
    'models.html',
    'platforms.html',
    'privacy.html',
    'reports.html',
    'terms.html',
    'testimonials.html',
];

// --- Helper Functions ---

// Safely reads and parses JSON file
function loadJson(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(content);
        }
    } catch (error) {
        console.error(`Error reading or parsing JSON file ${filePath}:`, error);
    }
    return null;
}

// Gets a nested value from an object using a dot-separated path
function getNestedValue(obj, keyPath) {
    if (!obj || !keyPath) return undefined;
    const keys = keyPath.split('.');
    let current = obj;
    for (const key of keys) {
        if (current === null || typeof current !== 'object' || !(key in current)) {
            return undefined;
        }
        current = current[key];
    }
    return current;
}

// Check if a key exists in a specific JSON file
function checkKeyInJson(key, jsonPath) {
    const jsonData = loadJson(jsonPath);
    return jsonData ? getNestedValue(jsonData, key) !== undefined : false;
}

// Check if a key exists in all language JSON files
function checkKeyInAllLanguages(key, baseName) {
    const missingInLanguages = [];
    languageDirs.forEach(lang => {
        // First check specific JSON file
        const specificJsonPath = path.join(localeDir, lang, `${baseName}.json`);
        const commonJsonPath = path.join(localeDir, lang, '.json');
        
        // Check both specific and common JSON files
        if (!checkKeyInJson(key, specificJsonPath) && !checkKeyInJson(key, commonJsonPath)) {
            missingInLanguages.push(lang);
        }
    });
    return missingInLanguages;
}

// Regex patterns for different types of elements
const patterns = {
    // Elements with data-i18n attribute
    i18nKey: /data-i18n="([^"]+)"/g,
    
    // Elements with data-i18n-placeholder attribute
    i18nPlaceholder: /data-i18n-placeholder="([^"]+)"/g,
    
    // Elements with data-i18n-param attribute
    i18nParam: /data-i18n-param="([^"]+)"/g,
    
    // Potentially untranslated text in common tags
    untranslatedText: /<(p|h[1-6]|span|label|button|a|li|td|th)(?![^>]*(?:data-i18n|data-i18n-placeholder))[^>]*>\s*([^\s<][^<]*?)\s*<\/\1>/g,
    
    // Form elements (input, textarea, select)
    formElements: /<(input|textarea|select)(?![^>]*(?:data-i18n|data-i18n-placeholder))[^>]*>/g,
    
    // Button text
    buttonText: /<button(?![^>]*(?:data-i18n|data-i18n-placeholder))[^>]*>\s*([^<]+)\s*<\/button>/g,
    
    // Label text
    labelText: /<label(?![^>]*(?:data-i18n|data-i18n-placeholder))[^>]*>\s*([^<]+)\s*<\/label>/g
};

// Helper function to find all keys in a JSON object
function getAllKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        const currentKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            keys = keys.concat(getAllKeys(obj[key], currentKey));
        } else {
            keys.push(currentKey);
        }
    }
    return keys;
}

// Find unused keys in JSON files
function findUnusedKeys(jsonData, usedKeys) {
    const allKeys = getAllKeys(jsonData);
    return allKeys.filter(key => !usedKeys.has(key));
}

// --- Main Logic ---

console.log('Starting i18n consistency check...');

const allMissingKeys = {}; // Store missing keys per JSON file { jsonFile: [key1, key2...] }
const allPotentialUntranslated = {}; // Store potential untranslated elements per HTML file
const allMissingTranslations = {}; // Store missing translations per language { lang: { file: [key1, key2...] } }
const allUnusedKeys = {}; // Store unused keys per JSON file { jsonFile: [key1, key2...] }

htmlFilesToCheck.forEach(relativeHtmlPath => {
    const htmlPath = path.join(workspaceRoot, relativeHtmlPath);
    if (!fs.existsSync(htmlPath)) {
        console.warn(`HTML file not found: ${htmlPath}. Skipping.`);
        return;
    }

    console.log(`\n--- Checking: ${relativeHtmlPath} ---`);
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    // Determine specific JSON path
    const baseName = path.basename(relativeHtmlPath, '.html');
    const specificJsonPath = path.join(localeDir, 'en', `${baseName}.json`);
    const commonJsonPath = path.join(localeDir, 'en', 'common.json');
    const specificData = loadJson(specificJsonPath);
    const commonData = loadJson(commonJsonPath);
    const specificJsonFileName = specificData ? path.basename(specificJsonPath) : null;

    const missingKeys = [];
    const foundKeys = new Set();
    const potentialUntranslated = [];

    // Check all patterns
    Object.entries(patterns).forEach(([patternName, pattern]) => {
        let match;
        while ((match = pattern.exec(htmlContent)) !== null) {
            if (patternName === 'i18nKey' || patternName === 'i18nPlaceholder' || patternName === 'i18nParam') {
                const key = match[1];
                foundKeys.add(key);
                
                // Check in specific JSON first, then common
                const valueSpecific = specificData ? getNestedValue(specificData, key) : undefined;
                const valueCommon = commonData ? getNestedValue(commonData, key) : undefined;

                if (valueSpecific === undefined && valueCommon === undefined) {
                    missingKeys.push(key);
                } else {
                    // Check if key exists in all language files
                    const missingInLanguages = checkKeyInAllLanguages(key, baseName);
                    if (missingInLanguages.length > 0) {
                        if (!allMissingTranslations[baseName]) {
                            allMissingTranslations[baseName] = {};
                        }
                        missingInLanguages.forEach(lang => {
                            if (!allMissingTranslations[baseName][lang]) {
                                allMissingTranslations[baseName][lang] = [];
                            }
                            allMissingTranslations[baseName][lang].push(key);
                        });
                    }
                }
            } else {
                // Check for untranslated text
                const text = match[2]?.trim();
                if (text && text.length > 1 && isNaN(text)) {
                    const lineNumber = htmlContent.substring(0, match.index).split('\n').length;
                    potentialUntranslated.push({
                        line: lineNumber,
                        type: patternName,
                        text: text
                    });
                }
            }
        }
    });

    // Check for unused keys in JSON files
    if (specificData) {
        const unusedKeys = findUnusedKeys(specificData, foundKeys);
        if (unusedKeys.length > 0) {
            allUnusedKeys[specificJsonFileName] = unusedKeys;
        }
    }

    // Report findings for this file
    if (missingKeys.length > 0) {
        console.log(`  Missing keys in JSON (${specificJsonFileName || 'common.json'}):`);
        missingKeys.forEach(key => {
            console.log(`    - ${key}`);
            // Determine if this key should go in specific JSON or common.json
            const isCommonKey = key.startsWith('nav.') || key.startsWith('footer.') || key.startsWith('meta.');
            const targetJson = isCommonKey ? 'common.json' : specificJsonFileName;
            if (!allMissingKeys[targetJson]) {
                allMissingKeys[targetJson] = [];
            }
            allMissingKeys[targetJson].push(key);
        });
    } else {
        console.log("  No missing i18n keys found in JSON for keys used in HTML.");
    }

    if (potentialUntranslated.length > 0) {
        console.log(`  Potential untranslated text elements:`);
        potentialUntranslated.forEach(item => {
            console.log(`    - Line ~${item.line}: [${item.type}] ${item.text}`);
        });
        allPotentialUntranslated[relativeHtmlPath] = potentialUntranslated;
    } else {
        console.log("  No obvious untranslated text elements found.");
    }
});

// --- Report Generation Functions ---

function generateReportHeader(title) {
    const line = '='.repeat(80);
    return `\n${line}\n${title}\n${line}\n`;
}

function generateSectionHeader(title) {
    const line = '-'.repeat(80);
    return `\n${line}\n${title}\n${line}\n`;
}

function generateKeyList(keys, indent = 2) {
    return keys.map(key => `${' '.repeat(indent)}• ${key}`).join('\n');
}

function generateLanguageReport(missingTranslations) {
    let report = generateSectionHeader('Missing Translations by Page and Language');
    
    Object.entries(missingTranslations).forEach(([page, languages]) => {
        report += `\nPage: ${page}\n`;
        Object.entries(languages).forEach(([lang, keys]) => {
            report += `\n  Language: ${lang}\n`;
            report += generateKeyList(keys, 4);
        });
    });
    
    return report;
}

function generateMissingKeysReport(missingKeys) {
    let report = generateSectionHeader('Missing Keys by Page and File');
    
    Object.entries(missingKeys).forEach(([file, keys]) => {
        const page = file.split('/').pop().replace('.json', '');
        report += `\nPage: ${page}\nFile: ${file}\n`;
        report += generateKeyList(keys, 2);
    });
    
    return report;
}

function generateUntranslatedReport(untranslated) {
    let report = generateSectionHeader('Potentially Untranslated Text by Page');
    
    Object.entries(untranslated).forEach(([file, items]) => {
        const page = file.split('/').pop().replace('.html', '');
        report += `\nPage: ${page}\n`;
        items.forEach(item => {
            report += `\n  Line ${item.line}: [${item.type}]\n`;
            report += `    Text: "${item.text}"\n`;
        });
    });
    
    return report;
}

function generateUnusedKeysReport(unusedKeys) {
    let report = generateSectionHeader('Unused Keys by Page and File');
    
    Object.entries(unusedKeys).forEach(([file, keys]) => {
        const page = file.split('/').pop().replace('.json', '');
        report += `\nPage: ${page}\nFile: ${file}\n`;
        report += generateKeyList(keys, 2);
    });
    
    return report;
}

function generateJsonSuggestion(missingKeys) {
    let report = generateSectionHeader('Suggested JSON Additions by Page');
    
    Object.entries(missingKeys).forEach(([file, keys]) => {
        const page = file.split('/').pop().replace('.json', '');
        const uniqueKeys = [...new Set(keys)];
        report += `\nPage: ${page}\nFile: ${file}\n`;
        const suggestion = {};
        uniqueKeys.forEach(keyPath => {
            const keys = keyPath.split('.');
            let current = suggestion;
            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    if (!current[key]) current[key] = `NEEDS_TRANSLATION: ${keyPath}`;
                } else {
                    if (!current[key]) current[key] = {};
                    if (typeof current[key] !== 'object') {
                        current[key] = { _CONFLICT_: `Value was previously '${current[key]}'`, _CHILDREN_: {} };
                        current = current[key]._CHILDREN_;
                    } else {
                        current = current[key];
                    }
                }
            });
        });
        report += JSON.stringify(suggestion, null, 2) + '\n';
    });
    
    return report;
}

// Add new functions for generating repair plans
function generateHTMLRepairPlan(page, untranslated) {
    let plan = `HTML Repair Plan for ${page}\n`;
    plan += '='.repeat(80) + '\n\n';
    
    if (untranslated && untranslated.length > 0) {
        plan += 'Missing data-i18n attributes:\n';
        untranslated.forEach(item => {
            plan += `\nLine ${item.line}: [${item.type}]\n`;
            plan += `  Text: "${item.text}"\n`;
            plan += `  Suggested key: ${generateSuggestedKey(item.text)}\n`;
        });
    } else {
        plan += 'No missing data-i18n attributes found.\n';
    }
    
    return plan;
}

function generateJSONRepairPlan(page, missingKeys, unusedKeys) {
    let plan = `JSON Repair Plan for ${page}\n`;
    plan += '='.repeat(80) + '\n\n';
    
    if (missingKeys && missingKeys.length > 0) {
        plan += 'Missing Keys to Add:\n';
        missingKeys.forEach(key => {
            plan += `  • ${key}\n`;
        });
        plan += '\n';
    } else {
        plan += 'No missing keys found.\n\n';
    }
    
    if (unusedKeys && unusedKeys.length > 0) {
        plan += 'Unused Keys to Review:\n';
        unusedKeys.forEach(key => {
            plan += `  • ${key}\n`;
        });
    } else {
        plan += 'No unused keys found.\n';
    }
    
    return plan;
}

function generateSuggestedKey(text) {
    // Convert text to a valid key format
    return text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '.')
        .replace(/^\.+|\.+$/g, '');
}

function saveRepairPlan(page, htmlPlan, jsonPlan) {
    const fs = require('fs');
    const path = require('path');
    
    // Create repair-plans directory if it doesn't exist
    const plansDir = path.join(workspaceRoot, 'repair-plans');
    if (!fs.existsSync(plansDir)) {
        fs.mkdirSync(plansDir);
    }
    
    // Save HTML repair plan
    const htmlPlanPath = path.join(plansDir, `${page}-html-repair-plan.txt`);
    fs.writeFileSync(htmlPlanPath, htmlPlan);
    
    // Save JSON repair plan
    const jsonPlanPath = path.join(plansDir, `${page}-json-repair-plan.txt`);
    fs.writeFileSync(jsonPlanPath, jsonPlan);
    
    console.log(`\nRepair plans saved for ${page}:`);
    console.log(`  • ${htmlPlanPath}`);
    console.log(`  • ${jsonPlanPath}`);
}

// --- Main Report Generation ---

console.log(generateReportHeader('i18n Consistency Check Report'));

// Report missing translations
if (Object.keys(allMissingTranslations).length > 0) {
    console.log(generateLanguageReport(allMissingTranslations));
} else {
    console.log(generateSectionHeader('Translation Status'));
    console.log('✓ All translations are present in language files!');
}

// Report missing keys
if (Object.keys(allMissingKeys).length > 0) {
    console.log(generateMissingKeysReport(allMissingKeys));
    console.log(generateJsonSuggestion(allMissingKeys));
} else {
    console.log(generateSectionHeader('Key Status'));
    console.log('✓ No missing keys found in any checked file!');
}

// Report potentially untranslated text
if (Object.keys(allPotentialUntranslated).length > 0) {
    console.log(generateUntranslatedReport(allPotentialUntranslated));
} else {
    console.log(generateSectionHeader('Untranslated Text Status'));
    console.log('✓ No potential untranslated text elements found!');
}

// Report unused keys
if (Object.keys(allUnusedKeys).length > 0) {
    console.log(generateUnusedKeysReport(allUnusedKeys));
} else {
    console.log(generateSectionHeader('Unused Keys Status'));
    console.log('✓ No unused keys found in any JSON file!');
}

// Summary
console.log(generateSectionHeader('Summary by Page'));
const pageIssues = {};

// Group issues by page
Object.entries(allMissingTranslations).forEach(([page, languages]) => {
    if (!pageIssues[page]) pageIssues[page] = { missingTranslations: 0, missingKeys: 0, untranslated: 0, unusedKeys: 0 };
    Object.values(languages).forEach(keys => {
        pageIssues[page].missingTranslations += keys.length;
    });
});

Object.entries(allMissingKeys).forEach(([file, keys]) => {
    const page = file.split('/').pop().replace('.json', '');
    if (!pageIssues[page]) pageIssues[page] = { missingTranslations: 0, missingKeys: 0, untranslated: 0, unusedKeys: 0 };
    pageIssues[page].missingKeys += keys.length;
});

Object.entries(allPotentialUntranslated).forEach(([file, items]) => {
    const page = file.split('/').pop().replace('.html', '');
    if (!pageIssues[page]) pageIssues[page] = { missingTranslations: 0, missingKeys: 0, untranslated: 0, unusedKeys: 0 };
    pageIssues[page].untranslated += items.length;
});

Object.entries(allUnusedKeys).forEach(([file, keys]) => {
    const page = file.split('/').pop().replace('.json', '');
    if (!pageIssues[page]) pageIssues[page] = { missingTranslations: 0, missingKeys: 0, untranslated: 0, unusedKeys: 0 };
    pageIssues[page].unusedKeys += keys.length;
});

// Generate and save repair plans for each page
Object.entries(pageIssues).forEach(([page, issues]) => {
    console.log(`\nPage: ${page}`);
    console.log(`  Missing Translations: ${issues.missingTranslations}`);
    console.log(`  Missing Keys: ${issues.missingKeys}`);
    console.log(`  Untranslated Text: ${issues.untranslated}`);
    console.log(`  Unused Keys: ${issues.unusedKeys}`);
    
    // Generate repair plans
    const htmlPlan = generateHTMLRepairPlan(
        page,
        allPotentialUntranslated[`${page}.html`]
    );
    
    const jsonPlan = generateJSONRepairPlan(
        page,
        allMissingKeys[`${page}.json`],
        allUnusedKeys[`${page}.json`]
    );
    
    // Save repair plans
    saveRepairPlan(page, htmlPlan, jsonPlan);
    
    // Generate recommendations for this page
    const recommendations = [];
    if (issues.missingTranslations > 0) recommendations.push('Add missing translations to language files');
    if (issues.missingKeys > 0) recommendations.push('Add missing keys to JSON files');
    if (issues.untranslated > 0) recommendations.push('Add data-i18n attributes to untranslated text');
    if (issues.unusedKeys > 0) recommendations.push('Remove or review unused keys in JSON files');
    
    if (recommendations.length > 0) {
        console.log('\n  Recommendations:');
        recommendations.forEach(rec => console.log(`    • ${rec}`));
    }
});

console.log(generateReportHeader('End of Report'));