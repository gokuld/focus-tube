const SHORTS_SHELF_SELECTOR = "ytd-rich-shelf-renderer[is-shorts]"

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
	for (const node of mutation.addedNodes) {
	    removeShorts(node)
	}
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});

function removeShorts(root) {
    if (!(root instanceof Element)) return;

    // Is the root itself a Shorts shelf?
    if (root.matches(SHORTS_SHELF_SELECTOR)) {
        root.remove();
        return;
    }

    // Or does it contain any?
    let shorts_shelves = document.querySelectorAll(SHORTS_SHELF_SELECTOR)

    for (s of shorts_shelves) {
	s.closest("ytd-rich-section-renderer").remove()
    }
}

