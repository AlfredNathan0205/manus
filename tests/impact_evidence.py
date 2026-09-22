"""Focused browser regression checks for the reported operating-impact page."""

from playwright.sync_api import sync_playwright

BASE = "https://3000-ibanmbq9326wl25su5fcc-824f3904.us1.manus.computer/?section=impact"


def check_page(page):
    page.goto(BASE, wait_until="networkidle")
    rail = page.locator(".impact-proof-rail")
    rail.wait_for(state="visible")
    tabs = rail.get_by_role("tab")
    assert tabs.count() == 3
    assert "60 → 30" in tabs.nth(0).inner_text()
    assert "1,440×" in tabs.nth(1).inner_text()
    assert "£100k" in tabs.nth(2).inner_text().lower()

    expected = [
        "30-person lower operating footprint",
        "Order → cash",
        "No synthetic payback or NPV",
    ]
    for index, copy in enumerate(expected):
        tabs.nth(index).click()
        page.wait_for_timeout(350)
        detail = page.locator("#impact-evidence-detail")
        detail.wait_for(state="visible")
        assert tabs.nth(index).get_attribute("aria-selected") == "true"
        assert copy.lower() in detail.inner_text().lower(), detail.inner_text()

    page_text = page.locator("body").inner_text()
    assert "Three-year NPV" not in page_text
    assert "Payback period" not in page_text
    assert "£100K one-time build" in page_text


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", headless=True)
        desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
        check_page(desktop)

        mobile = browser.new_page(viewport={"width": 390, "height": 1000}, is_mobile=True)
        check_page(mobile)
        assert not mobile.evaluate("document.documentElement.scrollWidth > window.innerWidth")
        browser.close()


if __name__ == "__main__":
    main()
