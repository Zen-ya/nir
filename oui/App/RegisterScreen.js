import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import LottieView from 'lottie-react-native';
import { showMessage } from 'react-native-flash-message';

// Screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Validation Functions
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) =>
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
const validatePhone = (phone) => /^\+?\d{10,15}$/.test(phone); // General phone validation



export default function Register({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // API endpoint (replace with your actual API URL)
  const apiUrl = 'http://www.enchanterapiuser.somee.com/api/UsersControllers/';

  // Handle date change from DateTimePicker
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  // Handle user registration
  const handleRegister = async () => {
    // Input validations
    if (!username.trim()) {
      showMessage({
        message: 'Please enter your username.',
        type: 'warning',
      });
      return;
    }
    if (!validateEmail(email)) {
      showMessage({
        message: 'Invalid email format.',
        type: 'danger',
      });
      return;
    }
    if (!validatePhone(phone)) {
      showMessage({
        message: 'Invalid phone number.',
        type: 'danger',
      });
      return;
    }
    if (!validatePassword(password)) {
      showMessage({
        message:
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          userName: username,
          email,
          phone,
          password,
          birthday: birthday.toISOString().split('T')[0], // Format as YYYY-MM-DD
        }),
      });

      if (response.ok) {
        showMessage({
          message: 'Registration Successful',
          type: 'success',
        });
        navigation.navigate('Login');
      } else {
        const errorResult = await response.text();
        showMessage({
          message: `Registration Failed: ${errorResult}`,
          type: 'danger',
        });
      }
    } catch (error) {
      showMessage({
        message: `Error: ${error.message}`,
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://st3.depositphotos.com/1625616/16350/i/600/depositphotos_163500464-stock-photo-purple-halloween-dance-glitter-background.jpg' }}
      style={styles.container}
    >
      {/* Username Input */}
      <View style={styles.formInputWrapper}>
        <Octicons name="person" size={20} color="black" />
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="#777"
          cursorColor="#000"
        />
      </View>

      {/* Email Input */}
      <View style={styles.formInputWrapper}>
        <Octicons name="mail" size={20} color="black" />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#777"
          keyboardType="email-address"
          cursorColor="#000"
        />
      </View>

      {/* Phone Input */}
      <View style={styles.formInputWrapper}>
        <Octicons name="device-mobile" size={20} color="black" />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone Number"
          placeholderTextColor="#777"
          keyboardType="phone-pad"
          cursorColor="#000"
        />
      </View>

      {/* Password Input */}
      <View style={styles.formInputWrapper}>
        <Octicons name="shield-lock" size={20} color="black" />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#777"
          secureTextEntry
          cursorColor="#000"
        />
      </View>

      {/* Birthday Picker */}
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDatePicker(true)}
      >
        <Octicons name="calendar" size={20} color="black" />
        <Text style={styles.dateText}>
          {birthday ? birthday.toISOString().split('T')[0] : 'Select Birthday'}
        </Text>
      </TouchableOpacity>

      {/* DateTimePicker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={birthday}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}

      {/* Register Button */}
      <TouchableOpacity
        onPress={handleRegister}
        style={styles.registerButton}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      {/* Navigate to Login */}
      <View style={styles.authQuestion}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.signupButton}
        >
          <Text style={styles.signupText}>Already have an Account?</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 55,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    marginBottom: 15,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 55,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    marginBottom: 15,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#000',
  },
  registerButton: {
    width: '90%',
    paddingVertical: 15,
    backgroundColor: '#17469f',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  authQuestion: {
    width: '90%',
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
