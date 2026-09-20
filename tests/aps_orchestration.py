"""Focused browser regression checks for the illustrative LangChain APS flow."""
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = "https://3000-ibanmbq9326wl25su5fcc-824f3904.us1.manus.computer/?section=aps"
SCREENSHOT = "/tmp/aps-orchestration-mobile.png"


def wait_for_aps(page):
    page.goto(BASE, wait_until="networkidle")
    page.locator(".aps-experience").scroll_into_view_if_needed()
    page.locator(".aps-experience").wait_for(state="visible")


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", headless=True)
        desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
        wait_for_aps(desktop)

        assert desktop.locator(".aps-agent").count() == 5
        assert "Constraint-aware orchestration" in desktop.locator(".aps-supervisor").inner_text()
        desktop.get_by_role("button", name="Demand surge").click()
        assert desktop.locator(".aps-shell").get_attribute("data-aps-scenario") == "surge"
        desktop.get_by_role("button", name="Run plan").click()
        desktop.wait_for_timeout(5200)
        assert desktop.locator(".aps-agent.complete").count() == 5
        approval = desktop.locator(".aps-approval-card button")
        assert not approval.is_disabled()
        approval.click()
        desktop.wait_for_timeout(120)
        assert "released to mes" in approval.inner_text().lower()
        assert desktop.locator(".aps-toolbar-status b").inner_text().lower() == "mes released"

        mobile = browser.new_page(viewport={"width": 390, "height": 1000}, is_mobile=True)
        wait_for_aps(mobile)
        overflow = mobile.evaluate("document.documentElement.scrollWidth > window.innerWidth")
        assert not overflow, "APS layout creates horizontal overflow on mobile"
        assert mobile.locator(".aps-agent").count() == 5
        mobile.screenshot(path=SCREENSHOT, full_page=False)

        browser.close()
    assert Path(SCREENSHOT).is_file()
    print("APS orchestration regression checks passed")


if __name__ == "__main__":
    main()
