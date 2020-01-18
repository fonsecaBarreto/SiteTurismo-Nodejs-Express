
paginas= {
    inicio:{
        view:"home-view",
        href:"/inicio",
        title:"Inicio",
        contents:{},
        colls:[db.collection("inicio-contents")],
        run:function(router){
            router.get(this.href,(req,res)=>{
                res.render(this.view,{title:`NoMapa | ${this.title}`,conteudo:this.contents});
            });
        },
    },
    portifolio:{
        view:"portifolio-view",
        href:"/portifolio",
        title:"Portifolio",
        contents:{},
        colls:[db.collection("portifolio-contents"),db.collection('portifolio-feed')],
        run:function(router){
            router.get(this.href,(req,res)=>{
                res.render(this.view,{title:`NoMapa | ${this.title}`,conteudo:this.contents});
            });
            router.get("/collectio-petitio",async (req,res)=>{
                var offset = req.query.offset != undefined? parseInt(req.query.offset) : 0; 
                var limit = req.query.limit != undefined ?parseInt(req.query.limit) : 0; 
                var sort = req.query.sort != undefined ? req.query.sort == "date" ? {date : -1} : { amount: -1 } :{ amount: -1 } ;  
                var filter = {};
                var response = {filter,offset,limit,total:0,length:0,result:[]};
                response.total = await this.colls[1].countDocuments(); //total
                response.length = await this.colls[1].countDocuments(filter);
                if(response.length >0){ response.result = await this.colls[1].find(filter).sort(sort).limit(limit).skip(offset).toArray();}
                else{response = {status:false,info:"not found"}}
                res.json(response);
            });
        },
    },
    blog:{
        view:"blog-view",
        href:"/blog/:artigo?",
        title:"Blog",
        contents:{},
        colls:[db.collection("blog-contents"),db.collection('blog-feed')],
        run:function(router){
            router.get(this.href,async (req,res,next)=>{
                /*  */
                if(req.params.artigo == undefined){
                    res.render(this.view,{title:`NoMapa | ${this.title}`,conteudo:this.contents});
                }else{   
                    try{
                        var collection = this.colls[1];
                        var param = req.params.artigo;
                        var result = await collection.find({param}).toArray();
                        if(result.length >0){
                            result[0].views +=1; // acrease view
                            collection.updateOne({param},{$set:{views:result[0].views}},function(err,result){
                                if(err)throw err;
                                const { matchedCount, modifiedCount } = result;
                                if(matchedCount && modifiedCount) {
                                    console.log(`Successfully added a new review.`)
                                }
                            });
                            console.log(result)
                            result[0].srcset = "";
                            //
                             /* srcset */
                            
                                console.log(">>>  "+result[0])
                                if(result[0].img  != undefined){
                                    console.log("there is a img")
                                    try{
                                        result[0].srcset ="";
                                        result[0].srcset+= `${result[0].img[0].xs.location} ${result[0].img[0].xs.width}w, `
                                        result[0].srcset+= `${result[0].img[0].sm.location} ${result[0].img[0].sm.width}w, `
                                        result[0].srcset+= `${result[0].img[0].md.location} ${result[0].img[0].md.width}w, `
                                        result[0].srcset+= `${result[0].img[0].lg.location} ${result[0].img[0].lg.width}w, `
                                        result[0].srcset+= `${result[0].img[0].xl.location} ${result[0].img[0].xl.width}w `
                                    }catch(err){}
                                }
                            
                          
                            //
                            var conteudo = {
                                artigo:result[0],
                                sobremim:this.contents.sobremim
                            }

                                res.render("blog-alternative-view",{title:`NoMapa | ${this.title}`,conteudo});
                        } 
                     
                    }catch(err){ throw err }  
                }
                /*  */
             });
             router.get("/nuntium-petitio",async (req,res)=>{
                /*  */
                console.log("blogooooooooooo")
                var offset = req.query.offset != undefined? parseInt(req.query.offset) : 0; 
                var limit = req.query.limit != undefined ?parseInt(req.query.limit) : 0; 
                var sort = {amount: -1 };
                if(req.query.sort != undefined){ sort= {}; sort[req.query.sort]=-1;}
                var filter = {};
                var response = {filter,offset,limit,total:0,length:0,result:[]};
                response.total = await this.colls[1].countDocuments(); //total
                response.length = await this.colls[1].countDocuments(filter);
                if(response.length >0){ response.result = await this.colls[1].find(filter).sort(sort).limit(limit).skip(offset).toArray();}
                else{response = {status:false,info:"not found"}}
                res.json(response);
                /*  */
             });
        
        }
    }
    
  
}
function download(pagina){
    console.log(" >  downloading contents : "+pagina.title)
    var rootColl = pagina.colls[0];
    return new Promise(async function(resolve){
        var result = await rootColl.find({}).toArray(); // rootDoc
        var conteudo = {};
        try{
            await Promise.all( result.map(async (element,index) => { //each element represents a html element
                //console.log(index,element.elementId)
               if(element.config != undefined){
                   if(element.config.static == true){ 
                    var res = []; // <----resource of document
                    if(typeof(element.resource) != "string"){res = element.resource;}
                    else if(element.resource.charAt(0)=="&"){
                        var ref= element.resource.substring(2);
                        var subColl = db.collection(ref)
                        var res = await subColl.find({}).toArray();
                    } 
                /* srcset */
                await Promise.all(res.map(async (el)=>{ // each one is a form
                    console.log(">>>  "+el)
                    if(el.img  != undefined){
                        console.log("there is a img")
                        try{
                            el.srcset ="";
                            el.srcset+= `${el.img[0].xs.location} ${el.img[0].xs.width}w, `
                            el.srcset+= `${el.img[0].sm.location} ${el.img[0].sm.width}w, `
                            el.srcset+= `${el.img[0].md.location} ${el.img[0].md.width}w, `
                            el.srcset+= `${el.img[0].lg.location} ${el.img[0].lg.width}w, `
                            el.srcset+= `${el.img[0].xl.location} ${el.img[0].xl.width}w `
                        }catch(err){}
                    }
                 
                }));
                conteudo[element.elementId]= res;
                console.log(conteudo.sobre[0])
                }
               }
            }) );
        }catch(err){console.log(err)}
        resolve(conteudo);    
    });
}
module.exports ={download,paginas};