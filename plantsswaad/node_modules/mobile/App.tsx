import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();

// Temporary mock screens
const HomeScreen = () => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>PlantsSwaad</Text>
    <Text style={styles.subtitle}>Swad Jo Dil Ko Chhoo Jaye</Text>
    <View style={styles.cardPlaceholder}>
      <Text style={styles.cardText}>3D Category Scroll Here</Text>
    </View>
  </SafeAreaView>
);

const MenuScreen = () => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Menu</Text>
    <Text style={styles.subtitle}>Explore Our Dishes</Text>
  </SafeAreaView>
);

const CartScreen = () => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Cart</Text>
  </SafeAreaView>
);

const OrdersScreen = () => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Live Orders</Text>
  </SafeAreaView>
);

const ProfileScreen = () => (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Profile</Text>
  </SafeAreaView>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#468f71', // nature-500
          tabBarInactiveTintColor: '#bedece', // nature-200
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Menu" component={MenuScreen} />
        <Tab.Screen name="Cart" component={CartScreen} />
        <Tab.Screen name="Orders" component={OrdersScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf7f3', // earth-50
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#24493c', // nature-800
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#468f71', // nature-500
    marginBottom: 32,
    fontStyle: 'italic',
  },
  cardPlaceholder: {
    width: '90%',
    height: 200,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardText: {
    color: '#a36336', // earth-600
    fontWeight: '600',
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    height: 60,
    paddingBottom: 8,
  }
});
