/* 03 - Detail Produk: galeri foto, stepper jumlah dengan subtotal, tambah ke keranjang, dan tab informasi. */
(function () {
  "use strict";

  function rupiah(n) {
    return "Rp " + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function initGallery() {
    var main = document.querySelector("[data-gallery-main]");
    var photo = document.querySelector("[data-gallery-photo]");
    var doc = document.querySelector("[data-gallery-doc]");
    var thumbs = Array.prototype.slice.call(document.querySelectorAll(".gallery__thumb"));
    if (!main || !photo || !doc || !thumbs.length) return;

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        thumbs.forEach(function (t) {
          var on = t === thumb;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-pressed", on ? "true" : "false");
        });
        var isDoc = thumb.hasAttribute("data-doc");
        main.classList.toggle("is-doc", isDoc);
        photo.hidden = isDoc;
        doc.hidden = !isDoc;
        if (!isDoc) photo.setAttribute("style", thumb.getAttribute("data-crop") || "");
      });
    });
  }

  function initQuantity() {
    var box = document.querySelector(".qty");
    var input = document.querySelector("[data-qty]");
    var out = document.querySelector("[data-subtotal]");
    if (!box || !input) return null;
    var price = parseInt(box.getAttribute("data-price"), 10) || 0;
    var min = parseInt(input.min, 10) || 1;
    var max = parseInt(input.max, 10) || 99;
    var minus = box.querySelector('[data-step="-1"]');
    var plus = box.querySelector('[data-step="1"]');

    function value() {
      var v = parseInt(input.value, 10);
      if (isNaN(v)) v = min;
      return Math.min(max, Math.max(min, v));
    }
    function render(v) {
      input.value = v;
      if (out) out.textContent = rupiah(v * price);
      if (minus) minus.disabled = v <= min;
      if (plus) plus.disabled = v >= max;
    }

    box.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-step]");
      if (!btn) return;
      render(value() + parseInt(btn.getAttribute("data-step"), 10));
    });
    input.addEventListener("input", function () {
      if (input.value !== "" && out) out.textContent = rupiah(value() * price);
    });
    input.addEventListener("change", function () { render(value()); });
    render(value());
    return value;
  }

  // Tambah ke keranjang sejumlah nilai stepper (site.js hanya menambah satu per klik).
  function initAdd(getQty) {
    var btn = document.querySelector("[data-add-qty]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var qty = getQty ? getQty() : 1;
      var counter = document.querySelector("[data-cart-count]");
      var n = (parseInt(counter && counter.textContent, 10) || 0) + qty;
      if (counter) counter.textContent = n;
      var ds = window.DentaStok || {};
      try { if (ds.store) ds.store("dentastok-cart", String(n)); } catch (e) { /* abaikan */ }
      if (ds.toast) ds.toast(qty + " ember " + btn.getAttribute("data-add-qty") + " masuk ke keranjang");
    });
  }

  function initTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;

    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab, false); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initGallery();
    initAdd(initQuantity());
    initTabs();
  });
})();
