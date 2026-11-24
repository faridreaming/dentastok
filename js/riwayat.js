/* 06 - Riwayat Pesanan: tab status dan tombol unduh faktur. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.querySelector('.mainbar__link[href="riwayat.html"]');
    if (nav) nav.setAttribute("aria-current", "page");

    var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
    var panel = document.getElementById("daftar-pesanan");
    var orders = Array.prototype.slice.call(document.querySelectorAll(".order"));
    var empty = document.querySelector(".orders__empty");

    function select(tab, focus) {
      var filter = tab.getAttribute("data-filter");
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });
      panel.setAttribute("aria-labelledby", tab.id);
      var shown = 0;
      orders.forEach(function (o) {
        var match = filter === "semua" || o.getAttribute("data-status") === filter;
        o.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });

    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-invoice]");
      if (btn && window.DentaStok) window.DentaStok.toast("Faktur " + btn.getAttribute("data-invoice") + " sedang diunduh");
    });
  });
})();
