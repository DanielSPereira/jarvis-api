import { timestamp, pgTable, text, uuid, integer, real } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  stripeCustomerId: text(),
  name: text().notNull(),
  email: text().unique().notNull(),
  tokens: integer().notNull().default(0)
})

export const items = pgTable('items', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().notNull().references(() => users.id),
  itemId: text().notNull()
})

export const transactions = pgTable('transactions', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().notNull().references(() => users.id),
  description: text().notNull(),
  category: text().notNull(),
  status: text().notNull().$type<'PENDING' | 'POSTED'>(),
  type: text().notNull().$type<'DEBIT' | 'CREDIT'>(),
  amount: real().notNull(),
  date: timestamp({ withTimezone: true }).notNull(),
  operationType: text().$type<OperationType>()
})

export type OperationType =
  | 'TED'
  | 'DOC'
  | 'PIX'
  | 'TRANSFERENCIA_MESMA_INSTITUICAO'
  | 'BOLETO'
  | 'CONVENIO_ARRECADACAO'
  | 'PACOTE_TARIFA_SERVICOS'
  | 'TARIFA_SERVICOS_AVULSOS'
  | 'FOLHA_PAGAMENTO'
  | 'DEPOSITO'
  | 'SAQUE'
  | 'CARTAO'
  | 'ENCARGOS_JUROS_CHEQUE_ESPECIAL'
  | 'RENDIMENTO_APLIC_FINANCEIRA'
  | 'PORTABILIDADE_SALARIO'
  | 'RESGATE_APLIC_FINANCEIRA'
  | 'OPERACAO_CREDITO'
  | 'OUTROS';

/**
 * Transaction
 * 
 * date
 * description
 * amount
 * category
 * status - PENDING or POSTED
 * type - DEBIT (outflow) or CREDIT (inflow)
 * operationType TED DOC PIX TRANSFERENCIA_MESMA_INSTITUICAO BOLETO CONVENIO_ARRECADACAO PACOTE_TARIFA_SERVICOS TARIFA_SERVICOS_AVULSOS FOLHA_PAGAMENTO DEPOSITO SAQUE CARTAO ENCARGOS_JUROS_CHEQUE_ESPECIAL RENDIMENTO_APLIC_FINANCEIRA PORTABILIDADE_SALARIO RESGATE_APLIC_FINANCEIRA OPERACAO_CREDITO OUTROS
 * creditCardMetadata {
    "installmentNumber": 1,
    "totalInstallments": 6,
    "totalAmount": 9000
  }
 * paymentData {
    "payer": {
      "name": "Tiago Rodrigues Santos",
      "branchNumber": "090",
      "accountNumber": "1234-5",
      "routingNumber": "001",
      "routingNumberISPB": "00000000",
      "documentNumber": {
        "type": "CPF",
        "value": "882.937.076-23"
      }
    },
    "reason": "Taxa de serviço",
    "receiver": {
      "name": "Pluggy",
      "branchNumber": "999",
      "accountNumber": "9876-1",
      "routingNumber": "002",
      "routingNumberISPB": "27652684",
      "documentNumber": {
        "type": "CNPJ",
        "value": "08.050.608/0001-32"
      }
    },
    "paymentMethod": "TED",
    "referenceNumber": "123456789",
    "receiverReferenceId": "company-reference-id"
  }
 */