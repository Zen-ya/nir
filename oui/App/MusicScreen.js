import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import LottieView from 'lottie-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat } from 'react-native-reanimated';

// Sécurisez votre clé API en utilisant une variable d'environnement
const API_KEY = process.env.YOUTUBE_API_KEY;

const RotatingLogo = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSpring(360, { duration: 2000, damping: 1, stiffness: 100 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.logoContainer, animatedStyle]}>
      <Image source={require('../assets/adaptive-icon.png')} style={styles.logo} />
    </Animated.View>
  );
};

export default function MusicScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [musicList, setMusicList] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const searchYouTube = async () => {
    if (!searchQuery) {
      alert("Please enter a search query.");
      return;
    }

    setLoading(true);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchQuery}&type=video&key=${API_KEY}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        setSearchResults(data.items.map(item => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.default.url,
        })));
      } else {
        alert("No results found.");
        setSearchResults([]);
      }
    } catch (error) {
      alert('Error fetching YouTube data.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSong = (videoId) => {
    if (videoId) {
      setMusicList(prevMusicList => [...prevMusicList, videoId]);
    }
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.searchItem}
      onPress={() => {
        setSelectedVideoId(item.videoId);
        handleAddSong(item.videoId);
      }}
    >
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      </View>
      <Text style={styles.searchTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity style={styles.songItem} onPress={() => setSelectedVideoId(item)}>
      <Text style={styles.songText}>Play Video ID: {item}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://st.depositphotos.com/1433253/4916/i/600/depositphotos_49168073-stock-photo-party-music-background.jpg' }}
      style={styles.container}
    >
      <LottieView
        source={require('../assets/Animation - 1726667532733.json')}
        autoPlay
        loop
        style={[styles.lottieBackground, { width: screenWidth, height: screenHeight }]}
      />
      <View style={styles.overlay}>
        <RotatingLogo />
        <Text style={styles.title}>YouTube Music Search and Play</Text>

        <TextInput
          style={styles.input}
          placeholder="Search for music on YouTube"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <Button title="Search" onPress={searchYouTube} disabled={loading} />

        {loading ? <Text>Loading...</Text> : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.videoId}
            renderItem={renderSearchResult}
            ListEmptyComponent={<Text>No results yet, start searching!</Text>}
          />
        )}

        {selectedVideoId && (
          <YoutubeIframe
            height={200}
            videoId={selectedVideoId}
            play={true}
            webViewStyle={{ marginTop: 20 }}
          />
        )}

        <Text style={styles.subtitle}>Your Playlist</Text>
        <FlatList
          data={musicList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderPlaylistItem}
          ListEmptyComponent={<Text style={styles.emptyList}>No songs added yet.</Text>}
          style={styles.listContainer}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 16,
    textAlign: 'center',
  },
  lottieBackground: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  listContainer: {
    marginVertical: 20,
  },
  songItem: {
    fontSize: 16,
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  songText: {
    fontSize: 16,
  },
  emptyList: {
    textAlign: 'center',
    color: '#888',
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchTitle: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  thumbnailContainer: {
    width: 80,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 60,
    height: 60,
  }
});
