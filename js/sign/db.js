$(document).on('ready', function(){

	$(document).on('click', '#sign', function(){
		signInOrSignUp();
	});

});

function signInOrSignUp(){

	if($('#nombre').length){

		if(validarSignUp()){
			//Estamos en registro
			var emailDeRegistro = $('#email').val();
			var passwordDeRegistro = $('#password').val();
			var nombreDeRegistro = $('#nombre').val();
			var foto = $('#subirFoto input');


			firebase.auth().createUserWithEmailAndPassword(emailDeRegistro, passwordDeRegistro).then(function(user){
				// Usuario registrado y logeado con firebase.auth();
				firebase.database().ref('usuarios/' + firebase.auth().currentUser.uid).set({nombre: nombreDeRegistro, email: emailDeRegistro}, function(error){
					if(error){
						console.log('Ups, tuvimos un problema, estamos trabajando para resolverlo');
					}else{
						//Usuario registrado con éxito en firebase.database();
						console.log('Usuario registrado con éxico');

						if(foto[0].files[0] != undefined){//Bloque que ejecuta la subida del archivo
							var uploadTask = firebase.storage().ref(firebase.auth().currentUser.uid + '/foto-normal').put(foto[0].files[0]);

							//Observamos la subida
							uploadTask.on('state_changed', function(snapshot){

							}, function(error) {
								console.log(error);
							}, function(){
								console.log('Imagen de perfil subida con éxito');
								var downloadURL = uploadTask.snapshot.downloadURL;

								firebase.database().ref().child('usuarios/' + firebase.auth().currentUser.uid).update({
									fotoPerfilURL: downloadURL
								}, function(error){
									if(error){

									}else{
										console.log('Subida de foto de perfil exitosa');
										location.href = "index.html";
									}
								});

							});
						}else{//Se ejecuta solo cuando no subimos foto de perfil
							location.href = "index.html";
						}
						
					}//Fin del else que se ejecuta cuando un usuario se registró con éxito en firebase.database();
				});

				}).catch(function(error) {
				    var errorCode = error.code;
				    var errorMessage = error.message;

				    console.log(error);
			});
		}//Bloque de código que se ejecuta si la validación fue correcta
	}else{//Bloque de código que se ejecuta si estamos en Sign In
		var email = $('#email').val();
		var password = $('#password').val();	

		if(validarSignIn()){
			firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
				//Inicio de sesión correcto

				location.href = "index.html"

			}).catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  // ...
			});
		}

	}//Fin de bloque de código Sign in
}//Fin de función signInOrSignUp()


function validarSignIn(){
	var email;
	if(validarEmail()){
		email = true;
	}else{
		email = false;
		alert('El email no es valido');//Cambiar por notificación
	}

	var pass;
	if($('#password').val().length >= 6){
		pass = true;
	}else{
		pass = false;
		alert('Password muy débil, mínimo 6 caracteres');//Cambiar por notificación
	}

	if(email && pass){
		return true;
	}
}

function validarSignUp(){
	var nombre;
	if($('#nombre').val() != ''){
		nombre = true;
	}else{
		nombre = false;
		alert('El nombre es obligatorio');//Cambiar por notificación
	}

	var email;
	if(validarEmail()){
		email = true;
	}else{
		email = false;
		alert('El email no es valido');//Cambiar por notificación
	}

	var pass;
	if($('#password').val().length >= 6){
		pass = true;
	}else{
		pass = false;
		alert('Password muy débil, mínimo 6 caracteres');//Cambiar por notificación
	}

	if(nombre && email && pass){
		return true;
	}
}

function validarEmail() {
  	var email = $("#email").val();
  	if (codigoValidador(email)) {
    	return true;
  	} else {
    	return false;
  	}		
}

function codigoValidador(email) {
  	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  	return re.test(email);
}



