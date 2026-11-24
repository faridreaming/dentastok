/* 07 - Masuk dan 08 - Daftar: form demo, lihat kata sandi, meter kekuatan, toast kecil. */
(function () {
  "use strict";

  function toast(msg) {
    if (window.DentaStok && window.DentaStok.toast) window.DentaStok.toast(msg);
  }

  function init() {
    // Form demo: validasi bawaan browser dulu, lalu pindah ke halaman berikutnya.
    document.querySelectorAll("[data-auth-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        window.location.href = form.getAttribute("data-next") || form.getAttribute("action");
      });
    });

    // Lihat atau sembunyikan kata sandi.
    document.querySelectorAll("[data-toggle-password]").forEach(function (btn) {
      var input = document.getElementById(btn.getAttribute("data-toggle-password"));
      if (!input) return;
      btn.addEventListener("click", function () {
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.setAttribute("aria-pressed", show ? "true" : "false");
        btn.setAttribute("aria-label", show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
      });
    });

    // Tautan kecil yang cukup memberi kabar.
    document.querySelectorAll("[data-toast]").forEach(function (btn) {
      btn.addEventListener("click", function () { toast(btn.getAttribute("data-toast")); });
    });

    // Meter kekuatan kata sandi (Daftar).
    var pw = document.querySelector("[data-strength-input]");
    var meter = document.querySelector("[data-strength-meter]");
    var label = document.querySelector("[data-strength-label]");
    if (pw && meter && label) {
      var names = ["Terlalu pendek", "Lemah", "Lemah", "Sedang", "Kuat", "Sangat kuat"];
      var update = function () {
        var v = pw.value, score = 0;
        if (v.length >= 8) {
          score = 1;
          if (/[a-z]/i.test(v)) score++;
          if (/\d/.test(v)) score++;
          if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++;
          if (/[^a-z0-9]/i.test(v) || v.length >= 14) score++;
        }
        meter.setAttribute("data-level", score >= 3 ? "ok" : "low");
        meter.querySelectorAll("i").forEach(function (bar, i) { bar.classList.toggle("on", i < score); });
        label.textContent = names[score];
      };
      pw.addEventListener("input", update);
      update();
    }

    // Label nama mengikuti jenis usaha yang dipilih.
    var namaLabel = document.querySelector("[data-nama-label]");
    if (namaLabel) {
      document.querySelectorAll('input[name="jenis"]').forEach(function (r) {
        r.addEventListener("change", function () {
          namaLabel.textContent = r.value === "klinik" ? "Nama klinik" : "Nama laboratorium";
        });
      });
    }

    // Datang dari halaman Daftar.
    if (/[?&]daftar=1\b/.test(window.location.search)) {
      setTimeout(function () { toast("Akun lab dibuat. Silakan masuk."); }, 300);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
