import React from "react";
import { CSSProperties, FC, ReactNode, useEffect, useState } from "react";
const WAS_REFRESHED_BEFORE = "was-refreshed-before";

function semverGreaterThan(versionA: string, versionB: string): boolean {
  const versionsA = versionA.split(/\./g);
  const versionsB = versionB.split(/\./g);
  while (versionsA.length || versionsB.length) {
    const a = Number(versionsA.shift());
    const b = Number(versionsB.shift());
    if (a === b) continue;
    return a > b || isNaN(b);
  }
  return false;
}

function refreshCacheAndReload() {
  localStorage.setItem(WAS_REFRESHED_BEFORE, "true");
  if (caches) {
    // Service worker cache should be cleared with caches.delete()
    caches.keys().then(function (names) {
      for (const name of names) caches.delete(name);
    });
  }
  // delete browser cache and hard reload
  window.location.reload();
}

const defaultStyle: CSSProperties = {
  position: "fixed",
  bottom: 0,
  zIndex: 99999,
  padding: "3px 7px",
  fontSize: "12px",
  background: "#5d5d5d",
  color: "white",
  letterSpacing: "1px",
  fontFamily: "Helvetica"
};

interface Props {
  /**
   * the version that will be compared against the version on the server.
   * should pass it a value from package.json
   * @example
   * import { VersionCheck } from 'version-check';
   * import packageJson from "../package.json";
   *
   * export function App() {
   *   return (
   *     <>
   *       <VersionCheck currentVersion={packageJson.version} />
   *       <div>your website</div>
   *     </>
   *   );
   * }
   * */
  currentVersion: string;
  /**
   * the name of the file on the server that the component will fetch and take the version from.
   * should be a name of a .json file under "public" directory, that contains content like:
   * {"version":"1.0.0"}
   * @default "/meta.json"
   */
  serverFilePath?: string;
  /**
   * list of dependencies that will trigger re-checking of the version. when empty, the checking will only happen on first-render
   * @default []
   * */
  dependencies?: any[];
  /**
   * when true, the component will print console.log that explain what it does
   * @default true */
  logs?: boolean;
  /**
   * when true, render small text in the corner of the screen (version text / error text / loading text)
   * @default true
   */
  display: "none" | "default";
  /** override the default design with your own custom className */
  className?: string;
  /** override the default design with your own custom style */
  style?: CSSProperties;
  /**
   * in which side of the screen should be displayed?
   * @default "left"
   * */
  side?: "left" | "right";
}

/**
 * sometimes browsers cashes websites, thus presenting old version of the site.
 * the VersionCheck component check if your version is the latest,
 * and if not, it forces hard refresh on the site, to bring its latest version.
 * */
export const VersionCheck: FC<Props> = (props) => {
  const {
    currentVersion,
    logs = true,
    display = true,
    dependencies = [],
    serverFilePath = "/meta.json",
    className = "",
    style = {},
    side = "left",
  } = props;
  const [loading, setLoading] = useState(false);
  const [isLatestVersion, setIsLatestVersion] = useState(true);
  const [error, setError] = useState(false);
  function print(msg: string, logger = console.log) {
    if (logs) logger(`VERSION-CHECK: ${msg}`);
  }

  const Render: FC<{children: ReactNode}> = (p) => {
    const newStyle: CSSProperties = {
      [side]: 0,
      ...defaultStyle,
      ...style
    };

    return (
      <div style={newStyle} className={className}>
        {p.children}
      </div>
    );
  }

  useEffect(() => {
    if (localStorage.getItem(WAS_REFRESHED_BEFORE)) {
      localStorage.removeItem(WAS_REFRESHED_BEFORE);
      print("server version is bigger then local version", console.error);
      setError(true);
      return;
    }
    // reset all
    setLoading(true);
    setIsLatestVersion(false);
    setError(false);

    fetch(serverFilePath)
      .then((response) => response.json())
      .then((meta) => {
        print("fetching version...");
        const latestVersion = meta.version;
        if (!latestVersion)
          throw new Error(`property "version" was not found in the file: ${serverFilePath}.json`);
        const shouldForceRefresh = semverGreaterThan(latestVersion, currentVersion);
        if (shouldForceRefresh) {
          print(`we have a new version - ${latestVersion}. should force refresh`);
          setIsLatestVersion(false);
        } else {
          print(`you already have the latest version: ${currentVersion}. no cache refresh needed.`);
          setIsLatestVersion(true);
        }
      })
      .catch((e) => {
        print(e, console.error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, dependencies);

  if (loading || error || isLatestVersion) {
    if (!display) return null;

    if (loading) {
      return <Render>loading version...</Render>;
    }
    if (error) {
      return <Render>version error</Render>;
    }
    return (
      <Render>
        version: <code>{currentVersion}</code>
      </Render>
    );
  }

  print("clearing cache and hard reloading...");
  refreshCacheAndReload();
  return null;
};