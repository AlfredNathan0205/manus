"""Focused browser regression checks for the CEO and CFO operating-impact views."""

from playwright.sync_api import sync_playwright

BASE = "https://3000-ibanmbq9326wl25su5fcc-824f3904.us1.manus.computer/?section=impact"


LENS_EXPECTATIONS = {
    "CEO": {
        "cards": ["45k", "2×", "1,440×"],
        "details": [
            "45,000 customer orders need a faster operating model",
            "1,500 orders rather than 750",
            "Days became minutes before the customer has to wait",
        ],
        "monthly": "Protect the customer promise across 45,000 annual orders",
        "team": "750 to 1,500 orders per operating person",
    },
    "CFO": {
        "cards": ["£100k", "60 → 30", "£630k"],
        "details": [
            "£100K changed the operating control model",
            "30 people rather than 60",
            "£630K annualised gross CS cost delta",
        ],
        "monthly": "Track the cost basis, flow speed and human-review load",
        "team": "£52.5K monthly and £630K annualised gross cost delta",
    },
}


def choose_lens(page, lens):
    page.get_by_role("button", name=lens, exact=True).click()
    page.wait_for_timeout(350)


def check_lens(page, lens):
    expected = LENS_EXPECTATIONS[lens]
    choose_lens(page, lens)

    rail = page.locator(".impact-proof-rail")
    rail.wait_for(state="visible")
    tabs = rail.get_by_role("tab")
    assert tabs.count() == 3
    for index, copy in enumerate(expected["cards"]):
        assert copy.lower() in tabs.nth(index).inner_text().lower()
        tabs.nth(index).click()
        page.wait_for_timeout(350)
        detail = page.locator("#impact-evidence-detail")
        detail.wait_for(state="visible")
        assert tabs.nth(index).get_attribute("aria-selected") == "true"
        assert copy.lower() in detail.inner_text().lower() or expected["details"][index].lower() in detail.inner_text().lower(), detail.inner_text()

    page_text = page.locator("body").inner_text()
    assert expected["monthly"] in page_text
    assert "45,000 annual customer orders" in page_text
    assert "Three-year NPV" not in page_text
    assert "Payback period" not in page_text

    dashboard_tabs = page.locator(".monthly-dashboard-tabs button")
    assert dashboard_tabs.count() == 3
    monthly_expected = [expected["team"], "Order → cash", "Human intervention rate"]
    for index, copy in enumerate(monthly_expected):
        dashboard_tabs.nth(index).click()
        page.wait_for_timeout(300)
        panel = page.locator(".monthly-dashboard-panel")
        panel.wait_for(state="visible")
        assert dashboard_tabs.nth(index).get_attribute("aria-pressed") == "true"
        assert copy.lower() in panel.inner_text().lower(), panel.inner_text()

    exception_panel = page.locator(".monthly-dashboard-panel--exceptions")
    assert "7%" in exception_panel.inner_text()
    assert "3,150" in exception_panel.inner_text()
    assert "263" in exception_panel.inner_text()
    assert "Jan" not in exception_panel.inner_text()


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", headless=True)
        desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
        desktop.goto(BASE, wait_until="networkidle")
        check_lens(desktop, "CEO")
        check_lens(desktop, "CFO")

        mobile = browser.new_page(viewport={"width": 390, "height": 1000}, is_mobile=True)
        mobile.goto(BASE, wait_until="networkidle")
        check_lens(mobile, "CEO")
        check_lens(mobile, "CFO")
        assert not mobile.evaluate("document.documentElement.scrollWidth > window.innerWidth")
        browser.close()


if __name__ == "__main__":
    main()
