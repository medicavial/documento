app.service('upload', ["$http", "$q", "api", function ($http, $q, api)
{
	this.uploadFile = function(files, unidad, fecha)
	{
		var deferred = $q.defer();
		var formData = new FormData();
		
		formData.append("file", angular.toJson(files));		
		for (var i = 0; i < files.length; i++) {
            //add each file to the form data and iteratively name them
            console.log(files[i]);
            formData.append("file"+i, files[i]);	
        }		
        console.log(formData);
		return $http.post(api + "subirDocs/subirDocumentosPrueba/" + unidad + "/" + fecha, formData, {
			headers: {
				"Content-type": undefined
			},
			transformRequest: angular.identity
		})
		.success(function(res)
		{
			deferred.resolve(res);
		})
		.error(function(msg, code)
		{
			deferred.reject(msg);
		})
		return deferred.promise;
	}
}])
