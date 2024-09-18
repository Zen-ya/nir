import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';

// Replace this with your actual YouTube Data API key
const API_KEY = 'AIzaSyBZIq0Axw_e5c3-a3WaEuXnhvk33Q9AZaU';

export default function PerformancesScreen() {
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=karaoke+shorts&order=viewCount&type=video&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.items) {
          setVideos(data.items.map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
          })));
        } else {
          alert('No videos found.');
        }
      } catch (error) {
        console.error(error);
        alert('Error fetching YouTube data.');
      }
    };

    fetchVideos();
  }, []);

  const renderItem = ({ item }) => (
    <View style={[styles.videoContainer, { height: screenHeight }]}>
      <YoutubeIframe
        height={screenHeight}
        width={screenWidth} // Make the player full width
        videoId={item.videoId}
        play={selectedVideoId === item.videoId}
        webViewStyle={styles.videoPlayer}
      />
    </View>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://st.depositphotos.com/1433253/4916/i/600/depositphotos_49168073-stock-photo-party-music-background.jpg' }}
      style={styles.container}
    >
      <FlatList
        data={videos}
        keyExtractor={(item) => item.videoId}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        onScroll={(event) => {
          const { contentOffset } = event.nativeEvent;
          const index = Math.floor(contentOffset.y / screenHeight);
          setSelectedVideoId(videos[index]?.videoId);
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    width: '100%',
    justifyContent: 'center', // Center the video in the container
    alignItems: 'center',
  },
  videoPlayer: {
    marginTop: 0,
  },
});
