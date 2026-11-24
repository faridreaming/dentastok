/* 09 + 10 - Tulis Ulasan: rating bintang, unggah foto (wajib), hitung karakter, dan tombol kirim.
   ulasan.html?demo=foto menampilkan keadaan frame 10 (foto contoh sudah terunggah). */
(function () {
  "use strict";

  var MAX_PHOTOS = 5;
  var MAX_BYTES = 5 * 1024 * 1024;
  var RATING_TEXT = ["", "Sangat kecewa", "Kurang puas", "Cukup", "Puas", "Sangat puas"];
  var HINT_EMPTY = "Pilih 1 sampai 5 bintang";
  var MSG_WAIT = "Tambahkan rating dan minimal 1 foto untuk mengirim ulasan.";
  var MSG_READY = "Siap dikirim. Ulasan tampil di halaman produk setelah diperiksa.";

  // Foto contoh sama seperti di Figma (frame 10), dengan crop yang sama.
  var DEMO_PHOTOS = [
    { src: "assets/img/model-gips.jpg", name: "IMG_2041.jpg", crop: "left:-33.33%;top:-0.01%;width:166.67%;height:111.12%" },
    { src: "assets/img/gips.jpg", name: "IMG_2042.jpg", crop: "left:-1.92%;top:-48.25%;width:192.31%;height:258.56%" },
    { src: "assets/img/model-gips.jpg", name: "IMG_2045.jpg", crop: "left:-75%;top:-33.34%;width:250%;height:166.69%" }
  ];
  var DEMO_TEXT = "Hasil cor keras dan permukaannya halus, cocok untuk model kerja crown. Rasio air pas, tidak ada gelembung. Ember tertutup rapat waktu sampai.";

  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.querySelector('.mainbar__link[href="riwayat.html"]');
    if (nav) nav.setAttribute("aria-current", "page");

    var form = document.getElementById("form-ulasan");
    var radios = Array.prototype.slice.call(form.querySelectorAll('input[name="rating"]'));
    var starLabels = radios.map(function (r) { return form.querySelector('label[for="' + r.id + '"]'); });
    var starsBox = form.querySelector("[data-stars]");
    var hint = form.querySelector("[data-rate-hint]");
    var input = document.getElementById("foto");
    var dropzone = form.querySelector(".dropzone");
    var thumbs = form.querySelector("[data-thumbs]");
    var addTile = form.querySelector(".thumbs__add");
    var count = form.querySelector("[data-photo-count]");
    var textarea = document.getElementById("isi");
    var textCount = form.querySelector("[data-text-count]");
    var submit = form.querySelector('button[type="submit"]');
    var submitMsg = form.querySelector("[data-submit-msg]");
    var submitIcon = form.querySelector("[data-submit-icon]");
    var currentStatus = document.querySelector("[data-current-status]");

    var photos = []; // { src, name, crop?, url? }

    function toast(msg) { if (window.DentaStok) window.DentaStok.toast(msg); }

    function rating() {
      for (var i = 0; i < radios.length; i++) if (radios[i].checked) return i + 1;
      return 0;
    }

    function paintStars(n) {
      starLabels.forEach(function (l, i) { l.classList.toggle("is-on", i < n); });
    }

    function updateRating() {
      var r = rating();
      paintStars(r);
      hint.textContent = r ? RATING_TEXT[r] : HINT_EMPTY;
      hint.classList.toggle("is-set", r > 0);
      updateSubmit();
    }

    function updateSubmit() {
      var ready = rating() > 0 && photos.length > 0;
      submit.disabled = !ready;
      submitMsg.textContent = ready ? MSG_READY : MSG_WAIT;
      submitIcon.src = ready ? "assets/icons/check-green-lg.svg" : "assets/icons/info.svg";
      if (currentStatus) currentStatus.textContent = ready ? "Siap dikirim" : "Sedang diulas";
    }

    function renderPhotos() {
      Array.prototype.slice.call(thumbs.querySelectorAll(".thumb")).forEach(function (el) { el.remove(); });
      photos.forEach(function (p, i) {
        var item = document.createElement("div");
        item.className = "thumb";
        var box = document.createElement("div");
        box.className = "thumb__img";
        var img = document.createElement("img");
        img.src = p.src;
        img.alt = "Foto ulasan " + (i + 1) + ", " + p.name;
        if (p.crop) img.setAttribute("style", p.crop); else img.className = "is-cover";
        var del = document.createElement("button");
        del.type = "button";
        del.className = "thumb__remove";
        del.setAttribute("aria-label", "Hapus foto " + p.name);
        del.innerHTML = '<img src="assets/icons/x-white.svg" width="14" height="14" alt="">';
        del.addEventListener("click", function () { removePhoto(i); });
        var name = document.createElement("p");
        name.className = "thumb__name mono";
        name.textContent = p.name;
        name.title = p.name;
        box.appendChild(img); box.appendChild(del);
        item.appendChild(box); item.appendChild(name);
        thumbs.insertBefore(item, addTile);
      });
      var has = photos.length > 0;
      thumbs.hidden = !has;
      dropzone.hidden = has;
      addTile.hidden = photos.length >= MAX_PHOTOS;
      count.textContent = photos.length;
      updateSubmit();
    }

    function removePhoto(i) {
      var p = photos.splice(i, 1)[0];
      if (p && p.url) URL.revokeObjectURL(p.url);
      renderPhotos();
      var next = thumbs.querySelectorAll(".thumb__remove")[Math.min(i, photos.length - 1)];
      (next || input).focus();
    }

    function addFiles(list) {
      var files = Array.prototype.slice.call(list || []);
      var skipped = 0, tooBig = 0, full = 0;
      files.forEach(function (f) {
        if (!/^image\//.test(f.type)) { skipped++; return; }
        if (f.size > MAX_BYTES) { tooBig++; return; }
        if (photos.length >= MAX_PHOTOS) { full++; return; }
        var url = URL.createObjectURL(f);
        photos.push({ src: url, url: url, name: f.name });
      });
      renderPhotos();
      if (full) toast("Maksimal 5 foto per ulasan");
      else if (tooBig) toast("Foto lebih dari 5 MB tidak bisa diunggah");
      else if (skipped) toast("Pilih file gambar, JPG atau PNG");
    }

    // Rating
    radios.forEach(function (r, i) {
      r.addEventListener("change", updateRating);
      starLabels[i].addEventListener("mouseenter", function () { paintStars(i + 1); });
    });
    starsBox.addEventListener("mouseleave", function () { paintStars(rating()); });

    // Foto: pilih dari perangkat
    input.addEventListener("change", function () {
      addFiles(input.files);
      input.value = "";
    });

    // Foto: tarik dan lepas
    Array.prototype.slice.call(form.querySelectorAll("[data-dropzone]")).forEach(function (zone) {
      ["dragenter", "dragover"].forEach(function (ev) {
        zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add("is-drag"); });
      });
      ["dragleave", "drop"].forEach(function (ev) {
        zone.addEventListener(ev, function () { zone.classList.remove("is-drag"); });
      });
      zone.addEventListener("drop", function (e) {
        e.preventDefault();
        if (e.dataTransfer) addFiles(e.dataTransfer.files);
      });
    });

    // Hitung karakter
    function updateCount() { textCount.textContent = textarea.value.length + "/500"; }
    textarea.addEventListener("input", updateCount);

    // Kirim
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (submit.disabled) return;
      window.location.href = "ulasan-terkirim.html";
    });

    // Keadaan frame 10: ulasan.html?demo=foto
    if (/(^|[?&])demo=foto(&|$)/.test(window.location.search)) {
      radios[4].checked = true;
      photos = DEMO_PHOTOS.slice();
      textarea.value = DEMO_TEXT;
      ["label-deskripsi", "label-kemasan", "label-waktu"].forEach(function (id) { document.getElementById(id).checked = true; });
    }

    updateCount();
    updateRating();
    renderPhotos();
  });
})();
