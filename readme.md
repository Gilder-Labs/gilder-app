# Gilder App

### Installation and start

```
yarn install
yarn start
```

Reset Cache
`expo r -c`

### Debugging

## Not set up currently

- https://blog.expo.dev/developing-react-native-with-expo-and-flipper-8c426bdf995a

## React native debugger

`open "rndebugger://set-debugger-loc?host=localhost&port=19000"`

### Things to try if all else fails

```
rd %localappdata%\Temp\metro-cache /s /q
del %localappdata%\Temp\haste-map*
gradlew clean
rd node_modules /q /s
npm cache clean --force
npm start -- --reset-cache
```
