import { db } from "./client.ts"
import { transactions, users } from "./schema.ts"
import { faker } from "@faker-js/faker"

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
        amount: 5000, 
        description: faker.finance.transactionDescription(),
        date: faker.date.between({ 
          from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 3), // 3 months ago
          to: new Date()
        }),
        type: 'DEBIT',
        status: 'POSTED',
        userId: usersInsert[0].id,
        category: 'temporary missing',
        operationType: null,
      },
      { 
        amount: -3000, 
        description: faker.finance.transactionDescription(),
        date: faker.date.between({ 
          from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 3), // 3 months ago
          to: new Date()
        }),
        type: 'CREDIT',
        status: 'POSTED',
        userId: usersInsert[0].id,
        category: 'temporary missing',
        operationType: null,
      },
      { 
        amount: 2000, 
        description: faker.finance.transactionDescription(),
        date: faker.date.between({ 
          from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 3), // 3 months ago
          to: new Date()
        }),
        type: 'DEBIT',
        status: 'POSTED',
        userId: usersInsert[0].id,
        category: 'temporary missing',
        operationType: null,
      },
    ])    
}

seed()