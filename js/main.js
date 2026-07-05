/* Rishaba Entertainments — interactions */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  var progress = document.getElementById("scrollProgress");
  var toTop = document.getElementById("toTop");
  var body = document.body;

  /* ---- sticky nav shadow + scroll progress + back-to-top ---- */
  var ticking = false;
  function updateScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (nav) nav.classList.toggle("is-scrolled", y > 24);

    if (progress) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = pct + "%";
    }

    if (toTop) toTop.classList.toggle("is-show", y > 600);

    ticking = false;
  }
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateScroll, { passive: true });
  updateScroll();

  /* ---- mobile menu ---- */
  function setMenu(open) {
    links.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    body.classList.toggle("no-scroll", open);
  }
  function closeMenu() { setMenu(false); }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      setMenu(!links.classList.contains("is-open"));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    // close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) closeMenu();
    });
    // reset when resizing back to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && links.classList.contains("is-open")) closeMenu();
    });
  }

  /* ---- back to top ---- */
  if (toTop) {
    toTop.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---- scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- scrollspy: highlight active nav link ---- */
  var navAnchors = links ? links.querySelectorAll('a[href^="#"]') : [];
  var sections = [];
  navAnchors.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    var sec = id && document.getElementById(id);
    if (sec) sections.push({ a: a, sec: sec });
  });
  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            navAnchors.forEach(function (a) { a.classList.remove("is-active"); });
            var match = sections.filter(function (s) { return s.sec === e.target; })[0];
            if (match) match.a.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s.sec); });
  }

  /* ---- contact form -> opens email client (no backend needed) ---- */
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var subject = form.subject.value.trim();
      var message = form.message.value.trim();

      if (!name || !email || !message) {
        note.textContent = "Please fill in your name, email and message.";
        note.className = "form__note is-err";
        return;
      }

      var mailBody =
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        message;
      var mailto =
        "mailto:srinivas@rishabaentertainments.com,jananisen@gmail.com" +
        "?subject=" + encodeURIComponent(subject || ("Enquiry from " + name)) +
        "&body=" + encodeURIComponent(mailBody);

      window.location.href = mailto;
      note.textContent = "Opening your email app… if nothing happens, write to srinivas@rishabaentertainments.com";
      note.className = "form__note is-ok";
      form.reset();
    });
  }

  /* ---- footer year ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
