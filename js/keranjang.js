/* 04 - Keranjang: stepper jumlah, hapus barang, dan ringkasan harga. */
(function () {
  "use strict";

  function rupiah(n) {
    return "Rp " + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var list = document.querySelector("[data-cart-items]");
    if (!list) return;

    // Header bersama dirender lebih dulu oleh site.js; tandai tombol Keranjang sebagai halaman aktif.
    var cartBtn = document.querySelector(".cart-btn");
    if (cartBtn) cartBtn.setAttribute("aria-current", "page");

    var summaryText = document.querySelector("[data-cart-summary]");
    var sumLabel = document.querySelector("[data-sum-label]");
    var sumSubtotal = document.querySelector("[data-sum-subtotal]");
    var sumTotal = document.querySelector("[data-sum-total]");
    var ship = parseInt(document.querySelector("[data-sum-ship]").getAttribute("data-value"), 10) || 0;
    var discount = parseInt(document.querySelector("[data-sum-discount]").getAttribute("data-value"), 10) || 0;
    var empty = document.querySelector("[data-cart-empty]");
    var checkout = document.querySelector("[data-checkout]");

    function update() {
      var items = list.querySelectorAll("[data-item]");
      var products = items.length, units = 0, subtotal = 0;

      Array.prototype.forEach.call(items, function (item) {
        var price = parseInt(item.getAttribute("data-price"), 10) || 0;
        var max = parseInt(item.getAttribute("data-max"), 10) || 99;
        var qty = parseInt(item.querySelector("[data-qty]").textContent, 10) || 1;
        units += qty;
        subtotal += price * qty;
        item.querySelector("[data-sub]").textContent = rupiah(price * qty);
        item.querySelector('[data-step="-1"]').disabled = qty <= 1;
        item.querySelector('[data-step="1"]').disabled = qty >= max;
      });

      summaryText.textContent = products + " produk, " + units + " barang";
      sumLabel.textContent = "Subtotal, " + units + " barang";
      sumSubtotal.textContent = rupiah(subtotal);
      sumTotal.textContent = rupiah(products ? Math.max(0, subtotal + ship - discount) : 0);

      empty.hidden = products > 0;
      if (products) {
        checkout.removeAttribute("aria-disabled");
        checkout.removeAttribute("tabindex");
      } else {
        checkout.setAttribute("aria-disabled", "true");
        checkout.setAttribute("tabindex", "-1");
      }

      var badge = document.querySelector("[data-cart-count]");
      if (badge) badge.textContent = products;
      if (window.DentaStok) window.DentaStok.store("dentastok-cart", String(products));
    }

    list.addEventListener("click", function (e) {
      var item = e.target.closest("[data-item]");
      if (!item) return;

      var step = e.target.closest("[data-step]");
      if (step && !step.disabled) {
        var out = item.querySelector("[data-qty]");
        var max = parseInt(item.getAttribute("data-max"), 10) || 99;
        var qty = (parseInt(out.textContent, 10) || 1) + parseInt(step.getAttribute("data-step"), 10);
        out.textContent = Math.min(max, Math.max(1, qty));
        update();
        // Tombol yang baru saja dinonaktifkan kehilangan fokus; pindahkan ke tombol sebelahnya.
        if (step.disabled) {
          var other = item.querySelector('[data-step="' + (-parseInt(step.getAttribute("data-step"), 10)) + '"]');
          if (other) other.focus();
        }
        return;
      }

      if (e.target.closest("[data-remove]")) {
        var name = item.querySelector(".item__name").textContent;
        var next = item.nextElementSibling || item.previousElementSibling;
        item.remove();
        update();
        if (window.DentaStok) window.DentaStok.toast(name + " dihapus dari keranjang");
        var focusTarget = next ? next.querySelector("[data-remove]") : empty.querySelector("a");
        if (focusTarget) focusTarget.focus();
      }
    });

    var save = document.querySelector("[data-save-list]");
    if (save) save.addEventListener("click", function () {
      if (window.DentaStok) window.DentaStok.toast("Keranjang disimpan sebagai daftar rutin");
    });

    update();
  });
})();
