//Todas las consultas generadas al api por un servicio llamada find
app.factory("find", function($http,api){
    return{
        areaoperativa:function(){
            return $http.get(api+'consulta/areas');
        },
        categorias:function(){
            return $http.get('/documento/api/categorias');
        },
        consultaFacturaQualitas:function(folio){
            return $http.get(api+'qualitas/consulta/' + folio);
        },
        detalleticket:function(folioint,folioweb){
            return $http.get('/documento/api/ticketinfo/' + folioint + '/' + folioweb);
        },
        empresas:function(){
            return $http.get(api+'consulta/empresas');
        },
        empresasweb:function(){
            return $http.get('/documento/api/empresasweb');
        },
        escolaridad:function(){
            return $http.get(api+'consulta/escolaridad');
        },
        folioweb:function(folio){
            return $http.get(api+'consulta/folioweb/'+folio);
        },
        foliosxArea:function(area){
            return $http.get('/documento/api/folioactivoarea/'+area);
        },
        foliosxAreaxFecha:function(area,fechaini,fechafin){
            return $http.get('/documento/api/folioactivoareafecha/'+area+"/"+fechaini+"/"+fechafin);
        },
        listadoentrega:function(usuario){
            return $http.get(api+'flujo/entregas/'+usuario);
        },
        listadofolio:function(folio){
            return $http.get('/documento/api/listaflujo/'+folio);
        },
        listadogeneral:function(usuario){
            return $http.get('/documento/api/listageneral/'+usuario);
        },
        listadogeneralnpc:function(usuario){
            return $http.get(api+'flujo/npc/'+usuario);
        },
        listadopagos:function(){
            return $http.get(api+'/flujopagos/general');
        },
        listadorecepcion:function(usuario){
            return $http.get(api+'flujo/recepcion/'+usuario);
        },
        listadorechazos:function(usuario){
            return $http.get(api+'flujo/rechazos/'+usuario);
        },
        listatickets:function(interno){
            return $http.get('/documento/api/listatickets/'+interno);
        },
        listaticketsfolio:function(folio){
            return $http.get('/documento/api/listaticketsfolio/'+folio);
        },
        muestrahistorico:function(folio,etapa,entrega){
            return $http.get('/documento/api/muestrahistorico/'+folio +"/"+etapa+"/"+entrega);
        },
        producto:function(empresa){
            return $http.get(api +'consulta/productos/'+ empresa);
        },
        productos:function(){
            return $http.get(api+'consulta/productos');
        },
        recepcionxfolio:function(folio){
            return $http.get('/documento/api/recepcionfolios/'+folio);
        },
        recepcionxlesionado:function(lesionado){
            return $http.get('/documento/api/recepcionfoliosxlesionado/'+lesionado);
        },
        referenciaxunidad:function(unidad){
            return $http.get(api + 'consulta/referencia/'+ unidad);
        },
        statusweb:function(){
            return $http.get('/documento/api/statusweb');
        },
        subcategorias:function(categoria){
            return $http.get('/documento/api/subcategorias/'+categoria);
        },
        ultimoticket:function(){
            return $http.get('/documento/api/ticket');
        },
        unidades:function(){
            return $http.get(api+'consulta/unidades');
        },
        unidadesweb:function(){
            return $http.get('/documento/api/unidadesweb');
        },
        usuariosarea:function(area){
            return $http.get(api+'consulta/usuarios/'+area);
        },
        usuariosweb:function(area){
            return $http.get('/documento/api/usuariosweb');
        },
        verificaetapaentrega:function(folio,etapa){
            return $http.get(api+'consulta/verificaetapaentrega/'+folio +"/"+etapa);
        },
        verificafolio:function(folio,etapa){
            return $http.get(api+'consulta/verificafolio/'+ folio + '/'+ etapa);
        },
        verificafoliopase:function(folio){
            return $http.get(api+'consulta/verificafoliopase/'+folio);
        },
        verificaprefijo:function(prefijo,empresa){
            return $http.get(api + 'consulta/verificaprefijo/'+prefijo +"/"+empresa);
        }
    }
})