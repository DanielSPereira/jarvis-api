import { db } from "./client.ts"
import { users } from "./schema.ts"
import { faker } from "@faker-js/faker"
import { hash } from 'argon2'


async function seed() {
  // const passwordHash = await hash('12345')
  // const usersInsert = await db
  //   .insert(users)
  //   .values([
  //     { 
  //       name: faker.person.firstName(), 
  //       email: faker.internet.email(),
  //       role: 'student',
  //       password: passwordHash
  //     },
  //     { 
  //       name: faker.person.firstName(), 
  //       email: faker.internet.email(),
  //       role: 'student',
  //       password: passwordHash
  //     },
  //     { 
  //       name: faker.person.firstName(), 
  //       email: faker.internet.email(),
  //       role: 'student',
  //       password: passwordHash
  //     },
  //   ])
  //   .returning()

  // const coursesInsert = await db
  //   .insert(courses)
  //   .values([
  //     { title: faker.lorem.word(3), description: faker.lorem.lines(1) },
  //     { title: faker.lorem.word(3), description: faker.lorem.lines(1) }
  //   ])
  //   .returning()
  
  // await db
  //   .insert(enrollments)
  //   .values([
  //     { userId: usersInsert[0].id, courseId: coursesInsert[0].id },
  //     { userId: usersInsert[1].id, courseId: coursesInsert[0].id },
  //     { userId: usersInsert[2].id, courseId: coursesInsert[1].id }
  //   ])
}

seed()