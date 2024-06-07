import {
    Alert,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ActivityIndicator, Appbar, Avatar, Button, Card, FAB, List, Menu, Modal, Portal, Provider } from "react-native-paper";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { url } from "@/components/Constants";
import axios from "axios";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Supportlist from "@/list/Supportlist";
import { Ionicons } from "@expo/vector-icons";
import Appointmentlist from "@/list/Applist";

export default function Supportinfo() {
  const [data, setData] = useState({});
  const [appdata, setAppdata] = useState([]);
  const [isloading, setLoading] = useState(true);
  const [isapploading, setApploading] = useState(true);
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const userid = 1;

  const [issendingreport, setissendingreport] = useState(false);

const [isdeleting, setIsdeleting] = useState(false);


 const { id } = useLocalSearchParams();

 const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

  useEffect(() => {
    loaddata();
  }, []);

  const loaddata = () => {
    setLoading(true);
    axios
      .get(url + "/support-info/"+id, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        setData(response.data.data);
        loadappointments(response.data.data.id);

        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      });
  };

  const loadappointments = (id) => {
   // console.log("supportid",id);

    setApploading(true);
    axios
      .get(url + "/support-appointments/" + id, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        setAppdata(response.data.data);
        setApploading(false);
      })
      .catch(function (error) {
        setApploading(false);
        console.log(error);
      });

  }

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
            setIsdeleting(true);
            axios
              .get(url + "/support-delete/" + id, {
                headers: {
                  Accept: "application/json",
                },
              })
              .then(function (response) {
                setIsdeleting(false);
                alert(response.data.message);
                router.back();
              })
              .catch(function (error) {
                setIsdeleting(false);
                console.log(error);
              });
          },
        },
      ]
    );
  };

  const containerStyle = { backgroundColor: "white", padding: 20 };

  const [openmenu, setopenmenu] = useState(false);

  const openMenu = () => setopenmenu(true);
  const closeMenu = () => setopenmenu(false);

  
  const sendhealthreport = (userid,healthid) => {
    setissendingreport(true);

    const data = {
      userid, healthid
    }

    axios
      .post(url + "/send-health-care-report",data, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        setissendingreport(false);
        alert(response.data.message);
      })
      .catch(function (error) {
        setissendingreport(false);
        console.log(error);
      });

  }

  return (
    <Provider>
      <Portal>
        <SafeAreaView style={{ flexGrow: 1 }}>
          <Stack.Screen
            options={{
              headerTitle: `${
                data?.utype == "Pharmacy"
                  ? "Pharmacy Information"
                  : "Health Personnel"
              }`,
              //   headerRight: () => (
              //     <>
              //       <Appbar.Action icon={MORE_ICON} onPress={openMenu} />
              //     </>
              //   ),
            }}
          />

          <ScrollView
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={loaddata} />
            }
          >
            <Card>
              <Card.Content>
                <Card.Content
                  style={{ backgroundColor: "#fff", paddingBottom: 10 }}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                      flexDirection: "row",
                    }}
                  >
                    <Button
                      textColor="darkblue"
                      onPress={() =>
                        router.push(
                          `${
                            data?.utype == "Pharmacy"
                              ? `/pharmacy?id=${data?.id}`
                              : `/personnel?id=${data?.id}`
                          }`
                        )
                      }
                    >
                      Edit
                    </Button>
                    {isdeleting ? (
                      <ActivityIndicator size="small" />
                    ) : (
                      <>
                        <Button
                          textColor="red"
                          onPress={() => deletedata(data?.id, data?.name)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </View>

                  <Ionicons
                    // name="phone-portrait"
                    name={
                      data?.utype == "Pharmacy" ? `bag-check` : `person-circle`
                    }
                    size={100}
                    style={{ alignSelf: "center" }}
                  />

                  <Text style={{ fontSize: 18, textAlign: "center" }}>
                    {data?.name}
                  </Text>

                  <Button
                    mode="text"
                    icon="phone"
                    onPress={() => Linking.openURL(`tel:${data?.phone}`)}
                    style={{ marginTop: 10 }}
                  >
                    Call
                  </Button>

                  {/* <Button mode="text" icon="mail">
                    Send Mail
                  </Button> */}

                  {issendingreport ? <ActivityIndicator size="large" /> : (
                      <Button
                    mode="text"
                    icon="mail"
                    onPress={() => sendhealthreport(userid, data?.user_id)}
                  >
                    Send Health Report
                  </Button>

                  )}

                </Card.Content>

                {data?.utype != "Pharmacy" && (
                  <Card.Content
                    style={{
                      backgroundColor: "#FFF",
                      marginTop: 30,
                      paddingBottom: 20,
                    }}
                  >
                    <Ionicons
                      name="calendar"
                      size={100}
                      style={{ alignSelf: "center" }}
                    />
                    <Text style={{ fontSize: 15, textAlign: "center" }}>
                      Upcoming Appointments
                    </Text>

                    <Button
                      onPress={() => router.push(`/appointment/?id=${id}`)}
                      style={{ marginVertical: 10 }}
                    >
                      ADD AN APPOINTMENT
                    </Button>
                    {isapploading ? (
                      <ActivityIndicator
                        size="large"
                        style={{ alignSelf: "center", marginTop: 10 }}
                      />
                    ) : (
                      <>
                        {appdata.length > 0 ? (
                          <FlatList
                            data={appdata}
                            renderItem={({ item }) => (
                              <Appointmentlist item={item} />
                            )}
                            ItemSeparatorComponent={() => (
                              <View style={styles.separator} />
                            )}
                            contentContainerStyle={{
                              marginBottom: 10,
                            }}
                            keyExtractor={(item) => item?.id}
                          />
                        ) : (
                          <>
                            <Text style={{ fontSize: 15, textAlign: "center" }}>
                              There are currently no upcoming appointments.
                            </Text>
                          </>
                        )}
                      </>
                    )}
                  </Card.Content>
                )}
              </Card.Content>
            </Card>
          </ScrollView>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}
          >
            <Button
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
            </Button>
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
