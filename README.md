# PRONOTE.net server datamine

A datamine concerning JS modules publicly exposed contained in the PRONOTE.net server executable.

## Motivation

Because of new features in PRONOTE and potential breaking changes, we have to follow them in order to make projects like `Pawnote` and `pronotepy` still run smoothly.

## Prerequisites

You may need to have some tools pre-installed depending on your platform.

- [`bun`](https://bun.sh) to execute the main script
- `7z` command available at `C:\Program Files\7-Zip\7z.exe` on Windows, and available globally on any other platform
- `wine` command available globally if you're on anything else than Windows, it will allow us to run tools that are only running on Windows

## Usage

```bash
git clone https://github.com/Vexcited/PRONOTE.modules.js
cd PRONOTE.modules.js

# Install dependencies
bun install

# Run the whole process
bun run ./src/index.ts

# You can now read every extracted modules
ls modules/
```

It should work on every platform, if not please open an issue !

## Credits

We'd like to thank those projects for making this available.

- [Cheerio](https://cheerio.js.org/) to scrap the setup download URL from PRONOTE's frontpage
- [ISx](https://github.com/lifenjoiner/ISx) to extract files from the InstallShield installer
- [unshield](https://github.com/twogood/unshield) to extract `data2.cab` file from the InstallShield installer
- [Prettier](https://prettier.io/) to format modules after processing
