import { StatusBar } from 'expo-status-bar';
import { Image, ImageBackground, Platform, StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import { ActivityIndicator, Avatar, Button, Card, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Stack, useFocusEffect, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectName, setName } from '@/features/userSlice';
import axios from 'axios';
import { url } from '@/components/Constants';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const route = useRouter();

   const [email, setemail] = useState("");
   const [password, setpassword] = useState("");
   const [issumit, Setsubmiitting] = useState(false);
   const emailref = useRef();
   const router = useRouter();

  useFocusEffect(() => {
    const checkUserData = async () => {
      const userData = await getData();
      if (userData !== null) {
        router.replace("/(tabs)");
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

  const storeUserData = async (userData) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      console.log("Data stored successfully");
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };


  const Userlogin = async () => {
    
    if (email == "") {
      return;
    }

    if (password == "") {
      return;
    }

    Setsubmiitting(true);

    const formdata = {
      email: email,
      password: password,
    };

    axios
      .post(url + "/auth-login", formdata, {
        headers: { Accept: "application/json" },
      })
      .then(async (response) => {

        if (response.data.error) {
          alert(response.data.message);
          Setsubmiitting(false);
        } else {
          storeUserData(response.data.user);
          Setsubmiitting(false);
          router.push("/(tabs)");
        }
      })
      .catch(function (error) {
        Setsubmiitting(false);
        console.log(error);
      });
  };


  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "User Login",
        }}
      />
      <Card>
        <Card.Content>
          <Avatar.Image
            size={150}
            source={require("../assets/images/register.png")}
            style={{ alignSelf: "center", marginBottom: 20 }}
          />

          <TextInput
            mode="outlined"
            label="Enter Email Addresss"
            ref={emailref}
            inputMode="email"
            value={email}
            onChangeText={(e) => setemail(e)}
            style={{ marginBottom: 20 }}
          />

          <TextInput
            mode="outlined"
            label="Enter Password"
            value={password}
            onChangeText={(e) => setpassword(e)}
            inputMode="text"
            style={{ marginBottom: 20 }}
          />

          {issumit ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <Button mode="contained" onPress={Userlogin}>
                Login
              </Button>
            </>
          )}

          <Button
            style={{ marginVertical: 20 }}
            onPress={() => route.push("/register")}
          >
            DONT HAVE AN ACCOUNT ? (REGISTER)
          </Button>
        </Card.Content>
      </Card>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
 
});
