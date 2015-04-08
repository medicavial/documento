app.factory("loading", function($rootScope){
    return{
        cargando:function(mensaje){
            $rootScope.cargando=true;
            $rootScope.loading=true;
            $rootScope.label= mensaje;
        },
        mensaje:function(mensaje){
            $rootScope.loading=false;
            $rootScope.label= mensaje;
        },
        despedida:function(){
            $rootScope.cargando=false;
        },
        error:function(mensaje){
            $rootScope.error=true;
            $rootScope.label= mensaje;
        }
    }
});

app.factory("barra", function(ngProgress){
    return{
        inicia:function(){
            ngProgress.color('#4376F2');
            ngProgress.start();
        },
        termina:function(){
            ngProgress.complete();
        }
    }
})

app.directive('fileUpload', function () {
    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var files = event.target.files;
                //iterate files since 'multiple' may be specified on the element
                for (var i = 0;i<files.length;i++) {
                    //emit event upward
                    scope.$emit("fileSelected", { file: files[i] });
                }
            });
        }
    };
});

app.directive('ngKeydown', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
             // this next line will convert the string
             // function name into an actual function
             var functionToCall = scope.$eval(attrs.ngKeydown);
             elem.on('keydown', function(e){
                  // on the keydown event, call my function
                  // and pass it the keycode of the key
                  // that was pressed
                  // ex: if ENTER was pressed, e.which == 13
                  functionToCall(e);
             });
        }
    };
});

//funcion para convertir mayusculas
app.directive('capitalize', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {

            element.bind('blur', function () {
              var inputValue = modelCtrl.$modelValue;
              if (inputValue) {
                var capitalized = inputValue.toUpperCase();
                if(capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }
              }
            });

            element.css("text-transform","uppercase");

        }
   };
   
});

app.directive('excel', function(){
    return {
        restrict: 'E',
        scope: true,
        scope: { info: '=' },
        template: '<button ng-click="click(info)" class="btn btn-success btn-lg glyphicon glyphicon-download-alt"> Exportar</button>',
        controller: function($scope, $element){

            function encode_utf8(s) {
              return unescape(encodeURIComponent(s));
            }

            function decode_utf8(s) {
              return decodeURIComponent(escape(s));
            }

            $scope.click = function(JSONData){

                var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
                var CSV = '';    
                //This condition will generate the Label/Header

                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {
                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }
                row = row.slice(0, -1);
                //append Label row with line break
                CSV += row + '\r\n';


                //1st loop is to extract each row
                for (var i = 0; i < arrData.length; i++) {
                    var row = "";
                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var index in arrData[i]) {
                        row += '"' + encode_utf8(arrData[i][index]) + '",';
                    }
                    row.slice(0, row.length - 1);
                    //add a line break after each row
                    CSV += row + '\r\n';
                }

                if (CSV == '') {        
                    alert("Invalid data");
                    return;
                }   

                //this trick will generate a temp "a" tag
                var link = document.createElement("a");    
                link.id="lnkDwnldLnk";

                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);

                var csv = CSV;  
                blob = new Blob([csv], { type: 'text/csv' }); 
                var csvUrl = window.webkitURL.createObjectURL(blob);
                var filename = 'Reporte.csv';
                $("#lnkDwnldLnk")
                .attr({
                    'download': filename,
                    'href': csvUrl
                }); 

                $('#lnkDwnldLnk')[0].click();    
                document.body.removeChild(link);

            }
        }
    }
});


app.directive('excel2', function(){
    return {
        restrict: 'E',
        scope: true,
        scope: { info: '=' },
        template: '<button ng-click="click(info)" class="btn btn-success btn-lg glyphicon glyphicon-download-alt"> Exportar</button>',
        controller: function($scope, $element){

            $scope.click = function(info){

                var arrData = typeof info != 'object' ? JSON.parse(info) : info;
                var CSV = '';
                var ReportTitle ='';
                //Set Report title in first row or line

                //CSV += ReportTitle + '\r\n\n';

                //This condition will generate the Label/Header
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {

                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }

                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '\r\n';

                //1st loop is to extract each row
                for (var i = 0; i < arrData.length; i++) {
                    var row = "";

                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }

                    row.slice(0, row.length - 1);

                    //add a line break after each row
                    CSV += row + '\r\n';
                }

                if (CSV == '') {
                    alert("Invalid data");
                    return;
                }

                //Generate a file name
                var fileName = "Reporte_";
                //this will remove the blank-spaces from the title and replace it with an underscore
                fileName += ReportTitle.replace(/ /g,"_");

                //Initialize file format you want csv or xls
                var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

                // Now the little tricky part.
                // you can use either>> window.open(uri);
                // but this will not work in some browsers
                // or you will not get the correct file extension

                //this trick will generate a temp <a /> tag
                var link = document.createElement("a");
                link.href = uri;

                //set the visibility hidden so it will not effect on your web-layout
                link.style = "visibility:hidden";
                link.download = fileName + ".CSV";

                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            }
        }
    }
});


app.directive('money', function () {

  var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

  function link(scope, el, attrs, ngModelCtrl) {
    var min = parseFloat(attrs.min || 0);
    var precision = parseFloat(attrs.precision || 2);
    var lastValidValue;

    function round(num) {
      var d = Math.pow(10, precision);
      return Math.round(num * d) / d;
    }

    function formatPrecision(value) {
      return parseFloat(value).toFixed(precision);
    }

    function formatViewValue(value) {
      return ngModelCtrl.$isEmpty(value) ? '' : '' + value;
    }


    ngModelCtrl.$parsers.push(function (value) {
      // Handle leading decimal point, like ".5"
      if (value.indexOf('.') === 0) {
        value = '0' + value;
      }

      // Allow "-" inputs only when min < 0
      if (value.indexOf('-') === 0) {
        if (min >= 0) {
          value = null;
          ngModelCtrl.$setViewValue('');
          ngModelCtrl.$render();
        } else if (value === '-') {
          value = '';
        }
      }

      var empty = ngModelCtrl.$isEmpty(value);
      if (empty || NUMBER_REGEXP.test(value)) {
        lastValidValue = (value === '')
          ? null
          : (empty ? value : parseFloat(value));
      } else {
        // Render the last valid input in the field
        ngModelCtrl.$setViewValue(formatViewValue(lastValidValue));
        ngModelCtrl.$render();
      }

      ngModelCtrl.$setValidity('number', true);
      return lastValidValue;
    });
    ngModelCtrl.$formatters.push(formatViewValue);

    var minValidator = function(value) {
      if (!ngModelCtrl.$isEmpty(value) && value < min) {
        ngModelCtrl.$setValidity('min', false);
        return undefined;
      } else {
        ngModelCtrl.$setValidity('min', true);
        return value;
      }
    };
    ngModelCtrl.$parsers.push(minValidator);
    ngModelCtrl.$formatters.push(minValidator);

    if (attrs.max) {
      var max = parseFloat(attrs.max);
      var maxValidator = function(value) {
        if (!ngModelCtrl.$isEmpty(value) && value > max) {
          ngModelCtrl.$setValidity('max', false);
          return undefined;
        } else {
          ngModelCtrl.$setValidity('max', true);
          return value;
        }
      };

      ngModelCtrl.$parsers.push(maxValidator);
      ngModelCtrl.$formatters.push(maxValidator);
    }

    // Round off
    if (precision > -1) {
      ngModelCtrl.$parsers.push(function (value) {
        return value ? round(value) : value;
      });
      ngModelCtrl.$formatters.push(function (value) {
        return value ? formatPrecision(value) : value;
      });
    }

    el.bind('blur', function () {
      var value = ngModelCtrl.$modelValue;
      if (value) {
        ngModelCtrl.$viewValue = formatPrecision(value);
        ngModelCtrl.$render();
      }
    });
  }

  return {
    restrict: 'A',
    require: 'ngModel',
    link: link
  };
});


//funcion para convertir a remesa valida con acciones que se ejecutan dando enter
//en caso de remesa solo se ocupan 5 numeros no mas
app.directive('remesa', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {

            element.on('keydown', function(evento){

                if (modelCtrl.$modelValue) {

                    var cantidad = modelCtrl.$modelValue.length;
    
                    // NO deben ser letras
                    if(cantidad < 5){
                      if (evento.keyCode >= 65 && evento.keyCode <= 90) {
                            evento.preventDefault();
                        }
                    }

                    //Si son mas de 6 digitos no escribas mas
                    if(cantidad > 5){
                      if (evento.keyCode != 8  && evento.keyCode != 46 ) {

                            evento.preventDefault();
                        }       
                    }

                    //Si se da enter o salto de linea ejecuta el autollenado de ceros
                    if (evento.keyCode == 13 || evento.keyCode == 9) {

                      if(cantidad < 5 ){

                        var faltantes = 6 - cantidad;

                        var nuevo = modelCtrl.$modelValue;

                        for (var i = 0; i < faltantes; i++) {
                          nuevo = "0" + nuevo;
                        }

                        modelCtrl.$setViewValue(nuevo);
                        modelCtrl.$render();
                        scope.$apply();
       

                      }

                    }
                    
                };
            });



      }

    };
    
});

