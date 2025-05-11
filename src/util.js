import ora from 'ora';
import download from "download-git-repo";
import fs from 'node:fs';
import { templates } from './constants.js';

const spinner = ora('Creating project...')

export function downloadTemplate(template, projectName) {
    return new Promise((resolve, reject) => {
        spinner.start();

        const branch = '';

        switch (template) {
            case 'vue':
                template = 'vue-vben-admin';
                break;
            case 'react':
                template = 'react-xs-admin';
                break;
            case 'uni-app':
                template = '';  // TODO: Add uni-app template
                break;
        }

        let templateUrl = templates.find((item) => item.name === template).url;

        download(`direct:${templateUrl}${branch}`, projectName, { clone: true }, (err) => {
            if (err) {
                spinner.fail('Failed to create project', err.message);
                reject(err);
            } else {
                spinner.succeed('Project created successfully');
                resolve();
            }
        });
    });
}

export function isExistFile(path) {
    return fs.existsSync(path);
}