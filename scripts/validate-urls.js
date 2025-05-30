const URLValidator = require('./url-validator');
const path = require('path');

async function main() {
    const configPath = path.resolve(__dirname, 'config.json');
    const config = require(configPath);
    const baseUrl = config.baseUrl || 'https://mood-island.borninsea.com';
    
    const validator = new URLValidator(baseUrl);
    const results = await validator.validateDirectory(path.resolve(__dirname, '..'));

    let output = '\n=== URL 验证结果 ===\n\n';

    if (results.errors.length > 0) {
        output += '❌ 错误:\n';
        results.errors.forEach(error => output += `  - ${error}\n`);
        output += '\n';
    }

    if (results.warnings.length > 0) {
        output += '⚠️ 警告:\n';
        results.warnings.forEach(warning => output += `  - ${warning}\n`);
        output += '\n';
    }

    if (results.success) {
        output += '✅ 未发现严重问题!\n';
    } else {
        output += '❌ 请在部署前修复以上问题。\n';
    }

    // 将结果写入文件
    fs.writeFileSync(path.resolve(__dirname, '..', 'validation-results.txt'), output);
    console.log(output);

    if (!results.success) {
        process.exit(1);
    }
}

main().catch(error => {
    const errorMessage = `验证失败: ${error}\n`;
    fs.writeFileSync(path.resolve(__dirname, '..', 'validation-results.txt'), errorMessage);
    console.error(errorMessage);
    process.exit(1);
});