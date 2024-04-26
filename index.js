#!/usr/bin/env node

import { Command } from "commander";
import bookDesk from "./src/bookDesk.js";
import bookWithCronDesk from "./src/bookWithCronDesk.js";

const program = new Command();
program
  .command("book <deskId>")
  .description("Book a given deskId for today")
  .action(bookDesk);

program
  .command("recurring <cron> <deskId>")
  .option("-l, --limit <n>", "Book the same desk for the next X times", 4)
  .description("Book a given deskId following a cron pattern")
  .action(bookWithCronDesk);

program.parse(process.argv);
