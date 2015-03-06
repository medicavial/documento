$(document).on('ready',inicio);

function inicio(){

	$('#rb-grid li').on('click',cambiarFondo);

}

function cambiarFondo(datos){

	alert('entro Wiii');
	$('body').css({ 'background-color':'black' });

}

