/* Client Reviews lấy thật từ Google Maps (Places API New).
   Cần js/google-config.js (chứa GOOGLE_API_KEY) nạp trước file này. */
(function () {
  var PLACE_ID = 'ChIJSey1SFerNTER4WbhqPXdWlY';
  var CACHE_KEY = 'mrtattoo_google_reviews_v1';
  var CACHE_MS = 6 * 60 * 60 * 1000; // 6 giờ, đỡ tốn quota API

  var track = document.getElementById('reviewTrack');
  if (!track) return;

  // CSS cho card review kiểu Google (không có ảnh lớn)
  var st = document.createElement('style');
  st.textContent =
    '.review-google .review-body{padding-top:18px}' +
    '.review-google .review-author{display:flex;align-items:center;gap:10px;margin-bottom:8px}' +
    '.review-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;border:1px solid var(--y);flex:none}' +
    '.review-google small{display:block;color:#c9b58a;font-size:.78rem}' +
    '.review-more{text-align:center;margin:16px 0 0}';
  document.head.appendChild(st);

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function card(r, hidden) {
    var n = Math.max(0, Math.min(5, parseInt(r.rating, 10) || 0));
    var stars = n ? '<p class="review-stars" aria-label="' + n + ' out of 5 stars">' +
      '★'.repeat(n) + '☆'.repeat(5 - n) + '</p>' : '';
    var avatar = r.image
      ? '<img class="review-avatar" src="' + esc(r.image) + '" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display=\'none\'">'
      : '';
    return '<figure class="review-card review-google"' + (hidden ? ' aria-hidden="true"' : '') + '>' +
      '<div class="review-body">' +
        '<div class="review-author">' + avatar +
          '<div><cite>' + esc(r.name) + '</cite><small>' + esc(r.time) + '</small></div></div>' +
        stars +
        '<blockquote><p>“' + esc(r.text) + '”</p></blockquote>' +
      '</div></figure>';
  }

  function render(list, mapsUri) {
    // Nhân đôi để dải chạy lặp vô tận (keyframes -50%)
    var html = '';
    list.forEach(function (r) { html += card(r, false); });
    list.forEach(function (r) { html += card(r, true); });
    track.innerHTML = html;

    if (mapsUri && !document.getElementById('reviewMore')) {
      var p = document.createElement('p');
      p.className = 'review-more';
      p.id = 'reviewMore';
      p.innerHTML = '<a class="btn btn-outline" href="' + esc(mapsUri) +
        '" target="_blank" rel="noopener">See all reviews on Google Maps</a>';
      track.parentNode.parentNode.appendChild(p);
    }
  }

  function updateRating(rating) {
    var el = document.querySelector('.trust li:last-child strong');
    if (el && rating) el.textContent = Number(rating).toFixed(1) + '★';
  }

  function fallback() {
    var list = (typeof REVIEW_LIST !== 'undefined') ? REVIEW_LIST : [];
    if (!list.length) {
      var sec = document.getElementById('reviews');
      if (sec) sec.style.display = 'none';
      return;
    }
    render(list.map(function (r) {
      return { name: r.name, rating: r.rating, text: r.text, image: '', time: r.country || '' };
    }));
  }

  function useData(d) {
    var list = (d.reviews || [])
      .filter(function (x) { return x.text && x.text.text; })
      .map(function (x) {
        return {
          name: x.authorAttribution.displayName,
          image: x.authorAttribution.photoUri,
          rating: x.rating,
          text: x.text.text,
          time: (x.relativePublishTimeDescription || '') + ' · Google'
        };
      });
    if (!list.length) throw new Error('no reviews');
    render(list, d.googleMapsUri || 'https://www.google.com/maps?cid=6222529882335831777');
    updateRating(d.rating);
  }

  // Có cache còn hạn thì dùng luôn
  try {
    var c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (c && Date.now() - c.t < CACHE_MS) { useData(c.d); return; }
  } catch (e) {}

  if (typeof GOOGLE_API_KEY === 'undefined' || !GOOGLE_API_KEY || GOOGLE_API_KEY.indexOf('DAN_API_KEY') === 0) {
    fallback();
    return;
  }

  fetch('https://places.googleapis.com/v1/places/' + PLACE_ID + '?languageCode=en', {
    headers: {
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews.rating,reviews.text,reviews.relativePublishTimeDescription,reviews.authorAttribution'
    }
  })
    .then(function (r) {
      if (!r.ok) {
        return r.text().then(function (body) {
          console.error('GOOGLE PLACES ERROR ' + r.status + ':', body);
          throw new Error(r.status);
        });
      }
      return r.json();
    })
    .then(function (d) {
      useData(d);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {}
    })
    .catch(function (e) {
      console.warn('Google reviews failed, using fallback:', e);
      fallback();
    });
})();
