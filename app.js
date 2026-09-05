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
    emoji: "🎂",
    email: "khushi@giftclub.com"
  },
  {
    id: "snehil",
    name: "Snehil",
    birthday: "27 July",
    emoji: "🎈",
    email: "snehil@giftclub.com"
  },
  {
    id: "riya",
    name: "Riya",
    birthday: "31 August",
    emoji: "🎉",
    email: "riya@giftclub.com"
  },
  {
    id: "shibam",
    name: "Shibam",
    birthday: "16 October",
    emoji: "🥳",
    email: "shibam@giftclub.com"
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


function nextBirthday(person) {

  const now = new Date();

  const parts = person.birthday.split(" ");

  const day = Number(parts[0]);
  const month = MONTHS.indexOf(parts[1]);

  let date = new Date(
    now.getFullYear(),
    month,
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
      month,
      day
    );
  }

  return date;
}


function formatBirthday(date) {

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

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
   CURRENT USER
   ============================================================ */

async function getCurrentUser() {
async function getCurrentUser() {

  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();

  if (user) {
    return user;
  }

  const {
    data,
    error
  } = await supabase.auth.signInAnonymously();

  if (error) {
    console.error("Anonymous login error:", error);
    return null;
  }

  return data?.user || null;

}


function personFromEmail(email) {

  return PEOPLE.find(
    person =>
      person.email === email
  );

}


/* ============================================================
   STYLES
   ============================================================ */

function installStyles() {

  if (
    document.querySelector(
      "#friends-styles"
    )
  ) {
    return;
  }


  const style =
    document.createElement("style");


  style.id =
    "friends-styles";


  style.textContent = `

    @import url(
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
    );


    :root {

      --bg: #f5f7fb;

      --card: #ffffff;

      --text: #172033;

      --muted: #69758a;

      --line: #e2e7f0;

      --blue: #4169e1;

      --blue-dark: #3155bd;

      --yellow: #f4c542;

      --orange: #ee8b3a;

      --green: #3ca776;

      --purple: #7659cf;

      --red: #d95757;

      --shadow:
        0 8px 28px
        rgba(25, 38, 65, .08);

      --radius: 18px;
    }


    * {
      box-sizing: border-box;
    }


    body {

      margin: 0;

      font-family:
        "Inter",
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      color: var(--text);

      background:

        radial-gradient(
          circle at 5% 0%,
          rgba(65,105,225,.10),
          transparent 25%
        ),

        radial-gradient(
          circle at 95% 5%,
          rgba(244,197,66,.12),
          transparent 23%
        ),

        var(--bg);
    }


    button,
    input,
    textarea,
    select {
      font: inherit;
    }


    button,
    a {
      -webkit-tap-highlight-color:
        transparent;
    }


    .shell {

      width:
        min(
          1080px,
          calc(100% - 28px)
        );

      margin: auto;

      padding:
        22px 0 55px;
    }


    .card {

      background: var(--card);

      border:
        1px solid
        var(--line);

      border-radius:
        var(--radius);

      box-shadow:
        var(--shadow);
    }


    /* HERO */

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
          #f1f5ff 55%,
          #fff8dc 100%
        );

      border:
        1px solid
        #edf0f5;

      box-shadow:
        var(--shadow);
    }


    .hero::after {

      content:
        "✦  🎈  ✦  🎁";

      position: absolute;

      right: 28px;

      top: 26px;

      font-size: 25px;

      opacity: .55;

      letter-spacing: 5px;
    }


    .brand {

      color: var(--blue);

      font-size: 12px;

      font-weight: 800;

      letter-spacing: 3px;

      text-transform: uppercase;
    }


    h1 {

      margin:
        10px 0 12px;

      font-size:
        clamp(
          42px,
          7vw,
          66px
        );

      line-height: .96;

      letter-spacing: -3px;

      font-weight: 800;
    }


    .hero p {

      max-width: 690px;

      margin: 0;

      color: var(--muted);

      font-size: 16px;

      line-height: 1.65;
    }


    /* USER BAR */

    .userbar {

      display: flex;

      align-items: center;

      justify-content:
        space-between;

      gap: 12px;

      margin-bottom: 18px;

      padding:
        12px 15px;

      background:
        rgba(255,255,255,.82);

      border:
        1px solid
        var(--line);

      border-radius:
        14px;
    }


    .user-info {

      color: var(--muted);

      font-size: 13px;

      font-weight: 600;
    }


    .user-info strong {

      color: var(--text);

      font-weight: 800;
    }


    /* NEXT BIRTHDAY */

    .next {

      display: flex;

      align-items: center;

      justify-content:
        space-between;

      gap: 20px;

      padding:
        25px 28px;

      margin-bottom: 40px;

      border-top:
        4px solid
        var(--yellow);
    }


    .pill {

      display: inline-flex;

      padding:
        7px 11px;

      border-radius:
        999px;

      background:
        #edf2ff;

      color:
        var(--blue-dark);

      font-size: 10px;

      font-weight: 800;

      letter-spacing: 1px;

      text-transform: uppercase;
    }


    .next-name {

      margin-top: 9px;

      font-size: 30px;

      font-weight: 800;
    }


    .date {

      margin-top: 4px;

      color: var(--muted);

      font-weight: 600;
    }


    /* SECTION */

    .section-head {

      margin-bottom: 17px;
    }


    .section-head h2 {

      margin:
        0 0 5px;

      font-size: 27px;

      font-weight: 800;
    }


    .section-head p {

      margin: 0;

      color: var(--muted);
    }


    /* PEOPLE */

    .people-grid {

      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0,1fr)
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

      color: var(--muted);

      font-size: 11px;

      font-weight: 800;

      letter-spacing: 1.5px;

      text-transform: uppercase;
    }


    .person h2 {

      margin:
        7px 0 5px;

      font-size: 30px;

      letter-spacing: -1px;

      font-weight: 800;
    }


    .person-birthday {

      color: var(--muted);

      font-weight: 600;
    }


    .person-bottom {

      display: flex;

      align-items: center;

      justify-content:
        space-between;

      gap: 10px;

      margin-top: 20px;
    }


    /* BUTTONS */

    .btn {

      display: inline-flex;

      align-items: center;

      justify-content: center;

      min-height: 43px;

      padding:
        11px 16px;

      border: 0;

      border-radius: 11px;

      background:
        var(--blue);

      color: white;

      font-weight: 750;

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

      opacity: .6;

      cursor:
        not-allowed;

      transform: none;
    }


    /* WISHLIST NAV */

    .wishlist-nav {

      display: flex;

      justify-content:
        space-between;

      align-items: center;

      gap: 12px;

      margin-bottom: 18px;
    }


    /* GIFTS */

    .gift-grid {

      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0,1fr)
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
        #eef2f8;
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
          #edf2ff,
          #fff4cf
        );

      font-size: 52px;
    }


    .gift-body {

      padding: 20px;
    }


    .gift-title {

      margin: 0;

      font-size: 21px;

      line-height: 1.3;

      font-weight: 750;
    }


    .gift-notes {

      margin-top: 10px;

      color: var(--muted);

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
        9px 12px;

      border-radius: 10px;

      background:
        #e9f7f0;

      color:
        #23845c;

      font-size: 13px;

      font-weight: 800;
    }


    /* EMPTY */

    .empty {

      padding:
        50px 25px;

      text-align: center;

      color: var(--muted);
    }


    .empty-icon {

      font-size: 48px;

      margin-bottom: 10px;
    }


    /* MODAL */

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
          19,28,45,.58
        );

      backdrop-filter:
        blur(8px);
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


    .modal-box h2 {

      margin:
        0 0 8px;

      font-size: 29px;

      font-weight: 800;
    }


    .modal-box > p {

      color: var(--muted);

      line-height: 1.55;
    }


    .field-label {

      display: block;

      margin:
        17px 0 7px;

      font-size: 13px;

      font-weight: 800;
    }


    .field {

      width: 100%;

      padding:
        13px 14px;

      border:
        1px solid
        var(--line);

      border-radius: 12px;

      background: white;

      color: var(--text);

      outline: none;
    }


    .field:focus {

      border-color:
        var(--blue);

      box-shadow:
        0 0 0 3px
        rgba(
          65,105,225,.12
        );
    }


    textarea.field {

      min-height: 95px;

      resize: vertical;
    }


    .notice {

      margin-top: 16px;

      padding:
        13px 14px;

      border-radius: 12px;

      background:
        #f4f6fa;

      color: var(--muted);

      font-size: 13px;

      line-height: 1.5;
    }


    .modal-submit {

      width: 100%;

      margin-top: 16px;
    }


    /* LOGIN */

    .login-page {

      min-height: 100vh;

      display: flex;

      align-items: center;

      justify-content: center;

      padding: 20px;
    }


    .login-card {

      width:
        min(
          480px,
          100%
        );

      padding: 32px;
    }


    .login-logo {

      font-size: 13px;

      font-weight: 800;

      letter-spacing: 3px;

      color: var(--blue);

      text-transform: uppercase;
    }


    .login-card h1 {

      margin-top: 12px;

      font-size: 48px;
    }


    .login-error {

      display: none;

      margin-top: 14px;

      padding: 12px;

      border-radius: 11px;

      background:
        #fff0f0;

      color:
        #b13e3e;

      font-size: 13px;

      font-weight: 600;
    }


    /* FOOTER */

    footer {

      padding-top: 42px;

      text-align: center;

      color: #8791a2;

      font-size: 13px;
    }


    /* MOBILE */

    @media (max-width:720px) {

      .shell {

        width:
          calc(100% - 18px);

        padding-top: 10px;
      }


      .hero {

        padding:
          28px 22px;

        border-radius: 22px;
      }


      .hero::after {

        position: static;

        display: block;

        margin-top: 20px;
      }


      h1 {

        font-size: 47px;
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


      .userbar {

        align-items:
          flex-start;

        flex-direction:
          column;
      }


      .userbar .btn {

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
   LOGIN SCREEN
   ============================================================ */

function renderLogin() {

  app.innerHTML = `

    <main class="login-page">

      <section class="login-card card">

        <div class="login-logo">
          F · R · I · E · N · D · S
        </div>

        <h1>
          Friends
        </h1>

        <p style="color:var(--muted);line-height:1.6">
          Log in once and you're in.
          No need to enter your password
          again when claiming a gift.
        </p>


        <label
          class="field-label"
          for="login-person"
        >
          Who are you?
        </label>

        <select
          id="login-person"
          class="field"
        >

          ${PEOPLE.map(person => `

            <option
              value="${person.id}"
            >
              ${escapeHtml(person.name)}
            </option>

          `).join("")}

        </select>


        <label
          class="field-label"
          for="login-password"
        >
          Password
        </label>

        <input
          id="login-password"
          class="field"
          type="password"
          placeholder="Your password"
          autocomplete="current-password"
        >


        <div
          id="login-error"
          class="login-error"
        ></div>


        <button
          id="login-button"
          class="btn modal-submit"
          onclick="login()"
        >
          Log in
        </button>


        <div class="notice">

          🔒 Your login stays on this device.
          Once you're logged in, claiming and
          undoing claims does not require another
          password.

        </div>

      </section>

    </main>

  `;

}


/* ============================================================
   LOGIN
   ============================================================ */

window.login = async function() {

  const personId =
    document
      .querySelector("#login-person")
      ?.value;


  const password =
    document
      .querySelector("#login-password")
      ?.value;


  const button =
    document
      .querySelector("#login-button");


  const errorBox =
    document
      .querySelector("#login-error");


  if (!password) {

    errorBox.textContent =
      "Please enter your password.";

    errorBox.style.display =
      "block";

    return;
  }


  button.disabled = true;

  button.textContent =
    "Logging in…";

  errorBox.style.display =
    "none";


  const person =
    PEOPLE.find(
      p => p.id === personId
    );


  const {
    data,
    error
  } =
    await supabase.auth.signInWithPassword({

      email:
        person.email,

      password:
        password

    });


  if (
    error ||
    !data?.user
  ) {

    console.error(
      "Login error:",
      error
    );


    button.disabled = false;

    button.textContent =
      "Log in";


    errorBox.textContent =
      "The name or password is incorrect.";

    errorBox.style.display =
      "block";

    return;
  }


  renderHome();

};


/* ============================================================
   LOGOUT
   ============================================================ */

window.logout = async function() {

  await supabase.auth.signOut();

  renderLogin();

};


/* ============================================================
   USER BAR
   ============================================================ */

async function userBar() {

  const user =
    await getCurrentUser();


  if (!user) {
    return "";
  }


  const person =
    personFromEmail(
      user.email
    );


  return `

    <div class="userbar">

      <div class="user-info">

        Logged in as
        <strong>
          ${escapeHtml(
            person?.name ||
            user.email ||
            "Friend"
          )}
        </strong>

      </div>


      <button
        class="btn ghost"
        onclick="logout()"
      >
        Log out
      </button>

    </div>

  `;

}


/* ============================================================
   HOME
   ============================================================ */

async function renderHome() {

  const user =
    await getCurrentUser();


  if (!user) {

    renderLogin();

    return;

  }


  const active =
    getNextBirthdayPerson();


  const people =
    orderedPeople();


  app.innerHTML = `

    <main class="shell">

      ${await userBar()}


      <header class="hero">

        <div class="brand">
          F · R · I · E · N · D · S
        </div>

        <h1>
          Friends
        </h1>

        <p>
          Four friends. Four wishlists.
          One place for all the things
          everyone actually wants.
        </p>

      </header>


      <section class="next card">

        <div>

          <span class="pill">
            NEXT BIRTHDAY
          </span>

          <div class="next-name">

            ${escapeHtml(
              active.name
            )}

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

          <article
            class="person card"
          >

            <div>

              <div class="person-label">
                Birthday
              </div>

              <h2>

                ${escapeHtml(
                  person.name
                )}

                ${person.emoji}

              </h2>

              <div class="person-birthday">

                ${escapeHtml(
                  person.birthday
                )}

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

        Made for friends who are tired
        of pretending they don't want anything.

      </footer>

    </main>

  `;

}


/* ============================================================
   LOAD WISHLIST
   ============================================================ */

async function loadWishlist(personId) {

  const {
    data: gifts,
    error: giftsError
  } =
    await supabase
      .from("gifts")
      .select("*")
      .eq(
        "person_id",
        personId
      )
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


  const giftIds =
    gifts.map(
      gift => gift.id
    );


  const {
    data: claims,
    error: claimsError
  } =
    await supabase
      .from("gift_claims")
      .select(
        "id,gift_id,shopper_id"
      )
      .in(
        "gift_id",
        giftIds
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
          item.gift_id ===
          gift.id
      ) || null;


    return {
      ...gift,
      claim
    };

  });

}


/* ============================================================
   OPEN PERSON
   ============================================================ */

window.openPerson =
async function(personId) {

  const user =
    await getCurrentUser();


  if (!user) {

    renderLogin();

    return;

  }


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

          ${escapeHtml(
            person.birthday
          )}

        </div>


        <h1>

          ${escapeHtml(
            person.name
          )}

          ${person.emoji}

        </h1>


        <p>

          Add gifts whenever you want.
          Claiming is available throughout
          the entire year.

        </p>

      </header>


      <section
        id="wishlist"
        class="gift-grid"
      >

        <div class="card empty">

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

function renderGiftCard(
  gift,
  owner
) {

  const image =
    gift.image_url &&
    String(
      gift.image_url
    ).trim();


  const imageHtml =
    image

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

          ${escapeHtml(
            gift.name
          )}

        </h3>


        ${
          gift.notes

            ? `

              <div class="gift-notes">

                ${escapeHtml(
                  gift.notes
                )}

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
                    gift.url
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

                ${
                  gift.claim &&
                  gift.claim.shopper_id

                    ? `

                      <button
                        class="btn danger"
                        onclick="unclaimItem('${gift.id}')"
                      >
                        Undo my claim
                      </button>

                    `

                    : ""
                }

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

window.showAdd =
function(personId) {

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
            style="float:right"
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
            for="gift-image"
          >
            Picture URL
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
            id="gift-image"
            class="field"
            type="url"
            placeholder="Optional image URL"
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

            💡 You can add gifts anytime.
            Claiming is available all year.

          </div>


          <button
            id="add-gift-button"
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

window.closeModal =
function() {

  document
    .querySelector("#modal")
    ?.remove();

};


/* ============================================================
   SAVE GIFT
   ============================================================ */

window.saveGift =
async function(personId) {

  const user =
    await getCurrentUser();


  if (!user) {

    closeModal();

    renderLogin();

    return;

  }


  const name =
    document
      .querySelector("#gift-name")
      ?.value
      .trim();


  const url =
    document
      .querySelector("#gift-url")
      ?.value
      .trim();


  const image =
    document
      .querySelector("#gift-image")
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


  if (
    url &&
    !/^https?:\/\//i.test(url)
  ) {

    alert(
      "The shopping link should start with https://"
    );

    return;

  }


  if (
    image &&
    !/^https?:\/\//i.test(image)
  ) {

    alert(
      "The image link should start with https://"
    );

    return;

  }


  const button =
    document.querySelector(
      "#add-gift-button"
    );


  if (button) {

    button.disabled = true;

    button.textContent =
      "Adding…";

  }


  const {
    error
  } =
    await supabase
      .from("gifts")
      .insert({

        person_id:
          personId,

        name:
          name,

        url:
          url || null,

        image_url:
          image || null,

        notes:
          notes || null

      });


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
   CLAIM GIFT
   ============================================================ */

window.claimItem =
async function(giftId) {

  const user =
    await getCurrentUser();


  if (!user) {

    renderLogin();

    return;

  }


  /*
    Find the gift.
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
    Don't allow someone to claim
    their own birthday gift.
  */

  if (
    gift.person_id ===
    personFromEmail(
      user.email
    )?.id
  ) {

    alert(
      "You can't claim your own birthday gift."
    );

    return;

  }


  /*
    Check whether somebody has
    already claimed it.
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

    await openPerson(
      gift.person_id
    );

    return;

  }


  /*
    CLAIM.
    No password.
    No PIN.
    No birthday restriction.
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
          user.id

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

    }

    else {

      alert(
        "Couldn't claim this gift.\n\n" +
        insertError.message
      );

    }


    return;

  }


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

window.unclaimItem =
async function(giftId) {

  const user =
    await getCurrentUser();


  if (!user) {

    renderLogin();

    return;

  }


  const confirmed =
    confirm(
      "Undo your claim?\n\n" +
      "The gift will become available again."
    );


  if (!confirmed) {
    return;
  }


  /*
    Delete ONLY the claim belonging
    to the currently logged-in user.
  */

  const {
    data: deletedClaims,
    error
  } =
    await supabase
      .from("gift_claims")
      .delete()
      .eq(
        "gift_id",
        giftId
      )
      .eq(
        "shopper_id",
        user.id
      )
      .select("id");


  if (error) {

    console.error(
      "Unclaim error:",
      error
    );


    alert(
      "Couldn't undo the claim.\n\n" +
      error.message
    );

    return;

  }


  if (
    !deletedClaims ||
    deletedClaims.length === 0
  ) {

    alert(
      "You haven't claimed this gift."
    );

    return;

  }


  /*
    Find the wishlist owner
    and reload their wishlist.
  */

  const {
    data: gift
  } =
    await supabase
      .from("gifts")
      .select("person_id")
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

  }

  else {

    renderHome();

  }

};


/* ============================================================
   START APPLICATION
   ============================================================ */

installStyles();

getCurrentUser().then(() => {
  renderHome();
});
