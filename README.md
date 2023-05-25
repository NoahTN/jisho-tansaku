# Jisho Tansaku

> Unofficial Chrome extension for conveniently looking up and display words using [Jisho.org](https://jisho.org/).

## Features

- Search results displayed in a popup
- Resizable and moveable

## Installation

1. Download `archive.zip` from [releases page](https://github.com/NoahTN/jisho-tansaku/releases) and unzip it into the directory of choice.
2. Open the Extension Management page by navigating to `chrome://extensions`.
3. Enable Developer Mode by clicking the toggle switch next to **Developer mode**.
4. Click the **LOAD UNPACKED** button and select the unpacked directory named `build`.

## Development

```bash
# install dependencies
npm init

# build extension
npm run build

# build and watch extension
npm run dev

# run Playwright tests
npm run test
```
