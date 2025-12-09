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
const storage = firebase.storage();

// SVG Icon variable (loaded from JSON file)
let svgIcons = {};

// CV data variables (loaded from JSON files or Firestore)
let leftColumnSections = [];
let rightColumnSections = [];
let personalData = {};

// Function to load data from JSON files
function loadDataFromJSON() {
    return Promise.all([
        $.getJSON('data/svg-icons.json'),
        $.getJSON('data/left-column-sections.json'),
        $.getJSON('data/right-column-sections.json'),
        $.getJSON('data/personal-data.json')
    ]).then(function(results) {
        svgIcons = results[0] || {};
        leftColumnSections = results[1] || [];
        rightColumnSections = results[2] || [];
        personalData = results[3] || {};
        
        window.svgIcons = svgIcons;
        updateDownloadButtonUrl(personalData);
        
        return {
            svgIcons: svgIcons,
            leftColumnSections: leftColumnSections,
            rightColumnSections: rightColumnSections,
            personalData: personalData
        };
    }).catch(function(error) {
        console.error('Error loading JSON files:', error);
        return {
            svgIcons: {},
            leftColumnSections: [],
            rightColumnSections: [],
            personalData: {}
        };
    });
}

// Function to update download button URL
function updateDownloadButtonUrl(personalData) {
    if (personalData && personalData.downloadUrl) {
        const downloadBtn = $('#download-btn');
        if (downloadBtn.length) {
            downloadBtn.attr('href', personalData.downloadUrl);
        }
    }
}

// Function to load CV data from Firestore
function loadCVData() {
    loadDataFromJSON().then(function(jsonData) {
        leftColumnSections = jsonData.leftColumnSections;
        rightColumnSections = jsonData.rightColumnSections;
        personalData = jsonData.personalData;
        
        // Render portfolio immediately with JSON data
        renderPortfolio({
            leftColumnSections: leftColumnSections,
            rightColumnSections: rightColumnSections,
            personalData: personalData
        });
        
        // Then fetch from Firestore and update
        Promise.all([
            db.collection('cv_v2').doc('left-column-sections').get(),
            db.collection('cv_v2').doc('right-column-sections').get(),
            db.collection('cv_v2').doc('personal').get()
        ]).then(function(results) {
            const leftDoc = results[0];
            const rightDoc = results[1];
            const personalDoc = results[2];
            
            let fetchedLeftSections = [];
            let fetchedRightSections = [];
            let fetchedPersonalData = personalData || {};
            
            if (leftDoc.exists) {
                try {
                    fetchedLeftSections = JSON.parse(leftDoc.data().json_data);
                } catch (e) {
                    console.error('Error parsing left-column-sections:', e);
                }
            }
            
            if (rightDoc.exists) {
                try {
                    fetchedRightSections = JSON.parse(rightDoc.data().json_data);
                } catch (e) {
                    console.error('Error parsing right-column-sections:', e);
                }
            }
            
            if (personalDoc.exists) {
                try {
                    fetchedPersonalData = JSON.parse(personalDoc.data().json_data);
                } catch (e) {
                    console.error('Error parsing personal data:', e);
                }
            }
            
            if (fetchedLeftSections.length > 0 || fetchedRightSections.length > 0 || personalDoc.exists) {
                leftColumnSections = fetchedLeftSections.length > 0 ? fetchedLeftSections : leftColumnSections;
                rightColumnSections = fetchedRightSections.length > 0 ? fetchedRightSections : rightColumnSections;
                personalData = personalDoc.exists ? fetchedPersonalData : personalData;
                
                updateDownloadButtonUrl(personalData);
                renderPortfolio({
                    leftColumnSections: leftColumnSections,
                    rightColumnSections: rightColumnSections,
                    personalData: personalData
                });
            }
        }).catch(function(error) {
            console.error('Error loading CV data from Firestore:', error);
        });
    }).catch(function(error) {
        console.error('Error loading JSON files:', error);
    });
}

// Function to render the portfolio
function renderPortfolio(data) {
    const { leftColumnSections, rightColumnSections, personalData } = data;
    
    // Update hero section
    if (personalData) {
        if (personalData.name) {
            $('#hero-name').text(personalData.name);
        }
        if (personalData.title) {
            $('#hero-title').text(personalData.title);
        }
    }
    
    // Update about description
    const summarySection = rightColumnSections.find(s => s.type === 'text' && s.id === 'summary');
    if (summarySection && summarySection.data) {
        $('#about-description').text(summarySection.data);
        $('#hero-description').text(summarySection.data);
    }
    
    // Render skills
    renderSkills(leftColumnSections);
    
    // Render experience
    renderExperience(rightColumnSections);
    
    // Render education
    renderEducation(leftColumnSections);
    
    // Render languages
    renderLanguages(rightColumnSections);
    
    // Render contact
    renderContact(leftColumnSections);
}

// Function to render skills
function renderSkills(sections) {
    const skillsSection = sections.find(s => s.type === 'skills-list');
    const skillsGrid = $('#skills-grid');
    skillsGrid.empty();
    
    if (skillsSection && skillsSection.data) {
        skillsSection.data.forEach(function(skill) {
            const skillCard = $('<div>').addClass('skill-card');
            const category = $('<div>').addClass('skill-category').text(skill.category);
            const itemsContainer = $('<div>').addClass('skill-items');
            
            // Always append itemsContainer, even if empty
            if (skill.items && skill.items.length > 0) {
                skill.items.forEach(function(item) {
                    const tag = $('<span>').addClass('skill-tag').text(item);
                    itemsContainer.append(tag);
                });
            }
            
            skillCard.append(category);
            skillCard.append(itemsContainer);
            skillsGrid.append(skillCard);
        });
    }
}

// Function to render experience
function renderExperience(sections) {
    const experienceSection = sections.find(s => s.type === 'experience-list');
    const timeline = $('#experience-timeline');
    timeline.empty();
    
    if (experienceSection && experienceSection.data) {
        experienceSection.data.forEach(function(exp) {
            const expItem = $('<div>').addClass('experience-item');
            const expCard = $('<div>').addClass('experience-card');
            
            const header = $('<div>').addClass('experience-header');
            header.append($('<h3>').text(exp.company));
            header.append($('<div>').addClass('experience-position').text(exp.position));
            
            if (exp.location) {
                const location = $('<div>').addClass('experience-location');
                if (svgIcons.locationSmallBlack) {
                    location.append(svgIcons.locationSmallBlack);
                }
                location.append($('<span>').text(exp.location));
                header.append(location);
            }
            
            if (exp.description) {
                header.append($('<p>').addClass('experience-description').text(exp.description));
            }
            
            if (exp.achievements && exp.achievements.length > 0) {
                const achievementsList = $('<ul>').addClass('experience-achievements');
                exp.achievements.forEach(function(achievement) {
                    achievementsList.append($('<li>').text(achievement));
                });
                header.append(achievementsList);
            }
            
            expCard.append(header);
            expItem.append(expCard);
            timeline.append(expItem);
        });
    }
}

// Function to render education
function renderEducation(sections) {
    const educationSection = sections.find(s => s.type === 'list' && s.id === 'education');
    const educationGrid = $('#education-grid');
    educationGrid.empty();
    
    if (educationSection && educationSection.data) {
        educationSection.data.forEach(function(edu) {
            const eduCard = $('<div>').addClass('education-card');
            eduCard.append($('<div>').addClass('education-institution').text(edu.institution));
            eduCard.append($('<div>').addClass('education-degree').text(edu.degree));
            
            if (edu.location) {
                const location = $('<div>').addClass('education-location');
                if (svgIcons.locationSmall) {
                    location.append(svgIcons.locationSmall);
                }
                location.append($('<span>').text(edu.location));
                eduCard.append(location);
            }
            
            educationGrid.append(eduCard);
        });
    }
}

// Function to render languages
function renderLanguages(sections) {
    const languagesSection = sections.find(s => s.type === 'language-list');
    const languagesGrid = $('#languages-grid');
    languagesGrid.empty();
    
    if (languagesSection && languagesSection.data) {
        languagesSection.data.forEach(function(lang) {
            const langCard = $('<div>').addClass('language-card');
            langCard.append($('<div>').addClass('language-name').text(lang.name));
            langCard.append($('<div>').addClass('language-proficiency').text(lang.proficiency));
            languagesGrid.append(langCard);
        });
    }
}

// Function to render contact
function renderContact(sections) {
    const contactSection = sections.find(s => s.type === 'contact');
    const contactInfo = $('#contact-info');
    contactInfo.empty();
    
    if (contactSection && contactSection.data) {
        const data = contactSection.data;
        
        // Add Current Address at the top
        const currentAddressItem = $('<div>').addClass('contact-item');
        if (svgIcons.location) {
            currentAddressItem.append(svgIcons.location);
        } else {
            currentAddressItem.append($('<i>').addClass('fas fa-map-marker-alt'));
        }
        const addressText = $('<span>').html('Current Address : Busan, South Korea<br>부산광역시 동구 초량동 1226 범양레우스 센트럴베이, 범양레우스 센트럴베이, 103동3203호');
        currentAddressItem.append(addressText);
        contactInfo.append(currentAddressItem);
        
        if (data.address) {
            const item = $('<div>').addClass('contact-item');
            if (svgIcons.location) {
                item.append(svgIcons.location);
            } else {
                item.append($('<i>').addClass('fas fa-map-marker-alt'));
            }
            item.append($('<span>').text(data.address));
            contactInfo.append(item);
        }
        
        if (data.phone) {
            const item = $('<div>').addClass('contact-item');
            if (svgIcons.phone) {
                item.append(svgIcons.phone);
            } else {
                item.append($('<i>').addClass('fas fa-phone'));
            }
            item.append($('<span>').text(data.phone));
            contactInfo.append(item);
        }
        
        if (data.email) {
            const item = $('<div>').addClass('contact-item');
            if (svgIcons.email) {
                item.append(svgIcons.email);
            } else {
                item.append($('<i>').addClass('fas fa-envelope'));
            }
            item.append($('<span>').text(data.email));
            contactInfo.append(item);
        }
        
        if (data.website) {
            const item = $('<div>').addClass('contact-item');
            if (svgIcons.website) {
                item.append(svgIcons.website);
            } else {
                item.append($('<i>').addClass('fas fa-globe'));
            }
            item.append($('<span>').text(data.website));
            contactInfo.append(item);
            
            // Update website link
            if (data.website && !data.website.startsWith('http')) {
                $('#website-link').attr('href', 'https://' + data.website);
            } else {
                $('#website-link').attr('href', data.website);
            }
        }
        
        if (data.linkedin) {
            // Update LinkedIn link
            $('#linkedin-link').attr('href', 'https://linkedin.com/in/' + data.linkedin.replace(/\s+/g, '-').toLowerCase());
        }
    }
}

// Navigation functionality
function initNavigation() {
    // Mobile menu toggle
    $('#nav-toggle').on('click', function() {
        $('#nav-menu').toggleClass('active');
        $(this).toggleClass('active');
    });
    
    // Close mobile menu when clicking a link
    $('.nav-link').on('click', function() {
        $('#nav-menu').removeClass('active');
        $('#nav-toggle').removeClass('active');
    });
    
    // Smooth scroll for navigation links
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });
    
    // Navbar scroll effect
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });
    
    // Back to top button
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 300) {
            $('#back-to-top').addClass('visible');
        } else {
            $('#back-to-top').removeClass('visible');
        }
    });
    
    $('#back-to-top').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    $('.section').each(function() {
        observer.observe(this);
    });
    
    // Observe cards
    $('.skill-card, .experience-item, .education-card, .language-card').each(function() {
        observer.observe(this);
    });
}

// Telegram message function
async function sendMessageToTelegram(isViewed = true) {
    const eventType = isViewed ? 'cv_viewed' : 'cv_downloaded';
    const storageKey = `cv_event_${eventType}`;
    const stored = localStorage.getItem(storageKey);
    const now = Date.now();
    const oneHours = 60 * 60 * 1000;
    
    if (stored) {
        const { id, expiration } = JSON.parse(stored);
        if (now < expiration) {
            return;
        }
    }
    
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const expiration = now + oneHours;
    
    localStorage.setItem(storageKey, JSON.stringify({
        id: uniqueId,
        expiration: expiration
    }));
    
    try {
        const response = await fetch("/sendmessage", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: eventType
            })
        });

        if (!response.ok) {
            console.log('Failed to send message!');
        } else {
            console.log('Message sent successfully!');
        }
    } catch (error) {
        console.log('Failed to send message!');
    }
}

// Initialize when document is ready
$(document).ready(function() {
    loadCVData();
    initNavigation();
    initScrollAnimations();
    sendMessageToTelegram(true);

    $('#download-btn').on('click', function() {
        sendMessageToTelegram(false);
    });
});

// Export functions for external use
window.CVManager = {
    loadCVData: loadCVData,
    leftColumnSections: leftColumnSections,
    rightColumnSections: rightColumnSections,
    personalData: personalData
};
