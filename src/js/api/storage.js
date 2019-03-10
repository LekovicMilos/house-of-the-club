const createDefaultOptions = () => {
	let options = {
		api_key: '',
		randomPhotos: [],
		date: {}
	};

	return options;
};

export const DEFAULT_EXTENSION_OPTIONS = createDefaultOptions();

export const saveToStorage = options => {
	const setOptions = new Promise(resolve => {
		chrome.storage.sync.set(options, () => {
			resolve(true);
		});
	});

	return setOptions;
};

export const restoreFromStorage = () => {
	const getOptions = new Promise(resolve => {
		chrome.storage.sync.get(DEFAULT_EXTENSION_OPTIONS, options => {
			resolve(options);
		});
	});

	return getOptions;
};

export const openExtensionOptions = () => {
	const {openOptionsPage, getURL} = chrome.runtime;

	openOptionsPage ? openOptionsPage() : window.open(getURL('options.html'), '_blank');
};
