import prisma from './prisma';
import fs from 'fs';
import path from 'path';
import {
  QuizCovers,
  DEFAULT_QUIZ_COVERS,
  CustomQuizCard,
  DEFAULT_CUSTOM_QUIZ_CARDS,
  QuizPrices,
  DEFAULT_QUIZ_PRICES,
  QuizPackageItem,
  DEFAULT_QUIZ_PACKAGES,
} from './defaultQuizData';

let tableReady = false;

const DATA_DIR = path.join(process.cwd(), 'data');
const COVERS_FILE_PATH = path.join(DATA_DIR, 'quiz-covers.json');
const CARDS_FILE_PATH = path.join(DATA_DIR, 'quiz-cards.json');
const PRICES_FILE_PATH = path.join(DATA_DIR, 'quiz-prices.json');
const PACKAGES_FILE_PATH = path.join(DATA_DIR, 'quiz-packages.json');

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {}
}

/**
 * Ensures that the SystemSetting table exists in the PostgreSQL database
 */
export async function ensureSettingsTable(): Promise<void> {
  if (tableReady) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SystemSetting" (
        "key" TEXT PRIMARY KEY,
        "value" TEXT NOT NULL,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    tableReady = true;
  } catch (err) {
    console.error('Failed to create or verify SystemSetting table in database:', err);
  }
}

/**
 * Reads a generic setting from the PostgreSQL database
 */
export async function getDbSetting<T>(key: string, defaultValue: T): Promise<T> {
  try {
    await ensureSettingsTable();
    const rows = await prisma.$queryRawUnsafe<{ key: string; value: string }[]>(
      `SELECT "key", "value" FROM "SystemSetting" WHERE "key" = $1 LIMIT 1`,
      key
    );
    if (rows && rows.length > 0 && rows[0].value) {
      try {
        return JSON.parse(rows[0].value) as T;
      } catch {
        return rows[0].value as unknown as T;
      }
    }
  } catch (err) {
    console.error(`Error reading setting "${key}" from database:`, err);
  }
  return defaultValue;
}

/**
 * Upserts a generic setting into the PostgreSQL database
 */
export async function setDbSetting<T>(key: string, value: T): Promise<boolean> {
  try {
    await ensureSettingsTable();
    const strVal = typeof value === 'string' ? value : JSON.stringify(value);
    await prisma.$executeRawUnsafe(
      `INSERT INTO "SystemSetting" ("key", "value", "updatedAt")
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT ("key")
       DO UPDATE SET "value" = $2, "updatedAt" = CURRENT_TIMESTAMP`,
      key,
      strVal
    );
    return true;
  } catch (err) {
    console.error(`Error saving setting "${key}" to database:`, err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 🖼️ QUIZ COVERS (Classes & Subjects)
// ─────────────────────────────────────────────────────────────

function readFileCovers(): QuizCovers {
  try {
    if (fs.existsSync(COVERS_FILE_PATH)) {
      const raw = fs.readFileSync(COVERS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          classes: parsed.classes || {},
          subjects: parsed.subjects || {},
        };
      }
    }
  } catch {}
  return DEFAULT_QUIZ_COVERS;
}

function writeFileCovers(covers: QuizCovers): void {
  try {
    ensureDataDir();
    fs.writeFileSync(COVERS_FILE_PATH, JSON.stringify(covers, null, 2), 'utf-8');
  } catch {}
}

export async function getQuizCoversFromDb(): Promise<QuizCovers> {
  // 1. Try reading from Database first
  const dbData = await getDbSetting<QuizCovers | null>('quiz_covers', null);
  if (dbData && typeof dbData === 'object') {
    const hasCovers =
      (dbData.classes && Object.keys(dbData.classes).length > 0) ||
      (dbData.subjects && Object.keys(dbData.subjects).length > 0);
    if (hasCovers) {
      // Sync to file as backup
      writeFileCovers(dbData);
      return {
        classes: dbData.classes || {},
        subjects: dbData.subjects || {},
      };
    }
  }

  // 2. Fallback to file and seed database if file has data
  const fileData = readFileCovers();
  const fileHasCovers =
    (fileData.classes && Object.keys(fileData.classes).length > 0) ||
    (fileData.subjects && Object.keys(fileData.subjects).length > 0);

  if (fileHasCovers) {
    await setDbSetting('quiz_covers', fileData);
    return fileData;
  }

  return dbData || DEFAULT_QUIZ_COVERS;
}

export async function saveQuizCoversToDb(covers: QuizCovers): Promise<void> {
  // 1. Save to Database (Permanent PostgreSQL storage)
  await setDbSetting('quiz_covers', covers);
  // 2. Write to local file as secondary backup
  writeFileCovers(covers);
}

// ─────────────────────────────────────────────────────────────
// 🃏 CUSTOM QUIZ CARDS (With Individual Cover Images)
// ─────────────────────────────────────────────────────────────

function readFileCards(): CustomQuizCard[] {
  try {
    if (fs.existsSync(CARDS_FILE_PATH)) {
      const raw = fs.readFileSync(CARDS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_CUSTOM_QUIZ_CARDS;
}

function writeFileCards(cards: CustomQuizCard[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(CARDS_FILE_PATH, JSON.stringify(cards, null, 2), 'utf-8');
  } catch {}
}

export async function getQuizCardsFromDb(): Promise<CustomQuizCard[]> {
  // 1. Try reading from Database
  const dbCards = await getDbSetting<CustomQuizCard[] | null>('quiz_cards', null);
  if (Array.isArray(dbCards) && dbCards.length > 0) {
    writeFileCards(dbCards);
    return dbCards;
  }

  // 2. Fallback to file and seed database
  const fileCards = readFileCards();
  if (Array.isArray(fileCards) && fileCards.length > 0) {
    await setDbSetting('quiz_cards', fileCards);
    return fileCards;
  }

  return DEFAULT_CUSTOM_QUIZ_CARDS;
}

export async function saveQuizCardsToDb(cards: CustomQuizCard[]): Promise<void> {
  // 1. Save to Database
  await setDbSetting('quiz_cards', cards);
  // 2. Write to file backup
  writeFileCards(cards);
}

// ─────────────────────────────────────────────────────────────
// 💰 QUIZ PRICES & PACKAGES
// ─────────────────────────────────────────────────────────────

export async function getQuizPricesFromDb(): Promise<QuizPrices> {
  const dbPrices = await getDbSetting<QuizPrices | null>('quiz_prices', null);
  if (dbPrices && typeof dbPrices === 'object') {
    return {
      classPrices: {
        ...DEFAULT_QUIZ_PRICES.classPrices,
        ...(dbPrices.classPrices || {}),
      },
      subjectPrice: Number(dbPrices.subjectPrice) || DEFAULT_QUIZ_PRICES.subjectPrice,
      packages: {
        singleSubject: Number(dbPrices.packages?.singleSubject) || DEFAULT_QUIZ_PRICES.packages.singleSubject,
        fullClass: Number(dbPrices.packages?.fullClass) || DEFAULT_QUIZ_PRICES.packages.fullClass,
        vipAll: Number(dbPrices.packages?.vipAll) || DEFAULT_QUIZ_PRICES.packages.vipAll,
      },
    };
  }

  // Fallback to file
  try {
    if (fs.existsSync(PRICES_FILE_PATH)) {
      const raw = fs.readFileSync(PRICES_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed) {
        await setDbSetting('quiz_prices', parsed);
        return parsed;
      }
    }
  } catch {}

  return DEFAULT_QUIZ_PRICES;
}

export async function saveQuizPricesToDb(prices: QuizPrices): Promise<void> {
  await setDbSetting('quiz_prices', prices);
  try {
    ensureDataDir();
    fs.writeFileSync(PRICES_FILE_PATH, JSON.stringify(prices, null, 2), 'utf-8');
  } catch {}
}

export async function getQuizPackagesFromDb(): Promise<QuizPackageItem[]> {
  const dbPkgs = await getDbSetting<QuizPackageItem[] | null>('quiz_packages', null);
  if (Array.isArray(dbPkgs) && dbPkgs.length > 0) {
    return dbPkgs;
  }

  try {
    if (fs.existsSync(PACKAGES_FILE_PATH)) {
      const raw = fs.readFileSync(PACKAGES_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        await setDbSetting('quiz_packages', parsed);
        return parsed;
      }
    }
  } catch {}

  return DEFAULT_QUIZ_PACKAGES;
}

export async function saveQuizPackagesToDb(packages: QuizPackageItem[]): Promise<void> {
  await setDbSetting('quiz_packages', packages);
  try {
    ensureDataDir();
    fs.writeFileSync(PACKAGES_FILE_PATH, JSON.stringify(packages, null, 2), 'utf-8');
  } catch {}
}

