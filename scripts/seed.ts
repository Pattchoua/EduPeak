const  { PrismaClient } = require("@prisma/client")

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Professional Development" },
        { name: "Academic Subjects" },
        { name: "Technology and Computer Science" },
        { name: "Creative Arts" },
        { name: "Health and Wellness" },
        { name: "Hobbies and Lifestyle" },
        { name: "Certification Preparation" },
        { name: "Personal Development" },
        { name: "Language Learning" },
      ],
    });
    console.log("Sucess");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();
