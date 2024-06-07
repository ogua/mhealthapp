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
import { useCallback, useState } from "react";
import axios from "axios";
import { url } from "@/components/Constants";
import * as DocumentPicker from "expo-document-picker";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";

export default function Appointments() {

  const route = useRouter();
  const [appdate, setappdate] = useState("");
  const [apptime, setapptime] = useState("");
  const [note, setnote] = useState("");

  const { id } = useLocalSearchParams();

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

  const [issubmitting, setissubmitting] = useState(false);

  const savedata = () => {

    if (date == "") {
      alert("Appointment date Can not be empty!");
      return;
    }

    if (time == "") {
      alert("Appointment time Can not be empty!");
      return;
    }

    if (note == "") {
      alert("Appointment note Can not be empty!");
      return;
    }


    setissubmitting(true);

    const formdata = {
      date,time,note,supportid: id
    };

    axios
      .post(url + "/add-support-appointment", formdata, {
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
          headerTitle: "Add Appointment",
        }}
      />
      <ScrollView style={{ marginBottom: 20 }}>
        <View style={styles.container}>
          <Card>
            <Card.Content>
              <DatePickerInput
                locale="en"
                label="Date"
                mode="outlined"
                value={date}
                onChange={(d) => setDate(d)}
                style={{ marginBottom: 20 }}
                inputMode="start"
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
                style={{ marginBottom: 20 }}
              />

              <TextInput
                value={note}
                multiline
                onChangeText={(e) => setnote(e)}
                mode="outlined"
                label="Enter note"
                numberOfLines={9}
                style={{ marginBottom: 40 }}
              />

              {issubmitting ? (
                <>
                  <ActivityIndicator size="large" />
                </>
              ) : (
                <>
                  <Button mode="contained" onPress={savedata}>
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
  },
});
