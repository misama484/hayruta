import { View, StyleSheet, Modal } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';
import { useState } from "react";
import { Switch, Text } from "react-native-paper";


export const AddRuta = (state) => {

  const [open, setOpen] = useState(false);
  const [switchedWork, setSwitchedWork] = useState(false);
  const [switchedCar, setSwitchedCar] = useState(false);

  const onToggleSwitchWork = () => setSwitchedWork(!switchedWork);
  const onToggleSwitchCar = () => setSwitchedCar(!switchedCar);


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={() => {
        setOpen(!open);
      }}
    >
      <View style = {styles.optionContainer}>
            <Text style = {{flex: 1, justifyContent: 'center'}} >Trabaja</Text>
            <Switch style = {{flex: 1, justifyContent: "center"}} value={switchedWork} onValueChange={(value) => {
              onToggleSwitchWork();
              
            }}/>
          </View>
          <View style = {styles.optionContainer}>
          <Text>Coche</Text>
          <Switch value={switchedCar} onValueChange={(value) => {
            onToggleSwitchCar();
            
          }}/>
          </View>
          <View style = {styles.buttonContainer}>
            <Button
              mode='contained'
              onPress={() => {
                //enviar a bd la fecha, el usuario y si coge coche
                setOpen(!open);
                //addDoc({currentDay})
              }}          
            >Enviar</Button>
        </View>
        
        {open ? <DateTimePicker
        value={date}
        mode='date'
        is24Hour={true}
        display={open}
        onChange={(event, selectedDate) => {
          const currentDate = selectedDate || date;
          //setDate(currentDate);
          setOpen(!open);
          /*setCurrentDay(currentDate.getDate().toString() + "-" + (currentDate.getMonth() + 1).toString() + "-" + currentDate.getFullYear().toString());*/
          
        }}
        
      /> : null } 

    </Modal>

  )
}

const styles = StyleSheet.create({
  buttonContainer:{
    flexDirection: 'row',
    gap: 10,
  },
  optionContainer:{
    flexDirection: 'row',
    gap: 100,
  }
});