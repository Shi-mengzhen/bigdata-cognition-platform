/* =========================================================
   大数据认知平台 · 通用脚本
   ========================================================= */
(function () {
  'use strict';

  /* ----- 1. 移动端导航 ----- */
  function initNav() {
    var btn = document.querySelector('.hamburger');
    var links = document.querySelector('.nav-links');
    if (btn && links) {
      btn.addEventListener('click', function () {
        links.classList.toggle('open');
        btn.classList.toggle('open');
      });
    }
    // 高亮当前页
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* ----- 2. 滚动出现动画 ----- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          var delay = parseFloat(el.getAttribute('data-delay') || '0');
          setTimeout(function () { el.classList.add('in'); }, delay * 1000);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.14 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ----- 3. 条形图动画 ----- */
  function initBars() {
    var fills = document.querySelectorAll('.bar-fill');
    fills.forEach(function (f) {
      var v = f.getAttribute('data-val') || '0';
      f.style.width = '0';
      var start = function () {
        requestAnimationFrame(function () { f.style.width = v + '%'; });
      };
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { start(); io.disconnect(); }
          });
        }, { threshold: 0.3 });
        io.observe(f);
      } else { start(); }
    });
  }

  /* ----- 4. 数字滚动 ----- */
  function initCount() {
    var nums = document.querySelectorAll('[data-count]');
    nums.forEach(function (n) {
      var target = parseFloat(n.getAttribute('data-count'));
      var dec = (n.getAttribute('data-dec') || '0') | 0;
      var suffix = n.getAttribute('data-suffix') || '';
      var dur = 1100, t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        n.textContent = (target * eased).toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else n.textContent = target.toFixed(dec) + suffix;
      }
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { requestAnimationFrame(step); io.disconnect(); }
          });
        }, { threshold: 0.4 });
        io.observe(n);
      } else { n.textContent = target.toFixed(dec) + suffix; }
    });
  }

  /* ----- 5. 环形图（依据 data-segments 绘制） ----- */
  function initDonut() {
    document.querySelectorAll('.donut[data-segments]').forEach(function (box) {
      var segs;
      try { segs = JSON.parse(box.getAttribute('data-segments')); } catch (e) { return; }
      var size = 168, r = 62, cx = size / 2, cy = size / 2, c = 2 * Math.PI * r;
      var total = segs.reduce(function (s, x) { return s + x.v; }, 0) || 1;
      var off = 0, parts = [];
      segs.forEach(function (s) {
        var len = (s.v / total) * c;
        parts.push(
          '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + s.c +
          '" stroke-width="20" stroke-dasharray="' + len + ' ' + (c - len) + '" stroke-dashoffset="' + (-off) +
          '" transform="rotate(-90 ' + cx + ' ' + cy + ')" />'
        );
        off += len;
      });
      var legend = segs.map(function (s) {
        var pct = ((s.v / total) * 100).toFixed(0);
        return '<div><i style="background:' + s.c + '"></i><span>' + s.n + '　<b>' + pct + '%</b></span></div>';
      }).join('');
      box.innerHTML =
        '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#eef2fa" stroke-width="20"/>' +
        parts.join('') + '</svg><div class="legend">' + legend + '</div>';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initReveal();
    initBars();
    initCount();
    initDonut();
  });
})();
