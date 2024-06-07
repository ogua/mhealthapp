import { useState } from "react";
import { Linking, TouchableOpacity, View } from "react-native";
import {
  Button,
  Dialog,
  Divider,
  List,
  Menu,
  Portal,
  Snackbar,
  Text,
} from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter, useSearchParams } from "expo-router";

function Appointmentlist({ item }) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      <TouchableOpacity style={{ backgroundColor: "#fff" }}>
        <List.Item
          title={item?.app_date}
          right={(props) => <Text>{item?.app_time}</Text>}
          description={item?.note}
          left={(props) => <Ionicons name="calendar" size={20} />}
        />
      </TouchableOpacity>
    </>
  );
}

export default Appointmentlist;
