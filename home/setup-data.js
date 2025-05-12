// This script populates Firestore with sample CV data
// Initialize Firebase (using the same config as in main.js)
const firebaseConfig = {
  apiKey: "AIzaSyDxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
  authDomain: "hor-chanpheng.firebaseapp.com",
  projectId: "hor-chanpheng",
  storageBucket: "hor-chanpheng.appspot.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Sample CV data
const cvData = {
  profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
  phone: "+123-456-7890",
  email: "hello@reallygreatsite.com",
  website: "www.reallygreatsite.com",
  address: "123 Anywhere St., Any City, ST 12345",
  name: "OLIVIA WILSON",
  title: "Graphics Designer",
  profile: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  education: [
    { degree: "Bachelor of Design", school: "Wanderer University", years: "2006 - 2010" },
    { degree: "Bachelor of Design", school: "Wanderer University", years: "2006 - 2008" }
  ],
  expertise: ["Digital Marketing", "Branding", "Copywriting", "SEO"],
  languages: ["English", "French"],
  work: [
    {
      role: "Product Design Manager",
      company: "Ginyard International Co.",
      years: "2020 - 2023",
      desc: [
        "Working with the wider development team.",
        "Manage design, web content, and SEO Marketing.",
        "Branding and Logo Design."
      ]
    },
    {
      role: "Product Design Manager",
      company: "Arowand Industries",
      years: "2019 - 2020",
      desc: [
        "Working with the wider development team.",
        "Manage design, web content, and SEO Marketing.",
        "Branding and Logo Design."
      ]
    },
    {
      role: "Product Design Manager",
      company: "Ginyard International Co.",
      years: "2017 - 2019",
      desc: [
        "Working with the wider development team.",
        "Manage design, web content, and SEO Marketing.",
        "Branding and Logo Design."
      ]
    },
    {
      role: "Product Design Manager",
      company: "Arowand Industries",
      years: "2017",
      desc: [
        "Working with the wider development team.",
        "Manage design, web content, and SEO Marketing.",
        "Branding and Logo Design."
      ]
    }
  ],
  references: [
    {
      name: "Bailey Dupont",
      position: "Wardlore Inc. / CEO",
      phone: "123-456-7890",
      email: "hello@reallygreatsite.com"
    },
    {
      name: "Harumi Kobayashi",
      position: "Wardlore Inc. / CEO",
      phone: "123-456-7890",
      email: "hello@reallygreatsite.com"
    }
  ]
};

// Function to populate Firestore
function setupCVData() {
  document.getElementById('status').textContent = 'Setting up CV data...';
  
  db.collection('cv').doc('main').set(cvData)
    .then(() => {
      document.getElementById('status').textContent = 'CV data successfully uploaded to Firestore!';
      document.getElementById('done').style.display = 'block';
    })
    .catch((error) => {
      document.getElementById('status').textContent = `Error setting up CV data: ${error}`;
    });
} 