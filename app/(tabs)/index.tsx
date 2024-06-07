import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Appbar,
  Card,
  FAB,
  Menu,
  Modal,
  Portal,
  Provider,
} from "react-native-paper";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { url } from "@/components/Constants";
import axios from "axios";
import Medicationlist from "@/list/Medicationlist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export default function TabOneScreen() {
  const [data, setData] = useState([]);
  const [filterdata, setFilterdata] = useState([]);
  const [isloading, setLoading] = useState(true);
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [user, setuser] = useState({});

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus.status;
      if (existingStatus.status !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
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


  function getTriggerTime(hour, minute) {
    const now = new Date();
    const trigger = new Date();
    trigger.setHours(hour);
    trigger.setMinutes(minute);
    trigger.setSeconds(0);
    trigger.setMilliseconds(0);

    // If the trigger time is before the current time, set it for the next day
    if (trigger.getTime() <= now.getTime()) {
      trigger.setDate(trigger.getDate() + 1);
    }

    return trigger;
  }


  async function cancelAlarm(date, time, msg) {

    const hour = parseInt(time.split(":")[0], 10);
    const minute = parseInt(time.split(":")[1], 10);

    try {
      
       const id = await Notifications.scheduleNotificationAsync({
         content: {
           title: "Medication Alarm",
           body: msg,
           sound: "default",
         },
         trigger: {
           hour: hour,
           minute: minute,
           repeats: true,
         },
       });

        console.log("Sample notification scheduled with ID:", id);
        await Notifications.cancelScheduledNotificationAsync(id);

        console.log("id",id);

      Alert.alert("Success", "Alarm cancelled successfully!");

    } catch (error) {
       console.error("Error cancelling notification:", error);
       Alert.alert("Error", "Failed to cancel scheduled notification.");
    }
  }

  async function scheduleAlarm(date, time, msg) {
    const hour = parseInt(time.split(":")[0], 10);
    const minute = parseInt(time.split(":")[1], 10);

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldShowAlert: true,
        shouldSetBadge: false,
      }),
    });

    try {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Medication Alarm",
          body: msg,
          sound: "default",
        },
        trigger: {
          hour: hour,
          minute: minute,
          repeats: true,
        },
      });

      Alert.alert("Success", "Alarm scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling alarm:", error);
      Alert.alert("Error", "Failed to schedule alarm.");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getData();
        setuser(userData);
        loaddata();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error("Error reading value:", e);
    }
  };

  const loaddata = () => {
    setLoading(true);
    axios
      .get(url + "/all-medication/" + user?.id, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        setData(response.data.data);
        setFilterdata(response.data.data);
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      });
  };

  const deletedata = (id, delname) => {
    return Alert.alert(
      "Are you sure?",
      `Are you sure you want to delete ${delname}?`,
      [
        { text: "No" },
        {
          text: "Yes Delete",
          onPress: () => {
            setLoading(true);
            axios
              .get(url + "/delete-medication/" + id, {
                headers: {
                  Accept: "application/json",
                },
              })
              .then(function (response) {
                const newData = data.filter((item) => item.id !== id);
                setFilterdata(newData);
                setData(newData);
                loaddata();
              })
              .catch(function (error) {
                setLoading(false);
                console.log(error);
              });
          },
        },
      ]
    );
  };

  const remindme = (id, datetime) => {
    return Alert.alert("Are you sure?", "Are you sure you want to proceed", [
      { text: "No" },
      {
        text: "Yes Remind Me",
        onPress: () => {
          // Implement the reminder logic here
        },
      },
    ]);
  };

  return (
    <Provider>
      <Portal>
        <SafeAreaView style={{ flexGrow: 1 }}>
          <Appbar.Header>
            <Appbar.Content title="Records" />
          </Appbar.Header>

          <ScrollView
            refreshControl={
              <RefreshControl refreshing={isloading} onRefresh={loaddata} />
            }
          >
            <Card>
              <Card.Content>
                <FlatList
                  data={filterdata}
                  renderItem={({ item }) => (
                    <Medicationlist
                      item={item}
                      deletedata={deletedata}
                      scheduleAlarm={scheduleAlarm}
                      cancelAlarm={cancelAlarm}
                    />
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  contentContainerStyle={{
                    marginBottom: 10,
                  }}
                  keyExtractor={(item) => item?.id.toString()}
                />
              </Card.Content>
            </Card>
          </ScrollView>
          <FAB icon="plus" style={styles.fab} onPress={showModal} />
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{ backgroundColor: "#fff" }}
            style={{ backgroundColor: "#fff" }}
          >
            <View style={{ flex: 1 }}>
              <Menu.Item
                leadingIcon="content-paste"
                onPress={() => router.push("/medication")}
                title="Medications"
              />
              <Menu.Item
                leadingIcon="content-paste"
                onPress={() => router.push("/measurement")}
                title="Measurement"
              />
              <Menu.Item
                leadingIcon="content-paste"
                onPress={() => router.push("/activity")}
                title="Activity"
              />
              <Menu.Item
                leadingIcon="content-paste"
                onPress={() => router.push("/symptoms")}
                title="Symptoms Check"
              />
            </View>
          </Modal>
        </SafeAreaView>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: "80%",
  },
});