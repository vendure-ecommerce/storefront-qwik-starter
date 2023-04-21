/**
 * From https://gist.github.com/DustinJSilk/b928a228b15da5b87df7c259ffdf2b0d
 */
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

async function getJsonFiles(source: string) {
	const files = await readdir(source, { withFileTypes: true });

	return files
		.filter((file) => !file.isDirectory() && file.name.includes('.json'))
		.map((file) => ({ name: file.name, path: join(source, file.name) }));
}

async function getFilesRecursively(dir: string): Promise<string[]> {
	const dirents = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		dirents.map((dirent) => {
			const res = resolve(dir, dirent.name);
			return dirent.isDirectory() ? getFilesRecursively(res) : res;
		})
	);
	return Array.prototype.concat(...files);
}

/**
 * Objects can't be sorted in JS so it must sorted as a string and then repaired
 */
async function sortTranslations(file: string, valueOrder?: string[], keyOrder?: string[]) {
	const locale = file.match(/\.(.*)\./)![1];
	console.log(`sorting ${locale}`);

	const text = await readFile(file, { encoding: 'utf-8' });

	const translations = text.match(/translations":\s{\n((.|\n)*)\n\s*}\n}/)![1];

	const list = translations.split(',\n');

	list.sort((a, b) => {
		let aIndex = 0;
		let bIndex = 0;

		if (valueOrder) {
			const aVal = a.match(/:\s"(.*)"/)![1];
			const bVal = b.match(/:\s"(.*)"/)![1];
			aIndex = valueOrder.findIndex((val) => val === aVal);
			bIndex = valueOrder.findIndex((val) => val === bVal);
		} else if (keyOrder) {
			const aKey = a.match(/"(.*)":/)![1];
			const bKey = b.match(/"(.*)":/)![1];
			aIndex = keyOrder.findIndex((val) => val === aKey);
			bIndex = keyOrder.findIndex((val) => val === bKey);
		}

		return aIndex - bIndex;
	});

	const output = text.replace(translations, list.join(',\n'));

	await writeFile(file, output, { encoding: 'utf-8' });

	return list;
}

/** Returns the order that each localization is found in the src folder */
async function getSortOrder() {
	const dir = join(process.cwd(), 'src');
	const files = await getFilesRecursively(dir);

	const out: string[] = [];

	for (const file of files) {
		const text = await readFile(file, { encoding: 'utf-8' });
		const localized = text.match(/(\$localize\`.*\`)/g);
		if (localized) {
			out.push(...localized.map((l) => l.replace(/((^\$localize\`)|(\`$))/g, '')));
		}
	}

	return out;
}

async function main() {
	const dir = join(process.cwd(), process.argv[2]);
	const files = await getJsonFiles(dir);

	const order = await getSortOrder();

	const defaultLocale = files.find((f) => f.name.endsWith('.en.json'));
	const defaultList = await sortTranslations(defaultLocale!.path, order);
	const keyOrder = defaultList.map((i) => i.match(/"(.*)":/)![1]);

	for (const file of files) {
		if (file.name.endsWith('.en.json')) {
			continue;
		}
		await sortTranslations(file.path, undefined, keyOrder);
	}
}

main();
