Gilder App

### Installation and start

```
yarn install
expo start --dev-client
```

Reset Cache
`expo r -c`

### Debugging

- https://blog.expo.dev/developing-react-native-with-expo-and-flipper-8c426bdf995a

Running Flipper

```
rd %localappdata%\Temp\metro-cache /s /q
del %localappdata%\Temp\haste-map*
gradlew clean
rd node_modules /q /s
npm cache clean --force
npm start -- --reset-cache
```
