console.log("CLI command line arguments");
console.log(process.argv);
const args = process.argv.splice(2);
console.log(Number(args[0]) + Number(args[1]));
process.exit();
