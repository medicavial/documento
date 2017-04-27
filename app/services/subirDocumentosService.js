app.service('upload', ["$http", "$q", "api", function ($http, $q, api)
{
	this.uploadFile = function(file, unidad, fecha)
	{
		var deferred = $q.defer();
		var formData = new FormData();

		//formData.append("name", name);
		formData.append("file", file);
		return $http.post(api + "subirDocs/subirDocumentos/" + unidad + "/" + fecha, formData, {
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
