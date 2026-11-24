/* 02 - Katalog Produk: filter sederhana lewat atribut data, urutan, dan panel filter yang bisa dilipat di ponsel. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("[data-filter]");
    var grid = document.querySelector("[data-results]");
    if (!form || !grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".card"));
    var sort = document.querySelector("[data-sort]");
    var count = document.querySelector("[data-result-count]");
    var empty = document.querySelector("[data-empty]");
    var defaultCount = count ? count.textContent : "";

    cards.forEach(function (card, i) { card.setAttribute("data-order", String(i)); });

    function checked(name) {
      return Array.prototype.slice.call(form.querySelectorAll('input[name="' + name + '"]:checked'))
        .map(function (input) { return input.value; });
    }

    // Kategori tidak menyaring: halaman ini hanya berisi produk gips.
    function applyFilter() {
      var tipe = checked("tipe"), merek = checked("merek"), stok = checked("stok");
      var shown = 0;
      cards.forEach(function (card) {
        var ok = (!tipe.length || tipe.indexOf(card.getAttribute("data-tipe")) > -1) &&
          (!merek.length || merek.indexOf(card.getAttribute("data-merek")) > -1) &&
          (!stok.length || stok.indexOf(card.getAttribute("data-stok")) > -1);
        card.hidden = !ok;
        if (ok) shown++;
      });
      var filtered = tipe.length || merek.length || stok.length;
      if (count) count.textContent = filtered ? "Menampilkan " + shown + " produk yang cocok di halaman ini" : defaultCount;
      if (empty) empty.hidden = shown > 0;
    }

    function applySort() {
      if (!sort) return;
      var mode = sort.value;
      var num = function (card, attr) { return parseInt(card.getAttribute(attr), 10) || 0; };
      var list = cards.slice().sort(function (a, b) {
        if (mode === "murah") return num(a, "data-price") - num(b, "data-price");
        if (mode === "mahal") return num(b, "data-price") - num(a, "data-price");
        if (mode === "stok") return num(b, "data-qty") - num(a, "data-qty");
        return num(a, "data-order") - num(b, "data-order");
      });
      list.forEach(function (card) { grid.appendChild(card); });
    }

    form.addEventListener("change", applyFilter);
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    // Tombol "Atur ulang" adalah type="reset": tunggu formulir kembali ke nilai awal, lalu saring ulang.
    form.addEventListener("reset", function () { setTimeout(applyFilter, 0); });
    if (sort) sort.addEventListener("change", applySort);

    // Di layar kecil, daftar filter dilipat dan dibuka dengan tombol.
    var toggle = form.querySelector("[data-filter-toggle]");
    if (toggle) {
      form.classList.add("is-collapsible");
      toggle.addEventListener("click", function () {
        var open = form.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.textContent = open ? "Sembunyikan filter" : "Tampilkan filter";
      });
    }

    applyFilter();
    applySort();
  });
})();
