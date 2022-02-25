import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View, Alert, Modal} from 'react-native';
import {PressableOpacity} from 'react-native-pressable-opacity';
import IonIcon from 'react-native-vector-icons/Ionicons';

interface Props {
  showModal: boolean;
  closeModal: () => void;
}

function ShareModal({showModal, closeModal}: Props) {
  const [endPoint, setEndPoint] = useState('');

  return (
    <View style={styles.container}>
      <Modal visible={showModal} transparent={true}>
        <View style={styles.container}>
          <View style={styles.main}>
            <PressableOpacity style={styles.closeButton} onPress={closeModal}>
              <IonIcon
                name="close"
                size={35}
                color="white"
                style={styles.icon}
              />
            </PressableOpacity>
            <View style={styles.iconContainer}>
              <Text>Enter api end point</Text>
              <TextInput
                style={styles.input}
                placeholder="Api End point"
                onChangeText={value => setEndPoint(value)}
                onBlur={() => Alert.alert(`Shared On ${endPoint}`)}
              />
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
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    backgroundColor: '#00B2EE',
    justifyContent: 'center',
    borderRadius: 6,
    width: 250,
    height: 250,
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
