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

// Dynamic CV data structure for Firestore
const sampleCVData = {
    sections: [
        {
            id: "contact",
            title: "CONTACT ME",
            column: "left",
            page: 1,
            type: "contact",
            order: 1,
            data: {
                address: "Home No.6K Group 02, Street 149DT, Phnom Penh, Cambodia",
                phone: "+855 17 56 48 28",
                email: "chanpheng123@gmail.com",
                website: "horchanpheng.web.app",
                linkedin: "Hor Chanpheng"
            }
        },
        {
            id: "education",
            title: "EDUCATION",
            column: "left",
            page: 1,
            type: "list",
            order: 2,
            data: [
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
            ]
        },
        {
            id: "development",
            title: "SELF DEVELOPMENT",
            column: "left",
            page: 1,
            type: "bullet-list",
            order: 3,
            data: [
                "Korea Software HRD Center",
                "Basic Course (Web Dev)",
                "Advanced Course (Mobile Dev)",
                "Overseas Training (South Korea)",
                "Team Lead (Project Management)",
                "Cross-Platform Management (iOS/AOS)",
                "Company-Based Practical Skills"
            ]
        },
        {
            id: "summary",
            title: "",
            column: "right",
            page: 1,
            type: "text",
            order: 1,
            data: "Lines of code can create high-quality mobile apps that make people's everyday lives easier. I feel happiest when my code works well and brings joy to users — because their happiness becomes the developer's happiness too."
        },
        {
            id: "experience",
            title: "WORK EXPERIENCE",
            column: "right",
            page: 1,
            type: "experience-list",
            order: 2,
            data: [
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
            ]
        },
        {
            id: "experience",
            title: "WORK EXPERIENCE",
            column: "right",
            page: 1,
            type: "experience-list",
            order: 2,
            data: [
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
                },
                {
                    company: "KNGO Organization",
                    position: "English & Computer Instructor",
                    location: "Battambang | From 2015 to 2017 (2 Years)",
                    description: "I was improving my English skills and collaborating with foreigners who share their culture and support children through cultural exchange programs.",
                    achievements: [
                        "Start with a new foundational experience and develop essential skills",
                        "Explore and connect with people beyond my family and friends"
                    ]
                }
            ]
        },
        {
            id: "skills",
            title: "SKILLS",
            column: "left",
            page: 1,
            type: "skills-list",
            order: 4,
            data: [
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
            ]
        },
        {
            id: "languages",
            title: "LANGUAGES",
            column: "right",
            page: 1,
            type: "language-list",
            order: 3,
            data: [
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
            ]
        },
        {
            id: "references",
            title: "REFERENCES",
            column: "right",
            page: 1,
            type: "reference-list",
            order: 4,
            data: [
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
        }
    ],
    personal: {
        name: "HOR CHANPHENG",
        title: "Senior Android Developer (Team Lead)"
    }
};

// Function to populate Firestore data
function populateFirestoreData() {
    console.log('Starting to populate Firestore with CV data...');
    
    // Add sections data
    db.collection('cv').doc('sections').set({
        data: sampleCVData.sections,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function() {
        console.log('Added sections data to Firestore');
    }).catch(function(error) {
        console.error('Error adding sections:', error);
    });
    
    // Add personal data
    db.collection('cv').doc('personal').set({
        data: sampleCVData.personal,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function() {
        console.log('Added personal data to Firestore');
    }).catch(function(error) {
        console.error('Error adding personal:', error);
    });
    
    console.log('Successfully populated Firestore with CV data');
}

// Function to load CV data from Firestore
function loadCVData() {
    db.collection('cv').get().then(function(querySnapshot) {
        const data = {};
        
        querySnapshot.forEach(function(doc) {
            data[doc.id] = doc.data().data;
        });

        renderDynamicCV(data);
        console.log('CV data loaded successfully from Firestore');
    }).catch(function(error) {
        console.error('Error loading CV data:', error);
        // Fallback to sample data if Firestore fails
        renderDynamicCV(sampleCVData);
    });
}

// Function to render sections dynamically
function renderDynamicCV(data) {
    // Update personal information
    if (data.personal) {
        $('#full-name').text(data.personal.name || 'HOR CHANPHENG');
        $('#job-title').text(data.personal.title || 'Senior Android Developer (Team Lead)');
    }

    // Clear existing sections
    $('#left-column-sections').empty();
    $('#right-column-sections').empty();

    // Sort sections by order
    const sections = data.sections || sampleCVData.sections;
    sections.sort(function(a, b) {
        return a.order - b.order;
    });

    // Render each section
    $.each(sections, function(index, section) {
        renderSection(section);
    });
}

// Function to render individual sections
function renderSection(section) {
    const sectionHtml = createSectionHTML(section);
    const targetContainer = getTargetContainer(section);
    
    if (targetContainer) {
        targetContainer.append(sectionHtml);
    }
}

// Function to get target container based on section properties
function getTargetContainer(section) {
    if (section.page === 1) {
        return section.column === 'left' ? $('#left-column-sections') : $('#right-column-sections');
    }
    return null;
}

// Function to create HTML for different section types
function createSectionHTML(section) {
    let html = '';
    
    switch (section.type) {
        case 'contact':
            html = createContactSection(section);
            break;
        case 'list':
            html = createListSection(section);
            break;
        case 'bullet-list':
            html = createBulletListSection(section);
            break;
        case 'text':
            html = createTextSection(section);
            break;
        case 'experience-list':
            html = createExperienceListSection(section);
            break;
        case 'skills-list':
            html = createSkillsListSection(section);
            break;
        case 'timeline':
            html = createTimelineSection(section);
            break;
        case 'language-list':
            html = createLanguageListSection(section);
            break;
        case 'reference-list':
            html = createReferenceListSection(section);
            break;
        default:
            html = createGenericSection(section);
    }
    
    return $(html);
}

// Section type renderers
function createContactSection(section) {
    const data = section.data;
    return $('<div>').addClass('contact-section').html(
        '<h2>' + section.title + '</h2>' +
        '<div class="contact-item"><i class="fas fa-map-marker-alt"></i><span>' + data.address + '</span></div>' +
        '<div class="contact-item"><i class="fas fa-phone"></i><span>' + data.phone + '</span></div>' +
        '<div class="contact-item"><i class="fas fa-envelope"></i><span>' + data.email + '</span></div>' +
        '<div class="contact-item"><i class="fas fa-globe"></i><span>' + data.website + '</span></div>' +
        '<div class="contact-item"><i class="fab fa-linkedin"></i><span>' + data.linkedin + '</span></div>'
    );
}

function createListSection(section) {
    let html = '<div class="education-section"><h2>' + section.title + '</h2>';
    $.each(section.data, function(index, item) {
        html += '<div class="education-item">' +
            '<h3>' + item.institution + '</h3>' +
            '<p>' + item.degree + '</p>' +
            '<p><i class="fas fa-map-marker-alt"></i> ' + item.location + '</p>' +
            '</div>';
    });
    html += '</div>';
    return $(html);
}

function createBulletListSection(section) {
    let html = '<div class="development-section"><h2>' + section.title + '</h2><ul>';
    $.each(section.data, function(index, item) {
        html += '<li>' + item + '</li>';
    });
    html += '</ul></div>';
    return $(html);
}

function createTextSection(section) {
    return $('<div>').addClass('summary-section').html('<p>' + section.data + '</p>');
}

function createExperienceListSection(section) {
    let html = '<div class="experience-section"><h2>' + section.title + '</h2>';
    $.each(section.data, function(index, exp) {
        const achievementsHtml = exp.achievements.map(function(achievement) {
            return '<li>' + achievement + '</li>';
        }).join('');
        
        html += '<div class="experience-item">' +
            '<div class="experience-header">' +
                '<h3>' + exp.company + ' / ' + exp.position + '</h3>' +
                '<p><i class="fas fa-map-marker-alt"></i> ' + exp.location + '</p>' +
            '</div>' +
            '<p class="experience-description">' + exp.description + '</p>' +
            '<ul class="experience-achievements">' + achievementsHtml + '</ul>' +
            '</div>';
    });
    html += '</div>';
    return $(html);
}

function createSkillsListSection(section) {
    let html = '<div class="skills-section"><h2>' + section.title + '</h2><ul>';
    $.each(section.data, function(index, skill) {
        const itemsHtml = skill.items ? '<ul>' + skill.items.map(function(item) {
            return '<li>' + item + '</li>';
        }).join('') + '</ul>' : '';
        
        html += '<li><strong>' + skill.category + '</strong>' + itemsHtml + '</li>';
    });
    html += '</ul></div>';
    return $(html);
}

function createTimelineSection(section) {
    const data = section.data;
    const responsibilitiesHtml = data.responsibilities.map(function(resp) {
        return '<li>' + resp + '</li>';
    }).join('');
    
    return $('<div>').addClass('additional-experience-section').html(
        '<h3>' + data.title + '</h3>' +
        '<p class="duration"><i class="fas fa-map-marker-alt"></i> ' + data.duration + '</p>' +
        '<ul>' + responsibilitiesHtml + '</ul>'
    );
}

function createLanguageListSection(section) {
    let html = '<div class="languages-section"><h2>' + section.title + '</h2>';
    $.each(section.data, function(index, lang) {
        html += '<div class="language-item"><strong>' + lang.name + ':</strong> ' + lang.proficiency + '</div>';
    });
    html += '</div>';
    return $(html);
}

function createReferenceListSection(section) {
    let html = '<div class="references-section"><h2>' + section.title + '</h2>';
    $.each(section.data, function(index, ref) {
        html += '<div class="reference-item">' +
            '<h4><u>' + ref.name + '</u></h4>' +
            '<p>' + ref.position + '</p>' +
            '<p>Phone</p>' +
            '<p>' + ref.email + '</p>' +
            '</div>';
    });
    html += '</div>';
    return $(html);
}

function createGenericSection(section) {
    return $('<div>').addClass('generic-section').html(
        '<h2>' + section.title + '</h2>' +
        '<div class="section-content">' + JSON.stringify(section.data) + '</div>'
    );
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