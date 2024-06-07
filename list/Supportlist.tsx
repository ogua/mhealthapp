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

function Supportlist({ item, deletedata }) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      <TouchableOpacity style={{ backgroundColor: "#fff" }}
      onPress={() => router.push(`/supportinfo?id=${item?.id}`)}
      >
        <List.Item
          title={item?.name}
          description={item?.utype}
          left={(props) => (
            <Ionicons
              name={item?.utype == "Pharmacy" ? `bag-check` : `person-circle`}
              size={50}
            />
          )}
        />
      </TouchableOpacity>
    </>
  );
}

export default Supportlist;
