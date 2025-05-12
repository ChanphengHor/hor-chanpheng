// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
  authDomain: "hor-chanpheng.firebaseapp.com",
  projectId: "hor-chanpheng",
  storageBucket: "hor-chanpheng.appspot.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Router functionality
function router() {
  const hash = window.location.hash || '#/';
  const page = hash.split('/')[1] || 'home';
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Show the current page
  const currentPage = document.getElementById(page);
  if (currentPage) {
    currentPage.classList.add('active');
  }
}

// Listen for hash changes
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// Fetch CV data from Firestore and render
function renderCV(cvData) {
  console.log("Rendering CV with data:", cvData);
  
  // Update document title
  document.title = `${cvData.name} - CV`;
  
  // Profile image
  document.querySelector('.profile-pic').src = cvData.profileImage;
  
  // Contact info
  const contactInfo = document.querySelector('.contact-info');
  contactInfo.innerHTML = `
    <div><i>📞</i> Phone: ${cvData.phone}</div>
    <div><i>✉️</i> Email: ${cvData.email}</div>
    <div><i>🌐</i> LinkedIn: ${cvData.website}</div>
    <div><i>🏠</i> Address: ${cvData.address}</div>
  `;
  
  // Name and title
  document.querySelector('.name').textContent = cvData.name;
  document.querySelector('.title').textContent = cvData.title;
  
  // Profile summary
  document.querySelector('.profile-text').textContent = cvData.profile;
  
  // Key Skills (from expertise data)
  const skillsList = document.querySelector('.sidebar-section.skills ul');
  skillsList.innerHTML = cvData.expertise.map(skill => `<li>${skill}</li>`).join('');
  
  // Technical Skills (from languages data - we'll adapt this)
  const technicalList = document.querySelector('.sidebar-section.technical ul');
  technicalList.innerHTML = cvData.languages.map(tech => `<li>${tech}</li>`).join('');
  
  // Education
  const educationSection = document.querySelector('.education-section');
  educationSection.innerHTML = '<div class="section-title">EDUCATION:</div>' + 
    cvData.education.map(edu => `
      <div class="education-entry">
        <h4>${edu.degree}</h4>
        <div class="education-details">
          <span class="education-school">${edu.school}</span>
          <span class="education-year">${edu.years}</span>
        </div>
      </div>
    `).join('');
  
  // Work experience
  const workSection = document.querySelector('.work-section');
  workSection.innerHTML = '<div class="section-title">TEACHING EXPERIENCE:</div>' +
    cvData.work.map(work => `
      <div class="work-entry">
        <div class="work-title">${work.role}</div>
        <div class="work-details">
          <span class="work-company">${work.company}</span>
          <span class="work-location">${work.years}</span>
        </div>
        <div class="work-desc">
          <ul>
            ${work.desc.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');

  // Hide loading indicator
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  // Show loading indicator
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.style.display = 'block';
  
  const db = firebase.firestore();
  db.collection('cv').doc('main').get()
    .then(doc => {
      if (doc.exists) {
        renderCV(doc.data());
      } else {
        console.error("CV document does not exist!");
        alert("CV data not found. Please run the setup page first to initialize your CV data.");
        if (loadingEl) loadingEl.style.display = 'none';
      }
    })
    .catch(error => {
      console.error("Error getting CV document:", error);
      alert("Error loading CV data: " + error.message);
      if (loadingEl) loadingEl.style.display = 'none';
    });
}); 