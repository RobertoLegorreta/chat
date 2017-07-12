function nuevoContacto(){

	var pantallaCompleta = document.createElement('div');
	pantallaCompleta.setAttribute('id', 'pantallaCompleta');
	$('body').prepend(pantallaCompleta);

	var buscarContacto = document.createElement('div');
	buscarContacto.setAttribute('id', 'buscarContacto');
	pantallaCompleta.appendChild(buscarContacto); 

	var encabezadoTitulo = document.createElement('div');
	encabezadoTitulo.setAttribute('id', 'encabezadoTitulo');
	buscarContacto.appendChild(encabezadoTitulo);

	var regresar = document.createElement('figure');
	regresar.setAttribute('id', 'regresarNuevoContacto');
	encabezadoTitulo.appendChild(regresar);
	var imagenRegresar = document.createElement('img');
	imagenRegresar.setAttribute('src', 'objetos/chat/back.png'); 
	regresar.appendChild(imagenRegresar);

	var tituloVentanaNuevoContacto = document.createElement('p');
	tituloVentanaNuevoContacto.setAttribute('id', 'tituloVentanaNuevoContacto');
	encabezadoTitulo.appendChild(tituloVentanaNuevoContacto);

	var textoTituloVentana = document.createTextNode('Add new contact');
	tituloVentanaNuevoContacto.appendChild(textoTituloVentana);

	var blanco = document.createElement('div');
	blanco.setAttribute('id', 'blancoNuevoContacto');

	var buscadorConCoincidencias = document.createElement('div');
	buscadorConCoincidencias.setAttribute('id', 'buscadorConCoincidencias');
	buscarContacto.appendChild(buscadorConCoincidencias);

	var inputBuscador = document.createElement('input');
	buscadorConCoincidencias.appendChild(inputBuscador);
	inputBuscador.setAttribute('id', 'inputBuscador');
	inputBuscador.setAttribute('type', 'email');
	inputBuscador.setAttribute('placeholder', 'Find by email');

	var coincidencias = document.createElement('p');
	buscadorConCoincidencias.appendChild(coincidencias);
	coincidencias.setAttribute('id', 'coincidencias');
	var textoCoincidencias = document.createTextNode('');
	coincidencias.appendChild(textoCoincidencias);

	var totalCoincidencias = document.createElement('div');
	totalCoincidencias.setAttribute('id', 'totalCoincidencias');
	buscarContacto.appendChild(totalCoincidencias);
}

function coincidencia(data, key){

	var coincidencia = document.createElement('div');
	totalCoincidencias.appendChild(coincidencia);
	coincidencia.setAttribute('class', 'coincidencia');
	
	var fotoCoincidencia = document.createElement('figure');
	fotoCoincidencia.setAttribute('class', 'fotoCoincidencia');
	coincidencia.appendChild(fotoCoincidencia);
	var imagenCoincidencia = document.createElement('img');
	imagenCoincidencia.setAttribute('src', 'objetos/imagenPrueba/prueba.jpg'); // Sacar imagen de la D.B.
	fotoCoincidencia.appendChild(imagenCoincidencia);

	var informacionCoincidencia = document.createElement('div');
	informacionCoincidencia.setAttribute('class', 'informacionCoincidencia');
	coincidencia.appendChild(informacionCoincidencia);

	var nombreCoincidencia = document.createElement('p');
	nombreCoincidencia.setAttribute('class', 'nombreCoincidencia');
	informacionCoincidencia.appendChild(nombreCoincidencia);
	var textoNombreCoincidencia = document.createTextNode(data.nombre);//Sacar de la D.B.
	nombreCoincidencia.appendChild(textoNombreCoincidencia);

	var emailCoincidencia = document.createElement('p');
	emailCoincidencia.setAttribute('class', 'emailCoincidencia');
	informacionCoincidencia.appendChild(emailCoincidencia);
	var textoEmailCoincidencia = document.createTextNode(data.email);//Sacar de la D.B.
	emailCoincidencia.appendChild(textoEmailCoincidencia);
	

	if(key != firebase.auth().currentUser.uid){
		var conectar = document.createElement('p');
		conectar.setAttribute('id', key);
		conectar.setAttribute('class', 'conectar');
		var textoConectar = document.createTextNode('');
		conectar.appendChild(textoConectar);

		firebase.database().ref('usuarios/' + firebase.auth().currentUser.uid + '/solicitudesMandadas/' + key).once('value', function(snapshot){

			if(snapshot.val() == true){
				$(conectar).addClass('solicitado');
				$(conectar).text('Solicitado');
			}else{
				$(conectar).text('Conectar');
			}

			coincidencia.appendChild(conectar);

		}); 

		firebase.database().ref('usuarios/' + firebase.auth().currentUser.uid + '/contactos/' + key).once('value', function(snapshot){
			if(snapshot.val() == true){
				$(conectar).addClass('esContacto');
				$(conectar).text('Es contacto');
			}else{
				$(conectar).text('Conectar');
			}
		});

	}

	
	

}







