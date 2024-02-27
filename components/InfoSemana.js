import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Data from '../DataSemanas.json'

export default function InfoSemana() {

  const data = Data.NSemanas;



  return (
  <SafeAreaView style = {{flex: 1,}}>
    <View>
      <View style = {styles.tabRow}>
        <View style = {styles.tabItem}>
          <Text style = { {textAlign: 'center',}}>{data[1][1].dia}</Text>
        </View>
        <View style = {styles.tabItem}>
          <Text style = { {textAlign: 'center',}}>Usuarios</Text>
        </View>
        <View style = {styles.tabItem}>
          <Text style = { {textAlign: 'center',}}>Coche</Text>
        </View>        
      </View>  

    <ScrollView contentContainerStyle = {styles.tabGroup}>
      {data[1].map((item) => (
        <View style = {styles.tabRow}>
          <View style = {styles.tabItem} key={item.dia}>
            <Text style = { {textAlign: 'center',}}>{item.dia}</Text>
          </View>
          <View style = {styles.tabItem} key={item.usuarios}>
            <Text style = { {textAlign: 'center',}}>{item.usuarios.map((user) => {
              return user.Nombre + '\n'
            })}</Text>
        </View>
        <View style = {styles.tabItem} key={item.Coches}>
          <Text style = { {textAlign: 'center',}}>{item.Coches}</Text>
        </View>
      </View>
      ))}

    </ScrollView>
    </View>
  </SafeAreaView>
  )
}



const styles = StyleSheet.create({

  tabRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    //borderWidth: 1,
    borderColor: 'black',
  },
  tabGroup: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 10,
  },

  tabItem: {
    justifySelf: 'center',
    alignSelf: 'center',
    overflowX: 'scroll',
    backgroundColor: '#6495ED',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    margin: 5,
    width: "30%",
    height: 'auto',
    minHeight: 100,
    padding: 10,
    
  },


})