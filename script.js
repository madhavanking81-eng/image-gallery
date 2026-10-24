/* =========================================
   FLIPFOLIO — PHOTO GALLERY
   ========================================= */

// Sample photos used by the gallery.
// Internet connection is required to load these photos.

const photos = [
    {
        title: "Thalapathy Vijay",
        category: "Heroes",
        description: "A popular star of Tamil cinema.",
        image: "images/vijay.jpg"
    },
    {
        title: "Thala Ajith",
        category: "Heroes",
        description: "A celebrated actor in Tamil cinema.",
        image: "images/ajith.jpg"
    },
    {
        title: "Suriya",
        category: "Heroes",
        description: "Known for powerful performances.",
        image: "images/suriya.jpg"
    },
    {
        title: "Dhanush",
        category: "Heroes",
        description: "An actor known for versatile roles.",
        image: "images/dhanush.jpg"
        
    },
    {
        title: "Sai Pallavi",
        category: "Heroines",
        description: "A talented actress in Tamil cinema.",
        image: "images/saipallavi.jpg"
    },
    {
        title: "Mamitha Baiju",
        category: "Heroines",
        description: "A rising favourite among movie fans.",
        image: "images/mamitha.jpg"
    },
    {
        title: "Samantha",
        category: "Heroines",
        description: "A popular actress in South Indian cinema.",
        image: "images/samantha.jpg"
    },
    {
        title: "Mrunal Thakur",
        category: "Heroines",
        description: "An actress known for her screen presence.",
        image: "images/mrunalthakur.jpg"
    }
];


/* =========================================
   GET HTML ELEMENTS
   ========================================= */

const homeSection = document.getElementById("homeSection");
const gallerySection = document.getElementById("gallerySection");

const photoBook = document.getElementById("photoBook");
const bookCover = document.getElementById("bookCover");

const openBookBtn = document.getElementById("openBookBtn");
const closeGalleryBtn = document.getElementById("closeGalleryBtn");

const leftPage = document.getElementById("leftPage");
const rightPage = document.getElementById("rightPage");

const leftImage = document.getElementById("leftImage");
const rightImage = document.getElementById("rightImage");

const leftCategory = document.getElementById("leftCategory");
const rightCategory = document.getElementById("rightCategory");

const leftTitle = document.getElementById("leftTitle");
const rightTitle = document.getElementById("rightTitle");

const leftDescription = document.getElementById("leftDescription");
const rightDescription = document.getElementById("rightDescription");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageCounter = document.getElementById("pageCounter");

const categoryButtons = document.querySelectorAll(".category-button");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDescription = document.getElementById("lightboxDescription");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");


/* =========================================
   GALLERY STATE
   ========================================= */

let filteredPhotos = [...photos];

let currentIndex = 0;
let isGalleryOpen = false;
let isAnimating = false;
let lightboxIndex = 0;

let openingTimer = null;
let closingTimer = null;
let pageTimer = null;


/* =========================================
   OPEN THE BOOK
   ========================================= */

openBookBtn.addEventListener("click", () => {

    if (isGalleryOpen || isAnimating) {
        return;
    }

    isAnimating = true;

    clearTimeout(openingTimer);
    clearTimeout(closingTimer);

    openBookBtn.querySelector("span").textContent = "OPENING...";
    openBookBtn.disabled = true;

    // Rotate the front cover.
    bookCover.classList.add("is-open");

    // Wait for the cover-opening animation to finish.
    openingTimer = setTimeout(() => {

        homeSection.hidden = true;
        gallerySection.hidden = false;

        isGalleryOpen = true;
        isAnimating = false;

        openBookBtn.querySelector("span").textContent = "OPEN YOUR BOOK";
        openBookBtn.disabled = false;

        renderPages();

        gallerySection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 1450);

});


/* =========================================
   CLOSE THE BOOK
   ========================================= */

function closeGallery() {

    if (!isGalleryOpen || isAnimating) {
        return;
    }

    isAnimating = true;

    clearTimeout(openingTimer);
    clearTimeout(closingTimer);
    clearTimeout(pageTimer);

    // Show the home page while the gallery is still visible.
    homeSection.hidden = false;

    // Scroll to the book so the closing animation can be seen.
    window.scrollTo({
        top: 0,
        behavior: "auto"
    });

    // Allow the browser to display the home page before rotating.
    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            // Rotate the cover back to its closed position.
            bookCover.classList.remove("is-open");

            // Hide the gallery only after the animation finishes.
            closingTimer = setTimeout(() => {

                gallerySection.hidden = true;

                isGalleryOpen = false;
                isAnimating = false;

                openBookBtn.querySelector("span").textContent = "OPEN YOUR BOOK";
                openBookBtn.disabled = false;

                homeSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 1450);

        });

    });

}

closeGalleryBtn.addEventListener("click", closeGallery);


/* =========================================
   DISPLAY A PHOTO ON A PAGE
   ========================================= */

function displayPhoto(photo, side, photoIndex) {

    const page = side === "left" ? leftPage : rightPage;

    const image = side === "left" ? leftImage : rightImage;

    const category = side === "left" ? leftCategory : rightCategory;

    const title = side === "left" ? leftTitle : rightTitle;

    const description = side === "left"
        ? leftDescription
        : rightDescription;

    if (!photo) {

        page.classList.add("empty-page");

        page.innerHTML = `
            <p class="empty-page-message">
                Every empty page<br>
                holds a story yet to come.
            </p>
        `;

        return;
    }

    // Restore the normal page structure if it was previously empty.
    page.classList.remove("empty-page");

    if (!page.querySelector(".photo-frame")) {

        page.innerHTML = `
            <div class="page-number"></div>

            <div class="photo-frame">
                <img src="" alt="">
            </div>

            <div class="photo-info">
                <p class="photo-category"></p>
                <h2></h2>
                <p class="photo-description"></p>
            </div>
        `;

    }

    const pageNumber = page.querySelector(".page-number");
    const pageImage = page.querySelector("img");
    const pageCategory = page.querySelector(".photo-category");
    const pageTitle = page.querySelector(".photo-info h2");
    const pageDescription = page.querySelector(".photo-description");

    pageNumber.textContent = String(photoIndex + 1).padStart(2, "0");

    pageImage.src = photo.image;
    pageImage.alt = photo.title;

    pageImage.onclick = () => {
        openLightbox(photoIndex);
    };

    pageCategory.textContent = photo.category;
    pageTitle.textContent = photo.title;
    pageDescription.textContent = photo.description;

}


/* =========================================
   RENDER THE TWO-PAGE SPREAD
   ========================================= */

function renderPages() {

    if (filteredPhotos.length === 0) {
        return;
    }

    // Keep the current index inside the filtered photo list.
    if (currentIndex >= filteredPhotos.length) {
        currentIndex = 0;
    }

    const leftPhoto = filteredPhotos[currentIndex];
    const rightPhoto = filteredPhotos[currentIndex + 1];

    displayPhoto(leftPhoto, "left", currentIndex);

    displayPhoto(
        rightPhoto,
        "right",
        rightPhoto ? currentIndex + 1 : currentIndex + 1
    );

    const firstPage = currentIndex + 1;
    const lastPage = Math.min(currentIndex + 2, filteredPhotos.length);

    pageCounter.textContent =
        `${String(firstPage).padStart(2, "0")} — ` +
        `${String(lastPage).padStart(2, "0")} / ` +
        `${String(filteredPhotos.length).padStart(2, "0")}`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex + 2 >= filteredPhotos.length;

}


/* =========================================
   NEXT PAGE
   ========================================= */

nextBtn.addEventListener("click", () => {

    if (isAnimating || currentIndex + 2 >= filteredPhotos.length) {
        return;
    }

    isAnimating = true;

    clearTimeout(pageTimer);

    photoBook.classList.remove("turn-prev");
    photoBook.classList.add("turn-next");

    pageTimer = setTimeout(() => {

        currentIndex += 2;

        photoBook.classList.remove("turn-next");

        renderPages();

        isAnimating = false;

    }, 350);

});


/* =========================================
   PREVIOUS PAGE
   ========================================= */

prevBtn.addEventListener("click", () => {

    if (isAnimating || currentIndex <= 0) {
        return;
    }

    isAnimating = true;

    clearTimeout(pageTimer);

    photoBook.classList.remove("turn-next");
    photoBook.classList.add("turn-prev");

    pageTimer = setTimeout(() => {

        currentIndex -= 2;

        photoBook.classList.remove("turn-prev");

        renderPages();

        isAnimating = false;

    }, 350);

});


/* =========================================
   CATEGORY FILTERS
   ========================================= */

categoryButtons.forEach((button) => {

    button.addEventListener("click", () => {

        if (isAnimating) {
            return;
        }

        const selectedCategory = button.dataset.category;

        // Highlight the selected category.
        categoryButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        // Filter the photos.
        if (selectedCategory === "All") {
            filteredPhotos = [...photos];
        } else {
            filteredPhotos = photos.filter((photo) => {
                return photo.category === selectedCategory;
            });
        }

        currentIndex = 0;

        photoBook.classList.remove("turn-next", "turn-prev");

        renderPages();

    });

});


/* =========================================
   LIGHTBOX
   ========================================= */

function openLightbox(index) {

    if (!filteredPhotos[index]) {
        return;
    }

    lightboxIndex = index;

    updateLightbox();

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";

}

function updateLightbox() {

    const photo = filteredPhotos[lightboxIndex];

    if (!photo) {
        return;
    }

    lightboxImage.src = photo.image;
    lightboxImage.alt = photo.title;

    lightboxTitle.textContent = photo.title;
    lightboxDescription.textContent =
        `${photo.category} — ${photo.description}`;

}

function closeLightbox() {

    lightbox.hidden = true;
    document.body.style.overflow = "";

}

function showPreviousLightboxPhoto() {

    if (filteredPhotos.length === 0) {
        return;
    }

    lightboxIndex =
        (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length;

    updateLightbox();

}

function showNextLightboxPhoto() {

    if (filteredPhotos.length === 0) {
        return;
    }

    lightboxIndex =
        (lightboxIndex + 1) % filteredPhotos.length;

    updateLightbox();

}

lightboxClose.addEventListener("click", closeLightbox);

lightboxPrev.addEventListener("click", showPreviousLightboxPhoto);

lightboxNext.addEventListener("click", showNextLightboxPhoto);

// Close the lightbox when its dark background is clicked.
lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {
        closeLightbox();
    }

});


/* =========================================
   KEYBOARD CONTROLS
   ========================================= */

document.addEventListener("keydown", (event) => {

    if (!lightbox.hidden) {

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowLeft") {
            showPreviousLightboxPhoto();
        }

        if (event.key === "ArrowRight") {
            showNextLightboxPhoto();
        }

        return;
    }

    if (!gallerySection.hidden) {

        if (event.key === "Escape") {
            closeGallery();
        }

        if (event.key === "ArrowLeft") {
            prevBtn.click();
        }

        if (event.key === "ArrowRight") {
            nextBtn.click();
        }

    }

});


/* =========================================
   INITIAL SETUP
   ========================================= */

// Show the first two photos when the page loads.
renderPages();