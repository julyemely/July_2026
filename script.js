(function () {
  "use strict";

  var INSTAGRAM_URL = "https://www.instagram.com/july_minerva?stkn=MTB0c2o2eXl1bG10bw%3D%3D&utm_source=qr";
  var MARQUEE_DURATION = 18; // seconds — readable scroll speed

  var stage = document.getElementById("stage");
  var cursorDot = document.getElementById("cursor-dot");
  var backArrow = document.getElementById("back-arrow");
  var introName = document.getElementById("intro-name");
  var introQuote = document.getElementById("intro-quote");
  var phoneWrap = document.getElementById("phone-wrap");
  var phoneIcon = document.getElementById("phone-icon");
  var marqueeText = document.getElementById("marquee-text");

  var state = "intro"; // intro -> phone -> marquee -> icon

  /* ---------------- stage scaling (1440x900 design, scaled to fit) ---------------- */
  function fitStage() {
    var scale = Math.min(window.innerWidth / 1440, window.innerHeight / 900);
    var offsetX = (window.innerWidth - 1440 * scale) / 2;
    var offsetY = (window.innerHeight - 900 * scale) / 2;
    stage.style.transform = "translate(" + offsetX + "px, " + offsetY + "px) scale(" + scale + ")";
  }
  fitStage();
  window.addEventListener("resize", fitStage);

  /* ---------------- custom red-dot cursor ---------------- */
  document.addEventListener("mousemove", function (e) {
    cursorDot.classList.add("visible");
    cursorDot.style.transform = "translate(" + e.clientX + "px, " + e.clientY + "px) translate(-50%, -50%)";
  });
  document.addEventListener("mouseleave", function () {
    cursorDot.classList.remove("visible");
  });

  /* ---------------- state transitions ---------------- */
  function goToPhone() {
    introName.classList.add("exit");
    introQuote.classList.add("exit");
    phoneWrap.classList.add("in-view");
    state = "phone";
  }

  function playMarquee() {
    state = "marquee";
    var textWidth = marqueeText.scrollWidth;

    marqueeText.style.transition = "none";
    marqueeText.style.transform = "translateX(1440px)";
    // force reflow so the reset above is applied before animating
    void marqueeText.offsetWidth;

    marqueeText.style.transition = "transform " + MARQUEE_DURATION + "s linear";
    requestAnimationFrame(function () {
      marqueeText.style.transform = "translateX(-" + (textWidth + 50) + "px)";
    });

    marqueeText.addEventListener("transitionend", onMarqueeEnd, { once: true });
  }

  function onMarqueeEnd() {
    phoneIcon.classList.add("show");
    state = "icon";
  }

  function goBack() {
    if (state === "icon") {
      phoneIcon.classList.remove("show");
      state = "phone";
    } else if (state === "phone") {
      phoneWrap.classList.remove("in-view");
      introName.classList.remove("exit");
      introQuote.classList.remove("exit");
      state = "intro";
    }
    // no-op during "intro" (nothing before it) or "marquee" (mid-animation)
  }

  /* ---------------- click handling ---------------- */
  document.addEventListener("click", function () {
    if (state === "intro") {
      goToPhone();
    } else if (state === "phone") {
      playMarquee();
    }
    // "marquee": ignore extra clicks until the animation finishes
    // "icon": background clicks do nothing — only the icon itself reacts
  });

  backArrow.addEventListener("click", function (e) {
    e.stopPropagation();
    goBack();
  });

  phoneIcon.addEventListener("click", function (e) {
    e.stopPropagation();
    window.open(INSTAGRAM_URL, "_blank", "noopener");
  });
})();
