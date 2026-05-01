/* ================================================================
   YAHYA BERKE ÖZÇUBUKCU — Portfolio JavaScript
   Features: Loader, Cursor, Navbar, Typing, Scroll Reveal,
             Skill Bars, Project Filter, Form Validation,
             Back to Top, Language Switcher (TR / EN)
================================================================ */

/* ── 0. LANGUAGE DATA ───────────────────────────────────────── */
const i18n = {
  tr: {
    typed: ["Yazılım Geliştirici", "Bilgisayar Müh. Öğrencisi", "Freelance Developer", "UEFA Gönüllüsü 🏆", "TFF Lisanslı Hakem", "Flutter Öğrencisi"],
    formErrors: {
      nameRequired: "Lütfen adınızı girin.",
      emailRequired: "Lütfen e-posta adresinizi girin.",
      emailInvalid:  "Geçerli bir e-posta adresi girin.",
      msgRequired:  "Lütfen mesajınızı yazın.",
      msgShort:     "Mesaj en az 10 karakter olmalı.",
    }
  },
  en: {
    typed: ["Software Developer", "Computer Eng. Student", "Freelance Developer", "UEFA Volunteer 🏆", "TFF Licensed Referee", "Flutter Learner"],
    formErrors: {
      nameRequired: "Please enter your name.",
      emailRequired: "Please enter your email.",
      emailInvalid:  "Enter a valid email address.",
      msgRequired:  "Please write your message.",
      msgShort:     "Message must be at least 10 characters.",
    }
  }
};

let currentLang = "tr"; // default

/* ── 1. LOADER ──────────────────────────────────────────────── */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
    // trigger hero reveal after loader
    document.querySelectorAll("#home .reveal-up, #home .reveal-left, #home .reveal-right").forEach(el => {
      el.classList.add("visible");
    });
  }, 1600);
});

/* ── 2. CUSTOM CURSOR ───────────────────────────────────────── */
const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursor-follower");

if (cursor && follower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  });

  // Smooth follower with RAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + "px";
    follower.style.top  = followerY + "px";
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Scale on hover
  document.querySelectorAll("a, button, .project-card, .skill-category").forEach(el => {
    el.addEventListener("mouseenter", () => {
      follower.style.width = "60px"; follower.style.height = "60px";
      follower.style.borderColor = "rgba(0,212,255,0.6)";
    });
    el.addEventListener("mouseleave", () => {
      follower.style.width = "36px"; follower.style.height = "36px";
      follower.style.borderColor = "rgba(0,212,255,0.4)";
    });
  });
}

/* ── 3. NAVBAR ──────────────────────────────────────────────── */
const navbar  = document.getElementById("navbar");
const hamburger  = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  // Back to top button
  document.getElementById("backToTop").classList.toggle("visible", window.scrollY > 500);
});

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open");
});

// Close mobile menu on link click
mobileMenu.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
  });
});

/* ── 4. SMOOTH SCROLL ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"));
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

/* ── 5. BACK TO TOP ─────────────────────────────────────────── */
document.getElementById("backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ── 6. TYPING ANIMATION ────────────────────────────────────── */
const typedEl = document.getElementById("typedText");
let typedIdx = 0, charIdx = 0, deleting = false;

function type() {
  const words = i18n[currentLang].typed;
  const word = words[typedIdx % words.length];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++charIdx);
    if (charIdx === word.length) { deleting = true; setTimeout(type, 2000); return; }
  } else {
    typedEl.textContent = word.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; typedIdx++; }
  }
  setTimeout(type, deleting ? 60 : 100);
}
setTimeout(type, 2200);

/* ── 7. SCROLL REVEAL ───────────────────────────────────────── */
const revealEls = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── 8. ANIMATED COUNTERS (About stats) ─────────────────────── */
const statNums = document.querySelectorAll(".stat-num[data-count]");

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 40);
}

/* ── 9. SKILL BAR ANIMATION ─────────────────────────────────── */
const skillBars = document.querySelectorAll(".skill-bar-fill[data-width]");

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      setTimeout(() => {
        bar.style.width = bar.dataset.width + "%";
      }, 200);
      skillObserver.unobserve(bar);
    }
  });
}, { threshold: 0.4 });

skillBars.forEach(bar => skillObserver.observe(bar));

/* ── 10. PROJECT FILTER ──────────────────────────────────────── */
const filterBtns  = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !show);
      if (show) {
        card.style.animation = "none";
        requestAnimationFrame(() => {
          card.style.animation = "";
        });
      }
    });
  });
});

/* ── 11. CONTACT FORM VALIDATION ────────────────────────────── */
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", e => {
  e.preventDefault();
  const errors = i18n[currentLang].formErrors;
  let valid = true;

  const name    = document.getElementById("name");
  const email   = document.getElementById("email");
  const message = document.getElementById("message");
  const nameErr = document.getElementById("nameError");
  const emailErr = document.getElementById("emailError");
  const msgErr  = document.getElementById("msgError");

  // Reset
  [name, email, message].forEach(f => f.classList.remove("error"));
  [nameErr, emailErr, msgErr].forEach(e => e.textContent = "");

  if (!name.value.trim()) {
    name.classList.add("error");
    nameErr.textContent = errors.nameRequired;
    valid = false;
  }
  if (!email.value.trim()) {
    email.classList.add("error");
    emailErr.textContent = errors.emailRequired;
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.classList.add("error");
    emailErr.textContent = errors.emailInvalid;
    valid = false;
  }
  if (!message.value.trim()) {
    message.classList.add("error");
    msgErr.textContent = errors.msgRequired;
    valid = false;
  } else if (message.value.trim().length < 10) {
    message.classList.add("error");
    msgErr.textContent = errors.msgShort;
    valid = false;
  }

  if (valid) {
    const btn = contactForm.querySelector(".btn-primary");
    const formData = new FormData(contactForm);

    btn.style.opacity = "0.6";
    btn.style.pointerEvents = "none";
    btn.querySelector("span").setAttribute("data-tr", "Gönderiliyor...");
    btn.querySelector("span").textContent = "Gönderiliyor...";

    fetch("https://formspree.io/f/mqenadlj", {
      method: "POST",
      body: formData,
      headers: { "Accept": "application/json" }
    })
    .then(response => {
      if (response.ok) {
        contactForm.reset();
        document.getElementById("formSuccess").classList.add("show");
        setTimeout(() => document.getElementById("formSuccess").classList.remove("show"), 6000);
      } else {
        alert("Bir hata oluştu, lütfen tekrar deneyin.");
      }
    })
    .catch(() => alert("Bağlantı hatası, lütfen tekrar deneyin."))
    .finally(() => {
      btn.style.opacity = "";
      btn.style.pointerEvents = "";
      btn.querySelector("span").textContent = currentLang === "tr" ? "Mesajı Gönder" : "Send Message";
    });
  }
});

/* ── 12. LANGUAGE SWITCHER ───────────────────────────────────── */
const langBtns = document.querySelectorAll(".lang-btn");

langBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    if (lang === currentLang) return;
    currentLang = lang;

    // Toggle active class
    langBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Translate all elements with data-tr / data-en
    translatePage();

    // Restart typing animation
    typedIdx = 0; charIdx = 0; deleting = false;
    if (typedEl) typedEl.textContent = "";
  });
});

function translatePage() {
  // Elements with simple text
  document.querySelectorAll(`[data-${currentLang}]`).forEach(el => {
    const text = el.getAttribute(`data-${currentLang}`);
    if (!text) return;

    // If it's a nav link, input label, button span, p, span — set innerHTML for gradient spans
    if (el.tagName === "H2") {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  // Update html lang attribute
  document.documentElement.lang = currentLang;

  // Update filter buttons text
  document.querySelectorAll(".filter-btn").forEach(btn => {
    const t = btn.getAttribute(`data-${currentLang}`);
    if (t) btn.textContent = t;
  });
}

/* ── 13. ACTIVE NAV LINK HIGHLIGHT (scroll-spy) ─────────────── */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = "";
        link.style.fontWeight = "";
      });
      const id = entry.target.id;
      document.querySelectorAll(`.nav-links a[href="#${id}"], .mobile-menu a[href="#${id}"]`).forEach(link => {
        link.style.color = "var(--accent-1)";
      });
    }
  });
}, { threshold: 0.4, rootMargin: "-40px 0px -40px 0px" });

sections.forEach(s => spyObserver.observe(s));

/* ── 14. PARALLAX ORB on mouse move ─────────────────────────── */
const orbs = document.querySelectorAll(".orb");
document.addEventListener("mousemove", e => {
  const { innerWidth: W, innerHeight: H } = window;
  const x = (e.clientX / W - 0.5);
  const y = (e.clientY / H - 0.5);
  orbs.forEach((orb, i) => {
    const depth = (i + 1) * 18;
    orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
  });
});
