-- CreateTable
CREATE TABLE "Appeal" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppealChild" (
    "id" TEXT NOT NULL,
    "appealId" TEXT NOT NULL,
    "childIin" TEXT NOT NULL,
    "childName" TEXT NOT NULL,

    CONSTRAINT "AppealChild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "athleteProfileId" TEXT NOT NULL,
    "sportsCenterId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportsCenterProgram" (
    "id" TEXT NOT NULL,
    "sportsCenterId" TEXT NOT NULL,
    "sportType" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "SportsCenterProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AthleteProfile" (
    "id" TEXT NOT NULL,
    "iin" TEXT NOT NULL,

    CONSTRAINT "AthleteProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SportsCenter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SportsCenter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AthleteProfile_iin_key" ON "AthleteProfile"("iin");

-- AddForeignKey
ALTER TABLE "AppealChild" ADD CONSTRAINT "AppealChild_appealId_fkey" FOREIGN KEY ("appealId") REFERENCES "Appeal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_programId_fkey" FOREIGN KEY ("programId") REFERENCES "SportsCenterProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_athleteProfileId_fkey" FOREIGN KEY ("athleteProfileId") REFERENCES "AthleteProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SportsCenterProgram" ADD CONSTRAINT "SportsCenterProgram_sportsCenterId_fkey" FOREIGN KEY ("sportsCenterId") REFERENCES "SportsCenter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
