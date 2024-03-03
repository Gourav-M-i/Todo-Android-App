import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions, Alert } from 'react-native';
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import { StackActions, useNavigation } from '@react-navigation/native';

const TodoListPage = () => {
    const user = auth().currentUser
    const navigation = useNavigation()
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    const [userId, setUserId] = useState(null)

    const getTodos = async () => {
        const res = await firestore().collection('users').doc(user.uid).get()
        if (res._data) {
            setTodos(res._data.todo)
            setUserId(user.uid)
        }
    }


    useEffect(() => {
        if (user)
            getTodos()
    }, [user])

    const handleAddTodo = async () => {
        if (text.trim() !== '') {
            const newTodo = { id: Date.now(), text: text };
            await firestore().collection('users').doc(userId).update({ todo: [...todos, newTodo] })
            setTodos(prevTodos => [...prevTodos, newTodo]);
            setText('');
        }
    };

    const handleDelete = (id) => {
        Alert.alert("Hi", "Do you want to delete",
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        const newTodo = todos.filter((item) => item.id != id)
                        setTodos(newTodo)
                        await firestore().collection('users').doc(userId).update({ todo: newTodo })
                    },
                },
            ])
    }

    const handleLogout = async () => {
        await auth().signOut();
        navigation.dispatch(StackActions.replace("Login"))
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Todo List</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a new todo..."
                    value={text}
                    onChangeText={(value) => setText(value)}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={todos}
                renderItem={({ item }) => (
                    <TouchableOpacity onLongPress={() => handleDelete(item.id)}>
                        <View style={styles.todoItem}>
                            <Text style={styles.textStyle}>{item.text}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black'
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: 40,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'black'
    },
    addButton: {
        backgroundColor: '#007bff',
        marginLeft: 10,
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    todoItem: {
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    textStyle: { color: 'black' },
    emptyList: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    logoutButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    logoutText: {
        color: '#007bff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TodoListPage;