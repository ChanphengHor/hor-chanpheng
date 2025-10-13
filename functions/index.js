const {onRequest} = require('firebase-functions/v2/https');
const {initializeApp} = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
initializeApp();

// Get Firestore instance
const db = getFirestore();

/**
 * Cloud Function to fetch all documents from the 'cv' collection
 * Endpoint: GET /api/getCVData
 */
exports.getCVDataV2 = onRequest({
  cors: true,
  region: 'us-central1'
}, async (req, res) => {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed. Only GET requests are supported.' });
      return;
    }

    // Fetch all documents from the 'cv' collection
    const snapshot = await db.collection('cv').get();
    
    if (snapshot.empty) {
      res.status(200).json({ 
        message: 'No documents found in cv collection',
        data: [],
        count: 0
      });
      return;
    }

    // Convert documents to array
    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Return the data
    res.status(200).json({
      message: `Successfully fetched ${documents.length} documents from cv collection`,
      data: documents,
      count: documents.length
    });

  } catch (error) {
    console.error('Error fetching cv data:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error'
    });
  }
});

/**
 * Cloud Function to fetch all documents from the 'products' collection
 * Endpoint: GET /api/getProductList
 */
exports.getProductListV2 = onRequest({
  cors: true,
  region: 'us-central1'
}, async (req, res) => {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed. Only GET requests are supported.' });
      return;
    }

    // Fetch all documents from the 'products' collection
    const snapshot = await db.collection('products').get();
    
    if (snapshot.empty) {
      res.status(200).json({ 
        message: 'No documents found in products collection',
        data: [],
        count: 0
      });
      return;
    }

    // Convert documents to array
    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Return the data
    res.status(200).json({
      message: `Successfully fetched ${documents.length} documents from products collection`,
      data: documents,
      count: documents.length
    });

  } catch (error) {
    console.error('Error fetching products data:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message || 'Unknown error'
    });
  }
});
