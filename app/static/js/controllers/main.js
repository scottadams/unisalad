'use strict';

angular.module('unisalad')
  .controller('MainCtrl', ['$scope', 'localStorageService', '$location', '$http', function ($scope, localStorageService, $location, $http) {
    var init = function () {
      $scope.pageClass = 'page-main';
      var viewHeight = $(window).height();
      var cardHeight = $('#signupContainer').height();
      $('#signupContainer').css('margin-top', Math.max(0, Math.floor((viewHeight-cardHeight)/2))-64);

      $('#emailSent').css({'top': viewHeight, 'min-height': cardHeight})
    }


    var universitySelected = false;
    var correctEmailSent = false;
    $scope.email = "";
    $scope.domain = "";

  	$scope.uniSelected = function () {
      localStorageService.set('uni', $scope.university);
      $scope.domain = '@' + $scope.university.toString() + '.ac.uk'
      universitySelected = true;
  	}

    $scope.focusOnEmail = function() {
      $('#emailField').focus();
    }

    $scope.moveToEmailField = function () {
      if (universitySelected && $scope.email == "") {
        $scope.focusOnEmail();
      }
    }

  	$scope.signUp = function() {
      if (universitySelected && $scope.email != "") {
        var userDetails = {
          username: $scope.email,
          fullName:'',
          email: $scope.email + $scope.domain,
          password:'',
          phoneNumber:''
        }

        $http({
          method: 'POST',
          data: JSON.stringify(userDetails),
          url: 'http://127.0.0.1:5000/user/create'
        }).then(function successCallback(response) {
            console.log("HTTP: user created successfully");
            console.log(response)
            toggleEmailSentConfirmation();
            correctEmailSent = true;
        }, function errorCallback(response) {
            alert("HTTP: Error creating user")
            console.log("response:\n" + JSON.stringify(response))
        });  
      } else if (universitySelected) {
        alert("Please enter your university email")
      } else {
        alert("Please select a university")
      }
  	}

    $scope.reEnterEmail = function () {
      toggleEmailSentConfirmation();
      $scope.email = "";
      $scope.focusOnEmail();
      correctEmailSent = false;
    }

    var loadUniversities = function () {
      $http({
        method: 'GET',
        url: 'http://127.0.0.1:5000/universities'
      }).then(function successCallback(response) {
          console.log("HTTP: universities loaded successfully");
          $scope.universities = response.data;
      }, function errorCallback(response) {
          alert("HTTP: Error loading universities")
          console.log("response:\n" + JSON.stringify(response))
      });
    }

    var toggleEmailSentConfirmation = function () {
      $('#emailSent').toggleClass('showConfirmation');
      if (!correctEmailSent) {
        var translation = 'translateY(-' +  ($('#emailSent').position().top - $('#signupContainer').position().top - 20).toString() + 'px)';
        $('#emailSent').css('transform', translation);
      } else {
        $('#emailSent').css('transform', '')
      }
    }

    init();
    loadUniversities();
  }]);