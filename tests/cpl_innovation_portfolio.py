"""Focused browser regression checks for the CPL innovation portfolio dialog."""

from playwright.sync_api import sync_playwright

BASE = "https://3000-ibanmbq9326wl25su5fcc-824f3904.us1.manus.computer/"


def verify_viewport(page, width: int, height: int) -> None:
    page.set_viewport_size({"width": width, "height": height})
    page.goto(f"{BASE}?cpl=innovation", wait_until="networkidle")

    dialog = page.locator(".cpl-innovation-modal")
    dialog.wait_for(state="visible")
    dialog_text = " ".join(dialog.inner_text().split())
    assert "Industry-transformative apps & agents" in dialog_text
    assert dialog.get_attribute("role") == "dialog"
    assert page.locator("[data-cpl-capability]").count() == 5

    page.locator('[data-cpl-capability="stability"]').click()
    page.wait_for_timeout(550)
    assert "91% reported prediction accuracy" in " ".join(dialog.inner_text().split())

    page.locator('[data-cpl-capability="regulatory"]').click()
    page.wait_for_timeout(550)
    assert "22 autonomous regulatory module agents" in " ".join(dialog.inner_text().split())

    page.locator('[data-cpl-capability="sensity"]').click()
    page.wait_for_timeout(550)
    assert "Measure emotional response to wellness-based fragrance" in " ".join(dialog.inner_text().split())

    overflow = page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
    assert overflow is False

    page.keyboard.press("Escape")
    page.wait_for_timeout(650)
    assert page.locator(".cpl-innovation-modal").count() == 0


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        verify_viewport(page, 1440, 1000)
        verify_viewport(page, 390, 844)
        browser.close()


if __name__ == "__main__":
    main()
