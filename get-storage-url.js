// Helper script to get Firebase Storage download URLs
// Usage: Include Firebase Storage SDK and run getStorageUrl() function

// 1. Add Firebase Storage SDK to your HTML:
// <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-storage.js"></script>

// 2. Initialize Storage after Firebase app initialization:
// const storage = firebase.storage();
// const storageRef = storage.ref();

// Function to get download URL for a file
function getStorageUrl(filePath) {
    const storage = firebase.storage();
    const fileRef = storage.ref(filePath);
    
    return fileRef.getDownloadURL()
        .then(function(url) {
            console.log('File URL:', url);
            return url;
        })
        .catch(function(error) {
            console.error('Error getting download URL:', error);
            return null;
        });
}

// Example usage:
// getStorageUrl('잔팽_Editor_organized.pdf').then(url => {
//     console.log('Download URL:', url);
//     // Use the URL in your code
// });

// Function to list all files in a folder
function listStorageFiles(folderPath = '') {
    const storage = firebase.storage();
    const folderRef = folderPath ? storage.ref(folderPath) : storage.ref();
    
    return folderRef.listAll()
        .then(function(result) {
            console.log('Files in folder:', result.items);
            result.items.forEach(function(itemRef) {
                itemRef.getDownloadURL().then(function(url) {
                    console.log('File:', itemRef.name, 'URL:', url);
                });
            });
            return result.items;
        })
        .catch(function(error) {
            console.error('Error listing files:', error);
        });
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.FirebaseStorageHelper = {
        getStorageUrl: getStorageUrl,
        listStorageFiles: listStorageFiles
    };
}

