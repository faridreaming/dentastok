/* DentaStok: header, footer, dan interaksi kecil yang dipakai semua halaman.
   Halaman cukup menaruh <div data-site-header></div> dan <div data-site-footer></div>.
   Opsi header lewat atribut: data-active="gips" (kategori aktif), data-cart="3". */
(function () {
  "use strict";

  var CATEGORIES = [
    ["gips", "Gips"], ["wax", "Wax"], ["bur", "Bur & Disk"], ["pmma", "PMMA & Zirkonia"],
    ["cetak", "Bahan Cetak"], ["sarung", "Sarung Tangan"], ["poles", "Poles"]
  ];

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  function cartCount(fallback) {
    var saved = parseInt(store("dentastok-cart"), 10);
    return isNaN(saved) ? fallback : saved;
  }

  function headerHTML(opts) {
    var nav = CATEGORIES.map(function (c) {
      var active = c[0] === opts.active ? ' class="is-active" aria-current="page"' : "";
      return '<a href="katalog.html"' + active + ">" + c[1].replace("&", "&amp;") + "</a>";
    }).join("");
    return '' +
      '<div class="topbar"><div class="wrap">' +
        '<div class="topbar__left"><img src="assets/icons/truck.svg" width="16" height="16" alt="">' +
        '<span>Pesanan sebelum 14.00 WIB dikirim hari ini untuk zona Medan</span></div>' +
        '<div class="topbar__right"><span>WhatsApp 0812 3456 7890</span><span>Senin sampai Sabtu, 08.00 sampai 17.00</span></div>' +
      '</div></div>' +
      '<div class="mainbar"><div class="wrap">' +
        '<a class="logo" href="index.html" aria-label="DentaStok, beranda">DentaStok<img src="assets/icons/logo-mark.svg" width="7" height="13" alt=""></a>' +
        '<form class="search" role="search" action="katalog.html">' +
          '<img src="assets/icons/search.svg" width="18" height="18" alt="">' +
          '<label class="sr-only" for="q">Cari produk</label>' +
          '<input id="q" name="q" type="search" placeholder="Cari bahan, merek, atau kode produk" autocomplete="off">' +
          '<span class="kbd" aria-hidden="true">/</span>' +
        '</form>' +
        '<nav class="mainbar__links" aria-label="Akun">' +
          '<a class="mainbar__link mainbar__link--hide-sm" href="riwayat.html">Riwayat pesanan</a>' +
          '<a class="mainbar__link" href="masuk.html">Akun</a>' +
          '<a class="cart-btn" href="keranjang.html"><img src="assets/icons/bag.svg" width="18" height="18" alt="">Keranjang' +
          '<span class="cart-btn__count" data-cart-count>' + opts.cart + "</span></a>" +
        "</nav>" +
      "</div></div>" +
      '<nav class="catnav" aria-label="Kategori bahan"><div class="wrap">' + nav + "</div></nav>";
  }

  var FOOTER = '' +
    '<footer class="footer"><div class="wrap">' +
      '<div class="footer__cols">' +
        '<div class="footer__brand"><a class="logo logo--sm" href="index.html">DentaStok<img src="assets/icons/logo-mark-sm.svg" width="6" height="12" alt=""></a>' +
          "<p>Bahan habis pakai untuk laboratorium dan klinik gigi. Gudang dan pengiriman dari Medan.</p></div>" +
        '<div class="footer__col"><h3>Belanja</h3><a href="katalog.html">Katalog bahan</a><a href="riwayat.html">Pesan ulang</a><a href="riwayat.html">Riwayat pesanan</a></div>' +
        '<div class="footer__col"><h3>Bantuan</h3><a href="#">Cara pemesanan</a><a href="#">Pengiriman dan zona ongkir</a><a href="#">Faktur dan pembayaran</a></div>' +
        '<div class="footer__col"><h3>Hubungi</h3><span>WhatsApp 0812 3456 7890</span><span>Senin sampai Sabtu</span><span>08.00 sampai 17.00 WIB</span></div>' +
      "</div>" +
      '<div class="footer__bottom"><span>© 2026 DentaStok, Medan</span><span>Virtual account, QRIS, dan tempo untuk lab langganan</span></div>' +
    "</div></footer>";

  function toast(message) {
    var el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast"; el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("is-on");
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove("is-on"); }, 2200);
  }
  window.DentaStok = { toast: toast, store: store };

  document.addEventListener("DOMContentLoaded", function () {
    var head = document.querySelector("[data-site-header]");
    if (head) {
      head.outerHTML = "<header>" + headerHTML({
        active: head.getAttribute("data-active") || "",
        cart: cartCount(parseInt(head.getAttribute("data-cart") || "3", 10))
      }) + "</header>";
    }
    var foot = document.querySelector("[data-site-footer]");
    if (foot) foot.outerHTML = FOOTER;

    // Tombol "/" memfokuskan pencarian, seperti petunjuk di kolom cari.
    document.addEventListener("keydown", function (e) {
      var q = document.getElementById("q");
      if (e.key === "/" && q && document.activeElement !== q && !/input|textarea|select/i.test(document.activeElement.tagName)) {
        e.preventDefault(); q.focus();
      }
    });

    // Tombol "Tambah ke keranjang" di mana pun.
    document.addEventListener("click", function (e) {
      var add = e.target.closest("[data-add-to-cart]");
      if (add) {
        e.preventDefault();
        var counter = document.querySelector("[data-cart-count]");
        var n = (parseInt(counter && counter.textContent, 10) || 0) + 1;
        if (counter) counter.textContent = n;
        store("dentastok-cart", String(n));
        toast(add.getAttribute("data-add-to-cart") + " masuk ke keranjang");
        return;
      }
      var notify = e.target.closest("[data-notify]");
      if (notify) {
        e.preventDefault();
        toast("Kami kabari lewat WhatsApp saat " + notify.getAttribute("data-notify") + " tersedia");
      }
    });
  });
})();
