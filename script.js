// Gallery data
const artworks = [
  { title: "Abstract Sunrise", artist: "Liam Carter", image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?crop=entropy&cs=tinysrgb&fit=max&w=400&q=80", description: "A bold, colorful sunrise in abstract style." },
  { title: "Blue Horizons", artist: "Amelia Brooks", image: "https://images.unsplash.com/photo-1473187983305-f615310e7daa?crop=entropy&cs=tinysrgb&fit=max&w=400&q=80", description: "Layers of blue fading into the horizon." },
  { title: "City Night Lights", artist: "Daniel King", image: "https://images.unsplash.com/photo-1506973035872-a4c2f5e5ee9d?crop=entropy&cs=tinysrgb&fit=max&w=400&q=80", description: "Neon city streets captured in paint." },
  { title: "Forest Serenity", artist: "Maya James", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&w=400&q=80", description: "A peaceful forest with morning mist." },
  { title: "Ocean Dreams", artist: "Ethan Wright", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&w=400&q=80", description: "The calm and beauty of ocean waves." },
  { title: "Golden Fields", artist: "Sophia Evans", image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?crop=entropy&cs=tinysrgb&fit=max&w=400&q=80", description: "Rolling golden wheat fields under blue sky." }
];

// Load gallery
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

// Lightbox
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

// Countdown Timer
function initCountdown(targetDateStr) {
  const countdownEl = document.getElementById("countdown");
  const targetDate = new Date(targetDateStr);
  setInterval(() => {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) {
      countdownEl.textContent = "Gallery is live!";
      return;
    }
    const days = Math.floor(diff/1000/60/60/24);
    const hours = Math.floor((diff/1000/60/60)%24);
    const minutes = Math.floor((diff/1000/60)%60);
    const seconds = Math.floor((diff/1000)%60);
    countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  loadGallery();

  // Lightbox click
  const grid = document.getElementById("gallery-grid");
  grid?.addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (card) openLightbox(card.dataset.index);
  });
  document.getElementById("lb-close")?.addEventListener("click", closeLightbox);
  document.getElementById("lightbox")?.addEventListener("click", e => {
    if (e.target.id === "lightbox") closeLightbox();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
  });

  // Mobile menu
  document.getElementById("menu-btn")?.addEventListener("click", () => {
    document.querySelector(".nav").classList.toggle("show");
  });

  // Countdown next gallery (example: 1 day from now)
  const nextGalleryDate = new Date();
  nextGalleryDate.setDate(nextGalleryDate.getDate() + 1);
  initCountdown(nextGalleryDate);

  // Back to top
  const backBtn = document.getElementById("back-to-top");
  window.addEventListener("scroll", () => {
    backBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });
  backBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Contact form (Formspree)
  const contactForm = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  contactForm?.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    if (!data.name || !data.email || !data.message) {
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
        status.textContent = "Oops! Problem sending message.";
        status.style.color = "red";
      }
    } catch {
      status.textContent = "Network error. Try again later.";
      status.style.color = "red";
    }
  });

  // Floating local chat
  const chatFab = document.getElementById("chat-fab");
  const chatPanel = document.getElementById("chat-panel");
  const chatClose = document.getElementById("chat-close");
  const chatClear = document.getElementById("chat-clear");
  const chatMessages = document.getElementById("chat-messages");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatRole = document.getElementById("chat-role");

  let chatHistory = JSON.parse(localStorage.getItem("ae_chat_history_v1") || "[]");
  function saveChat() { localStorage.setItem("ae_chat_history_v1", JSON.stringify(chatHistory)); }
  function renderChat() {
    chatMessages.innerHTML = chatHistory.map(m => `
      <div class="msg ${m.sender==="admin"?"msg-admin":"msg-visitor"}">
        <div class="bubble">${m.text}</div>
        <div class="meta">${new Date(m.ts).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</div>
      </div>
    `).join("");
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  renderChat();

  chatFab?.addEventListener("click", () => {
    chatPanel.classList.add("open"); chatPanel.setAttribute("aria-hidden","false"); chatFab.setAttribute("aria-hidden","true");
    setTimeout(()=>chatInput.focus(),50);
  });
  chatClose?.addEventListener("click", () => {
    chatPanel.classList.remove("open"); chatPanel.setAttribute("aria-hidden","true"); chatFab.setAttribute("aria-hidden","false");
  });
  chatClear?.addEventListener("click", () => { if(confirm("Clear chat?")) { chatHistory=[]; saveChat(); renderChat(); } });
  chatForm?.addEventListener("submit", e => {
    e.preventDefault(); const text = chatInput.value.trim(); if(!text) return;
    const sender = chatRole?.value==="admin"?"admin":"visitor";
    chatHistory.push({ sender,text,ts:Date.now() }); saveChat(); renderChat(); chatInput.value="";
  });
});
