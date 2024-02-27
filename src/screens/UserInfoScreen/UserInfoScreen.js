import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {Button, List} from 'react-native-paper'

//FIREBASE
import { doc, getDoc, setDoc, getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase/config.js';




const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//DESDE AQUI MOSTRAREMOS LOS DATOS DE USUARIO, LA ULTIMAS VECES QUE HA CONDUCIDO, TAL VEZ MARCAR CON COLOR LOS DIAS QUE HA CONDUCIDO EN UN CALENDARIO

const UserInfoScreen = ({route}) => {
  const [ nombre, setNombre ] = useState('')
  const [ data, setData ] = useState([])
  const [ cars, setCars ] = useState([])
  const [menuVisible, setMenuVisible] = useState(false);
  const [users, setUsers] = useState([]);

  const menuVisibleHandler = () => {
    setMenuVisible(!menuVisible);
  }
  const closeMenu = () => setMenuVisible(false);

  email = route.params.email;

  //OBTENER NOMBRE DE USUARIO (todo esto deberia ir en un archivo aparte, pero por ahora lo dejo aqui para pruebas)
  const getName = async (email) => {
    const users = collection(db, 'Users');
    const q = query(users, where('email', '==', {email}))
    let userName = '';
    
    //Obtenemos los datos
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      //extraemos el nombre de la bd y lo pasamos como return
      userName = data.Nombre.nombre      
    });
    return userName;
  }
  //OBTENEMOS LISTA DE USUSARIOS PARA EL DESPLEGABLE DE SELECCION DE USUARIOS
  const getUsers = async () => {
    const users = collection(db, 'Users');
    const q = query(users);
    const results = [];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      //console.log(data.Nombre.nombre + "desde getUsers");
      //TODO
      results.push(data.Nombre.nombre);
      
    });
    return results;
  }

  const fetchUsers = async () => {
    const results = await getUsers();
    setUsers(results);
  }



  const fetchName = async (email) => {
    const name = await getName(email);
    setNombre(name);
   // console.log(name + " desde fetchName");
  }
  fetchName(email);

  //OBTENER DIAS DE USO DE RUTA
  const getDays = async (nombre) => {
    const days = collection(db, 'Ruta');
    const q = query(days, where('Usuarios', 'array-contains', nombre))
    const results = [];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push(data);
    });
    return results;
  }

  //OBTENER DIAS DE CONDUCTOR
  const getCars = async(nombre) => {
    const cars = collection(db, 'Ruta');
    const q = query(cars, where('Coches', 'array-contains', nombre))
    const coches = [];

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      coches.push(data);
    });
    return coches;
  
  }

  //USEEFFECT QUE ACTUALIZA LOS DATOS DEPENDIENDO DEL NOMBRE
  useEffect(() => {
    const fetchDays = async () => {
      const results = await getDays(nombre);
      setData(results);
    };
    const fetchCars = async () => {
      const coches = await getCars(nombre);
      setCars(coches);
    }

    fetchDays();
    fetchCars();
  }, [nombre]);


  //MOSTRAR UN DESPLEGABLE DONDE PODER ELEGIR EL USUARIO DE LA RUTA PARA VER LA INFO

  const MenuUsers = ({users = ["pepe", "juan"]}) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const menuVisibleHandler = () => {
      setMenuVisible(!menuVisible);
    }
    const closeMenu = () => setMenuVisible(false);

    fetchUsers();
    return (

      <List.Section>
        <List.Accordion
          title="Usuarios"
          expanded={menuVisible}
          onPress={menuVisibleHandler}
        >
          {users.map((user, index) => (
            <List.Item
              key={index}
              title={user.nombre}
              onPress={() => {
                closeMenu();
              }}
            />
          ))}
        </List.Accordion>
      </List.Section>

    )
  }

  return (
    <View style = {styles.container}>
      <Text>Seleccione un usuario</Text>
      <MenuUsers />
      <View style = {styles.headerContainer}>
        <Text style = {styles.text}>Informacion del usuario</Text>
        <Text>Nombre: {nombre}</Text>
        <Text>Email: {email}</Text>
      </View>
      <View style = {styles.listContainer}>
        <View style = {styles.list}>
          <Text>Dias que ha usado ruta:</Text>
          {data.map((item, index) => (
            <Text key={index}>{item.Fecha}</Text>
          ))}
        </View>
        <View style = {styles.list}>
          <Text>Dias que ha conducido:</Text>
            {cars.map((coche, index) => (
              <Text key={index}>{coche.Fecha}</Text>
            ))}
        </View>
      </View>
    </View>
  )
}


styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#6495ED'
  },

  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#6495ED',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    width: '70%',
    height: '20%',
    marginTop: 20,
  },

  text: {
    fontSize: 20,
    color: 'black'
  },

  listContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 20,
    marginTop: 20,
  },

  list: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: '#6495ED',
    width: '40%',
    height: '50%',
  }
})

export default UserInfoScreen