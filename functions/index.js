const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Get Firestore instance
const db = admin.firestore();

/**
 * Cloud Function to fetch all documents from the 'cv' collection
 * Endpoint: GET /api/getCVData
 */
exports.getCVData = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  // Browser checks if it's allowed to make the request (checking permissions)
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

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
