//Todas las consultas generadas al api por un servicio llamada find
app.factory("find", function($http){
    return{
        areaoperativa:function(){
            return $http.get('/documento/api/areas');
        },
        categorias:function(){
            return $http.get('/documento/api/categorias');
        },
        consultaFacturaQualitas:function(folio){
            return $http.get('/documento/api/facturasQualitasConsulta/' + folio);
        },
        detalleticket:function(folioint,folioweb){
            return $http.get('/documento/api/ticketinfo/' + folioint + '/' + folioweb);
        },
        empresas:function(){
            return $http.get('/documento/api/empresas');
        },
        empresasweb:function(){
            return $http.get('/documento/api/empresasweb');
        },
        escolaridad:function(){
            return $http.get('/documento/api/escolaridad');
        },
        folioweb:function(folio){
            return $http.get('/documento/api/folioweb/'+folio);
        },
        foliosxArea:function(area){
            return $http.get('/documento/api/folioactivoarea/'+area);
        },
        foliosxAreaxFecha:function(area,fechaini,fechafin){
            return $http.get('/documento/api/folioactivoareafecha/'+area+"/"+fechaini+"/"+fechafin);
        },
        listadoentrega:function(usuario){
            return $http.get('/documento/api/listaentrega/'+usuario);
        },
        listadofolio:function(folio){
            return $http.get('/documento/api/listaflujo/'+folio);
        },
        listadogeneral:function(usuario){
            return $http.get('/documento/api/listageneral/'+usuario);
        },
        listadogeneralnpc:function(usuario){
            return $http.get('/documento/api/listageneralnpc/'+usuario);
        },
        listadopagos:function(){
            return $http.get('/documento/api/listapagos');
        },
        listadorecepcion:function(usuario){
            return $http.get('/documento/api/listarecepcion/'+usuario);
        },
        listadorechazos:function(usuario){
            return $http.get('/documento/api/listarechazos/'+usuario);
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
            return $http.get('/documento/api/producto/'+empresa);
        },
        productos:function(){
            return $http.get('/documento/api/productos');
        },
        recepcionxfolio:function(folio){
            return $http.get('/documento/api/recepcionfolios/'+folio);
        },
        recepcionxlesionado:function(lesionado){
            return $http.get('/documento/api/recepcionfoliosxlesionado/'+lesionado);
        },
        referenciaxunidad:function(unidad){
            return $http.get('/documento/api/referenciaunidad/'+unidad);
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
            return $http.get('/documento/api/unidades');
        },
        unidadesweb:function(){
            return $http.get('/documento/api/unidadesweb');
        },
        usuariosarea:function(area){
            return $http.get('/documento/api/usuariosarea/'+area);
        },
        usuariosweb:function(area){
            return $http.get('/documento/api/usuariosweb');
        },
        verificaetapaentrega:function(folio,etapa){
            return $http.get('/documento/api/verificaetapaentrega/'+folio +"/"+etapa);
        },
        verificafolio:function(folio,etapa){
            return $http.get('/documento/api/verificafolio/'+folio +"/"+etapa);
        },
        verificafoliopase:function(folio){
            return $http.get('/documento/api/verificafoliopase/'+folio);
        },
        verificaprefijo:function(prefijo,empresa){
            return $http.get('/documento/api/verificaprefijo/'+prefijo +"/"+empresa);
        }
    }
})