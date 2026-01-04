# @marcuth/mediafire

**@marcuth/mediafire** is a package for the [Mediafire](https://mediafire.com) service designed to communicate with its API, handling authentication, file management, and folder organization.

## 📦 Installation

Installation is straightforward; simply use your preferred package manager. Here is an example using NPM:

```bash
npm i @marcuth/mediafire

```

## 🚀 Usage

<a href="https://www.buymeacoffee.com/marcuth">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="200">
</a>

### Authentication

To access the routes, you must first authenticate. There are two ways to do this: using email and password (the only method implemented so far) or via API Keys.

**Using email and password:**

```ts
import { Mediafire } from "@marcuth/mediafire"

;(async () => {
	const mediafire = new Mediafire({
		email: "YOUR_EMAIL",
		password: "YOUR_PASSWORD"
	})
	
	await mediafire.logIn()
})();

```

---

### Folders

#### Getting information

```ts
import { Mediafire } from "@marcuth/mediafire"

;(async () => {
	// Your way of instantiating Mediafire

	const folderInfo = await mediafire.folders.getInfo({
		folderKey: "your-folder-key"
	})

	console.log(folderInfo)
})();

```

#### Getting information by path

```ts
import { Mediafire } from "@marcuth/mediafire"

;(async () => {
	// Your way of instantiating Mediafire

	const folderInfo = await mediafire.folders.getInfo({
		folderPath: "path/to/folder"
	})

	console.log(folderInfo)
})();

```

#### Getting contents

```ts
import { Mediafire } from "@marcuth/mediafire"

;(async () => {
	// Your way of instantiating Mediafire

	const folderContents = await mediafire.folders.getContents({
		folderKey: "your-folder-key"
	})

	console.log(folderContents)
})();

```

#### Getting contents by path

```ts
import { Mediafire } from "@marcuth/mediafire"

;(async () => {
	// Your way of instantiating Mediafire

	const folderContents = await mediafire.folders.getContents({
		folderPath: "path/to/folder"
	})

	console.log(folderContents)
})();

```

---

### Files

#### Getting information

```ts
import { Mediafire } from "@marcuth/mediafire"

;(async () => {
	// Your way of instantiating Mediafire

	const fileInfo = await mediafire.files.getInfo({
		quickKey: "your-quick-key"
	})

	console.log(fileInfo)
})();

```

#### Getting information by path

```ts
import { Mediafire } from "@marcuth/mediafire"

;(async () => {
	// Your way of instantiating Mediafire

	const fileInfo = await mediafire.files.getInfoByPath({
		filePath: "path/to/folder/file.ext"
	})

	console.log(fileInfo)
})();

```

#### Getting download links

```ts
import { Mediafire } from "@marcuth/mediafire"

;(async () => {
	// Your way of instantiating Mediafire

	const fileLinksInfo = await mediafire.files.getLinks({
		quickKey: "your-quick-key"
	})

	console.log(fileLinksInfo)
})();

```

#### Uploading a file

```ts
import { Mediafire } from "@marcuth/mediafire"
import fs from "node:fs"

;(async () => {
	// Your way of instantiating Mediafire

	const uploadInfo = await mediafire.files.upload({
		fileName: "file.ext",
		file: fs.createReadStream("path/to/source-file.ext")
	})

	console.log(uploadInfo)
})();

```

#### Uploading a file to a specific path

```ts
import { Mediafire } from "@marcuth/mediafire"
import fs from "node:fs"

;(async () => {
	// Your way of instantiating Mediafire

	const uploadInfo = await mediafire.files.uploadToPath({
		filePath: "path/to/destination/file.ext",
		file: fs.createReadStream("path/to/source-file.ext")
	})

	console.log(uploadInfo)
})();

```

---

## 🧪 Testing

Automated tests are located in the `__tests__` directory. To run them:

```bash
npm run test

```

## 🤝 Contributing

Want to contribute? Follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-new`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-new`).
5. Open a Pull Request.

## 📝 License

This project is licensed under the MIT License.
