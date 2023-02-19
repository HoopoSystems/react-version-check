# keep your code updated to the latest version!
sometimes browsers cashes websites, thus presenting old version of them.
the VersionCheck component check if your version is the latest,
and if not, it forces hard refresh on the site, to fix this

## usage example
```jsx
import { VersionCheck } from 'version-check';
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
## prebuild-script
to make this work, you will need from time to time to update the version number inside your `package.json` ---
and you will need a script to run on each build to copy this number from `package.json` to `public/meta.json`

### the script:
in the root of your project create a file named `update-version.js` with this content:
```javascript
import fs from "fs";
import packageJson from "./package.json" assert { type: "json" };
const jsonData = JSON.stringify({ version: packageJson.version });

fs.writeFile("./public/meta.json", jsonData, "utf8", function (err) {
  if (err) return console.error("An error occurred while writing JSON Object to meta.json:", err);
  console.log("meta.json file has been saved with latest version number");
});
```
### running on each build: 
in `package.json` file, inside the `scripts` object add this line:
```javascript
"scripts": {
    // ... all your  scripts
    "prebuild": "npm run generate-build-version" // the line to add!
},
```
to test if this working, go to `package.json` and update the version number.  
then, go to your terminal and type this:
```bash
npm run prebuild
```
then check if the file `public/meta.json` have been updated with this version number.

