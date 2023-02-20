import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import { VersionCheck } from 'react-version-check';

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <>
      <h1>Version Check App</h1>
      <VersionCheck currentVersion="3" />
    </>
  </StrictMode>,
)