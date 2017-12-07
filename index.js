#!/usr/bin/env node

let download = require('download-git-repo');
let path = require('path');
let fs = require('fs-extra');
let repo = 'victorwpbastos/pms-theme-wfc';
let argv = require('minimist')(process.argv.slice(2));
let destination = argv._[0] || process.cwd();
let overwrite = argv.force || argv.f;
let destinationIsEmpty = true;

destination = path.resolve(process.cwd(), destination);

// destination folder is empty?
try {
	destinationIsEmpty = fs.readdirSync(destination).length === 0;
} catch (error) {
	destinationIsEmpty = true;
}

if (!destinationIsEmpty) {
	// if not empty, asks for --force
	if (!overwrite) {
		console.log();
		console.log(`The folder ${destination} is not empty. Use '--force' to overwrite.`);
		console.log();
		return;
	}

	// if --force is passed, try to remove the destination folder
	try {
		fs.emptyDirSync(destination);
	} catch (error) {
		console.log();
		console.log(`Unable to exclude the folder ${destination}.`);
		console.log();
		return;
	}
}

// download the github repo contents to the destination folder
download(repo, destination, function (error) {
	if (error) {
		console.log(error);
		return;
	}

	let pkgPath = path.resolve(destination, 'package.json');
	let pkg = require(pkgPath);

	pkg.name = path.basename(destination).toUpperCase();
	pkg.description = pkg.name;

	fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, '\t'));

	console.log();
	console.log('Success!');
	console.log();
});