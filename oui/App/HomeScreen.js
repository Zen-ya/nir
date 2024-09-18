import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome or any other icon library

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
      <FontAwesome name="music" size={60} color="#fff" />
    </Animated.View>
  );
};

// MenuButton component
const MenuButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.menuButton}>
    <Text style={styles.menuButtonText}>{title}</Text>
  </TouchableOpacity>
);

const GridItem = ({ title, description, onPress, animationSource }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, { damping: 2, stiffness: 100 }) }],
  }), [scale.value]);

  return (
    <Animated.View style={[styles.gridItem, animatedStyle]}>
      <TouchableOpacity
        onPressIn={() => (scale.value = 0.95)}
        onPressOut={() => (scale.value = 1)}
        onPress={onPress}
        style={styles.gridButton}
      >
        <LottieView
          source={animationSource}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.gridTitle}>{title}</Text>
        <Text style={styles.gridDescription}>{description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function HomeScreen({ route }) {
  const navigation = useNavigation();
  const { userId = 'Unknown', userName = 'User' } = route.params || {};
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  if (userId === 'Unknown') {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error. User not found ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background Animation */}
      <LottieView
        source={require('../assets/Animation - 1726669560963.json')} // Ensure this file exists in the correct path
        autoPlay
        loop
        style={[styles.lottieBackground, { width: screenWidth, height: screenHeight }]}
      />
      
      {/* Menu Buttons */}
      <View style={styles.menuContent}>
        <ScrollView horizontal contentContainerStyle={styles.menuContainer}>
          <MenuButton title="Profile" onPress={() => navigation.navigate('Profile', { userId })} />
          <MenuButton title="Order New Song" onPress={() => navigation.navigate('Music', { userId })} />
          <MenuButton title="Performances" onPress={() => navigation.navigate('Performances', { userId })} />
          <MenuButton title="About" onPress={() => navigation.navigate('About')} />
        </ScrollView>
      </View>
      
      {/* Welcome Text */}
      <Text style={styles.welcomeText}>
        Welcome, {userName}!
        {"\n"}Your ID is: {userId}
      </Text>

      {/* Grid Items */}
      <ScrollView style={styles.gridContainer}>
        <GridItem
          title="Your Performances"
          description="View and manage your performances"
          onPress={() => navigation.navigate('Performances', { userId })}
          animationSource={require('../assets/Animation - 1726664948066.json')} // Replace with your animation file
        />
        <GridItem
          title="Songs in the System"
          description="Find or post a new song"
          onPress={() => navigation.navigate('SongScreen')}
          animationSource={require('../assets/Animation - 1726664948066.json')} // Replace with your animation file
        />
        <RotatingLogo />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Added background color for better visibility
  },
  lottieBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  menuContent: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the menu horizontally
    marginTop: 50,
  },
  menuContainer: {
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: '#ffffffaa',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  menuButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  welcomeText: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
    padding: 10,
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  gridItem: {
    flex: 1,
    marginBottom: 20,
  },
  gridButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000af',
    borderRadius: 10,
    padding: 20,
  },
  gridTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  gridDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  animation: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});
