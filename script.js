/* ════════════════════════════════════════════════════
   Anwesha Portfolio — Enhanced Script
   Features:
   1. Custom cursor + sparkle trail
   2. Scroll progress bar
   3. Page transitions
   4. 3D card tilt
   5. Animated stat counters
   6. Typewriter text rotator
   7. Parallax layers
   8. Active nav highlighting
   9. Global reveal on scroll
   10. Splash screen
   11. Birthday countdown
   ════════════════════════════════════════════════════ */

/* ── 1. CUSTOM CURSOR + GOLD SPARKLE TRAIL ── */
(function() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    spawnSparkle(e.clientX, e.clientY);
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='.6'; });

  (function tick() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(tick);
  })();

  document.querySelectorAll('a, button, .photo-frame, .masonry-item, .interest-card, .tilt-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width='56px'; ring.style.height='56px'; ring.style.opacity='.9';
      ring.style.borderColor='var(--gold-light)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width='36px'; ring.style.height='36px'; ring.style.opacity='.6';
      ring.style.borderColor='var(--gold)';
    });
  });

  let sparkleThrottle = 0;
  function spawnSparkle(x, y) {
    const now = Date.now();
    if (now - sparkleThrottle < 45) return;
    sparkleThrottle = now;
    const s = document.createElement('div');
    s.className = 'cursor-sparkle';
    const size = 3 + Math.random() * 5;
    const angle = Math.random() * 360;
    const dist  = 12 + Math.random() * 22;
    Object.assign(s.style, {
      left: (x - size/2) + 'px', top: (y - size/2) + 'px',
      width: size + 'px', height: size + 'px',
      '--ox': (Math.cos(angle*Math.PI/180)*dist) + 'px',
      '--oy': (Math.sin(angle*Math.PI/180)*dist) + 'px',
    });
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 700);
  }
})();

/* ── 2. SCROLL PROGRESS BAR ── */
(function() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.transform = 'scaleX(' + Math.min(pct,1) + ')';
  }, { passive: true });
})();

/* ── 3. PAGE TRANSITIONS ── */
(function() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;
  overlay.classList.add('leaving');
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.remove('leaving');
      overlay.classList.add('entering');
      setTimeout(() => { window.location.href = href; }, 420);
    });
  });
})();

/* ── 4. 3D CARD TILT ── */
(function() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r=card.getBoundingClientRect();
      const rx=((e.clientY-r.top-r.height/2)/(r.height/2))*-7;
      const ry=((e.clientX-r.left-r.width/2)/(r.width/2))*7;
      card.style.transform='perspective(900px) rotateX('+rx+'deg) rotateY('+ry+'deg) scale(1.025)';
      card.style.transition='transform .05s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform='perspective(900px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition='transform .5s ease';
    });
  });
})();

/* ── 5. ANIMATED STAT COUNTERS ── */
(function() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const el=entry.target;
      if (el.dataset.count==='inf') { el.textContent='∞'; return; }
      const target=parseFloat(el.dataset.count);
      let start=0;
      const dur=1600;
      const step=ts => {
        if (!start) start=ts;
        const p=Math.min((ts-start)/dur,1);
        const ease=1-Math.pow(1-p,3);
        el.textContent=Math.floor(ease*target);
        if (p<1) requestAnimationFrame(step);
        else el.textContent=target;
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
})();

/* ── 6. TYPEWRITER ── */
(function() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = JSON.parse(el.dataset.words||'[]');
  if (!words.length) return;
  let wi=0,ci=0,del=false,wait=false;
  function tick() {
    const word=words[wi];
    if (wait) { wait=false; del=true; setTimeout(tick,1800); return; }
    if (!del) { el.textContent=word.slice(0,++ci); if(ci===word.length){wait=true;setTimeout(tick,100);return;} }
    else { el.textContent=word.slice(0,--ci); if(ci===0){del=false;wi=(wi+1)%words.length;} }
    setTimeout(tick,del?42:80);
  }
  tick();
})();

/* ── 7. PARALLAX ── */
(function() {
  const layers = document.querySelectorAll('[data-parallax]');
  if (!layers.length) return;
  let ticking=false;
  window.addEventListener('scroll', () => {
    if (ticking) return; ticking=true;
    requestAnimationFrame(() => {
      layers.forEach(el => {
        el.style.transform='translateY('+(window.scrollY*parseFloat(el.dataset.parallax))+'px)';
      });
      ticking=false;
    });
  }, { passive: true });
})();

/* ── 8. ACTIVE NAV ── */
(function() {
  const path=window.location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href').split('/').pop()===path) a.classList.add('active');
  });
})();

/* ── 9. REVEAL ON SCROLL ── */
(function() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('revealed'); obs.unobserve(e.target); } });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── 10. SPLASH SCREEN ── */
(function() {
  const splash = document.getElementById('splash');
  if (!splash) return;
  if (sessionStorage.getItem('ag_splash')) { splash.style.display='none'; return; }
  setTimeout(() => {
    splash.classList.add('splash-out');
    setTimeout(() => { splash.style.display='none'; sessionStorage.setItem('ag_splash','1'); }, 900);
  }, 2400);
})();

/* ── 11. BIRTHDAY COUNTDOWN ── */
(function() {
  const el = document.getElementById('bday-countdown');
  if (!el) return;
  const now=new Date();
  let bday=new Date(now.getFullYear(),2,31);
  if (now>bday) bday.setFullYear(now.getFullYear()+1);
  const diff=Math.ceil((bday-now)/86400000);
  if (diff===0) { el.innerHTML='<span class="cd-num"></span><span class="cd-label">Happy Birthday Anwesha!</span>'; }
  else { el.innerHTML='<span class="cd-num">'+diff+'</span><span class="cd-label">days until 31 March </span>'; }
})();

/* ── BIRTHDAY BUTTON (March 31st) ── */
(function() {
  const el = document.getElementById('bday-countdown');
  if (!el) return;
  const now = new Date();
  // Exact birthday check: same month AND day
  const isBirthday = (now.getMonth() === 2 && now.getDate() === 31);
  if (isBirthday) {
    // Replace countdown pill with glowing button
    const pill = el.closest('.bday-pill');
    if (pill) {
      pill.style.padding = '0';
      pill.style.background = 'none';
      pill.style.border = 'none';
      pill.style.boxShadow = 'none';
      pill.innerHTML = '<a href="birthday.html" class="bday-open-btn">Open Your Birthday Gift</a>';
    }
  }
})();

/* ── DEV KEY COMBO : Ctrl/Cmd + Shift + ; then 2 ── */
(function() {
  let gotColon = false, colonTimer;
  document.addEventListener('keydown', e => {
    const ctrl = e.ctrlKey || e.metaKey;
    // Step 1: Ctrl/Cmd + Shift + ; (produces ":" on most keyboards)
    if (ctrl && (e.key === 'l' || (e.shiftKey && e.key === 'L'))) {
      gotColon = true;
      clearTimeout(colonTimer);
      colonTimer = setTimeout(() => { gotColon = false; }, 2500);
    }
    // Step 2: Ctrl/Cmd + 2 within 2.5s of above
    if (ctrl && e.key === '2' && gotColon) {
      gotColon = false;
      clearTimeout(colonTimer);
      window.location.href = 'birthday.html';
    }
  });
})();
