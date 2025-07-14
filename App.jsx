import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation, badgeCount, setBadgeCount }) {
  const [token, setToken] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.screen === 'Notification') {
          navigation.navigate('Notification');
        }
      });
   

    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage?.data?.screen === 'Notification') {
        navigation.navigate('Notification');
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    messaging().requestPermission();
    messaging().getToken().then(setToken);

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
      );
      const stored = await AsyncStorage.getItem('notifications');
      const history = stored ? JSON.parse(stored) : [];
      history.push(remoteMessage.notification);
      await AsyncStorage.setItem('notifications', JSON.stringify(history));
      setBadgeCount(history.length);
    });

    return unsubscribe;
  }, []);

  const sendNotification = async () => {
    if (!title || !body)
      return Alert.alert('Error', 'Title and Body are required');

    try {
      await fetch('http://192.168.1.4:4000/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          title,
          body,
          data: {
            screen: 'Notification',
          },
        }),
      });

      Alert.alert('Success', 'Notification sent');
      setTitle('');
      setBody('');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Vedaz Notification Sender</Text>
      <TextInput
        style={styles.input}
        placeholder="Notification Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Notification Body"
        value={body}
        onChangeText={setBody}
      />
      <TouchableOpacity style={styles.button} onPress={sendNotification}>
        <Text style={styles.buttonText}>Simulate Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.badgeButton}
        onPress={() => navigation.navigate('Notification')}
      >
        <Text style={styles.badgeText}> Notifications ({badgeCount})</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function NotificationScreen({ setBadgeCount }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const stored = await AsyncStorage.getItem('notifications');
    const history = stored ? JSON.parse(stored) : [];
    setNotifications(history.reverse());
  };

  const deleteNotification = async indexToDelete => {
    const updated = [...notifications];
    updated.splice(indexToDelete, 1);
    await AsyncStorage.setItem(
      'notifications',
      JSON.stringify([...updated].reverse()),
    );
    setNotifications(updated);
    setBadgeCount(updated.length);
  };

  const clearAllNotifications = async () => {
    await AsyncStorage.removeItem('notifications');
    setNotifications([]);
    setBadgeCount(0);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Notification History</Text>

      {notifications.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearAllNotifications}
        >
          <Text style={{ color: 'blue', fontWeight: 'bold' }}> Clear All</Text>
        </TouchableOpacity>
      )}

      {notifications.map((item, index) => (
        <View key={index} style={styles.card}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <TouchableOpacity onPress={() => deleteNotification(index)}>
              <Text style={{ color: 'blue' }}>X</Text>
            </TouchableOpacity>
          </View>
          <Text>{item.body}</Text>
        </View>
      ))}

      {notifications.length === 0 && (
        <Text style={{ marginTop: 30, textAlign: 'center', color: '#888' }}>
          No notifications to show.
        </Text>
      )}
    </ScrollView>
  );
}

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export default function App() {
  const [badgeCount, setBadgeCount] = useState(0);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {props => (
            <HomeScreen
              {...props}
              badgeCount={badgeCount}
              setBadgeCount={setBadgeCount}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Notification">
          {props => (
            <NotificationScreen {...props} setBadgeCount={setBadgeCount} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  badgeButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  clearButton: {
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
});
