import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  // create two dummy users
  const passwordUser1 = await bcrypt.hash('coff33pass123', roundsOfHashing);
  const passwordUser2 = await bcrypt.hash('g33alalpass456', roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { email: 'john@coffeeexample.com' },
    update: {
      password: passwordUser1,
    },
    create: {
      email: 'john@coffeeexample.com',
      name: 'John Coffee',
      password: passwordUser1,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'alex@gegeexample.com' },
    update: {
      password: passwordUser2,
    },
    create: {
      email: 'alex@gegeexample.com',
      name: 'Alex Gegee',
      password: passwordUser2,
    },
  });

  // create two dummy articles
  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {
      authorId: user1.id,
    },
    create: {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      published: false,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.article.upsert({
    where: { title: "What's new in Prisma? (Q1/22)" },
    update: {
      authorId: user2.id,
    },
    create: {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      published: true,
      authorId: user2.id,
    },
  });

  console.log({ post1, post2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
