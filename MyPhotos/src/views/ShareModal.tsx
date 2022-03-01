import {Text, Input, VStack} from 'native-base';
import React, {useState} from 'react';
import {StyleSheet, View, Alert, Modal} from 'react-native';
import {PressableOpacity} from 'react-native-pressable-opacity';
import IonIcon from 'react-native-vector-icons/Ionicons';

interface Props {
  showModal: boolean;
  closeModal: () => void;
  uploadImage: () => Promise<void>;
}

function ShareModal({showModal, closeModal, uploadImage}: Props) {
  const [endPoint, setEndPoint] = useState('');

  return (
    <Modal visible={showModal} transparent={true}>
      <View style={styles.container}>
        <View style={styles.main}>
          <PressableOpacity style={styles.closeButton} onPress={closeModal}>
            <IonIcon name="close" size={35} color="black" style={styles.icon} />
          </PressableOpacity>
          <VStack space={1}>
            <PressableOpacity onPress={uploadImage}>
              <Text style={styles.text}>Send to backend api</Text>
            </PressableOpacity>
            <VStack space={1}>
              <Text style={styles.text}>Enter api end point</Text>
              <Input
                mx={3}
                w="75%"
                maxWidth="300px"
                placeholder="Api End point"
                onChangeText={value => setEndPoint(value)}
                onBlur={() => Alert.alert(`Shared On ${endPoint}`)}
              />
            </VStack>
            <View style={styles.iconContainer}>
              <PressableOpacity
                style={styles.shareButton}
                onPress={() => Alert.alert('Shared on twitter')}>
                <IonIcon
                  name="logo-instagram"
                  size={35}
                  color="black"
                  style={styles.icon}
                />
              </PressableOpacity>
              <PressableOpacity
                style={styles.shareButton}
                onPress={() => Alert.alert('Shared on instagram')}>
                <IonIcon
                  name="logo-twitter"
                  size={35}
                  color="black"
                  style={styles.icon}
                />
              </PressableOpacity>
            </View>
          </VStack>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    backgroundColor: '#F0FFF0',
    justifyContent: 'center',
    borderRadius: 10,
    width: 250,
    height: 250,
  },
  text: {
    marginLeft: 12,
  },
  iconContainer: {
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    zIndex: 100,
  },
  input: {
    borderColor: 'black',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    top: 5,
  },
  shareButton: {
    width: 40,
    height: 40,
  },
  icon: {
    textShadowColor: 'black',
    top: 8,
    textShadowOffset: {
      height: 0,
      width: 0,
    },
  },
});

export default ShareModal;
