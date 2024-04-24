import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import {Button, List, TextInput} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import EditUserInfo from '../../../components/EditUserInfo.js'

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
  const [correo, setCorreo] = useState('');
  const [mes, setMes] = useState('');
  const [mesNumber, setMesNumber] = useState(1);
  const [usoMesRuta, setUsoMesRuta] = useState([]);
  const [usoMesRutaCoche, setUsoMesRutaCoche] = useState([]);
  const [modal, setOpenModal] = useState(false);
  //estado que controlara cuando se han actualizado los datos de usuario deade EditUserInfo
  const [isUserDataUpdated, setIsUserDataUpdated] = useState(false);



  const menuVisibleHandler = () => {
    setMenuVisible(!menuVisible);
  }
  const closeMenu = () => setMenuVisible(false);

  email = route.params.email;

  //OBTENER NOMBRE DE USUARIO (todo esto deberia ir en un archivo aparte, pero por ahora lo dejo aqui para pruebas)
  const getName = async (email) => {
    const users = collection(db, 'Users');
    const q = query(users, where('email', '==', email))
    let userName = '';
    
    //Obtenemos los datos
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      //extraemos el nombre de la bd y lo pasamos como return
      userName = data.Nombre      
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
      results.push({nombre: data.Nombre, email: data.email});      
    });
    return results;
  }

  



  const fetchName = async (email) => {
    const name = await getName(email);
    setNombre(name);
    setCorreo(email);
  }
  useEffect(() => {
    fetchName(email);
  }, [isUserDataUpdated]);

  //Llama a getName y getUsers para obtener los datos de usuario y la lista de usuarios cada vez que cambien deade EditUserInfo
  useEffect(() => {
    const fetchUserData = async () => {
      const name = await getName(email);
      const users = await getUsers();
      setUserData({name, users});
    }
    fetchUserData();
  }, [isUserDataUpdated]);

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

  //CONSULTA LOS DIAS QUE HA USADO LA RUTA EN EL MES SELECCIONADO
  const getMonthDays = async (nombre, mesNumber) => {
  
    const daysMoth = collection(db, 'Ruta');
    const q = query(daysMoth, where('Mes', '==', mesNumber.toString()), where('Usuarios', 'array-contains', nombre));
    const results = [];

    const querySnapshot = await getDocs(q);
 
    querySnapshot.forEach((doc) => {
      const dataMesNumber = doc.data();
      results.push(dataMesNumber);      
    });
    
    return results;
  }

  const getMonthDaysCar = async (nombre, mesNumber) => {
 
    const daysMoth = collection(db, 'Ruta');
    const q = query(daysMoth, where('Mes', '==', mesNumber.toString()), where('Coches', 'array-contains', nombre));
    const results = [];

    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
      
      const dataMesNumberCar = doc.data();
      results.push(dataMesNumberCar);
      
    });
    
    return results;
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
    const fetchUsers = async () => {
      const results = await getUsers();
      setUsers(results);
    }
    const fetchMonthDays = async () => {
      
      const results = await getMonthDays(nombre, mesNumber);
      setUsoMesRuta(results);
    }
    const fetchMonthDaysCar = async () => {
      
      const results = await getMonthDaysCar(nombre, mesNumber);
      setUsoMesRutaCoche(results);
    }


    fetchDays();
    fetchCars();
    fetchUsers();
    fetchMonthDays();
    fetchMonthDaysCar();
  }, [nombre, mesNumber]);


  //MOSTRAR UN DESPLEGABLE DONDE PODER ELEGIR EL USUARIO DE LA RUTA PARA VER LA INFO

  const MenuUsers = () => {    

    const [menuVisible, setMenuVisible] = useState(false);
    const menuVisibleHandler = () => {
      setMenuVisible(!menuVisible);
    }
    const closeMenu = () => setMenuVisible(false);

    return (

      <List.Section title='Seleccione Usuario'>
        <List.Accordion
          title={nombre}
          expanded={menuVisible}
          onPress={menuVisibleHandler}
          left={props => <List.Icon {...props} icon="account" color='black'/>}
          style = {{backgroundColor: '#6495ED', borderRadius: 10, elevation: 5, height: 60, width: 'auto', minWidth: 170}}
        >
          {users.map((user, index) => (
            <List.Item
              key={index}
              title={user.nombre}
              onPress={() => {
                setNombre(user.nombre);
                setCorreo(user.email);
                closeMenu();
              }}
            />
          ))}
        </List.Accordion>
      </List.Section>

    )
  }

  //MENU DESPLEGABLE PARA ELEGIR EL MES QUE SE QUIERE CONSULTAR
  const MenuMeses = () => {

    const [menuMesesVisible, setMenuMesesVisible] = useState(false);
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const menuMesesVisibleHandler = () => {
      setMenuMesesVisible(!menuMesesVisible);
    }
    const closeMenuMeses = () => setMenuMesesVisible(false);

    return (
    <List.Section title='Seleccione Mes'>
        <List.Accordion
          title={meses}
          expanded={menuMesesVisible}
          onPress={menuMesesVisibleHandler}
          left={props => <List.Icon {...props} icon="calendar" color='black'/>}
          style = {{backgroundColor: '#6495ED', borderRadius: 10,elevation: 5, height: 60, width: 'auto', minWidth: 170}}
        >
          {meses.map((mes, index) => (
            <List.Item
              key={index}
              title={mes}
              onPress={() => {
                setMes(mes);
                setMesNumber(index + 1);
                closeMenuMeses();
              }}
            />
          ))}
        </List.Accordion>
      </List.Section>
    )
  };



  const handleModal = () => {
    setOpenModal(!modal);
    //EditUserModal();
  };

    //RETURN PRINCIPAL LA SCREEN
  return (

    <View style = {styles.container}>
      {/* MODAL QUE GESTIONA LA EDICION DE DATOS DEL USUARIO */}
      {modal ? <Modal
        animationType='slide'
        transparent = {true}
        visible= {modal}
        onRequestClose={() => setOpenModal(!modal)}

      >
        <EditUserInfo modal={modal} setOpenModal = {setOpenModal} correo={correo} setIsUserDataUpdated={setIsUserDataUpdated}/>
      </Modal> : null}

      {/* MENUS DESPLEGABLES */}
      <View  style={{flexDirection: 'row', gap: 10}}>
        <MenuUsers />
        <MenuMeses />
      </View>
      {/* TARJETA INFO USUARIO */}
      <View style = {styles.headerContainer}>
        <Text style = {styles.text}>Informacion del usuario</Text>
        <Text>Nombre: {nombre}</Text>
        <Text>Email: {correo}</Text>
        <View style = {{flexDirection: 'row', gap: 10}}>
          <TouchableOpacity 
          //dependiendo si es el usuario logueado o no, se habilita o no el boton de editar informacion
          disabled = {email == correo ? false : true}
          style = {{flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 10}}
          onPress={() => handleModal()}
          >
            <Icon name="pencil" size={30} color="black"/>
            <Text>Editar Datos</Text>
          </TouchableOpacity>          
        </View>
      </View>

      {/* TARJETA USO TOTAL RUTA */}
      <View style = {styles.listContainer}>
        <View style = {styles.list}>
          <Text style={{textAlign:"center"}}>Dias que ha usado ruta: {data.length}</Text>
          {data.map((item, index) => (
            <Text key={index}>{item.Fecha}</Text>
          ))}
        </View>
        <View style = {styles.list}>
          <Text style={{textAlign: "center"}}>Dias que ha conducido: {cars.length}</Text>
            {cars.map((coche, index) => (
              <Text key={index}>{coche.Fecha}</Text>
            ))}
        </View>        
      </View>

      {/* TARJETA USO RUTA POR MES */}
      <View style = {{flexDirection: "column", justifyContent:"flex-start", alignItems:"center"}}>        
        <Text style = {{marginVertical: 10}}>Datos de: {mes ? mes : "Elegir mes"}</Text>       
        <View style = {{flexDirection: "row", gap: 20}}>
          <View style = {styles.list}>
            <Text style={{textAlign:"center"}}>Dias de {mes} que ha usado ruta: {usoMesRuta.length}</Text>
              {usoMesRuta.map((uso, index) => (
                <Text key={index}>{uso.Fecha}</Text>
              ))}
          </View>
          
          <View style = {styles.list}>          
            <Text style = {{textAlign: "center"}}>Dias de {mes} que ha conducido: {usoMesRutaCoche.length}</Text>
              {usoMesRutaCoche.map((uso, index) => (
                <Text key={index}>{uso.Fecha}</Text>
              ))}
          </View>
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
    //backgroundColor: '#6495ED',
  },

  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#6495ED',
    borderRadius: 10,
    width: '70%',
    height: '20%',
    elevation: 5,
  },

  text: {
    fontSize: 20,
    color: 'black'
  },

  listContainer:{
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },

  list: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    borderRadius: 10,
    backgroundColor: '#6495ED',
    width: '42%',
    minHeight: 100,
  },

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
})

export default UserInfoScreen