// ============================================================
// Career Roadmaps Dataset & Generator
// Deep, realistic 5-phase career progression paths for tech,
// data, engineering, design, and business roles.
// ============================================================

export const ROADMAP_TEMPLATES = {
  'AI Engineer': [
    {
      id: 1,
      phase: 'Phase 1',
      title: 'Math Foundations & Python Mastery',
      timeEstimate: 'Weeks 1–4 • 8–10 hrs/week',
      desc: 'Master the computational and mathematical groundwork indispensable for modern machine learning, deep learning, and vector transformations.',
      competencies: ['Python 3.12+', 'NumPy Vectorization', 'Linear Algebra', 'Multivariate Calculus', 'Pandas EDA'],
      tasks: [
        { id: 'ai-1-1', text: 'Set up Python 3.12 development environment with uv/pip, Jupyter Lab, and VS Code.', tip: 'Use virtual environments to avoid global package pollution.' },
        { id: 'ai-1-2', text: 'Master NumPy broadcasting, multidimensional array operations, and matrix algebra.', tip: 'Practice vectorizing loops to understand GPU-compatible computations.' },
        { id: 'ai-1-3', text: 'Implement Gradient Descent and Linear Regression from scratch with pure NumPy.', tip: 'Derive partial derivatives on paper first.' },
        { id: 'ai-1-4', text: 'Perform exploratory data analysis and feature cleaning on 2 real datasets using Pandas.', tip: 'Check for missing data, outliers, and distribution skewness.' }
      ],
      project: {
        title: 'Exploratory Health & Academic Dataset Analyzer',
        desc: 'Interactive data pipeline that ingests raw tabular datasets, runs statistical distributions, and automates missing-value imputation.',
        stack: ['Python', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn']
      },
      resources: [
        { title: 'Mathematics for Machine Learning Specialization', plat: 'Coursera / Imperial College London', type: 'Course' },
        { title: 'Python for Data Analysis (3rd Edition)', plat: "O'Reilly Book by Wes McKinney", type: 'Book' },
        { title: '3Blue1Brown: Essence of Linear Algebra', plat: 'YouTube Series', type: 'Video' }
      ]
    },
    {
      id: 2,
      phase: 'Phase 2',
      title: 'Machine Learning Algorithms & Feature Engineering',
      timeEstimate: 'Weeks 5–8 • 10–12 hrs/week',
      desc: 'Build strong intuition across classical machine learning algorithms, validation strategies, feature transformations, and performance metrics.',
      competencies: ['Scikit-Learn', 'Feature Engineering', 'Classification & Regression', 'Ensemble Models (XGBoost)', 'Model Evaluation'],
      tasks: [
        { id: 'ai-2-1', text: 'Build modular Scikit-Learn pipelines with ColumnTransformer and StandardScaler.', tip: 'Never fit scalers on test data to avoid data leakage.' },
        { id: 'ai-2-2', text: 'Train and benchmark Random Forest, LightGBM, and XGBoost classifiers.', tip: 'Compare ROC-AUC, Precision-Recall curves, and confusion matrices.' },
        { id: 'ai-2-3', text: 'Conduct systematic hyperparameter optimization using Optuna and K-Fold CV.', tip: 'Use StratifiedKFold for imbalanced classification tasks.' },
        { id: 'ai-2-4', text: 'Wrap your trained ML model into an asynchronous FastAPI endpoint with Pydantic validation.', tip: 'Add latency logging and input schema enforcement.' }
      ],
      project: {
        title: 'Early Student Dropout Risk Prediction Service',
        desc: 'Production-ready ML classification service that predicts academic retention risk with confidence scores and feature importance.',
        stack: ['Scikit-Learn', 'XGBoost', 'FastAPI', 'Pydantic', 'Optuna']
      },
      resources: [
        { title: 'Machine Learning Specialization by Andrew Ng', plat: 'Coursera / DeepLearning.AI', type: 'Course' },
        { title: 'Hands-On Machine Learning with Scikit-Learn & PyTorch', plat: "O'Reilly Book by Aurélien Géron", type: 'Book' },
        { title: 'Kaggle: Intermediate Machine Learning & Feature Engineering', plat: 'Kaggle Learn', type: 'Interactive' }
      ]
    },
    {
      id: 3,
      phase: 'Phase 3',
      title: 'Deep Learning, PyTorch & Neural Architectures',
      timeEstimate: 'Weeks 9–14 • 12–14 hrs/week',
      desc: 'Dive into neural networks, backpropagation mechanics, convolutional layers, recurrent processing, and the Transformer self-attention architecture.',
      competencies: ['PyTorch', 'Backpropagation', 'CNNs & Vision', 'Attention & Transformers', 'TensorBoard / W&B'],
      tasks: [
        { id: 'ai-3-1', text: 'Implement a Multi-Layer Perceptron in raw PyTorch with custom Dataset and DataLoader.', tip: 'Verify gradient flow through all hidden layers.' },
        { id: 'ai-3-2', text: 'Train a Convolutional Neural Network (ResNet transfer learning) for image classification.', tip: 'Use data augmentation to combat overfitting on small datasets.' },
        { id: 'ai-3-3', text: 'Code Multi-Head Self-Attention from scratch to understand the Transformer backbone.', tip: 'Trace the Q, K, V tensor dimensions step by step.' },
        { id: 'ai-3-4', text: 'Fine-tune a pretrained HuggingFace Transformer model with LoRA / PEFT.', tip: 'Monitor GPU VRAM consumption with PyTorch profiler.' }
      ],
      project: {
        title: 'Multi-Modal Academic Note Summarizer & QA System',
        desc: 'Deep learning pipeline that extracts semantic embeddings from textbook slides and provides contextual question-answering.',
        stack: ['PyTorch', 'HuggingFace Transformers', 'LoRA', 'Weights & Biases', 'Gradio']
      },
      resources: [
        { title: 'Practical Deep Learning for Coders', plat: 'fast.ai / Jeremy Howard', type: 'Course' },
        { title: 'Deep Learning with PyTorch', plat: 'Manning Publications', type: 'Book' },
        { title: 'The Illustrated Transformer & Attention', plat: 'Jay Alammar Blog', type: 'Guide' }
      ]
    },
    {
      id: 4,
      phase: 'Phase 4',
      title: 'LLMs, RAG Architecture & MLOps Pipelines',
      timeEstimate: 'Weeks 15–18 • 10–12 hrs/week',
      desc: 'Master production generative AI: build high-yield Retrieval-Augmented Generation (RAG) engines, vector databases, and containerized MLOps workflows.',
      competencies: ['RAG Architectures', 'Vector Databases (Chroma/pgvector)', 'LangChain / LlamaIndex', 'Docker', 'MLOps & CI/CD'],
      tasks: [
        { id: 'ai-4-1', text: 'Build a hybrid RAG system with BM25 keyword matching + dense cosine vector search.', tip: 'Hybrid retrieval prevents hallucinations on rare domain terms.' },
        { id: 'ai-4-2', text: 'Implement document chunking strategies with semantic sentence boundaries and overlap.', tip: 'Benchmark 200-word vs 500-word chunks on retrieval accuracy.' },
        { id: 'ai-4-3', text: 'Containerize an ML inference microservice using multi-stage Docker builds.', tip: 'Keep container image lean by using slim Python base images.' },
        { id: 'ai-4-4', text: 'Set up automated CI/CD unit testing for model regression and latency thresholds.', tip: 'Add latency benchmarks before model weights merge.' }
      ],
      project: {
        title: 'Enterprise Neural RAG Workspace with Streaming Citations',
        desc: 'Production-ready knowledge retrieval assistant supporting multi-document grounding, citation highlights, and real-time token streaming.',
        stack: ['FastAPI', 'pgvector / Chroma', 'LangChain', 'Docker', 'React']
      },
      resources: [
        { title: 'Full Stack Deep Learning Course', plat: 'fullstackdeeplearning.com', type: 'Course' },
        { title: 'Designing Machine Learning Systems', plat: "O'Reilly Book by Chip Huyen", type: 'Book' },
        { title: 'DeepLearning.AI: Building Systems with the ChatGPT API', plat: 'Coursera', type: 'Short Course' }
      ]
    },
    {
      id: 5,
      phase: 'Phase 5',
      title: 'Capstone Engineering, ML System Design & Career Launch',
      timeEstimate: 'Weeks 19–24 • 8–10 hrs/week',
      desc: 'Synthesize your skills into an end-to-end production AI system, practice ML system design interview scenarios, and launch your job search.',
      competencies: ['ML System Design', 'High-Throughput Serving', 'Technical Storytelling', 'Behavioral STAR', 'Interview Drills'],
      tasks: [
        { id: 'ai-5-1', text: 'Deploy your capstone project live with public URL, API docs, and architecture diagram.', tip: 'Include a 90-second video demo in your GitHub README.' },
        { id: 'ai-5-2', text: 'Practice 4 full ML system design scenarios (Recommendation Engine, Search Ranking, RAG at scale).', tip: 'Focus on latency budget, data ingestion throughput, and fallback fallbacks.' },
        { id: 'ai-5-3', text: 'Complete 30 LeetCode Medium algorithmic problems focusing on graphs, DP, and heaps.', tip: 'Time yourself with 25-minute interview simulations.' },
        { id: 'ai-5-4', text: 'Polish your resume with quantifiable metrics (e.g., "Reduced latency 42%, improved F1 score to 0.91").', tip: 'Tailor resume bullets to mention exact frameworks used in target jobs.' }
      ],
      project: {
        title: 'Autonomous Multi-Agent Research Assistant',
        desc: 'Comprehensive multi-agent system that coordinates web search, code execution, document indexing, and synthesized report drafting.',
        stack: ['Python', 'FastAPI', 'LangGraph', 'Docker', 'AWS/GCP', 'PostgreSQL']
      },
      resources: [
        { title: 'Machine Learning System Design Interview', plat: 'Book by Ali Aminian & Alex Xu', type: 'Book' },
        { title: 'NeetCode 150 Coding Interview Roadmap', plat: 'neetcode.io', type: 'Interactive' },
        { title: 'Tech Interview Handbook: Behavioral & Technical Guide', plat: 'techinterviewhandbook.org', type: 'Guide' }
      ]
    }
  ],

  'Software Engineer': [
    {
      id: 1,
      phase: 'Phase 1',
      title: 'Programming Fundamentals, Git & Clean Code',
      timeEstimate: 'Weeks 1–4 • 8–10 hrs/week',
      desc: 'Solidify procedural, object-oriented, and asynchronous programming principles alongside modern version control workflows.',
      competencies: ['TypeScript / Modern JS', 'Git & GitHub Workflows', 'OOP & Modular Design', 'Unit Testing (Jest/Vitest)', 'Linux CLI'],
      tasks: [
        { id: 'swe-1-1', text: 'Master modern language constructs (closures, promises, async/await, interfaces, and destructuring).', tip: 'Write TypeScript with strict mode enabled.' },
        { id: 'swe-1-2', text: 'Learn advanced Git: branching, interactive rebasing, merge conflict resolution, and pull requests.', tip: 'Never commit directly to main; practice feature branches.' },
        { id: 'swe-1-3', text: 'Build a unit test suite reaching 85%+ branch coverage for core domain logic.', tip: 'Adopt Test-Driven Development (TDD) for utility modules.' },
        { id: 'swe-1-4', text: 'Configure ESLint, Prettier, and pre-commit Git hooks (Husky) to enforce clean code.', tip: 'Automated formatting saves hours during team code reviews.' }
      ],
      project: {
        title: 'Robust Command-Line Workflow Manager with Test Suite',
        desc: 'CLI tool that organizes developer tasks, validates project structures, and runs automated checks with comprehensive unit tests.',
        stack: ['Node.js', 'TypeScript', 'Vitest', 'Commander.js', 'Git']
      },
      resources: [
        { title: 'CS50: Introduction to Computer Science', plat: 'Harvard / edX', type: 'Course' },
        { title: 'Clean Code: A Handbook of Agile Software Craftsmanship', plat: 'Book by Robert C. Martin', type: 'Book' },
        { title: 'The Odin Project: Foundations Track', plat: 'theodinproject.com', type: 'Interactive' }
      ]
    },
    {
      id: 2,
      phase: 'Phase 2',
      title: 'Data Structures & Algorithmic Problem Solving',
      timeEstimate: 'Weeks 5–8 • 10–12 hrs/week',
      desc: 'Master computational complexity analysis (Big-O) and implement fundamental data structures from scratch.',
      competencies: ['Arrays & Hash Maps', 'Two Pointers & Sliding Window', 'Linked Lists & Trees', 'Graphs (BFS/DFS)', 'Dynamic Programming'],
      tasks: [
        { id: 'swe-2-1', text: 'Solve 60+ fundamental LeetCode Easy/Medium problems across core patterns.', tip: 'Master patterns (Sliding Window, Fast/Slow Pointers, Top-K elements) rather than memorizing questions.' },
        { id: 'swe-2-2', text: 'Implement Binary Search Trees, Tries, and Graph traversals (BFS/DFS) from scratch.', tip: 'Draw tree/graph recursion trees on paper before coding.' },
        { id: 'swe-2-3', text: 'Analyze time and space complexity for all algorithms, identifying optimal Big-O bounds.', tip: 'Explain trade-offs out loud as if in an interview.' },
        { id: 'swe-2-4', text: 'Participate in 2 timed algorithmic contests to build speed under pressure.', tip: 'Learn to debug with print statements and systematic dry-runs.' }
      ],
      project: {
        title: 'Interactive Algorithm & Pathfinding Visualizer',
        desc: 'Visual browser application simulating Dijkstra, A*, and BFS maze-solving with speed controls and obstacle generators.',
        stack: ['React', 'TypeScript', 'HTML5 Canvas', 'Tailwind CSS']
      },
      resources: [
        { title: 'Grokking the Coding Interview: Patterns for Coding Questions', plat: 'Educative / Design Gurus', type: 'Course' },
        { title: 'Algorithms (4th Edition)', plat: 'Book by Robert Sedgewick', type: 'Book' },
        { title: 'NeetCode Roadmap & Video Explanations', plat: 'neetcode.io', type: 'Video' }
      ]
    },
    {
      id: 3,
      phase: 'Phase 3',
      title: 'Full-Stack Web Architecture & Relational Databases',
      timeEstimate: 'Weeks 9–14 • 12–14 hrs/week',
      desc: 'Design and build resilient full-stack systems: REST APIs, normalized relational databases, secure authentication, and reactive interfaces.',
      competencies: ['React / Next.js', 'Node.js & Express', 'PostgreSQL & SQL Schema Design', 'JWT & Secure Cookie Auth', 'REST & GraphQL'],
      tasks: [
        { id: 'swe-3-1', text: 'Design normalized 3NF PostgreSQL database schemas with foreign keys, indexes, and constraints.', tip: 'Add indexes on foreign keys and frequently filtered columns.' },
        { id: 'swe-3-2', text: 'Build secure RESTful endpoints with input validation (Zod/Joi), CORS, and HTTP-only cookie auth.', tip: 'Never store sensitive JWT tokens in localStorage.' },
        { id: 'swe-3-3', text: 'Implement responsive UI components with clean state management and accessible semantics.', tip: 'Use keyboard navigation and ARIA labels.' },
        { id: 'swe-3-4', text: 'Implement database transactions to guarantee ACID compliance during multi-step operations.', tip: 'Wrap balance transfers or account creations in BEGIN/COMMIT blocks.' }
      ],
      project: {
        title: 'Full-Stack Collaborative Workspace Platform',
        desc: 'End-to-end multi-user web application with real-time updates, role-based access control, and PostgreSQL database persistence.',
        stack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS']
      },
      resources: [
        { title: 'Full Stack Open', plat: 'University of Helsinki', type: 'Course' },
        { title: 'SQL and Relational Theory', plat: "O'Reilly Book by C.J. Date", type: 'Book' },
        { title: 'React Documentation & Interactive Tutorials', plat: 'react.dev', type: 'Documentation' }
      ]
    },
    {
      id: 4,
      phase: 'Phase 4',
      title: 'System Design, Microservices, Caching & Cloud Infrastructure',
      timeEstimate: 'Weeks 15–18 • 10–12 hrs/week',
      desc: 'Scale applications to handle real-world load with caching, asynchronous queues, containerization, and cloud deployment.',
      competencies: ['System Design Principles', 'Redis In-Memory Caching', 'Docker & Container Orchestration', 'CI/CD Pipelines', 'Cloud Deployment'],
      tasks: [
        { id: 'swe-4-1', text: 'Integrate Redis caching to reduce database read latency for high-traffic endpoints by 80%+.', tip: 'Implement Cache-Aside pattern with sensible TTL expiration.' },
        { id: 'swe-4-2', text: 'Dockerize frontend and backend microservices with multi-stage builds and Docker Compose.', tip: 'Keep container build steps ordered from least to most frequently modified.' },
        { id: 'swe-4-3', text: 'Set up GitHub Actions CI/CD to run linter, tests, and automated deployment on every commit.', tip: 'Enforce branch protection rules requiring passing checks.' },
        { id: 'swe-4-4', text: 'Design architecture diagrams for scalable systems: load balancers, database replicas, and queues.', tip: 'Identify single points of failure (SPOF) and plan redundancy.' }
      ],
      project: {
        title: 'High-Performance URL Shortener & Analytics Gateway',
        desc: 'Production-ready URL shortener handling high throughput with Redis caching, rate limiting, and geo-analytics dashboards.',
        stack: ['Node.js', 'Redis', 'PostgreSQL', 'Docker', 'GitHub Actions']
      },
      resources: [
        { title: 'Designing Data-Intensive Applications', plat: "O'Reilly Book by Martin Kleppmann", type: 'Book' },
        { title: 'Grokking the System Design Interview', plat: 'Educative.io', type: 'Course' },
        { title: 'System Design Primer Repository', plat: 'GitHub by Donne Martin', type: 'Repository' }
      ]
    },
    {
      id: 5,
      phase: 'Phase 5',
      title: 'Capstone Polish, Technical Interviews & Job Acquisition',
      timeEstimate: 'Weeks 19–24 • 8–10 hrs/week',
      desc: 'Prepare for live coding and behavioral interviews, optimize your engineering portfolio, and target high-yield applications.',
      competencies: ['Live Coding Interviews', 'Behavioral STAR Framework', 'Resume & GitHub Showcase', 'Offer Negotiation', 'Continuous Learning'],
      tasks: [
        { id: 'swe-5-1', text: 'Deploy your capstone project with a custom domain, SSL certification, and live API documentation.', tip: 'Recruiters and engineers love clicking real, functioning URLs.' },
        { id: 'swe-5-2', text: 'Conduct 5 mock coding interviews simulating real FAANG / top-tier hiring environments.', tip: 'Practice talking through your thought process before writing any code.' },
        { id: 'swe-5-3', text: 'Draft 6 STAR-method behavioral stories highlighting technical conflict, leadership, and impact.', tip: 'Quantify your impact with business or technical metrics.' },
        { id: 'swe-5-4', text: 'Submit 10 targeted job applications weekly, pairing each with a tailored outreach message.', tip: 'Reach out directly to engineering managers or senior developers.' }
      ],
      project: {
        title: 'Production Multi-Tenant SaaS Engine with Billing & Webhooks',
        desc: 'Complete software product with user authentication, team organization workspaces, audit logs, and integrated webhook events.',
        stack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS']
      },
      resources: [
        { title: 'Cracking the Coding Interview (6th Edition)', plat: 'Book by Gayle Laakmann McDowell', type: 'Book' },
        { title: 'Tech Interview Handbook', plat: 'techinterviewhandbook.org', type: 'Guide' },
        { title: 'Pramp / Interviewing.io Mock Interviews', plat: 'Pramp.com', type: 'Interactive' }
      ]
    }
  ],

  'Data Analyst': [
    {
      id: 1,
      phase: 'Phase 1',
      title: 'Spreadsheet Mastery, SQL Foundations & Data Literacy',
      timeEstimate: 'Weeks 1–4 • 8–10 hrs/week',
      desc: 'Learn the analytical bedrock: formulas, pivot tables, data normalization, and fundamental SQL querying.',
      competencies: ['Advanced Excel / Google Sheets', 'Basic & Intermediate SQL', 'Data Hygiene', 'Descriptive Statistics', 'Business Logic'],
      tasks: [
        { id: 'da-1-1', text: 'Master Excel lookup formulas (XLOOKUP, INDEX/MATCH), dynamic arrays, and Pivot Tables.', tip: 'Learn keyboard shortcuts to navigate huge spreadsheets quickly.' },
        { id: 'da-1-2', text: 'Write SQL queries using SELECT, WHERE, GROUP BY, HAVING, and basic aggregation functions.', tip: 'Always verify row counts before and after filtering.' },
        { id: 'da-1-3', text: 'Clean messy real-world survey and transaction data, removing duplicates and formatting errors.', tip: 'Document every cleaning transformation in your audit trail.' },
        { id: 'da-1-4', text: 'Calculate key descriptive statistics: mean, median, IQR, variance, and standard deviation.', tip: 'Use median for skewed distributions like income or response times.' }
      ],
      project: {
        title: 'Retail Store Sales Performance & Margin Analyzer',
        desc: 'Spreadsheet and SQL-powered model analyzing quarterly sales, profit margins, and regional sales rep quotas.',
        stack: ['Excel', 'SQL', 'PostgreSQL']
      },
      resources: [
        { title: 'Google Data Analytics Professional Certificate', plat: 'Coursera', type: 'Course' },
        { title: 'Storytelling with Data: A Data Visualization Guide', plat: 'Book by Cole Nussbaumer Knaflic', type: 'Book' },
        { title: 'Mode Analytics SQL Tutorial', plat: 'mode.com', type: 'Interactive' }
      ]
    },
    {
      id: 2,
      phase: 'Phase 2',
      title: 'Advanced SQL, Relational Modeling & Complex Queries',
      timeEstimate: 'Weeks 5–8 • 10–12 hrs/week',
      desc: 'Construct sophisticated queries using Window Functions, CTEs, subqueries, and multi-table joins.',
      competencies: ['SQL Window Functions', 'Common Table Expressions (CTEs)', 'Complex Joins (Self/Cross)', 'Data Modeling', 'Query Optimization'],
      tasks: [
        { id: 'da-2-1', text: 'Master SQL Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), and LAG()/LEAD().', tip: 'Essential for running totals, cohort churn, and period-over-period comparisons.' },
        { id: 'da-2-2', text: 'Structure multi-level queries using CTEs for readable, maintainable data pipelines.', tip: 'CTEs make nested logic significantly easier to debug than subqueries.' },
        { id: 'da-2-3', text: 'Build cohort retention analysis models calculating monthly user retention rates.', tip: 'Group users by acquisition month and trace retention curves over 12 months.' },
        { id: 'da-2-4', text: 'Learn EXPLAIN ANALYZE to optimize sluggish queries and identify missing indexes.', tip: 'Avoid SELECT * on million-row tables.' }
      ],
      project: {
        title: 'SaaS Customer Cohort Churn & Lifetime Value Engine',
        desc: 'Advanced SQL suite analyzing subscription churn, monthly recurring revenue (MRR), and customer lifetime value (LTV).',
        stack: ['PostgreSQL', 'Advanced SQL', 'Window Functions', 'DB Fiddle']
      },
      resources: [
        { title: 'SQL for Data Analysis', plat: 'Book by Cathy Tanimura', type: 'Book' },
        { title: 'DataCamp: Advanced SQL Queries & Window Functions', plat: 'DataCamp', type: 'Interactive' },
        { title: 'LeetCode Database 50 Challenges', plat: 'leetcode.com', type: 'Practice' }
      ]
    },
    {
      id: 3,
      phase: 'Phase 3',
      title: 'Business Intelligence & Interactive Dashboards (Tableau/Power BI)',
      timeEstimate: 'Weeks 9–14 • 10–12 hrs/week',
      desc: 'Transform raw SQL queries into executive-ready dashboards with interactive filters and clear visual hierarchies.',
      competencies: ['Tableau / Power BI', 'Data Storytelling', 'KPI Dashboard Design', 'DAX / Calculated Fields', 'User Experience for Data'],
      tasks: [
        { id: 'da-3-1', text: 'Design an interactive Tableau or Power BI dashboard with dynamic parameter controls.', tip: 'Limit dashboards to 4-5 focused charts to prevent cognitive overload.' },
        { id: 'da-3-2', text: 'Create DAX formulas or Tableau calculated fields for MoM growth and Year-to-Date metrics.', tip: 'Document calculation logic clearly in data dictionary notes.' },
        { id: 'da-3-3', text: 'Select appropriate chart types: bar charts for comparisons, line charts for trends, scatter for correlation.', tip: 'Avoid pie charts with more than 3 categories.' },
        { id: 'da-3-4', text: 'Publish interactive dashboard to Tableau Public or Power BI Service with public access.', tip: 'Include instructions on how stakeholders should filter and interpret data.' }
      ],
      project: {
        title: 'Executive Business Operations & Growth Command Center',
        desc: 'Interactive business dashboard highlighting customer acquisition cost, conversion funnels, and revenue targets.',
        stack: ['Tableau Public', 'Power BI', 'SQL', 'Figma (for layout)']
      },
      resources: [
        { title: 'Tableau for Data Science Specialization', plat: 'Coursera / UC Davis', type: 'Course' },
        { title: 'The Big Book of Dashboards', plat: 'Wiley Book by Steve Wexler', type: 'Book' },
        { title: 'Workout Wednesday Tableau Community Challenges', plat: 'workout-wednesday.com', type: 'Community' }
      ]
    },
    {
      id: 4,
      phase: 'Phase 4',
      title: 'Python for Analytics & Statistical Hypothesis Testing',
      timeEstimate: 'Weeks 15–18 • 10–12 hrs/week',
      desc: 'Leverage Python for automated data pipelines, exploratory data analysis, and statistical significance testing.',
      competencies: ['Python (Pandas, NumPy)', 'Seaborn & Plotly', 'Hypothesis Testing (A/B testing)', 'Regression Analysis', 'Automation'],
      tasks: [
        { id: 'da-4-1', text: 'Automate weekly data cleaning and report generation using Python scripts.', tip: 'Schedule scripts with cron or simple task schedulers.' },
        { id: 'da-4-2', text: 'Conduct an end-to-end A/B test analysis calculating p-values and confidence intervals.', tip: 'Check sample size power requirements before drawing business conclusions.' },
        { id: 'da-4-3', text: 'Run multiple linear regression models in Statsmodels, evaluating R-squared and p-values.', tip: 'Inspect residuals for normality and homoscedasticity.' },
        { id: 'da-4-4', text: 'Create publication-ready interactive visualizations using Plotly and Seaborn.', tip: 'Use accessible, colorblind-friendly color palettes.' }
      ],
      project: {
        title: 'E-Commerce A/B Experiment Analysis & Recommendation Report',
        desc: 'Statistical analysis of a marketing landing page experiment determining conversion uplift and revenue impact.',
        stack: ['Python', 'Pandas', 'SciPy', 'Statsmodels', 'Plotly']
      },
      resources: [
        { title: 'Practical Statistics for Data Scientists', plat: "O'Reilly Book by Peter Bruce", type: 'Book' },
        { title: 'Applied Data Science with Python Specialization', plat: 'Coursera / Univ of Michigan', type: 'Course' },
        { title: 'Analytics Vidhya: A/B Testing Comprehensive Guide', plat: 'analyticsvidhya.com', type: 'Guide' }
      ]
    },
    {
      id: 5,
      phase: 'Phase 5',
      title: 'Business Presentation, Capstone Portfolio & Interview Readiness',
      timeEstimate: 'Weeks 19–24 • 8–10 hrs/week',
      desc: 'Assemble a standout portfolio, present actionable business insights to stakeholders, and ace analytics interviews.',
      competencies: ['Executive Presentation', 'Case Study Synthesis', 'SQL Live Interview Challenges', 'Portfolio Documentation', 'Salary Negotiation'],
      tasks: [
        { id: 'da-5-1', text: 'Create a GitHub portfolio website with 3 in-depth case studies featuring problem, data, methodology, and ROI.', tip: 'Structure case studies with: Problem -> Insight -> Action -> Impact.' },
        { id: 'da-5-2', text: 'Record a 5-minute video presentation explaining an analytical finding to non-technical executives.', tip: 'Lead with the business recommendation, not the mathematical formulas.' },
        { id: 'da-5-3', text: 'Solve 40 SQL whiteboard interview questions on StrataScratch / LeetCode.', tip: 'Practice writing clean SQL on a Google Doc or whiteboard without syntax highlighting.' },
        { id: 'da-5-4', text: 'Refine your resume highlighting business results (e.g. "Identified $140K in annual logistics inefficiencies").', tip: 'Emphasize decisions driven by your data, not just tools used.' }
      ],
      project: {
        title: 'End-to-End Market Opportunity & Product Strategy Analysis',
        desc: 'Comprehensive analytical report synthesizing public datasets, SQL queries, Python modeling, and an interactive dashboard.',
        stack: ['SQL', 'Python', 'Tableau', 'GitHub Pages']
      },
      resources: [
        { title: 'Ace the Data Science / Analyst Interview', plat: 'Book by Nick Singh & Kevin Sheng', type: 'Book' },
        { title: 'StrataScratch Real Interview Questions', plat: 'stratascratch.com', type: 'Interactive' },
        { title: 'Ken Jee: How to Build a Data Portfolio', plat: 'YouTube', type: 'Video' }
      ]
    }
  ],

  'UX Designer': [
    {
      id: 1,
      phase: 'Phase 1',
      title: 'Design Thinking, User Research & Empathy Mapping',
      timeEstimate: 'Weeks 1–4 • 8–10 hrs/week',
      desc: 'Understand user needs through interviews, surveys, persona creation, and problem framing.',
      competencies: ['User Interviews', 'Personas & Empathy Maps', 'Competitive Analysis', 'Heuristic Evaluation', 'Problem Framing'],
      tasks: [
        { id: 'ux-1-1', text: 'Conduct 3 generative user interviews with open-ended discovery questions.', tip: 'Listen 80% of the time; avoid leading questions.' },
        { id: 'ux-1-2', text: 'Synthesize interview notes into actionable Personas and Journey Maps.', tip: 'Ground personas in observed user quotes and frustrations.' },
        { id: 'ux-1-3', text: 'Perform a heuristic evaluation of an existing product using Nielsen Norman heuristics.', tip: 'Document severity ratings for each usability issue identified.' },
        { id: 'ux-1-4', text: 'Draft a crisp "How Might We" (HMW) statement framing the core user challenge.', tip: 'Ensure the problem statement is not tied to a specific solution prematurely.' }
      ],
      project: {
        title: 'User Research Case Study: Student Study Workflow Pain Points',
        desc: 'Comprehensive research discovery report diagnosing navigation friction in online academic learning apps.',
        stack: ['Miro / FigJam', 'Notion', 'User Interviews']
      },
      resources: [
        { title: 'Google UX Design Professional Certificate', plat: 'Coursera', type: 'Course' },
        { title: "The Design of Everyday Things", plat: 'Book by Don Norman', type: 'Book' },
        { title: 'Nielsen Norman Group UX Articles', plat: 'nngroup.com', type: 'Guide' }
      ]
    },
    {
      id: 2,
      phase: 'Phase 2',
      title: 'Information Architecture, Wireframing & User Flows',
      timeEstimate: 'Weeks 5–8 • 10–12 hrs/week',
      desc: 'Translate insights into structured user paths, sitemaps, low-fidelity paper wireframes, and digital blueprints.',
      competencies: ['Information Architecture', 'User Flows', 'Low-Fidelity Wireframes', 'Card Sorting', 'Rapid Prototyping'],
      tasks: [
        { id: 'ux-2-1', text: 'Map out end-to-end user flows covering happy paths, edge cases, and error states.', tip: 'Always design empty states and 404/connection lost screens.' },
        { id: 'ux-2-2', text: 'Sketch 20 rapid paper wireframes exploring different layout variations (Crazy Eights).', tip: 'Focus on hierarchy and structure before visual aesthetics.' },
        { id: 'ux-2-3', text: 'Build digital low-fidelity wireframes in Figma focusing on typography hierarchy and spacing.', tip: 'Use an 8pt grid system to maintain layout rhythm.' },
        { id: 'ux-2-4', text: 'Conduct an unmoderated card sort test to validate navigation menu grouping.', tip: 'Look for categories with highest user consensus.' }
      ],
      project: {
        title: 'Low-Fidelity Wireframe Blueprint for Mobile Learning Platform',
        desc: 'Complete low-fidelity wireframe set mapping out note uploads, quiz flashcards, and student risk indicators.',
        stack: ['Figma', 'FigJam', 'Whimsical']
      },
      resources: [
        { title: "Don't Make Me Think (Revisited)", plat: 'Book by Steve Krug', type: 'Book' },
        { title: 'Information Architecture: For the Web and Beyond', plat: "O'Reilly Book by Rosenfeld & Morville", type: 'Book' },
        { title: 'Figma for Beginners Official Series', plat: 'YouTube / Figma', type: 'Video' }
      ]
    },
    {
      id: 3,
      phase: 'Phase 3',
      title: 'Figma Mastery, Design Systems & High-Fidelity UI',
      timeEstimate: 'Weeks 9–14 • 12–14 hrs/week',
      desc: 'Build scalable design systems: Auto Layout, component variants, design tokens, color scales, and high-fidelity screens.',
      competencies: ['Figma Auto Layout 5.0', 'Component Variants & Properties', 'Design Tokens & Color Theory', 'Micro-Typography', 'Responsive UI'],
      tasks: [
        { id: 'ux-3-1', text: 'Master Figma Auto Layout, constraints, and nested component variants.', tip: 'Components should resize fluidly across mobile, tablet, and desktop viewports.' },
        { id: 'ux-3-2', text: 'Build a cohesive design system: typography scale, accessible color palette, and spacing tokens.', tip: 'Check color contrast against WCAG AA standards (4.5:1 ratio).' },
        { id: 'ux-3-3', text: 'Design 10+ high-fidelity responsive screens for both Light and Dark themes.', tip: 'Use realistic copy and data rather than "Lorem Ipsum".' },
        { id: 'ux-3-4', text: 'Create interactive Figma prototypes with smart animate transitions and hover states.', tip: 'Prototypes should feel like live code to testers.' }
      ],
      project: {
        title: 'Comprehensive Design System & Multi-Platform Application',
        desc: 'Production-ready Figma UI kit featuring 40+ atomic components, interactive variants, and complete screen specs.',
        stack: ['Figma', 'Design Systems', 'WCAG Accessibility']
      },
      resources: [
        { title: 'Refactoring UI', plat: 'Book by Adam Wathan & Steve Schoger', type: 'Book' },
        { title: 'Design Systems by Alla Kholmatova', plat: 'Smashing Magazine Book', type: 'Book' },
        { title: 'Shift Nudge: Interface Design Course', plat: 'shiftnudge.com', type: 'Course' }
      ]
    },
    {
      id: 4,
      phase: 'Phase 4',
      title: 'Usability Testing, Accessibility (WCAG) & Iteration',
      timeEstimate: 'Weeks 15–18 • 10–12 hrs/week',
      desc: 'Validate designs with real users: moderated usability sessions, qualitative feedback synthesis, and accessibility compliance.',
      competencies: ['Moderated Usability Testing', 'Quantitative Usability Metrics', 'WCAG 2.1 AA Compliance', 'Developer Handoff', 'A/B Testing'],
      tasks: [
        { id: 'ux-4-1', text: 'Run 5 moderated usability test sessions using your clickable Figma prototype.', tip: 'Ask participants to "think aloud" while attempting core tasks.' },
        { id: 'ux-4-2', text: 'Calculate Task Completion Rate (TCR) and System Usability Scale (SUS) scores.', tip: 'A SUS score above 68 represents above-average usability.' },
        { id: 'ux-4-3', text: 'Audit your interface for WCAG 2.1 AA compliance: focus states, contrast, and font legibility.', tip: 'Use Stark Figma plugin to simulate color blindness.' },
        { id: 'ux-4-4', text: 'Prepare developer handoff documentation with redlines, edge-case annotations, and tokens.', tip: 'Add notes explaining animations and transition easing curves.' }
      ],
      project: {
        title: 'Usability Audit & Iterative Redesign Case Study',
        desc: 'Before-and-after case study detailing usability friction, test methodology, and quantitative validation of redesigned flows.',
        stack: ['Figma', 'Maze / Useberry', 'Stark Accessibility Plugin']
      },
      resources: [
        { title: 'Rocket Surgery Made Easy: The Do-It-Yourself Guide to Finding Usability Problems', plat: 'Book by Steve Krug', type: 'Book' },
        { title: 'A Web for Everyone: Designing Accessible User Experiences', plat: 'Book by Sarah Horton & Whitney Quesenbery', type: 'Book' },
        { title: 'UX Design Institute Usability Guides', plat: 'uxdesigninstitute.com', type: 'Guide' }
      ]
    },
    {
      id: 5,
      phase: 'Phase 5',
      title: 'Case Study Portfolio, Design Interviews & Career Launch',
      timeEstimate: 'Weeks 19–24 • 8–10 hrs/week',
      desc: 'Craft in-depth storytelling case studies, build your portfolio website, and prepare for whiteboard design challenges.',
      competencies: ['Portfolio Storytelling', 'Whiteboard Design Challenges', 'App Critique Sessions', 'Design Presentation', 'Job Search Strategy'],
      tasks: [
        { id: 'ux-5-1', text: 'Build a live portfolio website showcasing 2-3 comprehensive, end-to-end case studies.', tip: 'Hiring managers spend 2-3 minutes scanning; lead with outcomes and crisp visuals.' },
        { id: 'ux-5-2', text: 'Practice 4 whiteboard design challenges under 45-minute timed constraints.', tip: 'Structure: Clarify goal -> Target users -> Journey -> Ideas -> Trade-offs.' },
        { id: 'ux-5-3', text: 'Conduct an app critique session analyzing an industry product with another designer.', tip: 'Critique both visual craft and underlying business trade-offs.' },
        { id: 'ux-5-4', text: 'Prepare a 20-minute slide deck presentation of your strongest case study for hiring managers.', tip: 'Emphasize your personal design decisions and collaborative process.' }
      ],
      project: {
        title: 'Full Product Design Portfolio with Live Web Showcase',
        desc: 'Interactive portfolio presenting detailed research, low/high-fi prototypes, design systems, and measured usability outcomes.',
        stack: ['Figma', 'Framer / Webflow', 'Case Studies']
      },
      resources: [
        { title: 'Solving Product Design Exercises', plat: 'Book by Artiom Dashinsky', type: 'Book' },
        { title: 'Bestof.design Portfolio Gallery', plat: 'bestof.design', type: 'Inspiration' },
        { title: 'Femke: UX Design Portfolio & Career Advice', plat: 'YouTube', type: 'Video' }
      ]
    }
  ]
}

// Universal dynamic generator for ANY career not explicitly listed above
export function getCareerRoadmap(career) {
  if (!career || !career.name) {
    return ROADMAP_TEMPLATES['Software Engineer']
  }

  // Check direct template match
  if (ROADMAP_TEMPLATES[career.name]) {
    return ROADMAP_TEMPLATES[career.name]
  }

  // Dynamic Generator for any career in CAREERS dataset
  const cName = career.name
  const skills = Array.isArray(career.skills) && career.skills.length > 0 ? career.skills : ['Core Foundations', 'Domain Tools', 'Applied Systems', 'Professional Practice']
  const s1 = skills[0] || 'Fundamentals'
  const s2 = skills[1] || 'Domain Methods'
  const s3 = skills[2] || 'Advanced Tools'
  const s4 = skills[3] || 'Industry Standards'
  const resources = Array.isArray(career.resources) && career.resources.length > 0 ? career.resources : []
  const r1 = resources[0] || { title: `${s1} Fundamentals`, plat: 'Coursera / edX' }
  const r2 = resources[1] || { title: `Applied ${s2} & Industry Workflows`, plat: 'O\'Reilly / Books' }
  const r3 = resources[2] || { title: `Mastering ${cName}`, plat: 'Online Guide / Documentation' }

  return [
    {
      id: 1,
      phase: 'Phase 1',
      title: `Foundations & Core Prerequisites for ${cName}`,
      timeEstimate: 'Weeks 1–4 • 8–10 hrs/week',
      desc: `Master the foundational tools, language syntax, and core terminology required for a successful career in ${cName}.`,
      competencies: [s1, 'Core Methodologies', 'Workflow Tools', 'Industry Vocabulary'],
      tasks: [
        { id: `dyn-1-1`, text: `Set up your core workspace, tools, and developer/analyst environment for ${s1}.`, tip: 'Configure your environment with linting and standard extensions.' },
        { id: `dyn-1-2`, text: `Learn the essential syntax, rules, and best practices governing ${s1}.`, tip: 'Build micro-exercises daily to cement core fundamentals.' },
        { id: `dyn-1-3`, text: `Study industry case studies and standard operating procedures for entry-level ${cName} roles.`, tip: 'Notice common patterns used by senior practitioners.' },
        { id: `dyn-1-4`, text: `Document your learning in a structured repository or portfolio log.`, tip: 'Writing summaries reinforces conceptual retention.' }
      ],
      project: {
        title: `${cName} Starter Kit & Foundational Prototype`,
        desc: `A clean starter project applying core ${s1} principles to solve an authentic entry-level problem.`,
        stack: [s1, 'Git', 'CLI / Workspace']
      },
      resources: [
        { title: r1.title, plat: r1.plat, type: 'Course' },
        { title: `${s1} Practical Crash Course`, plat: 'freeCodeCamp / YouTube', type: 'Video' },
        { title: `${cName} Official Documentation & Specs`, plat: 'Official Guides', type: 'Documentation' }
      ]
    },
    {
      id: 2,
      phase: 'Phase 2',
      title: `Core Technical Competency & Tooling (${s2})`,
      timeEstimate: 'Weeks 5–8 • 10–12 hrs/week',
      desc: `Deep-dive into ${s2} and industry-standard workflows that set qualified candidates apart.`,
      competencies: [s2, s1, 'Process Optimization', 'Quality Assurance'],
      tasks: [
        { id: `dyn-2-1`, text: `Master core frameworks and standard libraries associated with ${s2}.`, tip: 'Focus on production patterns rather than trivial toy examples.' },
        { id: `dyn-2-2`, text: `Implement structured validation and error handling for ${s2} workflows.`, tip: 'Anticipate failure states and edge cases.' },
        { id: `dyn-2-3`, text: `Optimize performance and throughput for common ${cName} challenges.`, tip: 'Benchmark your solution against baseline metrics.' },
        { id: `dyn-2-4`, text: `Complete 15 hands-on challenges or problem sets testing ${s2}.`, tip: 'Time yourself to build confidence under real conditions.' }
      ],
      project: {
        title: `Interactive ${s2} Engine & Production Utility`,
        desc: `Practical domain application implementing ${s2} workflows with structured inputs and validated outputs.`,
        stack: [s1, s2, 'Testing Suite']
      },
      resources: [
        { title: r2.title, plat: r2.plat, type: 'Book' },
        { title: `Intermediate ${s2} Masterclass`, plat: 'Coursera / edX', type: 'Course' },
        { title: 'Industry Best Practices Guide', plat: 'Community Repository', type: 'Guide' }
      ]
    },
    {
      id: 3,
      phase: 'Phase 3',
      title: `Real-World Projects & Systems Integration (${s3})`,
      timeEstimate: 'Weeks 9–14 • 12–14 hrs/week',
      desc: `Combine your foundational skills to engineer 2 real-world portfolio projects demonstrating ${s3} proficiency.`,
      competencies: [s3, s2, 'Full Lifecycle Delivery', 'Collaboration & Standards'],
      tasks: [
        { id: `dyn-3-1`, text: `Architect an end-to-end project applying ${s2} and ${s3} simultaneously.`, tip: 'Draw architecture or process diagrams before starting implementation.' },
        { id: `dyn-3-2`, text: `Incorporate persistent data storage, state management, or automated pipelines.`, tip: 'Ensure data consistency and automated recovery.' },
        { id: `dyn-3-3`, text: `Write clean documentation, API schemas, and installation guides.`, tip: 'A great README is the first thing evaluators look at.' },
        { id: `dyn-3-4`, text: `Conduct peer reviews or self-audits to refactor technical debt.`, tip: 'Refactor for modularity and maintainability.' }
      ],
      project: {
        title: `Enterprise ${cName} Solution & Applied Platform`,
        desc: `Complete, deployable project built to address genuine business and user needs for ${cName}.`,
        stack: [s1, s2, s3, 'Modern Toolchain']
      },
      resources: [
        { title: r3.title, plat: r3.plat, type: 'Course / Book' },
        { title: `Building Production ${cName} Systems`, plat: 'O\'Reilly / Technical Press', type: 'Book' },
        { title: 'Project Design & Architecture Playbook', plat: 'GitHub Curated List', type: 'Guide' }
      ]
    },
    {
      id: 4,
      phase: 'Phase 4',
      title: `Advanced Specialization, Scalability & Standards (${s4})`,
      timeEstimate: 'Weeks 15–18 • 10–12 hrs/week',
      desc: `Refine your expertise in ${s4}, automated delivery pipelines, security compliance, and system reliability.`,
      competencies: [s4, 'System Reliability', 'Security & Compliance', 'Scalability'],
      tasks: [
        { id: `dyn-4-1`, text: `Adopt advanced industry patterns and architectural standards for ${s4}.`, tip: 'Review open-source production implementations.' },
        { id: `dyn-4-2`, text: `Implement automated CI/CD checks, linter enforcement, and test pipelines.`, tip: 'Automate repetitive verification to maintain high code quality.' },
        { id: `dyn-4-3`, text: `Audit your systems for security, accessibility, and high availability.`, tip: 'Check compliance against modern industry standards.' },
        { id: `dyn-4-4`, text: `Benchmark resource usage and optimize latency or processing bottlenecks.`, tip: 'Profile hot paths and eliminate wasteful operations.' }
      ],
      project: {
        title: `Scalable ${s4} Infrastructure & Automation Framework`,
        desc: `Production-ready platform implementing automated deployment, monitoring, and high-performance ${s4} routines.`,
        stack: [s3, s4, 'Docker / Cloud', 'CI/CD']
      },
      resources: [
        { title: `Advanced ${s4} Architecture`, plat: 'Specialized Course / edX', type: 'Course' },
        { title: 'High-Performance Systems & Best Practices', plat: 'Engineering Blogs', type: 'Articles' },
        { title: 'Production Security & Standards Checklist', plat: 'Industry Consortium', type: 'Checklist' }
      ]
    },
    {
      id: 5,
      phase: 'Phase 5',
      title: `Capstone Showcase, Technical Interviews & Career Launch`,
      timeEstimate: 'Weeks 19–24 • 8–10 hrs/week',
      desc: `Prepare your portfolio, polish technical and behavioral interview responses, and secure your role as a ${cName}.`,
      competencies: ['Technical Interviewing', 'STAR Behavioral Stories', 'Portfolio Presentation', 'Negotiation & Job Strategy'],
      tasks: [
        { id: `dyn-5-1`, text: `Deploy your capstone project live with public URL, documentation, and demo video.`, tip: 'Include a clean demo walkthrough highlighting your personal contributions.' },
        { id: `dyn-5-2`, text: `Prepare 5 STAR-method stories demonstrating leadership, problem solving, and resilience.`, tip: 'Quantify your measurable impact on outcomes.' },
        { id: `dyn-5-3`, text: `Conduct 3 mock technical interviews targeting core ${cName} interview scenarios.`, tip: 'Practice communicating technical trade-offs clearly.' },
        { id: `dyn-5-4`, text: `Submit tailored applications to companies seeking ${cName} talent.`, tip: 'Network directly with hiring managers and industry peers on LinkedIn.' }
      ],
      project: {
        title: `Public Capstone Showcase & Verified Professional Portfolio`,
        desc: `Live, public-facing portfolio demonstrating end-to-end expertise across all required ${cName} competencies.`,
        stack: [s1, s2, s3, s4, 'Public Cloud / Hosting']
      },
      resources: [
        { title: `Acing the ${cName} Technical Interview`, plat: 'Interview Guide / Book', type: 'Book' },
        { title: 'Tech Interview Handbook & Behavioral Prep', plat: 'techinterviewhandbook.org', type: 'Guide' },
        { title: 'Mock Interview Platforms & Peer Practice', plat: 'Pramp / Peer Community', type: 'Interactive' }
      ]
    }
  ]
}
