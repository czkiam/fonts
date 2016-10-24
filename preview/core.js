var app = angular.module('app', []);

app.controller('FontCtrl', function($scope, $http) {

var vm = this;

$http.get('../fonts.json')
     .then(function(res){
        vm.data = res.data.fonts;
        vm.selectedObj = vm.data[0];
        vm.dataLoaded = true;
      });
});
