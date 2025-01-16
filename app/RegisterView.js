import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';

export default function RegisterView({ navigation }) {
    const [name, setName] = useState('');
    const [isChecked, setChecked] = useState(false);

    const handleNavigateToCamera = () => {
        if (!name) {
            Alert.alert("Please fill in name.");
        } else if (!isChecked) {
            Alert.alert("Please confirm that you understand the photo guidelines.");
        } else {
            // Navigate to CameraView with email and full_name as route params
            navigation.navigate('Camera', { name, action: 'register' });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register with FaceID</Text>
 
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />

            {/* Instructional Message */}
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
                    title="Press to register with 'FaceID'"
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
    buttonContainer: {
        width: '80%',
    },
});
