const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'dashboard', url: 'http://localhost:3000/', title: 'Dashboard' },
  { name: 'analyzer', url: 'http://localhost:3000/analyzer', title: 'Log Analyzer' },
  { name: 'health', url: 'http://localhost:3000/health', title: 'Health Checker' },
  { name: 'automation', url: 'http://localhost:3000/automation', title: 'Automation Generator' },
  { name: 'history', url: 'http://localhost:3000/history', title: 'History' },
  { name: 'nodes', url: 'http://localhost:3000/nodes', title: 'Node Registry' },
];

const screenshotsDir = path.join(__dirname, '..', 'screenshots');

async function takeScreenshots() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    for (const page of pages) {
      console.log(`📸 Taking screenshot: ${page.title}...`);
      
      const browserPage = await browser.newPage();
      await browserPage.setViewport({ width: 1280, height: 720 });
      
      try {
        await browserPage.goto(page.url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Wait for page to fully render
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const screenshotPath = path.join(screenshotsDir, `${page.name}.png`);
        await browserPage.screenshot({ path: screenshotPath, fullPage: false });
        
        console.log(`✅ Saved: ${screenshotPath}`);
      } catch (error) {
        console.error(`❌ Error taking screenshot for ${page.name}:`, error.message);
      } finally {
        await browserPage.close();
      }
    }

    console.log('\n✅ All screenshots taken successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

takeScreenshots();
