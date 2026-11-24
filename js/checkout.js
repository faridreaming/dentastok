/* 05 - Checkout: ongkir mengikuti pilihan pengiriman, kirim formulir ke halaman berhasil. */
(function () {
  "use strict";

  function rupiah(n) {
    return "Rp " + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("[data-checkout-form]");
    if (!form) return;

    var subtotal = parseInt(form.querySelector("[data-subtotal]").getAttribute("data-subtotal"), 10) || 0;
    var discount = parseInt(form.querySelector("[data-discount]").getAttribute("data-discount"), 10) || 0;
    var shipLabel = form.querySelector("[data-ship-label]");
    var ship = form.querySelector("[data-ship]");
    var total = form.querySelector("[data-total]");
    var pay = form.querySelector("[data-pay]");

    function update() {
      var picked = form.querySelector('input[name="kirim"]:checked');
      if (!picked) return;
      var cost = parseInt(picked.getAttribute("data-cost"), 10) || 0;
      var sum = Math.max(0, subtotal + cost - discount);
      shipLabel.textContent = "Ongkos kirim, " + picked.getAttribute("data-label");
      ship.textContent = rupiah(cost);
      total.textContent = rupiah(sum);
      pay.textContent = "Bayar " + rupiah(sum);
    }

    form.addEventListener("change", function (e) {
      if (e.target.name === "kirim") update();
    });

    // "Pakai alamat lain": kosongkan isian alamat dan mulai dari nama lab.
    var other = document.querySelector(".co-card__link");
    if (other) other.addEventListener("click", function (e) {
      e.preventDefault();
      ["nama-lab", "penerima", "wa", "alamat-lengkap"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.value = "";
      });
      document.getElementById("nama-lab").focus();
    });

    // Validasi bawaan browser berjalan lebih dulu; submit hanya terpanggil bila semua isian valid.
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      window.location.href = "pembayaran-berhasil.html";
    });

    update();
  });
})();
