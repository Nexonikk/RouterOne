/*
  Warnings:

  - You are about to drop the column `logo` on the `Model` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "logo" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "logo";
