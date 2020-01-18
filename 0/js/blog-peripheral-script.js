"use strict";
var fbColumn = document.querySelector(".fb-column"),
    fbIframe = fbColumn.querySelector("iframe");

function newResize() {
    var e = fbColumn.clientWidth,
        t = fbColumn.clientHeight;
    fbIframe.setAttribute("src", "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fnomapaturismo-106789974112371%2F&tabs=timeline&width=" + e + "&height=" + t + "&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=446172715991579")
}
window.addEventListener("resize", newResize);
var ma = document.querySelector(".most-viewed");
fetch("/nuntium-petitio?sort=views&limit=4").then(function(e) {
    return e.json()
}).then(function(o) {
    ma.querySelector(".row").querySelectorAll(".ma-prov").forEach(function(e, t) {
        try{

            if(o.result[t]!= undefined){

            console.log(o.result[t])
            var thumb = document.createElement("div");
            thumb.innerHTML = `
            <div class="vRow bd-blue">
                <div class="ma-img-PV relative">
                    <img class="ma-img" src="" alt="">   
                </div>
               
                
              
                <a class="ma-call mt-1" href="http://www.google.com.br">assdasdadas</a>

            </div>`;
       
            thumb.querySelector(".ma-img").src =  o.result[t].img[0].xs.location;
            thumb.querySelector(".ma-img").srcset =  `${o.result[t].img[0].xs.location} ${o.result[t].img[0].xs.width}w,
                                                      ${o.result[t].img[0].sm.location} ${o.result[t].img[0].sm.width}w,
                                                      ${o.result[t].img[0].md.location} ${o.result[t].img[0].md.width}w,
                                                      ${o.result[t].img[0].lg.location} ${o.result[t].img[0].lg.width}w,
                                                      ${o.result[t].img[0].xl.location} ${o.result[t].img[0].xl.width}w`
            thumb.querySelector(".ma-call").innerHTML = o.result[t].title;
            thumb.querySelector(".ma-call").setAttribute("href", "/blog/" + o.result[t].param), 
            e.parentNode.appendChild(thumb),
            e.parentNode.removeChild(e)
            }
        }catch(err){
            
        }
    })
});