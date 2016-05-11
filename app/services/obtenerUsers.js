app.factory("obtener",function($http){
    return{
        obtenUsers:function(){
            return $http.get('http://172.17.10.15/apimv/public/api/consulta/suarios');
        }
    }
})