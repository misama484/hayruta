import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import { LoginScreen, HomeScreen, RegistrationScreen, UserInfoScreen, GasInfoScreen, MapScreen } from './src/screens/';
import { decode, encode } from 'base-64';

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerStyle: { backgroundColor: '#6495ED' } }}>
        <Stack.Screen name='Login' component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name='Home' component={HomeScreen} options={{title: "Hay Ruta"}} />
        <Stack.Screen name='Registration' component={RegistrationScreen} options={{title: "Registro"}}/>
        <Stack.Screen name='UserInfoScreen' component={UserInfoScreen} options={{title: "Informacion del Usuario"}} />    
        <Stack.Screen name='GasInfoScreen' component={GasInfoScreen} options={{title: "Precios del Combustible"}} /> 
        <Stack.Screen name='MapScreen' component={MapScreen} />   
      </Stack.Navigator>
    </NavigationContainer>
  );
}