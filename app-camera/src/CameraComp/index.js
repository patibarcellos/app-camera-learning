import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal, Image
} from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as Speech from  'expo-speech';


export default function App() {
  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(null);
  const [text, setText] = useState ('Imagem salva com sucesso!');


  function speak(){
    Speech.speak(text,{
    });
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHasPermission(status === "granted");
    })();

  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text> Acesso negado !</Text>;
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
      // console.log(data);
    }
  }

  async function savePicture(){
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto)
    .then(() =>{
      speak();
    })
    .catch(error => {
      console.log('err', error);
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={styles.camera} type={type} ref={camRef}>
        <View style={styles.contentButtonTurnCamera}>
          <TouchableOpacity
            style={styles.buttonTurnCamera}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>

            <Text style={styles.textTurnCamera}>Trocar</Text>
          </TouchableOpacity>
        </View>
      </Camera>

      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <FontAwesome name="camera" size={23} color="#fff" />
      </TouchableOpacity>

      {capturedPhoto && (
        <Modal animationType="slide" transparent={false} visible={open}>
          <View style={styles.modalImage}>

            <View style={styles.modalImageIcon}>
            <TouchableOpacity
              style={{ margin: 10 }}
              onPress={() => setOpen(false)}
            >
              <FontAwesome name="window-close" size={50} color="#ff0000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ margin: 10 }}
              onPress={savePicture}
            >
              <FontAwesome name="upload" size={50} color="#121212" />
            </TouchableOpacity>

            </View>

            <Image style={{ width: '100%', height: 400, borderRadius: 20 }} source={{uri: capturedPhoto}}/>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    margin: 20,
    borderRadius: 10,
    height: 50,
  },
  contentButtonTurnCamera:{
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  buttonTurnCamera:{ 
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  textTurnCamera:{
    fontSize: 28,
    marginBottom: 13,
    color: "#fff",
    fontWeight: "bold",
  },
  modalImage:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  modalImageIcon:{
    margin: 10,
    flexDirection: 'row'
  }
});
