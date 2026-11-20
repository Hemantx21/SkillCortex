import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from './models/Job.js';
import User from './models/User.js';

dotenv.config();

const SAMPLE_JOBS = [
  {
    title: "iOS Developer",
    company: "Salesforce",
    description: "Join Salesforce as a iOS Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["CI/CD", "C++", "Java", "Kafka", "Swift"],
    location: "London, UK",
    salary: "Rs.8L - Rs.15L",
    type: "Full-time"
  },
  {
    title: "Data Engineer",
    company: "Zoom",
    description: "Join Zoom as a Data Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["TensorFlow", "Python", "Kubernetes", "C++", "Node.js"],
    location: "Mumbai, India",
    salary: "Rs.8L - Rs.15L",
    type: "Full-time"
  },
  {
    title: "SOC Analyst",
    company: "Airbnb",
    description: "Join Airbnb as a SOC Analyst. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Swift", "Spark", "Node.js", "Kubernetes", "C++"],
    location: "Bengaluru, India",
    salary: "Rs.15K - Rs.40K/mo",
    type: "Internship"
  },
  {
    title: "Security Engineer",
    company: "Docker",
    description: "Join Docker as a Security Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["C++", "Java", "Swift", "MongoDB", "CI/CD"],
    location: "Berlin, Germany",
    salary: "Rs.8L - Rs.15L",
    type: "Part-time"
  },
  {
    title: "Tableau Developer",
    company: "SAP",
    description: "Join SAP as a Tableau Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Vue.js", "Docker", "Kafka", "Java", "C++"],
    location: "Remote (India)",
    salary: "Rs.15K - Rs.40K/mo",
    type: "Internship"
  },
  {
    title: "SAP Consultant",
    company: "Apple",
    description: "Join Apple as a SAP Consultant. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Go", "Angular", "C++", "TensorFlow", "GraphQL"],
    location: "Pune, India",
    salary: "Rs.15K - Rs.40K/mo",
    type: "Internship"
  },
  {
    title: "iOS Developer",
    company: "GitLab",
    description: "Join GitLab as a iOS Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["REST APIs", "AWS", "PostgreSQL", "GraphQL", "Kubernetes"],
    location: "Remote (Global)",
    salary: "Rs.12L - Rs.22L",
    type: "Remote"
  },
  {
    title: "DevOps Engineer",
    company: "Pinterest",
    description: "Join Pinterest as a DevOps Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Linux", "Redis", "MySQL", "PyTorch", "MongoDB"],
    location: "Chennai, India",
    salary: "Rs.15K - Rs.40K/mo",
    type: "Internship"
  },
  {
    title: "System Administrator",
    company: "Apple",
    description: "Join Apple as a System Administrator. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["AWS", "GraphQL", "Redis", "SQL", "Git"],
    location: "Chennai, India",
    salary: "Rs.15K - Rs.40K/mo",
    type: "Internship"
  },
  {
    title: "MLOps Engineer",
    company: "Datadog",
    description: "Join Datadog as a MLOps Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Swift", "REST APIs", "Linux", "CI/CD", "Redis"],
    location: "Pune, India",
    salary: "Rs.35L - Rs.60L",
    type: "Full-time"
  },
  {
    title: "Database Administrator",
    company: "HCL",
    description: "Join HCL as a Database Administrator. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Swift", "REST APIs", "PyTorch", "Python", "CI/CD"],
    location: "Chennai, India",
    salary: "Rs.15K - Rs.40K/mo",
    type: "Internship"
  },
  {
    title: "DevOps Engineer",
    company: "HashiCorp",
    description: "Join HashiCorp as a DevOps Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["MySQL", "PostgreSQL", "MongoDB", "Vue.js", "Swift"],
    location: "Sydney, Australia",
    salary: "Rs.8L - Rs.15L",
    type: "Full-time"
  },
  {
    title: "Tableau Developer",
    company: "JetBrains",
    description: "Join JetBrains as a Tableau Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Kafka", "React", "PyTorch", "AWS", "Kotlin"],
    location: "Remote (Global)",
    salary: "Rs.40L - Rs.70L",
    type: "Intensive"
  },
  {
    title: "QA Engineer",
    company: "Slack",
    description: "Join Slack as a QA Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["GraphQL", "MongoDB", "SQL", "MySQL", "Kubernetes"],
    location: "Pune, India",
    salary: "Rs.8L - Rs.15L",
    type: "Part-time"
  },
  {
    title: "Business Analyst",
    company: "Splunk",
    description: "Join Splunk as a Business Analyst. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["PyTorch", "Spark", "C++", "TypeScript", "Linux"],
    location: "Sydney, Australia",
    salary: "Rs.12L - Rs.22L",
    type: "Full-time"
  },
  {
    title: "Security Engineer",
    company: "Atlassian",
    description: "Join Atlassian as a Security Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Angular", "Linux", "Spark", "Kubernetes", "SQL"],
    location: "Remote (Global)",
    salary: "Rs.18L - Rs.32L",
    type: "Remote"
  },
  {
    title: "DevOps Engineer",
    company: "SAP",
    description: "Join SAP as a DevOps Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Angular", "Kubernetes", "React", "Go", "CI/CD"],
    location: "Chennai, India",
    salary: "Rs.8L - Rs.15L",
    type: "Part-time"
  },
  {
    title: "IT Support Engineer",
    company: "SAP",
    description: "Join SAP as a IT Support Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["TensorFlow", "C++", "Kafka", "Kotlin", "Swift"],
    location: "Remote (India)",
    salary: "Rs.12L - Rs.22L",
    type: "Remote"
  },
  {
    title: "iOS Developer",
    company: "Adobe",
    description: "Join Adobe as a iOS Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["PyTorch", "Linux", "Terraform", "GraphQL", "Angular"],
    location: "Bengaluru, India",
    salary: "Rs.15K - Rs.40K/mo",
    type: "Internship"
  },
  {
    title: "Penetration Tester",
    company: "Splunk",
    description: "Join Splunk as a Penetration Tester. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Java", "Go", "Vue.js", "Spark", "Node.js"],
    location: "London, UK",
    salary: "Rs.25L - Rs.45L",
    type: "Intensive"
  },
  {
    title: "Data Scientist",
    company: "Apple",
    description: "Join Apple as a Data Scientist. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Java", "Redis", "Kotlin", "Node.js", "React"],
    location: "Mumbai, India",
    salary: "Rs.12L - Rs.22L",
    type: "Intensive"
  },
  {
    title: "SOC Analyst",
    company: "Salesforce",
    description: "Join Salesforce as a SOC Analyst. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Kotlin", "React", "Python", "Terraform", "Docker"],
    location: "Dubai, UAE",
    salary: "Rs.18L - Rs.32L",
    type: "Full-time"
  },
  {
    title: "Network Administrator",
    company: "Palantir",
    description: "Join Palantir as a Network Administrator. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Kafka", "Go", "Java", "Terraform", "PyTorch"],
    location: "Remote (Global)",
    salary: "Rs.35L - Rs.60L",
    type: "Remote"
  },
  {
    title: "NLP Engineer",
    company: "GitHub",
    description: "Join GitHub as a NLP Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Java", "MySQL", "Redis", "TypeScript", "Go"],
    location: "Remote (Global)",
    salary: "Rs.12L - Rs.22L",
    type: "Full-time"
  },
  {
    title: "ERP Consultant",
    company: "Oracle",
    description: "Join Oracle as a ERP Consultant. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Rust", "Kafka", "SQL", "PostgreSQL", "C++"],
    location: "Toronto, Canada",
    salary: "Rs.12L - Rs.22L",
    type: "Full-time"
  },
  {
    title: "Backend Developer",
    company: "Capgemini",
    description: "Join Capgemini as a Backend Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Terraform", "TypeScript", "Rust", "Kafka", "Git"],
    location: "Remote (India)",
    salary: "Rs.40L - Rs.70L",
    type: "Remote"
  },
  {
    title: "UI/UX Designer",
    company: "Databricks",
    description: "Join Databricks as a UI/UX Designer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["GraphQL", "Rust", "Redis", "Vue.js", "Kubernetes"],
    location: "Remote (India)",
    salary: "Rs.15K - Rs.40K/mo",
    type: "Internship"
  },
  {
    title: "Network Administrator",
    company: "Capgemini",
    description: "Join Capgemini as a Network Administrator. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["CI/CD", "Spark", "MySQL", "REST APIs", "Kubernetes"],
    location: "Mumbai, India",
    salary: "Rs.8L - Rs.15L",
    type: "Part-time"
  },
  {
    title: "Data Scientist",
    company: "Twitter",
    description: "Join Twitter as a Data Scientist. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["REST APIs", "TypeScript", "Go", "Docker", "PostgreSQL"],
    location: "Remote (India)",
    salary: "Rs.8L - Rs.15L",
    type: "Remote"
  },
  {
    title: "System Administrator",
    company: "Databricks",
    description: "Join Databricks as a System Administrator. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Kubernetes", "Java", "Go", "Docker", "Redis"],
    location: "Remote (Global)",
    salary: "Rs.8L - Rs.15L",
    type: "Remote"
  },
  {
    title: "Data Analyst",
    company: "GitHub",
    description: "Join GitHub as a Data Analyst. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Kafka", "REST APIs", "Vue.js", "Python", "CI/CD"],
    location: "Bengaluru, India",
    salary: "Rs.40L - Rs.70L",
    type: "Intensive"
  },
  {
    title: "Power BI Developer",
    company: "Airbnb",
    description: "Join Airbnb as a Power BI Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Go", "Linux", "AWS", "TensorFlow", "REST APIs"],
    location: "London, UK",
    salary: "Rs.8L - Rs.15L",
    type: "Part-time"
  },
  {
    title: "Database Developer",
    company: "Confluent",
    description: "Join Confluent as a Database Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Spark", "MySQL", "Python", "AWS", "SQL"],
    location: "Gurugram, India",
    salary: "Rs.25L - Rs.45L",
    type: "Intensive"
  },
  {
    title: "Backend Developer",
    company: "Salesforce",
    description: "Join Salesforce as a Backend Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Kotlin", "CI/CD", "Go", "Angular", "Git"],
    location: "Singapore",
    salary: "Rs.8L - Rs.15L",
    type: "Part-time"
  },
  {
    title: "Network Engineer",
    company: "Salesforce",
    description: "Join Salesforce as a Network Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["React", "REST APIs", "MySQL", "Vue.js", "Java"],
    location: "Pune, India",
    salary: "Rs.15K - Rs.40K/mo",
    type: "Internship"
  },
  {
    title: "ETL Developer",
    company: "Accenture",
    description: "Join Accenture as a ETL Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["CI/CD", "Terraform", "Docker", "React", "TypeScript"],
    location: "Chennai, India",
    salary: "Rs.12L - Rs.22L",
    type: "Intensive"
  },
  {
    title: "Data Analyst",
    company: "Docker",
    description: "Join Docker as a Data Analyst. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["GraphQL", "Swift", "Redis", "TypeScript", "C++"],
    location: "Toronto, Canada",
    salary: "Rs.8L - Rs.15L",
    type: "Part-time"
  },
  {
    title: "Embedded Engineer",
    company: "Adobe",
    description: "Join Adobe as a Embedded Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Swift", "CI/CD", "Linux", "Rust", "TensorFlow"],
    location: "Remote (Global)",
    salary: "Rs.40L - Rs.70L",
    type: "Remote"
  },
  {
    title: "Big Data Engineer",
    company: "Adobe",
    description: "Join Adobe as a Big Data Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Rust", "React", "Terraform", "PyTorch", "GraphQL"],
    location: "Dubai, UAE",
    salary: "Rs.8L - Rs.15L",
    type: "Part-time"
  },
  {
    title: "Product Manager",
    company: "Shopify",
    description: "Join Shopify as a Product Manager. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["AWS", "SQL", "Go", "Kotlin", "MySQL"],
    location: "Bengaluru, India",
    salary: "Rs.8L - Rs.15L",
    type: "Part-time"
  },
  {
    title: "QA Engineer",
    company: "TikTok",
    description: "Join TikTok as a QA Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Linux", "C++", "Node.js", "Kubernetes", "Docker"],
    location: "Remote (Global)",
    salary: "Rs.8L - Rs.15L",
    type: "Remote"
  },
  {
    title: "Go Developer",
    company: "Amazon",
    description: "Join Amazon as a Go Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["C++", "React", "GraphQL", "Linux", "Git"],
    location: "Chennai, India",
    salary: "Rs.15K - Rs.40K/mo",
    type: "Internship"
  },
  {
    title: "ML Engineer",
    company: "JetBrains",
    description: "Join JetBrains as a ML Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Kotlin", "Rust", "Docker", "PostgreSQL", "TypeScript"],
    location: "Remote (India)",
    salary: "Rs.15K - Rs.40K/mo",
    type: "Internship"
  },
  {
    title: "AR/VR Engineer",
    company: "Zoom",
    description: "Join Zoom as a AR/VR Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Kubernetes", "PostgreSQL", "Rust", "Linux", "Git"],
    location: "Dubai, UAE",
    salary: "Rs.35L - Rs.60L",
    type: "Intensive"
  },
  {
    title: "Java Developer",
    company: "TikTok",
    description: "Join TikTok as a Java Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["TensorFlow", "Java", "Spark", "PyTorch", "Redis"],
    location: "Mumbai, India",
    salary: "Rs.12L - Rs.22L",
    type: "Intensive"
  },
  {
    title: "ML Engineer",
    company: "Infosys",
    description: "Join Infosys as a ML Engineer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Docker", "Angular", "MongoDB", "REST APIs", "Java"],
    location: "Delhi, India",
    salary: "Rs.8L - Rs.15L",
    type: "Intensive"
  },
  {
    title: "SQL Server DBA",
    company: "Salesforce",
    description: "Join Salesforce as a SQL Server DBA. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["TypeScript", "Linux", "SQL", "PyTorch", "Kubernetes"],
    location: "New York, NY",
    salary: "Rs.8L - Rs.15L",
    type: "Part-time"
  },
  {
    title: "ServiceNow Developer",
    company: "Uber",
    description: "Join Uber as a ServiceNow Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Angular", "CI/CD", "Kubernetes", "AWS", "PostgreSQL"],
    location: "London, UK",
    salary: "Rs.12L - Rs.22L",
    type: "Intensive"
  },
  {
    title: "Game Developer",
    company: "Zoom",
    description: "Join Zoom as a Game Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Kafka", "Redis", "Python", "MySQL", "React"],
    location: "Remote (Global)",
    salary: "Rs.12L - Rs.22L",
    type: "Remote"
  },
  {
    title: "Database Administrator",
    company: "TikTok",
    description: "Join TikTok as a Database Administrator. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["React", "Spark", "Redis", "Rust", "Kotlin"],
    location: "Singapore",
    salary: "Rs.40L - Rs.70L",
    type: "Intensive"
  },
  {
    title: "React Native Developer",
    company: "Zoom",
    description: "Join Zoom as a React Native Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Linux", "Java", "Python", "TypeScript", "Node.js"],
    location: "Gurugram, India",
    salary: "Rs.12L - Rs.22L",
    type: "Full-time"
  },
  {
    title: "SQL Server DBA",
    company: "SAP",
    description: "Join SAP as a SQL Server DBA. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["CI/CD", "TensorFlow", "Terraform", "Git", "Angular"],
    location: "Remote (India)",
    salary: "Rs.8L - Rs.15L",
    type: "Part-time"
  },
  {
    title: "Java Developer",
    company: "Splunk",
    description: "Join Splunk as a Java Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Swift", "Go", "PostgreSQL", "Redis", "Python"],
    location: "Remote (India)",
    salary: "Rs.15K - Rs.40K/mo",
    type: "Internship"
  },
  {
    title: "Go Developer",
    company: "Meta",
    description: "Join Meta as a Go Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["TypeScript", "React", "Vue.js", "Python", "REST APIs"],
    location: "Noida, India",
    salary: "Rs.8L - Rs.15L",
    type: "Intensive"
  },
  {
    title: "Java Developer",
    company: "Stripe",
    description: "Join Stripe as a Java Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Terraform", "Java", "PyTorch", "React", "Redis"],
    location: "Delhi, India",
    salary: "Rs.18L - Rs.32L",
    type: "Full-time"
  },
  {
    title: "Penetration Tester",
    company: "Datadog",
    description: "Join Datadog as a Penetration Tester. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Node.js", "Rust", "PostgreSQL", "Kubernetes", "Java"],
    location: "Pune, India",
    salary: "Rs.15K - Rs.40K/mo",
    type: "Internship"
  },
  {
    title: "UI/UX Designer",
    company: "VMware",
    description: "Join VMware as a UI/UX Designer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Docker", "Git", "MongoDB", "Vue.js", "Rust"],
    location: "Pune, India",
    salary: "Rs.8L - Rs.15L",
    type: "Part-time"
  },
  {
    title: "Oracle DBA",
    company: "Intel",
    description: "Join Intel as a Oracle DBA. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Angular", "AWS", "TypeScript", "Kafka", "REST APIs"],
    location: "Remote (Global)",
    salary: "Rs.35L - Rs.60L",
    type: "Intensive"
  },
  {
    title: "Backend Developer",
    company: "VMware",
    description: "Join VMware as a Backend Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["MySQL", "Rust", "C++", "Docker", "Go"],
    location: "Pune, India",
    salary: "Rs.8L - Rs.15L",
    type: "Full-time"
  },
  {
    title: "Python Developer",
    company: "JetBrains",
    description: "Join JetBrains as a Python Developer. Work on impactful products with a talented team. Strong fundamentals and hands-on experience required.",
    requirements: ["Go", "C++", "CI/CD", "Linux", "Spark"],
    location: "Hyderabad, India",
    salary: "Rs.40L - Rs.70L",
    type: "Intensive"
  },
];
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB for seeding.");

    let hrUser = await User.findOne({ role: 'hr' });
    if (!hrUser) {
      if (!process.env.HR_EMAIL || !process.env.HR_PASSWORD) {
        throw new Error("No HR user found. Configure HR_EMAIL and HR_PASSWORD or run the admin seeder first.");
      }
      hrUser = await User.create({ name: 'Seed HR', email: process.env.HR_EMAIL, password: process.env.HR_PASSWORD, role: 'hr' });
    }

    console.log("Clearing previous seeded demo jobs...");
    await Job.deleteMany({ company: { $in: SAMPLE_JOBS.map(j => j.company) } });

    const jobs = SAMPLE_JOBS.map(j => ({ ...j, hrRef: hrUser._id, status: 'open' }));
    await Job.insertMany(jobs);
    console.log(`Successfully seeded ${jobs.length} open roles.`);

    mongoose.disconnect();
  } catch (err) {
    console.error("Seeding error:", err);
    mongoose.disconnect();
  }
};

seed();
