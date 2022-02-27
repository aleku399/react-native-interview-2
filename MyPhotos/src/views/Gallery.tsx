import React, {useCallback, useMemo, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FlatList} from 'native-base';
import {PressableOpacity} from 'react-native-pressable-opacity';
import IonIcon from 'react-native-vector-icons/Ionicons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Routes} from '../Routes';
import ShareModal from './ShareModal';
import {StatusBarBlurBackground} from './StatusBarBlurBackground';
import {SAFE_AREA_PADDING} from '../Constants';
import {photoApi} from '../lib/apiEndpoints';
import {authAxios} from '../lib/axios';

type Props = NativeStackScreenProps<Routes, 'MediaPage'>;

interface Item {
  uri: string;
  id: string;
}

const Item = ({item, onPress}: {item: Item; onPress: any}) => (
  <View>
    <Image style={styles.image} source={{uri: item.uri}} />
    <View style={styles.shareButtonContainer}>
      <PressableOpacity style={styles.shareButton} onPress={onPress}>
        <IonIcon
          name="share-social-outline"
          size={35}
          color="white"
          style={styles.icon}
        />
      </PressableOpacity>
    </View>
  </View>
);

const Gallery = ({route, navigation}: Props) => {
  const {data} = route.params;
  const [isShared, setIsShared] = useState(false);
  const [img, setImg] = useState('');

  const sources = useMemo(() => {
    const uriCaptures = data.map(path => ({uri: `file://${path}`, id: path}));
    return uriCaptures;
  }, [data]);

  const onPress = (item: Item) => {
    setIsShared(true);
    setImg(item.uri);
  };

  const renderItem = ({item}: {item: Item}) => {
    return <Item item={item} onPress={() => onPress(item)} />;
  };

  const uploadingImage = async (
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<void> => {
    try {
      const url = photoApi;
      const response = await authAxios().post(url, body, {
        headers,
      });
      console.log('response', response);
    } catch (errors: any) {
      const splitError = errors.toString().split(': ');
      console.log(splitError);
    }
  };

  const uploadImage = useCallback(async (path: string): Promise<void> => {
    const name = path.split('tmp/ReactNative/')[1];
    const type = path.split('tmp/ReactNative/')[1].split('.')[1];

    const formData = new FormData();

    formData.append('document', {
      name,
      type: `image/${type}`,
      uri: path,
    } as unknown) as unknown as Blob;

    await uploadingImage(formData, {
      'Content-Type': 'multipart/form-data',
    });
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

        <FlatList
          style={styles.flatListStyle}
          data={sources}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={item => item.id}
        />
      </View>
      <ShareModal
        showModal={isShared}
        closeModal={() => setIsShared(false)}
        uploadImage={uploadImage(img)}
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
  main: {
    flex: 1,
    marginTop: 50,
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
});

export default Gallery;
