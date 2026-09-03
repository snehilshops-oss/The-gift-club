import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

/* =========================================================
   F·R·I·E·N·D·S
   =========================================================
   TEST MODE:
   true  = Shibam's claiming is temporarily open for testing
   false = normal 30-day birthday rule
   ========================================================= */

const TEST_MODE = true;

const SUPABASE_URL =
  "https://pkfdvmvjdcvmmyuhskmg.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzg4NDYwNzQ4LCJleHAiOjIxMDQwMzY3NDh9.7gLvkvwxhbuw_i_cyIfEUamIRvXsxjP0AQtM8yn0PsxE";

const configured =
  !SUPABASE_URL.includes("PASTE_") &&
  !SUPABASE_ANON_KEY.includes("PASTE_");

const supabase = configured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const app = document.querySelector("#app");

/* =========================================================
   PEOPLE
   ========================================================= */

const PEOPLE = [
  {
    id: "khushi",
    name: "Khushi",
    birthday: "27 February",
    month: 1,
    day: 27,
    email: "khushi@giftclub.local"
  },
  {
    id: "snehil",
    name: "Snehil",
    birthday: "27 July",
    month: 6,
    day: 27,
    email: "snehil@giftclub.local"
  },
  {
    id: "riya",
    name: "Riya",
    birthday: "31 August",
    month: 7,
    day: 31,
    email: "riya@giftclub.local"
  },
  {
    id: "shibam",
    name: "Shibam",
    birthday: "16 October",
    month: 9,
    day: 16,
    email: "shibam@giftclub.local"
  }
];

/* =========================================================
   HELPERS
   ========================================================= */

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function nextBirthday(person) {
  const now = new Date();

  let birthday = new Date(
    now.getFullYear(),
    person.month,
    person.day
  );

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  if (birthday < today) {
    birthday = new Date(
      now.getFullYear() + 1,
      person.month,
      person.day
    );
  }

  return birthday;
}

function sortedPeopleByBirthday() {
  return [...PEOPLE].sort(
    (a, b) => nextBirthday(a) - nextBirthday(b)
  );
}

function activeBirthday() {
  return sortedPeopleByBirthday()[0];
}

function isClaimingOpen(person) {
  /*
     TEST MODE:
     Only Shibam gets the temporary testing override.
     Everyone else still follows the normal 30-day rule.
  */

  if (TEST_MODE && person.id === "shibam") {
    return true;
  }

  const birthday = nextBirthday(person);
  const now = new Date();

  const openingDate = new Date(birthday);
  openingDate.setDate(openingDate.getDate() - 30);

  return now >= openingDate && now <= birthday;
}

/* =========================================================
   HOME
   ========================================================= */

function render() {
  const active = activeBirthday();
  const people = sortedPeopleByBirthday();

  app.innerHTML = `
    <main class="shell">

      <header class="hero">
        <div>

          <div class="kicker">
            Four friends · ten years · still going
          </div>

          <h1>F·R·I·E·N·D·S</h1>

          <p>
            A little place for four people to remember
            what they actually want for their birthdays.
          </p>

        </div>
      </header>

      ${
        TEST_MODE
          ? `
            <div class="test-banner">
              🧪 Test mode is ON · Shibam's gift claiming
              is temporarily open
            </div>
          `
          : ""
      }

      <section class="next card">

        <div>

          <span class="pill">
            NEXT BIRTHDAY
          </span>

          <div class="name">
            ${escapeHtml(active.name)}
          </div>

          <div class="date">
            ${formatDate(nextBirthday(active))}
          </div>

        </div>

        <button
          class="btn"
          onclick="openPerson('${active.id}')"
        >
          Open ${escapeHtml(active.name)}'s wishlist
        </button>

      </section>

      <div class="section-head">
        <div>
          <h2>The four of us ✨</h2>
          <p>
            Everyone can browse every wishlist, all year.
          </p>
        </div>
      </div>

      <section class="grid">

        ${people.map((person) => {

          const claimingOpen =
            isClaimingOpen(person);

          return `
            <article class="person card">

              <div class="person-top">

                <div class="avatar">
                  ${person.name.charAt(0)}
                </div>

                <div>
                  <div class="kicker">
                    Birthday
                  </div>

                  <h2>
                    ${escapeHtml(person.name)}
                  </h2>

                  <div class="birthday">
                    ${escapeHtml(person.birthday)}
                  </div>
                </div>

              </div>

              <div class="bottom">

                <span class="pill">
                  ${
                    claimingOpen
                      ? "🎁 Claiming is open"
                      : "Wishlist open"
                  }
                </span>

                <button
                  class="btn secondary"
                  onclick="openPerson('${person.id}')"
                >
                  View wishlist
                </button>

              </div>

            </article>
          `;
        }).join("")}

      </section>

      <footer>
        Four people. A decade of birthdays. Hopefully
        slightly fewer “what do you want?” messages. ❤️
      </footer>

    </main>
  `;
}

window.render = render;

/* =========================================================
   WISHLIST
   ========================================================= */

window.openPerson = async function (personId) {

  const person = PEOPLE.find(
    (item) => item.id === personId
  );

  if (!person) {
    render();
    return;
  }

  let items = [];

  if (configured) {
    items = await loadItems(personId);
  }

  const claimingOpen =
    isClaimingOpen(person);

  app.innerHTML = `
    <main class="shell">

      <button
        class="btn ghost"
        onclick="render()"
      >
        ← Back
      </button>

      <header
        class="hero wishlist-hero"
      >

        <div>

          <div class="kicker">
            ${escapeHtml(person.birthday)}
          </div>

          <h1>
            ${escapeHtml(person.name)}'s wishlist 🎁
          </h1>

          <p>
            ${
              claimingOpen
                ? "Gift claiming is currently open."
                : "Wishlist editing stays open throughout the year. Gift claiming opens 30 days before the birthday."
            }
          </p>

        </div>

        <button
          class="btn secondary"
          onclick="showAdd('${person.id}')"
        >
          + Add gift
        </button>

      </header>

      <section class="items">

        ${
          items.length
            ? items.map(itemCard).join("")
            : `
              <div class="card empty">
                <div class="empty-icon">🎁</div>

                <h2>
                  Nothing here yet
                </h2>

                <p>
                  Add something you'd genuinely
                  love to receive.
                </p>
              </div>
            `
        }

      </section>

    </main>
  `;
};

/* =========================================================
   LOAD GIFTS
   ========================================================= */

async function loadItems(personId) {

  const {
    data,
    error
  } = await supabase
    .from("gifts")
    .select("*")
    .eq("person_id", personId)
    .order("created_at", {
      ascending: true
    });

  if (error) {
    console.error(error);

    alert(
      "I couldn't load this wishlist. Please refresh the page."
    );

    return [];
  }

  const gifts = data || [];

  let claimedIds = new Set();

  try {

    const {
      data: claims,
      error: claimError
    } = await supabase
      .from("gift_claims")
      .select("gift_id");

    if (!claimError && claims) {

      claimedIds = new Set(
        claims.map(
          (claim) => claim.gift_id
        )
      );
    }

  } catch (error) {
    console.error(error);
  }

  return gifts.map((gift) => ({
    ...gift,
    claimed: claimedIds.has(gift.id)
  }));
}

/* =========================================================
   GIFT CARD
   ========================================================= */

function itemCard(item) {

  const image =
    item.image_url ||
    "https://placehold.co/900x700/f7efe8/777?text=🎁";

  return `
    <article class="item card">

      <div class="item-image-wrap">

        <img
          src="${escapeHtml(image)}"
          alt="${escapeHtml(item.name || "Gift")}"
          loading="lazy"
          onerror="
            this.onerror=null;
            this.src='https://placehold.co/900x700/f7efe8/777?text=🎁';
          "
        >

      </div>

      <div class="itembody">

        <h3>
          ${escapeHtml(item.name)}
        </h3>

        ${
          item.notes
            ? `
              <div class="meta">
                ${escapeHtml(item.notes)}
              </div>
            `
            : ""
        }

        <div class="actions">

          ${
            item.url
              ? `
                <a
                  class="btn secondary"
                  href="${escapeHtml(item.url)}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View item ↗
                </a>
              `
              : ""
          }

          ${
            item.claimed
              ? `
                <button
                  class="btn secondary"
                  disabled
                >
                  ✓ Claimed
                </button>
              `
              : `
                <button
                  class="btn"
                  onclick="claimItem('${item.id}')"
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

/* =========================================================
   IMAGE COMPRESSION
   ========================================================= */

function compressImage(file) {

  return new Promise((resolve, reject) => {

    if (!file) {
      resolve(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      reject(
        new Error("Please choose an image file.")
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {

      const image = new Image();

      image.onload = () => {

        const maxSize = 1000;

        let width = image.width;
        let height = image.height;

        if (width > maxSize || height > maxSize) {

          if (width > height) {
            height =
              Math.round(
                height * maxSize / width
              );

            width = maxSize;

          } else {

            width =
              Math.round(
                width * maxSize / height
              );

            height = maxSize;
          }
        }

        const canvas =
          document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context =
          canvas.getContext("2d");

        context.drawImage(
          image,
          0,
          0,
          width,
          height
        );

        /*
          JPEG compression keeps the database payload
          much smaller than the original phone photo.
        */

        const compressed =
          canvas.toDataURL(
            "image/jpeg",
            0.78
          );

        resolve(compressed);
      };

      image.onerror = () => {
        reject(
          new Error(
            "The selected image could not be read."
          )
        );
      };

      image.src = event.target.result;
    };

    reader.onerror = () => {
      reject(
        new Error(
          "The selected image could not be read."
        )
      );
    };

    reader.readAsDataURL(file);
  });
}

/* =========================================================
   ADD GIFT
   ========================================================= */

window.showAdd = function (personId) {

  app.insertAdjacentHTML(
    "beforeend",
    `
      <div
        class="modal"
        id="modal"
      >

        <div class="modalbox card">

          <button
            class="btn ghost"
            style="float:right"
            onclick="closeModal()"
          >
            Close
          </button>

          <h2>
            Add a gift 🎁
          </h2>

          <p>
            Add something you'd genuinely be
            happy to receive.
          </p>

          <label>
            Item name
          </label>

          <input
            id="gname"
            placeholder="e.g. Sony headphones"
            autocomplete="off"
          >

          <label>
            Shopping link
          </label>

          <input
            id="gurl"
            placeholder="https://..."
            inputmode="url"
            autocomplete="off"
          >

          <label>
            Picture
          </label>

          <div class="upload-box">

            <input
              id="gimage"
              type="file"
              accept="image/*"
              onchange="previewGiftImage(event)"
            >

            <div
              id="image-preview"
              class="image-preview"
            >
              📷
              <span>
                Tap to choose a picture
              </span>
            </div>

          </div>

          <label>
            Notes
          </label>

          <input
            id="gnote"
            placeholder="Size, colour, exact version, etc."
          >

          <div class="notice">
            ✨ Your wishlist can be edited throughout
            the year.
          </div>

          <button
            id="save-gift-button"
            class="btn"
            style="width:100%;margin-top:12px"
            onclick="saveGift('${personId}')"
          >
            Add to wishlist
          </button>

        </div>

      </div>
    `
  );
};

/* =========================================================
   IMAGE PREVIEW
   ========================================================= */

window.previewGiftImage = function (event) {

  const file =
    event.target.files?.[0];

  const preview =
    document.querySelector(
      "#image-preview"
    );

  if (!file || !preview) {
    return;
  }

  const reader =
    new FileReader();

  reader.onload = (e) => {

    preview.innerHTML = `
      <img
        src="${e.target.result}"
        alt="Selected gift"
      >

      <span>
        Tap to change picture
      </span>
    `;
  };

  reader.readAsDataURL(file);
};

window.closeModal = function () {
  document
    .querySelector("#modal")
    ?.remove();
};

/* =========================================================
   SAVE GIFT
   ========================================================= */

window.saveGift = async function (personId) {

  if (!configured) {
    alert(
      "Supabase is not configured yet."
    );
    return;
  }

  const nameInput =
    document.querySelector("#gname");

  const urlInput =
    document.querySelector("#gurl");

  const imageInput =
    document.querySelector("#gimage");

  const noteInput =
    document.querySelector("#gnote");

  const saveButton =
    document.querySelector(
      "#save-gift-button"
    );

  if (
    !nameInput ||
    !urlInput ||
    !imageInput ||
    !noteInput
  ) {
    alert(
      "The gift form didn't load correctly. Please refresh the page."
    );
    return;
  }

  const name =
    nameInput.value.trim();

  const url =
    urlInput.value.trim();

  const notes =
    noteInput.value.trim();

  if (!name) {
    alert(
      "Please enter an item name."
    );

    nameInput.focus();

    return;
  }

  if (saveButton) {
    saveButton.disabled = true;
    saveButton.textContent =
      "Adding gift…";
  }

  try {

    let imageUrl = null;

    const file =
      imageInput.files?.[0];

    if (file) {

      imageUrl =
        await compressImage(file);

      /*
        Extremely large compressed images can still be
        problematic for database rows.
      */

      if (
        imageUrl &&
        imageUrl.length > 1200000
      ) {
        alert(
          "That picture is still too large. Please choose a smaller photo."
        );

        if (saveButton) {
          saveButton.disabled = false;
          saveButton.textContent =
            "Add to wishlist";
        }

        return;
      }
    }

    const gift = {
      person_id: personId,
      name: name,
      image_url: imageUrl,
      url: url || null,
      notes: notes || null
    };

    const {
      error
    } = await supabase
      .from("gifts")
      .insert(gift);

    if (error) {

      console.error(
        "Gift insert error:",
        error
      );

      alert(
        "Couldn't add this gift.\n\n" +
        error.message
      );

      return;
    }

    closeModal();

    await openPerson(personId);

  } catch (error) {

    console.error(error);

    alert(
      error.message ||
      "Something went wrong while adding the gift."
    );

  } finally {

    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent =
        "Add to wishlist";
    }
  }
};

/* =========================================================
   CLAIM
   ========================================================= */

window.claimItem = async function (giftId) {

  if (!configured) {
    alert(
      "Supabase is not configured yet."
    );
    return;
  }

  const {
    data: gift,
    error
  } = await supabase
    .from("gifts")
    .select("id, person_id, name")
    .eq("id", giftId)
    .single();

  if (error || !gift) {
    alert(
      "This gift could not be found. Please refresh the wishlist."
    );
    return;
  }

  const owner =
    PEOPLE.find(
      (person) =>
        person.id === gift.person_id
    );

  if (!owner) {
    alert(
      "This gift belongs to an unknown wishlist."
    );
    return;
  }

  if (!isClaimingOpen(owner)) {
    alert(
      `Gift claiming isn't open for ${owner.name}'s birthday yet.`
    );
    return;
  }

  const {
    data: existingClaim
  } = await supabase
    .from("gift_claims")
    .select("gift_id")
    .eq("gift_id", giftId)
    .maybeSingle();

  if (existingClaim) {

    alert(
      "That gift has already been claimed. 🎁"
    );

    await openPerson(
      gift.person_id
    );

    return;
  }

  showShopperLogin(
    giftId,
    gift.person_id
  );
};

/* =========================================================
   SHOPPER LOGIN
   ========================================================= */

function showShopperLogin(
  giftId,
  ownerId
) {

  app.insertAdjacentHTML(
    "beforeend",
    `
      <div
        class="modal"
        id="modal"
      >

        <div class="modalbox card">

          <button
            class="btn ghost"
            style="float:right"
            onclick="closeModal()"
          >
            Close
          </button>

          <h2>
            Who's shopping? 🛍️
          </h2>

          <p>
            Choose your name and enter your PIN/password.
            The birthday person will not be shown who claimed
            the gift.
          </p>

          <label>
            Your name
          </label>

          <select
            id="shopper"
            style="
              width:100%;
              padding:13px;
              border:1px solid var(--line);
              border-radius:13px;
              background:white;
            "
          >

            ${PEOPLE.map((person) => `
              <option
                value="${person.id}"
                ${person.id === ownerId ? "disabled" : ""}
              >
                ${escapeHtml(person.name)}
                ${
                  person.id === ownerId
                    ? " — birthday person"
                    : ""
                }
              </option>
            `).join("")}

          </select>

          <label>
            PIN / password
          </label>

          <input
            id="pass"
            type="password"
            inputmode="numeric"
            placeholder="Enter your PIN or password"
            autocomplete="current-password"
          >

          <button
            class="btn"
            style="width:100%;margin-top:12px"
            onclick="doClaim('${giftId}')"
          >
            Claim this gift 🎁
          </button>

          <div
            class="notice"
            style="margin-top:12px"
          >
            🔒 Your claim stays hidden from the
            birthday person.
          </div>

        </div>

      </div>
    `
  );

  setTimeout(() => {
    document
      .querySelector("#pass")
      ?.focus();
  }, 50);
}

/* =========================================================
   DO CLAIM
   ========================================================= */

window.doClaim = async function (giftId) {

  const shopperElement =
    document.querySelector("#shopper");

  const passwordElement =
    document.querySelector("#pass");

  if (
    !shopperElement ||
    !passwordElement
  ) {
    alert(
      "The claim form could not be loaded. Please refresh the page."
    );
    return;
  }

  const shopperId =
    shopperElement.value;

  const password =
    passwordElement.value;

  if (!password) {
    alert(
      "Please enter your PIN/password."
    );

    passwordElement.focus();

    return;
  }

  const shopper =
    PEOPLE.find(
      (person) =>
        person.id === shopperId
    );

  if (!shopper) {
    alert(
      "Please choose your name."
    );
    return;
  }

  const {
    data: gift,
    error: giftError
  } = await supabase
    .from("gifts")
    .select("id, person_id, name")
    .eq("id", giftId)
    .single();

  if (giftError || !gift) {
    alert(
      "That gift could not be found. Please refresh the wishlist."
    );
    return;
  }

  if (
    gift.person_id === shopperId
  ) {
    alert(
      "You can't claim your own birthday gift. ❤️"
    );
    return;
  }

  const owner =
    PEOPLE.find(
      (person) =>
        person.id === gift.person_id
    );

  if (!owner) {
    alert(
      "This gift belongs to an unknown wishlist."
    );
    return;
  }

  if (!isClaimingOpen(owner)) {
    alert(
      "Gift claiming isn't open for this birthday yet."
    );
    return;
  }

  /*
     Sign in using the selected friend's Supabase
     account.
  */

  const {
    data: authData,
    error: authError
  } = await supabase.auth.signInWithPassword({
    email: shopper.email,
    password: password
  });

  if (
    authError ||
    !authData?.user
  ) {

    console.error(
      "Authentication error:",
      authError
    );

    alert(
      "The PIN/password didn't work.\n\n" +
      "Please check the name and PIN/password and try again."
    );

    return;
  }

  /*
     Check again immediately before inserting the claim.
  */

  const {
    data: alreadyClaimed
  } = await supabase
    .from("gift_claims")
    .select("gift_id")
    .eq("gift_id", giftId)
    .maybeSingle();

  if (alreadyClaimed) {

    alert(
      "That gift has already been claimed. 🎁"
    );

    closeModal();

    await openPerson(
      gift.person_id
    );

    return;
  }

  /*
     Save claim.
  */

  const {
    error: insertError
  } = await supabase
    .from("gift_claims")
    .insert({
      gift_id: giftId,
      shopper_id: authData.user.id
    });

  if (insertError) {

    console.error(
      "Claim insert error:",
      insertError
    );

    if (
      insertError.code === "23505"
    ) {

      alert(
        "That gift has already been claimed. 🎁"
      );

      closeModal();

      await openPerson(
        gift.person_id
      );

      return;
    }

    alert(
      "The gift couldn't be claimed.\n\n" +
      insertError.message
    );

    return;
  }

  closeModal();

  alert(
    "🎉 Claimed!\n\nThe birthday person won't be shown who claimed it."
  );

  await openPerson(
    gift.person_id
  );
};

/* =========================================================
   VISUAL UPGRADE
   ========================================================= */

const visualUpgrade = document.createElement("style");

visualUpgrade.textContent = `

  :root {
    --birthday-pink: #f3d7df;
    --birthday-peach: #f5dfca;
    --birthday-yellow: #f5e8b7;
    --birthday-lilac: #ddd7ee;
    --birthday-green: #dce8d9;
    --ink: #27231f;
  }

  body {
    background:
      radial-gradient(
        circle at 10% 5%,
        rgba(243,215,223,.75),
        transparent 27%
      ),
      radial-gradient(
        circle at 90% 10%,
        rgba(245,232,183,.65),
        transparent 25%
      ),
      #faf8f5;
  }

  .hero {
    position: relative;
  }

  .hero::after {
    content: "✦  ✨  🎂  ✦";
    display: block;
    margin-top: 16px;
    font-size: 18px;
    letter-spacing: 8px;
    opacity: .65;
  }

  .next {
    background:
      linear-gradient(
        135deg,
        rgba(243,215,223,.75),
        rgba(245,232,183,.65)
      );
    border-color: rgba(150,120,100,.15);
  }

  .person {
    background:
      linear-gradient(
        145deg,
        rgba(255,255,255,.98),
        rgba(250,240,235,.92)
      );
  }

  .person:nth-child(2) {
    background:
      linear-gradient(
        145deg,
        rgba(255,255,255,.98),
        rgba(238,234,247,.9)
      );
  }

  .person:nth-child(3) {
    background:
      linear-gradient(
        145deg,
        rgba(255,255,255,.98),
        rgba(237,245,233,.9)
      );
  }

  .person:nth-child(4) {
    background:
      linear-gradient(
        145deg,
        rgba(255,255,255,.98),
        rgba(247,237,221,.9)
      );
  }

  .person-top {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .avatar {
    width: 54px;
    height: 54px;
    min-width: 54px;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background:
      linear-gradient(
        135deg,
        var(--birthday-pink),
        var(--birthday-peach)
      );
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
    box-shadow:
      0 7px 18px rgba(80,60,50,.10);
  }

  .person:nth-child(2) .avatar {
    background:
      linear-gradient(
        135deg,
        var(--birthday-lilac),
        #eee9f5
      );
  }

  .person:nth-child(3) .avatar {
    background:
      linear-gradient(
        135deg,
        var(--birthday-green),
        #edf4e9
      );
  }

  .person:nth-child(4) .avatar {
    background:
      linear-gradient(
        135deg,
        var(--birthday-yellow),
        var(--birthday-peach)
      );
  }

  .item {
    overflow: hidden;
    border: 1px solid rgba(120,100,80,.12);
  }

  .item-image-wrap {
    background:
      linear-gradient(
        135deg,
        #f5e9e1,
        #eee9f3
      );
  }

  .item-image-wrap img {
    display: block;
    width: 100%;
    aspect-ratio: 1.25;
    object-fit: cover;
  }

  .empty {
    text-align: center;
    padding: 45px 25px;
  }

  .empty-icon {
    font-size: 42px;
    margin-bottom: 10px;
  }

  .test-banner {
    margin: 0 0 18px;
    padding: 12px 16px;
    border-radius: 14px;
    background: #fff2cc;
    border: 1px solid #ead79b;
    color: #66551f;
    font-size: 14px;
    font-weight: 600;
  }

  .upload-box {
    position: relative;
    margin-bottom: 14px;
  }

  .upload-box input[type="file"] {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
  }

  .image-preview {
    min-height: 120px;
    border: 1.5px dashed #cdbeb2;
    border-radius: 16px;
    background:
      linear-gradient(
        135deg,
        #fbf3ee,
        #f5f1f7
      );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 7px;
    color: #75685f;
    font-size: 25px;
  }

  .image-preview span {
    font-size: 13px;
  }

  .image-preview img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 14px;
  }

  .btn {
    transition:
      transform .15s ease,
      box-shadow .15s ease;
  }

  .btn:hover {
    transform: translateY(-1px);
  }

  .pill {
    background: rgba(255,255,255,.72);
  }

  .notice {
    background:
      linear-gradient(
        135deg,
        rgba(243,215,223,.5),
        rgba(221,215,238,.4)
      );
  }

  .modalbox {
    box-shadow:
      0 24px 70px rgba(45,35,30,.20);
  }

  footer {
    opacity: .72;
  }

`;

document.head.appendChild(
  visualUpgrade
);

/* =========================================================
   START
   ========================================================= */

render();
