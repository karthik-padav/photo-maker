/*
  Warnings:

  - Made the column `userId` on table `Controler` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Controler` DROP FOREIGN KEY `Controler_userId_fkey`;

-- AlterTable
ALTER TABLE `Controler` ADD COLUMN `pngShadowOpacity` VARCHAR(191) NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Controler` ADD CONSTRAINT `Controler_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
