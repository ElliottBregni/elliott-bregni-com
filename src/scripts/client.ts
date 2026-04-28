// Client-side behaviors: typewriters, scroll reveals, sticky-nav border, tilt-cards,
// and the modernized-ai.com / elliott.bregni.com domain swap on the nav.

(() => {
  // Hostname-based initial scroll: modernized-ai.com lands on the container,
  // elliott.bregni.com stays at top.
  if (!window.location.hash && window.scrollY === 0) {
    const host = window.location.hostname;
    if (host === "modernized-ai.com" || host === "www.modernized-ai.com") {
      const containerEl = document.getElementById("AI");
      if (containerEl) {
        document.documentElement.style.scrollBehavior = "auto";
        containerEl.scrollIntoView();
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = "";
        }, 100);
      }
    }
  }

  // Sticky nav gets a subtle border + glow once the user scrolls past 40px.
  const nav = document.getElementById("nav");
  if (nav) {
    window.addEventListener(
      "scroll",
      () => nav.classList.toggle("scrolled", window.scrollY > 40),
      { passive: true },
    );
  }

  // Typewriter helper.
  function makeTypewriter(elId: string, phrases: string[], startDelay: number) {
    const tw = document.getElementById(elId);
    if (!tw) return;
    let pi = 0;
    let ci = 0;
    let del = false;
    function tick() {
      const p = phrases[pi];
      if (!del) {
        tw!.textContent = p.slice(0, ++ci);
        if (ci === p.length) {
          del = true;
          setTimeout(tick, 2200);
          return;
        }
        setTimeout(tick, 42);
      } else {
        tw!.textContent = p.slice(0, --ci);
        if (ci === 0) {
          del = false;
          pi = (pi + 1) % phrases.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 22);
      }
    }
    setTimeout(tick, startDelay);
  }

  makeTypewriter(
    "typewriter",
    [
      "Data Governance and Security",
      "Building agents that actually work.",
      "AI agents · MCP · RAG",
      "Ann Arbor, MI",
    ],
    900,
  );

  makeTypewriter(
    "typewriter2",
    [
      "SWE III · Full-stack engineer",
      "Ann Arbor, MI",
      "FreightVerify → Overhaul",
      "Harness engineering · Agentic coding",
      "VinView NPS 83 · 95% ETA accuracy",
      "10+ years building",
      "B.S. CIS · Ferris State University",
    ],
    1400,
  );

  // Scroll-reveal: fade-in + slide-up once each .reveal element enters view.
  const obs = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

  // Nav swaps domain name + sign-in visibility based on whether the
  // Modernized AI container is in view.
  const navDomain = document.getElementById("nav-domain-name");
  const navSignin = document.getElementById("nav-signin");
  const containerEl = document.getElementById("AI");
  if (navDomain && containerEl) {
    let lastState: boolean | null = null;
    const applyState = (isModernized: boolean) => {
      if (isModernized === lastState) return;
      lastState = isModernized;
      navDomain.style.opacity = "0";
      setTimeout(() => {
        navDomain.textContent = isModernized ? "modernized-ai" : "elliott.bregni";
        navDomain.style.opacity = "1";
      }, 150);
      document.title = isModernized ? "Modernized AI" : "Elliott Bregni";
      if (navSignin) {
        navSignin.style.opacity = isModernized ? "1" : "0";
        navSignin.style.pointerEvents = isModernized ? "" : "none";
      }
    };
    const navObs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const pastContainer = e.boundingClientRect.top < 0;
          applyState(e.isIntersecting || pastContainer);
        }),
      { threshold: 0.25 },
    );
    navObs.observe(containerEl);
  }

  // Tilt-card: 3D parallax on mouse-move, opens data-href on click.
  document.querySelectorAll<HTMLElement>(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale3d(1.01,1.01,1.01)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
    card.addEventListener("click", () => {
      const h = card.dataset.href;
      if (h && h !== "#") window.open(h, "_blank", "noopener");
    });
  });
})();
