import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

//FIREEBASE
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase/config.js';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";

import { app, auth } from '../../firebase/config.js';


export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
 

  const db = getFirestore(app);

  //Acceder a la bd y a traves de email, obtener datos de usuario
  const getUserData = async (email) => {
    const users = collection(db, 'Users');
    const q = query(users, where('email', '==', {email}))
    
    //Obtenemos los datos
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      //extraemos el nombre de la bd y lo pasamos como return
      const name = data.Nombre.nombre
      setName(data.Nombre.nombre);
      
    });
    return name;  
  }
  
  const onFooterLinkPress = () => {
    navigation.navigate('Registration')
  }

  const OnGasInfoPress = () => {
    navigation.navigate('GasInfoScreen')
  };

  //para evitar errores convertimos el email a minusculas y eliminamos espacios en blanco.
  const formatEmail = (email) => {
    const emailFormatted = email.trim().toLowerCase();
    
    setEmail(emailFormatted);    
  };
  
  //FUNCION BOTON LOGIN
  const onLoginPress = () => {
    signInWithEmailAndPassword(auth, email, password, name)
    .then(() => {      
      
      //extraemos el nombre de la bd y lo pasamos como parametro a navigation
      navigation.navigate('Home', {email: email}, {nombre: name});          
      })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      
      Alert.alert("Error", "Usuario o contraseña incorrectos")
    })
  };

  //FUNCION BOTON RESET PASSWORD, solicita a firebase que envie el correo de reset de contrasenya
  const onResetPasswordPress = async () => {
    try{
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Email de reset enviado, por favor revise su correo", "Email enviado")
    } catch (e){
     
      Alert.alert("Error", "No se ha podido enviar el email de reset, porfavor revise su direccin de email")
    }      
  };
  
  //RENDERIZADO DE LA PANTALLA
  /* TouchableWithoutFeedback para cerrar el teclado al pulsar fuera de el*/
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={{ flex: 1, width: '100%' }}
          keyboardShouldPersistTaps="always">
          <Image
            style={styles.logo}
            source={require('../../../assets/logo.png')}
          />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#aaa"
            onChangeText={(text) => formatEmail(text)}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaa"
            secureTextEntry
            placeholder="Password"
            onChangeText={(text) => setPassword(text.trim())}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => onLoginPress()}>
            <Text style={styles.buttonTitle}>Iniciar sesion</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.button}
            onPress={() => OnGasInfoPress()}>
            <Text style={styles.buttonTitle}>Informacion sobre gasolinieras</Text>
          </TouchableOpacity>

          <View style={styles.footerView}>
            <Text style={styles.footerText}>No tienes cuenta? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Registrate</Text></Text>
            <Text style={styles.footerText}>No recuerdas la contraseña? <Text onPress = {onResetPasswordPress} style={styles.footerLinkPsw}>Click aqui</Text></Text>
          </View>
        </KeyboardAwareScrollView>     
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
  
  },
  logo: {
    height: 100,
    width: 400,
    alignSelf: "center",
    margin: 30,
    padding: 30,
    marginVertical: 100,
  },
  input: {
    flex: 1,
    height: 48,
    width: 350,
    borderRadius: 5,
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: '#F4F4F4',
    borderWidth: 1,
    borderColor: "#6495ED",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 16
  },
  button: {
    backgroundColor: '#6495ED',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20
  },

  footerText: {
    fontSize: 16,
    color: '#2e2e2d'
  },

  footerLink: {
    color: '#6495ED',
    fontWeight: 'bold',
    fontSize: 16,
  },

  footerLinkPsw: {
    color: 'darkred',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
});

