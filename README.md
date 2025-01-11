# backman
## A simple way to backup your downloads from the internet

### Installation



#### Build from source

* Clone the repositor
* Install dependencies:

```bash
bun install
```

* Compile:

```bash
bun build ./back.ts --compile --outfile backman
```
* Optional: Move into the /usr/bin folder for easy access from anywhere
```bash
mv backman /usr/bin
``` 

This project was created using `bun init` in bun v1.1.38. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
