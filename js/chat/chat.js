$(document).on('ready', function(){

	signInOrSignOut();

	//Este listener se debería de ejecutar una vez que el #footer está disponible, y eliminarlo cuando no lo esté
	$(document).on('keyup', '#enviarMensaje input',function(evento){
		if (evento.keyCode == 13) {

			idChat = $('#mensajes').attr('class');
			myID = firebase.auth().currentUser.uid;

			var mensajeFooter = $(this).val();

			var nuevoMensaje = {
				mensaje : mensajeFooter,
				autor : myID, 
				timestamp : firebase.database.ServerValue.TIMESTAMP
			}
				
			firebase.database().ref('chats/' + idChat + '/conversacion').push(nuevoMensaje , function(error){
				if(error){
					alert('Lo sentimos, ha ocurrido un error');
				}else{

				}
			});

			firebase.database().ref('chats/' + idChat + '/ultimoMensaje').set(nuevoMensaje , function(error){
				if(error){
					alert('Lo sentimos, ha ocurrido un error');
				}else{

				}
			});
					
			$(this).val('');
	    }
	});

	$(document).on('click', '#nuevoContacto',function(){
		//Pone disponible #buscador
		nuevoContacto();
	});


	var haEntradoABuscador = 0;
	var usuariosDB;
	//Este listener se debería de ejecutar una vez que el #buscador está disponible, y eliminarlo cuando no lo esté
	$(document).on('keyup', '#inputBuscador', function(){
		$('#totalCoincidencias').empty();
		$('#coincidencias').text('');
		var valorUsuario = $('#inputBuscador').val();

		if(haEntradoABuscador == 0){
			firebase.database().ref('usuarios').once('value', function(data){
				if(valorUsuario != ''){//hay por lo menos algo escrito
					// var coincidencias = 0;
					usuariosDB = data.val();
					// for(usuario in data.val()){
					// 	if(data.val()[usuario].email.startsWith(valorUsuario)){
					// 		coincidencias++;
					// 		coincidencia(data.val()[usuario], usuario);
					// 	}
					// }
					// $('#coincidencias').text(coincidencias + ' coincidencias');
				}
			});	
			haEntradoABuscador++;
		}

		var coincidencias = 0;
		if(valorUsuario != ''){
			for(usuario in usuariosDB){
				if(usuariosDB[usuario].email.startsWith(valorUsuario)){
					coincidencias++;
					coincidencia(usuariosDB[usuario], usuario);
				}
			}
			$('#coincidencias').text(coincidencias + ' coincidencias');
		}
		
	});

	//Este listener se debería de ejecutar una vez que el #buscador está disponible, y eliminarlo cuando no lo esté
	$(document).on('click', '.conectar', function(){

		var idUsuario = $(this).attr('id');
		var myId = firebase.auth().currentUser.uid;

		firebase.database().ref('usuarios/' + myId + '/solicitudesMandadas/' + idUsuario).once('value', function(data){
			if(data.val() != null){
				//No se debe de mandar solicitud
				alert('No se puede mandar solicitud si ya la mandé previamente');
			}else{
				saberSiEsContacto();
			}
		});

		function saberSiEsContacto(){
			firebase.database().ref('usuarios/' + myId + '/contactos/' + idUsuario).once('value', function(data){

				if(data.val() != null){
					//No se debe de mandar solicitud
					alert('No se puede mandar solicitud a contactos');
				}else{
					saberSiMeMandoSolicitudPreviamente();
				}
				// else{
				// 	mandarSolicitud(idUsuario, myId);
				// }
			});
		} 

		function saberSiMeMandoSolicitudPreviamente(){
			firebase.database().ref('usuarios/' + idUsuario + '/solicitudesMandadas/' + myId).once('value', function(data){

				if(data.val() != null){
					//No se debe de mandar solicitud
					alert('Conectamos automáticamente ya que el me había mandado solicitud previamente');
					agregarAContactos(idUsuario);	
					$('#' + idUsuario).addClass('esContacto');
					$('#' + idUsuario).text('Es contacto');

				}else{
					mandarSolicitud(idUsuario, myId);
				}
			});
		} 
		
	});//Fin de conectar


	$(document).on('click', '#pantallaCompleta',function(event){
		regresarDeNuevoContacto();
	});

	$(document).on('click', '#buscarContacto', function(event){
		event.stopPropagation();
	});

	$(document).on('click', '.contacto', function(event){
		contactoSeleccionado($(this)[0]);
	});

	$(document).on('click', '#regresar', function(event){
		// esTablet();
		$('#mensajes').empty();
		regresar();
	});

	$(document).on('click', '#regresarNuevoContacto', function(event){
		//Elimina buscador
		regresarDeNuevoContacto();
	});

	$(document).on('click', '#configuracion', function(event){
		logOut();
	});

	$(document).on('click', '#aceptar', function(event){
		agregarAContactos($(this).attr('class'));		
	});

	$(document).on('click', '#rechazar', function(event){
		solicitudCancelada();		
	});

});

function contactoSeleccionado(contacto){
	$('.nombreContactoSeleccionado').text($(contacto).find('.nombreContacto').text());
	$('#mensajes').attr('class', $(contacto).attr('chat'));
	$('.contacto').removeClass('contactoSeleccionado');
	$(contacto).addClass('contactoSeleccionado');
	telefonoONo(contacto);
}

function mandarSolicitud(idUsuario, myId){
	//Registro la solicitud en mi cuenta
	firebase.database().ref('usuarios/' + myId + '/solicitudesMandadas/' + idUsuario).set(true, function(error){
		if(error){
			alert('Lo sentimos, ha ocurrido un error');
		}else{

		}
	});

	//Registro la solicitud en la cuenta del otro usuario
	firebase.database().ref('usuarios/' + idUsuario + '/solicitudesRecibidas/' + myId).set(true, function(error){
		if(error){
			alert('Lo sentimos, ha ocurrido un error');
		}else{

		}
	});

	//Registra nuevo chat
	var newChatKey = firebase.database().ref('chats').push().key;

	var updates = {};
	updates['/chats/' + newChatKey + '/usuarios/' + myId] = true; 
	updates['/chats/' + newChatKey + '/usuarios/' + idUsuario] = true; 
	updates['/chats/' + newChatKey + '/tipo/' ] = 'SOLICITUD'; 
	updates['/usuarios/' + myId + '/chats/' + newChatKey ] = true;
	updates['/usuarios/' + idUsuario + '/chats/' + newChatKey ] = true;


	firebase.database().ref().update(updates);

	$('#' + idUsuario).addClass('solicitado');
	$('#' + idUsuario).text('Solicitado');
}

function agregarAContactos(boton){

	var myId = firebase.auth().currentUser.uid;
	// var userID = boton.attr('class'); 
	var userID = boton;
	var chatID = $('#mensajes').attr('class');

	var updates = {};
	updates['usuarios/' + myId + '/solicitudesRecibidas/' + userID] = null;
	updates['usuarios/' + myId + '/contactos/' + userID] = true;
	updates['usuarios/' + userID + '/solicitudesMandadas/' + myId] = null;
	updates['usuarios/' + userID + '/contactos/' + myId] = true;
	updates['chats/' + chatID + '/tipo/' ] = null; 
	updates['chats/' + chatID + '/ultimoMensaje/' ] = {
		mensaje: 'Ahora están conectados'
	}; 

	firebase.database().ref().update(updates);

	esContacto();
}


function solicitudCancelada(){
	
}

function signInOrSignOut(){
	firebase.auth().onAuthStateChanged(function(user) {
	  	if (user) {
	    	// User is signed in

	    var bandera = 0;

  		firebase.database().ref('usuarios/' + firebase.auth().currentUser.uid + '/chats').on('child_added', function(data){

    		firebase.database().ref('chats/' + data.key).once('value', function(chat){
    			if(bandera == 0){
    			   	bandera++;
    				generaContactos(chat, true);
	    		}else{
	    			generaContactos(chat, false);
	    		}
    		}); 

    	});

    	// LUGAR DE PRUEBAS
    	// var bandera = 0;
    	// firebase.database().ref('chats').orderByChild('ultimoMensaje').once('value', function(chat){
    	// 	var chatKeys = (Object.keys(chat.val()));

    		// var cantidadRepeticiones;
    		// if(chatKeys.length % 2 == 1){
    		// 	cantidadRepeticiones = (chatKeys.length - 1) / 2;
    		// }else{
    		// 	cantidadRepeticiones = chatKeys.length / 2;
    		// }

    		// var temporal; 
    		// var j = 1;
    		// for(var i = 0; i < cantidadRepeticiones; i++){
    		// 	temporal = chatKeys[i];
    		// 	chatKeys[i]=chatKeys[chatKeys.length - j];
    		// 	chatKeys[chatKeys.length - j] = temporal;
    		// 	j++;
    		// }

    	// 	for(key in chatKeys){
    	// 		firebase.database().ref('chats/' + chatKeys[key]).once('value', function(snapshot){
    	// 			if(snapshot.val().ultimoMensaje == null){

    	// 			}else{
    	// 				if(bandera == 0){
					// 		generaContactos(snapshot, true);
			  //   			bandera++;
			  //   		}else{
			  //   			generaContactos(snapshot, false);
		   //  			}
    	// 			}
    	// 		});
    	// 	}
    	// });

    	// LUGAR DE PRUEBAS

	    } else {
	    	// No user is signed in.
			location.href = "signup.html";
	  	}
	});
}

function logOut(){
	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	  location.href = "signup.html"

	}, function(error) {
		alert('Ocurrió un error al cerrar la sesión');
	  // An error happened.
	});	
}

function regresarDeNuevoContacto(){
	$('#pantallaCompleta').remove();
}

function regresar(){
	$('#flotanteDerecho').css('display', 'none');
	$('#flotanteIzquierdo').css('display', 'flex');
	$('#flotanteIzquierdo').css('display', 'flex');
	$('#flotanteIzquierdo').css('display', '-webkit-flex');
	$('#flotanteIzquierdo').css('display', '-moz-flex');
	$('#flotanteIzquierdo').css('flex-direction', 'column');
	$('#flotanteIzquierdo').css('flex-wrap', 'nowrap');
	$('#flotanteIzquierdo').css('align-items', 'center');
	$('#flotanteIzquierdo').css('justify-content', 'space-between');
}

function telefonoONo(div){
	if($('#flotanteDerecho').css('display') == 'none'){
		//Determina que estamos en un teléfono
		$('#flotanteIzquierdo').css('display', 'none');
		$('#flotanteDerecho').css('display', 'flex');
		$('#flotanteDerecho').css('display', '-webkit-flex');
		$('#flotanteDerecho').css('display', '-moz-flex');
		$('#flotanteDerecho').css('flex-direction', 'column');
		$('#flotanteDerecho').css('flex-wrap', 'nowrap');
		$('#flotanteDerecho').css('align-items', 'center');
		$('#flotanteDerecho').css('justify-content', 'space-between');
		$('#regresar').css('display', 'block');
		$('#blanco').css('display', 'block');
	}

	contactoNoContacto(div);
}

function esContacto(){
	$('#mensajes').empty();
	if(!$('#enviarMensaje').length){
		var footer = document.createElement('footer');
		footer.setAttribute('id', 'enviarMensaje');
		$('#flotanteDerecho').append(footer);

		var input = document.createElement('input');
		input.setAttribute('type', 'text');
		input.setAttribute('placeholder', 'Escribe un mensaje...');
		footer.appendChild(input);
	}
	generarMensajes();
}//Fin de esContacto()

function noEsContacto(div){
	$('#mensajes').empty();

	var userID = $(div).attr('id');
	var myId = firebase.auth().currentUser.uid;

	firebase.database().ref('usuarios/' + myId + '/solicitudesMandadas').once('value', function(data){

		if(data.val() != null){
			var bandera = 0;
			for(var key in data.val()){
				if(key == userID){
					mensajeSolicitudMandada(userID);
					bandera = 1;
				}
			}
			if(bandera == 0){
				mensajeSolicitudRecibida(userID);
			}
		}else{
			mensajeSolicitudRecibida(userID);
		}		

	});
}//Fin de noEsContacto()

function contactoNoContacto(div){

	var userID = $(div).attr('id');
	var myId = firebase.auth().currentUser.uid;
	var bandera = 0; 

	firebase.database().ref('usuarios/' + myId + '/contactos').once('value', function(data){
		if(data.val() != null){
			for(var id in data.val()){
			   	if(id == userID){
			   		esContacto();
			   		bandera = 1;
			   	}
			}
			if(bandera == 0){
				noEsContacto(div);
			}
		}else{
			noEsContacto(div);
		}
	});
}//Fin de contactoNoContacto()

function mensajeSolicitudMandada(userID){
	var label = document.createElement('p');
	label.setAttribute('id', 'labelConectar');
	$('#mensajes').append(label);

	var nombre;
	var correo;

	firebase.database().ref('usuarios/' + userID + '/nombre').once('value',function(nombreDB){
		nombre = nombreDB.val();
		obtenerCorreo();
	});

	function obtenerCorreo(){
		firebase.database().ref('usuarios/' + userID + '/email').once('value',function(correoDB){
			correo = correoDB.val();
			establecerTexto();
		});
	}

	function establecerTexto(){
		var textoLabel = document.createTextNode('Tu solicitud para conectar con ' + nombre +' (' + correo + ') ha sido mandada de manera exitosa.'); //Sacar valor de la D.B.
		label.appendChild(textoLabel);
	}

	var englobaBotonera = document.createElement('div');
	englobaBotonera.setAttribute('id', 'englobaBotonera');
	$('#mensajes').append(englobaBotonera);

	var cancelar = document.createElement('p');
	cancelar.setAttribute('id', 'cancelar');
	englobaBotonera.appendChild(cancelar);
	var textoCancelar = document.createTextNode('Cancelar solicitud');
	cancelar.appendChild(textoCancelar);


	if($('#enviarMensaje').length){
		$('#enviarMensaje').remove();
	}
}

function mensajeSolicitudRecibida(userID){

	var nombre;
	var correo;

	var labelConectar = document.createElement('p');
	labelConectar.setAttribute('id', 'labelConectar');
	$('#mensajes').append(labelConectar);

	firebase.database().ref('usuarios/' + userID + '/nombre').once('value',function(nombreDB){
		nombre = nombreDB.val();
		obtenerCorreo();
	});

	function obtenerCorreo(){
		firebase.database().ref('usuarios/' + userID + '/email').once('value',function(correoDB){
			correo = correoDB.val();
			establecerTexto();
		});
	}

	function establecerTexto(){
		var textoLabel = document.createTextNode(nombre + ' (' + correo + ') quiere conectar contigo.'); //Sacar valor de la D.B.
		labelConectar.appendChild(textoLabel);
	}

	var englobaBotonera = document.createElement('div');
	englobaBotonera.setAttribute('id', 'englobaBotonera');
	$('#mensajes').append(englobaBotonera);

	var aceptar = document.createElement('p');
	aceptar.setAttribute('class', userID);
	aceptar.setAttribute('id', 'aceptar');
	englobaBotonera.appendChild(aceptar);
	var textoAceptar = document.createTextNode('Conectar');
	aceptar.appendChild(textoAceptar);

	var rechazar = document.createElement('p');
	rechazar.setAttribute('id', 'rechazar');
	englobaBotonera.appendChild(rechazar);
	var textoRechazar = document.createTextNode('Rechazar');
	rechazar.appendChild(textoRechazar);


	if($('#enviarMensaje').length){
		$('#enviarMensaje').remove();
	}
}








