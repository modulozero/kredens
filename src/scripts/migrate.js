"use strict";
exports.__esModule = true;
var yargs_1 = require("yargs");
var _ = yargs_1["default"]
    .scriptName("migrate")
    .command("new [name]", "create a new migration", function (args) {
    args.positional("name", {
        type: "string",
        describe: "name of the migration"
    });
}, function (argv) {
    console.log("hi", argv.name);
})
    .help().argv;
