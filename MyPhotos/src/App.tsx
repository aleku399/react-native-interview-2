import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PermissionsPage} from './PermissionsPage';
import {CameraPage} from './CameraPage';
import type {Routes} from './Routes';
import {Camera, CameraPermissionStatus} from 'react-native-vision-camera';
import Gallery from './views/Gallery';

const Stack = createNativeStackNavigator<Routes>();

export function App(): React.ReactElement | null {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>();

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
  }, []);

  if (cameraPermission == null) {
    // still loading
    return null;
  }

  const showPermissionsPage = cameraPermission !== 'authorized';

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          statusBarStyle: 'dark',
          animationTypeForReplace: 'push',
        }}
        initialRouteName={
          showPermissionsPage ? 'PermissionsPage' : 'CameraPage'
        }>
        <Stack.Screen name="PermissionsPage" component={PermissionsPage} />
        <Stack.Screen name="CameraPage" component={CameraPage} />
        <Stack.Screen
          name="MediaPage"
          component={Gallery}
          options={{
            animation: 'none',
            presentation: 'transparentModal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
