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
        desktop.locator(".aps-agent").nth(2).click()
        dossier = desktop.locator(".aps-agent-dossier")
        dossier.wait_for(state="visible")
        dossier_text = dossier.inner_text().lower()
        assert "sequencing agent" in dossier_text
        assert "reads" in dossier_text and "tests" in dossier_text
        assert "bounded decision" in dossier_text and "human control" in dossier_text
        desktop.get_by_role("button", name="Close Sequencing Agent details").click()
        dossier.wait_for(state="detached")

        output_titles = [
            "Forecast confidence",
            "Capacity heatmap",
            "Recommended production sequence",
            "Protected scenario comparison",
            "Schedule recovery proposal",
        ]
        for index, title in enumerate(output_titles):
            desktop.locator(".aps-agent").nth(index).click()
            dossier.wait_for(state="visible")
            assert title.lower() in desktop.locator(".aps-output-card").inner_text().lower()

        desktop.get_by_role("button", name="Demand surge").click()
        assert desktop.locator(".aps-shell").get_attribute("data-aps-scenario") == "surge"
        desktop.locator(".aps-agent").nth(0).click()
        assert "+18%" in desktop.locator(".aps-output-card").inner_text()
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
        mobile.locator(".aps-agent").nth(4).click()
        mobile_dossier = mobile.locator(".aps-agent-dossier")
        mobile_dossier.wait_for(state="visible")
        assert "Schedule Adjustment Agent" in mobile_dossier.inner_text()
        assert "Schedule recovery proposal" in mobile.locator(".aps-output-card").inner_text()
        overflow = mobile.evaluate("document.documentElement.scrollWidth > window.innerWidth")
        assert not overflow, "Expanded APS dossier creates horizontal overflow on mobile"
        mobile.screenshot(path=SCREENSHOT, full_page=False)

        browser.close()
    assert Path(SCREENSHOT).is_file()
    print("APS orchestration regression checks passed")


if __name__ == "__main__":
    main()
