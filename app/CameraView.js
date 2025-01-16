import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useIsFocused } from '@react-navigation/native';
import { styles } from './styles/style';
import Icon from "react-native-ico-material-design";

const SERVER_URL = 'http://172.20.10.4:5000';

export default function Cameraview({ navigation, route }) {
  const [type, setType] = useState('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [photoCount, setPhotoCount] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

  const { name, action } = route.params;

  // Angle instructions
  const angleInstructions = [
    { label: "Look Straight Ahead" },
    { label: "Turn Head to the Left" },
    { label: "Turn Head to the Right" },
    { label: "Look Upward" },
    { label: "Look Downward" },
  ];

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission is required to continue.</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1.0,
        base64: true,
      });

      // just commented them out, they were for debugging
      // const folderPath = `${FileSystem.documentDirectory}testFaces/`;
      // await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });

      if (action === 'login') {
        await handleLogin(photo.uri);
      } else if (action === 'register') {
        // Commented out code to save the photo in the testFaces folder
        // const savedPhotoUri = `${folderPath}${name}_photo${photoCount + 1}.jpg`;
        // await FileSystem.copyAsync({ from: photo.uri, to: savedPhotoUri });

        const updatedPhotos = [...photos, photo.uri];
        setPhotos(updatedPhotos);
        console.log('Photos array after taking a picture:', updatedPhotos); // debug log

        setPhotoCount(photoCount + 1); // update the photoCount

        if (photoCount + 1 === 5) {
          console.log('All photos taken. Uploading photos...');
          await uploadPhotos(updatedPhotos); // Pass updated photos directly to ensure all are uploaded
        } else if (photoCount + 1 < 5) {
          Alert.alert(`Photo ${photoCount + 1} taken. ${angleInstructions[photoCount + 1].label}`);
        } else {
          console.error('Photo count exceeded instructions length.');
        }
      }
    }
  }


  // function to handle login, takes in a photo as a paramtere and uses uploadPhoto to send image and name to backend/model
  async function handleLogin(photoUri) {
    setIsLoading(true);
  
    // data 
    let formData = new FormData();
    formData.append('image', {
      uri: photoUri,
      type: 'image/jpeg',
      name: 'login_photo.jpg',
    });
  
    try {
      const response = await fetch(`${SERVER_URL}/faceid`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
  
      const { name, confidence } = data;
      
      // check the return value from the backend
      // the confidence can be adjusted here
      if (name === 'unknown' || confidence <= 60.00) {
        Alert.alert('Login Failed', 'Face not recognized or confidence too low.');
      } else {
        Alert.alert('Login Successful', `Welcome, ${name}!`);
        navigation.navigate('UserAccount', { userName: name });
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }
  
  // function to send the image and name to the backend
  async function uploadPhotos(photoUris) {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name); // Ensure the name is sent

      console.log('Photos being uploaded:', photoUris); // Debug log

      // Add all images to the 'images[]' field
      photoUris.forEach((photoUri, index) => {
        console.log(`Appending photo ${index + 1}: ${photoUri}`); // Debug log for each image
        formData.append('images[]', {
          uri: photoUri,
          type: 'image/jpeg',
          name: `photo_${index + 1}.jpg`,
        });
      });

      console.log('Uploading photos with the following form data:', formData);

      const response = await fetch(`${SERVER_URL}/register`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload photos.');
      }

      Alert.alert('Registration Successful', 'Your account has been created.');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error during photo upload:', error.message);
      Alert.alert('Error', error.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);

      // Clean up local files after upload
      await Promise.all(photoUris.map(photoUri => FileSystem.deleteAsync(photoUri)));
    }
  }

  function flipCamera() {
    setType(current => (current === 'back' ? 'front' : 'back'));
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize: 28, fontWeight: 'bold' }}>
          {action === 'login' ? 'Logging in...' : 'Registering...'}
        </Text>
        <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#0859A8FF" />
      </View>
    );
  }

  return (
    <View style={styles.camera_container}>
      {isFocused && <CameraView ref={cameraRef} ratio="16:9" style={styles.camera} facing={type} />}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
          <Icon name="synchronization-button-with-two-arrows" color="white" width="40" height="40" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.takePictureButton} onPress={takePicture}>
          <Icon name="radio-on-button" color="white" width="65" height="65" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
