import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  Touchable,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

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
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "@/components/Constants";
import * as DocumentPicker from "expo-document-picker";

export default function Personnel() {

  const route = useRouter();
  const [fullname, setfullname] = useState("");
  const [speciality, setspeciality] = useState("");
  const [street, setstreet] = useState("");
  const [zipcode, setzipcode] = useState("");
  const [city, setcity] = useState("");
  const [phone, setphone] = useState("");
  const [email, setemail] = useState("");
  const [website, setwebsite] = useState("");
  const [utype, setutype] = useState("Healthcare");
  const [isloading, setLoading] = useState(false);

  const {id} = useLocalSearchParams();

  const [issubmitting, setissubmitting] = useState(false);

  useEffect(() => {

    if (id == undefined) {
    } else {
      loaddata();
    }
  }, []);

  const [user, setuser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getData();
        setuser(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call fetchData to initiate data fetching
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  const loaddata = () => {
    setLoading(true);
  
    axios
      .get(url + "/support-info/" + id, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        console.log(response.data);
        setLoading(false);
        setfullname(response.data.data.name);
        setspeciality(response.data.data.speciality);
        setstreet(response.data.data.street);
        setzipcode(response.data.data.zipcode);
        setcity(response.data.data.city);
        setphone(response.data.data.phone);
        setemail(response.data.data.email);
        setwebsite(response.data.data.website);
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      });
  };

  const savedata = () => {

    if (fullname == "") {
      alert("Name Can not be empty!");
      return;
    }

    if (speciality == "") {
      alert("Email Address Can not be empty!");
      return;
    }

    if (street == "") {
      alert("Street Name Can not be empty!");
      return;
    }

    if (zipcode == "") {
      alert("Zip Code Can not be empty!");
      return;
    }

    if (city == "") {
      alert("City does not matchy!");
      return;
    }

    if (phone == "") {
      alert("Phone does not matchy!");
      return;
    }

    setissubmitting(true);

    const formdata = {
      fullname: fullname,
      speciality,
      street,
      zipcode,
      city,
      phone,
      email,
      website,
      utype,
      userid: user?.id,
    }

    axios
      .post(url + "/add-support", formdata, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        alert(response.data.message);
        setissubmitting(false);
        route.back();
      })
      .catch(function (error) {
        setissubmitting(false);
        console.log(error);
      });
  };

  const updatedata = () => {

    if (fullname == "") {
      alert("Name Can not be empty!");
      return;
    }

    if (speciality == "") {
      alert("Email Address Can not be empty!");
      return;
    }

    if (street == "") {
      alert("Street Name Can not be empty!");
      return;
    }

    if (zipcode == "") {
      alert("Zip Code Can not be empty!");
      return;
    }

    if (city == "") {
      alert("City does not matchy!");
      return;
    }

    if (phone == "") {
      alert("Phone does not matchy!");
      return;
    }

    setissubmitting(true);

    const formdata = {
      fullname: fullname,
      speciality,
      street,
      zipcode,
      city,
      phone,
      email,
      website,
      utype,
      userid: 1,
      id
    };

    axios
      .post(url + "/update-support", formdata, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        alert(response.data.message);
        setissubmitting(false);
        route.back();
      })
      .catch(function (error) {
        setissubmitting(false);
        console.log(error);
      });
  };

  return (
    <View>
      <Stack.Screen
        options={{
          headerTitle: `${
            id != null ? `Edit Pesonnel Info` : `Add Health Personnel`
          }`,
        }}
      />
      <ScrollView>
        <View style={styles.container}>
          {isloading ? (
            <ActivityIndicator size="large" style={{ marginTop: 30 }} />
          ) : (
            <>
              <Card>
                <Card.Content>
                  <TextInput
                    value={fullname}
                    onChangeText={(e) => setfullname(e)}
                    mode="outlined"
                    label="Enter name"
                    inputMode="text"
                    style={{ marginBottom: 20 }}
                  />

                  <TextInput
                    value={speciality}
                    onChangeText={(e) => setspeciality(e)}
                    mode="outlined"
                    label="Enter Speciality"
                    style={{ marginBottom: 20 }}
                  />

                  <TextInput
                    value={street}
                    onChangeText={(e) => setstreet(e)}
                    mode="outlined"
                    label="Enter Street Name"
                    style={{ marginBottom: 20 }}
                  />

                  <TextInput
                    value={zipcode}
                    onChangeText={(e) => setzipcode(e)}
                    mode="outlined"
                    label="Enter Zip Code"
                    inputMode="numeric"
                    style={{ marginBottom: 20 }}
                  />

                  <TextInput
                    value={city}
                    onChangeText={(e) => setcity(e)}
                    mode="outlined"
                    label="Enter City"
                    style={{ marginBottom: 20 }}
                  />

                  <TextInput
                    value={phone}
                    onChangeText={(e) => setphone(e)}
                    mode="outlined"
                    label="Enter Phone"
                    inputMode="tel"
                    style={{ marginBottom: 20 }}
                  />

                  <TextInput
                    value={email}
                    onChangeText={(e) => setemail(e)}
                    mode="outlined"
                    inputMode="email"
                    label="Enter Email"
                    style={{ marginBottom: 20 }}
                  />

                  <TextInput
                    value={website}
                    onChangeText={(e) => setwebsite(e)}
                    mode="outlined"
                    label="Enter Website"
                    style={{ marginBottom: 40 }}
                  />

                  {issubmitting ? (
                    <>
                      <ActivityIndicator size="large" />
                    </>
                  ) : (
                    <>
                      <Button
                        mode="contained"
                        onPress={id == null ? savedata : updatedata}
                      >
                        Save
                      </Button>
                    </>
                  )}
                </Card.Content>
              </Card>
            </>
          )}

          {/* Use a light status bar on iOS to account for the black space above the modal */}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    marginBottom: 30
  },
});
