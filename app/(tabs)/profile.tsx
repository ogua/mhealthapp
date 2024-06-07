import { Platform, SafeAreaView, ScrollView, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Appbar, Avatar, Button, Card, Divider, Switch } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { siteurl, url } from "@/components/Constants";

export default function ProfileScreen() {
  
   const [user, setuser] = useState({});
   const router = useRouter();

   const [ismsSwitch, setismsSwitch] = useState(false);
   const enablesms = () => setismsSwitch(!ismsSwitch);

   const [notify, setnotify] = useState(false);
   const enablenotification = () => setnotify(!notify);

   useEffect(() => {
     const fetchData = async () => {
       try {
         const userData = await getData();
         setuser(userData);
         //loaddata(); // Load data only after getting user data
       } catch (error) {
         console.error("Error fetching data:", error);
       }
     };

     fetchData(); // Call fetchData to initiate data fetching
   }, []);

   useFocusEffect(() => {
     const checkUserData = async () => {
       const userData = await getData();
       if (userData == null) {
         router.replace("/login");
       }
     };

     checkUserData();
   });

   const getData = async () => {
     try {
       const jsonValue = await AsyncStorage.getItem("userData");
       const smsalert = await AsyncStorage.getItem("smsalert");
       const systemalert = await AsyncStorage.getItem("systemalert");
       setismsSwitch(smsalert == "true" ? false : true);
       setnotify(systemalert == "true" ? false : true);

       //console.log("smsalert", smsalert);
       //console.log("systemalert", systemalert);
       return jsonValue != null ? JSON.parse(jsonValue) : null;
     } catch (e) {
       // error reading value
     }
   };

   const logout = async () => {
     try {
       const ans = await AsyncStorage.removeItem("userData");
       router.replace("/login");
     } catch (e) {
     }
   };


   const setsmsnotification = () => {
     try {
       AsyncStorage.setItem("smsalert", ismsSwitch ? "true" : "false");
       setismsSwitch(!ismsSwitch);
       console.log("working", ismsSwitch);
     } catch (e) {}
   };


   const setsystemnotification = async () => {
     try {
       //console.log("notify",notify);
       await AsyncStorage.setItem("systemalert",notify ? "true" : "false");
       setnotify(notify ? false : true);
     } catch (e) {}
   };

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Profile" />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>

      <ScrollView style={{ flex: 1, padding: 15 }}>
        {user?.avatar ? (
          <>
            <Avatar.Image
              size={150}
              source={{ uri: `${siteurl}/storage/${user?.avatar}` }}
              style={{ alignSelf: "center" }}
            />
          </>
        ) : (
          <>
            <Avatar.Image
              size={100}
              source={require("../../assets/images/register.png")}
              style={{ alignSelf: "center" }}
            />
          </>
        )}

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            marginTop: 10,
          }}
        >
          <Text>Username: </Text>
          <Text>{user?.name}</Text>
        </View>

        <Divider style={{ marginVertical: 3 }} />

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Text>Email: </Text>
          <Text>{user?.email}</Text>
        </View>

        <Divider style={{ marginVertical: 3 }} />

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Text>Phone: </Text>
          <Text>{user?.phone}</Text>
        </View>

        <Button
          mode="outlined"
          style={{ marginTop: 20 }}
          icon="pencil"
          onPress={() => router.push("/edit-profile")}
        >
          Edit
        </Button>

        <Divider style={{ marginVertical: 15 }} />

        <Text style={{ marginBottom: 5, marginTop: 20 }}>
          Settings
        </Text>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 5,
          }}
        >
          <Text>Enable SMS Notification</Text>
          <Switch
            value={ismsSwitch}
            aria-label="Enable SMS Notification"
            onValueChange={setsmsnotification}
          />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 5,
          }}
        >
          <Text style={{ marginTop: 30 }}>Enable System Notification</Text>
          <Switch
            value={notify}
            aria-label="Enable Notification"
            onValueChange={setsystemnotification}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: 5
  },
});
