/*
  Warnings:

  - You are about to drop the column `downloadedImageKey` on the `Controler` table. All the data in the column will be lost.
  - You are about to drop the column `imageKey` on the `Image` table. All the data in the column will be lost.
  - Added the required column `imagePath` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Controler` DROP COLUMN `downloadedImageKey`,
    ADD COLUMN `downloadedImagePath` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Image` DROP COLUMN `imageKey`,
    ADD COLUMN `imagePath` VARCHAR(191) NOT NULL;
