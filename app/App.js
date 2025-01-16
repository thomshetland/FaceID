import Cameraview from './CameraView';
import HomeView from './HomeView';
import RegisterView from './RegisterView';
import UserAccountView from './UserAccountView';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import LoginView from "./LoginView";

const Stack = createStackNavigator();

export default function App() {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="FaceId">
            <Stack.Screen name="Home" component={HomeView} options={{headerShown: false}} />
            <Stack.Screen name="Login" component={LoginView} options={{ headerShown: true }}/>
            <Stack.Screen name="Camera" component={Cameraview} options={{ headerShown: true }}/>
            <Stack.Screen name="Register" component={RegisterView} options={{ headerShown: true }}/>
            <Stack.Screen name="UserAccount" component={UserAccountView} options={{ headerShown: true }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}