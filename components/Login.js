import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import auth from "@react-native-firebase/auth"

const LoginPage = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        auth().onAuthStateChanged(user => {
            if (user) {
                navigation.dispatch(StackActions.replace("Todo"))
            }
        })
    })
    const handleLogin = async () => {
        if (email.length == 0) {
            Alert.alert('Email is empty')
            return;
        }
        if (password.length <= 6) {
            Alert.alert("Password length should be greater than 6")
            return;
        }
        try {
            setIsLoading(true)
            const user = await auth().signInWithEmailAndPassword(email, password)
            if (user) {
                navigation.dispatch(StackActions.replace("Todo"))
            }
            setIsLoading(false)
        }
        catch (err) {
            console.log(err)
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>TODO</Text>
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
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.loginText}>LOGIN</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupText}>Create an Account</Text>
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
    loginBtn: {
        width: '80%',
        backgroundColor: '#007bff',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    loginText: {
        color: 'white',
        fontSize: 20,
    },
    signupText: {
        color: '#007bff',
        fontSize: 16,
    },
});

export default LoginPage;
