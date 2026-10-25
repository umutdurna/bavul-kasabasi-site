// Ekran görüntüsü galerisi: oklar, noktalar ve parmakla kaydırma (kaydırma çubuğu gizli).
document.querySelectorAll('.carousel').forEach(function (c) {
  var track = c.querySelector('.shots');
  var slides = track.querySelectorAll('img');
  var dots = c.querySelector('.dots');
  var prev = c.querySelector('.prev'), next = c.querySelector('.next');
  slides.forEach(function (_, i) {
    var d = document.createElement('button');
    d.setAttribute('aria-label', (i + 1) + '');
    d.addEventListener('click', function () { go(i); });
    dots.appendChild(d);
  });
  function step() { return slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth; }
  function index() { return Math.round(track.scrollLeft / step()); }
  function go(i) { track.scrollTo({ left: Math.max(0, i) * step(), behavior: 'smooth' }); }
  function update() {
    var i = index(), max = track.scrollWidth - track.clientWidth - 4;
    dots.querySelectorAll('button').forEach(function (d, k) { d.classList.toggle('on', k === i); });
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft >= max;
  }
  prev.addEventListener('click', function () { go(index() - 1); });
  next.addEventListener('click', function () { go(index() + 1); });
  track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', update);
  update();
});
