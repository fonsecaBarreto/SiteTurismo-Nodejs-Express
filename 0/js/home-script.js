"use strict";
var waves = document.querySelectorAll(".wave"),
    navBtns = document.querySelectorAll("[data-slide]");
window.onload = function() {
    body.classList.remove("loading"), waves.forEach(function(n) {
        n.style.animationDelay = "0s", n.style.animation = "none", n.offsetHeight, n.style.animation = null
    }), navbarNav.querySelectorAll(".nav-item")[0].classList.add("active")
}, navBtns.forEach(function(n) {
    n.onclick = function() {
        waves.forEach(function(n) {
            n.style.animationDelay = "0s", n.style.animation = "none", n.offsetHeight, n.style.animation = null
        })
    }
});