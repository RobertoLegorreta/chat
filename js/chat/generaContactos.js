function generaContactos(chat, extra){

	var myId = firebase.auth().currentUser.uid;
	var otroId;

	for(var objeto in chat.val().usuarios) {
	   	if(objeto != myId){
	   		otroId = objeto;
	   	}
	}

	var mensaje; 

	if(chat.val().tipo == "SOLICITUD"){
		mensaje = "Quiere conectar contigo";
	}else{
		mensaje = chat.val().ultimoMensaje.mensaje;
	}				

	var contacto = document.createElement('div');
	contacto.setAttribute('id', otroId);
	contacto.setAttribute('chat', chat.key);
	contacto.setAttribute('class', 'contacto');
	$('#misContactos').append(contacto);

	var fotoContacto = document.createElement('figure');
	fotoContacto.setAttribute('class', 'fotoContacto');
	contacto.appendChild(fotoContacto);

	var imagenFotoContacto = document.createElement('img');
	imagenFotoContacto.setAttribute('src', 'objetos/imagenPrueba/prueba.jpg'); //Sacar de la D.B.
	fotoContacto.appendChild(imagenFotoContacto);

	var informativa = document.createElement('div');
	informativa.setAttribute('class', 'informativa');
	contacto.appendChild(informativa);

	var nombreFecha = document.createElement('div');
	nombreFecha.setAttribute('class', 'nombreFecha');
	informativa.appendChild(nombreFecha);

	var nombreContacto = document.createElement('p');
	nombreContacto.setAttribute('class', 'nombreContacto');
	nombreFecha.appendChild(nombreContacto);

	firebase.database().ref('usuarios/' + otroId + '/nombre').once('value',function(nombre){
		var textoNombreContacto = document.createTextNode(nombre.val());//Sacar de la D.B.	
		nombreContacto.appendChild(textoNombreContacto);
	});

	var fechaMensaje = document.createElement('p');
	fechaMensaje.setAttribute('class', 'fechaMensaje');
	nombreFecha.appendChild(fechaMensaje);

	var textoFechaMensaje= document.createTextNode('sáb');//Sacar de la D.B.
	fechaMensaje.appendChild(textoFechaMensaje);

	var ultimoMensaje = document.createElement('p');
	ultimoMensaje.setAttribute('class', 'ultimoMensaje');
	informativa.appendChild(ultimoMensaje);

	var textoUltimoMensaje= document.createTextNode(mensaje);//Sacar de la D.B.
	ultimoMensaje.appendChild(textoUltimoMensaje);

	if(extra == true){
		contactoSeleccionado(contacto);
	}
}