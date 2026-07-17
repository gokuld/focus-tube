const DEFAULT_SETTINGS = {
    hideShorts: true,
    hideGuideMenuShortsEntry: false
};

const hideShorts = document.getElementById("hide-shorts");
const hideGuideMenuShortsEntry = document.getElementById("hide-guide-menu-shorts-entry");

hideGuideMenuShortsEntry.addEventListener("change", async () => {
    await browser.storage.sync.set({
        hideGuideMenuShortsEntry: hideGuideMenuShortsEntry.checked
    });
});

hideShorts.addEventListener("change", async () => {
    await browser.storage.sync.set({
        hideShorts: hideShorts.checked
    });
});

async function init() {
    const settings = await browser.storage.sync.get(DEFAULT_SETTINGS);

    hideShorts.checked = settings.hideShorts;
    hideGuideMenuShortsEntry.checked = settings.hideGuideMenuShortsEntry;
}

init();
