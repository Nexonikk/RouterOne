/*
  Warnings:

  - A unique constraint covering the columns `[usageId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "usageId" INTEGER,
ALTER COLUMN "inputTokenCount" SET DEFAULT 0,
ALTER COLUMN "outputTokenCount" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "Usage" (
    "id" SERIAL NOT NULL,
    "requestId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "apiKeyId" INTEGER NOT NULL,
    "modelProviderMappingId" INTEGER NOT NULL,
    "inputTokenCount" INTEGER NOT NULL DEFAULT 0,
    "outputTokenCount" INTEGER NOT NULL DEFAULT 0,
    "totalTokenCount" INTEGER NOT NULL DEFAULT 0,
    "creditsConsumed" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "latencyMs" INTEGER,
    "streaming" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageAttempt" (
    "id" SERIAL NOT NULL,
    "usageId" INTEGER NOT NULL,
    "modelProviderMappingId" INTEGER NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "latencyMs" INTEGER,
    "error" TEXT,
    "inputTokenCount" INTEGER,
    "outputTokenCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usage_requestId_key" ON "Usage"("requestId");

-- CreateIndex
CREATE INDEX "Usage_userId_createdAt_idx" ON "Usage"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Usage_apiKeyId_createdAt_idx" ON "Usage"("apiKeyId", "createdAt");

-- CreateIndex
CREATE INDEX "Usage_modelProviderMappingId_createdAt_idx" ON "Usage"("modelProviderMappingId", "createdAt");

-- CreateIndex
CREATE INDEX "Usage_createdAt_idx" ON "Usage"("createdAt");

-- CreateIndex
CREATE INDEX "UsageAttempt_usageId_idx" ON "UsageAttempt"("usageId");

-- CreateIndex
CREATE INDEX "UsageAttempt_modelProviderMappingId_createdAt_idx" ON "UsageAttempt"("modelProviderMappingId", "createdAt");

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_usageId_key" ON "Conversation"("usageId");

-- CreateIndex
CREATE INDEX "Conversation_userId_createdAt_idx" ON "Conversation"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Conversation_apiKeyId_createdAt_idx" ON "Conversation"("apiKeyId", "createdAt");

-- CreateIndex
CREATE INDEX "Conversation_modelProviderMappingId_createdAt_idx" ON "Conversation"("modelProviderMappingId", "createdAt");

-- CreateIndex
CREATE INDEX "Conversation_createdAt_idx" ON "Conversation"("createdAt");

-- CreateIndex
CREATE INDEX "Model_companyId_idx" ON "Model"("companyId");

-- CreateIndex
CREATE INDEX "ModelProviderMapping_modelId_idx" ON "ModelProviderMapping"("modelId");

-- CreateIndex
CREATE INDEX "ModelProviderMapping_providerId_idx" ON "ModelProviderMapping"("providerId");

-- CreateIndex
CREATE INDEX "OnrampTransaction_userId_idx" ON "OnrampTransaction"("userId");

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "ApiKey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_modelProviderMappingId_fkey" FOREIGN KEY ("modelProviderMappingId") REFERENCES "ModelProviderMapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageAttempt" ADD CONSTRAINT "UsageAttempt_usageId_fkey" FOREIGN KEY ("usageId") REFERENCES "Usage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageAttempt" ADD CONSTRAINT "UsageAttempt_modelProviderMappingId_fkey" FOREIGN KEY ("modelProviderMappingId") REFERENCES "ModelProviderMapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_usageId_fkey" FOREIGN KEY ("usageId") REFERENCES "Usage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
