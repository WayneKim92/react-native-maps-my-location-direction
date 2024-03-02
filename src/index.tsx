import React, { useEffect, useState } from 'react';
import { Image, Platform } from 'react-native';
import { Marker } from 'react-native-maps';
// @ts-ignore
import CompassHeading from 'react-native-compass-heading';
import Geolocation, { clearWatch } from 'react-native-geolocation-service';
// types
import type { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ImageSourcePropType } from 'react-native/Libraries/Image/Image';

interface MyLocationDirectionProps {
  color?: ColorValue | undefined;
  width?: number;
  height?: number;
  img: ImageSourcePropType;
}

let geolocationWatchId = 0;

export function MyLocationDirection(props: MyLocationDirectionProps) {
  const { color, height = 100, width = 100, img } = props;
  const [coordinate, setCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [angle, setAngle] = useState(0);
  const [tracksViewChanges, setTracksViewChanges] =
    React.useState<boolean>(false);

  function executeAfterDelayForAOS(fun1: () => void, fun2: () => void) {
    if (Platform.OS === 'ios') {
      return;
    }

    fun1();
    setTimeout(fun2, 16);
  }

  useEffect(() => {
    const degree_update_rate = 3;

    CompassHeading.start(
      degree_update_rate,
      ({ heading }: { heading: number }) => {
        setAngle(heading);
        executeAfterDelayForAOS(
          () => setTracksViewChanges(true),
          () => setTracksViewChanges(false)
        );
      }
    );

    return () => {
      CompassHeading.stop();
    };
  }, []);

  useEffect(() => {
    geolocationWatchId = Geolocation.watchPosition(
      (position) => {
        setCoordinate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        executeAfterDelayForAOS(
          () => setTracksViewChanges(true),
          () => setTracksViewChanges(false)
        );
      },
      (error) => {
        console.log('[MyLocationDirection] error', error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        distanceFilter: 0,
      }
    );

    // DEV 환경에서 핫리도드 할 때마다 에러 발생하여 __DEV__ 환경에서는 clearWatch를 사용하지 않도록 수정
    return !__DEV__
      ? () => {
          if (geolocationWatchId != 0) {
            clearWatch(geolocationWatchId);
          }
        }
      : undefined;
  }, []);

  if (coordinate === null) {
    return null;
  }

  return (
    <Marker
      coordinate={coordinate}
      anchor={Platform.OS === 'ios' ? undefined : { x: 0.5, y: 0.5 }} // AOS 중심점 안 맞는 문제로 인하여 필요
      tracksViewChanges={Platform.OS === 'ios' ? undefined : tracksViewChanges} // AOS Flickering 문제로 인하여 필요
    >
      <Image
        source={img}
        style={{
          width,
          height,
          tintColor: color,
          transform: [{ rotate: `${angle}deg` }],
        }}
      />
    </Marker>
  );
}
