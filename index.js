#!/usr/bin/env node

import { Command } from "commander";
import bookDesk from "./src/bookDesk.js";
import bookDeskForUser from "./src/bookDeskForUser.js";
import bookWithCronDesk from "./src/bookWithCronDesk.js";
import office from "./src/office.js";
import cancel from "./src/cancel.js";

const program = new Command();
program
  .command("book <deskId>")
  .option("-d, --date <date>", "Date to book for")
  .description("Book a given deskId")
  .action(bookDesk);

program
  .command("bookForUser <deskId> <userId>")
  .option("-d, --date <date>", "Date to book for")
  .description("Book a given deskId for given userId")
  .action(bookDeskForUser);

program
  .command("recurring <cron> <deskId>")
  .option("-l, --limit <n>", "Book the same desk for the next X times", 4)
  .description("Book a given deskId following a cron pattern")
  .action(bookWithCronDesk);

program
  .command("office <team>")
  .option("-d, --date <date>", "Date to look for")
  .description("View the desk of a given team")
  .action(office);

program
  .command("cancel <bookingId>")
  .description("Cancel a booking")
  .action(cancel);

program.parse(process.argv);
