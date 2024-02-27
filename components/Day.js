import React, {useState} from 'react'
import { Text, View } from 'react-native'
import { Button, Switch } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';

const Day = ({today}) => {
today
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Text>Day: {today}</Text>

      <Button icon="calendar" mode="contained" onPress={() => setOpen(true)}>AddRuta</Button>  
      
      {/*Modal seleccionar fecha */}
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false);
          
        }}
        
        />
    </View>
  )
}

export default Day