import 'dotenv/config';
import argon2 from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

// Run with `prisma db seed` (registered under migrations.seed in
// prisma7.config.ts). The adapter is the same one PrismaService uses, so the
// script talks to the database exactly the way the app does.
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

// Dev-only credential. Hashing it here is the point of the exercise: the app
// verifies seeded logins with argon2.verify, so a placeholder string would
// never authenticate.
const SEED_PASSWORD = 'Passw0rd!';

type SeedUser = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'staff' | 'admin';
  password: string; // plaintext in this file, hashed before insert
  photo?: string;
  age: number;
  gender: string;
};

type SeedTicket = {
  id: number;
  reference: string;
  subject: string;
  description: string;
  reporterId: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'closed';
  createdAt: Date;
};

// The same five users as InMemoryUsersRepository. The only change is that
// 'placeholder_hash_1' becomes a real argon2 hash of SEED_PASSWORD.
const users: SeedUser[] = [
  {
    id: 'u001',
    name: 'Amina Staff',
    email: 'amina.staff@example.com',
    role: 'staff',
    password: SEED_PASSWORD,
    age: 31,
    gender: 'female',
  },
  {
    id: 'u002',
    name: 'Adam Admin',
    email: 'adam.admin@example.com',
    role: 'admin',
    password: SEED_PASSWORD,
    age: 40,
    gender: 'male',
  },
  {
    id: 'u003',
    name: 'Chen Wei',
    email: 'chen.wei@example.com',
    role: 'user',
    password: SEED_PASSWORD,
    photo: 'https://example.com/photos/chen.jpg',
    age: 41,
    gender: 'male',
  },
  {
    id: 'u004',
    name: 'Diana Kowalski',
    email: 'diana.kowalski@example.com',
    role: 'staff',
    password: SEED_PASSWORD,
    photo: 'https://example.com/photos/diana.jpg',
    age: 35,
    gender: 'female',
  },
  {
    id: 'u005',
    name: 'Emeka Okafor',
    email: 'emeka.okafor@example.com',
    role: 'user',
    password: SEED_PASSWORD,
    // photo omitted (optional column)
    age: 24,
    gender: 'male',
  },
];

// The same ten tickets as InMemoryTicketsRepository, ids included, so a fresh
// database looks exactly like the in-memory one did.
const tickets: SeedTicket[] = [
  {
    id: 1,
    reference: 'tkt_seed0001',
    subject: 'Cannot login to account',
    description: 'User cannot access the dashboard after login.',
    reporterId: 'u001',
    priority: 'high',
    status: 'open',
    createdAt: new Date('2026-09-01T10:00:00.000Z'),
  },
  {
    id: 2,
    reference: 'tkt_seed0002',
    subject: 'Payment failed',
    description: 'Card payment fails at the checkout step.',
    reporterId: 'u002',
    priority: 'medium',
    status: 'open',
    createdAt: new Date('2026-09-01T11:30:00.000Z'),
  },
  {
    id: 3,
    reference: 'tkt_seed00010',
    subject: 'Invoice download not working',
    description: 'Invoice PDF download returns an empty file.',
    reporterId: 'u003',
    priority: 'low',
    status: 'closed',
    createdAt: new Date('2026-09-01T12:45:00.000Z'),
  },
  {
    id: 4,
    reference: 'tkt_seed0003',
    subject: 'Password reset email not arriving',
    description: 'Reset email never arrives in inbox or spam folder.',
    reporterId: 'u004',
    priority: 'high',
    status: 'open',
    createdAt: new Date('2026-09-02T08:15:00.000Z'),
  },
  {
    id: 5,
    reference: 'tkt_seed0004',
    subject: 'Profile photo upload fails',
    description: 'Uploading a JPEG avatar returns a 500 error.',
    reporterId: 'u005',
    priority: 'medium',
    status: 'open',
    createdAt: new Date('2026-09-02T09:40:00.000Z'),
  },
  {
    id: 6,
    reference: 'tkt_seed0005',
    subject: 'Two-factor authentication code invalid',
    description: 'Valid 2FA code from authenticator app is rejected.',
    reporterId: 'u001',
    priority: 'high',
    status: 'open',
    createdAt: new Date('2026-09-02T14:05:00.000Z'),
  },
  {
    id: 7,
    reference: 'tkt_seed0006',
    subject: 'Search returns no results',
    description: 'Searching for existing tickets shows an empty list.',
    reporterId: 'u002',
    priority: 'medium',
    status: 'closed',
    createdAt: new Date('2026-09-03T07:20:00.000Z'),
  },
  {
    id: 8,
    reference: 'tkt_seed0007',
    subject: 'App crashes on startup',
    description: 'Mobile app closes immediately on launch on Android 14.',
    reporterId: 'u003',
    priority: 'high',
    status: 'open',
    createdAt: new Date('2026-09-03T10:55:00.000Z'),
  },
  {
    id: 9,
    reference: 'tkt_seed0008',
    subject: 'Dark mode text unreadable',
    description: 'Some labels appear white-on-white in dark mode.',
    reporterId: 'u004',
    priority: 'low',
    status: 'closed',
    createdAt: new Date('2026-09-03T16:30:00.000Z'),
  },
  {
    id: 10,
    reference: 'tkt_seed0009',
    subject: 'Notification emails duplicated',
    description: 'Each ticket update sends two identical emails.',
    reporterId: 'u005',
    priority: 'medium',
    status: 'open',
    createdAt: new Date('2026-09-04T09:10:00.000Z'),
  },
];

async function main() {
  // Users first: tickets have a foreign key to reporterId, so the referenced
  // rows must exist before the tickets are inserted.
  for (const { password, ...user } of users) {
    // Hash once, outside the object: `create` and `update` are both evaluated
    // before the call, so hashing inline would pay argon2's cost twice.
    const hashed = await argon2.hash(password);

    // Upsert instead of create: seeding twice must not fail on the primary
    // key, so an existing row is updated in place.
    await prisma.user.upsert({
      where: { id: user.id },
      create: { ...user, password: hashed },
      update: { ...user, password: hashed },
    });
  }

  for (const { id, ...ticket } of tickets) {
    await prisma.ticket.upsert({
      // Ticket ids are autoincrement, so a re-run cannot key on id: key on the
      // unique reference instead, and let `create` set the id only the first
      // time.
      where: { reference: ticket.reference },
      create: { id, ...ticket },
      update: ticket,
    });
  }

  // Explicit ids do not advance the SERIAL sequence in Postgres. Without this,
  // the next ticket created by the app would try id = 1 and collide with the
  // seed. setval(..., max + 1, false) makes the next nextval() return max + 1.
  await prisma.$queryRaw`
    SELECT setval(
      pg_get_serial_sequence('"Ticket"', 'id'),
      COALESCE((SELECT MAX(id) FROM "Ticket"), 0) + 1,
      false
    )
  `;

  const [userCount, ticketCount] = await Promise.all([
    prisma.user.count(),
    prisma.ticket.count(),
  ]);

  console.log(`Seeded ${userCount} users and ${ticketCount} tickets.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
