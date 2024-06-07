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
  Dialog,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { url } from "@/components/Constants";
import * as DocumentPicker from "expo-document-picker";
import DropDownPicker from "react-native-dropdown-picker";
import {
  Calendar,
  DatePickerInput,
  DatePickerModal,
  TimePickerModal,
} from "react-native-paper-dates";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Activity() {
  const route = useRouter();
  const [name, setname] = useState("");
  const [mvalue, setmvalue] = useState("");
  const [phone, setphone] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [issubmitting, setissubmitting] = useState(false);

  const [sysblood, setsysblood] = useState("");
  const [diablood, setdiablood] = useState("");
  const [pulse, setpulse] = useState("");

  const [openunit, setOpenunit] = useState(false);
  const [unit, setunit] = useState("");
  const [unititems, setunitItems] = useState([
    { label: "Fitness", value: "Fitness" },
    { label: "Brushing", value: "Brushing" },
    { label: "CPAP", value: "CPAP" },
    { label: "Caffeine intake", value: "Caffeine intake" },
    { label: "Cold shower", value: "Cold shower" }
  ]);

  const [openstatus, setOpenstatus] = useState(false);
  const [status, setstatus] = useState("");
  const [statusitems, setstatusItems] = useState([
    { label: "feel good", value: "feel good" },
    { label: "feel bad", value: "feel bad" },
    { label: "feel dizzy", value: "applications(s)" },
    { label: "feel thirsty", value: "feel thirsty" },
  ]);

  const [time, setTime] = useState("");
  const [showtime, setShowtime] = useState(false);
  const onDismissintime = useCallback(() => {
    setShowtime(false);
  }, [setShowtime]);

  const onConfirmintime = useCallback(
    ({ hours, minutes }) => {
      setShowtime(false);
      setTime(hours + ":" + minutes);
    },
    [setShowtime]
  );

  const [date, setDate] = useState("");
  const [open, setOpen] = useState(false);

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
      console.log("date", params.date);
    },
    [setOpen, setDate]
  );

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

  const savedata = () => {

    if (unit == "") {
      alert("Activity type Can not be empty!");
      return;
    }

    if (mvalue == "") {
      alert("Minutes Cant not be empty!");
      return;
    }

    if (time == "") {
      alert("Time Can not be empty!");
      return;
    }

    if (date == "") {
      alert("Date does not matchy!");
      return;
    }

    setissubmitting(true);

    const formdata = {
      unit,
      mvalue,
      time,
      date,
      userid: user?.id,
    };

    axios
      .post(url + "/add-activity", formdata, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        setissubmitting(false);
        alert(response.data.message);
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
          headerTitle: "Record Activity",
        }}
      />
      <ScrollView style={{ marginBottom: 30 }}>
        <View style={styles.container}>
          <Card>
            <Card.Content>
              <DropDownPicker
                open={openunit}
                value={unit}
                items={unititems}
                setOpen={setOpenunit}
                setValue={setunit}
                setItems={setunitItems}
                placeholder={"Select Activity Type"}
                placeholderStyle={{
                  color: "#456A5A",
                }}
                listMode="MODAL"
                dropDownContainerStyle={{
                  borderWidth: 0,
                  borderRadius: 30,
                  backgroundColor: "#fff",
                }}
                labelStyle={{
                  color: "#000",
                }}
                listItemLabelStyle={{
                  color: "#456A5A",
                }}
                style={{
                  borderWidth: 1,
                  minHeight: 50,
                  marginBottom: 20,
                }}
              />

              <TextInput
                value={mvalue}
                onChangeText={(e) => setmvalue(e)}
                mode="outlined"
                label="Enter minutes"
                inputMode="numeric"
                style={{ marginBottom: 20 }}
              />

              <TimePickerModal
                visible={showtime}
                onDismiss={onDismissintime}
                onConfirm={onConfirmintime}
                hours={12}
                minutes={14}
              />

              <TextInput
                mode="outlined"
                onFocus={() => setShowtime(true)}
                onChangeText={(e) => setTime(e)}
                value={time}
                placeholder="Time"
              />

              <DatePickerInput
                locale="en"
                label="Date"
                mode="outlined"
                value={date}
                onChange={(d) => setDate(d)}
                style={{ marginTop: 20 }}
                inputMode="start"
              />

              {issubmitting ? (
                <>
                  <ActivityIndicator
                    size="large"
                    style={{ marginVertical: 30 }}
                  />
                </>
              ) : (
                <>
                  <Button
                    mode="contained"
                    onPress={savedata}
                    style={{ marginVertical: 30 }}
                  >
                    Save
                  </Button>
                </>
              )}
            </Card.Content>
          </Card>

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
    padding: 20,
  },
});
