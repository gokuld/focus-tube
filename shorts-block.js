const DEFAULT_SETTINGS = {
    hideShorts: true,
    hideGuideMenuShortsEntry: false
};

const SHORTS_LINK_SELECTOR = 'a[href^="/shorts/"]';
const GUIDE_MENU_ENTRY_SELECTOR = "yt-formatted-string.ytd-guide-entry-renderer";
const HIDDEN_CLASS = "focustube-hidden";

let settings;

function getShortsShelves(node) {
    if (!(node instanceof Element)) {
	return [];
    }
    
    const shortsLinks = node.matches(SHORTS_LINK_SELECTOR)
		      ? [node]
		      : [...node.querySelectorAll(SHORTS_LINK_SELECTOR)]
    
    return shortsLinks.map(s => s.closest(
	"grid-shelf-view-model, ytd-rich-section-renderer"
    )).filter(Boolean)
}

function getGuideMenuShortsEntries(node) {
    if (!(node instanceof Element)) {
	return [];
    }
    
    const guideMenuEntries = node.matches(GUIDE_MENU_ENTRY_SELECTOR)
			   ? [node]
			   : [...node.querySelectorAll(GUIDE_MENU_ENTRY_SELECTOR)]

    return guideMenuEntries
        .filter(e => e.textContent.trim() === "Shorts")
        .map(e => e.closest("ytd-guide-entry-renderer"))
        .filter(Boolean);
}

function setShortsNodesVisibility(root) {

    const shortsShelves = getShortsShelves(root)

    for (const s of shortsShelves) {
	s.classList.toggle(
	    HIDDEN_CLASS,
	    settings.hideShorts
	);
    }

    const guideMenuShortsEntries = getGuideMenuShortsEntries(root)

    for (const e of guideMenuShortsEntries) {
	e.classList.toggle(
	    HIDDEN_CLASS,
	    settings.hideGuideMenuShortsEntry
	);
    }
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
	for (const node of mutation.addedNodes) {
	    setShortsNodesVisibility(node)
	}
    }
});

// Listen for changes in settings
browser.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") {
        return;
    }

    for (const [key, { newValue }] of Object.entries(changes)) {
        settings[key] = newValue;
    }

    setShortsNodesVisibility(document.body);
});


async function init() {
    settings = await browser.storage.sync.get(DEFAULT_SETTINGS);

    observer.observe(document.body, {
	childList: true,
	subtree: true,
    });

    setShortsNodesVisibility(document.body);
}

init();
