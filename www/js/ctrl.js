angular.module('starter')
    .controller('ImageController', function($scope, $cordovaDevice, $cordovaFile, $ionicPlatform, $cordovaEmailComposer, $ionicActionSheet, ImageService, FileService) {

	    $ionicPlatform.ready(function() {
	    console.log('ImageController: $ionicPlatform.ready');
	    $scope.images = FileService.images();
	    $scope.$apply();
	});

	$scope.urlForImage = function(imageName) {
	    var trueOrigin = cordova.file.dataDirectory + imageName;
	    return trueOrigin;
	};

	$scope.addMedia = function() {
	    $scope.hideSheet = $ionicActionSheet.show({
		buttons: [
		    { text: 'Take photo' },
		    { text: 'Photo from library' }
		],
		titleText: 'Add images',
		cancelText: 'Cancel',
		buttonClicked: function(index) {
		    $scope.addImage(index);
		}
	    });
	};

	$scope.addImage = function(type) {
	    $scope.hideSheet();
	    console.log('controller.addImage:', type);
	    ImageService.handleMediaDialog(type).then(function() {
		$scope.$apply();
	    });
	};

	$scope.sendEmail = function() {
	    console.log('sendEmail:', $scope.images);
		console.log('sendEmail:$cordovaDevice:', $cordovaDevice);
	    console.log('sendEmail:$cordovaDevice.getPlatform():', $cordovaDevice.getPlatform());
	    if ($scope.images != null && $scope.images.length > 0) {
		var mailImages = [];
		var savedImages = $scope.images;
		if ($cordovaDevice.getPlatform() == 'Android') {
		    // Currently only working for one image..
		    var imageUrl = $scope.urlForImage(savedImages[0]);
		    var name = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
		    var namePath = imageUrl.substr(0, imageUrl.lastIndexOf('/') + 1);
		    $cordovaFile.copyFile(namePath, name, cordova.file.externalRootDirectory, name)
			.then(function(info) {
			    mailImages.push('' + cordova.file.externalRootDirectory + name);
			    $scope.openMailComposer(mailImages);
			}, function(e) {
			    reject();
			});
		} else {
		    for (var i = 0; i < savedImages.length; i++) {
			// mailImages.push('' + $scope.urlForImage(savedImages[i]));
			mailImages.push('' + savedImages[i]);
			}
		    $scope.openMailComposer(mailImages);
		}
	    }
	};

	$scope.openMailComposer = function(attachments) {
	    var bodyText = '<html><h2>My Images</h2></html>';
	    var email = {
		to: 'some@email.com',
		attachments: attachments,
		subject: 'Devdactic Images',
		body: bodyText,
		isHtml: true
	    };

		    console.log('openMailComposer: $cordovaEmailComposer', $cordovaEmailComposer);
	    $cordovaEmailComposer.open(email).then(null, function() {
		console.log('openMailComposer: before openMailComposer');
		for (var i = 0; i < attachments.length; i++) {
		    var name = attachments[i].substr(attachments[i].lastIndexOf('/') + 1);
		    // $cordovaFile.removeFile(cordova.file.externalRootDirectory, name);
		}
	    });
	};
    });
