.factory('ImageService', function($cordovaCamera, FileService, $q, $cordovaFile) {

	function makeid() {
	    var text = '';
	    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	    for (var i = 0; i < 5; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	    }
	    return text;
	};

	function optionsForType(type) {
	    var source;
	    switch (type) {
	    case 0:
		source = Camera.PictureSourceType.CAMERA;
		break;
	    case 1:
		source = Camera.PictureSourceType.PHOTOLIBRARY;
		break;
	    }
	    return {
		destinationType: Camera.DestinationType.FILE_URI,
		sourceType: source,
		allowEdit: false,
		encodingType: Camera.EncodingType.JPEG,
		popoverOptions: CameraPopoverOptions,
		saveToPhotoAlbum: false
	    };
	}

	function saveMedia(type) {
	    return $q(function(resolve, reject) {
		var options = optionsForType(type);
		console.log('ImageService.saveMedia:', type);
		$cordovaCamera.getPicture(options).then(function(imageUrl) {
		    console.log('ImageService.saveMedia:imageUrl', imageUrl);
		    FileService.storeImage(imageUrl);
		});
	    });
	}
	return {
	    handleMediaDialog: saveMedia
	};
    })

    .factory('FileService', function() {
	var images;
	var IMAGE_STORAGE_KEY = 'images';

	function getImages() {
	    var img = window.localStorage.getItem(IMAGE_STORAGE_KEY);
	    if (img) {
		images = JSON.parse(img);
	    } else {
		images = [];
	    }
	    return images;
	};

	function addImage(img) {
	    images.push(img);
	    console.log('FileService.addImage', img);
	    console.log('FileService.addImage: images', images);
		console.log('FileService.addImage:JSON.stringify(images)', JSON.stringify(images));
	    window.localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));
	};

	return {
	    storeImage: addImage,
	    images: getImages
	};
    });
