"use strict";

/*
 * Ashok Choudhary Portfolio
 * Main JavaScript file
 */

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".navigation");
const navigationLinks = document.querySelectorAll(".navigation a");
const currentYear = document.querySelector("#current-year");


/* Display the current year automatically. */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* Mobile navigation. */

function toggleNavigation() {
    if (!menuButton || !navigation) {
        return;
    }

    const menuIsOpen = navigation.classList.toggle("active");

    menuButton.setAttribute("aria-expanded", String(menuIsOpen));
    menuButton.setAttribute(
        "aria-label",
        menuIsOpen ? "Close navigation menu" : "Open navigation menu"
    );

    document.body.classList.toggle("menu-open", menuIsOpen);
}


function closeNavigation() {
    if (!menuButton || !navigation) {
        return;
    }

    navigation.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
}


if (menuButton && navigation) {
    menuButton.addEventListener("click", toggleNavigation);

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeNavigation();
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 1050) {
            closeNavigation();
        }
    });
}


/* Dark/light theme control. */

const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector(".theme-icon");


function getCurrentTheme() {
    return document.documentElement.dataset.theme || "light";
}


function updateThemeButton(theme) {
    if (!themeToggle || !themeIcon) {
        return;
    }

    const darkModeIsActive = theme === "dark";

    themeIcon.textContent = darkModeIsActive ? "☀" : "☾";
    themeToggle.setAttribute(
        "aria-label",
        darkModeIsActive
            ? "Switch to light theme"
            : "Switch to dark theme"
    );
}


function switchTheme() {
    const newTheme = getCurrentTheme() === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = newTheme;

    try {
        localStorage.setItem("portfolio-theme", newTheme);
    } catch (error) {
        /* The selected theme still works if storage is blocked. */
    }

    updateThemeButton(newTheme);
}


if (themeToggle) {
    updateThemeButton(getCurrentTheme());
    themeToggle.addEventListener("click", switchTheme);
}


/* Reusable clipboard helper with a fallback for older browsers. */

async function copyTextToClipboard(text) {
    if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
    ) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const temporaryInput = document.createElement("textarea");

    temporaryInput.value = text;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.left = "-9999px";
    temporaryInput.style.opacity = "0";

    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    const copySucceeded = document.execCommand("copy");
    temporaryInput.remove();

    if (!copySucceeded) {
        throw new Error("Copy command was unsuccessful.");
    }
}


/* Copy contact email. */

const copyEmailButton = document.querySelector("#copy-email");
const copyStatus = document.querySelector("#copy-status");
let emailStatusTimer;


async function copyEmailAddress() {
    if (!copyEmailButton || !copyStatus) {
        return;
    }

    const emailAddress = copyEmailButton.dataset.email;

    if (!emailAddress) {
        copyStatus.textContent = "Email address is unavailable.";
        return;
    }

    window.clearTimeout(emailStatusTimer);

    try {
        await copyTextToClipboard(emailAddress);
        copyStatus.textContent = "Email copied: " + emailAddress;
        copyEmailButton.textContent = "Email copied âœ“";
    } catch (error) {
        copyStatus.textContent =
            "Copy failed. Please use: " + emailAddress;
        copyEmailButton.textContent = "Copy failed";
    }

    emailStatusTimer = window.setTimeout(function () {
        copyEmailButton.innerHTML =
            'Copy email <span aria-hidden="true">â§‰</span>';
        copyStatus.textContent = "";
    }, 3000);
}


if (copyEmailButton && copyStatus) {
    copyEmailButton.addEventListener("click", copyEmailAddress);
}


/* Interactive code showcase tabs. */

const codeTabs = Array.from(document.querySelectorAll(".code-tab"));
const codePanels = Array.from(document.querySelectorAll(".code-panel"));
const copyCodeButton = document.querySelector("#copy-code-button");
const codeCopyStatus = document.querySelector("#code-copy-status");
let codeStatusTimer;


function activateCodeTab(selectedTab, moveFocus) {
    if (!selectedTab) {
        return;
    }

    const selectedPanelId = selectedTab.getAttribute("aria-controls");
    const selectedPanel = document.getElementById(selectedPanelId);

    codeTabs.forEach(function (tab) {
        const isSelected = tab === selectedTab;

        tab.classList.toggle("active", isSelected);
        tab.setAttribute("aria-selected", String(isSelected));
        tab.setAttribute("tabindex", isSelected ? "0" : "-1");
    });

    codePanels.forEach(function (panel) {
        panel.hidden = panel !== selectedPanel;
    });

    if (copyCodeButton && selectedPanel) {
        const selectedCode = selectedPanel.querySelector("code");

        if (selectedCode && selectedCode.id) {
            copyCodeButton.dataset.copyTarget = selectedCode.id;
        }
    }

    if (codeCopyStatus) {
        codeCopyStatus.textContent = "";
    }

    if (moveFocus) {
        selectedTab.focus();
    }
}


function handleCodeTabKeyboard(event) {
    const currentIndex = codeTabs.indexOf(event.currentTarget);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % codeTabs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (currentIndex - 1 + codeTabs.length) % codeTabs.length;
    } else if (event.key === "Home") {
        nextIndex = 0;
    } else if (event.key === "End") {
        nextIndex = codeTabs.length - 1;
    } else {
        return;
    }

    event.preventDefault();
    activateCodeTab(codeTabs[nextIndex], true);
}


if (codeTabs.length && codePanels.length) {
    codeTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            activateCodeTab(tab, false);
        });

        tab.addEventListener("keydown", handleCodeTabKeyboard);
    });

    const initiallySelectedTab =
        codeTabs.find(function (tab) {
            return tab.getAttribute("aria-selected") === "true";
        }) || codeTabs[0];

    activateCodeTab(initiallySelectedTab, false);
}


async function copyActiveCode() {
    if (!copyCodeButton || !codeCopyStatus) {
        return;
    }

    const targetId = copyCodeButton.dataset.copyTarget;
    const codeElement = targetId ? document.getElementById(targetId) : null;

    if (!codeElement) {
        codeCopyStatus.textContent = "Code block could not be found.";
        return;
    }

    window.clearTimeout(codeStatusTimer);

    try {
        await copyTextToClipboard(codeElement.textContent.trim());
        copyCodeButton.textContent = "Copied âœ“";
        codeCopyStatus.textContent = "Code copied to clipboard.";
    } catch (error) {
        copyCodeButton.textContent = "Copy failed";
        codeCopyStatus.textContent =
            "Copy failed. Please select the code manually.";
    }

    codeStatusTimer = window.setTimeout(function () {
        copyCodeButton.innerHTML =
            'Copy code <span aria-hidden="true">â§‰</span>';
        codeCopyStatus.textContent = "";
    }, 2500);
}


if (copyCodeButton && codeCopyStatus) {
    copyCodeButton.addEventListener("click", copyActiveCode);
}


/* Scroll-reveal animations. */

const reduceMotionIsPreferred = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const revealElements = document.querySelectorAll(
    [
        ".section-heading",
        ".about-content",
        ".expertise-list article",
        ".tools-heading",
        ".tool-card",
        ".timeline-item",
        ".research-heading",
        ".publication-card",
        ".pipeline-heading",
        ".pipeline-card",
        ".projects-heading",
        ".project-card",
        ".code-showcase-heading",
        ".workflow-stages article",
        ".code-browser",
        ".code-showcase-footer",
        ".contact > *"
    ].join(",")
);


function showAllRevealElements() {
    revealElements.forEach(function (element) {
        element.classList.add("is-visible");
    });
}


if (
    reduceMotionIsPreferred ||
    !("IntersectionObserver" in window)
) {
    showAllRevealElements();
} else {
    revealElements.forEach(function (element, index) {
        element.classList.add("reveal-on-scroll");

        const delay = (index % 4) * 70;
        element.style.setProperty("--reveal-delay", delay + "ms");
    });

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            root: null,
            threshold: 0.12,
            rootMargin: "0px 0px -55px 0px"
        }
    );

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });
}
