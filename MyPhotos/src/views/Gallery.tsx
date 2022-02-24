import React, {useMemo, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {PressableOpacity} from 'react-native-pressable-opacity';
import IonIcon from 'react-native-vector-icons/Ionicons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Routes} from '../Routes';
import ShareModal from './ShareModal';

type Props = NativeStackScreenProps<Routes, 'MediaPage'>;

const Item = ({item, onPress}: {item: any; onPress: any}) => (
  <View>
    <Image style={styles.image} source={{uri: item.uri}} />
    <View style={styles.main}>
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

const Gallery = ({route}: Props) => {
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
      <FlatList
        style={styles.flatListStyle}
        data={sources}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={item => item.id}
      />
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
    alignItems: 'center',
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
});

export default Gallery;
