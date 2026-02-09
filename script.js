async function loadContent() {
  try {
    const response = await fetch("/content/site.json", { cache: "no-store" });
    if (!response.ok) {
      return;
    }
    const data = await response.json();

    document.querySelectorAll("[data-bind]").forEach((el) => {
      const path = el.getAttribute("data-bind");
      const value = path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), data);
      if (value !== undefined) {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-href]").forEach((el) => {
      const path = el.getAttribute("data-href");
      const value = path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), data);
      if (value !== undefined) {
        const href = value.includes("@") && !value.includes(":") ? `mailto:${value}` : value;
        el.setAttribute("href", href);
      }
    });

    const nav = document.querySelector("[data-nav]");
    if (nav && data.nav) {
      const path = window.location.pathname;
      nav.innerHTML = data.nav
        .map((item) => {
          const normalized = item.href === "/index.html" ? "/" : item.href;
          const isActive = path === normalized || path === item.href;
          const activeClass = isActive ? "tab active" : "tab";
          return `<a class="${activeClass}" href="${item.href}">${item.label}</a>`;
        })
        .join("");
    }

    const features = document.querySelector("[data-features]");
    if (features && data.home && data.home.feature_blocks) {
      features.innerHTML = data.home.feature_blocks
        .map((block) => {
          return `<div class="card"><h3>${block.title}</h3><p>${block.copy}</p></div>`;
        })
        .join("");
    }

    const deckList = document.querySelector("[data-decks]");
    if (deckList && data.shop && data.shop.decks) {
      deckList.innerHTML = data.shop.decks
        .map((deck) => {
          const link = deck.link || data.shop.shopify_url || "#";
          return `<div class="product-card"><img src="${deck.image}" alt="${deck.name}" /><div><strong>${deck.name}</strong></div><div class="product-meta"><span class="badge">${deck.size}</span><span class="badge">${deck.badge}</span></div><div class="product-meta"><span>${deck.price}</span><a class="button" href="${link}">View</a></div></div>`;
        })
        .join("");
    }

    const shirtList = document.querySelector("[data-shirts]");
    if (shirtList && data.shop && data.shop.shirts) {
      shirtList.innerHTML = data.shop.shirts
        .map((shirt) => {
          const link = shirt.link || data.shop.shopify_url || "#";
          return `<div class="product-card"><img src="${shirt.image}" alt="${shirt.name}" /><div><strong>${shirt.name}</strong></div><div class="product-meta"><span class="badge">${shirt.size}</span><span class="badge">${shirt.badge}</span></div><div class="product-meta"><span>${shirt.price}</span><a class="button" href="${link}">View</a></div></div>`;
        })
        .join("");
    }
  } catch (err) {
    console.error("Content load failed", err);
  }
}

loadContent();
