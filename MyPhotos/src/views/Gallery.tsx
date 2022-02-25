import React, {useMemo, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {PressableOpacity} from 'react-native-pressable-opacity';
import IonIcon from 'react-native-vector-icons/Ionicons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Routes} from '../Routes';
import ShareModal from './ShareModal';
import {StatusBarBlurBackground} from './StatusBarBlurBackground';
import {SAFE_AREA_PADDING} from '../Constants';

type Props = NativeStackScreenProps<Routes, 'MediaPage'>;

const Item = ({item, onPress}: {item: any; onPress: any}) => (
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

  const sources = useMemo(() => {
    const uriCaptures = data.map(path => ({uri: `file://${path}`, id: path}));
    return uriCaptures;
  }, [data]);

  const renderItem = ({item}: {item: any}) => {
    return <Item item={item} onPress={() => setIsShared(true)} />;
  };

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
      <StatusBarBlurBackground />
      <ShareModal showModal={isShared} closeModal={() => setIsShared(false)} />
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
