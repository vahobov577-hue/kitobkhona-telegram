/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
// Cloud sandbox only: use the pre-installed headless shell through the HTTPS proxy.
// On a normal machine this block is skipped and Remotion downloads its own browser.
import fs from 'node:fs';
import path from 'node:path';
if (fs.existsSync('/opt/pw-browsers')) {
  Config.setBrowserExecutable(path.resolve('scripts/chrome-proxy.sh'));
}
