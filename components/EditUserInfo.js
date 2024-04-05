import React, { useEffect, useState} from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native'
import { TextInput, Button } from 'react-native-paper';

//FIREBASE
import { doc, getDoc, setDoc, getFirestore, collection, getDocs, query, where, updateDoc } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../src/firebase/config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const EditUserInfo = ({ modal, setOpenModal, correo, setIsUserDataUpdated }) => {

  const handleModal = () => {
    setOpenModal(!modal);
  };

  //RECUPERAR DATOS DE BD
  const [nombre, setNombre] = useState('');
  const [nombreTemp, setNombreTemp] = useState('');
  const [apellido, setApellido] = useState('');
  const [apellidoTemp, setApellidoTemp] = useState('');
  const [username, setUsername] = useState('');
  const [usernameTemp, setUsernameTemp] = useState('');
  const [poblacion, setPoblacion] = useState('');
  const [poblacionTemp, setPoblacionTemp] = useState('');
  const [email, setEmail] = useState(correo);

  //estado desde UserInfo para controlar cuando se editan los datos de usuario y actualizar la screen de useInfo.

 
  //funcion para obtener nombre de usuario
  const getName = async (email) => {
    const users = collection(db, 'Users');
    const q = query(users, where('email', '==', email))
    let userName = '';
    
    //Obtenemos los datos
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      //extraemos el nombre de la bd y lo pasamos como return
      userName = data.Nombre_Usuario
      setUsername(userName)
      Nusuario = data.Nombre
      setNombre(Nusuario)
      Apellido = data.Apellido
      setApellido(Apellido)
      Poblacion = data.Poblacion
      setPoblacion(Poblacion)

    });
    return userName;
  }

  useEffect(() => {
    getName(email)
  }
  ,[])

  //funcion para actualizar datos de usuario
  //comprobar si hay modificacion en los datos
  //si la hay, actualizar datos
  //NOFUNCIONA. ERROR: No document to update
  const updateUser = async (email, newNombre, NewApellido, newUsername, newPoblacion) => {
    // Obtén una referencia al documento del usuario
    const collectionName = collection(db, 'Users');
    const q = query(collectionName, where('email', '==', email))  
    // Obtén los datos actuales del usuario
    const userSnap = await getDocs(q);
    
      if( !userSnap.empty){
      const doc = userSnap.docs[0];
      const userData = doc.data();
      console.log(userData.length + ' desde updateUser');
      

      // Crea un objeto de actualizacion que solo recibe los campos que han sido modificados. (que contengan datos)
      let updateObject = {};
      if(newNombre !== "") {
        updateObject.Nombre = newNombre;
        setNombre(newNombre);
      }
      if(NewApellido) updateObject.Apellido = NewApellido;
      if(newUsername) updateObject.Nombre_Usuario = newUsername;
      if(newPoblacion) updateObject.Poblacion = newPoblacion;
      //actualizamos con el objeto de actualizacion
      await updateDoc(doc.ref, updateObject);
      //mostramos  mensaje de confirmacion
      let updatedFields = Object.entries(updateObject).map(([key, value]) => `${key}: ${value}`).join(', ');
      Alert.alert('Datos actualizados', `Los siguientes campos ${updatedFields} han sido actualizados correctamente`);

      setIsUserDataUpdated(prevState => !prevState);
    }else{
      Alert.alert('No se ha modificado ningun dato');
    }
      
    
  
  };

  const HandleValues = () => {
      
      updateUser(email, nombreTemp, apellidoTemp, usernameTemp, poblacionTemp)
      console.log(email + "-" + nombreTemp + "-" + apellidoTemp + "-"+ usernameTemp + "-" + poblacionTemp + ' desde handleValues');
      handleModal();
      
  }

  return (
    <View style = {styles.modalContainer}>
          <Text
            style = {{margin: 30, fontSize: 15, fontWeight: 'bold', borderWidth: 1, borderColor: 'black', borderRadius: 10, padding: 10,}}
          >
            Editar datos de usuario</Text>

            <Text>Nombre:</Text>
          <TextInput 
            placeholder={nombre}
            value= {nombreTemp}
            onChangeText={(value) => setNombreTemp(value)}
            style={styles.input}
          />
          <Text>Apellido:</Text>
          <TextInput 
            placeholder={apellido}
            value={apellidoTemp}
            onChangeText={(value) => setApellidoTemp(value)}
            style={styles.input}
          />
          <Text>Nombre de usuario:</Text>
          <TextInput 
            placeholder={username}
            value={usernameTemp}
            onChangeText={(value) => setUsernameTemp(value)}
            style={styles.input}
          />
          <Text>Población:</Text>
          <TextInput 
            placeholder={poblacion}
            value={poblacionTemp}
            onChangeText={(value) => setPoblacionTemp(value)}
            style={styles.input}
          />
               
          <View style = {styles.buttonModalContainer}>
            <Button
              style = {styles.button}
              onPress={() => handleModal()}
            >Cerrar</Button>
            <Button
              style = {styles.button}
              title="Guardar cambios"
              onPress={HandleValues}
            >Guardar</Button>
          </View>
        </View>
  )
}

const styles = StyleSheet.create({

  modalContainer: {
    //marginTop: 90,
    width: "90%",
    height: "70%",
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',    
    padding: 20,
    marginTop: 20,
    backgroundColor: '#6495ED',
    borderRadius: 30,
    elevation: 5,
  },

  buttonModalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  }, 

  button:{
    backgroundColor: '#6495ED',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    //height: 48,
    width: 100,
    borderRadius: 20,
    borderWidth: 1, 
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },

  input: {
    //flex: 1,
    height: 40,
    width: 300,
    borderRadius: 5,
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: "#6495ED",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 16
  },

});

export default EditUserInfo