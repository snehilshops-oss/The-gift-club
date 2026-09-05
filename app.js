import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

/* ============================================================
   FRIENDS — SHARED BIRTHDAY WISHLISTS
   ============================================================ */

const SUPABASE_URL =
  "https://pkfdvmvjdcvmmyuhskmg.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_6gicMOPUD296szSyxFBm3A_mi_uSfvj";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);


/* ============================================================
   PEOPLE
   ============================================================ */

const PEOPLE = [
  {
    id: "khushi",
    name: "Khushi",
    birthday: "27 February",
    emoji: "🎂"
  },
  {
    id: "snehil",
    name: "Snehil",
    birthday: "27 July",
    emoji: "🎈"
  },
  {
    id: "riya",
    name: "Riya",
    birthday: "31 August",
    emoji: "🎉"
  },
  {
    id: "shibam",
    name: "Shibam",
    birthday: "16 October",
    emoji: "🥳"
  }
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];


/* ============================================================
   AUTH EMAILS
   ============================================================ */

const AUTH_EMAILS = {
  snehil: "snehil@giftclub.local",
  khushi: "khushi@giftclub.local",
  riya: "riya@giftclub.local",
  shibam: "shibam@giftclub.local"
};


/* ============================================================
   APP
   ============================================================ */

const app = document.querySelector("#app");


/* ============================================================
   HELPERS
   ============================================================ */

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}


function safeUrl(value = "") {
  const url = String(value).trim();

  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (
      parsed.protocol !== "http:" &&
      parsed.protocol !== "https:"
    ) {
      return null;
    }

    return parsed.href;
  } catch {
    return null;
  }
}


function nextBirthday(person) {
  const now = new Date();

  const parts = person.birthday.split(" ");

  const day = Number(parts[0]);

  const monthIndex =
    MONTHS.indexOf(parts[1]);

  let date = new Date(
    now.getFullYear(),
    monthIndex,
    day
  );

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  if (date < today) {
    date = new Date(
      now.getFullYear() + 1,
      monthIndex,
      day
    );
  }

  return date;
}


function formatBirthday(date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}


function orderedPeople() {
  return [...PEOPLE].sort(
    (a, b) =>
      nextBirthday(a) - nextBirthday(b)
  );
}


function getNextBirthdayPerson() {
  return orderedPeople()[0];
}


/* ============================================================
   STYLES
   ============================================================ */

function installStyles() {

  if (document.querySelector("#friends-styles")) {
    return;
  }

  const style = document.createElement("style");

  style.id = "friends-styles";

  style.textContent = `

    :root {
      --bg: #f4f5f7;
      --card: #ffffff;
      --text: #172033;
      --muted: #697386;
      --line: #e1e5eb;

      --blue: #3867d6;
      --blue-dark: #2852b4;

      --yellow: #f4c542;
      --orange: #ef9145;
      --green: #3ea875;
      --purple: #735bc7;
      --red: #d95757;

      --shadow:
        0 10px 30px rgba(20, 30, 50, .08);

      --radius: 18px;
    }


    * {
      box-sizing: border-box;
    }


    html {
      background: var(--bg);
    }


    body {
      margin: 0;

      font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Helvetica,
        Arial,
        sans-serif;

      color: var(--text);

      background:
        linear-gradient(
          135deg,
          #f4f5f7 0%,
          #eef3fb 50%,
          #faf6e8 100%
        );

      min-height: 100vh;
    }


    button,
    input,
    textarea,
    select {
      font: inherit;
    }


    a {
      text-decoration: none;
    }


    .shell {
      width:
        min(
          1080px,
          calc(100% - 28px)
        );

      margin: auto;

      padding:
        22px
        0
        55px;
    }


    /* =========================
       HERO
       ========================= */

    .hero {
      position: relative;

      overflow: hidden;

      padding: 38px;

      margin-bottom: 22px;

      border-radius: 26px;

      background:
        linear-gradient(
          135deg,
          #ffffff 0%,
          #edf3ff 48%,
          #fff7d9 100%
        );

      border:
        1px solid
        #e4e8ef;

      box-shadow:
        var(--shadow);
    }


    .hero::before {
      content: "";

      position: absolute;

      width: 150px;
      height: 150px;

      right: -45px;
      bottom: -65px;

      border-radius: 50%;

      background:
        rgba(239,145,69,.18);
    }


    .hero::after {
      content:
        "✦   🎈   🎁   ✦";

      position: absolute;

      right: 28px;
      top: 24px;

      font-size: 23px;

      opacity: .65;

      letter-spacing: 5px;
    }


    .brand {
      position: relative;
      z-index: 1;

      color:
        var(--blue);

      font-size: 13px;

      font-weight: 900;

      letter-spacing: 4px;

      text-transform: uppercase;
    }


    h1 {
      position: relative;
      z-index: 1;

      margin:
        11px
        0
        12px;

      font-size:
        clamp(
          42px,
          7vw,
          68px
        );

      line-height: .95;

      letter-spacing: -3px;
    }


    .hero p {
      position: relative;
      z-index: 1;

      max-width: 690px;

      margin: 0;

      color:
        var(--muted);

      font-size: 16px;

      line-height: 1.65;
    }


    /* =========================
       CARDS
       ========================= */

    .card {
      background:
        var(--card);

      border:
        1px solid
        var(--line);

      border-radius:
        var(--radius);

      box-shadow:
        var(--shadow);
    }


    /* =========================
       NEXT BIRTHDAY
       ========================= */

    .next {
      display: flex;

      align-items: center;

      justify-content:
        space-between;

      gap: 20px;

      padding:
        25px
        28px;

      margin-bottom: 40px;

      border-top:
        5px solid
        var(--yellow);
    }


    .pill {
      display: inline-flex;

      padding:
        7px
        11px;

      border-radius:
        999px;

      background:
        #edf2ff;

      color:
        var(--blue-dark);

      font-size: 10px;

      font-weight: 900;

      letter-spacing: 1px;

      text-transform: uppercase;
    }


    .next-name {
      margin-top: 9px;

      font-size: 30px;

      font-weight: 850;
    }


    .date {
      margin-top: 4px;

      color:
        var(--muted);

      font-weight: 600;
    }


    /* =========================
       SECTION
       ========================= */

    .section-head {
      margin-bottom: 17px;
    }


    .section-head h2 {
      margin:
        0
        0
        5px;

      font-size: 28px;
    }


    .section-head p {
      margin: 0;

      color:
        var(--muted);
    }


    /* =========================
       PEOPLE
       ========================= */

    .people-grid {
      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 18px;
    }


    .person {
      min-height: 205px;

      padding: 24px;

      display: flex;

      flex-direction: column;

      justify-content:
        space-between;

      overflow: hidden;

      position: relative;
    }


    .person:nth-child(1) {
      border-top:
        5px solid
        var(--purple);
    }


    .person:nth-child(2) {
      border-top:
        5px solid
        var(--blue);
    }


    .person:nth-child(3) {
      border-top:
        5px solid
        var(--green);
    }


    .person:nth-child(4) {
      border-top:
        5px solid
        var(--orange);
    }


    .person-label {
      color:
        var(--muted);

      font-size: 12px;

      font-weight: 800;

      letter-spacing: 1.5px;

      text-transform: uppercase;
    }


    .person h2 {
      margin:
        7px
        0
        5px;

      font-size: 31px;

      letter-spacing: -1px;
    }


    .person-birthday {
      color:
        var(--muted);

      font-weight: 650;
    }


    .person-bottom {
      display: flex;

      align-items: center;

      justify-content:
        space-between;

      gap: 10px;

      margin-top: 20px;
    }


    /* =========================
       BUTTONS
       ========================= */

    .btn {
      display: inline-flex;

      align-items: center;

      justify-content: center;

      min-height: 43px;

      padding:
        11px
        16px;

      border: 0;

      border-radius: 12px;

      background:
        var(--blue);

      color: #fff;

      font-weight: 800;

      cursor: pointer;

      transition:
        .15s ease;
    }


    .btn:hover {
      background:
        var(--blue-dark);

      transform:
        translateY(-1px);
    }


    .btn.secondary {
      background:
        #edf1f7;

      color:
        #29364d;
    }


    .btn.secondary:hover {
      background:
        #e0e6ef;
    }


    .btn.ghost {
      background:
        transparent;

      color:
        #3d4b63;

      border:
        1px solid
        var(--line);
    }


    .btn.ghost:hover {
      background:
        #ffffff;
    }


    .btn.danger {
      background:
        #fff0f0;

      color:
        var(--red);

      border:
        1px solid
        #ffd5d5;
    }


    .btn.danger:hover {
      background:
        #ffe3e3;

      transform: none;
    }


    .btn:disabled {
      opacity: .65;

      cursor:
        not-allowed;

      transform: none;
    }


    /* =========================
       WISHLIST NAV
       ========================= */

    .wishlist-nav {
      display: flex;

      justify-content:
        space-between;

      align-items: center;

      gap: 12px;

      margin-bottom: 18px;
    }


    /* =========================
       GIFTS
       ========================= */

    .gift-grid {
      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 20px;
    }


    .gift {
      overflow: hidden;
    }


    .gift-image {
      width: 100%;

      height: 245px;

      display: block;

      object-fit: cover;

      background:
        linear-gradient(
          135deg,
          #e8efff,
          #fff2bd
        );
    }


    .gift-placeholder {
      width: 100%;

      height: 245px;

      display: flex;

      align-items: center;

      justify-content: center;

      background:
        linear-gradient(
          135deg,
          #e8efff,
          #fff2bd
        );

      font-size: 55px;
    }


    .gift-body {
      padding: 20px;
    }


    .gift-title {
      margin: 0;

      font-size: 22px;

      line-height: 1.25;
    }


    .gift-notes {
      margin-top: 10px;

      color:
        var(--muted);

      line-height: 1.55;

      white-space: pre-wrap;
    }


    .gift-actions {
      display: flex;

      flex-wrap: wrap;

      gap: 9px;

      align-items: center;

      margin-top: 18px;
    }


    .claimed {
      display: inline-flex;

      align-items: center;

      padding:
        9px
        12px;

      border-radius:
        10px;

      background:
        #e9f7f0;

      color:
        #23845c;

      font-size: 13px;

      font-weight: 850;
    }


    /* =========================
       EMPTY
       ========================= */

    .empty {
      padding:
        50px
        25px;

      text-align: center;

      color:
        var(--muted);
    }


    .empty-icon {
      font-size: 48px;

      margin-bottom: 10px;
    }


    /* =========================
       MODAL
       ========================= */

    .modal {
      position: fixed;

      inset: 0;

      z-index: 10000;

      display: flex;

      align-items: center;

      justify-content: center;

      padding: 16px;

      background:
        rgba(
          19,
          28,
          45,
          .58
        );

      backdrop-filter:
        blur(7px);
    }


    .modal-box {
      width:
        min(
          600px,
          100%
        );

      max-height:
        92vh;

      overflow-y: auto;

      padding: 28px;
    }


    .modal-close {
      float: right;
    }


    .modal-box h2 {
      margin:
        0
        0
        8px;

      font-size: 29px;
    }


    .modal-box > p {
      color:
        var(--muted);

      line-height: 1.55;
    }


    .field-label {
      display: block;

      margin:
        17px
        0
        7px;

      font-size: 13px;

      font-weight: 850;
    }


    .field {
      width: 100%;

      padding:
        13px
        14px;

      border:
        1px solid
        var(--line);

      border-radius:
        12px;

      background:
        #fff;

      color:
        var(--text);

      outline: none;
    }


    .field:focus {
      border-color:
        var(--blue);

      box-shadow:
        0 0 0 3px
        rgba(
          56,
          103,
          214,
          .12
        );
    }


    textarea.field {
      min-height: 95px;

      resize: vertical;
    }


    .notice {
      margin-top: 16px;

      padding:
        13px
        14px;

      border-radius:
        12px;

      background:
        #f4f6fa;

      color:
        var(--muted);

      font-size: 13px;

      line-height: 1.5;
    }


    .modal-submit {
      width: 100%;

      margin-top: 16px;
    }


    /* =========================
       FOOTER
       ========================= */

    footer {
      padding-top: 42px;

      text-align: center;

      color:
        #8791a2;

      font-size: 13px;
    }


    /* =========================
       MOBILE
       ========================= */

    @media (max-width: 720px) {

      .shell {
        width:
          calc(100% - 18px);

        padding-top:
          10px;
      }


      .hero {
        padding:
          28px
          22px;

        border-radius:
          23px;
      }


      .hero::after {
        position: static;

        display: block;

        margin-top:
          20px;
      }


      h1 {
        font-size:
          47px;
      }


      .next {
        flex-direction:
          column;

        align-items:
          stretch;
      }


      .next .btn {
        width: 100%;
      }


      .people-grid,
      .gift-grid {
        grid-template-columns:
          1fr;
      }


      .person {
        min-height:
          185px;
      }


      .person-bottom {
        flex-direction:
          column;

        align-items:
          stretch;
      }


      .person-bottom .btn {
        width: 100%;
      }


      .wishlist-nav {
        align-items:
          stretch;

        flex-direction:
          column;
      }


      .wishlist-nav .btn {
        width: 100%;
      }


      .gift-image,
      .gift-placeholder {
        height:
          220px;
      }

    }

  `;

  document.head.appendChild(style);
}


/* ============================================================
   HOME
   ============================================================ */

function renderHome() {

  const active =
    getNextBirthdayPerson();

  const people =
    orderedPeople();

  app.innerHTML = `

    <main class="shell">

      <header class="hero">

        <div class="brand">
          F · R · I · E · N · D · S
        </div>

        <h1>
          Friends
        </h1>

        <p>
          Four friends. Four wishlists.
          One place to keep track of the
          things everyone actually wants.
        </p>

      </header>


      <section class="next card">

        <div>

          <span class="pill">
            NEXT BIRTHDAY
          </span>

          <div class="next-name">

            ${escapeHtml(active.name)}
            ${active.emoji}

          </div>

          <div class="date">

            ${formatBirthday(
              nextBirthday(active)
            )}

          </div>

        </div>


        <button
          class="btn"
          onclick="openPerson('${active.id}')"
        >
          Open wishlist
        </button>

      </section>


      <div class="section-head">

        <h2>
          The four of us
        </h2>

        <p>
          Browse everyone's wishlist anytime.
        </p>

      </div>


      <section class="people-grid">

        ${people.map(person => `

          <article class="person card">

            <div>

              <div class="person-label">
                Birthday
              </div>

              <h2>
                ${escapeHtml(person.name)}
                ${person.emoji}
              </h2>

              <div class="person-birthday">
                ${escapeHtml(person.birthday)}
              </div>

            </div>


            <div class="person-bottom">

              <span class="pill">
                Wishlist open
              </span>

              <button
                class="btn secondary"
                onclick="openPerson('${person.id}')"
              >
                View wishlist
              </button>

            </div>

          </article>

        `).join("")}

      </section>


      <footer>
        Made for friends who are tired of
        pretending they don't want anything.
      </footer>

    </main>

  `;
}


/* ============================================================
   LOAD GIFTS
   ============================================================ */

async function loadWishlist(personId) {

  const {
    data: gifts,
    error: giftsError
  } = await supabase
    .from("gifts")
    .select("*")
    .eq("person_id", personId)
    .order(
      "created_at",
      {
        ascending: true
      }
    );


  if (giftsError) {

    console.error(
      "Gift loading error:",
      giftsError
    );

    throw new Error(
      giftsError.message ||
      "Could not load this wishlist."
    );
  }


  if (!gifts?.length) {
    return [];
  }


  const ids =
    gifts.map(gift => gift.id);


  const {
    data: claims,
    error: claimsError
  } = await supabase
    .from("gift_claims")
    .select(
      "id,gift_id,shopper_id"
    )
    .in(
      "gift_id",
      ids
    );


  if (claimsError) {

    console.error(
      "Claim loading error:",
      claimsError
    );

    throw new Error(
      claimsError.message ||
      "Could not load claim information."
    );
  }


  return gifts.map(gift => {

    const claim =
      (claims || []).find(
        item =>
          item.gift_id === gift.id
      ) || null;

    return {
      ...gift,
      claim
    };

  });

}


/* ============================================================
   OPEN WISHLIST
   ============================================================ */

window.openPerson = async function(personId) {

  const person =
    PEOPLE.find(
      item =>
        item.id === personId
    );


  if (!person) {
    return;
  }


  app.innerHTML = `

    <main class="shell">

      <div class="wishlist-nav">

        <button
          class="btn ghost"
          onclick="renderHome()"
        >
          ← Back
        </button>


        <button
          class="btn"
          onclick="showAdd('${person.id}')"
        >
          + Add gift
        </button>

      </div>


      <header class="hero">

        <div class="brand">
          ${escapeHtml(person.birthday)}
        </div>

        <h1>
          ${escapeHtml(person.name)}
          ${person.emoji}
        </h1>

        <p>
          Add or change gifts whenever you want.
          Claiming is available all year.
        </p>

      </header>


      <section
        id="wishlist"
        class="gift-grid"
      >

        <div
          class="card empty"
          style="grid-column:1/-1"
        >

          <div class="empty-icon">
            ⏳
          </div>

          Loading wishlist…

        </div>

      </section>

    </main>

  `;


  try {

    const gifts =
      await loadWishlist(
        person.id
      );


    const container =
      document.querySelector(
        "#wishlist"
      );


    if (!container) {
      return;
    }


    if (!gifts.length) {

      container.innerHTML = `

        <div
          class="card empty"
          style="grid-column:1/-1"
        >

          <div class="empty-icon">
            🎁
          </div>

          <h2>
            Nothing here yet
          </h2>

          <p>
            Add the first thing you'd
            genuinely love to receive.
          </p>

          <button
            class="btn"
            onclick="showAdd('${person.id}')"
          >
            + Add first gift
          </button>

        </div>

      `;

      return;
    }


    container.innerHTML =
      gifts
        .map(
          gift =>
            renderGiftCard(
              gift,
              person
            )
        )
        .join("");

  }

  catch (error) {

    console.error(error);


    const container =
      document.querySelector(
        "#wishlist"
      );


    if (container) {

      container.innerHTML = `

        <div
          class="card empty"
          style="grid-column:1/-1"
        >

          <div class="empty-icon">
            ⚠️
          </div>

          <h2>
            Couldn't load this wishlist
          </h2>

          <p>
            ${escapeHtml(
              error.message
            )}
          </p>

          <button
            class="btn"
            onclick="openPerson('${person.id}')"
          >
            Try again
          </button>

        </div>

      `;

    }

  }

};


/* ============================================================
   GIFT CARD
   ============================================================ */

function renderGiftCard(gift, owner) {

  const image =
    safeUrl(gift.image_url || "");


  const imageHtml = image

    ? `

      <img
        class="gift-image"
        src="${escapeHtml(image)}"
        alt="${escapeHtml(gift.name)}"
        loading="lazy"
        onerror="
          this.style.display='none';
          this.nextElementSibling.style.display='flex';
        "
      >

      <div
        class="gift-placeholder"
        style="display:none"
      >
        🎁
      </div>

    `

    : `

      <div class="gift-placeholder">
        🎁
      </div>

    `;


  const claimed =
    Boolean(gift.claim);


  return `

    <article class="gift card">

      ${imageHtml}


      <div class="gift-body">

        <h3 class="gift-title">
          ${escapeHtml(gift.name)}
        </h3>


        ${
          gift.notes
            ? `
              <div class="gift-notes">
                ${escapeHtml(gift.notes)}
              </div>
            `
            : ""
        }


        <div class="gift-actions">

          ${
            gift.url
              ? `
                <a
                  class="btn secondary"
                  href="${escapeHtml(
                    safeUrl(gift.url) || "#"
                  )}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View item ↗
                </a>
              `
              : ""
          }


          ${
            claimed
              ? `
                <span class="claimed">
                  ✓ Claimed
                </span>

                <button
                  class="btn danger"
                  onclick="unclaimItem('${gift.id}')"
                >
                  Undo claim
                </button>
              `
              : `
                <button
                  class="btn"
                  onclick="claimItem('${gift.id}')"
                >
                  🎁 Claim
                </button>
              `
          }

        </div>

      </div>

    </article>

  `;

}


/* ============================================================
   ADD GIFT
   ============================================================ */

window.showAdd = function(personId) {

  const person =
    PEOPLE.find(
      item =>
        item.id === personId
    );


  if (!person) {
    return;
  }


  closeModal();


  app.insertAdjacentHTML(
    "beforeend",
    `

      <div
        class="modal"
        id="modal"
      >

        <div
          class="modal-box card"
        >

          <button
            class="btn ghost modal-close"
            onclick="closeModal()"
          >
            Close
          </button>


          <h2>
            Add a gift 🎁
          </h2>


          <p>
            Add something you'd genuinely
            be happy to receive.
          </p>


          <label
            class="field-label"
            for="gift-name"
          >
            What do you want?
          </label>

          <input
            id="gift-name"
            class="field"
            type="text"
            placeholder="e.g. Sony headphones"
            autocomplete="off"
          >


          <label
            class="field-label"
            for="gift-url"
          >
            Shopping link
            <span
              style="
                font-weight:500;
                color:#8791a2
              "
            >
              (optional)
            </span>
          </label>

          <input
            id="gift-url"
            class="field"
            type="url"
            placeholder="https://..."
            autocomplete="off"
          >


          <label
            class="field-label"
            for="gift-notes"
          >
            Notes
            <span
              style="
                font-weight:500;
                color:#8791a2
              "
            >
              (optional)
            </span>
          </label>

          <textarea
            id="gift-notes"
            class="field"
            placeholder="Colour, size, exact version, etc."
          ></textarea>


          <div class="notice">

            💡 You can add gifts throughout
            the year. There is no 30-day
            restriction.

          </div>


          <button
            class="btn modal-submit"
            onclick="saveGift('${person.id}')"
          >
            Add to wishlist
          </button>

        </div>

      </div>

    `
  );

};


/* ============================================================
   CLOSE MODAL
   ============================================================ */

window.closeModal = function() {

  document
    .querySelector("#modal")
    ?.remove();

};


/* ============================================================
   SAVE GIFT
   ============================================================ */

window.saveGift = async function(personId) {

  const name =
    document
      .querySelector("#gift-name")
      ?.value
      .trim();


  const urlInput =
    document
      .querySelector("#gift-url")
      ?.value
      .trim();


  const notes =
    document
      .querySelector("#gift-notes")
      ?.value
      .trim();


  if (!name) {

    alert(
      "Please enter the gift name."
    );

    return;
  }


  let url = null;

  if (urlInput) {

    url =
      safeUrl(urlInput);

    if (!url) {

      alert(
        "The shopping link should start with https:// or http://"
      );

      return;
    }

  }


  const button =
    document.querySelector(
      "#modal .modal-submit"
    );


  if (button) {

    button.disabled = true;

    button.textContent =
      "Adding…";

  }


  const gift = {

    person_id:
      personId,

    name:
      name,

    url:
      url,

    notes:
      notes || null

  };


  const {
    error
  } =
    await supabase
      .from("gifts")
      .insert(gift);


  if (error) {

    console.error(
      "Gift insert error:",
      error
    );


    if (button) {

      button.disabled = false;

      button.textContent =
        "Add to wishlist";

    }


    alert(
      "Couldn't add the gift.\n\n" +
      error.message
    );

    return;
  }


  closeModal();

  await openPerson(
    personId
  );

};


/* ============================================================
   CLAIM
   ============================================================ */

window.claimItem = async function(giftId) {

  closeModal();


  app.insertAdjacentHTML(
    "beforeend",
    `

      <div
        class="modal"
        id="modal"
      >

        <div
          class="modal-box card"
        >

          <button
            class="btn ghost modal-close"
            onclick="closeModal()"
          >
            Close
          </button>


          <h2>
            Claim this gift 🎁
          </h2>


          <p>
            Choose your name and enter
            your PIN/password.
          </p>


          <label
            class="field-label"
            for="shopper"
          >
            Your name
          </label>

          <select
            id="shopper"
            class="field"
          >

            ${PEOPLE.map(
              person =>
                `
                  <option
                    value="${person.id}"
                  >
                    ${escapeHtml(
                      person.name
                    )}
                  </option>
                `
            ).join("")}

          </select>


          <label
            class="field-label"
            for="claim-password"
          >
            PIN / password
          </label>

          <input
            id="claim-password"
            class="field"
            type="password"
            autocomplete="current-password"
            placeholder="Enter your PIN/password"
          >


          <div class="notice">

            🔒 The birthday person will
            not be told who claimed it.

          </div>


          <button
            id="claim-submit"
            class="btn modal-submit"
            onclick="doClaim('${giftId}')"
          >
            Claim this gift
          </button>

        </div>

      </div>

    `
  );

};


/* ============================================================
   DO CLAIM
   ============================================================ */

window.doClaim = async function(giftId) {

  const shopperId =
    document
      .querySelector("#shopper")
      ?.value;


  const password =
    document
      .querySelector("#claim-password")
      ?.value;


  if (!shopperId || !password) {

    alert(
      "Please enter your name and PIN/password."
    );

    return;
  }


  const email =
    AUTH_EMAILS[
      shopperId
    ];


  if (!email) {

    alert(
      "That account could not be found."
    );

    return;
  }


  const button =
    document.querySelector(
      "#claim-submit"
    );


  if (button) {

    button.disabled = true;

    button.textContent =
      "Checking…";

  }


  /*
    SIGN IN
  */

  const {
    data: authData,
    error: authError
  } =
    await supabase.auth.signInWithPassword({
      email,
      password
    });


  if (
    authError ||
    !authData?.user
  ) {

    console.error(
      "Authentication error:",
      authError
    );


    if (button) {

      button.disabled = false;

      button.textContent =
        "Claim this gift";

    }


    alert(
      "That PIN/password didn't work."
    );

    return;
  }


  /*
    FIND GIFT
  */

  const {
    data: gift,
    error: giftError
  } =
    await supabase
      .from("gifts")
      .select(
        "id,person_id"
      )
      .eq(
        "id",
        giftId
      )
      .single();


  if (
    giftError ||
    !gift
  ) {

    console.error(
      giftError
    );


    alert(
      "Couldn't find this gift."
    );

    return;
  }


  /*
    DON'T ALLOW A PERSON TO
    CLAIM THEIR OWN GIFTS
  */

  if (
    gift.person_id === shopperId
  ) {

    alert(
      "You can't claim your own birthday gifts."
    );

    return;
  }


  /*
    CHECK EXISTING CLAIM
  */

  const {
    data: existingClaim,
    error: existingError
  } =
    await supabase
      .from("gift_claims")
      .select("id")
      .eq(
        "gift_id",
        giftId
      )
      .maybeSingle();


  if (existingError) {

    console.error(
      existingError
    );


    alert(
      "Couldn't check the claim status.\n\n" +
      existingError.message
    );

    return;
  }


  if (existingClaim) {

    alert(
      "That gift has already been claimed."
    );

    return;
  }


  /*
    CLAIM — AVAILABLE ALL YEAR.
    NO DATE CHECK.
  */

  const {
    error: insertError
  } =
    await supabase
      .from("gift_claims")
      .insert({

        gift_id:
          giftId,

        shopper_id:
          authData.user.id

      });


  if (insertError) {

    console.error(
      "Claim error:",
      insertError
    );


    if (
      insertError.code ===
      "23505"
    ) {

      alert(
        "That gift has already been claimed."
      );

    } else {

      alert(
        "Couldn't claim this gift.\n\n" +
        insertError.message
      );

    }

    return;
  }


  closeModal();


  alert(
    "🎁 Gift claimed!\n\n" +
    "The birthday person won't be shown who claimed it."
  );


  await openPerson(
    gift.person_id
  );

};


/* ============================================================
   UNCLAIM
   ============================================================ */

window.unclaimItem = async function(giftId) {

  const {
    data: {
      user
    }
  } =
    await supabase.auth.getUser();


  if (!user) {

    alert(
      "Please claim the gift again after signing in."
    );

    return;
  }


  /*
    Find ONLY the claim belonging
    to the currently signed-in user.
  */

  const {
    data: ownClaim,
    error: ownClaimError
  } =
    await supabase
      .from("gift_claims")
      .select(
        "id,gift_id,shopper_id"
      )
      .eq(
        "gift_id",
        giftId
      )
      .eq(
        "shopper_id",
        user.id
      )
      .maybeSingle();


  if (ownClaimError) {

    console.error(
      ownClaimError
    );


    alert(
      "Couldn't check your claim.\n\n" +
      ownClaimError.message
    );

    return;
  }


  /*
    Prevent somebody from
    removing another person's claim.
  */

  if (!ownClaim) {

    alert(
      "You can only undo your own claim."
    );

    return;
  }


  const confirmed =
    confirm(
      "Undo your claim?\n\n" +
      "The gift will become available for someone else."
    );


  if (!confirmed) {
    return;
  }


  const {
    error: deleteError
  } =
    await supabase
      .from("gift_claims")
      .delete()
      .eq(
        "id",
        ownClaim.id
      )
      .eq(
        "shopper_id",
        user.id
      );


  if (deleteError) {

    console.error(
      "Unclaim error:",
      deleteError
    );


    alert(
      "Couldn't undo the claim.\n\n" +
      deleteError.message
    );

    return;
  }


  const {
    data: gift
  } =
    await supabase
      .from("gifts")
      .select(
        "person_id"
      )
      .eq(
        "id",
        giftId
      )
      .single();


  alert(
    "Claim removed. 🎁\n\n" +
    "The gift is available again."
  );


  if (gift?.person_id) {

    await openPerson(
      gift.person_id
    );

  } else {

    renderHome();

  }

};


/* ============================================================
   START APP
   ============================================================ */

try {

  installStyles();

  renderHome();

} catch (error) {

  console.error(
    "Application startup error:",
    error
  );

  app.innerHTML = `

    <main
      style="
        max-width:700px;
        margin:60px auto;
        padding:30px;
        font-family:Arial,sans-serif;
      "
    >

      <h1>
        Something went wrong
      </h1>

      <p>
        The application could not start.
      </p>

      <pre
        style="
          white-space:pre-wrap;
          background:#f4f4f4;
          padding:20px;
          border-radius:12px;
        "
      >${escapeHtml(
        error.message ||
        String(error)
      )}</pre>

    </main>

  `;

     }
