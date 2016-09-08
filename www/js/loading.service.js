angular.module('loading.service', [])


.factory('loading', function($ionicLoading,$ionicPopup) {
  
  

  return {
    show: function(message) {

        $ionicLoading.show({
          template: message
        }).then(function(){
          console.log("The loading indicator is now displayed");
        });
        
      
    },
    
    hide: function(){
       $ionicLoading.hide().then(function(){
        console.log("The loading indicator is now hidden");
       });
    }
    , alert: function(title,message){
       
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message
        });

        alertPopup.then(function(res) {
            console.log('ALERT DISMISED');
        });
        
    }


  };

});