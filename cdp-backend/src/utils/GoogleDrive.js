const { google } = require('googleapis');
const fs = require('fs');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials using the refresh token
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

// Upload file to Google Drive
const uploadFileToGoogleDrive = async (file) => {
  try {
    if (!file) {
      console.error("No file received for upload.");
      throw new Error("No file received");
    }
    
    console.log("Uploading file:", file.originalname, file.path);

    const fileMetadata = {
      name: file.originalname,
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    if (!response.data.id) {
      throw new Error("Failed to upload file, no file ID returned.");
    }

    const fileId = response.data.id;


    await setFilePublicPermission(fileId);

    return fileId; // Return the file ID
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    throw new Error("Google Drive upload failed: " + error.message);
  }
};

// Set file permissions to be publicly accessible
const setFilePublicPermission = async (fileId) => {
  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    // console.log(`Public access granted for file ID: ${fileId}`);
  } catch (error) {
    console.error('Error setting file permissions:', error);
    throw new Error('Failed to set public permissions');
  }
};

// Get the thumbnail URL for public access
const getFilePublicUrl = (fileId) => {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=s4000`; // URL format for embedding images
};

// Delete the local file after uploading
const deleteLocalFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting local file:', err);
    } else {
      console.log('Local file deleted:', filePath);
    }
  });
};

// Export functions using CommonJS syntax
module.exports = {
  uploadFileToGoogleDrive,
  setFilePublicPermission,
  getFilePublicUrl,
  deleteLocalFile,
};
