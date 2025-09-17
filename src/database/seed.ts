import { db } from "./client.ts"
import { transactions, users } from "./schema.ts"
import { faker } from "@faker-js/faker"

function getRandomArrayValue<T>(arr: T[]): T {
  if (!arr.length) {
    throw new Error("Array is empty");
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}


async function seed() {
  const usersInsert = await db
    .insert(users)
    .values([
      { 
        name: faker.person.firstName(), 
        email: faker.internet.email(),
        tokens: faker.number.int({ max: 50000, min: 30000 })
      },
    ])
    .returning()

  await db
    .insert(transactions)
    .values([
      { 
        amount: Number(faker.finance.amount({ min: -1000, max: 1000 })), 
        description: faker.finance.transactionDescription(),
        date: faker.date.between({ 
          from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 3), // 3 months ago
          to: new Date()
        }),
        type: getRandomArrayValue<'CREDIT' | 'DEBIT'>(['CREDIT', 'DEBIT']),
        status: getRandomArrayValue<'PENDING' | 'POSTED'>(['PENDING', 'POSTED']),
        userId: usersInsert[0].id,
        category: 'temporary missing',
        operationType: null,
      },
      { 
        amount: Number(faker.finance.amount({ min: -1000, max: 1000 })), 
        description: faker.finance.transactionDescription(),
        date: faker.date.between({ 
          from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 3), // 3 months ago
          to: new Date()
        }),
        type: getRandomArrayValue<'CREDIT' | 'DEBIT'>(['CREDIT', 'DEBIT']),
        status: getRandomArrayValue<'PENDING' | 'POSTED'>(['PENDING', 'POSTED']),
        userId: usersInsert[0].id,
        category: 'temporary missing',
        operationType: null,
      },
      { 
        amount: Number(faker.finance.amount({ min: -1000, max: 1000 })), 
        description: faker.finance.transactionDescription(),
        date: faker.date.between({ 
          from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 3), // 3 months ago
          to: new Date()
        }),
        type: getRandomArrayValue<'CREDIT' | 'DEBIT'>(['CREDIT', 'DEBIT']),
        status: getRandomArrayValue<'PENDING' | 'POSTED'>(['PENDING', 'POSTED']),
        userId: usersInsert[0].id,
        category: 'temporary missing',
        operationType: null,
      },
    ])    
}

seed()