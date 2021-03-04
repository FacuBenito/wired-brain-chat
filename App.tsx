import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import PersonalInfo from './components/PersonalInfo';
import Chat from './components/Chat';
import Styles from './components/Styles';

export default function App() {
  const storageUserNameKey = 'chatapp-username';
  const storageImageKey = 'chatapp-image';
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPersonalData = async () => {
    const fetchedUsername = await AsyncStorage.getItem(storageUserNameKey);
    const userName = fetchedUsername == null ? "" : fetchedUsername;
    const fetchedImage = await AsyncStorage.getItem(storageImageKey);
    const image = fetchedImage == null ? "" : fetchedImage;

    setUsername(userName);
    setImage(image);
  };
  
  const onPersonalInfoClosed = async (name: string, image: string) => {
    setUsername(name);
    await AsyncStorage.setItem(storageUserNameKey, name);
    setImage(image);
    await AsyncStorage.setItem(storageImageKey, image);
  };

  if(isLoading){
    return(
      <AppLoading 
        startAsync={fetchPersonalData} 
        onFinish={() => setIsLoading(false)} 
        onError={() => console.log('app loading error')}
      />
    )
  }

  let activeComponent = username != "" ? (
    <Chat username={username} image={image} />
  ) : (
    <PersonalInfo onClosed={onPersonalInfoClosed}/>
  )

  return (
    <SafeAreaView style={Styles.container}>
      {activeComponent}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

