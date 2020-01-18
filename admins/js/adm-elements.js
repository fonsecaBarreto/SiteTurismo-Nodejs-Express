"use strict";

function postImage(file,size){
  var width = isNaN(size) ? 320 : size;
  return new Promise(function(resolve,reject){
    var stringRequest = "/uploadImage?s="+size;
    if(file != undefined){
      try{
          var formData = new FormData();
          formData.append('file',file)
          ajaxUpload({
              method:"post",
              url:stringRequest,
              formData: formData,
              success:function(){}
          });
      }catch(err){alert("nao foi possivel salvar a imagem");resolve(undefined)}
      function ajaxUpload(config){
          const xhr = new XMLHttpRequest();
          xhr.open("post",config.url,true);
          xhr.send(config.formData);
          xhr.onreadystatechange = function() {
              if (xhr.readyState == 4 && xhr.status == 200){
                  var resp = JSON.parse(xhr.responseText);
                  resolve(resp)
              }
          }
      }
    }else{resolve(undefined)}
  })
}

function deleteDoc(e, n) {
  return new Promise(function(t) {
      try {
          null != e._id && fetch("/direct" + n + "/_" + e._id, {
              method: "DELETE",
              headers: {
                  "Content-type": "application/json"
              },
              body: JSON.stringify(e)
          }).then(function(e) {
              return e.json()
          }).then(function(e) {
              t(e)
          })
      } catch (e) {
          t(!1)
      }
  })
}
function isImg(imgArray, config) {
  console.log("handling image")
  return new Promise(async function (resolve) {
    if (imgArray.length > 0) {
      await Promise.all(imgArray.map(async (img, index) => {
        await new Promise(async s => {
          console.log("inside of it")
          if (typeof (img) == 'object') {
            console.log("its a Objec????")

            if (img.lg == undefined && img.size != undefined) { //<-------------------
              console.log("seens to be a file object")
              try {
                var size = JSON.parse(config)[0]
                var imglocation = await postImage(img, size)
                imgArray[index] = imglocation == undefined || imglocation == false ? {} : imglocation;
                console.log(index, " image done")


              } catch (err) {
                console.log("dawn")
                imgArray[index] = {};
              }
            }
          }
          console.log("wahtever doiien")
          s();
        });
      }));
      console.log("end all")
      resolve(true)
    } else { resolve(true) }
  })
}
function save(rootDoc, inner, cb) {
  console.log("saving")
  inner.classList.add("saving-float")
  return new Promise(async function (sucess) { //---------------------------------------------------------  POST image
    if (rootDoc.resource.length > 0) {
      console.log("there is ????")
      Promise.all(rootDoc.resource.map(async (doc, index) => {
        await new Promise(async (re) => {
          console.log("form: ", index)
          if (Object.keys(doc).length > 0) {
            await Promise.all(Object.keys(doc).map(async (att) => {
              if (att == "img") {
              
                var imgConfig = 720;
                try { imgConfig = rootDoc.config.img != undefined ? rootDoc.config.img : doc.config.img } catch (err) { }
                await isImg(doc[att], imgConfig)
                console.log('fished');
                re();
              } else { }
            }));
          }


        })
      }))
        .then(() => {
        
          sucess(true)
        })
    }else{
      sucess(false)
    }
    
  }).then((answer) => {

    console.log(answer, "now Posting dpc")
    if (answer == true) {
      new Promise(async function (done) {
        if (rootDoc.rsrcDest == "!self") { //------------------------------------------------------  POST doc on self 
          var request = rootDoc.dest;
          var doc = rootDoc;
          fetch("/direct" + request, { method: "POST", headers: { "Content-type": "application/json" }, body: JSON.stringify(doc) })
            .then(response => response.json())
            .then(data => {
              done(data);
            })
        } else {  //-------------------------------------------------------------------------------  POST doc on extern coll
          var request = rootDoc.rsrcDest;
          var docs = rootDoc.resource;
          await Promise.all(docs.map((doc) => {
            fetch("/direct" + request, { method: "POST", headers: { "Content-type": "application/json" }, body: JSON.stringify(doc) })
              .then(response => response.json())
              .then(data => {
                done(data);
              })
          }))
        }
      }).then(answer => {
        alert("SALVO COM SUCESSO")
        inner.classList.remove("saving-float");
        try{fetch("/update")}catch(err){}
        cb();
      })
    }else{
      console.log("::::DELETING???")
      alert("REMOVIDO COM SUCESSO")
      inner.classList.remove("saving-float");
      try{fetch("/update")}catch(err){}
      cb();
    }
  })
}
function domodal(r, o) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : [];
  3 < arguments.length && arguments[3];
  return new Promise(function (t) {
    var e = r.querySelector(".modal-body"),
      n = o.innerHTML;
    e.innerHTML = n, drawForm(c, e), $(r).modal(), r.querySelector(".btn-primary").onclick = function (e) {
      e.preventDefault(), t(c[0]), $(r).modal("hide")
    }
  })
}

function drawForm(docs, thumbRoot) {
  thumbRoot.querySelectorAll("form").forEach((form, index) => {
    docs[index] = docs[index] != undefined ? docs[index] : {}; //create obj if no defined
    form.querySelectorAll("[name]").forEach(function (input) {
      docs[index][input.name] = docs[index][input.name] != undefined ? docs[index][input.name] : "";//init att if not defined
      try { input.value = docs[index][input.name]; } catch (err) { } //extract to input
      /*  */
      input.onchange = e => {
        e.preventDefault(); //other way    
        var normalize = input.getAttribute("normalize");
        if (normalize == null) {
          var value = input.value;
        } else {
          if (normalize == "!self") {
            value = input.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/([^\w]+|\s+)/g, '-')
              .replace(/\-\-+/g, '-').replace(/(^-+|-+$)/, '').toLowerCase();
          } else {
            value = input.value;
            docs[index][normalize] = input.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/([^\w]+|\s+)/g, '-')
              .replace(/\-\-+/g, '-').replace(/(^-+|-+$)/, '').toLowerCase();
          }
        }
        docs[index][input.name] = value;

        if (input.value.length == 0) { input.classList.add("input-alert"); return; }
        try { input.classList.remove('input-alert') } catch (err) { }
      }
    });

    /* editInput */
    var editorInput = form.querySelector("#editor-input");
    if (editorInput != null) {
      try { editorInput.innerHTML = docs[index].body != undefined ? docs[index].body : ""; } catch (err) { }
      $(form).on('DOMSubtreeModified', editorInput, function () {
        docs[index].body = editorInput.innerHTML;
      });
      $('#editControls a').click(function (e) {
        switch ($(this).data('role')) {
          case 'h1':
          case 'h2':
          case 'p':
            document.execCommand('formatBlock', false, $(this).data('role'));
            break;
          default:
            document.execCommand($(this).data('role'), false, null);
            break;
        }
      });
    }
    /* image manager */
    var imgHolders = form.querySelectorAll(".img-holder");
    if (imgHolders.length > 0) {
      var fileInput = document.createElement('input'); fileInput.type = 'file';
      imgHolders.forEach(function (imgh) {
        var imgBtn = imgh.querySelector(".img-holder-bt");
        docs[index].img = docs[index].img != undefined ? docs[index].img : []
        /* --------------------------------------------------------------- */
        var imgPreview = imgh.querySelector(".img-preview");
        var imgFlow = imgh.querySelector(".img-flow")

        if (imgPreview != null) {
          try {
            var imgIndex = imgPreview.getAttribute("index");
            /*   imgPreview.src = docs[index].img[imgIndex] != undefined ? docs[index].img[imgIndex].split(".webp")[0]+"-320x.webp"   : "/images/padrao/noimage.webp" */
            imgPreview.src = docs[index].img[imgIndex].md.location;
          } catch (err) { }
          imgBtn.onclick = () => {

            fileInput.click();
            fileInput.onchange = e => {
              e.preventDefault();
              var reader = new FileReader();
              reader.onload = function (e) {
                docs[index].img[imgIndex] = fileInput.files[0]
                imgPreview.src = e.target.result;
              }
              reader.readAsDataURL(fileInput.files[0]);
            }
          }
        } else if (imgFlow != null) {

          /* else begin  */
          imgFlow.innerHTML = "";
          docs[index].img.forEach(function (img, indice) {

            var imgCt = document.createElement('div'); imgCt.classList = "img-container";
            var imgPv = document.createElement("img");
            var _delBtn = document.createElement("a"); _delBtn.classList = "_del-btn"; _delBtn.setAttribute("index", indice);
            imgCt.appendChild(imgPv);
            imgCt.appendChild(_delBtn);
            imgFlow.appendChild(imgCt);




            try {
            imgPv.src = img.resultPreview != undefined ? img.resultPreview : img.md.location

            } catch (err) { imgPv.src = "/images/padrao/noimage.webp" }


            _delBtn.onclick = (e) => {
              e.preventDefault();
              docs[index].img.splice(e.currentTarget.getAttribute("index"), 1)
              drawForm(docs, thumbRoot)
            }


          });

          imgBtn.onclick = () => {
            var imgIndex = docs[index].img.length;
            fileInput.click();
            fileInput.onchange = e => {
              e.preventDefault();
              var reader = new FileReader();
              reader.onload = function (e) {
                docs[index].img[imgIndex] = fileInput.files[0];
                docs[index].img[imgIndex].resultPreview = e.target.result;
                drawForm(docs, thumbRoot)
              }
              reader.readAsDataURL(fileInput.files[0]);
            }
          }



          /* else end */
        }
        /*  */
      });
    }
  });
}
var elementsReference = {
  "form": {
    drawingStyle: "static",
    draw: function (rootDoc, thumbRoot, thumbInner, modalBody, localModal, cb) {
      var docs = rootDoc.resource;
      drawForm(docs, thumbRoot)
    },
    onSave: function (rootDoc, thumbRoot, localModal, cb) { cb(); },
    onCancel: async function (rootDoc, thumbRoot, localModal, cb) { cb(); },
    onEdit: function (rootDoc, thumbRoot, thumbInner, modalBody, localModal, cb) { cb(); }
  },
  "feed": {
    drawingStyle: "dynamic",
    draw: function (rootDoc, thumbRoot, thumbInner, modalBody, localModal, cb) {
      var docs = rootDoc.resource;
      try { thumbRoot.classList.remove("loading-float") } catch (err) { };
      if (docs.length > 0) {
        docs.forEach(function (doc) {
          /* ------- */
          var thumb = document.createElement("div"); thumb.classList = thumbInner.getAttribute("thumb");
          thumb.innerHTML = thumbInner.innerHTML;
          /*  */
          var ftImage = thumb.querySelector(".ft-image");
          var title = thumb.querySelector(".ft-title");
          var views = thumb.querySelector(".ft-views");
          var editBTN = thumb.querySelector(".ft-edit");
          var delBTN = thumb.querySelector(".ft-del");
          var lampBTN = thumb.querySelector(".ft-lamp");
          try { ftImage.src = doc.img[0].md.location } catch (err) { }



          try { title.innerText = doc.title != undefined ? doc.title : "-" } catch (err) { }
          try { views.innerText = doc.views != undefined ? doc.views : "00" } catch (err) { }
          editBTN.onclick = () => {
            domodal(localModal, modalBody, [doc], thumbRoot)
              .then(newDocument => {
                thumbRoot.classList.add("loading-float")
                cb();
              })
          }
          delBTN.onclick = () => {
            deleteDoc(doc, rootDoc.rsrcDest)
              .then((answer) => {
                if (answer.status) {
                  var indextoRm = docs.indexOf(doc);
                  docs.splice(indextoRm, 1);
                }
                console.log("deleted:?????")
                cb();
              })
          }
          thumbRoot.appendChild(thumb);
          /*  -----------*/
        })
      }

      /*var editBTN= thumb.querySelector(".ft-edit"),
          delBTN= thumb.querySelector(".ft-del"),
          lampBTN= thumb.querySelector(".ft-lamp");
      if(doc.lightup == true ? lampBTN.classList = "ft-lamp-on mt-2" : lampBTN.classList="ft-lamp mt-2" ) */
      /* eventos */
      /*   editBTN.onclick= async e=>{e.preventDefault()
         
          domodal(localModal,doc,thumbRoot)
          .then(newDocument=>{
            thumb.classList.add("loading-float");
            var imgConfig = JSON.parse(docWrappper.config.img);
            save(newDocument,docWrappper.dest).then(()=>{
              cb();
            })
            
          })
          
  
         
        } */
      /*  delBTN.onclick =async e=>{e.preventDefault();
         thumb.classList.add("loading-float");
   
         var answer = await deleteDoc(doc,docWrappper.dest);
         if(answer.status == true){
           docWrappper.documents.splice(docWrappper.documents.indexOf(doc),1);
         
         }
         cb();
       } 
       lampBTN.onclick =async ()=>{
         thumb.classList.add("loading-float")
         doc.lightup =  !doc.lightup ;
         answer = await this.save(doc,docWrappper.dest);
         console.log(answer)
         cb();
       } */
    },
    onCancel: function (docWrappper, thumbRoot, localModal, cb) { cb(); },
    onSave: function (docWrappper, thumbRoot, localModal, cb) { cb(); },
    onEdit: function (rootDoc, thumbRoot, thumbInner, modalBody, localModal, cb) {
      domodal(localModal, modalBody, [], thumbRoot)
        .then(newDocument => {
          newDocument.views = newDocument.views == undefined ? 0 : newDocument.views;
          thumbRoot.classList.add("loading-float")
          rootDoc.resource.push(newDocument);
          cb();
        })
    },
  }
}

