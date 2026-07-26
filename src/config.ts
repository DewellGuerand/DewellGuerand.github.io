export const siteConfig = {
  name: "Dewell Guerand",
  title: "MEng Student in Applied Mathematics | Quantitative Finance",
  description:
    "Portfolio of Dewell Guerand – engineering student at UCLouvain (EPL) and CentraleSupélec, specialising in Applied Mathematics and quantitative finance.",
  accentColor: "#374151",
  social: {
    email: "guerand22004@gmail.com",
    linkedin: "https://www.linkedin.com/in/guerand-dewell-a3868a318/",
    github: "https://github.com/DewellGuerand",
  },
  aboutMe:
    "Engineering student specialising in Applied Mathematics at UCLouvain (EPL), pursuing a T.I.M.E double degree at CentraleSupélec (Université Paris-Saclay) starting 2026. Passionate about quantitative finance, mathematical modelling, and machine learning. Graduated Cum Laude at BEng level and currently serving as Quantitative Analyst at the LSM Investment Club.",
  skillGroups: [
    {
      label: "Programming",
      skills: ["Python", "C", "C++", "Java", "Dart", "Bash", "Julia"],
    },
    {
      label: "Libraries",
      skills: ["NumPy", "SciPy", "Matplotlib", "Pandas", "TensorFlow", "scikit-learn"],
    },
    {
      label: "Tools",
      skills: ["Git", "Overleaf", "Typst"],
    },
  ],
  skills: ["Python", "C", "C++", "Java", "Bash", "Julia", "NumPy", "SciPy", "Matplotlib", "Pandas", "Git"],
  languages: [
    { name: "French", level: "C2", note: "Native" },
    { name: "English", level: "C1", note: "IELTS 7.0" },
    { name: "Dutch", level: "B2", note: "" },
  ],
  projects: [
    {
      name: "Interest Rate Modeling – Sinusoidal Hull-White Model",
      description:
        "Implemented and validated an interest rate simulation engine based on the Hull-White model with a sinusoidal mean-reversion extension derived from a research paper. Calibrated model parameters and benchmarked against standard short-rate models.",
      link: "https://github.com/DewellGuerand",
      skills: ["Python", "NumPy", "SciPy", "Matplotlib"],
    },
    {
      name: "Pricer for GMAB & GMDB Insurance Products",
      description:
        "Full pricing framework for Guaranteed Minimum Accumulation Benefit (GMAB) and Guaranteed Minimum Death Benefit (GMDB) contracts. Covered closed-form analytical derivations and numerical methods including Binomial Trees and Monte Carlo simulation (Euler-Maruyama scheme).",
      link: undefined,
      skills: ["Python", "NumPy", "SciPy"],
    },
    {
      name: "Disease Detection – Machine Learning",
      description:
        "Disease classification pipeline combining a CNN for image-based features with ensemble methods (XGBoost, RandomForest). Performed hyperparameter tuning and cross-validation.",
      link: undefined,
      skills: ["Python", "TensorFlow", "scikit-learn"],
    },
    {
      name: "Finite Element Analysis – 2D Linear Elasticity",
      description:
        "Complete finite element analysis application for solving 2D linear elasticity problems in engineering structures, with mesh generation, solver, and visualisation components.",
      link: "https://github.com/DewellGuerand/Finite-Element-Project",
      skills: ["C", "Python"],
    },
    {
      name: "Lorenz Particle Filter",
      description:
        "Estimates the position of a Lorenz attractor particle over time using a particle filter for stochastic process tracking.",
      link: "https://github.com/DewellGuerand/Stochastic-Processes-Project",
      skills: ["Python"],
    },
  ],
  experience: [
    {
      company: "LSM Investment Club – UCLouvain",
      title: "Quantitative Analyst",
      dateRange: "Oct 2025 – Present",
      link: undefined,
      bullets: [
        "Conducted quantitative analysis and financial modelling to support investment decisions across equity and fixed income strategies.",
        "Presented and popularised recent academic research in quantitative finance to club members; contributed to portfolio strategy discussions.",
      ],
    },
  ],
  education: [
    {
      school: "CentraleSupélec, Université Paris-Saclay ",
      degree: "MEng Double Degree",
      dateRange: "Aug 2026 – June 2028",
      achievements: [
        "Engineering cycle – T.I.M.E (Top International Managers in Engineering)",
        "Ranked 2nd in Mathematics worldwide",

      ],
    },
    {
      school: "Louvain School of Engineering (EPL), UCLouvain",
      degree: "MEng",
      dateRange: "Sept 2025 – June 2026",
      achievements: ["Major: Applied Mathematics"],
    },
    {
      school: "Louvain School of Engineering (EPL), UCLouvain",
      degree: "BEng",
      dateRange: "Sept 2022 – June 2025",
      achievements: [
        "Graduated Cum Laude",
        "Major: Applied Mathematics, Minor: Computer Science",
      ],
    },
    {
      school: "Lycée de Berlaymont",
      degree: "High School",
      dateRange: "Sept 2016 – June 2022",
      achievements: [
        "Graduated with honours",
        "Major in Mathematics and Sciences",
      ],
    },
  ],
  achievements: [
    {
      title: "Hockey",
      description:
        "15+ years of competitive play at club level; coached and mentored junior players.",
    },
    {
      title: "Running",
      description:
        "Completed the Brussels 20 km (half-marathon distance), training consistently while managing a full academic workload.",
    },
    {
      title: "Market Investment",
      description:
        "Actively managing a personal portfolio with focus on equity markets, factor investing, and macroeconomic analysis.",
    },
    {
      title: "Senior Prom Trek",
      description:
        "Ranked 13th out of 120 high schools in the Walloon region in a 40 km endurance trek.",
    },
  ],
};
