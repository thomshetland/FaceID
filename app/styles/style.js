// styles/YourStyles.js
import { StyleSheet, Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const cameraHeight = Math.round((windowWidth * 16) / 10);

// Define your styles here
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  permissionHeaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight / 3,
    marginBottom: 30, // Adds spacing between the title and the text
  },
  permissionTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20, // Adds spacing between the message and the button
  },
  permissionButton: {
    backgroundColor: '#557fa8', // Change to desired color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
  imageViewContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loading: {
    marginTop: windowHeight / 20,
  },
  title_load: {
    textAlign: 'center',
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  text_load: {
    textAlign: 'center',
    color: 'black',
    fontSize: 20,
  },
  camera_container: {
    flex: 1,
    backgroundColor: 'black',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 30
  },
  flipButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  takePictureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    marginRight: 190
  },
  camera: {
    flex: 1, // Ensure this is valid
    width: '100%', // Or an explicit numeric value if needed
    height: '100%', // Or an explicit numeric value if needed
  },  
  fullscreenImage: {
    width: windowWidth,
    height: windowWidth * (16/9),
  },
  image: {
    width: windowWidth * 0.8,
    height: windowWidth * 0.8 * (4/3),
  },
  imageContainer: {
    width: windowWidth * 0.8,
    height: windowWidth * 0.8 * (4/3),
    borderRadius: 15,
    overflow: 'hidden',
    margin: 10,
    elevation: 3,
  },
  list: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionContainer: {
    position: 'absolute',
    top: '10%',
    width: '100%',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
});
