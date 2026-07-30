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
      skills: ["Python", "C", "C++", "Java", "Bash", "Julia"],
    },
    {
      label: "Libraries",
      skills: ["NumPy", "SciPy", "Matplotlib", "Pandas"],
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
        "Implemented and verified an extension of the classical Hull-White model in which the mean-reversion speed becomes cyclical, reproducing the results of a research paper on the same data and extending it with a Nelson-Siegel time-dependent long-term level.",
      link: "https://github.com/DewellGuerand",
      skills: ["Python", "NumPy", "SciPy", "Matplotlib"],
      details:
        "We implemented and verified an extension of the classical Hull-White model. To incorporate the notion of cyclicity, the paper we followed modifies the SDE so that the periodicity is carried by the mean-reversion speed $\\kappa$: $$dr_t = \\kappa(t)\\left(\\theta - r_t\\right)dt + \\sigma\\, dW_t, \\qquad \\kappa(t) = \\kappa_0 + A\\sin(\\omega t),$$ with $\\omega = 2\\pi/22.5$ rad/yr, a periodicity the authors identified through a Fourier analysis of the interest rate series. To verify their results we retrieved the same data as the one mentioned in the article and plotted the errors of the two models. We then extended the model further by adding a time-dependent $\\theta$ term coming directly from the Nelson-Siegel result. The two versions turn out to be complementary: one is more precise in the short term, while the other is more accurate at long maturities.",
      media: [
        {
          type: "video",
          src: "/projects/Story.mp4",
        },
      ],
    },
    {
      name: "Pricer for GMAB & GMDB Insurance Products",
      description:
        "Closed-form pricing of Guaranteed Minimum Accumulation Benefit (GMAB) and Guaranteed Minimum Death Benefit (GMDB) contracts, cross-checked against a binomial tree and a Monte Carlo simulation with a convergence study of both methods.",
      link: undefined,
      skills: ["Python", "NumPy", "SciPy"],
      details:
        "We developed a closed form for two insurance products, the Guaranteed Minimum Accumulation Benefit (GMAB) and the Guaranteed Minimum Death Benefit (GMDB) — contracts that offer a minimum guaranteed accumulation amount regardless of the performance of the underlying. After deriving the analytical price in full, we computed the value of the products numerically with a binomial tree and a Monte Carlo simulation, and then studied the convergence of the two methods towards the closed-form result.",
      media: [
        {
          type: "video",
          src: "/projects/gmab_pricing.mp4",
        },
      ],
      report: "/projects/report_lactu.pdf",

    },
    {
      name: "Disease Detection – Machine Learning",
      description:
        "Detecting whether a patient suffers from a disease, first from tabular data and then by also exploiting one image per patient, through feature selection and a comparison of XGBoost, Random Forest and an MLP.",
      link: undefined,
      skills: ["Python", "scikit-learn", "XGBoost", "Pandas"],
      details:
        "This was probably my favourite project by far. The goal was to detect whether a patient was suffering from a disease, based first on tabular data but also by processing one image per patient. We proceeded step by step: selecting the relevant features, identifying the ones most correlated with the target, then looking for the non-linear relations between variables that a linear correlation cannot capture. On this basis we trained and compared the relevant machine learning models — XGBoost, Random Forest and an MLP.",
      media: [
        {
          type: "image",
          src: "/projects/extreme_target_images.png",
        },
      ],
      report: "/projects/LELEC2870_Project (9).pdf",

    },
    {
      name: "Finite Element Analysis – 2D Linear Elasticity",
      description:
        "Finite element analysis written in C on top of the Gmsh library, built to answer one question: what would happen if cardboard were made of a hexagonal form instead of the usual corrugated waves?",
      link: "https://github.com/DewellGuerand/Finite-Element-Project",
      skills: ["C", "Python", "Gmsh"],
      details:
        "We implemented, based on the Gmsh library, a finite element analysis in C to answer one question: what would happen if cardboard were made of a hexagonal form rather than the usual corrugated waves? The application covers the whole chain for the underlying 2D linear elasticity problem — meshing the hexagonal geometry, assembling and solving the global stiffness system, and visualising the resulting displacement and stress fields — so that the deformation of the structure under load can be compared with the classical design.",
      media: [
        {
          type: "video",
          src: "/projects/video_hex (4).mp4",
        },
      ],
      report: "/projects/finite-element-report.pdf",
    },
    {
      name: "Lorenz Particle Filter",
      description:
        "SIR particle filter estimating the state of a particle following the chaotic Lorenz dynamics from noisy observations, with a comparison of three resampling schemes and an RMSE study over repeated runs.",
      link: "https://github.com/DewellGuerand/Stochastic-Processes-Project",
      skills: ["Python", "NumPy", "SciPy", "Matplotlib"],
      details:
        "The goal was to estimate the state of a particle following the Lorenz dynamics $$\\dot{x} = \\sigma(y - x), \\quad \\dot{y} = x(\\rho - z) - y, \\quad \\dot{z} = xy - \\beta z$$ (with $\\sigma = 10$, $\\rho = 28$, $\\beta = 8/3$) using only observations of its position corrupted by Gaussian noise. We implemented a SIR (Sequential Importance Resampling) particle filter: the particles are propagated through the dynamics with a fourth-order Runge-Kutta step, weighted by the likelihood of the current observation, and then resampled. We coded three resampling schemes — multinomial, residual and systematic — plus a baseline without any resampling, and studied how the filter reacts to the process noise, the time step, the number of particles and the observation noise. The comparison was finally made quantitative by computing the distribution of the RMSE over 50 runs for each resampling method.",
      media: [
        {
          type: "video",
          src: "/projects/LorenzAttractor.mp4",
        },
      ],
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
