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

function Recordslist({ item, deletedata }) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      <TouchableOpacity
        style={{ backgroundColor: "#fff", padding: 10 }}
        onPress={() => setVisible(!visible)}
      >
        <List.Item
          title={item?.fullname}
          titleEllipsizeMode="middle"
          description={item?.note}
          descriptionNumberOfLines={5}
          left={(props) => <Ionicons name="call" size={20} />}
          right={(props) => (
            <View>
              <Text style={{ fontSize: 10 }}>{item?.type}</Text>
              <Text style={{ fontSize: 10 }}>{item?.duration}</Text>
              <Text style={{ fontSize: 10 }}>{item?.followupdate}</Text>
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
            disabled={item?.phone == "" ? true : false}
            style={{ marginLeft: 10 }}
            leadingIcon="phone"
            title="Call"
            onPress={() => Linking.openURL(`tel:${item?.phone}`)}
          />
          {/* <Menu.Item disabled={item?.doc == "" ? true: false} style={{marginLeft: 10}} leadingIcon="download-circle" title="Downlaod Attachment" onPress={() => Linking.openURL(`mailto:${item?.email}`)} /> */}
          <Menu.Item
            style={{ marginLeft: 10 }}
            leadingIcon="square-edit-outline"
            onPress={() =>
              router.push(`/admin/Frontdesk/create-edit-calllog?id=${item?.id}`)
            }
            title="Edit"
          />
          <Menu.Item
            style={{ marginLeft: 10 }}
            leadingIcon="delete-forever-outline"
            title="Delete"
            onPress={() => deletedata(item?.id, item?.fullname)}
          />
        </View>
      )}
    </>
  );
}

export default Recordslist;
