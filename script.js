"use strict";

const myCartBtnEl = document.querySelector(".my-cart-btn");
const cartPopupEl = document.querySelector(".cart-popup");
const closeCartEl = document.querySelector(".close-cart-icon");
const addToCartBtnsEl = document.querySelectorAll(".add-to-cart-btn");
const totalPriceTextEl = document.querySelector(".total-price-text");
const cartItemListEl = document.querySelector(".cart-item-list");
const cartItemListEmptyEl = document.querySelector(".cart-item-list-empty");
const payoutBtnEl = document.querySelector(".payout-btn");
const payoutCompletedContainer = document.querySelector(
  ".payout-completed-container"
);
const payoutCompletedBtnEl = document.querySelector(".payout-completed-btn");
const productImgEl = document.querySelector(".product-img");
const searchInput = document.querySelector(".search-input");
const productList = document.querySelector(".product-list");
const searchBtn = document.querySelector(".search-btn");
const logoContainer = document.querySelector(".logo-container");
const productTitleEl = document.querySelectorAll(".product-title");
const productNotFoundEl = document.querySelector(".product-not-found");
const favoritesBtnEl = document.querySelectorAll(".product-fav-btn");
const myFavoritesBtnEl = document.querySelector(".my-favorites-btn");
const myFavoritesNotFoundEl = document.querySelector(".my-favorites-not-found");
let isMyFavoritesPage = false;
let isFavoritesProduct = false;
let cartItems = [];
let totalPrice = 0;
const productNames = [
  "Meat",
  "Cheese",
  "Egg",
  "Tomato",
  "Parsley",
  "Bread",
  "Butter",
  "Milk",
  "Olive",
];

// Page Reload
logoContainer.addEventListener("click", function () {
  window.scrollTo(0, 0);
  location.reload();
});

// Suggestion Click //
productList.addEventListener("click", function (e) {
  myFavoritesNotFoundEl.classList.add("hidden");
  const clickedOption = e.target;
  const selectedProductName = clickedOption.textContent;

  productList.innerHTML = "";

  // Show product
  productTitleEl.forEach((item) => {
    item.closest(".product-content").classList.remove("hidden");
  });

  // Show selected Products
  productTitleEl.forEach((item) => {
    if (selectedProductName !== item.textContent) {
      item.closest(".product-content").classList.add("hidden");
    }
  });

  visibleProductsFnc();

  obs.disconnect();
  document.body.classList.remove("sticky");

  searchInput.value = "";
});

// Search Button Click //
searchBtn.addEventListener("click", function () {
  myFavoritesNotFoundEl.classList.add("hidden");
  isMyFavoritesPage = false;
  productList.innerHTML = "";
  const clickedSearchTerm = searchInput.value.toLowerCase();

  // Show product
  productTitleEl.forEach((item) => {
    item.closest(".product-content").classList.remove("hidden");
  });

  obs.disconnect();
  document.body.classList.remove("sticky");

  if (clickedSearchTerm !== "") {
    productTitleEl.forEach((item) => {
      const productName = item.textContent.toLowerCase();
      if (!productName.includes(clickedSearchTerm)) {
        item.closest(".product-content").classList.add("hidden");
      }
    });
  } else {
    window.scrollTo(0, 0);
    location.reload();
  }

  // Visible products
  visibleProductsFnc();
});

// Visible Products //
const visibleProductsFnc = function () {
  const visibleProducts = document.querySelectorAll(
    ".product-content:not(.hidden)"
  );

  if (visibleProducts.length === 0) {
    productNotFoundEl.classList.remove("hidden");
  } else {
    productNotFoundEl.classList.add("hidden");
  }
};
// Search Input Autocomplete //
searchInput.addEventListener("input", function () {
  isMyFavoritesPage = false;
  const searchTerm = searchInput.value.toLowerCase();
  productList.innerHTML = "";

  if (searchTerm !== "") {
    productNames.forEach((productName) => {
      if (productName.toLowerCase().startsWith(searchTerm)) {
        const option = document.createElement("li");
        option.className = "autocomplete-option";
        option.textContent = productName;
        productList.appendChild(option);
      }
    });
  }
});

// Delete Item From Cart //
const deleteItemCart = function () {
  document.querySelectorAll(".delete-icon").forEach((item) =>
    item.addEventListener("click", (e) => {
      const clickedIcon = e.target;
      const listItem = clickedIcon.closest(".cart-item");

      if (listItem) {
        const itemIndex = Array.from(listItem.parentNode.children).indexOf(
          listItem
        );
        listItem.remove();
        cartItems.splice(itemIndex, 1);
        updateTotalPrice();
        if (cartItems.length === 0)
          cartItemListEmptyEl.classList.remove("hidden");
      }
      // Payout Btn Control
      if (cartItems.length === 0)
        payoutBtnEl.removeEventListener("click", payout);
    })
  );
};

// Calculate Total Price //
const updateTotalPrice = function () {
  totalPrice = 0;
  cartItems.forEach((item) => {
    totalPrice += item.price * (item.quantity || 1);
  });
  totalPriceTextEl.textContent = `Total Price: $${totalPrice}`;
};

//  Update Cart //
const updateCart = function (productTitle, productPrice) {
  const existingItem = cartItems.find(
    (item) => item.title === productTitle && item.price === productPrice
  );

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cartItems.push({ title: productTitle, price: productPrice, quantity: 1 });
  }
  updateCartPopup();
};

// Add To Cart Buttons //
addToCartBtnsEl.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const productTitle =
      document.querySelectorAll(".product-title")[index].textContent;
    const productPriceStr = document.querySelectorAll(
      ".product-text li:nth-child(2) span"
    )[index].textContent;
    const productPrice = parseFloat(productPriceStr.replace("$", ""));

    updateCart(productTitle, productPrice);
    updateTotalPrice();
    console.log(cartItems.length);
    if (cartItems.length !== 0) {
      if (!cartItemListEl.classList.contains("hidden")) {
        cartItemListEmptyEl.classList.add("hidden");
      }
    }
    // Payout Btn Control
    if (cartItems.length > 0) payoutBtnEl.addEventListener("click", payout);
  });
});

// Update Popup //
const updateCartPopup = function () {
  cartItemListEl.innerHTML = "";
  cartItems.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.classList.add("cart-item");

    const deleteItem = document.createElement("ion-icon");
    deleteItem.setAttribute("name", "close-circle-outline");
    deleteItem.classList.add("delete-icon");
    listItem.appendChild(deleteItem);

    const itemText = document.createElement("span");
    itemText.textContent = `${item.quantity} x ${item.title} - $${item.price}`;
    listItem.appendChild(itemText);

    cartItemListEl.appendChild(listItem);
  });
  deleteItemCart();
};

// Open Cart Popup //
myCartBtnEl.addEventListener("click", () => {
  cartPopupEl.classList.toggle("hidden");
});

// Close Cart Popup //
closeCartEl.addEventListener("click", () => {
  cartPopupEl.classList.toggle("hidden");
});

// Payout //
const payout = function () {
  payoutCompletedContainer.classList.remove("hidden");
};

// Payout Complete //
const payoutComplete = function () {
  window.scrollTo(0, 0);

  location.reload();
};

payoutCompletedBtnEl.addEventListener("click", payoutComplete);

// Favorites //
favoritesBtnEl.forEach((btn) => {
  btn.addEventListener("click", function () {
    const icon = btn.querySelector(".my-favorites-icon");
    const productName = btn
      .closest(".product-content")
      .querySelector(".product-title").textContent;

    // Create array fav products
    let favorites = JSON.parse(localStorage.getItem("favorites"));
    if (!Array.isArray(favorites)) {
      favorites = [];
    }

    const currentIconName = icon.getAttribute("name");
    const newIconName =
      currentIconName === "heart-outline" ? "heart" : "heart-outline";
    currentIconName === "heart-outline"
      ? (isFavoritesProduct = true)
      : (isFavoritesProduct = false);

    if (isFavoritesProduct) {
      favorites.push({ name: productName, favoritesIcon: true });
    } else {
      const indexToRemove = favorites.findIndex(
        (item) => item.name === productName
      );

      // If found, remove from the array
      if (indexToRemove !== -1) {
        favorites.splice(indexToRemove, 1);
      }
    }

    icon.setAttribute("name", newIconName);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // On My Favorites Page
    if (isMyFavoritesPage) {
      btn.closest(".product-content").classList.add("hidden");
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (favorites.length === 0) {
        myFavoritesNotFoundEl.classList.remove("hidden");
      } else {
        myFavoritesNotFoundEl.classList.add("hidden");
      }
    }
  });
});

// Check favorite icons when page loads //
window.addEventListener("load", function () {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.forEach((product) => {
    const productTitles = document.querySelectorAll(".product-title");
    productTitles.forEach((productTitle) => {
      if (productTitle.textContent.includes(product.name)) {
        const icon = productTitle
          .closest(".product-content")
          .querySelector(".my-favorites-icon");
        const newIcon = product.favoritesIcon ? "heart" : "heart-outline";
        icon.setAttribute("name", newIcon);
      }
    });
  });
});

// My Favorites Btn and Show Favorites Products
myFavoritesBtnEl.addEventListener("click", function () {
  isMyFavoritesPage = true;
  const productContents = document.querySelectorAll(".product-content");

  productContents.forEach((productContent) => {
    productContent.classList.add("hidden");
  });

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    myFavoritesNotFoundEl.classList.remove("hidden");
  } else {
    myFavoritesNotFoundEl.classList.add("hidden");
  }

  favorites.forEach((product) => {
    const productTitles = document.querySelectorAll(".product-title");
    productTitles.forEach((productTitle) => {
      if (
        productTitle.textContent === product.name &&
        product.favoritesIcon === true
      ) {
        productTitle.closest(".product-content").classList.remove("hidden");
      }
    });
  });
  obs.disconnect();
  document.body.classList.remove("sticky");
});

// Sticky Navigation //
const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];

    if (ent.isIntersecting === false && window.innerWidth > 720) {
      document.body.classList.add("sticky");
    }
    if (ent.isIntersecting === true || window.innerWidth < 720) {
      document.body.classList.remove("sticky");
    }
  },
  {
    // In the viewport
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  }
);
obs.observe(productImgEl);

// Current year for footer //
const currentYearEl = document.querySelector(".current-year");

const date = new Date();
const currentYear = date.getFullYear();
currentYearEl.textContent = currentYear;
