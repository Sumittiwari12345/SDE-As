import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const colleges = [
  {
    name: "National Institute of Technology, Trichy",
    slug: "nit-trichy",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    type: "PUBLIC",
    establishedYear: 1964,
    overview:
      "A premier public engineering institute known for strong computer science, electronics, mechanical engineering, research culture, and national-level placements.",
    averageFees: 180000,
    averagePackage: 15.8,
    highestPackage: 52,
    rating: 4.7,
    reviewCount: 128,
    website: "https://www.nitt.edu",
    courses: [
      { name: "Computer Science and Engineering", degree: "B.Tech", duration: "4 years", annualFees: 182000, seats: 120 },
      { name: "Data Analytics", degree: "M.Tech", duration: "2 years", annualFees: 125000, seats: 40 }
    ],
    placements: [
      { year: 2025, averagePackage: 15.8, highestPackage: 52, placementRate: 92, topRecruiters: ["Google", "Microsoft", "Texas Instruments"] }
    ],
    reviews: [
      { author: "Aditi Sharma", rating: 5, comment: "Excellent peer group, coding culture, and placement support." },
      { author: "Rahul Menon", rating: 4, comment: "Academics are demanding, but the outcomes are worth it." }
    ]
  },
  {
    name: "Vellore Institute of Technology",
    slug: "vit-vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    type: "PRIVATE",
    establishedYear: 1984,
    overview:
      "A large private university with a wide course catalog, modern labs, and strong industry hiring across software, analytics, and core engineering roles.",
    averageFees: 220000,
    averagePackage: 9.2,
    highestPackage: 44,
    rating: 4.3,
    reviewCount: 96,
    website: "https://vit.ac.in",
    courses: [
      { name: "Computer Science and Engineering", degree: "B.Tech", duration: "4 years", annualFees: 245000, seats: 600 },
      { name: "Artificial Intelligence", degree: "B.Tech", duration: "4 years", annualFees: 260000, seats: 240 }
    ],
    placements: [
      { year: 2025, averagePackage: 9.2, highestPackage: 44, placementRate: 88, topRecruiters: ["Amazon", "Deloitte", "Infosys"] }
    ],
    reviews: [
      { author: "Neha Jain", rating: 4, comment: "Great infrastructure and many clubs, but competition is high." },
      { author: "Karthik R", rating: 4, comment: "Placements are good when you build projects early." }
    ]
  },
  {
    name: "Indian Institute of Technology, Bombay",
    slug: "iit-bombay",
    city: "Mumbai",
    state: "Maharashtra",
    type: "PUBLIC",
    establishedYear: 1958,
    overview:
      "One of India's highest-ranked technical institutes with deep research programs, top faculty, startup ecosystem, and global employer access.",
    averageFees: 230000,
    averagePackage: 21.8,
    highestPackage: 68,
    rating: 4.9,
    reviewCount: 211,
    website: "https://www.iitb.ac.in",
    courses: [
      { name: "Computer Science and Engineering", degree: "B.Tech", duration: "4 years", annualFees: 235000, seats: 130 },
      { name: "Electrical Engineering", degree: "B.Tech", duration: "4 years", annualFees: 225000, seats: 120 }
    ],
    placements: [
      { year: 2025, averagePackage: 21.8, highestPackage: 68, placementRate: 95, topRecruiters: ["Apple", "Google", "Jane Street"] }
    ],
    reviews: [
      { author: "Sana Khan", rating: 5, comment: "Exceptional research exposure and career opportunities." },
      { author: "Ishan Mehta", rating: 5, comment: "The network and project culture are unmatched." }
    ]
  },
  {
    name: "PES University",
    slug: "pes-university",
    city: "Bengaluru",
    state: "Karnataka",
    type: "PRIVATE",
    establishedYear: 1972,
    overview:
      "A Bengaluru-based university focused on engineering, product development, internships, and startup-oriented learning.",
    averageFees: 310000,
    averagePackage: 10.5,
    highestPackage: 39,
    rating: 4.1,
    reviewCount: 74,
    website: "https://pes.edu",
    courses: [
      { name: "Computer Science and Engineering", degree: "B.Tech", duration: "4 years", annualFees: 330000, seats: 480 },
      { name: "Electronics and Communication", degree: "B.Tech", duration: "4 years", annualFees: 290000, seats: 240 }
    ],
    placements: [
      { year: 2025, averagePackage: 10.5, highestPackage: 39, placementRate: 84, topRecruiters: ["Adobe", "Cisco", "Flipkart"] }
    ],
    reviews: [
      { author: "Vikram S", rating: 4, comment: "Good city advantage for internships and hackathons." }
    ]
  },
  {
    name: "Jadavpur University",
    slug: "jadavpur-university",
    city: "Kolkata",
    state: "West Bengal",
    type: "PUBLIC",
    establishedYear: 1955,
    overview:
      "A public university with excellent value for money, respected engineering departments, and consistent campus placements.",
    averageFees: 12000,
    averagePackage: 11.1,
    highestPackage: 45,
    rating: 4.5,
    reviewCount: 89,
    website: "https://jaduniv.edu.in",
    courses: [
      { name: "Computer Science and Engineering", degree: "B.E.", duration: "4 years", annualFees: 10000, seats: 90 },
      { name: "Information Technology", degree: "B.E.", duration: "4 years", annualFees: 10000, seats: 90 }
    ],
    placements: [
      { year: 2025, averagePackage: 11.1, highestPackage: 45, placementRate: 86, topRecruiters: ["Atlassian", "Samsung", "TCS Research"] }
    ],
    reviews: [
      { author: "Priyanka Das", rating: 5, comment: "Outstanding ROI and a strong academic culture." }
    ]
  }
];

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@collegehub.dev" },
    update: {},
    create: {
      name: "Demo Student",
      email: "demo@collegehub.dev",
      passwordHash
    }
  });

  for (const college of colleges) {
    const { courses, placements, reviews, ...collegeData } = college;
    const created = await prisma.college.upsert({
      where: { slug: college.slug },
      update: collegeData,
      create: collegeData
    });

    await prisma.course.deleteMany({ where: { collegeId: created.id } });
    await prisma.placement.deleteMany({ where: { collegeId: created.id } });
    await prisma.review.deleteMany({ where: { collegeId: created.id } });

    await prisma.course.createMany({
      data: courses.map((course) => ({ ...course, collegeId: created.id }))
    });
    await prisma.placement.createMany({
      data: placements.map((placement) => ({
        year: placement.year,
        averagePackage: placement.averagePackage,
        highestPackage: placement.highestPackage,
        placementRate: placement.placementRate,
        topRecruiters: JSON.stringify(placement.topRecruiters),
        collegeId: created.id
      }))
    });
    await prisma.review.createMany({
      data: reviews.map((review) => ({ ...review, collegeId: created.id }))
    });
  }

  const firstCollege = await prisma.college.findUnique({ where: { slug: "nit-trichy" } });
  if (firstCollege) {
    await prisma.favorite.upsert({
      where: { userId_collegeId: { userId: demoUser.id, collegeId: firstCollege.id } },
      update: {},
      create: { userId: demoUser.id, collegeId: firstCollege.id }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
