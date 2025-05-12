#!/usr/bin/env node
import fs from 'node:fs';
import { program } from 'commander';
import inquirer from 'inquirer';
import { isExistFile, downloadTemplate } from './util.js';

let packageJson;
try {
    packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url)));
} catch (error) {
    console.error("Unable to read 'package.json':", error);
    process.exit(1);
}

const version = packageJson.version;

program.version(version, '-v, --version', 'output the current version');

console.log('alger-cli: Running alg-cli...');

program.command('create <projectName>')
    .alias('c')
    .description('Create a new Alger project')
    .action(async (projectName) => {
        console.log(`Creating a new Alger project: ${projectName}`);

        const inputRes = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectName',
                message: 'Enter project name:',
                default: projectName,
            }
        ])
        if (isExistFile(inputRes.projectName)) {
            console.error(`Project ${inputRes.projectName} already exists. Please choose a different name.`);
            return;
        }

        const chooseRes = await inquirer.prompt([
            {
                type: 'list',
                name: 'template',
                message: 'Select a template:',
                choices: ['vue', 'react', 'uni-app'],
            },
            {
                type: "confirm",
                name: "isTypeScript",
                message: "Do you want to use TypeScript?",
                default: true,
            }
        ])

        if (chooseRes.isTypeScript) {
            downloadTemplate(chooseRes.template, inputRes.projectName)
        } else {
            downloadTemplate(chooseRes.template, inputRes.projectName)  // TODO: Add non-TypeScript template
        }

    });


if (!process.argv.slice(2).length) {
    program.outputHelp();
}

program.parse(process.argv);