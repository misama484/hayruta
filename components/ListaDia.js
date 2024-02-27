import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Alert } from 'react-native'


//FIREEBASE
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";





const ListaDia = ({fecha}) => {
  const [usuarios, setUsuarios] = useState([]);
  const [coches, setCoches] = useState([]);

  //const usuarios = Usuarios;
  //const coches = Coches;

    const consulta = async (fecha) => {
    const fecha1 = fecha.currentDay;
    const ruta = collection(db, 'Ruta');
    const q = query(ruta, where('Fecha', '==', fecha1.toString()));
    const querySnapshot = await getDocs(q);
    
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
      
      return Usuarios, Coches;
    });
  }

  const fetchData = async (fecha) => {
    const users = await consulta(fecha).Usuarios;
    setUsuarios(users);
  }
  fetchData(fecha);
  console.log("fecha " + fecha);
  console.log("typeoff de usuarios" + typeof usuarios);

  return(
  <View style = {{flexDirection: "row", justifyContent: "space-around"}}>
        <View>
          <Text>Usuarios</Text>          
          <FlatList
          data = {usuarios}
          renderItem = {({item}) => (
            <Text>{item}</Text>
          )}
          keyExtractor = {item => item}
          />
        </View>

        <View>
          <Text>Coches</Text>
          <FlatList
          data = {coches}
          renderItem = {({item}) => (
            <Text>{item}</Text>
          )}
          keyExtractor = {item => item}
          />
        </View>
      </View> 
      )   
}

export default ListaDia;