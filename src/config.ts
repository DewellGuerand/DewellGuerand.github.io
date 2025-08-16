export const siteConfig = {
  name: "Guerand Dewell",
  title: "Mathematical Engineer student",
  description: "Portfolio website of Guerand Dewell",
  accentColor: "#374151",
  social: {
    email: "guerand22004@gmail.com",
    linkedin: "https://www.linkedin.com/in/guerand-dewell-a3868a318",
    github: "https://github.com/SteedStone",
  },
  aboutMe:
    "Engineering student in Applied Mathematics and Computer Science. Passionate about math since childhood, constantly motivated to learn. Strong analytical and problem-solving skills demonstrated through various projects. Pursuing a master's in Mathematical Engineering next year ",
  skills: ["Python", "C", "Java", "Node.js", "Dart"],
  projects: [
    {
      name: "Tracking a Lorenz particle",
      description:
        "This project estimate the position of a Lorenz attractor particle over time using a particle filter.",
      link: "https://github.com/SteedStone/Stochastic-Processes-Project",
      skills: ["Python"],
    },
    {
      name: "Finite element project",
      description:
        "This project involves developing a complete finite element analysis application for solving 2D linear elasticity problems in engineering structures. The program consists of three main components.",
      link: "https://github.com/SteedStone/Finite-Element-Project",
      skills: ["C" , "Python"  ],
    },
    {
      name: "Full-stack e-commerce platform",
      description:
        "This project is a full-stack e-commerce platform for French artisanal bakeries, built with Next.js, TypeScript, and PostgreSQL, featuring online ordering, real-time inventory management, and multi-location support.",
      link: "https://github.com/SteedStone/NJS",
      skills: ["TypeScript", "Next.js", "PostgreSQL" ,"Prisma"],
    },
    {
      name: "Financial Calculator",
      description:
        "A GUI-based financial calculator built with Python and CustomTkinter for computing option premiums and FTP (Funds Transfer Pricing) rates for mortgage products.",
      link: "https://github.com/SteedStone/NJS",
      skills: ["Python"],
    },
  ],
  // experience: [
  //   {
  //     company: "Tech Company",
  //     title: "Senior Software Engineer",
  //     dateRange: "Jan 2022 - Present",
  //     bullets: [
  //       "Led development of microservices architecture serving 1M+ users",
  //       "Reduced API response times by 40% through optimization",
  //       "Mentored team of 5 junior developers",
  //     ],
  //   },
  //   {
  //     company: "Startup Inc",
  //     title: "Full Stack Developer",
  //     dateRange: "Jun 2020 - Dec 2021",
  //     bullets: [
  //       "Built and launched MVP product from scratch using React and Node.js",
  //       "Implemented CI/CD pipeline reducing deployment time by 60%",
  //       "Collaborated with product team to define technical requirements",
  //     ],
  //   },
  //   {
  //     company: "Digital Agency",
  //     title: "Frontend Developer",
  //     dateRange: "Aug 2018 - May 2020",
  //     bullets: [
  //       "Developed responsive web applications for 20+ clients",
  //       "Improved site performance scores by 35% on average",
  //       "Introduced modern JavaScript frameworks to legacy codebases",
  //     ],
  //   },
  // ],
  education: [
    {
      school: "Catholic University of Louvain",
      degree: "BEng",
      dateRange: "Sept 2022 - June 2025",
      achievements: [
        "Graduated Cum Laude  ",
        "Majors in Applied mathematics and Computer science"
      ],
    },
    {
      school: "Lycée de Berlaymont",
      degree: "High School",
      dateRange: "Sept 2016 - June 2022",
      achievements: [
        "Graduated Cum Laude",
        "Majors in Science and Mathematics",
        
      ],
    },
  ],
};
