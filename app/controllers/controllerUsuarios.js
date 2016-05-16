app.controller('controllerUsuarios', function ($scope, loading, find){
	
	$scope.inicio = function (){

		$scope.cargaUsuarios();
	}

	$scope.cargaUsuarios = function(){

		loading.cargando('Buscando Usuarios');
		find.usuarios().success( function (data){
        		$scope.listado = data;
        		loading.despedida();
		});

	}

	$scope.listado = [];
	///filtros
	$scope.filterOptions = {
		filterText: '',
		useExternalFilter: false
	};

	var rowTempl = '<div ng-dblClick="onDblClickRow(row)" ng-style="{ \'cursor\': row.cursor   }" ng-repeat="col in renderedColumns" '+'ng-class="col.colIndex()" class="ngCell{{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height:rowHeight}" ng-class"{ngVerticalBarVisible:!$last}">$nbsp;</div><div ng-cell></div></div>';

	$scope.onDblClickRow = function(row){
	  // console.log(row.entity.Folio_Interno);
	  $location.path('/usuarios/'+row.entity.Folio_Interno+'/'+row.entity.Folio_Web );
	};

	$scope.gridOptions = { 
		data: 'listado', 
		enableColumnResize:true,	
		enablePinning: true, 
		enableRowSelection:false,
		selectedItems: $scope.selectos, 
		filterOptions: $scope.filterOptions,
		columnDefs: [

					{ field:'USU_nombre', displayName:'Nombre' , width: 120, pinned:true,},
	                { field:'USU_password', displayName:'Password', width: 120 },
	                { field:'USU_login', displayName:'Login', width: 100 },
	                { field:'USU_factivo', displayName:'UsuarioActivo', width: 120 },
	                { field:'USU_fcaptura', displayName:'Captura', width: 100 },
	                { field:'USU_fcontrolDocumentos', displayName:'ControlDocumentos', width: 120 },
	                { field:'USU_fconsultaIndividual', displayName:'ConsultaIndividual', width: 130 },
	                { field:'USU_ftickets', displayName:'Tickets', width: 100, visible:false },
	                { field:'USU_fmanual', displayName:'FlujoManual', width: 100, visible:false },
	                { field:'USU_fqualitas', displayName:'Qualitas', width: 100, visible:false },
	                { field:'USU_freportes', displayName:'Reportes', width: 100, visible:true },
	                { field:'USU_fpagos', displayName:'FlujoPagos', width: 100, visible:false },
	                { field:'USU_fdocumentos', displayName:'FlujoDocumentos', width: 100, visible:false },
	                { field:'USU_fusuarios', displayName:'Usuarios', width: 100, visible:false },
	                { field:'USU_fticketPagos', displayName:'TicketPagos', width: 100, visible:true },
	                { field:'USU_fexpress', displayName:'FacturacionExpress', width: 100, visible:true }

				    ],

		showFooter: true,
		showFilter:false
	};	

});