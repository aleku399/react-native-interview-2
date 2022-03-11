import * as React from 'react';
import {useRef, useState, useMemo, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  PinchGestureHandler,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import {
  CameraRuntimeError,
  TakePhotoOptions,
  TakeSnapshotOptions,
  useCameraDevices,
} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {CONTENT_SPACING, SAFE_AREA_PADDING} from './Constants';
import Reanimated, {useSharedValue} from 'react-native-reanimated';
import {useEffect} from 'react';
import {useIsForeground} from './hooks/useIsForeground';
import {StatusBarBlurBackground} from './views/StatusBarBlurBackground';
import {CaptureButton} from './views/CaptureButton';
import {PressableOpacity} from 'react-native-pressable-opacity';
import IonIcon from 'react-native-vector-icons/Ionicons';
import type {Routes} from './Routes';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useIsFocused} from '@react-navigation/core';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const BUTTON_SIZE = 40;

type Props = NativeStackScreenProps<Routes, 'CameraPage'>;

export function CameraPage({navigation}: Props): React.ReactElement {
  const camera = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [timer, setTimer] = useState(1000);
  const [captures, setCaptures] = useState<Array<string>>([]);
  const [isCaptured, setIsCaptured] = useState<boolean>(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState<boolean>(false);

  const isPressingButton = useSharedValue(false);

  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  // camera format settings
  const devices = useCameraDevices();
  const device = devices[cameraPosition];

  //#region Memos

  const takePhotoOptions = useMemo<TakePhotoOptions & TakeSnapshotOptions>(
    () => ({
      photoCodec: 'jpeg',
      qualityPrioritization: 'speed',
      flash: flash,
      quality: 90,
      skipMetadata: true,
    }),
    [flash],
  );

  const supportsCameraFlipping = useMemo(
    () => devices.back != null && devices.front != null,
    [devices.back, devices.front],
  );

  const supportsFlash = device?.hasFlash ?? false;

  //#region Callbacks

  const add = () => setTimer(timer + 1000);

  const subtract = () => setTimer(timer - 1000);

  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton],
  );
  // Camera callbacks
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);

  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true);
  }, []);

  const onMediaCaptured = useCallback(() => {
    navigation.navigate('MediaPage', {
      data: captures,
    });
  }, [captures, navigation]);

  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  }, []);

  const onFlashPressed = useCallback(() => {
    setFlash(f => (f === 'off' ? 'on' : 'off'));
  }, []);
  //#endregion

  //#region Tap Gesture
  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);
  //#endregion

  if (device != null) {
    console.log(
      `Re-rendering camera page with ${
        isActive ? 'active' : 'inactive'
      } camera. ` + `Device: "${device.name}")`,
    );
  } else {
    console.log('re-rendering camera page without active camera');
  }

  const onBurst = useCallback(() => {
    try {
      if (camera.current == null) {
        throw new Error('Camera ref is null!');
      }

      setIsTakingPhoto(true);

      let count = 0;
      const id = setInterval(async () => {
        const images = await Promise.all(
          Array.from(Array(5), () =>
            camera.current.takePhoto(takePhotoOptions),
          ),
        );

        const pathImages = images.map(img => img.path);

        setCaptures(pathImages);

        count++;
        if (count === 2) {
          setIsTakingPhoto(false);
          clearInterval(id);
          setIsCaptured(true);
        }
      }, timer);
    } catch (e) {
      console.error('Failed to take photo!', e);
    }
  }, [takePhotoOptions, timer]);

  useEffect(() => {
    if (isCaptured) {
      onMediaCaptured();
    }
  }, [isCaptured, onMediaCaptured]);

  return (
    <View style={styles.container}>
      {device != null && (
        <PinchGestureHandler enabled={isActive}>
          <Reanimated.View style={StyleSheet.absoluteFill}>
            <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
              <ReanimatedCamera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                lowLightBoost={device.supportsLowLightBoost}
                isActive={isActive}
                onInitialized={onInitialized}
                onError={onError}
                enableZoomGesture={false}
                photo={true}
                orientation="portrait"
              />
            </TapGestureHandler>
          </Reanimated.View>
        </PinchGestureHandler>
      )}

      <CaptureButton
        style={styles.captureButton}
        camera={camera}
        flash={supportsFlash ? flash : 'off'}
        enabled={isCameraInitialized && isActive && !isTakingPhoto}
        setIsPressingButton={setIsPressingButton}
        capturePhotos={onBurst}
      />

      <StatusBarBlurBackground />

      <View style={styles.rightButtonRow}>
        {supportsCameraFlipping && (
          <PressableOpacity
            style={styles.button}
            onPress={onFlipCameraPressed}
            disabledOpacity={0.4}>
            <IonIcon name="camera-reverse" color="white" size={24} />
          </PressableOpacity>
        )}
        {supportsFlash && (
          <PressableOpacity
            style={styles.button}
            onPress={onFlashPressed}
            disabledOpacity={0.4}>
            <IonIcon
              name={flash === 'on' ? 'flash' : 'flash-off'}
              color="white"
              size={24}
            />
          </PressableOpacity>
        )}
        <PressableOpacity
          style={styles.button}
          onPress={add}
          disabledOpacity={0.4}>
          <IonIcon name="add" color="white" size={24} />
        </PressableOpacity>
        <PressableOpacity
          style={styles.button}
          onPress={subtract}
          disabledOpacity={0.4}>
          <IonIcon name="remove" color="white" size={24} />
        </PressableOpacity>
        <PressableOpacity
          style={styles.button}
          onPress={subtract}
          disabledOpacity={0.4}>
          <Text style={styles.text}>{`${timer / 1000}s`}</Text>
        </PressableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: SAFE_AREA_PADDING.paddingBottom,
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  text: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
