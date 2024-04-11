
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Alert, Modal, ScrollView } from 'react-native'
import { Calendar } from 'react-native-calendars' 
import { Switch, Button } from 'react-native-paper';

//FIREBASE
import { doc, getDoc, setDoc, getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase/config.js';



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function HomeScreen({route, navigation}) {
  const [currentDay, setCurrentDay] = useState('');
  const [date, setDate] = useState(new Date());
  const [ switchedWork, setSwitchedWork ] = useState(false);
  const [ switchedCar, setSwitchedCar ] = useState(false);
  const [viewConsulta, setViewConsulta] = useState(false);
  const [modal, setOpenModal] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [coches, setCoches] = useState([]);
  const [nombre, setNombre] = useState('');
  const [selectedMoth, setSelectedMonth] = useState('');
  //estado para actualizar la lista de usuarios y coches, cuando se realize algun cambio cambiara el estado y ese cambio, atraves de useEffect, actualizara la lista
  const [updateList, setUpdateList] = useState(false);

  //fecha actual
  const fecha = new Date();
  const fechaActual = fecha.getDate() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getFullYear();


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
      userName = data.Nombre            
    });
    return userName;
  }

  const email = route.params.email;
  //como el nombre es una promesa, no se puede pasar directamente a setNombre
  const fetchName = async (email) => {
    const name = await getName(email);
    setNombre(name);
  }
  fetchName(email);

  
 //FUNCION PARA AÑADIR USUARIO A LA RUTA

  const addDocUsers = async (fecha, nombre) => {
    const fecha1 = fecha.currentDay;
    const ruta = collection(db, 'Ruta');
    const docRef = doc(db, "Ruta", fecha1);
    //obtenemos los datos de la bd
    const docSnap = await getDoc(docRef);

    let Usuarios = [];
    //si los datos existen, los guardamos en las variables
    if (docSnap.exists()) {
      Usuarios = docSnap.data().Usuarios;
      //Coches = docSnap.data().Coches;
    }
    //COMPROBAR QUE EL NOMBRE NO EXISTE EN BD
    if(Usuarios.includes(nombre)){
      Alert.alert("Atencion", "El usuario ya esta en la lista");
      
    }
    else{
      //añadimos el nombre a las variables
      Usuarios.push(nombre);
    }
    //añadimos los datos a la bd
    await setDoc(docRef, {
      Fecha: fecha1,
      Usuarios: Usuarios
    }, {merge: true});
    Alert.alert("Usuario añadido", nombre);
    setUpdateList(!updateList);
  };

  //FUNCION PARA AÑADIR CONDUCTOR A LA RUTA

  const addDoc = async (fecha, nombre) => {
    const fecha1 = fecha.currentDay;
    const ruta = collection(db, 'Ruta');
    const docRef = doc(db, "Ruta", fecha1);
    //obtenemos los datos de la bd
    const docSnap = await getDoc(docRef);

    let Usuarios = [];
    let Coches = [];
    //si los datos existen, los guardamos en las variables
    if (docSnap.exists()) {
      Usuarios = docSnap.data().Usuarios;
      Coches = docSnap.data().Coches;
    }

    if(Usuarios.includes(nombre)){
      Alert.alert("Atencion", "El usuario ya esta en la lista desde addDoc");
      //return;
    }
    else{
      //añadimos el nombre a las variables
      Usuarios.push(nombre);
    }
    if(Coches.includes(nombre)){
      Alert.alert("Atencion", "El conductor ya esta en la lista");
      return;
    }
    else{
      //añadimos el nombre a las variables
      Coches.push(nombre);
    }
    
    //añadimos los datos a la bd
    await setDoc(docRef, {
      Fecha: fecha1,
      Mes: selectedMoth,
      Coches: Coches,
      Usuarios: Usuarios
    }, {merge: true});
    Alert.alert("Usuario y conductor añadidos", nombre)
    setUpdateList(!updateList);
  };
  
  //FUNCION PARA CONSULTAR USUARIOS Y COCHES DE LA RUTA
  const ruta = collection(db, 'Ruta');
    const q = query(ruta, where('Fecha', '==', currentDay.toString()));
   
    const consulta = async () => {
      const querySnapshot = await getDocs(q);
      if(querySnapshot.size == 0){
        Alert.alert("Atencion", "No hay datos para este dia", [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Anyadir Usuario', 
            onPress: () => {
              //Abrir modal para enviar a bd la fecha, el usuario y si coge coche
              setOpenModal(!modal);             
            },
            style: 'default'
          }
        ], {cancelable: false});
        setUsuarios([]);
        setCoches([]);
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const Usuarios = data.Usuarios;        
        setUsuarios(Usuarios);
        const Coches = data.Coches;
        setCoches(Coches);
      });           
    };

  useEffect(() => {
    if(currentDay){   //Si hay una fecha seleccionada, se ejecuta la consulta, de lo contrario no, asi evitamos que se muestre el alert al cargar la pagina.
      consulta(currentDay);
      <ListaDiaLocal fecha = {currentDay} Usuarios = {usuarios} Coches = {coches} />           
    }      
  }, [currentDay, updateList]); // Dependencia de currentDay Y updateList


  //COMPONENTE PARA MOSTRAR LOS USUARIOS Y COCHES DE LA RUTA QUE SE ESTÁ VIENDO EN PANTALLA
  const ListaDiaLocal = ({fecha, Usuarios, Coches}) => {    
    const usuarios = Usuarios;
    const coches = Coches;

    return(
      <>
        <Text style = {{alignSelf: "center", marginVertical: 0}}>{fecha}</Text>
          <View style = {{flexDirection: "row", justifyContent: "space-around", backgroundColor: "#6495ED", borderRadius: 20}}>
            
            <View>
              <Text style= {{fontSize: 18}}>Usuarios</Text>
              <FlatList
              data = {usuarios}
              
              renderItem = {({item}) => (
                <Text>{item}</Text>
              )}
              keyExtractor = {item => item}
              />
            </View>

            <View>
              <Text style= {{fontSize: 18}}>Coches</Text>
              <FlatList
              data = {coches}
              renderItem = {({item}) => (
                <Text>{item}</Text>
              )}
              keyExtractor = {item => item}
              />
            </View>
          </View>
      </>
    )             
  }

  //CONTROLA EL MOVIMIENTO DEL LOS SWITCHES DE TRABAJA Y COCHE, cuando se selecciona coche, automaticamente se selecciona trabaja
  const onToggleSwitchWork = () => setSwitchedWork(!switchedWork);
  const onToggleSwitchCar = () => {
    setSwitchedCar(!switchedCar)
    setSwitchedWork(true);
  };

  //FUNCION PARA NAVEGAR HASTA LA PANTALLA DE INFORMACION DE USUARIO
  const handleUserInfo = (email, nombre) => {
    email = route.params.email;
    setNombre(nombre)
    navigation.navigate('UserInfoScreen', {email: email});
  }

  //FUNCION PARA ELIMINAR USUARIO DE LA RUTA
  //TODO al eliminar conductor, como tambien se elimina de la lista de usuarios,salta el alert de que no esta en la lista
  const deleteUser = async (nombre) => {
    //obtenemos el documento correspondiente a la fecha seleccionada, comprobamos que hay una fecha seleccionada
    if(currentDay){
      const ruta = collection(db, 'Ruta');
      const docRef = doc(db, "Ruta", currentDay);
      const docSnap = await getDoc(docRef);
      //obtenemos los datos de la bd
      let Usuarios = [];
      let Coches = [];
      if (docSnap.exists()) {
        Usuarios = docSnap.data().Usuarios;
        Coches = docSnap.data().Coches;
      }
      //comprobamos si el usuario esta en la lista
      if(Usuarios.includes(nombre)){
        //eliminamos el usuario de la lista
        const index = Usuarios.indexOf(nombre);
        Usuarios.splice(index, 1);
        //actualizamos la bd
        await setDoc(docRef, {
          Usuarios: Usuarios,
          Coches: Coches
        }, {merge: true});
        Alert.alert("Usuario eliminado", nombre);
      }
      else{
        Alert.alert("Atencion", "El usuario no esta en la lista");
      }
      //comprobamos si el conductor esta en la lista
      if(Coches.includes(nombre)){
        //eliminamos el usuario de la lista
        const index = Coches.indexOf(nombre);
        Coches.splice(index, 1);
        //actualizamos la bd
        await setDoc(docRef, {
          Usuarios: Usuarios,
          Coches: Coches
        }, {merge: true});
        Alert.alert("Conductor eliminado", nombre);
      }
      else{
        Alert.alert("Atencion", "El conductor no esta en la lista");
      }
    }
    else{
      Alert.alert("Atencion", "No hay fecha seleccionada");
    }
    setUpdateList(!updateList);
  }
  
  //RENDERIZADO PRINCIPAL DE LA PANTALLA
  return (
    <View style ={styles.container} contentContainerStyle={{ alignItems: 'center'}}>
     <View style = {styles.header}>        
        <View style = {styles.bloqueFecha}>
          <Text>Email: {email} </Text>
          <Text>Nombre: {nombre} </Text>
        <View >
          <Text>Fecha actual: {fechaActual}</Text>
          <Text>Fecha seleccionada: {currentDay}</Text>
        </View>
      </View>

      {/*Navegar hasta userInfo */}
    <View style = {{flexDirection: 'column', justifyContent: 'space-around', gap: 10}}>
      <Button
        mode='contained'
        style = {{backgroundColor: '#6495ED', marginTop: 10}}
        onPress={() => {
          handleUserInfo();
        }}
      >Informacion Usuario</Button> 
      {/* Navegar hasta GasInfo */}     
      <Button
        mode='contained'
        style = {{backgroundColor: '#6495ED', marginTop: 10}}
        onPress={() => {
          navigation.navigate('GasInfoScreen');
        }}
      >Precios combustible</Button>
    </View>
     
    {/* CALENDARIO HOMESCREEN */}    
    </View>
      <Calendar
        style={styles.calendar}
        current={date}
       
        onDayPress={(day) => {
          setCurrentDay(day.day.toString() + "-" + day.month.toString() + "-" + day.year.toString());
          setSelectedMonth(day.month.toString());
          setUpdateList(!updateList);
        }}
      />

      <View>
        <View style = {styles.optionContainer}>          
      </View>
        <View style = {styles.buttonContainer}>
          <Button
            mode='contained'
            style = {{backgroundColor: '#6495ED'}}
            onPress={() => {
              //enviar a bd la fecha, el usuario y si coge coche
              setOpenModal(!modal);
            }}          
          >Anyadir Usuario</Button>

          <Button
            mode='contained'
            style = {{backgroundColor: '#6495ED'}}
            onPress={() => {
              deleteUser(nombre)
            }}          
          >Eliminar Usuario</Button>
        </View>
        <ListaDiaLocal fecha = {currentDay} Usuarios = {usuarios} Coches = {coches} />
      
      {/* MODAL PARA ANYADIR USUARIO A LA RUTA */}
      {modal ? <Modal
      animationType="slide"
      transparent={true}
      visible={modal}
      onRequestClose={() => {
        setOpenModal(!modal);
      }}
      
    >
      <View style = {styles.modalContainer}>
        <Text>Fecha: {currentDay}</Text>
        <Text>Usuario: {nombre}</Text>
        <View style = {styles.optionContainer}>
          <Text style = {{textAlignVertical: 'center'}}>Trabaja</Text>
            <Switch value={switchedWork} onValueChange={(value) => {
              onToggleSwitchWork();
              
            }}/>
        </View>
          <View style = {styles.optionContainer}>
            <Text style = {{textAlignVertical: 'center'}}>Coche</Text>
            <Switch value={switchedCar} onValueChange={(value) => {
              onToggleSwitchCar();
              
            }}/>
          </View>
          <View style = {styles.buttonContainer}>
            <Button
              mode='contained'
              onPress={() => {
                //enviar a bd la fecha, el usuario y si coge coche
                {switchedWork ? 
                  addDocUsers({currentDay}, nombre)
                  : null
                }
                //TODO
                //AL MARCAR AMBOS, MUESTRA TAMBIEN EL ALERT DE TRABAJA
                {switchedCar && switchedWork ?
                addDoc({currentDay}, nombre) : null}
                //cambiar un estado para ejecutar useEffect y actualizar lista                
                setOpenModal(!modal);
              }}          
            >Enviar Datos</Button>
            <Button
              mode='contained'
              onPress={() => {
                Alert.alert("Atencion", "No se ha agregado ningun usuario/conductor");
                setOpenModal(!modal);
              }}          
            >Cancelar</Button>
          </View>
        </View>
      </Modal> : null} 
    </View>
  </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'center'
    
  },
  header:{ 
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    gap: 20,
    
  },
  bloqueFecha: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#6495ED',
    borderRadius: 30, 
    elevation: 5,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16
  },

  calendar: {
    marginTop: 10,
    marginBottom: 20,
    width: 400,
    height: 390,
    minHeight: 350,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: '#6495ED',
  },

  buttonContainer:{
    flexDirection: 'row',
    gap: 10,
  },

  optionContainer:{
    flexDirection: 'row',
    gap: 100,
    justifyContent: 'center',
    maxWidth: 200,
  }, 

  modalContainer: {
    width: 300,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 20,
    marginTop: 20,
    backgroundColor: '#6495ED',
    borderRadius: 30,
    elevation: 5,
  },


})