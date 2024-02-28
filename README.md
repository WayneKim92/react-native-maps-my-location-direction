# react-native-maps-my-location-direction

Do you want to display your location and direction in react-native-maps?
![my-location-direction](https://github.com/WayneKim92/react-native-maps-my-location-direction/assets/75321423/1b1d90c4-f33d-4cc2-a39e-42c5381c120c)

## Installation

```sh
npm install react-native-maps-my-location-direction
# This package also requires the packages below:
npm install react-native-maps
npm install react-native-compass-heading
npm install react-native-geolocation-service
```

## Usage

```js
import { MyLocationDirection } from 'react-native-maps-my-location-direction';

// ...
<MyLocationDirection
  img={require('./assets/arrow.png')}
  color={'#00AAFF'}  // default undefined
  height={100} // default 100
  width={100} // default 100
  locationFetchInterval={1000} // default 1000
/>
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
