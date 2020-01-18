var fs = require("fs")
var router = require('express').Router();
var passport = require('passport');
var ObjectId = require('mongodb').ObjectID;
var indexController = require('../src/indexController');
const mongoClient = require("mongodb").MongoClient;
function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {console.log("AUTHENTIFICADO");return next()
    }res.redirect('/login')
  }
}

router.get('/logout', function(req,res){
  console.log("> LOGOUT!!")
  req.logOut();
  req.session.destroy(function (err) {
  res.redirect('/'); //Inside a callback… bulletproof!
  });
});
router.get('/login', function(req, res){
 
  if(req.query.fail)
    res.render('adm-login-view', { message: 'Usuário e/ou senha incorretos!' });
  else
    res.render('adm-login-view', { message: null});
});
router.post('/login',passport.authenticate('local', { successRedirect: '/admin', failureRedirect: '/login?fail=true' }));
var pages ={
  inicio:{
    name:"Inicio",
    href:"inicio",
    rootColl:"inicio-contents",
    img:"/images/padrao/global.png",
    body:"adm-inicio-view"},
  portifolio:{
    name:"portifolio",
    href:"portifolio",
    rootColl:"portifolio-contents",
    img:"/images/padrao/camera.png",
    body:"adm-portifolio-view"},
  blog:{
    name:"Blog",
    href:"blog",
    rootColl:"blog-contents",
    img:"/images/padrao/browser.png",
    body:"adm-blog-view"},
  chat:{
    name:"Chat",
    href:"chat",
    rootColl:"blog-contents",
    img:"/images/padrao/chat.png",
    body:"chat"
  }
};

router.get("/admin",authenticationMiddleware(),async function(req,res,next){
  var sub = req.query.sub;
  console.log('sub',sub)
  if(sub != undefined){
    var pagina = pages[sub];
    try{
      if(pagina != undefined){
        res.render(pagina.body,{ 
        rootColl: pagina.rootColl,
        pages}); 
      }
    }catch(err){throw err}
  }else{
    res.redirect(`/admin?sub=inicio`)
  }
 
 });
router.get("/manutence",function(req,res){
   res.render("manutence");
});

/* ------------------------------------------ */
var requestify = require("requestify");
var multer = require('multer')
var multerConfig = require("../config/multer.js");
router.post("/uploadImage",multer(multerConfig).single('file'),async function(req,res){
  console.log("uploading image")
  try{

    var width = req.query.s != undefined ? Number(req.query.s) : 480;
    var config = {
      bucket: process.env.AWS_BUCKET_NAME,
      key : req.file.key, 
      width: width
    };
    try{
      requestify.post('https://rcrqmg9z1k.execute-api.sa-east-1.amazonaws.com/dev/run',config).then(async function(response) {
        var body = response.getBody();
        if(body.srcset != undefined){
          var srcset = response.getBody()['srcset'] ;
          console.log(srcset)
          res.json(srcset)
        }else{
          console.log("litle wrong")
          res.json(false)
        }

      });
    
    }catch(err){console.log("cabuloso aqui");res.json(false)}
  }catch(err){res.json(false)}
  
});

/* PADRAO */
router.get("/direct/:coll/:id?", async (req,res)=>{
    var collection = db.collection(req.params.coll);
    var offset = req.query.offset != undefined? parseInt(req.query.offset) : 0; 
    var limit = req.query.limit != undefined ?parseInt(req.query.limit) : 0; 
    var sort = req.query.sort != undefined ? {} : { amount: -1 }; if(req.query.sort != undefined) sort[req.query.sort] =-1;
    var value = req.query.v != undefined ? req.query.v :undefined;
    var key = req.query.id != undefined ? req.query.id :undefined
    var filter = {}
    if(key!= undefined && value != undefined){filter[key]=value}
    try{
        var response = await indexController.find(collection,filter,offset,limit,sort);
        res.json(response);
        return
    }catch(err){} 
    res.json(response);
}) ;
router.post("/direct/:coll/",authenticationMiddleware(),async(req,res)=>{//insert and update database collections
  try{
    var collection = db.collection(req.params.coll);
    var filter = req.body._id != undefined ? {"_id" :ObjectId(req.body._id)} : {};if(filter != {}) delete req.body._id;
    var result = await indexController.upsert(collection,req.body,filter); 
    res.json(result? {status:true}: {status:false});
  }catch(err){res.jons({status:false})}
  }) 
router.delete("/direct/:coll/:id",authenticationMiddleware(),async(req,res)=>{//delte database collections
   try{
      var collection = db.collection(req.params.coll);
      filter = {"_id": ObjectId(req.params.id.substr(1))};
      var result = await collection.findOneAndDelete(filter);
      res.json(result.value != null? {status:true,info:"removed",result:result.value}:{status:false,info:"not found"} );
  }catch(err){res.jons({status:false})}
})
/* chat */
router.get("/chatClients",authenticationMiddleware(),async function(req,res){
  var collection = db.collection('chats');
  var response = await indexController.find(collection);
  if(response.status == undefined){
    if(response.result.length > 0){
      response.from = req.user.username;
      res.json(response);return;
    }
  }
  res.json({status:false});return;
 
})





















/*  */
module.exports = router;


/* async function resizeImage(file,sizes,newDir){
  return new Promise(async function(sucess){

    var name = file.key.substr(0, file.key.lastIndexOf(".")); 
    var buffer = await sharp(file.path)
                .webp({lossless: true })
                .toBuffer()
    await Promise.all(sizes.map( async (dim,index)=>{
      var result =  await  new Promise(resolve=>{
        var size = {}
        size.width = dim[0] != "auto" ? dim[0]:undefined;
        size.height = dim[1] != "auto" ? dim[1]:undefined;
        var prefix = (size.width == undefined?"":size.width)
        prefix+="x";
        prefix += (size.height == undefined?"":size.height);
  
        sharp(buffer)
        .resize(size)
        .toFile(`${newDir}/${name}-${prefix}.webp`, (err, result) => {
          resolve(result)
        })
      })
    }))
  
    sucess();
  }) 
}
 */
/* router.post("/uploadImage/:folder", cors(), multer(multerconfig.single('file')), async function(req,res){
  if(process.env.STORAGE_TYPE == 'local'){
  try{
    var sizes = req.query.size != undefined ? JSON.parse(req.query.size): [];
    var newDir = `./export/images/${req.params.folder}`;  fs.existsSync(newDir) || fs.mkdirSync(newDir);
    var name = req.file.key.substr(0, req.file.key.lastIndexOf("."));
    sharp(req.file.path)
    .webp({lossless: true })
    .toFile(`${newDir}/${name}.webp`, (err, result) => {

      res.json({result})
    })
   
     resizeImage(req.file,sizes,newDir)
    .then(()=>{ 
        console.log("::::::::::::::::::::::::::::::DONE")
        res.json({status:true})

        console.log((os.totalmem()- os.freemem())/100000000);
       
      });  
    }catch(err){res.end(); throw err} 
  }else{
    res.json(req.file)
  }


}); */

/* PADRAO */
