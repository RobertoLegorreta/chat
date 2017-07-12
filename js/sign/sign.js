$(document).on('ready', function(){
	centrar();

	$(document).on('keyup',function(evento){
		if(evento.keyCode == 13){
			signInOrSignUp();
	    }
	});

	$(document).on('click', '#signUp', function(){
		signUp();
	});

	$(document).on('click', '#signIn', function(){
		signIn();
	});

	$(document).on('change', '#subirFoto input', function(){
		var input = $('#subirFoto input');

		var reader = new FileReader();
        reader.onload = function (e) {
            $('#subirFoto img').attr('src', e.target.result);
        }
        reader.readAsDataURL(input[0].files[0]);

        $('#camara').removeClass('camara');
		$('#camara').addClass('fotoSubidaInput');
	});

});

$(window).on('resize', function(){
	centrar();
});

function centrar(){
	$('#centrado').css('margin-top', $('#centrado').height()/2*-1);
}

function signUp(){
	$('#sign').attr('value','SIGN UP');

	//Crear input #nombre
	var nombre = document.createElement('input');
	nombre.setAttribute('id', 'nombre');
	nombre.setAttribute('type', 'text');
	nombre.setAttribute('placeholder', 'Nombre');
	$('#centrado').prepend(nombre);

	//Crear input file
	var subirFoto = document.createElement('figure');
	subirFoto.setAttribute('id', 'subirFoto');
	var imagen = document.createElement('img');
	imagen.setAttribute('id', 'camara');
	imagen.setAttribute('class', 'camara');
	imagen.setAttribute('src', 'objetos/sign/camara.png');
	subirFoto.appendChild(imagen);
	var input = document.createElement('input');
	input.setAttribute('type', 'file');
	subirFoto.appendChild(input);
	$('#centrado').prepend(subirFoto);



	//Cambiar texto a #anotacion
	$('#anotacion').text('Do you have an account? ');
	var span = document.createElement('span');
	span.setAttribute('id', 'signIn');
	$('#anotacion').append(span);
	var textoSpan = document.createTextNode('Sign in!');
	span.appendChild(textoSpan);

	centrar();
}

function signIn(){
	$('#sign').attr('value','SIGN IN');
	$('#nombre').remove();
	$('#subirFoto').remove();

	//Cambiar texto a #anotacion
	$('#anotacion').text("Don't have an account? ");
	var span = document.createElement('span');
	span.setAttribute('id', 'signUp');
	$('#anotacion').append(span);
	var textoSpan = document.createTextNode('Sign up!');
	span.appendChild(textoSpan);

	centrar();
}






