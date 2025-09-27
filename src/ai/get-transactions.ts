import { tool } from "ai";
import z from "zod";
import { db } from "../database/client.ts";
import { transactions } from "../database/schema.ts";
import { eq } from "drizzle-orm";

type Tx = typeof transactions.$inferSelect;

const params = z.object({
  userId: z.string()
});

export const getTransactions = tool({
  description: 'Fetches transactions',
  inputSchema: params,
  outputSchema: z.string(),
  async execute({ userId }) {
    let txs: Tx[] = [];

    try {
      txs = await db
        .select()
        .from(transactions)
        .where(eq(transactions.userId, userId))
    } catch (error) {
      console.log(error)
      throw Error('[Tool calling] - Could not process request')
    }

    let markdown = '| Date | Description | Category | Amount | Type |\n';
    markdown += '|------|-------------|----------|--------|------|\n';

    txs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    for (const t of txs) {
      markdown += `| ${t.date || ''} | ${t.description || ''} | ${t.category || ''} | $${t.amount?.toFixed(2) || ''} | ${t.type} |\n`;
    }

    return markdown;
  }
})