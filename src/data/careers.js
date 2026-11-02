// Career dataset used for tag + free-text matching in the Career Guidance module.
export const CAREERS = [
    {
      name: "AI Engineer",
      tags: ["Data & Analytics", "Technology", "Engineering"],
      keywords: ["ai", "machine learning", "model", "algorithm", "python", "neural", "predict", "automation"],
      desc: "Builds and trains machine learning models that power intelligent products.",
      skills: ["Python", "Machine Learning", "Data Structures", "MLOps"],
      resources: [
        { title: "Machine Learning Specialization", plat: "Coursera" },
        { title: "Deep Learning with Python", plat: "Book / O'Reilly" },
        { title: "fast.ai Practical Deep Learning", plat: "fast.ai" }
      ]
    },
    {
      name: "Data Analyst",
      tags: ["Data & Analytics", "Business"],
      keywords: ["data", "spreadsheet", "trend", "numbers", "dashboard", "excel", "pattern", "report"],
      desc: "Turns raw data into dashboards and decisions that guide a business.",
      skills: ["SQL", "Excel", "Statistics", "Data Visualization"],
      resources: [
        { title: "Google Data Analytics Certificate", plat: "Coursera" },
        { title: "SQL for Data Analysis", plat: "Udacity" },
        { title: "Storytelling with Data", plat: "Book" }
      ]
    },
    {
      name: "UX Designer",
      tags: ["Design", "Arts", "Technology"],
      keywords: ["design", "visual", "sketch", "user experience", "creative", "interface", "aesthetic", "draw"],
      desc: "Designs digital products that are usable, accessible, and pleasant to use.",
      skills: ["Figma", "User Research", "Prototyping", "Visual Design"],
      resources: [
        { title: "Google UX Design Certificate", plat: "Coursera" },
        { title: "Don't Make Me Think", plat: "Book" },
        { title: "Figma for Beginners", plat: "YouTube" }
      ]
    },
    {
      name: "Software Engineer",
      tags: ["Engineering", "Technology"],
      keywords: ["code", "coding", "build", "app", "software", "debug", "fix", "program", "broke"],
      desc: "Designs and builds the systems and applications that run everything else.",
      skills: ["Data Structures & Algorithms", "System Design", "Git", "OOP"],
      resources: [
        { title: "CS50: Intro to Computer Science", plat: "Harvard / edX" },
        { title: "Grokking the System Design Interview", plat: "Educative" },
        { title: "The Odin Project", plat: "theodinproject.com" }
      ]
    },
    {
      name: "Healthcare Professional",
      tags: ["Healthcare"],
      keywords: ["patient", "medicine", "care", "clinical", "body", "diagnose", "help people", "hospital"],
      desc: "Works directly with patients, diagnostics, or clinical research.",
      skills: ["Biology", "Anatomy", "Patient Care", "Clinical Research"],
      resources: [
        { title: "Introduction to Human Physiology", plat: "Coursera" },
        { title: "Anatomy & Physiology", plat: "Khan Academy" },
        { title: "Clinical Research Basics", plat: "edX" }
      ]
    },
    {
      name: "Teacher / Educator",
      tags: ["Education"],
      keywords: ["teach", "explain", "mentor", "students", "learning", "classroom", "guide", "lesson"],
      desc: "Designs lessons and guides students through a subject over time.",
      skills: ["Curriculum Design", "Communication", "Classroom Management", "Assessment Design"],
      resources: [
        { title: "Foundations of Teaching for Learning", plat: "Coursera" },
        { title: "Teach Like a Champion", plat: "Book" },
        { title: "Instructional Design Basics", plat: "edX" }
      ]
    },
    {
      name: "Business Analyst",
      tags: ["Business", "Data & Analytics"],
      keywords: ["strategy", "market", "research", "business", "decision", "growth", "operations"],
      desc: "Bridges data and strategy, turning research into business decisions.",
      skills: ["Market Research", "Excel", "Communication", "Strategy"],
      resources: [
        { title: "Business Analytics Specialization", plat: "Coursera" },
        { title: "Case Interview Prep", plat: "PrepLounge" },
        { title: "Lean Analytics", plat: "Book" }
      ]
    },
    {
      name: "Product Manager",
      tags: ["Business", "Technology", "Design"],
      keywords: ["roadmap", "priorities", "vision", "coordinate", "users", "launch", "balance", "decide"],
      desc: "Decides what gets built, balancing user needs, tech limits, and business goals.",
      skills: ["Roadmapping", "User Research", "Communication", "Analytics"],
      resources: [
        { title: "Digital Product Management", plat: "Coursera" },
        { title: "Inspired", plat: "Book" },
        { title: "Product School Basics", plat: "productschool.com" }
      ]
    },
    {
      name: "Aerospace Engineer",
      tags: ["Science", "Engineering", "Technology"],
      keywords: ["space", "rocket", "astronomy", "satellite", "orbit", "planets", "stars", "universe", "nasa", "spacecraft", "aircraft", "flight", "galaxy"],
      desc: "Designs the vehicles and systems that fly through the atmosphere and beyond it.",
      skills: ["Physics", "CAD", "Fluid Dynamics", "Propulsion Systems"],
      resources: [
        { title: "Introduction to Aerospace Engineering", plat: "edX / TU Delft" },
        { title: "Astronautics: The Modern Aerospace Vehicle", plat: "MIT OpenCourseWare" },
        { title: "NASA STEM Resources", plat: "nasa.gov" }
      ]
    },
    {
      name: "Research Scientist",
      tags: ["Science", "Data & Analytics"],
      keywords: ["research", "experiment", "lab", "hypothesis", "discovery", "chemistry", "biology", "physics", "study", "curious"],
      desc: "Designs experiments and studies to answer open questions in a field.",
      skills: ["Experimental Design", "Statistical Analysis", "Scientific Writing", "Lab Techniques"],
      resources: [
        { title: "How to Do Research", plat: "MIT OpenCourseWare" },
        { title: "Coursera Research Methods Specialization", plat: "Coursera" },
        { title: "The Craft of Research", plat: "Book" }
      ]
    },
    {
      name: "Environmental Scientist",
      tags: ["Science", "Healthcare"],
      keywords: ["environment", "climate", "sustainability", "ecology", "nature", "conservation", "earth", "wildlife", "pollution"],
      desc: "Studies natural systems and helps organizations act on climate and conservation.",
      skills: ["Data Collection", "GIS Mapping", "Environmental Policy", "Fieldwork"],
      resources: [
        { title: "Environmental Science Specialization", plat: "Coursera" },
        { title: "Introduction to Sustainability", plat: "edX" },
        { title: "Silent Spring", plat: "Book" }
      ]
    },
    {
      name: "Psychologist / Counselor",
      tags: ["Healthcare", "Education"],
      keywords: ["mind", "behavior", "therapy", "emotions", "counseling", "mental health", "people", "listen", "wellbeing"],
      desc: "Helps people understand their thoughts, emotions, and behavior, one on one or in groups.",
      skills: ["Active Listening", "Psychological Assessment", "Counseling Techniques", "Case Notes"],
      resources: [
        { title: "Introduction to Psychology", plat: "Yale / Coursera" },
        { title: "The Body Keeps the Score", plat: "Book" },
        { title: "Counseling Skills Basics", plat: "edX" }
      ]
    },
    {
      name: "Journalist / Writer",
      tags: ["Arts", "Business"],
      keywords: ["writing", "storytelling", "journalism", "news", "media", "words", "narrative", "interview", "reporting"],
      desc: "Investigates, reports, and shapes stories that inform or move an audience.",
      skills: ["Reporting", "Interviewing", "Editing", "Narrative Structure"],
      resources: [
        { title: "Journalism Skills for Engaged Citizens", plat: "Coursera" },
        { title: "On Writing Well", plat: "Book" },
        { title: "Poynter News University", plat: "poynter.org" }
      ]
    },
    {
      name: "Architect",
      tags: ["Design", "Engineering", "Science"],
      keywords: ["buildings", "architecture", "structures", "blueprint", "spaces", "construction", "urban", "city"],
      desc: "Designs buildings and spaces that balance form, structure, and how people use them.",
      skills: ["CAD / BIM", "Structural Basics", "Spatial Design", "Building Codes"],
      resources: [
        { title: "Introduction to Architectural Design", plat: "Coursera" },
        { title: "How Buildings Work", plat: "Book" },
        { title: "Autodesk Architecture Fundamentals", plat: "Autodesk" }
      ]
    },
    {
      name: "Marketing Specialist",
      tags: ["Business", "Arts"],
      keywords: ["branding", "advertising", "campaign", "social media", "marketing", "audience", "content", "promote"],
      desc: "Shapes how a brand is seen and reaches the people it's trying to reach.",
      skills: ["Content Strategy", "Analytics", "Copywriting", "Campaign Planning"],
      resources: [
        { title: "Digital Marketing Specialization", plat: "Coursera" },
        { title: "Made to Stick", plat: "Book" },
        { title: "HubSpot Academy", plat: "hubspot.com" }
      ]
    },
    {
      name: "Lawyer",
      tags: ["Law", "Business"],
      keywords: ["law", "legal", "justice", "argue", "case", "rights", "contract", "court", "debate"],
      desc: "Advises clients and argues cases, drawing on law, precedent, and persuasion.",
      skills: ["Legal Research", "Argumentation", "Contract Analysis", "Writing"],
      resources: [
        { title: "Introduction to Law and Legal Reasoning", plat: "edX" },
        { title: "Thinking Like a Lawyer", plat: "Book" },
        { title: "LSAT Logical Reasoning Basics", plat: "Khan Academy" }
      ]
    },
    {
      name: "Civil Engineer",
      tags: ["Engineering", "Construction", "Science"],
      keywords: ["buildings", "bridges", "roads", "infrastructure", "construction", "structures", "concrete", "urban", "site"],
      desc: "Plans and builds the roads, bridges, and structures a city depends on.",
      skills: ["Structural Analysis", "AutoCAD", "Surveying", "Project Management"],
      resources: [
        { title: "Introduction to Civil Engineering", plat: "edX" },
        { title: "Structures: Or Why Things Don't Fall Down", plat: "Book" },
        { title: "Autodesk Civil 3D Basics", plat: "Autodesk" }
      ]
    },
    {
      name: "Marine Biologist / Oceanographer",
      tags: ["Science", "Environment & Water"],
      keywords: ["ocean", "water", "marine", "sea", "fish", "coral", "aquatic", "tides", "waves", "diving", "reef", "underwater"],
      desc: "Studies life and physical processes in oceans, rivers, and other water bodies.",
      skills: ["Field Sampling", "Marine Ecology", "Data Analysis", "Scuba / Fieldwork"],
      resources: [
        { title: "Introduction to Marine Biology", plat: "Coursera" },
        { title: "Oceanography: A Global Perspective", plat: "edX" },
        { title: "The Sea Around Us", plat: "Book" }
      ]
    },
    {
      name: "Water Resource Engineer",
      tags: ["Engineering", "Environment & Water", "Construction"],
      keywords: ["water", "irrigation", "dam", "reservoir", "hydraulics", "sanitation", "supply", "wastewater", "hydrology", "rivers", "plumbing", "drainage"],
      desc: "Designs the systems that supply clean water and manage rivers, dams, and drainage.",
      skills: ["Hydrology", "Hydraulic Modeling", "GIS", "Environmental Regulations"],
      resources: [
        { title: "Water Resource Management", plat: "Coursera" },
        { title: "Introduction to Hydrology", plat: "edX" },
        { title: "World Bank Water Resources Resources", plat: "worldbank.org" }
      ]
    },
    {
      name: "Agricultural Scientist",
      tags: ["Agriculture", "Science"],
      keywords: ["farming", "crops", "soil", "agriculture", "plants", "livestock", "harvest", "farm", "cultivation", "seeds", "botany"],
      desc: "Researches how to grow crops and raise livestock more sustainably and productively.",
      skills: ["Soil Science", "Plant Biology", "Field Trials", "Data Analysis"],
      resources: [
        { title: "Sustainable Agricultural Land Management", plat: "Coursera" },
        { title: "Principles of Agronomy", plat: "edX" },
        { title: "FAO Agriculture Resources", plat: "fao.org" }
      ]
    },
    {
      name: "Agricultural Engineer",
      tags: ["Agriculture", "Engineering"],
      keywords: ["farm equipment", "irrigation systems", "machinery", "agri-tech", "tractors", "farming technology"],
      desc: "Designs the machinery and systems that make farming more efficient.",
      skills: ["Mechanical Design", "Irrigation Systems", "Farm Automation", "CAD"],
      resources: [
        { title: "Agricultural Engineering Fundamentals", plat: "edX" },
        { title: "Precision Agriculture Basics", plat: "Coursera" },
        { title: "ASABE Learning Resources", plat: "asabe.org" }
      ]
    },
    {
      name: "Veterinarian",
      tags: ["Healthcare", "Agriculture"],
      keywords: ["animals", "pets", "vet", "livestock", "wildlife", "veterinary", "dogs", "cats", "farm animals"],
      desc: "Diagnoses and treats animals, from household pets to livestock and wildlife.",
      skills: ["Animal Physiology", "Diagnostics", "Surgery Basics", "Client Communication"],
      resources: [
        { title: "Animal Behaviour and Welfare", plat: "Coursera" },
        { title: "Introduction to Veterinary Medicine", plat: "edX" },
        { title: "AVMA Career Resources", plat: "avma.org" }
      ]
    },
    {
      name: "Chef / Culinary Professional",
      tags: ["Hospitality", "Arts"],
      keywords: ["cooking", "food", "kitchen", "recipe", "cuisine", "culinary", "baking", "restaurant", "chef", "flavors"],
      desc: "Turns ingredients into dishes, running a kitchen or building a menu from scratch.",
      skills: ["Knife Skills", "Menu Planning", "Food Safety", "Kitchen Management"],
      resources: [
        { title: "The Basics of Cooking", plat: "Coursera" },
        { title: "Salt, Fat, Acid, Heat", plat: "Book" },
        { title: "Culinary Institute of America Resources", plat: "ciachef.edu" }
      ]
    },
    {
      name: "Hospitality & Tourism Manager",
      tags: ["Hospitality", "Business"],
      keywords: ["hotel", "guests", "hospitality", "travel", "tourism", "service", "events", "resort"],
      desc: "Runs the operations behind hotels, resorts, and travel experiences.",
      skills: ["Guest Relations", "Operations Management", "Event Planning", "Budgeting"],
      resources: [
        { title: "Hospitality Management Fundamentals", plat: "Coursera" },
        { title: "Setting the Table", plat: "Book" },
        { title: "Cornell Hospitality Insights", plat: "cornell.edu" }
      ]
    },
    {
      name: "Financial Analyst / Accountant",
      tags: ["Finance", "Business", "Data & Analytics"],
      keywords: ["money", "finance", "accounting", "investment", "budget", "numbers", "stocks", "taxes", "financial"],
      desc: "Tracks, models, and advises on where an organization's money should go.",
      skills: ["Financial Modeling", "Accounting Principles", "Excel", "Valuation"],
      resources: [
        { title: "Introduction to Corporate Finance", plat: "Coursera" },
        { title: "Financial Accounting Fundamentals", plat: "edX" },
        { title: "CFA Institute Learning Resources", plat: "cfainstitute.org" }
      ]
    },
    {
      name: "Economist",
      tags: ["Finance", "Science", "Government"],
      keywords: ["economy", "markets", "policy", "inflation", "trade", "economics", "supply and demand"],
      desc: "Studies how markets, policy, and resources shape economic outcomes.",
      skills: ["Econometrics", "Statistical Modeling", "Policy Analysis", "Research"],
      resources: [
        { title: "Principles of Microeconomics", plat: "Coursera" },
        { title: "Freakonomics", plat: "Book" },
        { title: "World Bank Open Learning Campus", plat: "worldbank.org" }
      ]
    },
    {
      name: "Civil Servant / Policy Analyst",
      tags: ["Government", "Law", "Business"],
      keywords: ["policy", "government", "public service", "administration", "civic", "governance", "public sector"],
      desc: "Shapes and implements the policies that public institutions run on.",
      skills: ["Policy Research", "Public Administration", "Stakeholder Communication", "Report Writing"],
      resources: [
        { title: "Introduction to Public Policy", plat: "Coursera" },
        { title: "Public Administration Essentials", plat: "edX" },
        { title: "Harvard Kennedy School Insights", plat: "hks.harvard.edu" }
      ]
    },
    {
      name: "Social Worker",
      tags: ["Healthcare", "Government", "Education"],
      keywords: ["community", "welfare", "social work", "support", "advocacy", "family", "help people"],
      desc: "Supports individuals and families through hardship, connecting them to resources.",
      skills: ["Case Management", "Active Listening", "Crisis Intervention", "Community Resources"],
      resources: [
        { title: "Social Work Practice Fundamentals", plat: "Coursera" },
        { title: "Introduction to Social Work", plat: "edX" },
        { title: "NASW Career Resources", plat: "socialworkers.org" }
      ]
    },
    {
      name: "Human Resources Manager",
      tags: ["Business", "Education"],
      keywords: ["hiring", "people", "culture", "recruitment", "employees", "workplace", "hr", "team"],
      desc: "Builds the systems and culture that help people do their best work.",
      skills: ["Recruitment", "Employee Relations", "Performance Management", "Communication"],
      resources: [
        { title: "Human Resource Management: HR for People Managers", plat: "Coursera" },
        { title: "Drive", plat: "Book" },
        { title: "SHRM Learning Resources", plat: "shrm.org" }
      ]
    },
    {
      name: "Fitness Trainer / Sports Coach",
      tags: ["Sports & Fitness", "Healthcare"],
      keywords: ["fitness", "sports", "training", "exercise", "athlete", "coaching", "gym", "wellness", "strength"],
      desc: "Builds training programs and coaches people or teams toward performance goals.",
      skills: ["Exercise Science", "Program Design", "Nutrition Basics", "Motivation & Coaching"],
      resources: [
        { title: "Science of Exercise", plat: "Coursera" },
        { title: "Periodization Training Basics", plat: "NASM" },
        { title: "ACE Fitness Resources", plat: "acefitness.org" }
      ]
    },
    {
      name: "Physiotherapist / Sports Scientist",
      tags: ["Sports & Fitness", "Healthcare", "Science"],
      keywords: ["physiotherapy", "rehabilitation", "movement", "injury", "muscles", "recovery", "physical therapy"],
      desc: "Helps people recover movement and strength after injury or surgery.",
      skills: ["Anatomy", "Rehabilitation Techniques", "Movement Assessment", "Patient Care"],
      resources: [
        { title: "Musculoskeletal Physiotherapy", plat: "Coursera" },
        { title: "Introduction to Sports Medicine", plat: "edX" },
        { title: "APTA Learning Center", plat: "apta.org" }
      ]
    },
    {
      name: "Musician / Performing Artist",
      tags: ["Performing Arts", "Arts"],
      keywords: ["music", "singing", "instrument", "performance", "stage", "dance", "theater", "band", "concert"],
      desc: "Creates and performs music, dance, or theatre for a live or recorded audience.",
      skills: ["Music Theory", "Performance Technique", "Stage Presence", "Composition"],
      resources: [
        { title: "Fundamentals of Music Theory", plat: "Coursera" },
        { title: "This Is Your Brain on Music", plat: "Book" },
        { title: "Berklee Online Resources", plat: "berklee.edu" }
      ]
    },
    {
      name: "Film / Video Producer",
      tags: ["Performing Arts", "Arts", "Technology"],
      keywords: ["film", "video", "movie", "camera", "editing", "production", "cinema", "director", "screenplay"],
      desc: "Turns a script or idea into a finished film or video, managing every stage of production.",
      skills: ["Video Editing", "Cinematography Basics", "Production Planning", "Storytelling"],
      resources: [
        { title: "Introduction to Film Production", plat: "Coursera" },
        { title: "Save the Cat", plat: "Book" },
        { title: "No Film School Resources", plat: "nofilmschool.com" }
      ]
    },
    {
      name: "Fashion Designer",
      tags: ["Design", "Arts"],
      keywords: ["fashion", "clothing", "style", "textile", "apparel", "sewing", "trends", "garment"],
      desc: "Designs clothing and accessories, from sketch to finished garment.",
      skills: ["Sketching", "Pattern Making", "Textiles", "Trend Research"],
      resources: [
        { title: "Fundamentals of Fashion Design", plat: "Coursera" },
        { title: "The Fashion Design Reference & Specification Book", plat: "Book" },
        { title: "Parsons School of Design Resources", plat: "parsons.edu" }
      ]
    },
    {
      name: "Pilot / Aviation Professional",
      tags: ["Engineering", "Science"],
      keywords: ["flying", "aviation", "aircraft", "pilot", "airplane", "cockpit", "flight"],
      desc: "Operates and navigates aircraft, trained for precision under pressure.",
      skills: ["Flight Navigation", "Aircraft Systems", "Situational Awareness", "Communication Protocols"],
      resources: [
        { title: "Introduction to Aviation", plat: "edX" },
        { title: "Stick and Rudder", plat: "Book" },
        { title: "FAA Pilot Training Resources", plat: "faa.gov" }
      ]
    },
    {
      name: "Electrical Engineer",
      tags: ["Engineering", "Technology"],
      keywords: ["electricity", "circuits", "power", "electronics", "wiring", "energy systems", "current", "voltage"],
      desc: "Designs the circuits and systems that generate, move, and use electrical power.",
      skills: ["Circuit Design", "Power Systems", "Electronics", "MATLAB"],
      resources: [
        { title: "Circuits and Electronics", plat: "MIT OpenCourseWare" },
        { title: "The Art of Electronics", plat: "Book" },
        { title: "IEEE Learning Resources", plat: "ieee.org" }
      ]
    },
    {
      name: "Chemical Engineer",
      tags: ["Engineering", "Science"],
      keywords: ["chemicals", "chemistry", "processes", "manufacturing", "materials", "reactions", "plant"],
      desc: "Designs the processes that turn raw materials into fuels, chemicals, and everyday products.",
      skills: ["Process Design", "Thermodynamics", "Materials Science", "Safety Engineering"],
      resources: [
        { title: "Chemical Engineering Process Fundamentals", plat: "edX" },
        { title: "Elementary Principles of Chemical Processes", plat: "Book" },
        { title: "AIChE Learning Resources", plat: "aiche.org" }
      ]
    },
    {
      name: "Renewable Energy Engineer",
      tags: ["Engineering", "Environment & Water", "Science"],
      keywords: ["solar", "wind", "energy", "renewable", "sustainability", "power grid", "clean energy"],
      desc: "Designs solar, wind, and other systems that generate power without fossil fuels.",
      skills: ["Energy Systems Design", "Sustainability Analysis", "Power Grid Basics", "Project Management"],
      resources: [
        { title: "Solar Energy Basics", plat: "Coursera" },
        { title: "Wind Energy Engineering", plat: "edX" },
        { title: "IRENA Learning Resources", plat: "irena.org" }
      ]
    },
    {
      name: "Robotics Engineer",
      tags: ["Engineering", "Technology", "Science"],
      keywords: ["robots", "robotics", "automation", "sensors", "mechatronics", "actuators", "autonomous"],
      desc: "Builds machines that sense, move, and act on their own in the physical world.",
      skills: ["Mechatronics", "Control Systems", "Programming", "Sensor Integration"],
      resources: [
        { title: "Robotics Specialization", plat: "Coursera" },
        { title: "Introduction to Robotics", plat: "Stanford / edX" },
        { title: "MIT Robotics Resources", plat: "mit.edu" }
      ]
    }
  ]

export const INTEREST_TAGS = [
  'Data & Analytics', 'Design', 'Healthcare', 'Engineering', 'Education', 'Business',
  'Technology', 'Arts', 'Science', 'Law', 'Agriculture', 'Environment & Water',
  'Construction', 'Finance', 'Government', 'Hospitality', 'Sports & Fitness', 'Performing Arts',
]

function textScore(career, text) {
  if (!text) return 0
  const lower = text.toLowerCase()
  let score = 0
  career.tags.forEach((t) => { if (lower.includes(t.toLowerCase())) score += 1 })
  ;(career.keywords || []).forEach((k) => { if (lower.includes(k)) score += 1 })
  return score
}

// Combines tag overlap with free-text keyword matches; each career's score is
// normalised against its own max possible signal so short and long tag lists
// compete fairly.
export function matchCareer(selectedTags, freeText) {
  let best = null
  let bestScore = -1
  let bestPct = 0
  CAREERS.forEach((c) => {
    const tagOverlap = c.tags.filter((t) => selectedTags.has(t)).length
    const written = textScore(c, freeText)
    const raw = tagOverlap + written
    const ceiling = c.tags.length + (c.keywords ? c.keywords.length : 0) + c.tags.length
    const pct = Math.min(100, Math.round((raw / ceiling) * 220))
    if (raw > bestScore || (raw === bestScore && pct > bestPct)) {
      bestScore = raw
      bestPct = pct
      best = c
    }
  })
  if (bestScore <= 0) return { career: CAREERS[0], pct: 0 }
  return { career: best, pct: bestPct }
}