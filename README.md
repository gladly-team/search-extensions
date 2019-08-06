# Search for a Cause

_Browser extensions for Search for a Cause_

## Developing

### Requirements
* [Yarn](https://yarnpkg.com/en/)

### Getting Started

1. Clone this repository.
2. In the top level directory, run `yarn`. This installs dependencies.
3. Run `yarn run firefox:develop` or `yarn run chromium:develop`. The extensions will rebuild on code changes.

### Building
Run `yarn run build`.

### Testing
Run `yarn run test`.

## Releasing to Firefox Add-ons Store

We need to provide source code for review (see [docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/Source_Code_Submission)). To do so:

1. Download this repository as a .zip file
2. In the Add-ons Developer Hub, upload the .zip file as "Source code" when releasing a new version
3. Paste the following instructions for the reviewer to build from source
```
Instructions for the reviewer to build from source:
1. Go to https://github.com/gladly-team/search-extensions, click "Clone or download", and click "Download ZIP".
2. Unzip the source code file and navigate to the root of the source code directory.
3. Install Yarn (https://yarnpkg.com/en/).
4. Run `yarn` to install dependencies.
5. Run `yarn run firefox:build`. The built extension will be in `./build/firefox/`.
```
