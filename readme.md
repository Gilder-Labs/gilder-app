# Gilder App

### Installation and start

```
yarn install
yarn start

Download expo go app from apple store
Scan QR code with iphone camera and open in expo
*Should* work
```

Reset Cache
`expo r -c`

### Debugging

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

### Font awesome

- We use pro version of font awesome.
- To get install to work you need to set npm config

```
npm config set "@fortawesome:registry" https://npm.fontawesome.com/
npm config set "//npm.fontawesome.com/:_authToken" "YOUR_FONT_AWESOME_AUTH_TOKEN"
```

### Android specific

- get google-services.json to get FCM config before building/deploying
