export interface StorageFile {
	id: string;
	url: string;
	name: string;
	size: number;
	type: string;
	userId: string;
	bucketName: string;
	filePath: string;
	metadata: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
}

export interface StorageUsage {
	usedBytes: number;
	fileCount: number;
	maxBytes: number;
	maxFileSize: number;
	allowedTypes: string[];
}

export interface StoragePlan {
	id: string;
	name: string;
	maxStorageBytes: number;
	maxFileSizeBytes: number;
	allowedFileTypes: string[];
	createdAt: string;
	updatedAt: string;
}

export interface UserStorage {
	id: string;
	userId: string;
	planId: string;
	usedStorageBytes: number;
	fileCount: number;
	createdAt: string;
	updatedAt: string;
}
