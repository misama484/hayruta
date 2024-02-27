import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

//FIREEBASE
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase/config.js';
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";

//NAVIGATION
import { useNavigation } from '@react-navigation/native';


export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
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

  let nombreUser = getUserData(email);

  const onFooterLinkPress = () => {
    navigation.navigate('Registration')
  }
  
  const onLoginPress = () => {
    signInWithEmailAndPassword(auth, email, password, nombreUser)
    .then(() => {      
      console.log('signed in!');
      //extraemos el nombre de la bd y lo pasamos como parametro a navigation
      navigation.navigate('Home', {email: email}, {nombre: name});
          
      })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    })
  };
  
  
  return (
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
          onChangeText={(text) => setEmail(text)}
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => onLoginPress()}>
          <Text style={styles.buttonTitle}>Log in</Text>
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
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
    //flex: 1,
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: "#6495ED",
    marginTop: 10,
    marginBottom: 10,
    //marginLeft: 30,
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
  }
});

