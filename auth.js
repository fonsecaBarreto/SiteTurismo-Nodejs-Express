
const bcrypt = require('bcrypt')  
const LocalStrategy = require('passport-local').Strategy
module.exports = function(passport){
    function findUser(username, callback){
        global.db.collection("users").findOne({"username": username}, function(err, doc){
            callback(err, doc);
        });
    }
    function findUserById(id, callback){
        const ObjectId = require("mongodb").ObjectId;
        global.db.collection("users").findOne({_id: ObjectId(id) }, (err, doc) => {
            callback(err, doc);
        });
    }
    passport.serializeUser(function(user, done){
        done(null,user._id);
    });

    passport.deserializeUser(function(id, done){
        findUserById(id, function(err,user){
            done(err, user);
        });
    });
    /*  */
 
    passport.use(new LocalStrategy( { 
        usernameField: 'username',
        passwordField: 'password'
    },(username, password, done) => {
        findUser(username, (err, user) => {
          if (err) { return done(err) }
          if (!user) { return done(null, false) }// usuário inexistente
          // comparando as senhas
          console.log(user.password);
          console.log(password);
          if(password == user.password){
              console.log("valido")
              return done(null,user);
          }
          console.log("invalido")
          return done(null,false)
       /*    bcrypt.compare(password, user.password, (err, isValid) => {
            if (err) { //return done(err); 
                console.log("erro")}
            if (!isValid) { //return done(null, false); 
                console.log("invalido");return}
                console.log("valido")
            return done(null, user)
          }) */
        })
      }
    ));

}