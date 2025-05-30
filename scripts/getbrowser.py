from dotenv import load_dotenv
from DrissionPage import Chromium, ChromiumOptions
import os
import json
import platform
import subprocess
from pathlib import Path

def find_chrome_path():
    """Find Chrome browser path based on operating system"""
    system = platform.system()
    
    if system == "Linux":
        # Common Linux Chrome paths
        chrome_paths = [
            "/usr/bin/google-chrome",
            "/usr/bin/google-chrome-stable",
            "/usr/bin/chromium-browser",
            "/usr/bin/chromium",
            "/snap/bin/chromium",
            "/snap/chromium/current/usr/lib/chromium-browser/chrome",
        ]
        
        # Try to find Chrome using 'which' command
        try:
            chrome_path = subprocess.check_output(
                ["which", "google-chrome"], 
                stderr=subprocess.STDOUT
            ).decode().strip()
            chrome_paths.insert(0, chrome_path)
        except subprocess.CalledProcessError:
            pass
            
        # Check each path
        for path in chrome_paths:
            if os.path.exists(path):
                print(f"Found Chrome at: {path}")
                return path
                
    elif system == "Darwin":  # macOS
        chrome_paths = [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "~/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        ]
        for path in chrome_paths:
            path = os.path.expanduser(path)
            if os.path.exists(path):
                return path
                
    elif system == "Windows":
        chrome_paths = [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe",
            r"%PROGRAMFILES%\Google\Chrome\Application\chrome.exe",
            r"%PROGRAMFILES(X86)%\Google\Chrome\Application\chrome.exe",
            r"C:\Users\Administrator\AppData\Local\Google\Chrome\Bin/chrome.exe"
        ]
        for path in chrome_paths:
            path = os.path.expandvars(path)
            if os.path.exists(path):
                return path
    
    print("Chrome not found in common locations")
    return None

def setup_chrome():
    """Setup Chrome with appropriate configurations"""
    chrome_path = find_chrome_path()
    if not chrome_path:
        raise Exception("Chrome browser not found. Please install Chrome.")
    
    co = ChromiumOptions()
    # co.set_browser_path(chrome_path)
    # co.set_argument('--no-sandbox')  # 无沙盒模式
    # co.set_argument('--headless=new')  # 强制无头模式

    # co.headless()  # 无头模式        co.new_env()
    co.new_env()
    co.headless()

    return Chromium(co)


def main():
    print("System Information:")
    print(f"Operating System: {platform.system()}")
    print(f"OS Version: {platform.version()}")
    print(f"Machine: {platform.machine()}")
    print("\nStarting search volume retrieval...")
    
    try:
        browser = setup_chrome()
        # keywords = get_keywords()
        
            
    except Exception as e:
        print(f"Error in main execution: {str(e)}")
    finally:
        if 'browser' in locals():
            browser.quit()

if __name__ == "__main__":
    main()
