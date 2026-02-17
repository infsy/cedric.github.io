document.addEventListener("DOMContentLoaded", function() {
  'use strict';

  var html = document.querySelector('html'),
    globalWrap = document.querySelector('.global-wrap'),
    headerOverlay = document.querySelector('.header__overlay'),
    menuToggle = document.querySelector(".hamburger"),
    menuList = document.querySelector(".main-nav"),
    searchOpenIcon = document.querySelector(".icon__search"),
    searchCloseIcon = document.querySelector(".search__close"),
    searchInput = document.querySelector(".search__text"),
    search = document.querySelector(".search"),
    searchBox = document.querySelector(".search__box");


  /* =======================================================
  // Menu + Search
  ======================================================= */
  menuToggle.addEventListener("click", () => {
    menu();
  });

  searchOpenIcon.addEventListener("click", () => {
    searchOpen();
  });

  searchCloseIcon.addEventListener("click", () => {
    searchClose();
  });

  headerOverlay.addEventListener("click", () => {
    searchClose();
  });

  // Menu
  function menu() {
    menuToggle.classList.toggle("is-open");
    menuList.classList.toggle("is-visible");
  }

  // Search
  function searchOpen() {
    search.classList.add("is-visible");
    html.classList.add("search-is-visible");
    globalWrap.classList.add("is-active");
    headerOverlay.classList.add("is-visible");
    menuToggle.classList.remove("is-open");
    menuList.classList.remove("is-visible");
    setTimeout(function () {
      searchInput.focus();
    }, 250);
  }

  function searchClose() {
    search.classList.remove("is-visible");
    html.classList.remove("search-is-visible");
    globalWrap.classList.remove("is-active");
    headerOverlay.classList.remove("is-visible");
  }

  function headerOverlay() {
    search.classList.remove("is-visible");
    html.classList.remove("search-is-visible");
    globalWrap.classList.remove("is-active");
    headerOverlay.classList.remove("is-visible");
  }

  searchBox.addEventListener("keydown", function(event) {
    if (event.target == this || event.keyCode == 27) {
      search.classList.remove('is-visible');
      html.classList.remove("search-is-visible");
      globalWrap.classList.remove("is-active");
      headerOverlay.classList.remove("is-visible");
    }
  });


  // =====================
  // Simple Jekyll Search
  // =====================
  SimpleJekyllSearch({
    searchInput: document.getElementById("js-search-input"),
    resultsContainer: document.getElementById("js-results-container"),
    json: "/search.json",
    searchResultTemplate: '<a class="search-results__item col col-6 col-m-12" href="{url}"><div class="search-results__image"><img src="{image}" alt="{title}"></div> <div class="search-results__title">{title}</div></a>',
    noResultsText: '<h3 class="col no-results">No results found</h3>'
  });


  /* ============================
  // Featured Slider
  ============================ */
  if (document.querySelector(".posts-slider")) {
    var slider = tns({
      container: ".posts-slider",
      items: 3,
      loop: false,
      swipeAngle: false,
      slideBy: 1,
      nav: false,
      mouseDrag: true,
      autoplay: false,
      controlsContainer: "#customize-controls",
      responsive: {
        1025: {
          items: 3,
        },
        769: {
          items: 2,
        },
        0: {
          items: 1,
        }
      }
    });
  }


  /* ======================================
  // Stop Animations During Window Resizing
  ====================================== */
  let resizeTimer;
  window.addEventListener("resize", () => {
    document.body.classList.add("resize-animation-stopper");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove("resize-animation-stopper");
    }, 100);
  });


  /* =======================
  // Responsive Videos
  ======================= */
  reframe(".post__content iframe:not(.reframe-off), .page__content iframe:not(.reframe-off)");


  /* =======================
  // LazyLoad Images
  ======================= */
  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
  })


  // =====================
  // Load More Posts
  // =====================
  var load_posts_button = document.querySelector('.load-more-posts');

  function removeUnsafeAttributes(element) {
    const attrs = Array.from(element.attributes);

    attrs.forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim().toLowerCase();

      if (name.startsWith("on") || name === "srcdoc") {
        element.removeAttribute(attr.name);
        return;
      }

      if (name === "href" || name === "src" || name === "data-src" || name === "xlink:href") {
        if (value.startsWith("javascript:") || value.startsWith("data:text/html")) {
          element.removeAttribute(attr.name);
        }
      }
    });
  }

  function sanitizeNodeTree(rootNode) {
    const blockedTags = ["script", "iframe", "object", "embed", "link", "style", "meta", "base", "form"];

    removeUnsafeAttributes(rootNode);

    blockedTags.forEach((tag) => {
      const elements = rootNode.querySelectorAll(tag);
      for (let i = 0; i < elements.length; i++) {
        elements[i].remove();
      }
    });

    const elements = rootNode.querySelectorAll("*");
    for (let i = 0; i < elements.length; i++) {
      removeUnsafeAttributes(elements[i]);
    }
  }

  if (load_posts_button) {
    load_posts_button.addEventListener("click", function(e) {
      e.preventDefault();

      var pagination = document.querySelector(".pagination");
      var nextPageUrl = pagination_next_url.split("/page")[0] + "/page/" + pagination_next_page_number + "/";

      fetch(nextPageUrl)
        .then(function(response) {
          if (response.ok) return response.text();
          throw new Error("Unable to load next page");
        })
        .then(function(htmlString) {
          var parser = new DOMParser();
          var parsedDocument = parser.parseFromString(htmlString, "text/html");
          var grid = document.querySelector(".grid");
          var posts = parsedDocument.querySelectorAll(".grid__post");

          if (!grid) {
            return;
          }

          for (var i = 0; i < posts.length; i++) {
            var safePost = posts[i].cloneNode(true);
            sanitizeNodeTree(safePost);
            grid.appendChild(safePost);
          }

          new LazyLoad({elements_selector: ".lazy"});
          pagination_next_page_number++;

          if (pagination_next_page_number > pagination_available_pages_number) {
            pagination.style.display = "none";
          }
        })
        .catch(function() {
          if (pagination) {
            pagination.style.display = "none";
          }
        });
    });
  }


  /* =======================
  // Zoom Image
  ======================= */
  const lightense = document.querySelector(".page__content img, .post__content img, .gallery__image img"),
  imageLink = document.querySelectorAll(".page__content a img, .post__content a img, .gallery__image a img");

  if (imageLink) {
    for (var i = 0; i < imageLink.length; i++) imageLink[i].parentNode.classList.add("image-link");
    for (var i = 0; i < imageLink.length; i++) imageLink[i].classList.add("no-lightense");
  }

  if (lightense) {
    Lightense(".page__content img:not(.no-lightense), .post__content img:not(.no-lightense), .gallery__image img:not(.no-lightense)", {
    padding: 60,
    offset: 30
    });
  }

});
