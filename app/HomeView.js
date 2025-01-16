import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeView({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to JAMAIO!</Text>
            <View style={styles.buttonContainer}>
                <Button style={styles.buttonText} title="Login" onPress={() => navigation.navigate('Login')}/>
            </View>
            <View style={styles.buttonContainer}>
                <Button style={styles.buttonText} title="Register" onPress={() => navigation.navigate('Register')}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    buttonContainer: {
        width: '80%',
    },
});
