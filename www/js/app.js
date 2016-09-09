// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','user.service','loading.service'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})



.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('login', {
            url: '/',
            templateUrl: 'templates/login.html',
            controller : 'login'
        })
         .state('zero', {
            url: '/zero',
            templateUrl: 'templates/zero.html',
            controller:'zero'
        })
        .state('reg', {
            url: '/reg',
            templateUrl: 'templates/register.html',
            controller:'registration'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'templates/profile.html',
            controller:'profile'
        })
        .state('verify', {
            url: '/verify',
            templateUrl: 'templates/verify.html',
            controller:'verify'
        })
})




.controller('login', function($scope,$http,$state,loading,user){
    
    //USER NOT LOGGED out
    if (user.getSID()){
      console.log("Session found");
      $state.go('zero');
    }

    $scope.user = {};
    //Tesing code to reduce efforts
    $scope.user.email ="kabelo@gmail.com";
    $scope.user.password = "12345";
    
    //login function
    
    $scope.login = function(){

        if ($scope.user.email && $scope.user.password){
          console.log("Credentials provided");
          
          $scope.peformLogin($scope.user)
        }
        else{
          console.log("Missing credentials");
        }
    }

    $scope.register = function(){
      console.log("user going to register state");
      $state.go('reg');
    }

    $scope.recover = function(){
         loading.alert("Error","This relies on email whic is not yet implemented");
    }

    //login http post Performer
    $scope.peformLogin = function(userData){

       loading.show('logging in..');
       console.log("PERFORMING POST LOGIN****" + user.email);
       $scope.loginURL = "http://localhost:8080/user/login"; 

       
       $scope.config = {
                        headers : {
                        'Content-Type': 'application/json;'
                        }
                       }
       $http.post($scope.loginURL, userData,$scope.config)
            .then(
                function(response){
                  console.log("SUCCESS");
                  console.log(response);

                  if (response.data.fault){
                    //AUTHENTICATION FAILURE
                      console.log(response.data.fault);
                      loading.hide();
                      loading.alert("authentication",response.data.fault);
                  }
                  else{
                      if (response.data.authenticated && response.data.sessionId){
                        //AUTHENTICATED
                        console.log("Authenticated : " + response.data.sessionId);
                        //SAVING SESSIOn ID FOR LATER USE TO GET USER VIA SESSION FOR AUTHENTICATION
                        user.setSID(response.data.sessionId);
                        console.log("SID test from service");
                        console.log(user.getSID());
                        
                        $state.go('zero');
                        loading.hide();
                      }
                  }
                  
                }, 
                function(response){
                  console.log("FAILED");

                  loading.hide();
                  loading.alert("Error","Error connecting");
                  
                  // failure callback
                }
              );
    }


})


.controller('registration', function($scope,user,$http,$state,loading){

      $scope.reg = {};
      user.setSID(null);
  
      $scope.goBack = function(){
        $state.go('login');
      }
      
      $scope.gotoVerify=  function(){
        $state.go('verify');
      }

      $scope.register =  function(){
        console.log("Registration started");
        console.log($scope.reg);
        $scope.peformRegister($scope.reg);
      }


      $scope.peformRegister = function(reg){

       console.log("PERFORMING POST REGISTRATION****" + reg.email);
       $scope.registrationURL = "http://localhost:8080/user/register"; 
       $scope.config = {
                        headers : {
                        'Content-Type': 'application/json;'
                        }
                       }
       $http.post($scope.registrationURL, reg,$scope.config)
            .then(
                function(response){
                  console.log("SUCCESS");
                  console.log(response.data);
                  
                  //Check for response fault
                  if (response.data.fault){

                      loading.alert("Error",response.data.fault); 
                  }else{
                      var regId = response.data.registration.registrationID;
                  
                      //Go To verification Screen
                      loading.alert("Registration","Congratulations!! Account created");
                      user.setRegId(regId);

                      $state.go('verify');
                  }


                  



                  
                  
                }, 
                function(response){
                  console.log("FAILED");

                  alert("Connection Error");
                  // failure callback
                }
              );
    }



})

.controller('zero', function($scope,$http,$state,user){

      $scope.profile = function(){
          console.log("User going to profile view");
          $state.go('profile');
      }

      //lOGOUT
      $scope.logout = function(){
          console.log("User login out");
          //ToDO : Delete Session Object from Local Storage then go to login page
          user.removeSID();
          //Goto Login view
          $state.go('login');
      }
})

.controller('profile', function($scope,user,$http,$state,loading){
    
    loading.show("Please wait while we load your profile");
    console.log("User now in Profile view");
    $scope.edit = false;
    $scope.user = {};

    $scope.toggleEdit =  function(){
      console.log('Toggle edit');
      $scope.edit = !$scope.edit;
    }

    $scope.updateUser = function(){
        console.log("Update Began");
        console.log(user.getSID());
        $scope.config = {headers : {'Content-Type': 'application/json;'}}
        $http.post("http://localhost:8080/user/update/"+user.getSID()+"/", $scope.user,$scope.config)
            .then(
                function(response){
                  console.log("UPDATE SUCCESS");
                  loading.hide();

                  if (response.data.fault){
                      loading.alert("error Updating",response.data.fault);
                  }else{
                      loading.alert("Update","User Profile Successfully Updated");
                      $scope.toggleEdit();
                  }
                  
                  //console.log(response);

                  
                  
                }, 
                function(response){
                  console.log("UPDATE FAILED");
                  console.log(response);
                  loading.hide()
                  alert("Connection Error");
                  // failure callback
                }
        );
    }

    
    
    user.getUser().then(
        function(d){
          console.log("Promise Fullfiled");
          $scope.user = d;
          user.setUser($scope.user)
          loading.hide();
        },
        function(d){
          loading.hide();
          console.log();
        }
        
    );
    
    console.log("User in profile");
    console.log($scope.user);
    
    

    $scope.back = function(){
      $state.go('zero');
    }
    

 
   
})


.controller('verify', function($scope,user,$http,$state,loading){

    $scope.verification = {};
    $scope.verification.otp = "";
    
    console.log("IN VERIFY ");
    console.log(user.getRegId());

    $scope.verification.regID = user.getRegId();
    

    $scope.back = function(){
      $state.go('reg');
    }

    $scope.verifyUser = function(){
        console.log("verify Began");
        console.log(user.getSID());
        $scope.config = {headers : {'Content-Type': 'application/json;'}}
        $scope.verifyURL = "http://localhost:8080/user/verify";
        $http.post($scope.verifyURL, $scope.verification,$scope.config)
            .then(
                function(response){
                  console.log("UPDATE SUCCESS");
                  console.log(response);

                  //cehck response
                  if (response.data.fault){
                      loading.alert("Error",response.data.fault);
                  }else{
                    loading.alert("Verified","Now your account is vreified and active");
                    $state.go('login');
                  }
                  
 
                }, 
                function(response){
                  console.log("UPDATE FAILED");
                  console.log(response);
                  alert("Connection Error");
                  // failure callback
                }
        );
    }      



})

