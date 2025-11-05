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
  profileImage: "https://horchanpheng.web.app/profile_pic.jpg",
  phone: "+855-175-640-28",
  email: "chanpheng123@gmail.com",
  website: "Hor Chanpheng",
  address: "Home No.6K Group 02, Street 149DT, Phnom Penh, Cambodia",
  name: "Hor Chanpheng",
  title: "Senior Android Developer",
  profile: "I was a senior android developer at Busan South Korea. I have 7 years of experience in android development and 2 years of experience in web development.",
  education: [
    { degree: "Studied Software Expert", school: "Korea Software HRD Center", years: "2017 - 2018" },
    { degree: "Bachelor of IT Information", school: "Build Bright University", years: "2013 - 2017" }
  ],
  expertise: ["Team Leading", "Android Developer", "Java/Kotlin", "Compose", "ViewModel", "Android Hilt", "Retrofit", "Coroutine", "Room", "Firebase", "Git", "Github", "Gitlab", "..."],
  languages: ["Khmer", "English", "Korean"],
  work: [
    {
      role: "Android Team Lead",
      company: "Busan, South Korea",
      years: "2023 - Present",
      desc: [
        "Assign the Task to the team.",
        "Manage the team to complete the task.",
        "Review the code of the team.",
      ]
    },
    {
      role: "Android Team Lead",
      company: "KOSIGN (Cambodia) Investment Co., Ltd.",
      years: "2018 - 2023",
      desc: [
        "Working with the wider development team.",
        "Manage and develop the app.",
        "Assign the task to the team member."
      ]
    },
    {
      role: "Computer/English Teacher",
      company: "Khmer New Generation Organization",
      years: "2016 - 2017",
      desc: [
        "Teaching Computer and English to the students.",
        "Join Activity and Event to improve the teaching skills."
      ]
    }
  ],
  references: [
    {
      name: "Person 1",
      position: "CEO",
      phone: "123-456-7890",
      email: "test@gmail.com"
    },
    {
      name: "Person 2",
      position: "CEO",
      phone: "123-456-7890",
      email: "test@gmail.com"
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