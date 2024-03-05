import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Touchable, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import { List, Button } from 'react-native-paper';
import MapView from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';


const GasInfoScreen = () => {
  const [gasolineras, setGasolineras] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [provinciaName, setProvinciaName] = useState('');
  const [idProvincia, setIdProvincia] = useState('');
  const [poblaciones, setPoblaciones] = useState([]);
  const [municipio, setMunicipio] = useState('');
  const [idMunicipio, setIdMunicipio] = useState('');
  const [gasolineraName, setGasolineraName] = useState('');
  const [ubicaciones, setUbicaciones] = useState([{latitud: 0, longitud: 0, rotulo: ''}]);
  const [EESS, setEESS] = useState([{}]);

  const navigation = useNavigation();


  const api = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";
  const provinciasApi = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/Provincias/"

  const fetchGas = () => {
    fetch(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/${idMunicipio}`)
    .then(response => response.json())
    .then(gasolinera => setGasolineras(gasolinera.ListaEESSPrecio));
    console.log(gasolineras.length + " desde fetchGas");
    console.log(ubicaciones);
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
    //console.log(ubicaciones.length + " ubicaciones desde useEffect");
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
                  setUbicaciones({latitud: gasolinera.Latitud, longitud: gasolinera["Longitud (WGS84)"], rotulo: gasolinera.Rótulo});
                  setEESS(gasolinera);
                  console.log(gasolinera["Longitud (WGS84)"] + " desde ShowGasStations");
                  console.log(ubicaciones.rotulo + " desde ShowGasStations latitud");

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

  const GasDetails = () => {
    return (
      <>
      <View>
        <Text>GasoleoA: {EESS["Precio Gasoleo A"]} Euros</Text>
        <Text>Gasolina 95: {EESS["Precio Gasolina 95 E5"]} Euros</Text>
      </View>
      <View>
        <Text>Nombre : {EESS.Rótulo}</Text>
      </View>
      </>
    );
  };

  const OnMapButtonPress = () => {
    navigation.navigate('MapScreen', {latitud: ubicaciones.latitud, longitud: ubicaciones.longitud, rotulo: ubicaciones.rotulo, gasolinera: EESS})
  }

  return (
    <SafeAreaView>
      <Text style={styles.text}>Gas Info Screen</Text>
      <Text>{provinciaName} -- {idProvincia}</Text>
      <Text>{municipio} -- {idMunicipio}</Text>
      <Text>Latitud: {ubicaciones.latitud}</Text>
      <Text>Longitud: {ubicaciones.longitud}</Text>
      
      <ShowProvincias />
      <ShowPoblaciones />
      <ShowGasStations />
      <GasDetails />

      <TouchableOpacity
          style={styles.button}
          onPress={() => OnMapButtonPress()}>
          <Text style={styles.buttonTitle}>Go to Map</Text>
        </TouchableOpacity>

      


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