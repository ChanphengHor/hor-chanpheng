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
        return {
            svgIcons: svgIcons,
            leftColumnSections: leftColumnSections,
            rightColumnSections: rightColumnSections,
            personalData: personalData
        };
    }).catch(function(error) {
        console.error('Error loading JSON files:', error);
        // Return empty data if JSON files fail to load
        return {
            svgIcons: {},
            leftColumnSections: [],
            rightColumnSections: [],
            personalData: {}
        };
    });
}

// Helper function to combine left and right sections into a single array
function combineSections(leftSections, rightSections) {
    leftSections = leftSections || [];
    rightSections = rightSections || [];
    // Add column property when combining (for rendering purposes)
    const leftWithColumn = leftSections.map(function(section) {
        return Object.assign({}, section, { column: 'left' });
    });
    const rightWithColumn = rightSections.map(function(section) {
        return Object.assign({}, section, { column: 'right' });
    });
    return leftWithColumn.concat(rightWithColumn);
}

// Helper function to remove "order", "page", and "column" fields from sections
function removeOrderFields(sections) {
    if (!sections || !Array.isArray(sections)) return sections;
    return sections.map(function(section) {
        const cleanedSection = {};
        for (let key in section) {
            if (key !== 'order' && key !== 'page' && key !== 'column') {
                cleanedSection[key] = section[key];
            }
        }
        return cleanedSection;
    });
}

// Function to populate Firestore data
function populateFirestoreData() {
    // Convert to JSON strings
    const leftJsonData = JSON.stringify(leftColumnSections);
    const rightJsonData = JSON.stringify(rightColumnSections);
    const personalJsonData = JSON.stringify(personalData);
    
    // Store left column sections
    db.collection('cv_v2').doc('left-column-sections').set({
        json_data: leftJsonData,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function(error) {
        console.error('Error adding left-column-sections:', error);
    });
    
    // Store right column sections
    db.collection('cv_v2').doc('right-column-sections').set({
        json_data: rightJsonData,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function(error) {
        console.error('Error adding right-column-sections:', error);
    });
    
    // Store personal data
    db.collection('cv_v2').doc('personal').set({
        json_data: personalJsonData,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function(error) {
        console.error('Error adding personal data:', error);
    });
}

// Function to load CV data from Firestore
function loadCVData() {
    // First, load data from JSON files
    loadDataFromJSON().then(function(jsonData) {
        // Update variables with JSON data
        leftColumnSections = jsonData.leftColumnSections;
        rightColumnSections = jsonData.rightColumnSections;
        personalData = jsonData.personalData;
        
        // Display JSON data immediately (without fade-in on render)
        const sampleDataForRender = {
            sections: combineSections(leftColumnSections, rightColumnSections),
            personal: personalData
        };
        renderDynamicCV(sampleDataForRender);
        $('#cv-content').addClass('loaded');
        // Initialize lazy loading for scroll-based animations only
        initializeLazyLoading();
        
        // Then fetch from Firestore and replace with fetched data
        // Fetch new structure documents in parallel
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
            
            // Parse left column sections
            if (leftDoc.exists) {
                try {
                    fetchedLeftSections = JSON.parse(leftDoc.data().json_data);
                } catch (e) {
                    console.error('Error parsing left-column-sections:', e);
                }
            }
            
            // Parse right column sections
            if (rightDoc.exists) {
                try {
                    fetchedRightSections = JSON.parse(rightDoc.data().json_data);
                } catch (e) {
                    console.error('Error parsing right-column-sections:', e);
                }
            }
            
            // Parse personal data
            if (personalDoc.exists) {
                try {
                    fetchedPersonalData = JSON.parse(personalDoc.data().json_data);
                } catch (e) {
                    console.error('Error parsing personal data:', e);
                }
            }
            
            // Check if we have any data, otherwise use sample data
            if (fetchedLeftSections.length === 0 && 
                fetchedRightSections.length === 0 && 
                !personalDoc.exists) {
                return;
            }
            
            // Check if fetched data has unwanted fields before cleaning
            const allSections = fetchedLeftSections.concat(fetchedRightSections);
            const hasUnwantedFields = allSections.some(function(section) {
                return section.hasOwnProperty('order') || section.hasOwnProperty('page') || section.hasOwnProperty('column');
            });
            
            // Always clean order and page fields from fetched data
            fetchedLeftSections = removeOrderFields(fetchedLeftSections);
            fetchedRightSections = removeOrderFields(fetchedRightSections);

            // Update variables with cleaned fetched data from Firestore
            leftColumnSections = fetchedLeftSections;
            rightColumnSections = fetchedRightSections;
            personalData = fetchedPersonalData;
            
            // If data had unwanted fields, update Firestore with cleaned data
            if (hasUnwantedFields) {
                populateFirestoreData();
            }
            
            // Convert to format expected by renderDynamicCV
            const fetchedDataForRender = {
                sections: combineSections(fetchedLeftSections, fetchedRightSections),
                personal: fetchedPersonalData
            };

            // Replace sample data with fetched data (without fade-in on render)
            renderDynamicCV(fetchedDataForRender);
            $('#cv-content').addClass('loaded');
            // Re-initialize lazy loading for scroll-based animations only
            initializeLazyLoading();
        }).catch(function(error) {
            console.error('Error loading CV data from Firestore:', error);
        });
    }).catch(function(error) {
        console.error('Error loading JSON files:', error);
    });
}

// Store observer instance globally to clean up if needed
let lazyLoadingObserver = null;
const observedSections = new Set(); // Track sections being observed

// Intersection Observer for lazy loading fade-in (scroll-based only)
function initializeLazyLoading() {
    // Clean up existing observer if any
    if (lazyLoadingObserver) {
        observedSections.forEach(section => {
            lazyLoadingObserver.unobserve(section);
        });
        observedSections.clear();
        lazyLoadingObserver.disconnect();
        lazyLoadingObserver = null;
    }
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
        // Get all sections
        const sections = document.querySelectorAll('.skills-section, .education-section, .development-section, .summary-section, .experience-section, .languages-section, .references-section, .contact-section');
        
        // Create intersection observer for scroll-based fade-in
        lazyLoadingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                    // Use requestAnimationFrame for smooth animation trigger
                    requestAnimationFrame(() => {
                entry.target.classList.add('visible');
                        lazyLoadingObserver.unobserve(entry.target);
                        observedSections.delete(entry.target);
                    });
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        });

        // Check each section: if already visible in viewport, render normally (no fade-in class)
        // Otherwise, add fade-in class and observe for scroll-triggered animation
        sections.forEach(section => {
            // Remove any existing fade-in/visible classes
            section.classList.remove('fade-in', 'visible');
            
            // Check if section is already visible in viewport
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const isInViewport = rect.top < windowHeight + 100 && rect.bottom > -100;
            
            if (isInViewport) {
                // Section is already visible, render normally without any animation classes
                // (no fade-in class = full opacity by default)
            } else {
                // Section is not yet visible, add fade-in class for scroll animation
                section.classList.add('fade-in');
                lazyLoadingObserver.observe(section);
                observedSections.add(section);
            }
        });
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

    // Get sections (order is determined by array index)
    // If data has sections array, use it; otherwise combine from variables
    const sections = data.sections || combineSections(leftColumnSections, rightColumnSections);

    // Render each section in array order
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
    return section.column === 'left' ? $('#left-column-sections') : $('#right-column-sections');
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
        '<div class="contact-item">' + svgIcons.location + '<span>' + data.address + '</span></div>' +
        '<div class="contact-item">' + svgIcons.phone + '<span>' + data.phone + '</span></div>' +
        '<div class="contact-item">' + svgIcons.email + '<span>' + data.email + '</span></div>' +
        '<div class="contact-item">' + svgIcons.website + '<span>' + data.website + '</span></div>' +
        '<div class="contact-item">' + svgIcons.linkedin + '<span>' + data.linkedin + '</span></div>'
    );
}

function createListSection(section) {
    let html = '<div class="education-section"><h2>' + section.title + '</h2>';
    $.each(section.data, function(index, item) {
        html += '<div class="education-item">' +
            '<h3>' + item.institution + '</h3>' +
            '<p>' + item.degree + '</p>' +
            '<p>' + svgIcons.locationSmall + ' ' + item.location + '</p>' +
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
                '<p>' + svgIcons.locationSmallBlack + ' ' + exp.location + '</p>' +
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
    html += '<div class="reference-list">';
    $.each(section.data, function(index, ref) {
        html += 
            '<div class="reference-item">' +
                '<h4><u>' + ref.name + '</u></h4>' +
                '<p>' + ref.position + '</p>' +
                '<p>Phone</p>' +
                '<p>' + ref.email + '</p>' +
                '</div> ';
    });
    html += '</div></div>';
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
    // If updating personal data
    if (section === 'personal') {
        const personalJsonData = JSON.stringify(newData);
        db.collection('cv_v2').doc('personal').set({
            json_data: personalJsonData,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function() {
            personalData = newData;
        }).catch(function(error) {
            console.error('Error updating personal data:', error);
        });
        return;
    }
    
    // For sections, find which column it belongs to and update that document
    Promise.all([
        db.collection('cv_v2').doc('left-column-sections').get(),
        db.collection('cv_v2').doc('right-column-sections').get()
    ]).then(function(results) {
        const leftDoc = results[0];
        const rightDoc = results[1];
        
        let leftSections = [];
        let rightSections = [];
        let foundSection = false;
        let targetColumn = null;
        
        // Parse left sections
        if (leftDoc.exists) {
            try {
                leftSections = JSON.parse(leftDoc.data().json_data);
                const sectionIndex = leftSections.findIndex(function(s) {
                    return s.id === section;
                });
                if (sectionIndex !== -1) {
                    leftSections[sectionIndex].data = newData;
                    foundSection = true;
                    targetColumn = 'left';
                }
            } catch (e) {
                console.error('Error parsing left-column-sections:', e);
            }
        }
        
        // Parse right sections if not found in left
        if (!foundSection && rightDoc.exists) {
            try {
                rightSections = JSON.parse(rightDoc.data().json_data);
                const sectionIndex = rightSections.findIndex(function(s) {
                    return s.id === section;
                });
                if (sectionIndex !== -1) {
                    rightSections[sectionIndex].data = newData;
                    foundSection = true;
                    targetColumn = 'right';
                }
            } catch (e) {
                console.error('Error parsing right-column-sections:', e);
            }
        }
        
        if (!foundSection) {
            return;
        }
        
        // Remove order and page fields before saving
        if (targetColumn === 'left') {
            leftSections = removeOrderFields(leftSections);
            const leftJsonData = JSON.stringify(leftSections);
            db.collection('cv_v2').doc('left-column-sections').set({
                json_data: leftJsonData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function() {
                // Update variables
                leftColumnSections = leftSections;
                if (rightSections.length > 0) {
                    rightColumnSections = rightSections;
                }
            }).catch(function(error) {
                console.error('Error updating CV data:', error);
            });
        } else {
            rightSections = removeOrderFields(rightSections);
            const rightJsonData = JSON.stringify(rightSections);
            db.collection('cv_v2').doc('right-column-sections').set({
                json_data: rightJsonData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function() {
                // Update variables
                rightColumnSections = rightSections;
                if (leftSections.length > 0) {
                    leftColumnSections = leftSections;
                }
            }).catch(function(error) {
                console.error('Error updating CV data:', error);
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
    leftColumnSections: leftColumnSections,
    rightColumnSections: rightColumnSections,
    personalData: personalData
};

// Auto-load data when page loads
$(document).ready(function() {
    loadCVData();
});