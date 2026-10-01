// Data extracted from Resume & Portfolio images

const skillsData = [
    {
        category: "Programming Languages",
        icon: "fa-terminal",
        tools: [
            { name: "Python", icon: "devicon-python-plain", tone: "python" },
            { name: "Java", icon: "devicon-java-plain colored" },
            { name: "C#", icon: "devicon-csharp-plain colored" },
            { name: "PHP", icon: "devicon-php-plain colored" },
            { name: "JavaScript", icon: "devicon-javascript-plain colored" },
            { name: "Dart", icon: "devicon-dart-plain colored" }
        ]
    },
    {
        category: "Frontend & Frameworks",
        icon: "fa-layer-group",
        tools: [
            { name: "HTML", icon: "devicon-html5-plain colored" },
            { name: "CSS", icon: "devicon-css3-plain colored" },
            { name: "Bootstrap", icon: "devicon-bootstrap-plain colored" },
            { name: "Tailwind CSS", icon: "devicon-tailwindcss-original colored" },
            { name: "React / ReactJS", icon: "devicon-react-original colored" },
            { name: "React Native", icon: "devicon-react-original colored" }
        ]
    },
    {
        category: "Mobile & Data",
        icon: "fa-mobile-screen-button",
        tools: [
            { name: "Flutter", icon: "devicon-flutter-plain colored" },
            { name: "Hive", fallback: "H", tone: "hive" },
            { name: "MySQL", icon: "devicon-mysql-original colored" }
        ]
    },
    {
        category: "Development Tools",
        icon: "fa-screwdriver-wrench",
        tools: [
            { name: "XAMPP", icon: "devicon-xampp-plain colored" },
            { name: "Wamp", fallback: "W", tone: "wamp" },
            { name: "Unity Hub", icon: "devicon-unity-plain", tone: "unity" },
            { name: "Git", icon: "devicon-git-plain colored" },
            { name: "Figma", icon: "devicon-figma-plain colored" },
            { name: "Visual Studio", icon: "devicon-visualstudio-plain colored" }
        ]
    },
    {
        category: "Creative Tools",
        icon: "fa-photo-film",
        tools: [
            { name: "Adobe Premiere Pro", icon: "devicon-premierepro-plain colored" },
            { name: "Photoshop", icon: "devicon-photoshop-plain colored" },
            { name: "After Effects", icon: "devicon-aftereffects-plain colored" }
        ]
    }
];

const projectsData = [
    {
        title: "Neon Outpost",
        type: "Individual Game Project",
        date: "August 2026 - Present",
        tech: ["JavaScript", "Three.js", "WebGL", "HTML", "CSS", "Cloudflare D1", "Git"],
        images: [
            "image/neon-outpost/Screenshot 2026-08-31 144516.png",
            "image/neon-outpost/Screenshot 2026-08-31 144546.png",
            "image/neon-outpost/Screenshot 2026-08-31 144614.png",
            "image/neon-outpost/Screenshot 2026-08-31 144630.png"
        ],
        video: "image/neon-outpost/neon.mp4",
        playUrl: "https://neon-outpost-by-jesce.pages.dev/",
        playLabel: "PLAY THIS GAME",
        githubUrl: "https://github.com/jessiejames1234",
        description: "Developed a browser-based first-person 3D survival game where players defend Neon Outpost through 50 escalating waves, capture defeated enemies into a squad, and compete on a persistent leaderboard."
    },
    {
        title: "Detention Break Out Mobile & Website Game",
        type: "Paired Project",
        date: "January 2026 - May 2026",
        tech: ["Android", "Website", "C#", "Piskel", "Blender", "Unity", "Visual Studio", "Git"],
        images: [
            "image/Break Out Mobile/Screenshot 2026-07-02 221324.png",
            "image/Break Out Mobile/Screenshot 2026-07-02 221421.png",
            "image/Break Out Mobile/53dec02e-fab7-4216-89c2-8bebafff7270.jpg",
            "image/Break Out Mobile/fda47c7c-705b-49b3-84ff-c8eb75d84d28.jpg"
        ],
        video: "image/Break Out Mobile/break_out.mp4",
        playUrl: "https://play.unity.com/api/v1/games/game/9803011c-819e-4d3a-9124-cd8103f48b60/build/latest/frame",
        playLabel: "PLAY THIS GAME",
        githubUrl: "https://github.com/jessiejames1234",
        description: "Developed a level-based 2D top-down escape game set inside a school building."
    },
    {
        title: "Web-Based Teacher-Room Tracking System with Real-Time Monitoring and 3D Classroom Visualization",
        type: "Capstone Project",
        date: "November 2025 - Present",
        tech: ["PHP", "ReactJS", "Mysql", "JS", "Bootstrap", "Git", "Blender", "Three.js", "Visual Studio", "Figma", "Socket io"],
        images: [
            "image/Teacher-Room Tracking/Screenshot 2026-08-31 202856.png",
            "image/Teacher-Room Tracking/Screenshot 2026-08-31 202905.png",
            "image/Teacher-Room Tracking/Screenshot 2026-08-31 202931.png",
            "image/Teacher-Room Tracking/Screenshot 2026-08-31 202956.png"
        ],
        githubUrl: "https://github.com/jessiejames1234",
        description: "Built a web application to automate faculty attendance and replace the manual paper-checking process handled by student scholars."
    }
];

const additionalProjectsData = [
    {
        title: "I.T. Event Management & Attendance Platform",
        type: "Student Event Management System",
        images: [
            "image/new-project-1/Screenshot 2026-10-01 191130.png",
            "image/new-project-1/Screenshot 2026-10-01 191141.png",
            "image/new-project-1/Screenshot 2026-10-01 191157.png",
            "image/new-project-1/Screenshot 2026-10-01 191229.png",
            "image/new-project-1/Screenshot 2026-10-01 191242.png"
        ],
        tech: ["PHP", "JavaScript", "CSS", "Tailwind", "HTML", "Visual Studio", "MySQL", "Git"],
        description: "Built a student event platform where administrators publish events and announcements, SBO officers scan student QR codes for attendance, and organizers manage tribe scores and leaderboards. Each scan records the officer's GPS location, with attendance activity visible on a map."
    },
    {
        title: "Bakeshop Cashiering App",
        type: "Mobile Point-of-Sale Application",
        images: [
            "image/Bakeshop Cashiering App/Screenshot 2026-07-09 213659.png",
            "image/Bakeshop Cashiering App/Screenshot 2026-07-09 214226.png",
            "image/Bakeshop Cashiering App/Screenshot 2026-07-09 213936.png"
        ],
        tech: ["Android", "Dart", "Flutter", "Hive", "Git", "Visual Studio"],
        githubUrl: "https://github.com/jessiejames1234",
        description: "An offline-capable mobile point-of-sale application for managing bakery products, processing cart transactions, and reviewing sales records through a streamlined cashier workflow."
    },
    {
        title: "Hardware POS & Warehouse Inventory System",
        type: "Web-Based Business System",
        images: [
            "image/hardware pos with werehouse inventory system/Screenshot 2026-08-31 194405.png",
            "image/hardware pos with werehouse inventory system/Screenshot 2026-08-31 194316.png",
            "image/hardware pos with werehouse inventory system/Screenshot 2026-08-31 194309.png",
            "image/hardware pos with werehouse inventory system/Screenshot 2026-08-31 193506.png"
        ],
        tech: ["PHP", "JavaScript", "CSS", "Bootstrap", "HTML", "Visual Studio", "MySQL", "Git"],
        githubUrl: "https://github.com/jessiejames1234",
        description: "A web-based point-of-sale and warehouse inventory system that brings hardware sales, product records, and stock monitoring into one organized operational workspace."
    },
    {
        title: "Shoe Store Point-of-Sale System",
        type: "Web-Based Retail Point-of-Sale",
        images: [
            "image/new-project-2/Screenshot 2026-10-01 193142.png",
            "image/new-project-2/Screenshot 2026-10-01 194052.png",
            "image/new-project-2/Screenshot 2026-10-01 194104.png",
            "image/new-project-2/Screenshot 2026-10-01 194117.png"
        ],
        tech: ["PHP", "CSS", "HTML", "Visual Studio", "MySQL", "Git"],
        description: "Developed a web-based shoe store POS with product and brand management, stock controls, and a cashier flow for selecting shoe sizes and colors before checkout."
    },
    {
        title: "Bakeshop Point-of-Sale & Inventory System",
        type: "Web-Based Bakeshop POS",
        images: [
            "image/shoe point of sale/Screenshot 2026-08-31 185834.png",
            "image/shoe point of sale/Screenshot 2026-08-31 185812.png",
            "image/shoe point of sale/Screenshot 2026-08-31 185908.png",
            "image/shoe point of sale/Screenshot 2026-08-31 185928.png"
        ],
        tech: ["PHP", "CSS", "HTML", "Visual Studio", "MySQL", "Git"],
        description: "Built a bakeshop POS for managing products and stock, processing cashier orders, and reviewing sales through dashboard reports."
    },
    {
        title: "Movie Discovery & Rating App",
        type: "Flutter Android Application",
        images: [
            "image/new-project-3/3.jpg",
            "image/new-project-3/2.jpg",
            "image/new-project-3/1.jpg"
        ],
        tech: ["Flutter", "Git", "Visual Studio Code", "Android"],
        description: "Created a movie discovery app with poster-based previews and film details. Users can search titles, browse categories, save favorites, and rate movies."
    }
];
