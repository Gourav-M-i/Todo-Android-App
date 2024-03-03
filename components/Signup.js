import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth'
import firestore from "@react-native-firebase/firestore"

const SignupPage = () => {
    const navigation = useNavigation()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const handleSignup = async () => {
        if (username.length == 0) {
            Alert.alert("Username cannot be empty");
            return;
        }
        if (email.length == 0) {
            Alert.alert("Email cannot be empty");
            return;
        }
        if (password.length <= 6) {
            Alert.alert("Password length minimum be 6");
            return;
        }
        try {
            setIsLoading(true)
            const user = await auth().createUserWithEmailAndPassword(email, password)
            if (user) {
                try {
                    await firestore().collection("users").doc(user.user.uid).set({ email, todo: [] })
                }
                catch (err) {
                    console.log(err)
                }
            }
            setIsLoading(false)
        } catch (err) {
            console.log(err)
        }

    }
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>TODO</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Username"
                    placeholderTextColor="#003f5c"
                    value={username}
                    onChangeText={(value) => setUsername(value)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={(value) => setEmail(value)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(value) => setPassword(value)}
                />
            </View>
            <TouchableOpacity style={styles.signupBtn} disabled={isLoading}>
                {isLoading ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.signupText} onPress={handleSignup}>SIGN UP</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontWeight: 'bold',
        fontSize: 50,
        color: '#007bff',
        marginBottom: 40,
    },
    inputView: {
        width: '80%',
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 20,
    },
    inputText: {
        height: 50,
        color: 'black',
    },
    signupBtn: {
        width: '80%',
        backgroundColor: '#007bff',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    signupText: {
        color: 'white',
        fontSize: 20,
    },
    loginText: {
        color: '#007bff',
        fontSize: 16,
    },
});

export default SignupPage;
