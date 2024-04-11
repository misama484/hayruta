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
      
      const data = doc.data();
      const Usuarios = data.Usuarios;
      setUsuarios(Usuarios);
      Usuarios.forEach((usuario) => {
        
      });
      const Coches = data.Coches;
      setCoches(Coches);
      Coches.forEach((coche) => {
        
      });
      
      return Usuarios, Coches;
    });
  }

  const fetchData = async (fecha) => {
    const users = await consulta(fecha).Usuarios;
    setUsuarios(users);
  }
  fetchData(fecha);
  

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