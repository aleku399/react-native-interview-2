import React, {useCallback, useMemo, useState, useEffect} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {PressableOpacity} from 'react-native-pressable-opacity';
import IonIcon from 'react-native-vector-icons/Ionicons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import Gallery from 'react-native-image-gallery';
import {Routes} from '../Routes';
import ShareModal from './ShareModal';
import {StatusBarBlurBackground} from './StatusBarBlurBackground';
import {baseURL, SAFE_AREA_PADDING} from '../Constants';
import {photoApi} from '../lib/apiEndpoints';
import axios from 'axios';

console.disableYellowBox = true;

type Props = NativeStackScreenProps<Routes, 'MediaPage'>;

interface Item {
  uri: string;
}

interface Size {
  width: number;
  height: number;
}

interface GImage {
  source: Item;
  dimensions: Size;
}

const PhotoGallery = ({route, navigation}: Props) => {
  const {data} = route.params;
  const [isShared, setIsShared] = useState(false);
  const [images, setImages] = useState<Array<GImage>>([]);
  const [selected, setSelected] = useState<number>(0);
  const [uri, setUri] = useState<string>('');

  const onChangeImage = (index: React.SetStateAction<number>) => {
    setSelected(index);
  };

  useMemo(() => {
    const uriCaptures = data.map(path => ({
      source: {uri: `file://${path}`},
      dimensions: {width: 150, height: 90},
    }));
    setImages(uriCaptures);
  }, [data]);

  useEffect(() => {
    const imageToShare = images.filter(
      (_image: GImage, index: number) => index === selected,
    );
    const {source} = imageToShare[0];
    setUri(source.uri);
  }, [images, selected]);

  const uploadImage = useCallback(async (path: string): Promise<void> => {
    try {
      const name = path.split('tmp/ReactNative/')[1];
      const type = path.split('tmp/ReactNative/')[1].split('.')[1];

      const formData = new FormData();

      formData.append('document', {
        name,
        type: `image/${type}`,
        uri: path,
      } as unknown) as unknown as Blob;

      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };

      const res = axios.post(`${baseURL}${photoApi}`, formData, config);
      console.log('res', res);
    } catch (errors: any) {
      const splitError = errors.toString().split(': ');
      console.log(splitError);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <PressableOpacity style={styles.back} onPress={navigation.goBack}>
        <IonIcon
          name="arrow-back"
          size={35}
          color="white"
          style={styles.icon}
        />
      </PressableOpacity>

      <View style={styles.main}>
        <Text style={styles.text}>My Photos</Text>

        <Gallery
          style={styles.galleryContainer}
          images={images}
          onPageSelected={onChangeImage}
          initialPage={selected}
        />

        <PressableOpacity
          style={styles.shareButton}
          onPress={() => setIsShared(true)}>
          <IonIcon
            name="share-social-outline"
            size={35}
            color="white"
            style={styles.icon}
          />
        </PressableOpacity>
      </View>
      <ShareModal
        showModal={isShared}
        closeModal={() => setIsShared(false)}
        uploadImage={() => uploadImage(uri)}
      />
      <StatusBarBlurBackground />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: 'black',
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  main: {
    flex: 1,
    margin: 50,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  image: {
    width: Dimensions.get('window').width / 2 - 20,
    height: 150,
    margin: 10,
  },
  flatListStyle: {flex: 1},
  shareButtonContainer: {
    alignItems: 'center',
  },
  icon: {
    textShadowColor: 'black',
    textShadowOffset: {
      height: 0,
      width: 0,
    },
    textShadowRadius: 1,
  },
  back: {
    position: 'absolute',
    top: SAFE_AREA_PADDING.paddingTop,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: 40,
    height: 40,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shareButton: {
    position: 'absolute',
    bottom: SAFE_AREA_PADDING.paddingBottom,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: 40,
    height: 40,
  },
});

export default PhotoGallery;
