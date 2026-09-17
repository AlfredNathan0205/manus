"""Browser regression checks for the CortiSleeve product walkthrough.
Run with Python and Playwright installed while the local Vite server is running.
"""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE_URL = "http://127.0.0.1:3000/?venture=cortisleeve"
TITLES = ["Flexible silicone sleeve", "Dry-electrode sensor pads", "Micro-pebble module", "Blue status indicator"]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path="/usr/bin/chromium", args=["--no-sandbox"])
    results = []
    for name, width, height, touch in [("desktop", 1440, 1100, False), ("mobile", 390, 844, True)]:
        context = browser.new_context(viewport={"width": width, "height": height}, has_touch=touch, is_mobile=touch)
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(BASE_URL, wait_until="networkidle")
        expect(page.locator(".sensor-hotspot")).to_have_count(4)
        expect(page.locator(".venture-modal .cortisleeve-wordmark")).to_have_attribute("src", "/manus-storage/cortisleeve-supplied-wordmark_30e0cbd1.png")
        for index, title in enumerate(TITLES):
            hotspot = page.locator(".sensor-hotspot").nth(index)
            if touch:
                hotspot.tap()
            else:
                hotspot.hover()
            expect(page.locator(".sensor-detail h4")).to_have_text(title)
            expect(hotspot).to_have_attribute("aria-pressed", "true")
            expect(page.locator(".sensor-leaders line.active")).to_have_count(1)
        page.get_by_role("button", name="Start again").click()
        expect(page.locator(".sensor-detail h4")).to_have_text(TITLES[0])
        expect(page.get_by_role("button", name="Previous hardware feature")).to_be_disabled()
        page.get_by_role("button", name="Next feature").click()
        expect(page.locator(".sensor-detail h4")).to_have_text(TITLES[1])
        page.get_by_role("button", name="Previous hardware feature").click()
        expect(page.locator(".sensor-detail h4")).to_have_text(TITLES[0])
        page.locator(".sensor-hotspot").nth(2).focus()
        expect(page.locator(".sensor-detail h4")).to_have_text(TITLES[2])
        page.locator(".cortisleeve-source a").focus()
        page.keyboard.press("Tab")
        expect(page.locator(".venture-modal-close")).to_be_focused()
        page.keyboard.press("Shift+Tab")
        expect(page.locator(".cortisleeve-source a")).to_be_focused()
        page.emulate_media(reduced_motion="reduce")
        page.locator(".sensor-hotspot").nth(3).click()
        expect(page.locator(".sensor-detail h4")).to_have_text(TITLES[3])
        measurements = page.locator(".sensor-walkthrough").evaluate("""el => ({
            width: el.getBoundingClientRect().width,
            overflow: el.scrollWidth > el.clientWidth,
            hotspots: [...el.querySelectorAll('.sensor-hotspot')].map(b => ({w: b.offsetWidth, h: b.offsetHeight})),
            imageLoaded: el.querySelector('img').naturalWidth === 1600
        })""")
        assert not measurements["overflow"], measurements
        assert measurements["imageLoaded"], measurements
        assert all(b["w"] >= 44 and b["h"] >= 44 for b in measurements["hotspots"])
        page.locator(".sensor-walkthrough").screenshot(path=f"/tmp/cortisleeve-walkthrough-{name}.png")
        page.keyboard.press("Escape")
        expect(page.locator(".venture-modal")).to_have_count(0)
        page.get_by_role("button", name="Open CortiSleeve product summary").click()
        expect(page.locator(".sensor-detail h4")).to_have_text(TITLES[0])
        page.get_by_role("button", name="Close product summary").click()
        expect(page.locator(".venture-modal")).to_have_count(0)
        assert not errors, errors
        results.append({"viewport": name, "status": "passed", "errors": errors, **measurements})
        context.close()
    browser.close()
    print(json.dumps(results, indent=2))
