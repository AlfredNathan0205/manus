"""Focused browser regression checks for the Agent Operations dashboard."""

from playwright.sync_api import sync_playwright

BASE = "https://3000-ibanmbq9326wl25su5fcc-824f3904.us1.manus.computer/"


def verify_viewport(page, width: int, height: int) -> None:
    page.set_viewport_size({"width": width, "height": height})
    page.goto(f"{BASE}?section=operations", wait_until="networkidle")

    dashboard = page.locator("[data-agent-ops]")
    dashboard.wait_for(state="visible")
    dashboard_text = " ".join(dashboard.inner_text().split())
    assert "Every agent observed." in dashboard_text
    assert page.locator("[data-agent-family]").count() == 6
    assert page.locator("[data-ops-human-gate]").get_attribute("aria-checked") == "true"

    page.locator("[data-ops-run]").click()
    page.wait_for_timeout(3400)
    assert "Self-correction prepared" in " ".join(dashboard.inner_text().split())

    page.wait_for_timeout(1800)
    approval = page.locator("[data-ops-approval]")
    approval.wait_for(state="visible")
    approval.click()
    page.wait_for_timeout(1800)
    assert "Corrected route released" in " ".join(dashboard.inner_text().split())

    page.locator("[data-ops-human-gate]").click()
    assert page.locator("[data-ops-human-gate]").get_attribute("aria-checked") == "false"
    page.locator("[data-ops-run]").click()
    page.wait_for_timeout(6600)
    assert page.locator("[data-ops-approval]").count() == 0
    assert "Verified stable" in " ".join(dashboard.inner_text().split())

    overflow = page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
    assert overflow is False


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        verify_viewport(page, 1440, 1000)
        verify_viewport(page, 390, 844)
        browser.close()


if __name__ == "__main__":
    main()
