# keep your code updated to its latest version!
Sometimes browsers cash websites, thus presenting an old version of them.
The `<VersionCheck>` component checks if your version is the latest,
and if not, it forces a hard refresh to fix this.

## usage example
```jsx
import { VersionCheck } from 'react-version-check';
import packageJson from "../package.json";

export function App() {
  return (
    <>
      <VersionCheck currentVersion={packageJson.version} />
      <div>your website</div>
    </>
  );
}
```
## helper script
To make this work, you will need from time to time to update the version number inside your `package.json` ---
and you will need a script to run on each build to copy this number from `package.json` to `public/meta.json`

### the script:
In the root of your project create a file named `update-version.js` with this content:
```javascript
import fs from "fs";
import packageJson from "./package.json" assert { type: "json" };
const jsonData = JSON.stringify({ version: packageJson.version });

fs.writeFile("./public/meta.json", jsonData, "utf8", function (err) {
  if (err) return console.error("An error occurred while writing JSON Object to meta.json:", err);
  console.log("meta.json file has been saved with latest version number");
});
```
### running on each build/start: 
In the `package.json` file, inside the `scripts` object add those line:
```javascript
"scripts": {
  "update-version": "node update-version",
  "start": "npm run update-version && npm start", // you can replace ["npm start"] with whatever start-command you had before
  "prebuild": "npm run generate-build-version"
},
```
To test if this is working, go to `package.json` and update the version number.  
then, go to your terminal and run:
```bash
npm run update-version
```
Now check if the file `public/meta.json` has been updated with this version number.

## component props
The configurable props of `<VersionCheck>` component:

|      name      |                     type                      |                                                                                                                                                 description                                                                                                                                                 |
|:--------------:|:---------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| `currentVersion` |           `string` <br/>(required)            |                                                                                            the version that will be compared against the version on the server. <br/>should pass it a value from `package.json`                                                                                             |
| `serverFilePath` |    `string` <br/>(default: `"/meta.json"`)    |                                                the name of the file on the server that the component will fetch and take the version from.<br/>should be a name of a .json file under `public` directory, that contains content like:<br/>`{"version":"1.0.0"}`                                                |
|  `dependencies`  |         `any[]` <br/>(default: `[]`)          |                                                                                      list of dependencies that will trigger re-checking of the version. <br/>when empty, the checking will only happen on first-render                                                                                      |
|      `logs`      |       `boolean` <br/>(default: `true`)        |                                                                                                                  when true, the component will print `console.log` that explain what it does                                                                                                                  |
|    `display`     |       `boolean` <br/>(default: `true`)        |                                                                                                     when true, render small text in the corner of the screen (version text / error text / loading text)                                                                                                     |
|   `className`    |                   `string`                    |                                                                                                                         override the default design with your own custom className                                                                                                                          |
|     `style`      |             `React.CSSProperties`             |                                                                                                                           override the default design with your own custom style                                                                                                                            |
|      `side`      | `"left"` or `"right"` <br/>(default: `"left"`) |                                                                                                                              in which side of the screen should be displayed?                                                                                                                               |

