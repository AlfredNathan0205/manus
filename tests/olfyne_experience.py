"""Regression checks for Olfyne’s interactive, product-native Sillage and Studio views.
Run while the local Vite server is active: python3 tests/olfyne_experience.py
"""
import json
from playwright.sync_api import expect, sync_playwright

URL = "http://127.0.0.1:3000/?venture=olfyne"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path="/usr/bin/chromium", args=["--no-sandbox"])
    results = []
    for label, viewport, mobile in [("desktop", {"width": 1440, "height": 1100}, False), ("mobile", {"width": 390, "height": 844}, True)]:
        context = browser.new_context(viewport=viewport, has_touch=mobile, is_mobile=mobile)
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(URL, wait_until="networkidle")
        expect(page.locator(".olfyne-modal")).to_have_count(1)
        expect(page.locator(".olfyne-official-art, .olfyne-card-art")).to_have_count(0)
        expect(page.locator(".olfyne-product-header > img")).to_have_attribute("src", "/manus-storage/olfyne-favicon_73c2067a.svg")
        expect(page.get_by_role("tab", name="Sillage")).to_have_attribute("aria-selected", "true")
        expect(page.locator(".olfyne-workspace.sillage-workspace")).to_have_count(1)
        expect(page.locator(".pyramid-layer")).to_have_count(3)
        for index, expected in enumerate(["Top notes", "Heart notes", "Base notes"]):
            page.locator(".pyramid-layer").nth(index).click()
            expect(page.locator(".sillage-layer-detail span")).to_have_text(expected)
            expect(page.locator(".pyramid-layer").nth(index)).to_have_attribute("aria-pressed", "true")
        page.get_by_role("tab", name="Studio").click()
        expect(page.get_by_role("tab", name="Studio")).to_have_attribute("aria-selected", "true")
        expect(page.locator(".studio-workspace")).to_have_count(1)
        expect(page.locator(".studio-materials button")).to_have_count(4)
        for index in range(4):
            material = page.locator(".studio-materials button").nth(index)
            material.click()
            expect(material).to_have_attribute("aria-pressed", "true")
            expect(page.locator(".studio-inspector > strong")).to_have_text(material.locator("strong").inner_text())
        expect(page.locator(".studio-screening")).to_contain_text("IFRA compliant")
        page.get_by_role("tab", name="Studio").focus()
        page.keyboard.press("ArrowLeft")
        expect(page.get_by_role("tab", name="Sillage")).to_be_focused()
        expect(page.get_by_role("tab", name="Sillage")).to_have_attribute("aria-selected", "true")
        page.keyboard.press("End")
        expect(page.get_by_role("tab", name="Studio")).to_be_focused()
        expect(page.get_by_role("tab", name="Studio")).to_have_attribute("aria-selected", "true")
        metrics = page.locator(".olfyne-experience").evaluate("""el => ({
          width: el.getBoundingClientRect().width,
          overflow: el.scrollWidth > el.clientWidth,
          tabs: [...el.querySelectorAll('[role=tab]')].map(tab => ({width: tab.offsetWidth, height: tab.offsetHeight})),
          links: [...el.querySelectorAll('a')].map(a => ({href: a.href, target: a.target}))
        })""")
        assert not metrics["overflow"], metrics
        assert all(tab["height"] >= 44 for tab in metrics["tabs"]), metrics
        assert metrics["links"] == [{"href": "https://www.olfyne.io/", "target": "_blank"}], metrics
        page.get_by_role("button", name="Close product summary").click()
        expect(page.locator(".olfyne-modal")).to_have_count(0)
        page.get_by_role("button", name="Open Olfyne product summary").click()
        expect(page.get_by_role("tab", name="Sillage")).to_have_attribute("aria-selected", "true")
        page.keyboard.press("Escape")
        expect(page.locator(".olfyne-modal")).to_have_count(0)
        assert not errors, errors
        results.append({"viewport": label, "status": "passed", "errors": errors, **metrics})
        context.close()
    browser.close()
    print(json.dumps(results, indent=2))
