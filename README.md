# PRONOTE.net server datamine

A datamine concerning JS modules publicly exposed contained in the PRONOTE.net server executable.

## Motivation

Because of new features in PRONOTE and potential breaking changes, we have to follow them in order to make projects like [Pawnote](https://pawnote.docs.literate.ink) and [pronotepy](https://github.com/bain3/pronotepy) work smoothly.

## Prerequisites

You may need to have some tools pre-installed depending on your platform.

- [Bun](https://bun.sh) to execute the main script
- `7z` command available at `C:\Program Files\7-Zip\7z.exe` on Windows, and available globally on any other platform
- [`wine`](https://gitlab.winehq.org/wine/wine) command available globally if you're on anything else than Windows, it will allow us to run tools that are only running on Windows

## Usage

```bash
git clone https://github.com/Vexcited/PRONOTE.modules.js
cd PRONOTE.modules.js

# Install dependencies
bun install

# Run the whole process
bun run src/index.ts

# You can now read every extracted modules
ls modules
```

It should work on every platform, if not please open an issue !

## Where to find?

You can watch the previous runs in the [`modules` branch](https://github.com/Vexcited/PRONOTE.modules.js/tree/modules).
It is filled by a CI that runs every two hours and checks if any update has been released.

## What is the `unused` folder?

This is a folder where we put modules that are not used in any `require(...)` statement in the whole codebase.

There's some issues with parsing require so that's why we put them there in case we need them later, notably for scripts imported directly via the `<script>` tag and not tracked here.

## Credits

I'd like to thank those projects for making this available.

- [Cheerio](https://cheerio.js.org/) to scrap the setup download URL from PRONOTE's frontpage
- [ISx](https://github.com/lifenjoiner/ISx) to extract files from the InstallShield installer
- [unshield](https://github.com/twogood/unshield) to extract `data2.cab` file from the InstallShield installer
- [Prettier](https://prettier.io/) to format modules after processing
