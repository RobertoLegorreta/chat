function generarMensajes(){

	var chatID = $('#mensajes').attr('class');

	var myID = firebase.auth().currentUser.uid;

	firebase.database().ref('chats/' + chatID + '/conversacion').off();

	firebase.database().ref('chats/' + chatID + '/conversacion').on('child_added', function(data){
		var mensaje = document.createElement('p');
		
		if(data.val().autor == myID){
			mensaje.setAttribute('class', 'propio');
		}else{
			mensaje.setAttribute('class', 'otro');
		}

		$('#mensajes').append(mensaje);

		var textoMensaje = document.createTextNode(data.val().mensaje); //Sacar de la D.B.
		mensaje.appendChild(textoMensaje);	

		var mensajes = document.getElementById('mensajes');
		$(mensajes).scrollTop(mensajes.scrollHeight);
	});

}