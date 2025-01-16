import { Command } from 'commander';
import fs from 'fs';
import * as path from 'path';
import { confirm } from '@inquirer/prompts';
import axios from 'axios';
import chalk from 'chalk';


const program = new Command();

program
  .name('backman')
  .description('Backup your files downloaded from the internet in a single file!')
  .version('1.0.1');

program
  .command('download')
  .description('Download an file and log it to backman.json.')
  .argument('<url>', 'URL to ')
  .action((url) => {
    if (process.env.BACKMAN_PATH != undefined) {
          const filename = url.split("/").pop();
          
          let path = process.env.BACKMAN_PATH

          axios.get(url, { responseType: 'stream' })
            .then((response) => {
              console.log(">>> Initiating download...")
              const file = fs.createWriteStream(`${path}/${filename}`);
              response.data.pipe(file);

              const totalSize = response.headers['content-length'];
              let downloadedSize = 0;

              response.data.on('data', (chunk) => {
                downloadedSize += chunk.length;
                const progress = (downloadedSize / totalSize) * 100;
                process.stdout.write(`>>> Downloading ${chalk.green(filename)} (${progress.toFixed(1)}%) \r` );
              });
            
              file.on('finish', () => {
                file.close();
                  console.log('Download finished!');
                  console.log("Logging into backman.js...")

                  var fileObject = {
                    "name" : filename,
                    "url" : url
                  }

                  const jsonPath = `${process.env.BACKMAN_PATH}/backman.json`;

                  const jsonData = fs.readFileSync(jsonPath, 'utf8');
                  const parsedJson = JSON.parse(jsonData);

                  parsedJson.push( fileObject )
                  fs.writeFileSync(jsonPath, JSON.stringify(parsedJson, null, 2));
              });
            })
            .catch((err) => {
              console.error(err);
            });
    } else {    
      console.error("BACKMAN_PATH is undefined. Define it in your shell rc (e.g bashrc, zshrc).");
    }});
    

program
  .command('generate')
  .description('Generate a backman.json to your BACKMAN_PATH.')
  .action(() => {
    async function generateBackman() {
      
    const answer = await confirm({ message: 'This will OVERWRITE the current bcakman.json file and make it blank. Make sure you have backed it up if you already have generated a backman.json. Continue?' });

    const path = process.env.BACKMAN_PATH;
    console.log(`BACKMAN_PATH set to ${path}. Your downloaded files (including your backman.json) will be found there.`)

    const template = `
    [

    ]
    `
    Bun.write(`${path}/backman.json`, template)
    console.log('backman.json is created.')
    }
    generateBackman()
  })

  program
  .command('fetch')
  .description('Download all your files that were logged in backman.json.')
  .argument('<path>', 'Path to the backman.json.')
  .action((path) => {
    const jsonPath = path;

    let downloadedFiles = .0;

    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const parsedJson = JSON.parse(jsonData);
    parsedJson.forEach((file: { url: string; name: string; on: (arg0: string, arg1: () => void, arg2: Command) => void; close: () => void; }) => {
      let path = process.env.BACKMAN_PATH

      axios.get(file.url, { responseType: 'stream' })
        .then((response) => {
          const writeStream = fs.createWriteStream(`${path}/${file.name}`);

          const totalSize = response.headers['content-length'];
          let downloadedSize = 0

          console.log(`>>> Initiating download...`)

          response.data.on('data', (chunk) => {
            downloadedSize += chunk.length;
            const progress = (downloadedSize / totalSize) * 100;
            let lastProgress = 0
            if (progress - lastProgress >= 1) { 
              process.stdout.write(`>>> Downloading ${chalk.green(file.name)} (${progress.toFixed(1)}%) \r` );
              lastProgress = progress;
            }
          });

          response.data.pipe(writeStream).on('finish', () => {
            downloadedFiles++
            console.log(">>> Downloaded" + ` (${chalk.green(downloadedFiles)} of ${chalk.green(parsedJson.length)}) ` + chalk.green(file.name));
          })
          .on('error', (err: any) => {
            console.error(err);
          });
        })
        .catch((err: any) => {
          console.error(err);
        });
    });
  });

program.parse();

