import React, {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View, Alert} from 'react-native';
import Modal from 'react-native-modal';
import {PressableOpacity} from 'react-native-pressable-opacity';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {SAFE_AREA_PADDING} from '../Constants';

interface Props {
  showModal: boolean;
  closeModal: () => void;
}

function ShareModal({showModal, closeModal}: Props) {
  const [endPoint, setEndPoint] = useState('');

  return (
    <View style={styles.container}>
      <Modal isVisible={showModal}>
        <PressableOpacity style={styles.closeButton} onPress={closeModal}>
          <IonIcon name="close" size={35} color="white" style={styles.icon} />
        </PressableOpacity>
        <View style={styles.container}>
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
          <Button title="Hide modal" onPress={closeModal} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    top: SAFE_AREA_PADDING.paddingTop,
    height: 150,
  },
  closeButton: {
    position: 'absolute',
    top: SAFE_AREA_PADDING.paddingTop,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: 40,
    height: 40,
  },
  input: {
    borderColor: 'gray',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: 'grey',
  },
  shareButton: {
    width: 40,
    height: 40,
  },
  icon: {
    textShadowColor: 'black',
    textShadowOffset: {
      height: 0,
      width: 0,
    },
  },
});

export default ShareModal;
