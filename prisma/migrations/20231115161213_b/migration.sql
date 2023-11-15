/*
  Warnings:

  - You are about to drop the column `creatorName` on the `Engine` table. All the data in the column will be lost.
  - You are about to drop the column `hostMaxCompletionTokens` on the `Engine` table. All the data in the column will be lost.
  - You are about to drop the column `includeParameters` on the `Engine` table. All the data in the column will be lost.
  - You are about to drop the column `licenseUrl` on the `Engine` table. All the data in the column will be lost.
  - You are about to drop the column `priceInput` on the `Engine` table. All the data in the column will be lost.
  - You are about to drop the column `priceOutput` on the `Engine` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Engine` table. All the data in the column will be lost.
  - The `parameterSize` column on the `Engine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `stopTokens` column on the `Engine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ChatTab` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `costInputNanoUSD` to the `Engine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costOutputNanoUSD` to the `Engine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator` to the `Engine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerModelId` to the `Engine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "ChatTab" DROP CONSTRAINT "ChatTab_engineId_fkey";

-- DropForeignKey
ALTER TABLE "ChatTab" DROP CONSTRAINT "ChatTab_userId_fkey";

-- AlterTable
ALTER TABLE "Engine" DROP COLUMN "creatorName",
DROP COLUMN "hostMaxCompletionTokens",
DROP COLUMN "includeParameters",
DROP COLUMN "licenseUrl",
DROP COLUMN "priceInput",
DROP COLUMN "priceOutput",
DROP COLUMN "releaseDate",
ADD COLUMN     "comment" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "costInputNanoUSD" INTEGER NOT NULL,
ADD COLUMN     "costOutputNanoUSD" INTEGER NOT NULL,
ADD COLUMN     "creator" TEXT NOT NULL,
ADD COLUMN     "instructType" TEXT,
ADD COLUMN     "outputTokenLimit" INTEGER,
ADD COLUMN     "providerModelId" TEXT NOT NULL,
ADD COLUMN     "tokenizer" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "url" DROP NOT NULL,
ALTER COLUMN "license" DROP NOT NULL,
ALTER COLUMN "contextLength" DROP NOT NULL,
DROP COLUMN "parameterSize",
ADD COLUMN     "parameterSize" INTEGER,
ALTER COLUMN "promptFormat" DROP NOT NULL,
DROP COLUMN "stopTokens",
ADD COLUMN     "stopTokens" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "workbench" JSONB NOT NULL DEFAULT '{}',
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "ChatTab";

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Untitled',
    "image" TEXT NOT NULL DEFAULT '',
    "engineId" TEXT NOT NULL,
    "parameters" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_engineId_fkey" FOREIGN KEY ("engineId") REFERENCES "Engine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
