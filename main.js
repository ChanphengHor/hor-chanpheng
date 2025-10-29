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

// SVG Icon Paths
const svgIcons = {
    location: '<svg width="20" height="25" viewBox="0 0 8 10" fill="currentColor"><path d="M3.88184 2.00195C5.38306 2.05228 6.58209 3.3105 6.57715 4.85059V4.88477C6.56007 5.80346 6.10806 6.7083 5.35742 7.51562C4.98904 7.90547 4.57764 8.25083 4.13184 8.54492L4.1123 8.56055C3.91924 8.70148 3.65891 8.70143 3.46582 8.56055L3.44531 8.54492L3.30957 8.45215C2.74631 8.05761 2.2444 7.57852 1.82227 7.0332L1.71875 6.89551C1.2765 6.30657 1.02513 5.59165 1 4.8418L1.00195 4.74707C1.05137 3.21727 2.28587 1.99501 3.79785 2L3.88184 2.00195ZM3.71777 2.50684C2.48812 2.54492 1.50046 3.5706 1.49609 4.83301L1.50293 4.95215C1.54555 5.54565 1.7569 6.11498 2.11426 6.59082C2.55784 7.19447 3.10246 7.71357 3.72266 8.125L3.75 8.14648C3.77239 8.16591 3.80582 8.16608 3.82812 8.14648L3.85547 8.125C4.27188 7.85104 4.65562 7.52838 4.99805 7.16602C5.66959 6.44379 6.06669 5.65015 6.08105 4.87988L6.08008 4.76953C6.04261 3.51648 5.03641 2.51032 3.79688 2.50586L3.71777 2.50684ZM3.78906 3.80078C4.37571 3.80092 4.85156 4.2859 4.85156 4.88379C4.85122 5.48138 4.3755 5.96568 3.78906 5.96582C3.2025 5.96582 2.7269 5.48147 2.72656 4.88379C2.72656 4.28582 3.20229 3.80078 3.78906 3.80078ZM3.78906 4.30664C3.47641 4.30664 3.22266 4.56517 3.22266 4.88379C3.22299 5.20212 3.47662 5.45996 3.78906 5.45996C4.10139 5.45982 4.35513 5.20203 4.35547 4.88379C4.35547 4.56525 4.1016 4.30678 3.78906 4.30664Z"/></svg>',
    phone: '<svg width="20" height="20" viewBox="0 0 8 8" fill="currentColor"><path d="M3.95605 0.666016C5.31882 0.676191 6.53426 1.5387 7.01074 2.83398C7.48721 4.12937 7.12583 5.58872 6.10254 6.50195C5.07941 7.415 3.6071 7.59228 2.40137 6.94824L2.38574 6.94336C2.38369 6.94211 2.38326 6.94083 2.38281 6.93945L2.15918 6.81055C2.11379 6.79167 2.06312 6.78811 2.03223 6.7959C1.79944 6.88093 1.56092 6.95068 1.31934 7.00488L1.27539 7.01074C1.00945 7.01674 0.875 6.84108 0.875 6.58594L0.881836 6.53125C0.942196 6.27769 1.01745 6.02799 1.10352 5.79688C1.11685 5.7532 1.11277 5.70593 1.08984 5.66211L1.0293 5.54199C0.496389 4.50656 0.536966 3.26335 1.13574 2.26562C1.73451 1.26819 2.80411 0.66138 3.95605 0.666016ZM3.86133 1.13184C2.90582 1.15961 2.02557 1.67619 1.52637 2.50781C1.01124 3.36615 0.97632 4.43572 1.43555 5.32812L1.49512 5.44629C1.57396 5.59624 1.59095 5.77184 1.53711 5.94727C1.46793 6.13392 1.40961 6.32484 1.35938 6.51758L1.4873 6.48438C1.57607 6.45952 1.66524 6.43177 1.75586 6.40137L1.89355 6.35352C2.0386 6.31294 2.19281 6.32215 2.34473 6.38574C2.37651 6.40131 2.41618 6.42267 2.46582 6.45117L2.60449 6.53223C2.60664 6.53282 2.60884 6.53376 2.61035 6.53418L2.60645 6.5332L2.70117 6.58203C3.6938 7.06888 4.87682 6.92528 5.72852 6.21484L5.80078 6.15234C6.68102 5.36658 6.99176 4.11133 6.58203 2.99707C6.17203 1.8825 5.12597 1.13994 3.95312 1.13086L3.86133 1.13184ZM1.35742 6.51855L1.32715 6.64062C1.33697 6.59936 1.34868 6.5586 1.35938 6.51758L1.35742 6.51855ZM2.49805 3.61914C2.70467 3.61914 2.87287 3.78911 2.87305 3.99902C2.87305 4.20909 2.70478 4.37988 2.49805 4.37988C2.29167 4.37945 2.12402 4.20883 2.12402 3.99902C2.1242 3.78938 2.29178 3.61957 2.49805 3.61914ZM3.9541 3.61914C4.16072 3.61914 4.32892 3.78911 4.3291 3.99902C4.3291 4.20909 4.16084 4.37988 3.9541 4.37988C3.74758 4.37963 3.58008 4.20894 3.58008 3.99902C3.58026 3.78927 3.74769 3.61939 3.9541 3.61914ZM5.41016 3.61914C5.61669 3.61925 5.784 3.78918 5.78418 3.99902C5.78418 4.20903 5.6168 4.37978 5.41016 4.37988C5.20357 4.3797 5.03516 4.20898 5.03516 3.99902C5.03534 3.78922 5.20368 3.61932 5.41016 3.61914Z"/></svg>',
    email: '<svg width="20" height="20" viewBox="0 0 8 8" fill="currentColor"><path d="M5.42188 1C5.91858 1.00567 6.39175 1.21901 6.73047 1.59082C7.06919 1.96266 7.24372 2.4607 7.21484 2.95312V5.03223C7.24408 5.53959 7.06913 6.03741 6.73047 6.40918C6.39175 6.78099 5.91843 6.99432 5.41895 7H2.44629C1.40644 6.99993 0.65625 6.14599 0.65625 5.04688V2.95312C0.65625 1.85401 1.40644 1.00007 2.44629 1H5.42188ZM2.44629 1.50977C1.6939 1.50983 1.1543 2.12403 1.1543 2.95312V5.04688C1.1543 5.87597 1.6939 6.49017 2.44629 6.49023H5.41602C5.77657 6.48612 6.12035 6.33143 6.36621 6.06152C6.61203 5.79163 6.7385 5.43021 6.7168 5.04688L6.71777 2.9375C6.73891 2.56935 6.61193 2.20826 6.36621 1.93848C6.12035 1.66857 5.77657 1.51388 5.41602 1.50977H2.44629ZM1.95703 2.87988C2.03472 2.77996 2.17139 2.75543 2.27637 2.81738L2.30664 2.83887L3.66113 3.93945C3.81303 4.06061 4.02208 4.06966 4.18066 3.96875L4.21875 3.94141L5.56348 2.83984C5.67081 2.75193 5.82815 2.77005 5.91406 2.87988C5.99175 2.97965 5.98469 3.12108 5.90234 3.21191L5.875 3.2373L4.52734 4.34082C4.20007 4.60186 3.74749 4.61502 3.40625 4.37891L3.35352 4.33984L1.99707 3.23828C1.88944 3.15081 1.87159 2.99006 1.95703 2.87988Z"/></svg>',
    website: '<svg width="20" height="20" viewBox="0 0 8 8" fill="currentColor"><path d="M6.9707 4.9082C7.10591 4.90839 7.2156 5.01987 7.21582 5.15723C7.21582 5.16456 7.16968 5.75421 7.15918 5.93555C7.14044 6.24807 7.02117 6.56712 6.83984 6.78906C6.58721 7.0984 6.26483 7.24314 5.82715 7.24414C5.62385 7.24447 4.78475 7.24512 3.94531 7.24512C3.10604 7.24512 2.26624 7.24447 2.06348 7.24414C1.62559 7.2431 1.30337 7.09864 1.05078 6.78906C0.869711 6.56744 0.749859 6.24815 0.731445 5.93555C0.720618 5.75421 0.674805 5.16456 0.674805 5.15723C0.675029 5.01986 0.784701 4.90838 0.919922 4.9082C1.04886 4.9082 1.15227 5.01067 1.16211 5.13867C1.16358 5.15562 1.21198 5.72395 1.22266 5.90527C1.2348 6.10894 1.31617 6.33106 1.42969 6.46973C1.59045 6.66669 1.76886 6.74347 2.06445 6.74414C2.47048 6.74481 5.41993 6.74481 5.82617 6.74414C6.12212 6.74347 6.3005 6.66639 6.46094 6.46973C6.57471 6.33072 6.65583 6.10886 6.66797 5.90527C6.67832 5.72396 6.72705 5.15557 6.72852 5.13867C6.73836 5.01067 6.84176 4.9082 6.9707 4.9082ZM3.93555 4.87695C4.07124 4.87695 4.18141 4.98915 4.18164 5.12695V5.55859C4.18164 5.69659 4.07138 5.80859 3.93555 5.80859C3.79975 5.80855 3.68945 5.69657 3.68945 5.55859V5.12695C3.68968 4.98917 3.79989 4.87699 3.93555 4.87695ZM4.35938 0.666016C4.85208 0.666125 5.25604 1.04277 5.31738 1.52637H5.96582C6.6545 1.52637 7.21484 2.0959 7.21484 2.7959V3.95117C7.21484 4.03517 7.17339 4.11349 7.10449 4.16016C6.428 4.61475 5.62503 4.91748 4.78223 5.03613C4.77125 5.03776 4.76 5.03905 4.74902 5.03906C4.6378 5.03906 4.53798 4.96161 4.50977 4.84961C4.44333 4.58452 4.20641 4.39941 3.93359 4.39941C3.65782 4.39957 3.42372 4.58101 3.35059 4.85156C3.31775 4.97276 3.20366 5.05075 3.0791 5.0332C2.24212 4.91454 1.44215 4.61282 0.766602 4.16016C0.697424 4.11382 0.65625 4.03514 0.65625 3.95117V2.7959C0.65625 2.09603 1.21774 1.52658 1.9082 1.52637H2.55371C2.61538 1.04246 3.01905 0.666165 3.51172 0.666016H4.35938ZM1.9082 2.02637C1.4894 2.02658 1.14844 2.37203 1.14844 2.7959V3.81445C1.68717 4.15345 2.30674 4.39148 2.95703 4.50781C3.14203 4.14092 3.51705 3.89955 3.93359 3.89941C4.35389 3.89941 4.72841 4.14174 4.9082 4.51074C5.56241 4.39374 6.18361 4.15478 6.72266 3.81445V2.7959C6.72266 2.3719 6.38316 2.02637 5.96582 2.02637H1.9082ZM3.51172 1.16602C3.29104 1.16615 3.10685 1.31979 3.05176 1.52637H4.81934C4.76456 1.31977 4.57976 1.16611 4.35938 1.16602H3.51172Z"/></svg>',
    linkedin: '<svg width="20" height="20" viewBox="0 0 8 8" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.91667 1.5C1.68655 1.5 1.5 1.68655 1.5 1.91667V6.08333C1.5 6.31345 1.68655 6.5 1.91667 6.5H6.08333C6.31345 6.5 6.5 6.31345 6.5 6.08333V1.91667C6.5 1.68655 6.31345 1.5 6.08333 1.5H1.91667ZM1 1.91667C1 1.41041 1.41041 1 1.91667 1H6.08333C6.58959 1 7 1.41041 7 1.91667V6.08333C7 6.58959 6.58959 7 6.08333 7H1.91667C1.41041 7 1 6.58959 1 6.08333V1.91667Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 3.33398C2.88807 3.33398 3 3.44591 3 3.58398V5.41732C3 5.55539 2.88807 5.66732 2.75 5.66732C2.61193 5.66732 2.5 5.55539 2.5 5.41732V3.58398C2.5 3.44591 2.61193 3.33398 2.75 3.33398Z"/><path d="M2.75033 3.00065C2.93442 3.00065 3.08366 2.85141 3.08366 2.66732C3.08366 2.48322 2.93442 2.33398 2.75033 2.33398C2.56623 2.33398 2.41699 2.48322 2.41699 2.66732C2.41699 2.85141 2.56623 3.00065 2.75033 3.00065Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 4.33398C3.5 3.7817 3.94772 3.33398 4.5 3.33398C5.05228 3.33398 5.5 3.7817 5.5 4.33398V5.41732C5.5 5.55539 5.38807 5.66732 5.25 5.66732C5.11193 5.66732 5 5.55539 5 5.41732V4.33398C5 4.05785 4.77614 3.83398 4.5 3.83398C4.22386 3.83398 4 4.05785 4 4.33398V5.41732C4 5.55539 3.88807 5.66732 3.75 5.66732C3.61193 5.66732 3.5 5.55539 3.5 5.41732V4.33398Z"/></svg>',
    locationSmall: '<svg width="16" height="18" viewBox="0 0 8 9" fill="currentColor"><path d="M3.88184 1.00195C5.38306 1.05228 6.58209 2.3105 6.57715 3.85059V3.88477C6.56007 4.80346 6.10806 5.7083 5.35742 6.51562C4.98904 6.90547 4.57764 7.25083 4.13184 7.54492L4.1123 7.56055C3.91924 7.70148 3.65891 7.70143 3.46582 7.56055L3.44531 7.54492L3.30957 7.45215C2.74631 7.05761 2.2444 6.57852 1.82227 6.0332L1.71875 5.89551C1.2765 5.30657 1.02513 4.59165 1 3.8418L1.00195 3.74707C1.05137 2.21727 2.28587 0.995013 3.79785 1L3.88184 1.00195ZM3.71777 1.50684C2.48812 1.54492 1.50046 2.5706 1.49609 3.83301L1.50293 3.95215C1.54555 4.54565 1.7569 5.11498 2.11426 5.59082C2.55784 6.19447 3.10246 6.71357 3.72266 7.125L3.75 7.14648C3.77239 7.16591 3.80582 7.16608 3.82812 7.14648L3.85547 7.125C4.27188 6.85104 4.65562 6.52838 4.99805 6.16602C5.66959 5.44379 6.06669 4.65015 6.08105 3.87988L6.08008 3.76953C6.04261 2.51648 5.03641 1.51032 3.79688 1.50586L3.71777 1.50684ZM3.78906 2.80078C4.37571 2.80092 4.85156 3.2859 4.85156 3.88379C4.85122 4.48138 4.3755 4.96568 3.78906 4.96582C3.2025 4.96582 2.7269 4.48147 2.72656 3.88379C2.72656 3.28582 3.20229 2.80078 3.78906 2.80078ZM3.78906 3.30664C3.47641 3.30664 3.22266 3.56517 3.22266 3.88379C3.22299 4.20212 3.47662 4.45996 3.78906 4.45996C4.10139 4.45982 4.35513 4.20203 4.35547 3.88379C4.35547 3.56525 4.1016 3.30678 3.78906 3.30664Z"/></svg>',
    locationSmallBlack: '<svg width="12" height="14" viewBox="0 0 6 7" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2.88184 0.00195312C4.38306 0.052276 5.58209 1.3105 5.57715 2.85059V2.88477C5.56007 3.80346 5.10806 4.7083 4.35742 5.51562C3.98904 5.90547 3.57764 6.25083 3.13184 6.54492L3.1123 6.56055C2.91924 6.70148 2.65891 6.70143 2.46582 6.56055L2.44531 6.54492L2.30957 6.45215C1.74631 6.05761 1.2444 5.57852 0.822266 5.0332L0.71875 4.89551C0.276502 4.30657 0.0251322 3.59165 0 2.8418L0.00195312 2.74707C0.0513732 1.21727 1.28587 -0.00498721 2.79785 0L2.88184 0.00195312ZM2.71777 0.506836C1.48812 0.544925 0.500458 1.5706 0.496094 2.83301L0.50293 2.95215C0.545553 3.54565 0.756899 4.11498 1.11426 4.59082C1.55784 5.19447 2.10246 5.71357 2.72266 6.125L2.75 6.14648C2.77239 6.16591 2.80582 6.16608 2.82812 6.14648L2.85547 6.125C3.27188 5.85104 3.65562 5.52838 3.99805 5.16602C4.66959 4.44379 5.06669 3.65015 5.08105 2.87988L5.08008 2.76953C5.04261 1.51648 4.03641 0.510317 2.79688 0.505859L2.71777 0.506836ZM2.78906 1.80078C3.37571 1.80092 3.85156 2.2859 3.85156 2.88379C3.85122 3.48138 3.3755 3.96568 2.78906 3.96582C2.2025 3.96582 1.7269 3.48147 1.72656 2.88379C1.72656 2.28582 2.20229 1.80078 2.78906 1.80078ZM2.78906 2.30664C2.47641 2.30664 2.22266 2.56517 2.22266 2.88379C2.22299 3.20212 2.47662 3.45996 2.78906 3.45996C3.10139 3.45982 3.35513 3.20203 3.35547 2.88379C3.35547 2.56525 3.1016 2.30678 2.78906 2.30664Z" fill="currentColor"/></svg>'
};

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
    // Show shimmer loading
    $('#shimmer-loading').fadeIn(300);
    
    db.collection('cv').get().then(function(querySnapshot) {
        const data = {};
        
        querySnapshot.forEach(function(doc) {
            data[doc.id] = doc.data().data;
        });

        renderDynamicCV(data);
        
        // Hide shimmer and show content with fade
        $('#shimmer-loading').fadeOut(500, function() {
            $('#cv-content').addClass('loaded');
            initializeLazyLoading();
        });
        
        console.log('CV data loaded successfully from Firestore');
    }).catch(function(error) {
        console.error('Error loading CV data:', error);
        // Fallback to sample data if Firestore fails
        renderDynamicCV(sampleCVData);
        
        // Hide shimmer and show content with fade
        $('#shimmer-loading').fadeOut(500, function() {
            $('#cv-content').addClass('loaded');
            initializeLazyLoading();
        });
    });
}

// Intersection Observer for lazy loading fade-in
function initializeLazyLoading() {
    // Add fade-in class to all sections
    $('.skills-section, .education-section, .development-section, .summary-section, .experience-section, .languages-section, .references-section, .contact-section').addClass('fade-in');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all sections with fade-in class
    document.querySelectorAll('.fade-in').forEach(section => {
        observer.observe(section);
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