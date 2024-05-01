import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Linking } from 'react-native';
import MapView, { Marker, Polyline} from 'react-native-maps';
//import MapViewDirections from 'react-native-maps-directions';
import { Button } from 'react-native-paper';
import * as Location from 'expo-location';


const MapScreen = ({route}) => {

  const { gasolinera } = route.params;
  //cambiar la , de latitud y longitud a punto para convertir en float
  const latitud = gasolinera.Latitud.replace(",", ".");
  const longitud = gasolinera["Longitud (WGS84)"].replace(",", ".");
  const rotulo = gasolinera["Rótulo"];


  //coordenadas de origen que se mostraran al abrir el mapa (coordenadas de la base)
  
  const [origin, setOrigin] = useState({
    latitude: parseFloat(latitud), 
    longitude: parseFloat(longitud)
  });
  const [destination, setDestination] = useState({
    latitude: parseFloat(latitud), 
    longitud: parseFloat(longitud)
  });


//OBTIENE LAS COORDENADAS DE LA UBICACION ACTUAL DEL USUARIO(en caso del emulador, estan introducidas manualmente en la configuracion del emulador con la ubicacion de FloridaUniversitaria)
 useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
  
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      setOrigin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      setDestination({
        latitude: parseFloat(latitud),
        longitude: parseFloat(longitud)
      })
    })();
  }, []);


  return (
    //Para poder anyadir markers y polylines, necesitamos que MapView tenga etiqueta de cierre
    <View style = {styles.container}>
      <View style = {styles.infoContainer}>
        <Text>Nombre: {rotulo}</Text>
        <Text>GasoleoA: {gasolinera["Precio Gasoleo A"]} Euros</Text>
        <Text>Gasolina 95: {gasolinera["Precio Gasolina 95 E5"]} Euros</Text>
        {/*en el onPress, abre la app maps y pone como destino las coordenadas de la gasolinera, en este caso Marines */}
        <Button
          mode="contained"
          onPress={() => {
            const url = `http://maps.google.com/maps?saddr=${origin.latitude},${origin.longitude}&daddr=${destination.latitude},${destination.longitude}`;
            Linking.openURL(url);
          }}
        
          style={{marginTop: 10}}
        >Como llegar</Button>
      </View>
      <View style={styles.mapContainer}>    
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
      </MapView>
      </View>  
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mapContainer: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderWidth: 1,
    borderColor: '#000000',
  },
  map: {
    width: '100%',
    height: '100%',
    margin: 20,
    
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#6495ED',
    borderRadius: 30, 
    elevation: 5,
  }
}) 

export default MapScreen


{/*<MapViewDirections
          origin={origin}
          destination={destination}
          apikey={"AIzaSyDxbPcazMlMBcCsRs6Zd71K3A819j4LLDk"}
          />
         
        <MapView.Marker coordinate={origin} />
        <MapView.Marker coordinate={destination} />
         

         <MapViewDirections
         origin={origin}
         destination={destination}
         apikey={"AIzaSyDxbPcazMlMBcCsRs6Zd71K3A819j4LLDk"}
         strokeWidth={3}
         strokeColor="hotpink"
       /> 

       ONPRESS PARA ABRIR GOOGLE MAPS EN DISPOSITIVO
       se utiliza el esquema de url de google maps (:geo) para abrir la app y poner como destino las coordenadas de la gasolinera NO ABRE MAPS EN MOVIL

         onPress={() => {
          const url = Platform.select({
          ios: `http://maps.apple.com/maps?saddr=${origin.latitude},${origin.longitude}&daddr=${Marines.latitude},${Marines.longitude}`,
          android: `geo:${origin.latitude},${origin.longitude}?q=${Marines.latitude},${Marines.longitude}`
          });

        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            console.log("No se puede abrir la URL: " + url);
          }
        });
      }}
      
          onPress={() => {
            const url = `http://maps.google.com/maps?saddr=${origin.latitude}, ${origin.longitude}&daddr=${Marines.latitude},${Marines.longitude}`;
            Linking.openURL(url);
          }}
      */ }