# Renders tools/share-card.html to assets/img/share-card.png (1200×630).
#   pip install playwright && playwright install chromium
#   python3 -m http.server 8790 --directory ..   # from this repo, serve its parent
#   python3 tools/render-share-card.py http://127.0.0.1:8790/coin-cubby-site/
import sys, asyncio
from playwright.async_api import async_playwright

async def main(base):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1200, "height": 630})
        await pg.goto(base + "tools/share-card.html")
        await pg.wait_for_timeout(800)
        await pg.screenshot(path="assets/img/share-card.png")
        await b.close()

asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8790/coin-cubby-site/"))
