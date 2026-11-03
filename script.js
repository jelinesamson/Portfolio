(function () {
  var root = document.documentElement;

  var menu = document.getElementById('menu');
  var burger = document.getElementById('toggle');
  function closeMenu() { menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', function () { if (window.innerWidth > 768) closeMenu(); });

  var themeBtn = document.getElementById('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : prefersDark.matches;
  }
  function paintTheme() {
    var dark = isDark();
    themeBtn.textContent = dark ? '☀' : '☾';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  try { var saved = localStorage.getItem('theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  themeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    paintTheme();
  });
  paintTheme();

  var links = [].slice.call(document.querySelectorAll('nav a'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
  }

  var toTop = document.getElementById('to-top');
  window.addEventListener('scroll', function () { toTop.classList.toggle('show', window.scrollY > 400); }, { passive: true });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  var typed = document.getElementById('typed');
  var words = ['web apps', 'mobile apps', 'clean code', 'MySQL databases'];
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var w = 0, c = 0, deleting = false;
    (function tick() {
      var word = words[w], delay = deleting ? 45 : 90;
      c += deleting ? -1 : 1;
      typed.textContent = word.slice(0, c);
      if (!deleting && c === word.length) { deleting = true; delay = 1400; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
      setTimeout(tick, delay);
    })();
  }

  var form = document.getElementById('form');
  var msg = document.getElementById('msg');
  var rules = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name (at least 2 letters).'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.'; },
    note: function (v) { return v.trim().length >= 10 ? '' : 'Your message should be at least 10 characters.'; }
  };
  function check(field) {
    var error = rules[field.name](field.value);
    document.getElementById('e-' + field.name).textContent = error;
    field.setAttribute('aria-invalid', error ? 'true' : 'false');
    return !error;
  }
  [].forEach.call(form.elements, function (f) {
    if (rules[f.name]) f.addEventListener('blur', function () { check(f); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true, first = null;
    [].forEach.call(form.elements, function (f) {
      if (rules[f.name] && !check(f)) { ok = false; first = first || f; }
    });
    if (!ok) { msg.textContent = ''; first.focus(); return; }
    msg.textContent = 'Thanks, ' + form.elements.name.value.trim() + '! Your message was sent (demo only).';
    form.reset();
  });

  var bar = document.createElement('div');
  bar.className = 'progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var header = document.querySelector('header');
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    root.classList.add('js');
    var reveals = [].slice.call(document.querySelectorAll('.about .wrap > div, .facts li, .tools h2, .tools .intro, .cat, .contact .wrap > div, form'));
    var show = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        show.unobserve(el);
        setTimeout(function () { el.classList.remove('reveal', 'in'); el.style.transitionDelay = ''; }, 1400);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) {
      var i = [].indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
      el.classList.add('reveal');
      show.observe(el);
    });
  }
})();