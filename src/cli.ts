#!/usr/bin/env node

import * as commander from "commander";
import {translate} from "./main";

const program = new commander.Command();

program.version('0.0.1')
    .name('fy')
    .usage('<word>')
    .arguments('<word>')
    .action(function (word) {

        translate(word)
    })

program.parse(process.argv)