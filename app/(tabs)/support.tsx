import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { ActivityIndicator, Appbar, Button, Card, FAB, Menu, Modal, Portal, Provider } from "react-native-paper";
import { Stack, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { url } from "@/components/Constants";
import axios from "axios";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Supportlist from "@/list/Supportlist";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Supportscreen() {
  const [data, setData] = useState([]);
  const [filterdata, setFilterdata] = useState([]);
  const [isloading, setLoading] = useState(true);
  const router = useRouter();
   const [visible, setVisible] = useState(false);
   const showModal = () => setVisible(true);
   const hideModal = () => setVisible(false);
  const [user, setuser] = useState({});

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
      .get(url + "/all-supports/"+user?.id, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        console.log(response.data);
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
      "Are your sure?",
      "Are you sure you want to delete " + delname + " info",
      [
        {
          text: "No",
        },
        {
          text: "Yes Delete",
          onPress: () => {
            setLoading(true);
            axios
              .delete(url + "/record-delete/" + id, {
                headers: {
                  Accept: "application/json",
                },
              })
              .then(function (response) {
                const newData = data.filter((item) => item.id != id);
                setFilterdata(newData);
                setData(newData);
                loaddata();
                //setLoading(false);
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

  const containerStyle = { backgroundColor: "white", padding: 20 };

  return (
    <Provider>
      <Portal>
        <SafeAreaView style={{ flexGrow: 1 }}>

          <Appbar.Header>
            <Appbar.Content title="Support" />
          </Appbar.Header>

          <ScrollView
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={loaddata} />
            }
          >
            <Card>
              <Card.Content>
                {isloading ? (
                  <ActivityIndicator size="large" style={{ marginTop: 40 }} />
                ) : (
                  <FlatList
                    data={filterdata}
                    renderItem={({ item }) => (
                      <Supportlist item={item} deletedata={deletedata} />
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={styles.separator} />
                    )}
                    contentContainerStyle={{
                      marginBottom: 10,
                    }}
                    keyExtractor={(item) => item?.id}
                  />
                )}
              </Card.Content>
            </Card>
          </ScrollView>
          <FAB icon="plus" style={styles.fab} onPress={showModal} />
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{ backgroundColor: "#fff" }}
          >
            <View style={{ flex: 1 }}>
              <Menu.Item
                leadingIcon="content-paste"
                onPress={() => router.push("/pharmacy")}
                title="Add Pharmacy"
              />

              <Menu.Item
                leadingIcon="content-paste"
                onPress={() => router.push("/personnel")}
                title="Health Care Personnel"
              />
            </View>

            {/* <Button
              mode="contained"
              icon="plus"
              style={{ marginBottom: 30 }}
              onPress={() => router.push("/pharmacy")}
            >
              Add Pharmacy
            </Button>
            <Button
              mode="contained"
              icon="plus"
              onPress={() => router.push("/personnel")}
            >
              Health Care Personnel
            </Button> */}
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
