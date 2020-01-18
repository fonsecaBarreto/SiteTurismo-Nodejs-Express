"use strict";
var waves = document.querySelectorAll(".wave");
window.onload = function() {
    body.classList.remove("loading"), waves.forEach(function(e) {
        e.style.animationDelay = "0s", e.style.animation = "none", e.offsetHeight, e.style.animation = null
    }), navbarNav.querySelectorAll(".nav-item")[1].classList.add("active")
};
var thumbs = [],
    feedControl = {
        offset: 0,
        limit: 0
    },
    portifolioFeed = document.querySelector(".portifolio-feed "),
    btnVerMais = document.querySelector(".ver-mais"),
    modal = document.querySelector("#portifolio-modal");

function loadFeed(t, l) {
    fetch("/partials/portifolio-thumb.html").then(function(e) {
        return e.text()
    }).then(function(e) {
        thumbs[0] = e.split("\x3c!-- # --\x3e")[0], thumbs[1] = e.split("\x3c!-- # --\x3e")[1];
        fetch("/collectio-petitio?limit=".concat(l, "&offset=").concat(t)).then(function(e) {
            return e.json()
        }).then(function(e) {
            console.log(e)
            if (0 < e.result.length && e.result.length <= e.length) {
                feedControl.offset += l;
                try {
                    var o = e.result.length;
                    e.result.forEach(function(r) {
                        var e = portifolioFeed.querySelector(".row"),
                            t = document.createElement("div");
                        t.classList = "col-12  col-md-11 col-lg-10 m-auto m-0 p-0 port-row d-none bd-blue",
                        t.innerHTML = thumbs[1], t.querySelector("#thumb_title").innerHTML = r.title, 
                        t.querySelector("#thumb_subtitle").innerHTML = r.subtitle, t.querySelector("#thumb_body").innerHTML = r.body,
                        t.querySelector("#thumb_image").src = r.img[0].xs.location;
                        t.querySelector("#thumb_image").srcset = `${r.img[0].xs.location} ${r.img[0].xs.width}w,
                                                                    ${r.img[0].sm.location} ${r.img[0].sm.width}w,
                                                                    ${r.img[0].md.location} ${r.img[0].md.width}w,
                                                                    ${r.img[0].lg.location} ${r.img[0].lg.width}w,
                                                                    ${r.img[0].xl.location} ${r.img[0].xl.width}w,
                        `
                        t.querySelector("#thumb_image").sizes = "(min-width:992px) 40vw ,45vw"
                       
                        e.appendChild(t), 0 == --o && (e.querySelectorAll(".stand-by").forEach(function(e) {
                            e.parentNode.removeChild(e)
                        }), e.querySelectorAll(".port-row").forEach(function(e) {
                            e.classList.remove("d-none")
                        })), t.querySelector("#thumb_call").onclick = function(e) {
                            e.preventDefault();
                            var t = modal.querySelector("#modal-title"),
                                o = modal.querySelector("#modal-subtitle"),
                                l = modal.querySelector("#modal-body"),
                                n = modal.querySelector(".carousel-inner"),
                                i = modal.querySelector(".carousel-indicators");
                            i.innerHTML = "", n.innerHTML = "", 
                            t.innerHTML = r.title, o.innerHTML = r.subtitle, 
                            l.innerHTML = r.body, 0 < r.img.length && r.img.forEach(function(e, t) {
                                var o = document.createElement("div");
                                o.classList = "carousel-item";
                                var l = document.createElement("li");
                                l.setAttribute("data-targer", "carouselModal"), l.setAttribute("data-slide-to", t), 0 == t && (o.classList.add("active"), l.classList.add("active"));
                                var r = document.createElement("img");
                                var imgVP = document.createElement("div"); imgVP.classList = "pt-img-ov";

                                r.classList = "carousel-img", r.src = e.xs.location,
                                r.classList = "carousel-img", r.srcset = `${e.xs.location} ${e.xs.width}w,
                                                                          ${e.sm.location} ${e.sm.width}w,
                                                                          ${e.md.location} ${e.md.width}w,
                                                                          ${e.lg.location} ${e.lg.width}w,
                                                                          ${e.xl.location} ${e.xl.width}w,
                                `,

                                 o.appendChild(r), n.appendChild(o), i.appendChild(l)
                            }), $(modal).modal("show")
                        }
                    })
                } catch (e) {
                    console.log("erro")
                }
            } else btnVerMais.classList.add("d-none"), btnVerMais.setAttribute("disabled", !0), btnVerMais.innerHTML = "Acabou ;("
        })
    })
}
btnVerMais.onclick = function(e) {
    e.preventDefault(), loadFeed(feedControl.offset, 2)
}, loadFeed(0, 6);