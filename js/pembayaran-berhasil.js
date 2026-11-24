/* 12 - Pembayaran Berhasil: simpan pesanan sebagai daftar rutin (demo). */
(function () {
  "use strict";
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-save-list]") && window.DentaStok) {
      window.DentaStok.toast("Pesanan disimpan sebagai daftar rutin");
    }
  });
})();
