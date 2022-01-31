Gilder App

`expo -r -c`

Debugging
`open "rndebugger://set-debugger-loc?host=localhost&port=19000"`
Run app at the same port or change port in rndebugger command

Other things to try to get a fresh start

```
rd %localappdata%\Temp\metro-cache /s /q
del %localappdata%\Temp\haste-map*
gradlew clean
rd node_modules /q /s
npm cache clean --force
npm start -- --reset-cache
```
