"""Focused browser regression checks for the presentation laser pointer."""

from playwright.sync_api import sync_playwright

BASE = "https://3000-ibanmbq9326wl25su5fcc-824f3904.us1.manus.computer/"


def main():
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path="/usr/bin/chromium", headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1000})
        page.goto(BASE, wait_until="networkidle")

        page.locator(".presentation-button").click()
        page.locator(".app-shell.presenting").wait_for(state="visible")
        pointer_toggle = page.get_by_role("button", name="Pointer")
        assert pointer_toggle.is_visible()
        assert pointer_toggle.get_attribute("aria-pressed") == "false"

        pointer_toggle.click()
        pointer = page.locator(".presentation-pointer")
        pointer.wait_for(state="visible")
        page.mouse.move(350, 285)
        page.wait_for_timeout(50)
        first_transform = pointer.evaluate("node => getComputedStyle(node).transform")
        page.mouse.move(920, 540)
        page.wait_for_timeout(50)
        second_transform = pointer.evaluate("node => getComputedStyle(node).transform")
        assert first_transform != second_transform
        assert page.locator(".app-shell.pointer-active").count() == 1

        page.keyboard.press("l")
        page.wait_for_timeout(50)
        assert page.locator(".presentation-pointer").count() == 0
        assert page.locator(".app-shell.pointer-active").count() == 0

        page.locator(".presentation-button").click()
        page.wait_for_timeout(100)
        assert page.locator(".app-shell.presenting").count() == 0
        assert page.locator(".presentation-pointer").count() == 0

        browser.close()


if __name__ == "__main__":
    main()
