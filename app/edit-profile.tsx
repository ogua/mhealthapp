import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";

import { View } from "@/components/Themed";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { siteurl, url } from "@/components/Constants";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Editprofile() {
  const route = useRouter();
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [phone, setphone] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [issubmitting, setissubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [user, setuser] = useState({});
  const [isloading, setisloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getData();
        setuser(userData);
       loaddata(); // Load data only after getting user data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    setisloading(true);
    fetchData(); // Call fetchData to initiate data fetching
  }, []);

  const loaddata = () => {
    setfullname(user?.name);
    setemail(user?.email);
    setphone(user?.phone);
    if (user.avatar !== null) {
      setImg(`${siteurl}/storage/${user?.avatar}`);
    }
    setisloading(false);
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  const checkPermissions = async () => {
    try {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );

      if (!result) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title:
              "You need to give storage permission to download and save the file",
            message: "App needs access to your camera",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the camera");
          return true;
        } else {
          Alert.alert("Error", "Camera permission denied");
          console.log("Camera permission denied");
          return false;
        }
      } else {
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  async function selectFile() {
    try {
      const result = await checkPermissions();

      if (result) {
        const result = await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: false,
        });

        if (!result.canceled) {
          setFile(result);
          setImg(result.assets[0].uri);
        }
      }
    } catch (err) {
      setFile(null);
      console.warn(err);
      return false;
    }
  }

  const Updateprofile = () => {
    if (fullname == "") {
      alert("Fullname Can not be empty!");
      return;
    }

    if (email == "") {
      alert("Email Address Can not be empty!");
      return;
    }

    if (phone == "") {
      alert("Phone number Can not be empty!");
      return;
    }

    console.log("passsword",password);

    if (password !== undefined && password != cpassword) {
        alert("Password does not match!");
        return;
    }

    const data = new FormData();

    if (file != null) {
      data.append("doc", {
        uri: file.assets[0].uri,
        name: file.assets[0].name,
        type: file.assets[0].mimeType,
      });
    }

    setissubmitting(true);

    data.append("fullname", fullname);
    data.append("email", email);
    data.append("phone", phone);
    data.append("password", password);
    data.append("userid", user?.id);

    axios
      .post(url + "/update-user", data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log("response", response.data);
        alert(response.data.message);
        setissubmitting(false);
      })
      .catch(function (error) {
        setissubmitting(false);
        console.log(error);
      });
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerTitle: "Edit Profile",
          headerRight: () => (
            <>
              <Button onPress={loaddata} icon="refresh">Refresh</Button>
            </>
          ),
        }}
      />
      <ScrollView style={{ marginBottom: 30 }}>
        {isloading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <View style={styles.container}>
              <Card>
                <Card.Content>
                  <TouchableOpacity onPress={selectFile}>
                    {img ? (
                      <Avatar.Image
                        source={{ uri: img }}
                        size={100}
                        style={{ alignSelf: "center", marginBottom: 20 }}
                      />
                    ) : (
                      <Avatar.Image
                        source={require("../assets/images/register.png")}
                        size={100}
                        style={{ alignSelf: "center", marginBottom: 20 }}
                      />
                    )}
                  </TouchableOpacity>

                  <TextInput
                    value={fullname}
                    onChangeText={(e) => setfullname(e)}
                    mode="flat"
                    label="Enter Fullname"
                    inputMode="text"
                    style={{ marginBottom: 20 }}
                  />

                  <TextInput
                    value={email}
                    onChangeText={(e) => setemail(e)}
                    mode="flat"
                    label="Enter Email Addresss"
                    inputMode="email"
                    style={{ marginBottom: 20 }}
                  />

                  <TextInput
                    value={phone}
                    onChangeText={(e) => setphone(e)}
                    mode="flat"
                    label="Enter Phone Number"
                    inputMode="numeric"
                    style={{ marginBottom: 20 }}
                  />

                  <TextInput
                    value={password}
                    onChangeText={(e) => setpassword(e)}
                    mode="flat"
                    label="Enter Password"
                    inputMode="text"
                    style={{ marginBottom: 20 }}
                    secureTextEntry
                  />

                  <TextInput
                    value={cpassword}
                    onChangeText={(e) => setcpassword(e)}
                    mode="flat"
                    label="Confirm Password"
                    style={{ marginBottom: 20 }}
                    secureTextEntry
                  />

                  {issubmitting ? (
                    <>
                      <ActivityIndicator size="large" />
                    </>
                  ) : (
                    <>
                      <Button mode="contained" onPress={Updateprofile}>
                        Save
                      </Button>
                    </>
                  )}
                </Card.Content>
              </Card>

              {/* Use a light status bar on iOS to account for the black space above the modal */}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
  },
});
