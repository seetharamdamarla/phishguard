-- CreateEnum
CREATE TYPE "ThreatLevel" AS ENUM ('Safe', 'LowRisk', 'MediumRisk', 'HighRisk', 'Critical');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "UrlStatus" AS ENUM ('safe', 'questionable', 'suspicious', 'malicious');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "otpExpire" TIMESTAMP(3),
    "resetPasswordToken" TEXT,
    "resetPasswordExpire" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "analysisCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analyses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "inputText" TEXT NOT NULL,
    "riskScore" DOUBLE PRECISION NOT NULL,
    "threatLevel" "ThreatLevel" NOT NULL,
    "recommendations" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detected_threats" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "severity" "Severity" NOT NULL,
    "count" INTEGER,
    "keywords" TEXT[],

    CONSTRAINT "detected_threats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suspicious_elements" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "text" TEXT,
    "startIndex" INTEGER,
    "endIndex" INTEGER,
    "type" TEXT,
    "riskLevel" TEXT,
    "explanation" TEXT,
    "recommendation" TEXT,

    CONSTRAINT "suspicious_elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "url_analysis" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domain" TEXT,
    "status" "UrlStatus" NOT NULL,
    "issues" TEXT[],
    "riskScore" DOUBLE PRECISION,

    CONSTRAINT "url_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phishing_tactics" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "confidence" DOUBLE PRECISION,

    CONSTRAINT "phishing_tactics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_metadata" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "analysisTime" INTEGER,
    "version" TEXT,
    "detectionEngine" TEXT,

    CONSTRAINT "analysis_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "analyses_userId_createdAt_idx" ON "analyses"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "analyses_threatLevel_idx" ON "analyses"("threatLevel");

-- CreateIndex
CREATE INDEX "analyses_riskScore_idx" ON "analyses"("riskScore");

-- CreateIndex
CREATE INDEX "analyses_createdAt_idx" ON "analyses"("createdAt");

-- CreateIndex
CREATE INDEX "detected_threats_analysisId_idx" ON "detected_threats"("analysisId");

-- CreateIndex
CREATE INDEX "suspicious_elements_analysisId_idx" ON "suspicious_elements"("analysisId");

-- CreateIndex
CREATE INDEX "url_analysis_analysisId_idx" ON "url_analysis"("analysisId");

-- CreateIndex
CREATE INDEX "phishing_tactics_analysisId_idx" ON "phishing_tactics"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "analysis_metadata_analysisId_key" ON "analysis_metadata"("analysisId");

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detected_threats" ADD CONSTRAINT "detected_threats_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suspicious_elements" ADD CONSTRAINT "suspicious_elements_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "url_analysis" ADD CONSTRAINT "url_analysis_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phishing_tactics" ADD CONSTRAINT "phishing_tactics_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_metadata" ADD CONSTRAINT "analysis_metadata_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
