import React from 'react'
import LoginPage from './components/Login'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SignupPage from './components/Signup'
import TodoListPage from './components/Todo'
import Splash from './components/Splash'
const Stack = createStackNavigator()
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name="Todo" component={TodoListPage} />
        <Stack.Screen name="SplashScreen" component={Splash} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
