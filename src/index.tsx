import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { Marker } from 'react-native-maps';
// @ts-ignore
import CompassHeading from 'react-native-compass-heading';
import Geolocation from 'react-native-geolocation-service';
// types
import type { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type { ImageSourcePropType } from 'react-native/Libraries/Image/Image';

interface MyLocationDirectionProps {
  color?: ColorValue | undefined;
  width?: number;
  height?: number;
  locationFetchInterval?: number;
  img: ImageSourcePropType;
}

export function MyLocationDirection(props: MyLocationDirectionProps) {
  const {
    color = '#00AAFF',
    height = 100,
    width = 100,
    locationFetchInterval = 1000,
    img,
  } = props;
  const [coordinate, setCoordinate] = useState({ latitude: 0, longitude: 0 });
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
    const intervalId = setInterval(() => {
      Geolocation.getCurrentPosition(
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
          forceRequestLocation: true,
          forceLocationManager: true,
        }
      );
    }, locationFetchInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [locationFetchInterval]);

  return (
    <Marker coordinate={coordinate}>
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
