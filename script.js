// ===== Navbar: blurred background after scrolling =====
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ===== Close the mobile menu after clicking a link =====
(function () {
  const menu = document.getElementById('menu');
  if (!menu) return;
  menu.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item, .btn-tint').forEach(link => {
    link.addEventListener('click', () => {
      if (menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    });
  });
})();

// ===== Newsletter form (connect to your email service here) =====
(function () {
  const form = document.getElementById('news');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('msg').textContent = 'تم الاشتراك. شكراً لك!';
    e.target.reset();
  });
})();

// ===== Client logos marquee =====
// أضيفي مسارات الشعارات هنا (الملفات داخل customer/)
const CLIENT_LOGOS = [
  'customer/zid.logo.png',
  'customer/astroe.logo.png',
  'customer/glo.logo.png',
  'customer/larder.logo.png',
  'customer/panther.logo.png',
  'customer/qwa.logo.png',
  'customer/rsm.logo.png',
  'customer/saaef.logo.png',
  'customer/shona.logo.png',
  'customer/sight.logo.png',
  'customer/skends.logo.png',
  'customer/teclamin.logo.png',
  'customer/tur.logo.png'
  
];
(function () {
  const track = document.querySelector('#clients .track');
  if (!track || !CLIENT_LOGOS.length) return;
  // بدون lazy: كل الشعارات تُحمَّل قبل ما توصل للشاشة فلا تختفي.
  // خانة ثابتة العرض لكل شعار (من الـCSS) تجعل الحركة دقيقة ومتصلة.
  const set = CLIENT_LOGOS.map(src => {
    const name = src.split('/').pop().replace('.logo.png', '');
    return `<img src="${src}" alt="${name}" width="130" height="40" decoding="async">`;
  }).join('');
  // نكرر المجموعة مرتين: الحركة تنتقل نصف العرض بالضبط فتكون بلا فراغ
  track.innerHTML = set + set;
})();

// ===== Services cards: reveal on scroll =====
(function () {
  const cards = document.querySelectorAll('.reveal');
  if (!cards.length) return;
  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => c.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const i = [...cards].indexOf(entry.target);
      entry.target.style.transitionDelay = (i % 4) * 0.08 + 's';
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  cards.forEach(c => io.observe(c));
})();



/* =====================================================
   HOW MTOOBK WORKS — SCROLL PROGRESS
===================================================== */

const processSection = document.querySelector(".process-section");

if (processSection) {

  const steps = processSection.querySelectorAll(".process-step");
  const progress = processSection.querySelector(".process-line-progress");

  function updateProcess() {

    const sectionRect = processSection.getBoundingClientRect();
    const sectionHeight = processSection.offsetHeight;
    const viewportHeight = window.innerHeight;

    /*
      نقطة التفعيل تكون تقريبًا في منتصف الشاشة
    */
    const triggerPoint = viewportHeight * 0.48;

    let activeIndex = 0;

    steps.forEach((step, index) => {

      const rect = step.getBoundingClientRect();

      if (rect.top <= triggerPoint) {
        activeIndex = index;
      }

    });

    /* Active step */

    steps.forEach((step, index) => {

      step.classList.toggle(
        "active",
        index <= activeIndex
      );

    });


    /*
      Progress line
    */

    const start = sectionRect.top - viewportHeight * 0.25;

    const progressRange =
      sectionHeight - viewportHeight * 0.5;

    let percentage =
      ((-start) / progressRange) * 100;

    percentage = Math.max(
      0,
      Math.min(100, percentage)
    );

    progress.style.height = percentage + "%";
  }


  window.addEventListener(
    "scroll",
    updateProcess,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    updateProcess
  );

  updateProcess();
}




/* =====================================================
   WHY MTOOBK — SCROLL REVEAL
===================================================== */

const whyRevealItems = document.querySelectorAll(".reveal-why");

if (whyRevealItems.length) {

  const whyObserver = new IntersectionObserver(
    (entries, observer) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          observer.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  whyRevealItems.forEach(item => {
    whyObserver.observe(item);
  });

}



/* =====================================================
   STATS — COUNT UP
===================================================== */
(function () {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const run = el => {
    const target = +el.dataset.count;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = target; return; }
    const dur = 1600, t0 = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!('IntersectionObserver' in window)) { nums.forEach(n => n.textContent = n.dataset.count); return; }
  const io = new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { run(e.target); o.unobserve(e.target); }
  }), { threshold: 0.6 });
  nums.forEach(n => io.observe(n));
})();


/* =====================================================
   SERVICES — pointer spotlight
===================================================== */
(function () {
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
})();

/* =====================================================
   REVIEWS — 3D COVERFLOW (auto-play + arrows + dots + swipe)
===================================================== */
(function () {
  const root = document.getElementById('rv');
  if (!root) return;
  const stage = root.querySelector('.rv-stage');
  const cards = [...root.querySelectorAll('.rv-card')];
  const dotsBox = root.querySelector('.rv-dots');
  const n = cards.length;
  if (n < 2) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = () => window.matchMedia('(max-width: 767.98px)').matches;
  let active = 0, timer = null, paused = false, inView = true;
  const prevO = new Array(n).fill(0);

  const dots = cards.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-label', 'رأي ' + (i + 1));
    b.addEventListener('click', () => { go(i); restart(); });
    dotsBox.appendChild(b); return b;
  });

  function measure() {
    cards.forEach(c => { c.style.height = 'auto'; });
    const h = Math.max(...cards.map(c => c.offsetHeight));
    stage.style.height = h + 'px';
    cards.forEach(c => { c.style.height = '100%'; });
  }

  function render() {
    const maxVisible = mobile() ? 1 : 2;
    cards.forEach((c, i) => {
      let o = ((i - active) % n + n) % n;
      if (o > n / 2) o -= n;
      const a = Math.abs(o);
      // البطاقة التي تعبر من أقصى طرف لآخر: انقل بدون حركة كي لا تطير فوق الباقي
      if (Math.abs(o - prevO[i]) > maxVisible + 1) {
        c.style.transition = 'none';
        c.style.setProperty('--o', o); c.style.setProperty('--a', a);
        void c.offsetWidth; c.style.transition = '';
      } else {
        c.style.setProperty('--o', o); c.style.setProperty('--a', a);
      }
      prevO[i] = o;
      c.classList.toggle('is-active', a === 0);
      c.classList.toggle('is-hidden', a > maxVisible);
      c.setAttribute('aria-hidden', a === 0 ? 'false' : 'true');
    });
    dots.forEach((d, i) => d.classList.toggle('on', i === active));
  }

  function go(i) { active = ((i % n) + n) % n; render(); }
  function next(dir) { go(active + dir); }
  function start() { if (reduce || timer) return; timer = setInterval(() => { if (!paused && inView) next(1); }, 4200); }
  function stop() { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  root.querySelectorAll('.rv-btn').forEach(b => b.addEventListener('click', () => { next(+b.dataset.dir); restart(); }));
  cards.forEach((c, i) => c.addEventListener('click', () => { if (i !== active) { go(i); restart(); } }));

  // سحب بالإصبع / الماوس: السحب لليمين = التالي (اتجاه عربي)
  let sx = null;
  stage.addEventListener('pointerdown', e => { sx = e.clientX; paused = true; });
  const end = e => {
    if (sx !== null) { const dx = e.clientX - sx; if (Math.abs(dx) > 40) { next(dx > 0 ? 1 : -1); restart(); } }
    sx = null; paused = false;
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', () => { sx = null; paused = false; });
  stage.style.touchAction = 'pan-y';

  root.addEventListener('mouseenter', () => { paused = true; });
  root.addEventListener('mouseleave', () => { paused = false; });
  root.addEventListener('focusin', () => { paused = true; });
  root.addEventListener('focusout', () => { paused = false; });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { inView = es[0].isIntersecting; }, { threshold: 0.2 }).observe(root);
  }

  measure(); render(); start();
  window.addEventListener('resize', () => { measure(); render(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); });
})();


/* =====================================================
   WORKS (mobile) — show first 4, button reveals the rest
===================================================== */
(function () {
  document.querySelectorAll('#work .row, #branding .row').forEach(row => {
    if (row.children.length <= 4) return;
    row.classList.add('is-collapsed');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline-light btn-pill more-btn';
    btn.innerHTML = '<span>عرض المزيد</span><i class="bi bi-chevron-down"></i>';
    btn.addEventListener('click', () => {
      const open = row.classList.toggle('is-collapsed') === false;
      btn.classList.toggle('open', open);
      btn.firstChild.textContent = open ? 'عرض أقل' : 'عرض المزيد';
    });
    row.after(btn);
  });
})();
