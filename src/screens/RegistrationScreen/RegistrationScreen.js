import { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

//FIREBASE  
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase/config.js';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';


//import { firebase } from '../../firebase/config.js'


export default function RegistrationScreen({ navigation }) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [poblacion, setPoblacion] = useState('')
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const onFooterLinkPress = () => {
    navigation.navigate('Login')
  }
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  //enviamos datos a bd para almacenar nuevo usuario
  const addUserBd = async(apellido, nombre, userName, poblacion, email)=>{
    
    const newUser = await addDoc(collection(db, "Users"), {
      "Apellido": apellido,
      "Nombre": nombre,
      "Nombre_Usuario": userName,
      "email": email,
      "Poblacion": poblacion,
    });
    console.log("newUser" + newUser)
  }


  const onRegisterPress = () => {
    createUserWithEmailAndPassword(auth, email, password, apellido, nombre, userName, poblacion)
    .then(() => {
      addUserBd(apellido, nombre, userName, poblacion, email)
      console.log('User account created & signed in!');      
      //const user = userCredential.user;
      //console.log(user);
      navigation.navigate('Login');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
  }

  const formatEmail = (email) => {
    const emailFormatted = email.trim().toLowerCase();
    setEmail(emailFormatted);
  };
  
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <Image
          style={styles.logo}
          source={require('../../../assets/icon.png')}
        />
        <TextInput
          style={styles.input}
          placeholder="nombre"
          placeholderTextColor="#aaa"
          onChangeText={(text) => setNombre(text)}
          value={nombre}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="apellido"
          placeholderTextColor="#aaa"
          onChangeText={(text) => setApellido(text)}
          value={apellido}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Nombre Usuario"
          placeholderTextColor="#aaa"
          onChangeText={(text) => setUserName(text)}
          value={userName}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="poblacion"
          placeholderTextColor="#aaa"
          onChangeText={(text) => setPoblacion(text)}
          value={poblacion}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
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
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#aaa"
          secureTextEntry
          placeholder="Confirm Password"
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onRegisterPress()}>
          <Text style={styles.buttonTitle}>Create account</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center'
  },

  logo: {
    flex: 1,
    height: 10,
    width: 90,
    alignSelf: 'center',
    margin: 30
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 30,
    paddingLeft: 16
  },
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#788eec',
    fontWeight: 'bold',
    fontSize: 16
  },

});