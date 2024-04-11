
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
      //setNombre(userName)      
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

  
 //funcion para añadir a la bd

  const addDocUsers = async (fecha, nombre) => {
    const fecha1 = fecha.currentDay;
    const ruta = collection(db, 'Ruta');
    const docRef = doc(db, "Ruta", fecha1);
    //obtenemos los datos de la bd
    const docSnap = await getDoc(docRef);

    let Usuarios = [];
    //let Coches = [];
    //si los datos existen, los guardamos en las variables
    if (docSnap.exists()) {
      Usuarios = docSnap.data().Usuarios;
      //Coches = docSnap.data().Coches;
    }
    //COMPROBAR QUE EL NOMBRE NO EXISTE EN BD
    if(Usuarios.includes(nombre)){
      Alert.alert("Atencion", "El usuario ya esta en la lista");
      return;
    }
    else{
      //añadimos el nombre a las variables
      Usuarios.push(nombre);
    }
    //Coches.push(nombre);

    console.log(fecha1 + nombre + " desde addDoc");
    //añadimos los datos a la bd
    await setDoc(docRef, {
      Fecha: fecha1,
      //Coches: Coches,
      Usuarios: Usuarios
    }, {merge: true});
    Alert.alert("Usuario añadido", nombre);
  };

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
    console.log(fecha1 + nombre + " desde addDoc");
    //añadimos los datos a la bd
    await setDoc(docRef, {
      Fecha: fecha1,
      Mes: selectedMoth,
      Coches: Coches,
      Usuarios: Usuarios
    }, {merge: true});
    Alert.alert("Usuario y conductor añadidos", nombre)
  };
  


useEffect(() => {   
    const ruta = collection(db, 'Ruta');
    const q = query(ruta, where('Fecha', '==', currentDay.toString()));
    console.log("fecha desde udeEffect " + currentDay);
    const consulta = async () => {
      const querySnapshot = await getDocs(q);

      if(querySnapshot.size == 0){
        Alert.alert("Atencion", "No hay datos para este dia", [
          {
            text: 'Cancel',
            //onPress: () => Alert.alert('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Anyadir Usuario', 
            onPress: () => {
              //enviar a bd la fecha, el usuario y si coge coche
              setOpenModal(!modal);
              console.log(modal)
              //addDoc({currentDay})
            },
            style: 'default'
          }
        ], {cancelable: false});
        setUsuarios([]);
        setCoches([]);
      }

      querySnapshot.forEach((doc) => {
        console.log(" => ", doc.data());
        const data = doc.data();

        const Usuarios = data.Usuarios;        
        setUsuarios(Usuarios);
        Usuarios.forEach((usuario) => {
          console.log("usuario" + usuario);
        });

        const Coches = data.Coches;
        setCoches(Coches);
        Coches.forEach((coche) => {
          console.log("coche" + coche);
        });
      });
    };

      consulta(currentDay);
      <ListaDiaLocal fecha = {currentDay} Usuarios = {usuarios} Coches = {coches} />   
    
}, [currentDay]); // Dependencia de currentDay

  

  const ListaDiaLocal = ({fecha, Usuarios, Coches}) => {    
    const usuarios = Usuarios;
    const coches = Coches;
    return(
      <>
          <Text style = {{alignSelf: "center", marginVertical: 0}}>{fecha}</Text>
          <View style = {{flexDirection: "row", justifyContent: "space-around", backgroundColor: "#6495ED", borderRadius: 20}}>
            
            <View>
              <Text style= {{textDecorationLine: "underline line", fontSize: 18}}>Usuarios</Text>
              <FlatList
              data = {usuarios}
              
              renderItem = {({item}) => (
                <Text>{item}</Text>
              )}
              keyExtractor = {item => item}
              />
            </View>

            <View>
              <Text style= {{textDecorationLine: "underline line", fontSize: 18}}>Coches</Text>
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


  const onToggleSwitchWork = () => setSwitchedWork(!switchedWork);
  const onToggleSwitchCar = () => {
    setSwitchedCar(!switchedCar)
    setSwitchedWork(true);
  };

  const handleUserInfo = (email, nombre) => {
    email = route.params.email;
    setNombre(nombre)
    console.log("email desde handleUserInfo - " + email);
    navigation.navigate('UserInfoScreen', {email: email});
  }
  
  //RENDERIZADO PRINCIPAL DE LA PANTALLA
  return (
    <View style ={styles.container} contentContainerStyle={{ alignItems: 'center'}}>
     <View style = {styles.header}>        
        <View style = {styles.bloqueFecha}>
          <Text style = {{textDecorationLine: "underline"}}>Email: {email} </Text>
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
      <Button
      mode='contained'
      style = {{backgroundColor: '#6495ED', marginTop: 10}}
      onPress={() => {
        navigation.navigate('GasInfoScreen');
      }}
      >Precios combustible</Button>
      </View>
     

    </View>
      <Calendar
        style={styles.calendar}
        current={date}
       
        onDayPress={(day) => {
          setCurrentDay(day.day.toString() + "-" + day.month.toString() + "-" + day.year.toString());
          setSelectedMonth(day.month.toString());
          //consulta({currentDay})
          //setViewConsulta(!viewConsulta);
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
              console.log(modal)
            }}          
          >Anyadir Usuario</Button>

          <Button
            mode='contained'
            style = {{backgroundColor: '#6495ED'}}
            onPress={() => {
              console.log("dia desde onPress" + currentDay);
              //enviar a bd la fecha, el usuario y si coge coche
              //consulta({currentDay})              
              {currentDay ? setViewConsulta(!viewConsulta) : Alert.alert("Seleccione un dia")}
            }}          
          >Consultar</Button>
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
                //addDoc({currentDay})
                {switchedWork ? 
                  addDocUsers({currentDay}, nombre)
                  : null
                }
                //TODO
                //AL MARCAR AMBOS, MUESTRA TAMBIEN EL ALERT DE TRABAJA
                {switchedCar && switchedWork ?
                addDoc({currentDay}, nombre) : null}
                
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
    height: 400,
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