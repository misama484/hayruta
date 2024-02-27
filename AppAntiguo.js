import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import InfoSemana from './components/InfoSemana';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppAntiguo() {
  return (
    <SafeAreaView >
      <View style = {styles.container}>
        <Text>Funciona</Text>

        <Calendar
          style={styles.calendar}
          onPress={day => {
            console.log('selected day', day)
          }}
          />
          
        <StatusBar style="auto" />
      </View>
      <View style= {styles.infoSemana}>
        <InfoSemana />        
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'red',
    borderWidth: 3,
    marginBottom: 50,
  },

  infoSemana: {
    marginTop: 20,
    paddingHorizontal: 15,
  },

  calendar:{
    borderWidth: 1,
    borderColor: '#6495ED',
    backgroundColor: "#6495ED",
    borderRadius: 20,
    padding: 10,
    width: 400,
    justifyContent: 'center',
  },
});
