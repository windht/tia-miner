# TIA Miner

**This repo only contains related code, you need Electron Binary to run it in action.**

This is an Electron Miner application that utilize [EWBF's CUDA Zcash miner](https://bitcointalk.org/index.php?topic=1707546.0) to mine Equihash Algorithm based cryptocurrency. Currently it only runs on **Windows**.

**Use this app along with the [Electron API Demos](http://electron.atom.io/#get-started) app for API code examples to help you get started.**

It is more than a simple GUI:

- Real Time Earning - Real time earning calculation (data from [CoinMarketCap](https://coinmarketcap.com/)).
- Auto-Switch (TODO) - Real time feedback from [WhatToMine](https://whattomine.com/) to determine the most profitable currency to mine.
- Remote Control (TODO) - A web-based remote control through TIA IOT interface.

You can learn more about the TIA Miner GPU Hardware at [product page](https://thebuilder.hk/tia-miner/).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Install Electron globally
npm install electron -g
# Clone this repository
git clone https://github.com/windht/tia-miner
# Go into the repository
cd tia-miner
# Install dependencies
npm install 
# Run the app with electron
electron .
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Project Structure

- `app` - All the html related file (GUI)
- `renderer` - All the node api used by GUI
- `miner` - All the miner binary, currently only EWBF Miner.
- `index.html` - Entrance

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
