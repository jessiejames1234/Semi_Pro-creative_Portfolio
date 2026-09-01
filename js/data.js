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
        video: "image/neon-outpost/lv_0_20260831151245.mp4",
        playUrl: "https://neon-outpost-by-jesce.pages.dev/",
        playLabel: "PLAY THIS GAME",
        githubUrl: "https://github.com/jessiejames1234",
        description: "Developed a browser-based first-person 3D survival game where players defend Neon Outpost through 50 escalating waves, capture defeated enemies into a squad, and compete on a persistent leaderboard.",
        highlights: [
            "Designed a 50-wave progression system with escalating enemy counts, elite encounters every five waves, and the Outpost Core waiting at wave 50.",
            "Built first-person combat with movement, sprinting, shooting, reloading, nano-shield and health systems, plus captured-squad Attack and Protect commands.",
            "Created 20 distinct enemy units and a dedicated 3D Enemy Design Showroom for inspecting their models and combat roles.",
            "Integrated account authentication, persistent global rankings, and owner tools for managing users, roles, and leaderboard scores."
        ]
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
        githubUrl: "https://github.com/jessiejames1234",
        description: "Developed a level-based 2D top-down escape game set inside a school building.",
        highlights: [
            "Programmed core mechanics where two students have to work together to escape the classroom while avoiding AI-controlled teachers and monsters.",
            "Built the game using Unity 6.2 handling sprite animations, scene transitions, and ensuring it runs smoothly on both Android and web browsers."
        ]
    },
    {
        title: "Web-Based Teacher-Room Tracking System with Real-Time Monitoring and 3D Classroom Visualization",
        type: "Capstone Project",
        date: "November 2025 - Present",
        tech: ["PHP", "ReactJS", "Mysql", "JS", "Bootstrap", "Git", "Blender", "Visual Studio", "Figma", "Socket io"],
        images: [
            "image/Teacher-Room Tracking/Screenshot 2026-07-01 134456.png",
            "image/Teacher-Room Tracking/Screenshot 2026-07-01 135036.png",
            "image/Teacher-Room Tracking/Screenshot 2026-07-01 135139.png",
            "image/Teacher-Room Tracking/638311467_892926050217215_2741885221166264343_n.png"
        ],
        githubUrl: "https://github.com/jessiejames1234",
        description: "Built a web application to automate faculty attendance and replace the manual paper-checking process handled by student scholars.",
        highlights: [
            "Created a digital Check-In, Check-Mid, and Check-Out system to accurately track teachers even when their class schedules overlap.",
            "Solved GPS location conflicts in multi-story buildings by combining classroom center coordinates with QR code scanning at stairways to verify the exact floor.",
            "Added a request module so teachers can easily ask the Department Admin for schedule changes or the Dean for attendance corrections directly through the system.",
            "Linked backend to a real-time dashboard and a 3D classroom visualizer (using WebSockets) so admins can see room occupancy live."
        ]
    }
];
