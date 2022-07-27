import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import {Audio} from 'expo-av';
import Task from './components/Task';
export default function App() {
  // This will be a recording  variable that will hold  the current  recording
  const [recording, setRecording] = React.useState();
  // This will be for the saved recording
  const[recordings, setRecordings] = React.useState([]);
  // This will be for the message to show if anything happens on the microphone
  const [message, setMassage]= React.useState("");

  async function startRecording(){
    // for the user to start recording the user must request the mic
    try{
      const permission = await Audio.requestPermissionsAsync();
      // if the permission is granted then start recording
      if(permission.status==="granted"){
        await Audio.setAudioModeAsync({
          allowRecordingIOS:true,
          playsInSilentModeIOS:true
        });
        const {recording}= await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      }else{
        setMassage('Please grant permission to app to access microphone')
      }
    }catch(err){
      console.log('Failed to start recording', err);
    }
  }
  async function stopRecording(){
    // When stop recording set the recoding to udefined
    setRecording(undefined)
    // stop and upload async
    await recording.stopAndUnloadAsync();
    // and get the existing recordings
    let updatedRecordings=[...recordings];
    // creat sound and use its status by using the recoding that has been created 
    const[sound, status] = await recording.createNewLoadedSoundAsync();
    // add to the updated recording
    updatedRecordings.push({
      // sound will be sound 
      sound: sound,
      // duration this is how long it will to play
      duration: getDurationFormatted(status.durationMillis),
      // This will be usefull when a user wants to download the audio to the phone
      file: recording.getURI()
    });
    setRecordings(updatedRecordings);


  }
  // function for getting the duration
  function getDurationFormatted(millis){
// calculate from millsecond to minutes and seconds
const minutes= millis/1000/60;
 const minutesDisplay = Math.floor(minutes);  
 const seconds = Math.round((minutes-minutesDisplay)*60);
 const secondsDisplay = seconds <10 ? `0${seconds}` :seconds;
 return `${minutesDisplay}:${secondsDisplay}`;
  }
  // function to display recording lines 
  function getRecordingLines(){
    return recordings.map((recordingLine, index)=>{
      return(
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>Recording{index + 1} - {recordingLine.duration}</Text>
        {/* Add the button and paly the audio when the user is willing to  */}
        <Button style={styles.button} onPress={()=> recordingLine.sound.replayAsync()}title="Play">

        </Button>
        </View>
      )
    })
  }
  return (
    <View style={styles.container}>
    {/* This must notify the user to hold a mic inorder to record */}
    <Text>{message}</Text>
    {/* Button to control whether i am recording or not  e.g allow the user to start recording or stop recording*/}
    <Button title={recording ? 'Stop Recording' :'Start Recording' }
    
    // this two functions will control whether the user have start recocnding or stopped recording
    onPress={recording ? stopRecording : startRecording}
    >

    </Button>
{getRecordingLines()}
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
   
  },
  
      row:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'center',
      },
      fill:{
        flex:1, 
        margin:16
      },
      button:{
        margin:16
      }
});
