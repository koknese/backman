# backman
## A simple way to backup your downloads from the internet

### Installation
#### Build from source (recommended)

* Clone the repository
* Install dependencies:

```bash
bun install
```

* Compile:

```bash
bun build ./backman.ts --compile --outfile backman
```
* Optional: Move into the /usr/bin folder for easy access from anywhere
```bash
mv backman /usr/bin
```

## Install from npm (not recommended)
- npm
```bash
npm i backman-ts
```

-# I have no idea on how NPM publishing works, and running the package with `bunx backman-ts` did not work, hence I recommend compiling the package.

This project was created using `bun init` in bun v1.1.38. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
