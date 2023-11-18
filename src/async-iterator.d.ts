/////////////////////////////
/// Window Async Iterable APIs
/////////////////////////////

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface FileSystemDirectoryHandle {
	[Symbol.asyncIterator](): AsyncIterableIterator<[string, FileSystemHandle]>;
	entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
	keys(): AsyncIterableIterator<string>;
	values(): AsyncIterableIterator<FileSystemHandle>;
}
