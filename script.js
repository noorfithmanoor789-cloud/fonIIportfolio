const body = document.body;
const loader = document.getElementById("loader");
const header = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const scrollTopButton = document.getElementById("scrollTop");
const typingText = document.getElementById("typingText");
const form = document.querySelector(".contact-form");
const formNote = document.getElementById("formNote");

body.classList.add("loading");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("is-hidden");
    body.classList.remove("loading");
  }, 700);

  if (window.AOS) {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: true,
      offset: 90
    });
  }

  if (window.lucide) {
    lucide.createIcons();
  }
});

const typingPhrases = [
  "Nursing Student Digital Portfolio",
  "FON 2 Academic Presentation",
  "Clinical Learning & Professional Growth",
  "Compassionate Future Nurse"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const phrase = typingPhrases[phraseIndex];
  const visible = phrase.slice(0, charIndex);
  typingText.textContent = visible;

  if (!isDeleting && charIndex < phrase.length) {
    charIndex += 1;
    setTimeout(typeLoop, 58);
    return;
  }

  if (!isDeleting && charIndex === phrase.length) {
    isDeleting = true;
    setTimeout(typeLoop, 1350);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeLoop, 30);
    return;
  }

  isDeleting = false;
  phraseIndex = (phraseIndex + 1) % typingPhrases.length;
  setTimeout(typeLoop, 350);
}

typeLoop();

function updateHeader() {
  const scrolled = window.scrollY > 24;
  header.classList.toggle("scrolled", scrolled);
  scrollTopButton.classList.toggle("show", window.scrollY > 520);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  body.classList.toggle("menu-open", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const navItems = [...document.querySelectorAll(".nav-links a")];

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navItems.forEach((item) => {
      item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-38% 0px -55% 0px", threshold: 0 });

sections.forEach((section) => activeObserver.observe(section));

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const counter = entry.target;
    const target = Number(counter.dataset.target);
    const duration = 1250;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    observer.unobserve(counter);
  });
}, { threshold: 0.6 });

document.querySelectorAll(".counter").forEach((counter) => counterObserver.observe(counter));

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formNote.textContent = "Thank you. This demo contact form is ready for portfolio presentation.";
  form.reset();
});

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
let width = 0;
let height = 0;
let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resizeCanvas() {
  width = canvas.width = window.innerWidth * window.devicePixelRatio;
  height = canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  createParticles();
}

function createParticles() {
  const count = Math.min(Math.floor(window.innerWidth / 18), 72);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 2.6 + 1.2,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    alpha: Math.random() * 0.35 + 0.14
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -20) particle.x = window.innerWidth + 20;
    if (particle.x > window.innerWidth + 20) particle.x = -20;
    if (particle.y < -20) particle.y = window.innerHeight + 20;
    if (particle.y > window.innerHeight + 20) particle.y = -20;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 156, 220, ${particle.alpha})`;
    ctx.fill();

    for (let j = index + 1; j < particles.length; j += 1) {
      const other = particles[j];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 118) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(0, 194, 255, ${0.1 * (1 - distance / 118)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  if (!reducedMotion) requestAnimationFrame(drawParticles);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
if (!reducedMotion) drawParticles();
