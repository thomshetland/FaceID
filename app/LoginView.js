import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Checkbox from "expo-checkbox";

export default function LoginView({ navigation }) {
    const [isChecked, setChecked] = useState(false); // variable to chekc if user agrees with the terms

    // checks if user agrees to the terms before redirecting them to the cameraview
    const handleNavigateToCamera = () => {
        if (!isChecked) {
            Alert.alert("Please confirm that you understand the photo guidelines.");
        } else {
            navigation.navigate('Camera', { action: 'login' });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login with FaceID</Text>
            <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsText}>
                    For best results, ensure you are in a well-lit area and have a white or plain background.
                </Text>
                <View style={styles.checkboxContainer}>
                    <Checkbox
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={setChecked}
                    />
                    <Text style={styles.checkboxLabel}>I understand the guidelines.</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    style={styles.buttonText}
                    title="Press to login with 'FaceID'"
                    onPress={handleNavigateToCamera}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        marginBottom: 15,
        borderRadius: 5,
    },
    instructionsContainer: {
        width: '80%',
        marginVertical: 20,
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
    },
    instructionsText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },

    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    buttonContainer: {
        width: '80%',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    checkbox: {
        marginRight: 8,
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#333',
    },
});
