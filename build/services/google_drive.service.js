"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFolder = void 0;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: path_1.default.resolve(process.cwd(), "intense-base-446613-b5-43f7c18449f8.json"),
    scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = googleapis_1.google.drive({
    version: "v3",
    auth,
});
const SHARED_DRIVE_ID = "0AI-HePAFjGOJUk9PVA";
const FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";
function escapeDriveQueryValue(value) {
    return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}
async function findExistingFolderId(folderName) {
    const escapedName = escapeDriveQueryValue(folderName);
    const query = `'${SHARED_DRIVE_ID}' in parents and mimeType='${FOLDER_MIME_TYPE}' and name='${escapedName}' and trashed=false`;
    const response = await drive.files.list({
        q: query,
        driveId: SHARED_DRIVE_ID,
        corpora: "drive",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
        fields: "files(id, name)",
    });
    const files = response.data.files;
    if (!files || files.length === 0) {
        return null;
    }
    return files[0].id ?? null;
}
const DRIVE_FILE_VIEW_URL_PREFIX = "https://drive.google.com/file/d/";
const DRIVE_FILE_VIEW_URL_SUFFIX = "/view";
const createFolder = async ({ folderName, file, }) => {
    let folderId = await findExistingFolderId(folderName);
    if (!folderId) {
        const folder = await drive.files.create({
            requestBody: {
                name: folderName,
                mimeType: FOLDER_MIME_TYPE,
                parents: [SHARED_DRIVE_ID],
            },
            supportsAllDrives: true,
            fields: "id, name",
        });
        if (!folder.data.id) {
            throw new Error("Folder is not created");
        }
        folderId = folder.data.id;
    }
    const uploadResponse = await drive.files.create({
        media: {
            mimeType: file.mimetype,
            body: fs_1.default.createReadStream(file.path),
        },
        requestBody: {
            name: file.originalname,
            mimeType: file.mimetype,
            parents: [folderId],
        },
        supportsAllDrives: true,
        fields: "id,name",
    });
    fs_1.default.unlinkSync(file.path);
    const fileId = uploadResponse.data.id;
    if (!fileId) {
        throw new Error("Failed to upload file");
    }
    return `${DRIVE_FILE_VIEW_URL_PREFIX}${fileId}${DRIVE_FILE_VIEW_URL_SUFFIX}`;
};
exports.createFolder = createFolder;
