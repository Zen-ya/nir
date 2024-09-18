import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  Dimensions, Image, ScrollView, StyleSheet
} from 'react-native';
import LottieView from 'lottie-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';  // Import Snackbar

// Import all avatars statically
import avatar1 from '../assets/Avatar/avatar1.png';
import avatar2 from '../assets/Avatar/avatar2.png';
import avatar3 from '../assets/Avatar/avatar3.png';
import avatar4 from '../assets/Avatar/avatar4.png';
import avatar5 from '../assets/Avatar/avatar5.png';
import avatar6 from '../assets/Avatar/avatar6.png';
import avatar7 from '../assets/Avatar/avatar7.png';
import avatar8 from '../assets/Avatar/avatar8.png';
import avatar9 from '../assets/Avatar/avatar9.png';
import avatar10 from '../assets/Avatar/avatar10.png';
import avatar11 from '../assets/Avatar/avatar11.png';
import avatar12 from '../assets/Avatar/avatar12.png';

export default function ProfileScreen({ route, navigation }) {
  const { userId } = route.params;
  const [user, setUser] = useState({
    userName: '',
    email: '',
    phone: '',
    password: '',
    birthday: '',
    AvatarUrl: '', // Store the avatar path
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user.AvatarUrl); // Default Avatar
  const [snackbarVisible, setSnackbarVisible] = useState(false); // Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const [snackbarType, setSnackbarType] = useState('success'); // Snackbar type ('success' or 'error')
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const apiUrl = 'http://www.enchanterapiuser.somee.com/api/UsersControllers/';

  const avatars = [
    { id: 1, path: '../assets/Avatar/avatar1.png', source: avatar1 },
    { id: 2, path: '../assets/Avatar/avatar2.png', source: avatar2 },
    { id: 3, path: '../assets/Avatar/avatar3.png', source: avatar3 },
    { id: 4, path: '../assets/Avatar/avatar4.png', source: avatar4 },
    { id: 5, path: '../assets/Avatar/avatar5.png', source: avatar5 },
    { id: 6, path: '../assets/Avatar/avatar6.png', source: avatar6 },
    { id: 7, path: '../assets/Avatar/avatar7.png', source: avatar7 },
    { id: 8, path: '../assets/Avatar/avatar8.png', source: avatar8 },
    { id: 9, path: '../assets/Avatar/avatar9.png', source: avatar9 },
    { id: 10, path: '../assets/Avatar/avatar10.png', source: avatar10 },
    { id: 11, path: '../assets/Avatar/avatar11.png', source: avatar11 },
    { id: 12, path: '../assets/Avatar/avatar12.png', source: avatar12 },
  ];




  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}${userId}`);
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);

        // Check if the user has a custom avatar, and if so, display it
        if (userData.avatarUrl && userData.avatarUrl.trim() !== '') {
          setSelectedAvatar(avatar2);
         console.log(userData.avatarUrl);
        } else {
          setSelectedAvatar(avatar7); // Default Avatar
        }
      } else {
        setErrorMessage('Failed to retrieve user data');
        showSnackbar('Failed to retrieve user data', 'error');
      }
    } catch (error) {
      setErrorMessage('Error fetching user data');
      showSnackbar('Error fetching user data', 'error');
    } finally {
      setIsLoading(false);
    }
  };




  useEffect(() => {
    fetchUserData();
  }, [userId]);





  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const avatarUrl = selectedAvatar.uri ? selectedAvatar.uri : user.AvatarUrl; // Ensure AvatarUrl is stored
      const updatedUser = { 
        ...user, 
        AvatarUrl: avatarUrl, 
        birthday: user.birthday
      };
      const response = await fetch(`${apiUrl}${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        showSnackbar('Profile updated successfully', 'success');
      } else {
        const errorMessage = await response.text();
        console.error(errorMessage);
        showSnackbar('Failed to update profile', 'error');
      }
    } catch (error) {
      showSnackbar('Error updating profile', 'error');
    } finally {
      setIsUpdating(false);
    }
  };



  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar.source);
    setUser({ ...user, AvatarUrl: avatar.path }); // Update AvatarUrl in the user state
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    const currentDate = selectedDate || new Date(user.birthday);
    setUser({ ...user, birthday: currentDate.toISOString().split('T')[0] });
  };

  const showSnackbar = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/Animation - 1726665594889.json')}
        autoPlay
        loop
        style={[styles.lottieBackground, { width: screenWidth, height: screenHeight }]}
      />
      
      <Text style={styles.title}>Profile</Text>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}> Logout </Text>
        <AntDesign name="logout" size={24} color="rgb(255, 0, 0)" />
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      ) : errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          {/* Avatar display based on condition */}
          <View style={styles.avatarContainer}>
            <Image source={selectedAvatar}  style={styles.avatar} />
          </View>

          <TextInput
            style={styles.input}
            value={user.userName}
            onChangeText={(text) => setUser({ ...user, userName: text })}
            placeholder="Username"
            placeholderTextColor="#777"
          />
          <TextInput
            style={styles.input}
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
            placeholder="Email"
            keyboardType="email-address"
            placeholderTextColor="#777"
          />
          <TextInput
            style={styles.input}
            value={user.phone}
            onChangeText={(text) => setUser({ ...user, phone: text })}
            placeholder="Phone"
            keyboardType="phone-pad"
            placeholderTextColor="#777"
          />
          <TextInput
            style={styles.input}
            value={user.password}
            onChangeText={(text) => setUser({ ...user, password: text })}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#777"
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
            <Text style={styles.dateText}>
              {user.birthday ? new Date(user.birthday).toLocaleDateString() : 'Select Birthday'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(user.birthday || Date.now())}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <Text style={styles.avatarSelectionTitle}>Select Avatar</Text>
          <ScrollView horizontal contentContainerStyle={styles.avatarScroll} showsHorizontalScrollIndicator={false}>
            {avatars.map((avatar) => (
              <TouchableOpacity key={avatar.id} onPress={() => handleAvatarSelect(avatar)}>
                <Image source={avatar.source} style={styles.avatarOption} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={handleUpdateProfile}
            style={styles.updateButton}
            disabled={isUpdating}
          >
            <Text style={styles.updateButtonText}>
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        style={{ backgroundColor: snackbarType === 'success' ? 'green' : 'red' }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  lottieBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  dateInput: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  dateText: {
    color: '#555',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: '#ccc',
    borderWidth: 2,
  },
  avatarSelectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  avatarScroll: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 5,
  },
  updateButton: {
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'rgb(255, 0, 0)',
    fontWeight: 'bold',
    marginRight: 8,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
});
