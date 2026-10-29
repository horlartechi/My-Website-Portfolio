document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const nav = document.getElementById("nav");
    const menuBtn = document.getElementById("menuBtn");
    const navContainer = document.querySelector(".nav-container");

    // ========================================
    // THEME: DARK BY DEFAULT
    // ========================================

    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem("portfolio-theme");
    } catch (error) {
        console.warn("Could not read saved theme preference.");
    }

    body.dataset.theme = savedTheme === "light" ? "light" : "dark";

    // Create the theme toggle button.
    if (navContainer && !document.querySelector(".theme-toggle")) {
        const themeBtn = document.createElement("button");

        themeBtn.type = "button";
        themeBtn.className = "theme-toggle";
        themeBtn.innerHTML = `
            <span class="theme-icon" aria-hidden="true"></span>
            <span class="theme-label"></span>
        `;

        if (menuBtn && menuBtn.parentElement === navContainer) {
            navContainer.insertBefore(themeBtn, menuBtn);
        } else {
            navContainer.appendChild(themeBtn);
        }

        function updateThemeButton() {
            const dark = body.dataset.theme === "dark";

            themeBtn.querySelector(".theme-icon").textContent =
                dark ? "☀" : "☾";

            themeBtn.querySelector(".theme-label").textContent =
                dark ? "Light mode" : "Dark mode";

            themeBtn.setAttribute(
                "aria-label",
                dark ? "Switch to light mode" : "Switch to dark mode"
            );

            themeBtn.setAttribute(
                "title",
                dark ? "Switch to light mode" : "Switch to dark mode"
            );
        }

        updateThemeButton();

        themeBtn.addEventListener("click", () => {
            const nextTheme =
                body.dataset.theme === "dark" ? "light" : "dark";

            body.dataset.theme = nextTheme;

            try {
                localStorage.setItem("portfolio-theme", nextTheme);
            } catch (error) {
                console.warn("Could not save theme preference.");
            }

            updateThemeButton();
        });
    }

    // ========================================
    // MOBILE NAVIGATION
    // ========================================

    if (menuBtn && nav) {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open navigation menu");

        function closeMenu() {
            nav.classList.remove("active");
            menuBtn.textContent = "☰";
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.setAttribute(
                "aria-label",
                "Open navigation menu"
            );
        }

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
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", event => {
            if (
                nav.classList.contains("active") &&
                !nav.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                closeMenu();
            }
        });

        // Close the mobile menu when returning to desktop width.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================

    const animated = document.querySelectorAll(
        ".hero-text, .hero-image, .section-heading, .about-grid, " +
        ".service-card, .project-card, .process-card, " +
        ".cta-content, .footer-content"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !reducedMotion) {
        animated.forEach(element => {
            element.classList.add("reveal");
        });

        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });

        animated.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        animated.forEach(element => {
            element.classList.add("visible");
        });
    }

    // ========================================
    // AUTOMATIC FOOTER YEAR
    // ========================================

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // ========================================
    // ACTIVE NAVIGATION LINK
    // ========================================

    const sections = document.querySelectorAll("main section[id]");
    const links = document.querySelectorAll(".nav a[href^='#']");

    if ("IntersectionObserver" in window && sections.length) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                links.forEach(link => {
                    const isActive =
                        link.getAttribute("href") ===
                        "#" + entry.target.id;

                    link.classList.toggle("active-link", isActive);
                });
            });
        }, {
            rootMargin: "-35% 0px -55% 0px"
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // ========================================
    // PROJECT CONTACT FORM
    // ========================================

    const contactForm = document.getElementById("projectContactForm");
    const formStatus = document.getElementById("formStatus");

    if (contactForm && formStatus) {
        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        const originalButtonText = submitButton
            ? submitButton.textContent.trim()
            : "Send Project Enquiry";

        contactForm.addEventListener("submit", async event => {
            event.preventDefault();

            // Check the form before sending.
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            // Show the sending message.
            formStatus.textContent = "Sending your enquiry...";
            formStatus.className = "form-status is-visible is-info";

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: {
                        Accept: "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("The form submission failed.");
                }

                // Show success without leaving the page.
                formStatus.textContent =
                    "Thank you! Your enquiry has been sent successfully. I'll get back to you soon.";

                formStatus.className = "form-status is-visible is-success";

                // Clear the form after successful submission.
                contactForm.reset();

            } catch (error) {
                console.error("Contact form error:", error);

                formStatus.textContent =
                    "Sorry, your enquiry could not be sent. Please try again or contact me directly by WhatsApp or email.";

                formStatus.className = "form-status is-visible is-error";

            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }
        });
    }
});