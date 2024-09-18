import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication'; // Fingerprint library
import * as SecureStore from 'expo-secure-store'; // Secure storage for userId
import { Octicons } from '@expo/vector-icons';
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './Firebase'; // Firebase setup
import FlashMessage, { showMessage } from 'react-native-flash-message';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat } from 'react-native-reanimated';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome or any other icon library
export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = 'http://www.enchanterapiuser.somee.com/api/UsersControllers/';

  const [request, response, promptAsync] = useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          showMessage({
            message: "Google Sign-In Successful",
            type: "success",
          });
          navigation.navigate('Home'); // Navigate to Home after successful sign-in
        })
        .catch((error) => {
          handleError(error, 'Error during Google Sign-In');
        });
    }
  }, [response]);



// RotatingLogo component
const RotatingLogo = () => {
  const rotation = useSharedValue(0);

  // Set up rotation animation
  useEffect(() => {
    rotation.value = withRepeat(
      withSpring(360, { duration: 2000, damping: 1, stiffness: 100 }),
      -1, // Repeat infinitely
      false // No reverse direction
    );
  }, [rotation.value]);

  // Apply animated rotation style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.logoContainer, animatedStyle]}>
      <FontAwesome name="microphone" size={60} color="#111" />
    </Animated.View>
  );
};

  const handleFingerprintAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        showMessage({
          message: "Device does not support fingerprint authentication",
          type: "danger",
        });
        return;
      }




      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        showMessage({
          message: "No fingerprints enrolled on this device.",
          type: "danger",
        });
        return;
      }




      const result = await LocalAuthentication.authenticateAsync();
      if (result.success) {
        const storedUserId = await SecureStore.getItemAsync('userId');
        if (storedUserId) {
          navigation.navigate('Home', { userId: storedUserId, userName: username });
        } else {
          showMessage({
            message: "No stored user data.",
            type: "danger",
          });
        }
      } else {
        showMessage({
          message: "Fingerprint authentication failed",
          type: "danger",
        });
      }
    } catch (error) {
      handleError(error, 'Error during fingerprint authentication');
    }
  };




  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           Accept: 'application/json',
        },
        body: JSON.stringify({ Username: username, Password: password }), // Corrected 'password' to 'Password'
      });

      const userData = await response.json();

      if (response.ok) {
      
        // Store the JSON string
        await SecureStore.setItemAsync('userData', userData.id);
        navigation.navigate('Home', { userId: userData.id, userName: userData.userName });
      } else {
        showMessage({
          message: 'Username or Password incorrect. Please try again.',
          type: "danger",
        });
      }
    } catch (error) {
      showMessage({
        message: 'Error during login. Please try again.',
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
    source={{ uri: 'https://st3.depositphotos.com/1625616/16350/i/600/depositphotos_163500464-stock-photo-purple-halloween-dance-glitter-background.jpg' }} // Replace with your background image URL
    style={styles.background}
    >
      <View style={styles.container}>
       <RotatingLogo />
        <View style={styles.formInputWrapper}>
          <Octicons name="person" size={20} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={styles.formInputWrapper}>
          <Octicons name="shield-lock" size={20} color="black" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.loginButton} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFingerprintAuth} style={[styles.loginButton, styles.fingerprintButton]}>
          <Text style={styles.buttonText}>Login with Fingerprint</Text>
        </TouchableOpacity>

        <View style={styles.authQuestion}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.signupButton}
          >
            <Text style={styles.signupText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
        <FlashMessage position="top" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1, // Full height to cover the entire screen
    width: '100%',
    resizeMode: 'cover', // Ensure the image covers the entire screen
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  container: {
    flex: 1,
    width: '100%', // Full width to ensure alignment within ImageBackground
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20, // Add padding for better content alignment
  },
  formInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 6,
    paddingLeft: 8,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  loginButton: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#17469f',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  fingerprintButton: {
    backgroundColor: '#28a745', // Fingerprint color
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  authQuestion: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  signupButton: {
    borderColor: '#17469f',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  signupText: {
    color: '#17469f',
    fontSize: 16,
  },
});
