import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

/* =========================================================
   THE GIFT CLUB
   Main application file
   ========================================================= */

const SUPABASE_URL = "https://pkfdvmvjdcvmmyuhskmg.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZmR2bXZqZGN2bW15dWhza21nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjA3NDgsImV4cCI6MjEwNDAzNjc0OH0.7gLvkvwxhbuwi_cyIfEUamIRvXsxjP0AQtM8yn0PsxE";

const configured =
  !SUPABASE_URL.includes("PASTE_") &&
  !SUPABASE_ANON_KEY.includes("PASTE_");

const supabase = configured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const app = document.querySelector("#app");

/* =========================================================
   PEOPLE
   Birthday order:
   Khushi → Snehil → Riya → Shibam
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

const monthNames = [
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

/* =========================================================
   SMALL HELPERS
   ========================================================= */

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return replacements[character];
  });
}

function escapeAttribute(value = "") {
  return escapeHtml(value);
}

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

/* =========================================================
   BIRTHDAY FUNCTIONS
   ========================================================= */

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
  const birthday = nextBirthday(person);
  const now = new Date();

  const openingDate = new Date(birthday);
  openingDate.setDate(openingDate.getDate() - 30);

  return now >= openingDate && now <= birthday;
}

/* =========================================================
   HOME PAGE
   ========================================================= */

function render() {
  const active = activeBirthday();
  const orderedPeople = sortedPeopleByBirthday();

  app.innerHTML = `
    <main class="shell">

      <header class="hero">
        <div>
          <div class="kicker">
            Four friends · one very long tradition
          </div>

          <h1>The Gift Club 🎁</h1>

          <p>
            Because after ten years, “what do you want?”
            has become a harder question than the birthday itself.
          </p>
        </div>
      </header>

      <section class="next card">

        <div>
          <span class="pill">NEXT BIRTHDAY</span>

          <div class="name">
            ${escapeHtml(active.name)}
          </div>

          <div class="date">
            ${formatDate(nextBirthday(active))}
          </div>
        </div>

        <button
          class="btn"
          onclick="openPerson('${escapeAttribute(active.id)}')"
        >
          Open ${escapeHtml(active.name)}'s wishlist
        </button>

      </section>

      <div class="section-head">
        <div>
          <h2>The four of us</h2>
          <p>
            Everyone can browse every wishlist, all year.
          </p>
        </div>
      </div>

      <section class="grid">

        ${orderedPeople
          .map((person) => {
            const claimingOpen = isClaimingOpen(person);

            return `
              <article class="person card">

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
                    onclick="openPerson('${escapeAttribute(person.id)}')"
                  >
                    View wishlist
                  </button>

                </div>

              </article>
            `;
          })
          .join("")}

      </section>

      <footer>
        Made for four friends who refuse to let a decade
        of birthdays defeat them. ❤️
      </footer>

    </main>
  `;
}

/*
  IMPORTANT:
  The previous version used onclick="render()".
  Inline onclick handlers need render() to be on window.
*/
window.render = render;

/* =========================================================
   OPEN PERSON
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

  const claimingOpen = isClaimingOpen(person);

  app.innerHTML = `
    <main class="shell">

      <button
        class="btn ghost"
        onclick="render()"
      >
        ← Back to The Gift Club
      </button>

      <header
        class="hero"
        style="padding-left:0"
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
          onclick="showAdd('${escapeAttribute(person.id)}')"
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
                ${
                  configured
                    ? "Nothing here yet. Add the first thing you'd genuinely love to receive. ✨"
                    : "Finish the one-time Supabase setup first."
                }
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
  const { data, error } = await supabase
    .from("gifts")
    .select("*")
    .eq("person_id", personId)
    .order("created_at", {
      ascending: true
    });

  if (error) {
    console.error("Gift loading error:", error);

    alert(
      "I couldn't load this wishlist. Please refresh the page and try again."
    );

    return [];
  }

  const gifts = data || [];

  /*
    The gifts table itself does not contain a claimed column.
    Claims live in gift_claims.

    We therefore separately retrieve the gift IDs that have
    already been claimed.
  */

  let claimedIds = new Set();

  try {
    const {
      data: claims,
      error: claimsError
    } = await supabase
      .from("gift_claims")
      .select("gift_id");

    if (!claimsError && claims) {
      claimedIds = new Set(
        claims.map((claim) => claim.gift_id)
      );
    }
  } catch (error) {
    console.error("Claim-status loading error:", error);
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
    "https://placehold.co/800x700/f0ece5/777?text=🎁+Gift";

  const claimed = Boolean(item.claimed);

  return `
    <article class="item card">

      <img
        src="${escapeAttribute(image)}"
        alt="${escapeAttribute(item.name || "Gift")}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/800x700/f0ece5/777?text=🎁+Gift';"
      >

      <div class="itembody">

        <h3>
          ${escapeHtml(item.name)}
        </h3>

        ${
          item.price
            ? `
              <div class="price">
                ₹${escapeHtml(String(item.price))}
              </div>
            `
            : ""
        }

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
                  href="${escapeAttribute(item.url)}"
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
                  onclick="claimItem('${escapeAttribute(item.id)}')"
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
            Add something you'd genuinely be happy to receive.
            Your wishlist can be edited throughout the year.
          </p>

          <label>
            Item name
          </label>

          <input
            id="gname"
            placeholder="e.g. Sony headphones"
            autocomplete="off"
          >

          <div class="row">

            <div>

              <label>
                Price
              </label>

              <input
                id="gprice"
                placeholder="2799"
                inputmode="decimal"
              >

            </div>

            <div>

              <label>
                Image URL
              </label>

              <input
                id="gimage"
                placeholder="https://..."
                inputmode="url"
              >

            </div>

          </div>

          <label>
            Shopping link
          </label>

          <input
            id="gurl"
            placeholder="https://..."
            inputmode="url"
          >

          <label>
            Notes (optional)
          </label>

          <input
            id="gnote"
            placeholder="Size, colour, exact version, etc."
          >

          <div class="notice">
            🔒 The birthday person will never see who claimed
            their gifts.
          </div>

          <button
            class="btn"
            style="width:100%;margin-top:10px"
            onclick="saveGift('${escapeAttribute(personId)}')"
          >
            Add to wishlist ✨
          </button>

        </div>

      </div>
    `
  );
};

window.closeModal = function () {
  document.querySelector("#modal")?.remove();
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

  const priceInput =
    document.querySelector("#gprice");

  const imageInput =
    document.querySelector("#gimage");

  const urlInput =
    document.querySelector("#gurl");

  const noteInput =
    document.querySelector("#gnote");

  if (
    !nameInput ||
    !priceInput ||
    !imageInput ||
    !urlInput ||
    !noteInput
  ) {
    alert(
      "The gift form could not be loaded correctly. Please refresh the page."
    );
    return;
  }

  const name =
    nameInput.value.trim();

  if (!name) {
    alert(
      "Please enter an item name."
    );
    nameInput.focus();
    return;
  }

  const gift = {
    person_id: personId,
    name: name,
    price:
      priceInput.value.trim() || null,
    image_url:
      imageInput.value.trim() || null,
    url:
      urlInput.value.trim() || null,
    notes:
      noteInput.value.trim() || null
  };

  const { error } = await supabase
    .from("gifts")
    .insert(gift);

  if (error) {
    console.error("Gift insert error:", error);

    alert(
      "Couldn't add this gift:\n\n" +
      error.message
    );

    return;
  }

  closeModal();

  await openPerson(personId);
};

/* =========================================================
   CLAIM FLOW
   ========================================================= */

window.claimItem = async function (giftId) {
  if (!configured) {
    alert(
      "Supabase is not configured yet."
    );
    return;
  }

  /*
    Before opening the login box, check that the gift still exists.
    This avoids confusing errors if someone deleted it.
  */

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

  const owner = PEOPLE.find(
    (person) => person.id === gift.person_id
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

  /*
    Check whether it has already been claimed.
  */

  const {
    data: existingClaim,
    error: existingClaimError
  } = await supabase
    .from("gift_claims")
    .select("gift_id")
    .eq("gift_id", giftId)
    .maybeSingle();

  if (
    !existingClaimError &&
    existingClaim
  ) {
    alert(
      "That gift has already been claimed. 🎁"
    );

    await openPerson(gift.person_id);
    return;
  }

  await showShopperLogin(
    giftId,
    gift.person_id
  );
};

/* =========================================================
   SHOPPER LOGIN MODAL
   ========================================================= */

async function showShopperLogin(
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
            style="width:100%;padding:13px;border:1px solid var(--line);border-radius:13px;background:white"
          >

            ${PEOPLE
              .map(
                (person) => `
                  <option
                    value="${escapeAttribute(person.id)}"
                    ${
                      person.id === ownerId
                        ? "disabled"
                        : ""
                    }
                  >
                    ${escapeHtml(person.name)}
                    ${
                      person.id === ownerId
                        ? " — birthday person"
                        : ""
                    }
                  </option>
                `
              )
              .join("")}

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
            onclick="doClaim('${escapeAttribute(giftId)}')"
          >
            Claim this gift 🎁
          </button>

          <div
            class="notice"
            style="margin-top:12px"
          >
            Your name is only used to protect the claim.
            The birthday person will not see it.
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
   PERFORM CLAIM
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
      (person) => person.id === shopperId
    );

  if (!shopper) {
    alert(
      "Please choose your name."
    );
    return;
  }

  /*
    Never allow the birthday person to claim their own gift.
  */

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
    Supabase Auth login.
    
    These are the four Auth accounts created for
    The Gift Club. The PIN/password is the Supabase
    Auth password for the selected person.
  */

  const {
    data: authData,
    error: authError
  } = await supabase.auth.signInWithPassword({
    email: shopper.email,
    password: password
  });

  if (authError || !authData?.user) {
    console.error(
      "Supabase authentication error:",
      authError
    );

    alert(
      "The PIN/password didn't work.\n\n" +
      "Please check that you selected the correct name and entered the correct PIN/password."
    );

    return;
  }

  /*
    IMPORTANT:
    Use the authenticated Supabase user's UUID.
    This is what the gift_claims RLS policy expects.
  */

  const shopperAuthId =
    authData.user.id;

  /*
    Double-check the gift has not been claimed while
    somebody else was entering their password.
  */

  const {
    data: alreadyClaimed,
    error: claimCheckError
  } = await supabase
    .from("gift_claims")
    .select("gift_id")
    .eq("gift_id", giftId)
    .maybeSingle();

  if (
    claimCheckError &&
    claimCheckError.code !== "PGRST116"
  ) {
    console.error(
      "Claim check error:",
      claimCheckError
    );

    alert(
      "I couldn't check whether this gift was already claimed. Please try again."
    );

    return;
  }

  if (alreadyClaimed) {
    alert(
      "That gift has already been claimed. 🎁"
    );

    closeModal();
    await openPerson(gift.person_id);
    return;
  }

  /*
    Create the claim.
  */

  const {
    error: insertError
  } = await supabase
    .from("gift_claims")
    .insert({
      gift_id: giftId,
      shopper_id: shopperAuthId
    });

  if (insertError) {
    console.error(
      "Gift claim insert error:",
      insertError
    );

    /*
      PostgreSQL unique constraint:
      one claim per gift.
    */

    if (
      insertError.code === "23505"
    ) {
      alert(
        "That gift has already been claimed. 🎁"
      );

      closeModal();
      await openPerson(gift.person_id);
      return;
    }

    /*
      RLS failure.
    */

    if (
      insertError.code === "42501" ||
      insertError.message
        ?.toLowerCase()
        .includes("row-level security")
    ) {
      alert(
        "Your login worked, but Supabase did not allow the claim to be saved.\n\nPlease contact the Gift Club admin."
      );

      return;
    }

    alert(
      "The gift couldn't be claimed.\n\n" +
      insertError.message
    );

    return;
  }

  /*
    Success.
  */

  closeModal();

  alert(
    "🎉 Claimed!\n\nThe birthday person won't be shown who claimed it."
  );

  await openPerson(gift.person_id);
};

/* =========================================================
   INITIAL PAGE LOAD
   ========================================================= */

render();
