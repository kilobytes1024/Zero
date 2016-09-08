angular.module('user.service', [])


.factory('user', function($http) {
  
  var user = {};
  var sessionId = localStorage.getItem("sid")?localStorage.getItem("sid"):"";
 
  var regid = localStorage.getItem("regId")?localStorage.getItem("regId"):"";

  console.log(user);

  return {
    getUser: function() {
        
        //LATER CHANGE THE URL AFTER IMPLEMENTING FIND BY SESSION IN THE BACKEND;
        //This function should get user from Service using sessionId for Authentication 
        var promise =  $http.get("http://localhost:8080/session/"+sessionId+"/")
            .then(function(response) {
                //console.log(response.data);
                user = response.data;
                console.log("User assigned");
                console.log(user);
                return user ;
            });
        
        return promise;
      
    },
    setUser: function(userObject){
      user = userObject;
    },
    getUserObject: function(){
      return user;
    },

    setSID: function(sid){
      console.log("Setting Sid" + sid);
      sessionId = sid;
      console.log(sessionId)
      
      localStorage.setItem("sid",sid);
    },
    getSID: function(){
      console.log("Getting SID" + sessionId);
      return sessionId;
    }
    ,

    setRegId: function(rid){
      console.log("Setting RID" + rid);
      regid = rid;
      console.log(regid)
      localStorage.setItem("regId",regid);
    },
    getRegId: function(){
      console.log("Getting RID" + regid);
      return regid;
    },
    removeSID: function(){
      console.log("Getting RID" + regid);
      localStorage.removeItem("sid");
      sessionId = null;
    }
    

  };

});