// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
  authDomain: "hor-chanpheng.firebaseapp.com",
  projectId: "hor-chanpheng",
  storageBucket: "hor-chanpheng.appspot.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const db = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();

// Function to upload a file to Firebase Storage
function uploadFile(file, folder = 'cv-files') {
  return new Promise((resolve, reject) => {
    // Create a storage reference
    const fileRef = storageRef.child(`${folder}/${file.name}`);
    
    // Upload the file
    const uploadTask = fileRef.put(file);
    
    // Register event handlers
    uploadTask.on('state_changed', 
      // Progress function
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, 
      // Error function
      (error) => {
        console.error('Upload failed:', error);
        reject(error);
      }, 
      // Complete function
      () => {
        // Get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
}

// Function to get a download URL for a file
function getFileURL(path) {
  return storageRef.child(path).getDownloadURL();
}

// Function to list files in a folder
function listFiles(folder = 'cv-files') {
  return storageRef.child(folder).listAll();
}

// Function to delete a file
function deleteFile(path) {
  return storageRef.child(path).delete();
}

// Router functionality (jQuery)
function router() {
  const hash = window.location.hash || '#/';
  const page = hash.split('/')[1] || 'home';
  
  // Hide all pages
  $('.page').removeClass('active');
  
  // Show the current page
  $('#' + page).addClass('active');
}

$(window).on('hashchange', router);
$(window).on('load', router);

// Fetch CV data from Firestore and render (jQuery)
function renderCV(cvData) {
  console.log("Rendering CV with data:", cvData);
  
  // Update document title
  document.title = `${cvData.name} - CV`;
  
  // Profile image
  $('.profile-pic').attr('src', cvData.profileImage);
  
  // Contact info
  $('.contact-info').html(`
    <div><i>📞</i> Phone: ${cvData.phone}</div>
    <div><i>✉️</i> Email: ${cvData.email}</div>
    <div><i>🌐</i> Linkin: ${cvData.website}</div>
    <div><i>🏠</i> Address: ${cvData.address}</div>
  `);
  
  // Name and title
  $('.name').text(cvData.name);
  $('.title').text(cvData.title);
  
  // Profile summary
  $('.profile-text').text(cvData.profile);
  
  // Key Skills (from expertise data)
  $('.sidebar-section.skills ul').html(cvData.expertise.map(skill => `<li>${skill}</li>`).join(''));
  
  // Technical Skills (from languages data - we'll adapt this)
  $('.sidebar-section.technical ul').html(cvData.languages.map(tech => `<li>${tech}</li>`).join(''));
  
  // Education
  $('.education-section').html('<div class="section-title">EDUCATION:</div>' + 
    cvData.education.map(edu => `
      <div class="education-entry">
        <h4>${edu.degree}</h4>
        <div class="education-details">
          <span class="education-school">${edu.school}</span>
          <span class="education-year">${edu.years}</span>
        </div>
      </div>
    `).join(''));
  
  // Work experience
  $('.work-section').html('<div class="section-title">TEACHING EXPERIENCE:</div>' +
    cvData.work.map(work => `
      <div class="work-entry">
        <div class="work-title">${work.company}</div>
        <div class="work-details">
          <span class="work-company">${work.role}</span>
          <span class="work-location">${work.years}</span>
        </div>
        <div class="work-desc">
          <ul>
            ${work.desc.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join(''));

  // Hide loading indicator
  $('#loading').hide();
}

$(function() {
  // Show loading indicator
  $('#loading').show();
  
  const db = firebase.firestore();
  db.collection('cv').doc('main').get()
    .then(doc => {
      if (doc.exists) {
        renderCV(doc.data());
      } else {
        console.error("CV document does not exist!");
        alert("CV data not found. Please run the setup page first to initialize your CV data.");
        $('#loading').hide();
      }
    })
    .catch(error => {
      console.error("Error getting CV document:", error);
      alert("Error loading CV data: " + error.message);
      $('#loading').hide();
    });
}); 