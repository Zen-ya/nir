import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';

import FlashMessage from 'react-native-flash-message';

import LoginScreen from './App/LoginScreen';
import RegisterScreen from './App/RegisterScreen';
import HomeScreen from './App/HomeScreen';
import ProfileScreen from './App/ProfileScreen';
import AboutScreen from './App/AboutScreen';
import MusicScreen from './App/MusicScreen';
import PerformancesScreen from './App/PerformancesScreen';
import SongScreen from './App/SongScreen';

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Permission to receive notifications was denied.');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push Token:', token);
    return token;
  }

  async function sendTestNotification() {
    if (!expoPushToken) {
      Alert.alert('Error', 'Push token is not available.');
      return;
    }

    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Test Notification',
      body: 'This is a test notification from Karaoke Live!',
      data: { someData: 'goes here' },
    };

    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home">
          {props => <HomeScreen {...props} sendTestNotification={sendTestNotification} />}
        </Stack.Screen>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Music" component={MusicScreen} />
        <Stack.Screen name="SongScreen" component={SongScreen} />
        <Stack.Screen name="Performances" component={PerformancesScreen} />
      </Stack.Navigator>
      <FlashMessage position="top" />
    </NavigationContainer>
  );
}
