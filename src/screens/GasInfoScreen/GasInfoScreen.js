import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Touchable, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import { List } from 'react-native-paper';


const GasInfoScreen = () => {
  const [gasolineras, setGasolineras] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [provinciaName, setProvinciaName] = useState('');
  const [idProvincia, setIdProvincia] = useState('');
  const [poblaciones, setPoblaciones] = useState([]);
  const [municipio, setMunicipio] = useState('');
  const [idMunicipio, setIdMunicipio] = useState('');
  const [gasolineraName, setGasolineraName] = useState('');


  const api = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";
  const provinciasApi = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/Provincias/"

  const fetchGas = () => {
    fetch(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/7003`)
    .then(response => response.json())
    .then(gasolinera => setGasolineras(gasolinera.ListaEESSPrecio));
    console.log(gasolineras.length + " desde fetchGas");
    };

  const fetchProvincias = () => {
    fetch(provinciasApi)
    .then(response => response.json())
    .then(provincia => setProvincias(provincia));
    //console.log(provincias);

  };

  const fetchPoblaciones = (idProvincia) => {
    console.log(idProvincia);
    fetch(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/${idProvincia}`)
    .then(response => response.json())
    .then(poblacion => setPoblaciones(poblacion));
    console.log(poblaciones);
  };
  
  useEffect(() => {
    fetchProvincias();
    
  }, []);

  useEffect(() => {
    fetchPoblaciones(idProvincia);
  }, [idProvincia])

  useEffect(() => {
    fetchGas(idMunicipio);
    console.log(gasolineras.length + " desde useEffect");
  }, [idMunicipio])
 

  const ShowProvincias = () => {
    
    const [visible, setVisible] = useState(false);
    const visibleHandler = () => {
      setVisible(!visible);
    }
    const closeMenu = () => setVisible(false);

    return (
      <List.Section title='Seleccione provincia'>
        <ScrollView style={{ maxHeight: '76%' }}>
          <List.Accordion
            title={provinciaName}
            expanded={visible}
            onPress={visibleHandler}
            left={props => <List.Icon {...props} icon="account" color='black'/>}
            style = {{backgroundColor: '#6495ED', borderRadius: 10, borderWidth: 2, borderColor: 'black', height: 60, width: 'auto', minWidth: 250}}
          >
            {provincias.map((provincia, index) => (
              <List.Item
              style = {{padding: 10, fontSize: 18, backgroundColor: "#6495ED", borderWidth: 1, borderColor: "black", borderRadius: 10, margin: 5,}}
                key={index}
                title={provincia.Provincia}
                onPress={() => {
                  closeMenu();
                  setProvinciaName(provincia.Provincia)
                  setIdProvincia(provincia.IDPovincia)
                  
                }}
              />
            ))}
          </List.Accordion>
        </ScrollView>
      </List.Section>
      
    );
  };

  const ShowPoblaciones = () => {    
    
    const [visible, setVisible] = useState(false);
    const visibleHandler = () => {
      setVisible(!visible);
    }
    const closeMenu = () => setVisible(false);

    return (
      <List.Section title='Seleccione poblacion'>
        <ScrollView style={{ maxHeight: '76%' }}>
          <List.Accordion
            title={municipio}
            expanded={visible}
            onPress={visibleHandler}
            left={props => <List.Icon {...props} icon="account" color='black'/>}
            style = {{backgroundColor: '#6495ED', borderRadius: 10, borderWidth: 2, borderColor: 'black', height: 60, width: 'auto', minWidth: 250}}
          >
            {poblaciones.map((poblacion, index) => (
              <List.Item
                style = {{padding: 10, fontSize: 18, backgroundColor: "#6495ED", borderWidth: 1, borderColor: "black", borderRadius: 10, margin: 5,}}
                key={index}
                title={poblacion.Municipio}
                onPress={() => {
                  closeMenu();
                  setMunicipio(poblacion.Municipio)
                  setIdMunicipio(poblacion.IDMunicipio)
                }}
              />
            ))}
          </List.Accordion>
        </ScrollView>
      </List.Section>
      
    );
  };

  const ShowGasStations = () => {

    const [visible, setVisible] = useState(false);
    const visibleHandler = () => {
      setVisible(!visible);
    }
    const closeMenu = () => setVisible(false);

    return (
      <List.Section title='Seleccione Gasolinera'>
        <ScrollView style={{ maxHeight: '59%' }}>
          {/*OJO CON LA TILDE DE ROTULO, SIN ELLA NO MUETSRA NADA */}
          <List.Accordion
            title={gasolineraName}
            expanded={visible}
            onPress={visibleHandler}
            left={props => <List.Icon {...props} icon="account" color='black'/>}
            style = {{backgroundColor: '#6495ED', borderRadius: 10, borderWidth: 2, borderColor: 'black', height: 60, width: 'auto', minWidth: 250}}
          >
            {gasolineras.map((gasolinera, index) => (
              <List.Item
              style = {{padding: 10, fontSize: 18, backgroundColor: "#6495ED", borderWidth: 1, borderColor: "black", borderRadius: 10, margin: 5,}}
                key={index}
                title={gasolinera.Rótulo} 
                onPress={() => {
                  closeMenu();                  
                  setGasolineraName(gasolinera.Rótulo)
                }}
                
              />
            ))}
          </List.Accordion>
        </ScrollView>
      </List.Section>
    );
  };

  const ShowMunicipio = () => {
    return (
      <FlatList
        style = {{height: 250, }}
        data = {poblaciones}
        renderItem = {({item}) => (
          <TouchableOpacity
            onPress={() =>  setMunicipio(item.Municipio)}>
            <Text style = {{padding: 10, fontSize: 18, backgroundColor: "#6495ED", borderWidth: 1, borderColor: "black", borderRadius: 10, margin: 5,}}>
              {item.Municipio}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor = {item => item.IDPovincia}
      />
    );
  }

  return (
    <SafeAreaView>
      <Text style={styles.text}>Gas Info Screen</Text>
      <Text>{provinciaName} -- {idProvincia}</Text>
      <Text>{municipio} -- {idMunicipio}</Text>
      
      <ShowProvincias />
      <ShowPoblaciones />
      <ShowGasStations />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default GasInfoScreen;


//TODO:
// 1. Hacer que el boton de seleccionar provincia y poblacion se vea bien
// 2. Hacer que al seleccionar una provincia se muestren las poblaciones de esa provincia
// 3. Hacer que al seleccionar una poblacion se muestren las gasolineras de esa poblacion
// 4. Hacer que al seleccionar una gasolinera se muestren los precios de los carburantes de esa gasolinera
// 5. Hacer que al seleccionar un carburante se muestre el precio de ese carburante en esa gasolinera


//ENDPOINTS DE LA API
//https://sedeaplicaciones.minetur.gob.es/ServiciosRestCarburantes/PreciosCarburantes/help

{/* codigo guardado

<FlatList
              data = {provincias}
              
              renderItem = {({item}) => (
                <TouchableOpacity
                  onPress={() => Alert.alert( "Pulsado")}>
                  <Text>
                    {item.Provincia}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor = {item => item.IDPovincia.toString()}
              />
*/}