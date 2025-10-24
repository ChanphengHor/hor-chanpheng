// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "AIzaSyBytee7Z81vumHMc9lz1ew0zE3RULpXzZg",
    authDomain: "hor-chanpheng.firebaseapp.com",
    projectId: "hor-chanpheng",
    storageBucket: "hor-chanpheng.firebasestorage.app",
    messagingSenderId: "13355815757",
    appId: "1:13355815757:web:5c40af20beb8377a411d04",
    measurementId: "G-T41TPB21LB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Sample CV data structure for Firestore
const sampleCVData = {
    personal: {
        name: "HOR CHANPHENG",
        title: "Senior Android Developer (Team Lead)",
        summary: "Lines of code can create high-quality mobile apps that make people's everyday lives easier. I feel happiest when my code works well and brings joy to users — because their happiness becomes the developer's happiness too."
    },
    contact: {
        address: "Home No.6K Group 02, Street 149DT, Phnom Penh, Cambodia",
        phone: "+855 17 56 48 28",
        email: "chanpheng123@gmail.com",
        website: "horchanpheng.web.app",
        linkedin: "Hor Chanpheng"
    },
    education: [
        {
            institution: "Korea Software HRD Center",
            degree: "Scholarship Student (I.T Expert)",
            location: "Phnom Penh / 2017 - 2018"
        },
        {
            institution: "Build Bright University",
            degree: "Bachelor Degree (I.T)",
            location: "Battambang / 2013 - 2017"
        },
        {
            institution: "Net Yang High School",
            degree: "High School Certificated",
            location: "Battambang / 2010 - 2013"
        }
    ],
    development: [
        "Korea Software HRD Center",
        "Basic Course (Web Dev)",
        "Advanced Course (Mobile Dev)",
        "Overseas Training (South Korea)",
        "Team Lead (Project Management)",
        "Cross-Platform Management (iOS/AOS)",
        "Company-Based Practical Skills"
    ],
    experience: [
        {
            company: "비플페이 주식회사 | BeplePay Co.,Ltd.",
            position: "과장 | Team Lead",
            location: "Busan, South Korea | From 2023 to Present (3 Years Target)",
            description: "Responsible for leading the production of high-quality payment applications with over 1.99 million active users. Manage project implementation, feature planning, and task assignments with Korean development teams.",
            achievements: [
                "Led development of payment applications serving 1.99M+ users",
                "Managed cross-functional teams and project implementation",
                "Implemented advanced payment security features",
                "Coordinated with Korean development teams"
            ]
        },
        {
            company: "Webcash Group",
            position: "Trainee",
            location: "Seoul, South Korea | From 2019 to 2021 (2 Years)",
            description: "Completed a two-year professional training program focused on Android Development (Java, Kotlin) and project management skill development through overseas work experience.",
            achievements: [
                "Completed comprehensive Android development training",
                "Gained expertise in Java and Kotlin programming",
                "Developed project management skills",
                "Worked in international team environment"
            ]
        },
        {
            company: "KOSIGN Investment Co.,Ltd.",
            position: "Senior Android Developer",
            location: "Phnom Penh | From 2018 to 2023 (5 Years 2 Months)",
            description: "Started my career path in mobile Android development and advanced to managing projects, cross-platform mobile apps. Gained strong technical expertise, leadership experience, and delivered high-quality mobile apps.",
            achievements: [
                "Developed multiple Android applications",
                "Advanced to project management role",
                "Created cross-platform mobile solutions",
                "Delivered high-quality mobile applications"
            ]
        }
    ],
    skills: [
        {
            category: "Android Development",
            items: ["Java", "Kotlin", "Coroutine", "Compose"]
        },
        {
            category: "Flutter Development",
            items: ["getx", "bloc"]
        },
        {
            category: "Web Development",
            items: ["Spring Framework", "php", "Node.js", "JavaScript"]
        },
        {
            category: "UI/UX Design",
            items: ["AdobeXD", "Figma", "Zeplin"]
        },
        {
            category: "Swift (Researching)"
        },
        {
            category: "Git"
        },
        {
            category: "Firebase",
            items: ["Cloud Message", "Remote Config", "Secret Manager"]
        },
        {
            category: "Cursor AI"
        },
        {
            category: "ChatGPT"
        }
    ],
    additionalExperience: {
        title: "KNGO Organization / English & Computer Instructor",
        duration: "From 2015 to 2017 (2 Years) / Battambang",
        responsibilities: [
            "I was improving my English skills and collaborating with foreigners who share their culture and support children through cultural exchange programs.",
            "Start with a new foundational experience and develop essential skills",
            "Explore and connect with people beyond my family and friends."
        ]
    },
    languages: [
        {
            name: "KHMER",
            proficiency: "Native Language"
        },
        {
            name: "ENGLISH",
            proficiency: "Good Writing, Good Reading, Good Listening & Speaking"
        },
        {
            name: "KOREAN (best)",
            proficiency: "Good Writing, Good Reading, Good Listening & Speaking"
        }
    ],
    references: [
        {
            name: "Mr. Chen Phirum",
            position: "Deputy General Manager",
            email: "myref@domain.com"
        },
        {
            name: "Mr. Chen Phirum",
            position: "Deputy General Manager",
            email: "myref@domain.com"
        }
    ]
};

// Function to populate Firestore data
function populateFirestoreData() {
    console.log('Starting to populate Firestore with CV data...');
    
    // Add each section as a separate document
    $.each(sampleCVData, function(sectionName, sectionData) {
        db.collection('cv').add({
            section: sectionName,
            data: sectionData,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function() {
            console.log('Added ' + sectionName + ' section to Firestore');
        }).catch(function(error) {
            console.error('Error adding ' + sectionName + ':', error);
        });
    });
    
    console.log('Successfully populated Firestore with CV data');
}

// Function to load CV data from Firestore
function loadCVData() {
    db.collection('cv').get().then(function(querySnapshot) {
        const data = {};
        
        querySnapshot.forEach(function(doc) {
            const docData = doc.data();
            data[docData.section] = docData.data;
        });

        populateCV(data);
        console.log('CV data loaded successfully from Firestore');
    }).catch(function(error) {
        console.error('Error loading CV data:', error);
        // Fallback to sample data if Firestore fails
        populateCV(sampleCVData);
    });
}

// Function to populate the CV with data using jQuery
function populateCV(data) {
    // Personal Information
    if (data.personal) {
        $('#full-name').text(data.personal.name || 'HOR CHANPHENG');
        $('#job-title').text(data.personal.title || 'Senior Android Developer (Team Lead)');
        $('#summary').text(data.personal.summary || '');
    }

    // Contact Information
    if (data.contact) {
        $('#address').text(data.contact.address || '');
        $('#phone').text(data.contact.phone || '');
        $('#email').text(data.contact.email || '');
        $('#website').text(data.contact.website || '');
        $('#linkedin').text(data.contact.linkedin || '');
    }

    // Education
    const $educationList = $('#education-list');
    $educationList.empty(); // Clear existing content
    if (data.education) {
        $.each(data.education, function(index, edu) {
            const eduItem = $('<div>').addClass('education-item').html(
                '<h3>' + edu.institution + '</h3>' +
                '<p>' + edu.degree + '</p>' +
                '<p><i class="fas fa-map-marker-alt"></i> ' + edu.location + '</p>'
            );
            $educationList.append(eduItem);
        });
    }

    // Self Development
    const $developmentList = $('#development-list');
    $developmentList.empty(); // Clear existing content
    if (data.development) {
        $.each(data.development, function(index, item) {
            $developmentList.append($('<li>').text(item));
        });
    }

    // Work Experience
    const $experienceList = $('#experience-list');
    $experienceList.empty(); // Clear existing content
    if (data.experience) {
        $.each(data.experience, function(index, exp) {
            const achievementsHtml = exp.achievements.map(function(achievement) {
                return '<li>' + achievement + '</li>';
            }).join('');
            
            const expItem = $('<div>').addClass('experience-item').html(
                '<div class="experience-header">' +
                    '<h3>' + exp.company + ' / ' + exp.position + '</h3>' +
                    '<p><i class="fas fa-map-marker-alt"></i> ' + exp.location + '</p>' +
                '</div>' +
                '<p class="experience-description">' + exp.description + '</p>' +
                '<ul class="experience-achievements">' + achievementsHtml + '</ul>'
            );
            $experienceList.append(expItem);
        });
    }

    // Skills
    const $skillsList = $('#skills-list');
    $skillsList.empty(); // Clear existing content
    if (data.skills) {
        $.each(data.skills, function(index, skill) {
            const itemsHtml = skill.items ? '<ul>' + skill.items.map(function(item) {
                return '<li>' + item + '</li>';
            }).join('') + '</ul>' : '';
            
            const skillItem = $('<li>').html(
                '<strong>' + skill.category + '</strong>' + itemsHtml
            );
            $skillsList.append(skillItem);
        });
    }

    // Additional Experience
    if (data.additionalExperience) {
        $('#additional-job-title').text(data.additionalExperience.title);
        $('#additional-duration').text(data.additionalExperience.duration);
        
        const $responsibilitiesList = $('#additional-responsibilities');
        $responsibilitiesList.empty(); // Clear existing content
        $.each(data.additionalExperience.responsibilities, function(index, resp) {
            $responsibilitiesList.append($('<li>').text(resp));
        });
    }

    // Languages
    const $languagesList = $('#languages-list');
    $languagesList.empty(); // Clear existing content
    if (data.languages) {
        $.each(data.languages, function(index, lang) {
            const langItem = $('<div>').addClass('language-item').html(
                '<strong>' + lang.name + ':</strong> ' + lang.proficiency
            );
            $languagesList.append(langItem);
        });
    }

    // References
    const $referencesList = $('#references-list');
    $referencesList.empty(); // Clear existing content
    if (data.references) {
        $.each(data.references, function(index, ref) {
            const refItem = $('<div>').addClass('reference-item').html(
                '<h4><u>' + ref.name + '</u></h4>' +
                '<p>' + ref.position + '</p>' +
                '<p>Phone</p>' +
                '<p>' + ref.email + '</p>'
            );
            $referencesList.append(refItem);
        });
    }
}

// Function to update specific CV data
function updateCVData(section, newData) {
    db.collection('cv').where('section', '==', section).get().then(function(querySnapshot) {
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            doc.ref.update({
                data: newData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function() {
                console.log('Updated ' + section + ' section in Firestore');
            });
        } else {
            console.log('Section ' + section + ' not found, creating new document');
            db.collection('cv').add({
                section: section,
                data: newData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    }).catch(function(error) {
        console.error('Error updating CV data:', error);
    });
}

// Export functions for use in HTML
window.CVManager = {
    loadCVData: loadCVData,
    populateFirestoreData: populateFirestoreData,
    updateCVData: updateCVData,
    sampleCVData: sampleCVData
};

// Auto-load data when page loads
$(document).ready(function() {
    loadCVData();
});