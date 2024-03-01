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

export function MyLocationDirection(props: MyLocationDirectionProps) {
  const { color, height = 100, width = 100, img } = props;
  // @ts-ignore
  const [coordinate, setCoordinate] = useState({ latitude: 0, longitude: 0 });
  // @ts-ignore
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const degree_update_rate = 3;

    CompassHeading.start(
      degree_update_rate,
      ({ heading }: { heading: number }) => {
        setAngle(heading);
      }
    );

    return () => {
      CompassHeading.stop();
    };
  }, []);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        setCoordinate({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
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

    return () => {
      clearWatch(watchId);
    };
  }, []);

  return (
    <Marker
      coordinate={coordinate}
      anchor={Platform.OS === 'ios' ? undefined : { x: 0.5, y: 0.5 }} // AOS 중심점 안 맞는 문제로 인하여 필요
    >
      {/*@ts-ignore*/}
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
