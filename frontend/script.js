// ─────────────────────────────────────────
//   DearStranger — script.js
//   Read Letters page logic
// ─────────────────────────────────────────

// ── DATA ──────────────────────────────────

const letters = [
  {
    id: 0,
    genre: "Love",
    featured: true,
    editorPick: true,
    title: "To the one who never knew how much space they took up in my mind",
    preview:
      "I never told you. I rehearsed it a hundred times in the shower, on the bus, in the dark at 2am. The words always came out wrong or too late, or both. You moved cities and I moved on — or I told myself I did.",
    body: [
      "I never told you. I rehearsed it a hundred times in the shower, on the bus, in the dark at 2am. The words always came out wrong or too late, or both. You moved cities and I moved on — or I told myself I did.",
      "But there's a version of Tuesday afternoon that still belongs to you. The one where we sat on that bench and you laughed at something I said and I thought: this. This is what I want.",
      "I hope you're well. I hope whoever's in your life right now knows how lucky they are. I hope you laugh like that every day.",
    ],
    readTime: 4,
    daysAgo: 2,
    likes: 218,
  },
  {
    id: 1,
    genre: "Grief",
    featured: false,
    title: "Dear Dad, I still set an extra plate",
    preview:
      "It's been three years and my hands still do it automatically. I don't know if that's grief or habit or love that has nowhere to go anymore.",
    body: [
      "It's been three years and my hands still do it automatically. I don't know if that's grief or habit or love that has nowhere to go anymore.",
      "I made your chai last Sunday. Nobody asked me to. I just did it and then stood there holding the cup and the whole kitchen felt like a place I was visiting from somewhere far away.",
      "I hope you're somewhere that has good tea and bad jokes and all the time in the world.",
    ],
    readTime: 2,
    daysAgo: 5,
    likes: 94,
  },
  {
    id: 2,
    genre: "Apology",
    featured: false,
    title: "To my younger self — I'm sorry I was so unkind",
    preview:
      "You were doing your best. You didn't know it then. You just felt wrong all the time, in every room, every photo, every mirror. I want you to know — you weren't broken.",
    body: [
      "You were doing your best. You didn't know it then. You just felt wrong all the time, in every room, every photo, every mirror. I want you to know — you weren't broken.",
      "You were just scared. Scared and trying too hard to be something you'd never seen modeled for you. You were building yourself in the dark.",
      "I see you now. I'm proud of you. You made it to here — and here is better than you thought it could be.",
    ],
    readTime: 3,
    daysAgo: 7,
    likes: 147,
  },
  {
    id: 3,
    genre: "Nostalgia",
    featured: false,
    title: "The summer we didn't know was the last one",
    preview:
      "We stayed up until 4am on that rooftop talking about everything we were going to do. We were so sure. Nothing has gone the way we planned and I don't even think I'm sad about it.",
    body: [
      "We stayed up until 4am on that rooftop talking about everything we were going to do. We were so sure. Nothing has gone the way we planned and I don't even think I'm sad about it.",
      "I'm just struck by how certain we were. That certainty was its own kind of beautiful.",
      "I wonder where you are now. I wonder if you ever think of that rooftop.",
    ],
    readTime: 2,
    daysAgo: 7,
    likes: 62,
  },
  {
    id: 4,
    genre: "Hope",
    featured: false,
    title: "A letter to whoever finds this on a bad day",
    preview:
      "I wrote this at my lowest. I want someone who's there right now to read it and know — it passed for me. It will pass for you too. I promise this isn't forever.",
    body: [
      "I wrote this at my lowest. I want someone who's there right now to read it and know — it passed for me. It will pass for you too. I promise this isn't forever.",
      "The sky was still that same color when things got better. The coffee still tasted the same. Small things became big things again.",
      "Hold on. Stay. The world gets its color back.",
    ],
    readTime: 1,
    daysAgo: 14,
    likes: 331,
  },
];

// ── STATE ─────────────────────────────────

const state = {
  currentFilter: "All",
  currentSort: "recent",
  liked: {},          // { [letterId]: boolean }
  currentModal: null, // letter object or null
};

// ── HELPERS ───────────────────────────────

function formatMeta(letter) {
  const days =
    letter.daysAgo === 1
      ? "yesterday"
      : letter.daysAgo < 7
      ? `${letter.daysAgo} days ago`
      : letter.daysAgo < 14
      ? "1 week ago"
      : `${Math.round(letter.daysAgo / 7)} weeks ago`;
  return `${letter.readTime} min read · ${days}`;
}

function getFilteredSorted() {
  let list = [...letters];

  if (state.currentFilter !== "All") {
    list = list.filter((l) => l.genre === state.currentFilter);
  }

  if (state.currentSort === "loved") {
    list.sort((a, b) => b.likes - a.likes);
  } else if (state.currentSort === "short") {
    list.sort((a, b) => a.readTime - b.readTime);
  }
  // default: "recent" — already ordered by daysAgo ascending in source data

  return list;
}

function getLikeCount(letter) {
  const bonus = state.liked[letter.id] ? 1 : 0;
  return letter.likes + bonus;
}

// ── CARD RENDERING ────────────────────────

function buildCard(letter) {
  const card = document.createElement("div");
  card.className = "letter-card" + (letter.featured ? " featured" : "");
  card.setAttribute("data-id", letter.id);

  const badgeText = letter.editorPick
    ? `✦ Editor's Pick · ${letter.genre}`
    : letter.genre;

  card.innerHTML = `
    <div class="card-badge">${badgeText}</div>
    <div class="card-title">${letter.title}</div>
    <div class="card-preview">${letter.preview}</div>
    <div class="card-footer">
      <span class="card-meta">${formatMeta(letter)}</span>
      <div class="card-actions">
        <button class="action-btn like-btn${state.liked[letter.id] ? " liked" : ""}" data-id="${letter.id}" aria-label="Like letter">
          <svg viewBox="0 0 24 24" width="13" height="13">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span class="like-count">${getLikeCount(letter)}</span>
        </button>
        <button class="read-more" data-id="${letter.id}">Read →</button>
      </div>
    </div>
  `;

  return card;
}

function renderCards() {
  const grid = document.getElementById("card-grid");
  grid.innerHTML = "";

  const list = getFilteredSorted();

  if (list.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;padding:2rem 0;">No letters in this genre yet.</p>`;
    return;
  }

  list.forEach((letter, i) => {
    const card = buildCard(letter);
    card.style.animationDelay = `${0.05 + i * 0.05}s`;
    grid.appendChild(card);
  });
}

// ── LIKE TOGGLE ───────────────────────────

function toggleLike(id) {
  state.liked[id] = !state.liked[id];

  // Update all like buttons for this id (card + modal)
  document.querySelectorAll(`.like-btn[data-id="${id}"]`).forEach((btn) => {
    btn.classList.toggle("liked", state.liked[id]);
    const countEl = btn.querySelector(".like-count");
    if (countEl) {
      const letter = letters.find((l) => l.id === id);
      countEl.textContent = getLikeCount(letter);
    }
  });

  // Update modal save button if open
  if (state.currentModal && state.currentModal.id === id) {
    const modalLike = document.getElementById("modal-like-btn");
    modalLike.classList.toggle("liked", state.liked[id]);
  }
}

// ── MODAL ─────────────────────────────────

function openModal(letter) {
  state.currentModal = letter;

  document.getElementById("m-genre").textContent = letter.genre;
  document.getElementById("m-title").textContent = letter.title;
  document.getElementById("m-meta").textContent = formatMeta(letter);

  const body = document.getElementById("m-body");
  body.innerHTML = letter.body
    .map((para) => `<p>${para}</p>`)
    .join("");

  const modalLike = document.getElementById("modal-like-btn");
  modalLike.classList.toggle("liked", !!state.liked[letter.id]);
  modalLike.setAttribute("data-id", letter.id);

  document.getElementById("modal-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
  document.body.style.overflow = "";
  state.currentModal = null;
}

// ── FILTER ────────────────────────────────

function setFilter(genre) {
  state.currentFilter = genre;

  document.querySelectorAll(".filter-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.genre === genre);
  });

  renderCards();
}

// ── SORT ──────────────────────────────────

function setSort(value) {
  state.currentSort = value;
  renderCards();
}

// ── EVENT DELEGATION ─────────────────────

document.getElementById("card-grid").addEventListener("click", (e) => {
  // Like button
  const likeBtn = e.target.closest(".like-btn");
  if (likeBtn) {
    e.stopPropagation();
    toggleLike(Number(likeBtn.dataset.id));
    return;
  }

  // Read more button
  const readMore = e.target.closest(".read-more");
  if (readMore) {
    e.stopPropagation();
    const letter = letters.find((l) => l.id === Number(readMore.dataset.id));
    if (letter) openModal(letter);
    return;
  }

  // Entire card click
  const card = e.target.closest(".letter-card");
  if (card) {
    const letter = letters.find((l) => l.id === Number(card.dataset.id));
    if (letter) openModal(letter);
  }
});

// Filter pills
document.getElementById("filters").addEventListener("click", (e) => {
  const pill = e.target.closest(".filter-pill");
  if (pill) setFilter(pill.dataset.genre);
});

// Sort select
document.getElementById("sort-select").addEventListener("change", (e) => {
  setSort(e.target.value);
});

// Modal close button
document.getElementById("modal-close").addEventListener("click", closeModal);

// Click outside modal to close
document.getElementById("modal-overlay").addEventListener("click", (e) => {
  if (e.target === document.getElementById("modal-overlay")) closeModal();
});

// Escape key to close modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && state.currentModal) closeModal();
});

// Modal like button
document.getElementById("modal-like-btn").addEventListener("click", (e) => {
  if (state.currentModal) toggleLike(state.currentModal.id);
});

// Pagination (visual only — wire to backend for real data)
document.getElementById("pagination").addEventListener("click", (e) => {
  const btn = e.target.closest(".page-btn");
  if (btn && btn.textContent !== "···") {
    document.querySelectorAll(".page-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// AI strip button (placeholder — wire to your AI recommendation endpoint)
document.getElementById("ai-btn").addEventListener("click", () => {
  alert("AI recommendations coming soon! Connect this to your mood embedding endpoint.");
});

// ── INIT ──────────────────────────────────

renderCards();