const { chromium } = require("playwright");

const baseUrl = process.env.AUDIT_URL || "http://127.0.0.1:3000";
const pages = [
  "/",
  "/products",
  "/promos",
  "/about",
  "/help",
  "/quiz",
  "/product/relax-plus",
  "/product/medico-plus",
];

const viewports = [
  { name: "iphone-se", width: 375, height: 667 },
  { name: "android", width: 393, height: 851 },
];

const waitForApp = async (page) => {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(1200);
};

const auditPage = async (browser, viewport, path) => {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: true,
    hasTouch: true,
  });

  const url = `${baseUrl}${path}`;
  const result = {
    viewport: viewport.name,
    path,
    ok: true,
    errors: [],
    warnings: [],
  };

  page.on("console", (message) => {
    if (message.type() === "error") {
      result.warnings.push(`console error: ${message.text().slice(0, 160)}`);
    }
  });

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await waitForApp(page);

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const viewportWidth = window.innerWidth;
      const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
      const scrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
      const overflowing = [];

      for (const el of Array.from(document.body.querySelectorAll("*"))) {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (
          rect.width > viewportWidth + 2 ||
          rect.left < -2 ||
          rect.right > viewportWidth + 2
        ) {
          if (style.position === "fixed" && rect.width <= viewportWidth + 12) continue;
          overflowing.push({
            tag: el.tagName.toLowerCase(),
            className: typeof el.className === "string" ? el.className.slice(0, 80) : "",
            width: Math.round(rect.width),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 70),
          });
        }
      }

      return {
        viewportWidth,
        scrollWidth,
        scrollHeight,
        horizontalOverflow: scrollWidth - viewportWidth,
        overflowElements: overflowing.slice(0, 8),
      };
    });

    if (metrics.horizontalOverflow > 3) {
      result.ok = false;
      result.errors.push(`horizontal overflow ${metrics.horizontalOverflow}px`);
      result.errors.push(
        ...metrics.overflowElements.map(
          (el) => `${el.tag}.${el.className} width=${el.width} left=${el.left} right=${el.right}`
        )
      );
    }

    const beforeScroll = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(250);
    const afterScroll = await page.evaluate(() => window.scrollY);
    const maxScroll = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight
    );

    if (maxScroll > 100 && afterScroll <= beforeScroll) {
      result.ok = false;
      result.errors.push("vertical scroll did not move");
    }

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(250);
    const reachedBottom = await page.evaluate(
      () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8
    );
    if (maxScroll > 100 && !reachedBottom) {
      result.ok = false;
      result.errors.push("could not reach page bottom");
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    const hamburger = page.locator(".ssn-hamburger").first();
    if (await hamburger.isVisible().catch(() => false)) {
      await hamburger.click();
      await page.waitForTimeout(250);
      const menuVisible = await page.locator(".ssn-mobile-menu.open").first().isVisible().catch(() => false);
      if (!menuVisible) {
        result.ok = false;
        result.errors.push("mobile menu did not open");
      }
      const menuOverflow = await page.evaluate(() => {
        const menu = document.querySelector(".ssn-mobile-menu.open");
        if (!menu) return 0;
        const rect = menu.getBoundingClientRect();
        return Math.max(0, rect.right - window.innerWidth, -rect.left);
      });
      if (menuOverflow > 2) {
        result.ok = false;
        result.errors.push(`mobile menu overflows ${Math.round(menuOverflow)}px`);
      }
    }
  } catch (error) {
    result.ok = false;
    result.errors.push(error.message);
  } finally {
    await page.close();
  }

  return result;
};

(async () => {
  const executablePath =
    process.env.PLAYWRIGHT_CHROME_PATH ||
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const browser = await chromium.launch({ headless: true, executablePath });
  const results = [];
  for (const viewport of viewports) {
    for (const path of pages) {
      results.push(await auditPage(browser, viewport, path));
    }
  }
  await browser.close();

  for (const result of results) {
    const status = result.ok ? "OK" : "FAIL";
    console.log(`${status} ${result.viewport} ${result.path}`);
    for (const error of result.errors) console.log(`  error: ${error}`);
    for (const warning of result.warnings.slice(0, 3)) console.log(`  warning: ${warning}`);
  }

  if (results.some((result) => !result.ok)) {
    process.exitCode = 1;
  }
})();
