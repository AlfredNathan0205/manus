"""Regression checks for Trend Analysis MCP source-linked evidence console.
Run while the local Vite server is active: python3 tests/trend_analysis_experience.py
"""
import json
from playwright.sync_api import expect, sync_playwright

URL = "http://127.0.0.1:3000/?venture=trend-analysis-mcp"
SIGNALS = [
    ("Elevated gourmands", ["forbes.com", "vogue.com"]),
    ("Fragrance wardrobing", ["vogue.com", "sensient-beauty.com"]),
    ("Quiet, sensitive-by-design scent", ["beautymatter.com"]),
    ("Scent beyond the bottle", ["sensient-beauty.com", "vogue.com"]),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path="/usr/bin/chromium", args=["--no-sandbox"])
    results = []
    for label, viewport, mobile in [("desktop", {"width": 1440, "height": 1100}, False), ("mobile", {"width": 390, "height": 844}, True)]:
        context = browser.new_context(viewport=viewport, has_touch=mobile, is_mobile=mobile)
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(URL, wait_until="networkidle")
        expect(page.locator(".trend-mcp-experience")).to_have_count(1)
        expect(page.locator(".venture-demo-orbit")).to_have_count(0)
        expect(page.locator(".trend-signal-card")).to_have_count(4)
        visible_sources = []
        for index, (name, domains) in enumerate(SIGNALS):
            tab = page.locator(".trend-signal-card").nth(index)
            tab.click()
            expect(tab).to_have_attribute("aria-selected", "true")
            expect(page.locator(".trend-signal-detail h4")).to_have_text(name)
            links = page.locator(".signal-sources a")
            assert links.count() == len(domains)
            hrefs = [links.nth(i).get_attribute("href") for i in range(links.count())]
            assert all(domain in href for domain, href in zip(domains, hrefs)), (name, hrefs)
            assert all(links.nth(i).get_attribute("target") == "_blank" for i in range(links.count()))
            visible_sources.extend(hrefs)
        first_tab = page.locator(".trend-signal-card").first
        first_tab.focus()
        page.keyboard.press("ArrowRight")
        expect(page.locator(".trend-signal-card").nth(1)).to_be_focused()
        expect(page.locator(".trend-signal-card").nth(1)).to_have_attribute("aria-selected", "true")
        page.keyboard.press("End")
        expect(page.locator(".trend-signal-card").nth(3)).to_be_focused()
        expect(page.locator(".trend-signal-card").nth(3)).to_have_attribute("aria-selected", "true")
        metrics = page.locator(".trend-mcp-experience").evaluate("""el => ({
          width: el.getBoundingClientRect().width,
          overflow: el.scrollWidth > el.clientWidth,
          tabs: [...el.querySelectorAll('[role=tab]')].map(tab => ({width: tab.offsetWidth, height: tab.offsetHeight})),
          footer: el.querySelector('.trend-mcp-footer').textContent
        })""")
        assert not metrics["overflow"], metrics
        assert all(tab["height"] >= 44 for tab in metrics["tabs"]), metrics
        assert "not a sales forecast" in metrics["footer"], metrics
        page.get_by_role("button", name="Close product summary").click()
        expect(page.locator(".trend-mcp-experience")).to_have_count(0)
        page.get_by_role("button", name="Open Trend Analysis MCP product summary").click()
        expect(page.locator(".trend-signal-card").first).to_have_attribute("aria-selected", "true")
        page.keyboard.press("Escape")
        expect(page.locator(".trend-mcp-experience")).to_have_count(0)
        assert not errors, errors
        results.append({"viewport": label, "status": "passed", "unique_source_links": len(set(visible_sources)), "errors": errors, **metrics})
        context.close()
    browser.close()
    print(json.dumps(results, indent=2))
