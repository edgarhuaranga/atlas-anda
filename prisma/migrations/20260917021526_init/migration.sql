-- CreateTable
CREATE TABLE "postal_codes" (
    "code" TEXT NOT NULL,
    "placeName" TEXT NOT NULL,
    "comunidad" TEXT,
    "provincia" TEXT,
    "geometry" JSONB NOT NULL,

    CONSTRAINT "postal_codes_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "words" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word_recordings" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "postalCode" TEXT NOT NULL,
    "variation" TEXT,
    "audioUrl" TEXT,
    "comment" TEXT,

    CONSTRAINT "word_recordings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phenomena" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phenomena_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phenomenon_categories" (
    "id" SERIAL NOT NULL,
    "phenomenonId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "phenomenon_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phenomenon_recordings" (
    "id" SERIAL NOT NULL,
    "phenomenonId" INTEGER NOT NULL,
    "postalCode" TEXT NOT NULL,
    "categoryId" INTEGER,
    "audioUrl" TEXT,
    "comment" TEXT,

    CONSTRAINT "phenomenon_recordings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "words_word_key" ON "words"("word");

-- CreateIndex
CREATE INDEX "word_recordings_wordId_idx" ON "word_recordings"("wordId");

-- CreateIndex
CREATE UNIQUE INDEX "word_recordings_wordId_postalCode_key" ON "word_recordings"("wordId", "postalCode");

-- CreateIndex
CREATE UNIQUE INDEX "phenomena_key_key" ON "phenomena"("key");

-- CreateIndex
CREATE UNIQUE INDEX "phenomenon_categories_phenomenonId_type_key" ON "phenomenon_categories"("phenomenonId", "type");

-- CreateIndex
CREATE INDEX "phenomenon_recordings_phenomenonId_idx" ON "phenomenon_recordings"("phenomenonId");

-- CreateIndex
CREATE UNIQUE INDEX "phenomenon_recordings_phenomenonId_postalCode_key" ON "phenomenon_recordings"("phenomenonId", "postalCode");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- AddForeignKey
ALTER TABLE "word_recordings" ADD CONSTRAINT "word_recordings_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "word_recordings" ADD CONSTRAINT "word_recordings_postalCode_fkey" FOREIGN KEY ("postalCode") REFERENCES "postal_codes"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phenomenon_categories" ADD CONSTRAINT "phenomenon_categories_phenomenonId_fkey" FOREIGN KEY ("phenomenonId") REFERENCES "phenomena"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phenomenon_recordings" ADD CONSTRAINT "phenomenon_recordings_phenomenonId_fkey" FOREIGN KEY ("phenomenonId") REFERENCES "phenomena"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phenomenon_recordings" ADD CONSTRAINT "phenomenon_recordings_postalCode_fkey" FOREIGN KEY ("postalCode") REFERENCES "postal_codes"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phenomenon_recordings" ADD CONSTRAINT "phenomenon_recordings_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "phenomenon_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
