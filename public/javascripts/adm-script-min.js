"use strict";
var sidebar = document.querySelector("#sidebar-wrapper"),
    sidebarNav = document.querySelector("#sidebar-nav"),
    menuButton = document.querySelector("._menu-button"),
    contentWrapper = document.querySelector("#page-content-wrapper"),
    feed = document.querySelector(".admin-feed");

function load(r) {
    console.log("loading"), fetch("/direct" + r).then(function(e) {
        return e.json()
    }).then(function(e) {
        console.log("rootcoll fetched"), console.log(e), 0 != e.status && e.result.forEach(function(n) {
            try {
                var t = feed.querySelector("#" + n.elementId),
                    o = elementsReference[n.type];
                null != t && null != o && new Promise(function(t) {
                    "string" == typeof n.resource && "&" == n.resource.charAt(0) ? fetch("/direct" + n.resource.substring(1)).then(function(e) {
                        return e.json()
                    }).then(function(e) {
                        n.dest = r, n.rsrcDest = n.resource.substring(1), n.resource = null == e.result || 0 == e.result.length ? [] : e.result, t(n)
                    }) : (n.dest = r, n.rsrcDest = "!self", t(n))
                }).then(function(e) {
                    init(e, t, o)
                })
            } catch (e) {
                throw e
            }
        })
    })
}

function init(rootDoc,admElement,elementRef){
    console.log("initing")
    var localModal = document.querySelector("#local-modal");
    var inner = admElement.querySelector(".inner"); 
    var thumbRoot = inner.querySelector("[root]");
    var modalBody = inner.querySelector("[modal]");
    var thumbInner = inner.querySelector("[thumb]");
    var bottomBar = admElement.querySelector('.bottom-bar');
    var editBtn = bottomBar.querySelector(".edit-btn");
    var saveBtn = bottomBar.querySelector(".save-btn"); 
    admElement.classList.remove("loading-float"); 
    drawInner(rootDoc,elementRef,thumbRoot,localModal,thumbInner,modalBody,inner);// <-----draw
    var showBtn = bottomBar.querySelector('.show-btn');
    /* eventos */
    showBtn.onclick = e=>{e.preventDefault();inner.classList.toggle("hide")}
    editBtn.onclick = e=>{e.preventDefault();
      elementRef.onEdit(rootDoc,thumbRoot,thumbInner,modalBody,localModal,function(){
        save(rootDoc,inner,function(){
          load(rootDoc.dest)
        });
      });
    }
     saveBtn.onclick = e=>{e.preventDefault();
      save(rootDoc,inner,function(){
        load(rootDoc.dest)
      });
     }
  }

function drawInner(e, t, n, o, r, c, u) {
    "dynamic" == t.drawingStyle && (n.innerHTML = ""), 0 < e.resource.length && t.draw(e, n, r, c, o, function() {
        save(e, u, function() {
            load(e.dest)
        })
    })
}


menuButton.onclick = function(e) {
    e.preventDefault(), sidebar.classList.toggle("retract")
};