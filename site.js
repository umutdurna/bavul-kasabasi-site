(function () {
  var EN = document.documentElement.lang === 'en';

  // App Store bağlantısı: oyun yayına çıkınca buraya adres yazılır; tüm "App Store" düğmeleri kendiliğinden mağazaya götürür.
  var APP_STORE_URL = "";

  // ---------- açılır pencere yardımcıları ----------
  function modal(cls, html) {
    var m = document.createElement('div');
    m.className = 'modal ' + cls;
    m.innerHTML = html + '<button class="x" aria-label="close">✕</button>';
    m.addEventListener('click', function (e) { if (e.target === m || e.target.classList.contains('x') || e.target.dataset.close !== undefined) close(m); });
    document.body.appendChild(m);
    return m;
  }
  function open(m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close(m) { m.classList.remove('open'); document.body.style.overflow = ''; }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.modal.open').forEach(close);
  });

  // ---------- sağ altta sabit "indir" düğmesi (kapak geçilince belirir) ----------
  var phone = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 3v13h10V5H7zm4 14.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"/></svg>';
  var fab = document.createElement('a');
  fab.className = 'fab';
  fab.href = '#';
  fab.setAttribute('data-store', '');
  fab.setAttribute('aria-disabled', 'true');
  fab.innerHTML = phone + '<span><small data-store-small>' + (EN ? 'Coming soon' : 'Çok yakında') + '</small><b data-store-label>' + (EN ? 'Download' : 'İndir') + '</b></span>';
  document.body.appendChild(fab);
  // kapak ekrandan çıkınca belirir (kapağı olmayan sayfalarda biraz kaydırınca)
  var top = document.querySelector('.hero, .pagehead');
  if (top && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { fab.classList.toggle('show', !es[0].isIntersecting); }, { rootMargin: '-120px 0px 0px 0px' }).observe(top);
  } else {
    var fabShow = function () { fab.classList.toggle('show', window.scrollY > 520); };
    window.addEventListener('scroll', fabShow, { passive: true });
    fabShow();
  }

  // ---------- App Store düğmesi ----------
  var soon = modal('soonbox',
    '<div class="soon-card"><div class="soon-top"><img src="img/icon.png" alt=""></div>' +
    '<p class="kicker">' + (EN ? 'EARLY ACCESS' : 'ERKEN ERİŞİM') + '</p>' +
    '<h3>' + (EN ? 'Coming soon!' : 'Çok yakında!') + '</h3>' +
    '<p class="lead2">' + (EN ? 'Bavul Kasabası is about to land on the App Store. Check back very soon: the download link will appear right here.'
        : "Bavul Kasabası çok yakında App Store'da. Kısa süre sonra tekrar uğra: indirme bağlantısı tam burada olacak.") + '</p>' +
    '<div class="soon-tags"><span>' + (EN ? 'Free' : 'Ücretsiz') + '</span><span>' + (EN ? 'No ads' : 'Reklam yok') + '</span><span>iPhone</span></div>' +
    '<div class="soon-btns"><a class="btn" href="#" data-close>' + (EN ? 'Got it' : 'Tamam') + '</a>' +
    '<a class="btn soft" href="' + (EN ? 'updates.html' : 'guncellemeler.html') + '">' + (EN ? "What's new" : 'Yenilikler') + '</a></div></div>');
  document.querySelectorAll('[data-store]').forEach(function (a) {
    if (!APP_STORE_URL) { a.addEventListener('click', function (e) { e.preventDefault(); open(soon); }); return; }
    a.href = APP_STORE_URL;
    a.removeAttribute('aria-disabled');
    a.querySelector('[data-store-small]').textContent = EN ? 'Download on the' : 'Hemen indir';
    a.querySelector('[data-store-label]').textContent = EN ? 'App Store' : "App Store'dan";
  });

  // ---------- kaydırınca beliren bölümler ----------
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('seen'); });

  // ---------- ekran görüntüsü galerisi ----------
  document.querySelectorAll('.carousel').forEach(function (c) {
    var track = c.querySelector('.shots');
    var imgs = Array.prototype.slice.call(track.querySelectorAll('img'));
    // her görsel büyüteçli bir kutuya alınır
    imgs.forEach(function (img) {
      var f = document.createElement('figure');
      img.parentNode.insertBefore(f, img);
      f.appendChild(img);
    });
    var dots = c.querySelector('.dots');
    var prev = c.querySelector('.prev'), next = c.querySelector('.next');

    // noktalar görsel başına değil, ekran sayfası başına
    function pages() { return Math.max(1, Math.ceil((track.scrollWidth - 4) / track.clientWidth)); }
    function page() {
      var max = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= max - 4) return pages() - 1;
      return Math.round(track.scrollLeft / track.clientWidth);
    }
    function go(p) { track.scrollTo({ left: Math.max(0, p) * track.clientWidth, behavior: 'smooth' }); }
    function build() {
      dots.innerHTML = '';
      for (var i = 0; i < pages(); i++) {
        var d = document.createElement('button');
        d.setAttribute('aria-label', (i + 1) + '');
        d.addEventListener('click', go.bind(null, i));
        dots.appendChild(d);
      }
      update();
    }
    function update() {
      var p = page(), max = track.scrollWidth - track.clientWidth - 4;
      dots.querySelectorAll('button').forEach(function (d, k) { d.classList.toggle('on', k === p); });
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= max;
      dots.style.visibility = pages() > 1 ? 'visible' : 'hidden';
    }
    prev.addEventListener('click', function () { go(page() - 1); });
    next.addEventListener('click', function () { go(page() + 1); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', build);
    window.addEventListener('load', build);
    build();

    // fareyle tutup sürükleme (dokunmatikte tarayıcının kendi kaydırması çalışır)
    var down = false, moved = 0, startX = 0, startL = 0;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = 0; startX = e.clientX; startL = track.scrollLeft;
      track.classList.add('drag');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      track.scrollLeft = startL - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      track.classList.remove('drag');
      // bırakınca en yakın görsele yaslan
      var step = imgs.length > 1 ? imgs[1].parentNode.offsetLeft - imgs[0].parentNode.offsetLeft : track.clientWidth;
      track.scrollTo({ left: Math.round(track.scrollLeft / step) * step, behavior: 'smooth' });
    });

    // büyük görsel (sürüklemeyi tıklama sayma)
    zoom(imgs, function () { return moved <= 6; });
  });

  // hikaye görselleri de büyütülebilir
  document.querySelectorAll('.story').forEach(function (s) { zoom(Array.prototype.slice.call(s.querySelectorAll('img'))); });

  // ---------- büyük görsel penceresi: tıklayınca açılır, oklarla ve klavyeyle gezilir ----------
  function zoom(imgs, allow) {
    if (!imgs.length) return;
    var lb = modal('lightbox', '<button class="nav prev" aria-label="previous">&#8249;</button><figure class="big"><img alt=""><figcaption></figcaption></figure><button class="nav next" aria-label="next">&#8250;</button>');
    var big = lb.querySelector('img'), cap = lb.querySelector('figcaption'), cur = 0;
    function show(i) {
      cur = (i + imgs.length) % imgs.length;
      var im = imgs[cur];
      big.src = im.getAttribute('data-full') || im.src;
      var fc = im.closest('figure') && im.closest('figure').querySelector('figcaption');
      cap.innerHTML = fc ? fc.innerHTML : (im.alt || '');
      cap.style.display = cap.innerHTML ? '' : 'none';
    }
    lb.querySelector('.prev').addEventListener('click', function () { show(cur - 1); });
    lb.querySelector('.next').addEventListener('click', function () { show(cur + 1); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
    imgs.forEach(function (img, i) {
      var target = img.closest('figure') || img;
      target.classList.add('zoomable');
      target.addEventListener('click', function () {
        if (allow && !allow()) return;
        show(i);
        open(lb);
      });
    });
  }
})();
