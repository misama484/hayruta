import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const MapScreen = ({route}) => {

  const { gasolinera } = route.params;
  //cambiar la , de latitud y longitud a punto para convertir en float
  const latitud = gasolinera.Latitud.replace(",", ".");
  const longitud = gasolinera["Longitud (WGS84)"].replace(",", ".");
  const rotulo = gasolinera["Rótulo"];


  //coordenadas de origen que se mostraran al abrir el mapa (coordenadas de la base)
  /*
  const [origin, setOrigin] = useState({
    latitude: 39.141611, 
    longitude: -0.439472
  });
  */
  const [origin, setOrigin] = useState({
    latitude: parseFloat(latitud), 
    longitude: parseFloat(longitud)
  });

  //coordenadas de casa
  const [destination, setDestination] = useState({
    latitude: 39.154925, 
    longitude: -0.435294
  });

  const Marines = {
    latitude: 39.674159, 
    longitude: -0.559892
  }

  

  return (
    //Para poder anyadir markers y polylines, necesitamos que MapView tenga etiqueta de cierre
    <View style = {styles.container}>
      <Text>Nombre: {rotulo}</Text>
      <Text>GasoleoA: {gasolinera["Precio Gasoleo A"]} Euros</Text>
      <Text>Gasolina 95: {gasolinera["Precio Gasolina 95 E5"]} Euros</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker 
          draggable ={true}  //para que se pueda arrastrar
          onDragEnd={(e) => setOrigin(e.nativeEvent.coordinate)} //para que se actualice la posicion al soltar el marker
          coordinate={origin}
          title={"Marines"}
          description={"Pueblo de Marines"}/>
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={"AIzaSyDxbPcazMlMBcCsRs6Zd71K3A819j4LLDk"}
          />

      </MapView>  
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: {
    width: '100%',
    height: '50%',
    margin: 20,
  }
}) 

export default MapScreen