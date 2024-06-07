import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { ActivityIndicator, Appbar, Card, FAB, Menu, Modal, Portal, Provider } from "react-native-paper";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { url } from "@/components/Constants";
import axios from "axios";
import Recordslist from "@/list/Recordslist";
import { Route } from "expo-router/build/Route";
import Medicationlist from "@/list/Medicationlist";
import Measuremntlist from "@/list/Measurementlist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Activitylist from "@/list/Activitylist";
import Symptomlist from "@/list/Symptomlist";

export default function History() {
  
  const [data, setData] = useState([]);
  const [filterdata, setFilterdata] = useState([]);
  const [isloading, setLoading] = useState(true);
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [medication, setmedication] = useState([]);
  const [measurement, setmeasurement] = useState([]);
  const [lab, setlab] = useState([]);
  const [activity, setactivity] = useState([]);
  const [symptoms, setsymptoms] = useState([]);

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


  function getmedication() {
    return axios.get(url + "/all-medication/" + user?.id, {
      headers: { Accept: "application/json" },
    });
  }

  function getmeasurement() {
    return axios.get(url + "/all-measurement/" + user?.id, {
      headers: { Accept: "application/json" },
    });
  }

  function getlabvalues() {
    return axios.get(url + "/all-lab/" + user?.id, {
      headers: { Accept: "application/json" },
    });
  }

  function getactivity() {
    return axios.get(url + "/all-activity/" + user?.id, {
      headers: { Accept: "application/json" },
    });
  }

  function getsymptoms() {
    return axios.get(url + "/all-symptoms/" + user?.id, {
      headers: { Accept: "application/json" },
    });
  }

  const loaddata = () => {
    setLoading(true);

    Promise.all([getmedication(), getmeasurement(), getlabvalues(), getactivity(), getsymptoms()])
      .then(function (results) {
        ///setLoading(false);
        const medication = results[0];
        const measuremnt = results[1];
        const lab = results[2];
        const activity = results[3];
        const symptoms = results[4];

        setmedication(medication.data.data);
        setmeasurement(measuremnt.data.data);
        setlab(lab.data.data);
        setactivity(activity.data.data);
        setsymptoms(symptoms.data.data);

        //console.log("data",medication.data.data);

        setLoading(false);

      })
      .catch(function (error) {
        setLoading(false);
        const measurement = error[0];
        const lab = error[1];
        console.log("error",error);
      });
  };

  const deletedata = (id, delname, type) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to delete " + delname,
      [
        {
          text: "No",
        },
        {
          text: "Yes Delete",
          onPress: () => {
            setLoading(true);
            axios
              .get(url + "/delete-record/" + id + "/" + type, {
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

  return (
    <Provider>
      <Portal>
        <SafeAreaView style={{ flexGrow: 1 }}>
          <Appbar.Header>
            <Appbar.Content title="History" />
          </Appbar.Header>

          <ScrollView
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={loaddata} />
            }
          >
            <Card>
              <Card.Content>
                {isloading ? (
                  <ActivityIndicator size="large" />
                ) : (
                  <>
                    {medication.length > 0 && (
                      <FlatList
                        data={medication}
                        renderItem={({ item }) => (
                          <Medicationlist item={item} deletedata={deletedata} />
                        )}
                        ItemSeparatorComponent={() => (
                          <View style={styles.separator} />
                        )}
                        contentContainerStyle={{
                          marginBottom: 10,
                        }}
                        ListHeaderComponent={() => (
                          <Text
                            style={{
                              fontSize: 20,
                              backgroundColor: "#fff",
                              padding: 8,
                            }}
                          >
                            MEDICATION LIST
                          </Text>
                        )}
                        keyExtractor={(item) => item?.id}
                      />
                    )}

                    {measurement.length > 0 && (
                      <FlatList
                        data={measurement}
                        renderItem={({ item }) => (
                          <Measuremntlist item={item} deletedata={deletedata} />
                        )}
                        ItemSeparatorComponent={() => (
                          <View style={styles.separator} />
                        )}
                        contentContainerStyle={{
                          marginBottom: 10,
                          marginTop: 30,
                        }}
                        ListHeaderComponent={() => (
                          <Text
                            style={{
                              fontSize: 20,
                              backgroundColor: "#fff",
                              padding: 8,
                            }}
                          >
                            MEASUREMENTS LIST
                          </Text>
                        )}
                        keyExtractor={(item) => item?.id}
                      />
                    )}

                    {lab.length > 0 && (
                      <FlatList
                        data={lab}
                        renderItem={({ item }) => (
                          <Medicationlist item={item} deletedata={deletedata} />
                        )}
                        ItemSeparatorComponent={() => (
                          <View style={styles.separator} />
                        )}
                        contentContainerStyle={{
                          marginBottom: 10,
                          marginTop: 30,
                        }}
                        ListHeaderComponent={() => (
                          <Text
                            style={{
                              fontSize: 20,
                              backgroundColor: "#fff",
                              padding: 8,
                            }}
                          >
                            LAB VALUES LIST
                          </Text>
                        )}
                        keyExtractor={(item) => item?.id}
                      />
                    )}

                    {activity.length > 0 && (
                      <FlatList
                        data={activity}
                        renderItem={({ item }) => (
                          <Activitylist item={item} deletedata={deletedata} />
                        )}
                        ItemSeparatorComponent={() => (
                          <View style={styles.separator} />
                        )}
                        contentContainerStyle={{
                          marginBottom: 10,
                          marginTop: 30,
                        }}
                        ListHeaderComponent={() => (
                          <Text
                            style={{
                              fontSize: 20,
                              backgroundColor: "#fff",
                              padding: 8,
                            }}
                          >
                            ACTIVITY LIST
                          </Text>
                        )}
                        keyExtractor={(item) => item?.id}
                      />
                    )}

                    {symptoms.length > 0 && (
                      <FlatList
                        data={symptoms}
                        renderItem={({ item }) => (
                          <Symptomlist item={item} deletedata={deletedata} />
                        )}
                        ItemSeparatorComponent={() => (
                          <View style={styles.separator} />
                        )}
                        contentContainerStyle={{
                          marginBottom: 100,
                          marginTop: 30,
                        }}
                        ListHeaderComponent={() => (
                          <Text
                            style={{
                              fontSize: 20,
                              backgroundColor: "#fff",
                              padding: 8,
                            }}
                          >
                            SYMPTOMS LIST
                          </Text>
                        )}
                        keyExtractor={(item) => item?.id}
                      />
                    )}
                  </>
                )}
              </Card.Content>
            </Card>
          </ScrollView>
          {/* <FAB icon="plus" style={styles.fab} onPress={showModal} /> */}
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
                onPress={() => {}}
                title="Lab Values"
              />
              <Menu.Item
                leadingIcon="content-paste"
                onPress={() => router.push("/activity")}
                title="Activity"
              />

              <Menu.Item
                leadingIcon="content-paste"
                onPress={() => router.push("/symptoms")}
                title="Symptons Check"
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
