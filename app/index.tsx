import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, Platform, StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { useEffect } from 'react';

export default function StartupScreen() {
  const route = useRouter();

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }
  }



  useFocusEffect(() => {
    const checkUserData = async () => {
      const userData = await getData();
      if (userData !== null) {
        route.replace("/(tabs)");
      }
    };

    checkUserData();
  });

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };


  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/startscreen.jpg")}
        style={{
          width: 150,
          height: 150,
          objectFit: "fill",
          marginBottom: 20,
          alignSelf: "center",
        }}
      />
      <Text style={{ fontSize: 20, fontWeight: "700", textAlign: "center" }}>
        Track Your Health Status
      </Text>
      <Button
        mode="contained"
        style={{ marginTop: 40 }}
        onPress={() => route.push("/register")}
      >
        CREATE AN ACCOUNT
      </Button>
      <Button
        mode="contained"
        style={{ marginTop: 20 }}
        onPress={() => route.push("/login")}
      >
        LOGIN
      </Button>
      
      {/* <Button
        mode="contained"
        style={{ marginTop: 20 }}
        onPress={() => route.push("/(tabs)")}
      >
        Menu
      </Button> */}
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
 
});
