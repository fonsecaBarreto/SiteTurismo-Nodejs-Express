"use strict";
var waves = document.querySelectorAll(".wave");
window.onload = function() {
    body.classList.remove("loading"), waves.forEach(function(e) {
        e.style.animationDelay = "0s", e.style.animation = "none", e.offsetHeight, e.style.animation = null
    }), navbarNav.querySelectorAll(".nav-item")[2].classList.add("active"), newResize()
};
var blogConfig = {
        total: 0,
        limit: 5,
        pages: 0,
        pageIndex: 0
    },
    params = new URL(location.href).searchParams;
blogConfig.pageIndex = null != params.get("page") ? params.get("page") : 0, loadFeed();
var feed = document.querySelector(".blog-feed");

function loadFeed() {
    fetch("/partials/blog-thumb.html").then(function(e) {
        return e.text()
    }).then(function(a) {
        fetch("/nuntium-petitio?limit=".concat(blogConfig.limit, "&offset=").concat(blogConfig.limit * blogConfig.pageIndex, "&sort=date")).then(function(e) {
            return e.json()
        }).then(function(e) {
            blogConfig.pages = Math.ceil(e.length / blogConfig.limit), blogConfig.length = e.length, 0 < e.result.length && (InitPagination(), new Promise(function(n) {
                var i = e.result.length;
                e.result.forEach(function(e) {
                    var t = document.createElement("div");
                    t.classList = "mb-2 ", t.innerHTML = a, t.querySelector(".thumb-title").innerHTML = e.title, t.querySelector(".thumb-subtitle").innerHTML = e.subtitle, t.querySelector(".thumb-date").innerHTML = e.date, 
                    t.querySelector(".thumb-image").src = e.img[0].xs.location, 
                    t.querySelector(".thumb-image").srcset =`${ e.img[0].xs.location} ${ e.img[0].xs.width}w, 
                                                            ${e.img[0].sm.location} ${ e.img[0].sm.width}w, 
                                                            ${e.img[0].md.location} ${ e.img[0].md.width}w, 
                                                            ${e.img[0].lg.location} ${ e.img[0].lg.width}w, 
                                                            ${e.img[0].xl.location} ${ e.img[0].xl.width}w
                    `

                    t.querySelector(".thumb-image").sizes = "(min-width:768px) 40vw, (min-width:992px) 45vw,96vw",
                     t.querySelector(".thumb-call").setAttribute("href", "/blog/".concat(e.param)), feed.appendChild(t), 0 == --i && n()
                })
            }).then(function() {
                feed.querySelectorAll(".prov-blog-thumb").forEach(function(e) {
                    e.parentNode.removeChild(e)
                })
            }))
        })
    })
}
var pagination = document.querySelector(".pagination");

function InitPagination(e) {
    for (var t = blogConfig.pages, n = blogConfig.pageIndex, i = n < 3 ? Math.floor(n / 3) : Number(n - 2) != t - 3 ? Number(n - 2) : Number(n - 3), a = 0; a < 4; a++) a < t && (pagination.querySelector('[index="'.concat(a, '"]')).classList.remove("disabled"), pagination.querySelector('[index="'.concat(a, '"]')).children[0].innerHTML = Number(i + a), pagination.querySelector('[index="'.concat(a, '"]')).children[0].setAttribute("href", "?page=" + Number(i + a)));
    try {
        pagination.querySelector('[href="?page='.concat(n, '"]')).parentElement.classList.add("active")
    } catch (e) {}
    if (0 < n) {
        var o = pagination.querySelector('[command="prev"]');
        o.classList.remove("disabled"), o.onclick = function(e) {
            e.preventDefault();
            var t = Number(n) - 1;
            window.location.href = "?page=" + t
        }
    }
    if (n < t - 1) {
        var r = pagination.querySelector('[command="next"]');
        r.classList.remove("disabled"), r.onclick = function(e) {
            e.preventDefault();
            var t = Number(n) + 1;
            window.location.href = "?page=" + t
        };
        var l = pagination.querySelector('[command="end"]');
        l.classList.remove("disabled"), l.onclick = function(e) {
            e.preventDefault(), window.location.href = "?page=".concat(t - 1)
        }
    }
    if (1 < i) {
        var c = pagination.querySelector('[command="begin"]');
        c.classList.remove("disabled"), c.onclick = function(e) {
            e.preventDefault(), window.location.href = "?page=0"
        }
    }
}