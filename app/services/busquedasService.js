//Todas las consultas generadas al api por un servicio llamada find
app.factory("find", function($http,api){
    return{
        areaoperativa:function(){
            return $http.get(api+'consulta/areas');
        },
        categorias:function(){
            return $http.get(api+'tickets/categorias');
        },
        categoriaspagos:function(){
            return $http.get(api+'tickets/pagos/categorias');
        },
        consultaFlujo:function(usuario){
            return $http.get(api+'flujo/consulta/' + usuario);
        },
        consultaFacturaQualitas:function(folio){
            return $http.get(api+'qualitas/consulta/' + folio);
        },
        detalleticket:function(folioint,folioweb){
            return $http.get( api + 'tickets/detalle/' + folioint + '/' + folioweb);
        },
        detalleticketpagos:function(folioint,folioweb){
            return $http.get( api + 'tickets/pagos/detalle/' + folioint + '/' + folioweb);
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
        // foliosxArea:function(area){
        //     return $http.get('/documento/api/folioactivoarea/'+area);
        // },
        // foliosxAreaxFecha:function(area,fechaini,fechafin){
        //     return $http.get('/documento/api/folioactivoareafecha/'+area+"/"+fechaini+"/"+fechafin);
        // },
        listadoentrega:function(usuario){
            return $http.get(api+'flujo/entregas/'+usuario);
        },
        listadoentregaarea:function(area){
            return $http.get(api+'flujo/entregasarea/'+area);
        },
        listadofolio:function(folio){
            return $http.get(api + 'consulta/flujo/'+folio);
        },
        // listadogeneral:function(usuario){
        //     return $http.get('/documento/api/listageneral/'+usuario);
        // },
        listadogeneralnpc:function(usuario){
            return $http.get(api+'flujo/npc/'+usuario);
        },
        listadopagos:function(){
            return $http.get(api+'/flujopagos/general');
        },
        listadorecepcion:function(usuario){
            return $http.get(api+'flujo/recepcion/'+usuario);
        },
        listadorecepcionarea:function(area){
            return $http.get(api+'flujo/recepcionarea/'+area);
        },
        listadorechazos:function(usuario){
            return $http.get(api+'flujo/rechazos/'+usuario);
        },
        listadorechazosarea:function(area){
            return $http.get(api+'flujo/rechazosarea/'+area);
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
        statuspagos:function(){
            return $http.get(api + 'tickets/pagos/status');
        },
        statusweb:function(){
            return $http.get(api + 'tickets/status');
        },
        subcategorias:function(categoria){
            return $http.get(api +'tickets/subcategorias/'+categoria);
        },
        subcategoriaspagos:function(categoria){
            return $http.get(api +'tickets/pagos/subcategorias/'+categoria);
        },
        ultimoticket:function(){
            return $http.get(api +'tickets/maximo');
        },
        unidades:function(){
            return $http.get(api+'consulta/unidades');
        },
        unidadesweb:function(){
            return $http.get(api+'consulta/unidadesweb',{timeout: 10000});
        },
        usuariosarea:function(area){
            return $http.get(api+'consulta/usuarios/'+area);
        },
        usuariosareatodos:function(area){
            return $http.get(api+'consulta/usuariostodos/'+area);
        },
        usuariosweb:function(){
            return $http.get(api +'consulta/usuariosweb',{timeout: 10000});
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
            return $http.post(api + 'tickets/consulta',datos,{timeout: 10000});
        },
        ticketsxfolio:function(folio){
            return $http.get(api + 'tickets/folio/'+ folio,{timeout: 10000});
        },
        ticketsxfoliointerno:function(folio){
            return $http.get(api + 'tickets/foliointerno/'+ folio,{timeout: 10000});
        },
        ticketspagosxfecha:function(datos){
            return $http.post(api + 'tickets/pagos/consulta',datos);
        },
        ticketspagosxfolio:function(folio){
            return $http.get(api + 'tickets/pagos/folio/'+ folio);
        },
        ticketspagosxfoliointerno:function(folio){
            return $http.get(api + 'tickets/pagos/foliointerno/'+ folio);
        }
    }
})