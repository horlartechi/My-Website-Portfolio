document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const nav = document.getElementById("nav");
    const menuBtn = document.getElementById("menuBtn");
    const navContainer = document.querySelector(".nav-container");

    // Restore the saved theme. Light mode is the default.
    body.dataset.theme =
        localStorage.getItem("portfolio-theme") === "dark" ? "dark" : "light";

    // Add the theme button without changing the HTML structure.
    if (navContainer && !document.querySelector(".theme-toggle")) {
        const themeBtn = document.createElement("button");

        themeBtn.type = "button";
        themeBtn.className = "theme-toggle";
        themeBtn.innerHTML =
            '<span class="theme-icon" aria-hidden="true"></span>' +
            '<span class="theme-label"></span>';

        if (menuBtn) {
            navContainer.insertBefore(themeBtn, menuBtn);
        } else {
            navContainer.appendChild(themeBtn);
        }

        function updateThemeButton() {
            const dark = body.dataset.theme === "dark";

            themeBtn.querySelector(".theme-icon").textContent = dark ? "☀" : "☾";
            themeBtn.querySelector(".theme-label").textContent =
                dark ? "Light mode" : "Dark mode";

            themeBtn.setAttribute(
                "aria-label",
                dark ? "Switch to light mode" : "Switch to dark mode"
            );
        }

        updateThemeButton();

        themeBtn.addEventListener("click", () => {
            const nextTheme =
                body.dataset.theme === "dark" ? "light" : "dark";

            body.dataset.theme = nextTheme;
            localStorage.setItem("portfolio-theme", nextTheme);
            updateThemeButton();
        });
    }

    // Mobile menu.
    if (menuBtn && nav) {
        menuBtn.addEventListener("click", () => {
            const open = nav.classList.toggle("active");

            menuBtn.textContent = open ? "✕" : "☰";
            menuBtn.setAttribute("aria-expanded", String(open));
            menuBtn.setAttribute(
                "aria-label",
                open ? "Close navigation menu" : "Open navigation menu"
            );
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                menuBtn.textContent = "☰";
                menuBtn.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", event => {
            if (
                nav.classList.contains("active") &&
                !nav.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                nav.classList.remove("active");
                menuBtn.textContent = "☰";
                menuBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Reveal elements as they enter the screen.
    const animated = document.querySelectorAll(
        ".hero-text, .hero-image, .section-heading, .about-grid, " +
        ".service-card, .project-card, .process-card, .cta-content, .footer-content"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !reducedMotion) {
        animated.forEach(element => element.classList.add("reveal"));

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        animated.forEach(element => observer.observe(element));
    }

    // Current year in the footer.
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    // Highlight the navigation link for the section being viewed.
    const sections = document.querySelectorAll("main section[id]");
    const links = document.querySelectorAll(".nav a[href^='#']");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    links.forEach(link => {
                        link.classList.toggle(
                            "active-link",
                            link.getAttribute("href") === "#" + entry.target.id
                        );
                    });
                }
            });
        }, { rootMargin: "-35% 0px -55% 0px" });

        sections.forEach(section => sectionObserver.observe(section));
    }
});