// Gallery data
const artworks = [
  { title: "Abstract Sunrise", artist: "Liam Carter", image: "https://picsum.photos/seed/art1/400/300", description: "A bold, colorful sunrise in abstract style." },
  { title: "Blue Horizons", artist: "Amelia Brooks", image: "https://picsum.photos/seed/art2/400/300", description: "Layers of blue fading into the horizon." },
  { title: "City Night Lights", artist: "Daniel King", image: "https://picsum.photos/seed/art3/400/300", description: "Neon city streets captured in paint." },
  { title: "Forest Serenity", artist: "Maya James", image: "https://picsum.photos/seed/art4/400/300", description: "A peaceful forest with morning mist." },
  { title: "Ocean Dreams", artist: "Ethan Wright", image: "https://picsum.photos/seed/art5/400/300", description: "The calm and beauty of ocean waves." },
  { title: "Golden Fields", artist: "Sophia Evans", image: "https://picsum.photos/seed/art6/400/300", description: "Rolling golden wheat fields under blue sky." },
  { title: "Urban Shadows", artist: "Noah Brown", image: "https://picsum.photos/seed/art7/400/300", description: "Street art mixed with city shadows." },
  { title: "Wildflower Path", artist: "Ava Taylor", image: "https://picsum.photos/seed/art8/400/300", description: "A trail lined with vibrant wildflowers." },
  { title: "Snowy Silence", artist: "Oliver Green", image: "https://picsum.photos/seed/art9/400/300", description: "A quiet snowy landscape at dusk." },
  { title: "Golden Hour Glow", artist: "Emily Hill", image: "https://picsum.photos/seed/art10/400/300", description: "Sunset light casting warm hues." },
  { title: "Mountain Majesty", artist: "Henry Scott", image: "https://picsum.photos/seed/art11/400/300", description: "Majestic mountains under bright skies." },
  { title: "Desert Mirage", artist: "Isla Ward", image: "https://picsum.photos/seed/art12/400/300", description: "A hot desert scene with surreal mirage." },
  { title: "River Reflections", artist: "Mason Young", image: "https://picsum.photos/seed/art13/400/300", description: "A still river mirroring the sky." },
  { title: "Tropical Escape", artist: "Lily Adams", image: "https://picsum.photos/seed/art14/400/300", description: "Palm trees and turquoise waters." },
  { title: "Starry Dreams", artist: "Jack Wilson", image: "https://picsum.photos/seed/art15/400/300", description: "Stars painted over midnight blues." },
  { title: "Vintage Streets", artist: "Chloe Lewis", image: "https://picsum.photos/seed/art16/400/300", description: "Old town streets in warm tones." }
];

// Load artworks in gallery (cards + click to open lightbox)
function loadGallery() {
  const gallery = document.getElementById("gallery-grid");
  if (!gallery) return;
  gallery.innerHTML = artworks.map((art, index) => `
    <div class="card" data-index="${index}">
      <img src="${art.image}" alt="${art.title}">
      <div class="info">
        <h4>${art.title}</h4>
        <p>${art.artist}</p>
      </div>
    </div>
  `).join("");
}

// Lightbox controls
function openLightbox(index) {
  const lb = document.getElementById("lightbox");
  document.getElementById("lb-img").src = artworks[index].image;
  document.getElementById("lb-title").textContent = artworks[index].title;
  document.getElementById("lb-artist").textContent = artworks[index].artist;
  document.getElementById("lb-description").textContent = artworks[index].description;
  lb.setAttribute("aria-hidden", "false");
}
function closeLightbox() {
  document.getElementById("lightbox").setAttribute("aria-hidden", "true");
}

// Scroll animations
function handleScrollAnimations() {
  document.querySelectorAll(".fade-in").forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add("visible");
    }
  });
}

// Back-to-top button
function handleBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (window.scrollY > 300) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Load gallery
  loadGallery();

  // Event delegation for lightbox from gallery cards
  const grid = document.getElementById("gallery-grid");
  grid?.addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (card) openLightbox(card.dataset.index);
  });

  // Lightbox close handlers
  document.getElementById("lb-close")?.addEventListener("click", closeLightbox);
  document.getElementById("lightbox")?.addEventListener("click", e => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
  });

  // Mobile menu toggle
  document.getElementById("menu-btn")?.addEventListener("click", () => {
    document.querySelector(".nav").classList.toggle("show");
  });

  // Back-to-top
  document.getElementById("back-to-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Contact form handling
  const contactForm = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
        status.textContent = "Please fill out all fields.";
        status.style.color = "red";
        return;
      }
      try {
        const res = await fetch(contactForm.action, {
          method: contactForm.method,
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          status.textContent = "Thank you! Your message has been sent.";
          status.style.color = "green";
          contactForm.reset();
        } else {
          status.textContent = "Oops! There was a problem sending your message.";
          status.style.color = "red";
        }
      } catch (err) {
        status.textContent = "Network error. Please try again later.";
        status.style.color = "red";
      }
    });
  }

  // Scroll effects
  handleScrollAnimations();
  window.addEventListener("scroll", () => {
    handleScrollAnimations();
    handleBackToTop();
  });

  /* =========================
     Floating Chat (localStorage)
     ========================= */
  const chatFab = document.getElementById("chat-fab");
  const chatPanel = document.getElementById("chat-panel");
  const chatClose = document.getElementById("chat-close");
  const chatClear = document.getElementById("chat-clear");
  const chatMessages = document.getElementById("chat-messages");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatRole = document.getElementById("chat-role");

  const STORAGE_KEY = "ae_chat_history_v1";
  let chatHistory = [];

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function fmt(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  function renderChat() {
    if (!chatMessages) return;
    chatMessages.innerHTML = chatHistory.map(m => `
      <div class="msg ${m.sender === 'admin' ? 'msg-admin' : 'msg-visitor'}">
        <div class="bubble">${escapeHtml(m.text)}</div>
        <div class="meta">${fmt(m.ts)}</div>
      </div>
    `).join("");
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function saveChat() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
  }
  function addMsg(sender, text) {
    chatHistory.push({ sender, text, ts: Date.now() });
    saveChat();
    renderChat();
  }
  function loadChat() {
    try {
      chatHistory = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      chatHistory = [];
    }
    renderChat();
  }

  // Open/close
  chatFab?.addEventListener("click", () => {
    chatPanel.classList.add("open");
    chatPanel.setAttribute("aria-hidden", "false");
    chatFab.setAttribute("aria-hidden", "true");
    setTimeout(() => chatInput?.focus(), 50);
  });
  chatClose?.addEventListener("click", () => {
    chatPanel.classList.remove("open");
    chatPanel.setAttribute("aria-hidden", "true");
    chatFab.setAttribute("aria-hidden", "false");
  });

  // Clear conversation
  chatClear?.addEventListener("click", () => {
    if (confirm("Clear this conversation?")) {
      chatHistory = [];
      saveChat();
      renderChat();
    }
  });

  // Send message
  chatForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    const sender = chatRole?.value === "admin" ? "admin" : "visitor";
    addMsg(sender, text);
    chatInput.value = "";
    chatInput.focus();
  });

  loadChat();
});
