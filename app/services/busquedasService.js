//Todas las consultas generadas al api por un servicio llamada find
app.factory("find", function($http,api){
    return{
        areaoperativa:function(){
            return $http.get(api+'consulta/areas');
        },
        categorias:function(){
            return $http.get(api+'tickets/categorias');
        },
        consultaFacturaQualitas:function(folio){
            return $http.get(api+'qualitas/consulta/' + folio);
        },
        detalleticket:function(folioint,folioweb){
            return $http.get( api + 'tickets/detalle/' + folioint + '/' + folioweb);
        },
        empresas:function(){
            return $http.get(api+'consulta/empresas');
        },
        empresasweb:function(){
            return $http.get(api + 'consulta/empresasweb');
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
            return $http.get(api + 'consulta/flujo/'+folio);
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
        muestrahistorico:function(folio,etapa,entrega){
            return $http.get(api + 'consulta/historial/'+folio +"/"+etapa+"/"+entrega);
        },
        producto:function(empresa){
            return $http.get(api +'consulta/productos/'+ empresa);
        },
        productos:function(){
            return $http.get(api+'consulta/productos');
        },
        recepcionxfolio:function(folio){
            return $http.get(api + 'consulta/folio/'+folio);
        },
        recepcionxlesionado:function(lesionado){
            return $http.get(api+'consulta/lesionado/'+lesionado);
        },
        referenciaxunidad:function(unidad){
            return $http.get(api + 'consulta/referencia/'+ unidad);
        },
        statusweb:function(){
            return $http.get('/documento/api/statusweb');
        },
        subcategorias:function(categoria){
            return $http.get(api +'tickets/subcategorias/'+categoria);
        },
        ultimoticket:function(){
            return $http.get(api +'tickets/maximo');
        },
        unidades:function(){
            return $http.get(api+'consulta/unidades');
        },
        unidadesweb:function(){
            return $http.get(api+'consulta/unidadesweb');
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
            return $http.get(api + 'consulta/verificaprefijo/'+prefijo +'/'+empresa);
        },
        listaPagosRecepcion:function(datos){
            return $http.post(api + 'flujopagos/fecharecepcion',datos);
        },
        listaPagos:function(datos){
            return $http.post(api + 'flujopagos/fechapagos',datos);
        },
        reporteTickets:function(){
            return $http.get(api + 'reportes/tickets');
        },
        reporteTicketsDia:function(){
            return $http.get(api + 'reportes/ticketsdia');
        },
        reporteTicketsDiaEspecifico:function(fecha){
            return $http.post(api + 'reportes/ticketsdia',{fecha:fecha});
        },
        ticketsxfecha:function(datos){
            return $http.post(api + 'tickets/consulta',datos);
        },
        ticketsxfolio:function(folio){
            return $http.get(api + 'tickets/folio/'+ folio);
        },
        ticketsxfoliointerno:function(folio){
            return $http.get(api + 'tickets/foliointerno/'+ folio);
        }
    }
})