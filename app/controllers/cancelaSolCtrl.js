app.controller('cancelaSolCtrl', function ($scope, loading, find, operacion){

	// limpiamos variables y muestra datos en el Grid
	$scope.inicio = function(){
		$scope.datos = {
			tipoCancel:'',
			motivoCancel:'',
			folioSust:'',
			observaciones:'',
			usuaCancela:'',
			datepicker:''
		}
		$scope.solicitudCancel();
	}

 	//*********RECIBO JSON DEL SERVICIO **********
	$scope.solicitudCancel = function(){
		loading.cargando('Cargando...');
		find.solicitud().success( function (data){
        		$scope.listado = data;
        		loading.despedida();
        		console.log(data);
		});

	}

 	//*********SE DECLARA EL GRID Y SUS COLUMNAS********
	$scope.listado = [];
	//filtros
	$scope.filterOptions = {
		filterText: '',
		useExternalFilter: false
	};

	var rowTempl = '<div ng-dblClick="editaSolicitud(row.entity)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';

	$scope.gridOptions = { 
		data: 'listado', 
		enableColumnResize:true,	
		enablePinning: true, 
		enableRowSelection:false,
		rowTemplate: rowTempl,
		selectedItems: $scope.selectos, 
		filterOptions: $scope.filterOptions,
		columnDefs: [

					{ field:'Exp_mcancelado', displayName:'Tipo de Cancelación' , width: 220, pinned:true,},
	                { field:'Exp_motCancel', displayName:'Motivo de Cancelación', width: 180, visible:true },
	                { field:'Exp_duplicado', displayName:'Folio Sustituto', width: 160 },
	                { field:'Exp_cm', displayName:'Observaciones', width: 200 },
	                { field:'Usu_registro', displayName:'Usuario que Canceló', width: 170, visible: true},
	                { field:'Exp_fcancelado', displayName:'Fecha de Solicitud', width: 208, visible: true} 
	             
				    ],

		showFooter: true,
		showFilter:false
	};	

	// *******MUESTRA LOS DATOS EN UN JSON DEL USUARIO EN EL MODAL**** 
	$scope.editaSolicitud =function(solicitud){

		console.log(solicitud);

		$('#myModalUser').modal('show');

		$scope.datos = {

			tipoCancel:solicitud.Exp_mcancelado,
			motivoCancel:solicitud.Exp_motCancel,
			folioSust:solicitud.Exp_duplicado,
			observaciones:solicitud.Exp_cm,
			usuaCancela:solicitud.Usu_registro,
			fechaini:solicitud.Exp_fcancelado
		}
	}

  //   $scope.guardaSolicitud = function (){

  //   	operacion.edicionUser($scope.datos, $scope.usuarioid).success(function (data){
		// 	console.log(data)
	 //        $scope.datos = [];

	 //        $scope.mensaje = "Edición correcta";
	 //        $scope.tipoalerta = 'alert-success';
	 //    })
	 //    .error (function (data){
	 //        $scope.mensaje = "Ocurrio un error al editar, intenta nuevamente";
	 //        $scope.tipoalerta = 'alert-warning';
	 //    });
	 // }

	$scope.limpiaDatos = function(){
    	$scope.datos = [];
		console.log($scope.datos);
    }
    
	$scope.filtra=function(){

		if($scope.login == undefined){
    		var objeto1 = "";
    		
    	}else{
    		var objeto1 = "nombre:" + $scope.login + "; ";
    	}

    	var filtro = objeto1 + $scope.busca;

    	$scope.filterOptions.filterText = filtro;
	}	

});