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
import { useRouter } from "expo-router";

function Symptomlist({ item, deletedata }) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      <TouchableOpacity
        style={{ backgroundColor: "#fff", padding: 10 }}
        onPress={() => setVisible(!visible)}
      >
        <List.Item
          title={item?.mode}
          description={item?.symptoms}
          left={(props) => <Ionicons name="happy" size={30} />}
          right={(props) => (
            <View>
              <Text style={{ fontSize: 10 }}>{item?.mdate}</Text>
              <Text style={{ fontSize: 10 }}>{item?.mtime}</Text>
            </View>
          )}
        />
      </TouchableOpacity>

      {visible && (
        <View
          style={{
            backgroundColor: "#fff",
            borderBottomColor: "#000",
            borderBottomWidth: 1,
          }}
        >
          <Menu.Item
            style={{ marginLeft: 10 }}
            leadingIcon="delete-forever-outline"
            title="Delete"
            titleStyle={{ color: "red" }}
            onPress={() => deletedata(item?.id, item?.name, "activity")}
          />
        </View>
      )}
    </>
  );
}

export default Symptomlist;
