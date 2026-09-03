// 吉恩典山丘露營區官網 — 共用互動邏輯

document.addEventListener('DOMContentLoaded', function () {
  // 行動版選單開關
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // 首頁輪播
  var slides = document.querySelectorAll('.hero-slide');
  var dotsWrap = document.querySelector('.hero-dots');
  if (slides.length > 1 && dotsWrap) {
    var current = 0;
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', '第 ' + (i + 1) + ' 張輪播圖');
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll('button');

    function goTo(i) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = i;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    setInterval(function () {
      goTo((current + 1) % slides.length);
    }, 4500);
  }

  // 路線指南：卡片點擊放大 + 同路線內切換下一張
  var routeShots = document.querySelectorAll('.route-shot');
  var lightbox = document.getElementById('lightbox');
  if (routeShots.length && lightbox) {
    var routeGroups = {};
    routeShots.forEach(function (btn) {
      var route = btn.dataset.route;
      (routeGroups[route] = routeGroups[route] || []).push(btn);
    });

    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');
    var lightboxClose = document.getElementById('lightboxClose');
    var currentRoute = null;
    var currentIndex = 0;

    function showCurrent() {
      var img = routeGroups[currentRoute][currentIndex].querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }

    function openLightbox(route, index) {
      currentRoute = route;
      currentIndex = index;
      showCurrent();
      lightbox.hidden = false;
    }

    function step(delta) {
      var group = routeGroups[currentRoute];
      currentIndex = (currentIndex + delta + group.length) % group.length;
      showCurrent();
    }

    function closeLightbox() { lightbox.hidden = true; }

    routeShots.forEach(function (btn) {
      btn.addEventListener('click', function () {
        openLightbox(btn.dataset.route, parseInt(btn.dataset.index, 10));
      });
    });

    lightboxImg.addEventListener('click', function () { step(1); });
    lightboxNext.addEventListener('click', function () { step(1); });
    lightboxPrev.addEventListener('click', function () { step(-1); });
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });
  }
});
