import React, {useRef} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {TapGestureHandler} from 'react-native-gesture-handler';
import Reanimated, {
  Easing,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  withRepeat,
} from 'react-native-reanimated';
import type {Camera} from 'react-native-vision-camera';
import {CAPTURE_BUTTON_SIZE} from './../Constants';

const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1;

interface Props extends ViewProps {
  camera?: React.RefObject<Camera>;

  flash: 'off' | 'on';

  enabled: boolean;

  setIsPressingButton: (isPressingButton: boolean) => void;

  capturePhotos: () => void;
}

const _CaptureButton: React.FC<Props> = ({
  enabled,
  style,
  capturePhotos,
  ...props
}): React.ReactElement => {
  const isPressingButton = useSharedValue(false);

  const tapHandler = useRef<TapGestureHandler>();

  const shadowStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withSpring(isPressingButton.value ? 1 : 0, {
            mass: 1,
            damping: 35,
            stiffness: 300,
          }),
        },
      ],
    }),
    [isPressingButton],
  );

  const buttonStyle = useAnimatedStyle(() => {
    let scale: number;
    if (enabled) {
      if (isPressingButton.value) {
        scale = withRepeat(
          withSpring(1, {
            stiffness: 100,
            damping: 1000,
          }),
          -1,
          true,
        );
      } else {
        scale = withSpring(0.9, {
          stiffness: 500,
          damping: 300,
        });
      }
    } else {
      scale = withSpring(0.6, {
        stiffness: 500,
        damping: 300,
      });
    }

    return {
      opacity: withTiming(enabled ? 1 : 0.3, {
        duration: 100,
        easing: Easing.linear,
      }),
      transform: [
        {
          scale: scale,
        },
      ],
    };
  }, [enabled, isPressingButton]);

  return (
    <TapGestureHandler
      enabled={enabled}
      ref={tapHandler}
      onHandlerStateChange={capturePhotos}
      shouldCancelWhenOutside={false}
      maxDurationMs={99999999}>
      <Reanimated.View {...props} style={[buttonStyle, style]}>
        <Reanimated.View style={styles.flex}>
          <Reanimated.View style={[styles.shadow, shadowStyle]} />
          <View style={styles.button} />
        </Reanimated.View>
      </Reanimated.View>
    </TapGestureHandler>
  );
};

export const CaptureButton = React.memo(_CaptureButton);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  shadow: {
    position: 'absolute',
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    backgroundColor: '#e34077',
  },
  button: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: 'white',
  },
});
