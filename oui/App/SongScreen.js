import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Define the API URL
const apiUrl = 'http://www.enchanterapiuser.somee.com/api/Songs'; // Update with your API endpoint

export default function SongScreen() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [newSong, setNewSong] = useState({ SongName: '', Artist: '', LinkSong: '', SongTypeID: '' });

  const genres = [
    { id: 1, name: 'RAP' },
    { id: 2, name: 'HIP-HOP' },
    { id: 3, name: 'JAZZ' },
    { id: 4, name: 'ORIENTAL' },
    { id: 5, name: 'CLASSIC' },
    { id: 6, name: 'DANCEHALL' },
    { id: 7, name: 'REGGAETON' },
  ];

  // Fetch songs from API
  const fetchSongs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/all`);
      if (response.ok) {
        const data = await response.json();
        setSongs(data);
        setFilteredSongs(data);
      } else {
        console.error('Failed to fetch songs');
      }
    } catch (error) {
      console.error('Error fetching songs', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Search handler
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = songs.filter(song =>
        song.songName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(songs);
    }
  };

  // Genre filter handler
  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    if (genreId) {
      const filtered = songs.filter(song => song.songTypeID === parseInt(genreId, 10));
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(songs);
    }
  };

  // Add song handler
  const handleAddSong = async () => {
    try {
      const response = await fetch(`${apiUrl}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSong,
          SongTypeID: parseInt(newSong.SongTypeID, 10) // Ensure SongTypeID is a number
        }),
      });
      if (response.ok) {
        alert('Song added successfully');
        setShowAddSongModal(false);
        fetchSongs(); // Refresh the song list
      } else {
        console.error('Failed to add song');
        alert('Failed to add song');
      }
    } catch (error) {
      console.error('Error adding song', error);
      alert('Error adding song');
    }
  };

  // Delete song handler
  const handleDeleteSong = (songID) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this song?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await fetch(`${apiUrl}/${songID}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                alert('Song deleted successfully');
                fetchSongs(); // Refresh the song list
              } else {
                console.error('Failed to delete song');
                alert('Failed to delete song');
              }
            } catch (error) {
              console.error('Error deleting song', error);
              alert('Error deleting song');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Songs</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.input}
        placeholder="Search by song title"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Genre Picker */}
      <Picker
        selectedValue={selectedGenre}
        onValueChange={handleGenreChange}
        style={styles.picker}
      >
        <Picker.Item label="All Genres" value="" />
        {genres.map(genre => (
          <Picker.Item key={genre.id} label={genre.name} value={genre.id.toString()} />
        ))}
      </Picker>

      {/* Songs List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item.songID ? item.songID.toString() : 'undefined'} // Ensure songID is defined
          renderItem={({ item }) => (
            <View style={styles.songItem}>
              <Text style={styles.songTitle}>{item.songName}</Text>
              <Text style={styles.songArtist}>{item.artist}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteSong(item.songID)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No songs found</Text>}
        />
      )}

      {/* Add Song Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddSongModal(true)}
      >
        <Text style={styles.addButtonText}>Add New Song</Text>
      </TouchableOpacity>

      {/* Add Song Modal */}
      <Modal
        visible={showAddSongModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddSongModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Song</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Song Name"
              value={newSong.SongName}
              onChangeText={(text) => setNewSong({ ...newSong, SongName: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Artist"
              value={newSong.Artist}
              onChangeText={(text) => setNewSong({ ...newSong, Artist: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Link to Song"
              value={newSong.LinkSong}
              onChangeText={(text) => setNewSong({ ...newSong, LinkSong: text })}
            />
            <Picker
              selectedValue={newSong.SongTypeID || ''} // Default to empty string if undefined
              onValueChange={(itemValue) => setNewSong({ ...newSong, SongTypeID: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Select Genre" value="" />
              {genres.map(genre => (
                <Picker.Item key={genre.id} label={genre.name} value={genre.id.toString()} />
              ))}
            </Picker>
            <Button title="Add Song" onPress={handleAddSong} />
            <Button title="Cancel" onPress={() => setShowAddSongModal(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  songItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  songArtist: {
    fontSize: 16,
    color: '#555',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
    marginTop: 20,
  },
});
