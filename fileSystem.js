class Node {
	constructor(path, parent) {
		// Adding a parent property in case we need to read / traverse back UP the tree
		this.path = path;
		this.parent = parent;
	}
}

class Directory extends Node {
	constructor(path, parent) {
		super(path, parent);
		this.children = new Map();
		this.contents = [];
	}
}

class File extends Node {
	constructor(path, parent, name) {
		super(path, parent);
		(this.name = name), (this.contents = '');
	}
}

// Creating a FileSystem class as the base class since this is what performs the read operation
class FileSystem {
	constructor() {
		this.path = '';
		this.children = new Map();
		this.contents = [];
	}

	// _ are private helper functions
	_argsFromPath(path) {
		return path.split('/').filter((str) => str.length > 0);
	}

	ls(path) {
		let node = this;
		const args = this._argsFromPath(path);
		for (let i = 0; i < args.length; i++) {
			const arg = args[i];
			if (node.children.has(arg)) {
				node = node.children.get(arg);
			} else {
				break;
			}
		}
		return Array.isArray(node.contents) ? node.contents.sort() : [ node.name ];
	}

	mkdir(path) {
		this._traverseAndCreate(path);
		return;
	}

	// Function that handles obtaining arguments and checking if that file node exists
	// If it does not, we create it
	_traverseAndCreate(path) {
		let node = this;
		const args = this._argsFromPath(path);
		console.log(args);

		let currPath = this.path;
		for (let i = 0; i < args.length; i++) {
			const arg = args[i];
			currPath = currPath + '/' + arg;
			let next;
			if (!node.children.has(arg)) {
				next = new Directory(currPath, node);
				node.children.set(arg, next);
				node.contents.push(arg);
			} else {
				next = node.children.get(arg);
			}
			node = next;
		}
		return node;
	}

	addContentToFile(filePath, content) {
		const args = this._argsFromPath(filePath);
		const fileName = args[args.length - 1];
		const node = this._traverseAndCreate(args.slice(0, args.length - 1).join('/'));

		if (!node.children.has(fileName)) {
			const file = new File(node.path + '/' + fileName, node, fileName);
			file.contents = content;
			node.children.set(fileName, file);
			node.contents.push(fileName);
		} else {
			const existingFile = node.children.get(fileName);
			existingFile.contents = existingFile.contents + content;
			node.children.set(fileName, existingFile);
		}
	}

	readContentFromFile(filePath) {
		const node = this._traverseAndCreate(filePath);
		return node.contents;
	}
}

// Instantiation and test cases
const fs = new FileSystem();
console.log(fs.ls('/'));
console.log(fs.mkdir('/a/b/c'));
fs.addContentToFile('a/b/c/d', 'hello');
console.log(fs.readContentFromFile('a/b/c/d'));
