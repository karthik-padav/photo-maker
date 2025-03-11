-- DropForeignKey
ALTER TABLE `Controler` DROP FOREIGN KEY `Controler_imageId_fkey`;

-- DropForeignKey
ALTER TABLE `Controler` DROP FOREIGN KEY `Controler_userId_fkey`;

-- DropIndex
DROP INDEX `Controler_imageId_fkey` ON `Controler`;

-- AlterTable
ALTER TABLE `Controler` MODIFY `userId` VARCHAR(191) NULL,
    MODIFY `imageId` VARCHAR(191) NULL,
    MODIFY `bucket` VARCHAR(191) NULL,
    MODIFY `borderTitle` VARCHAR(191) NULL,
    MODIFY `borderValue` VARCHAR(191) NULL,
    MODIFY `imageWrapperSize` VARCHAR(191) NULL,
    MODIFY `rotate` VARCHAR(191) NULL,
    MODIFY `scale` VARCHAR(191) NULL,
    MODIFY `pngShadow` VARCHAR(191) NULL,
    MODIFY `transformX` VARCHAR(191) NULL,
    MODIFY `transformY` VARCHAR(191) NULL,
    MODIFY `pngBorderColor` VARCHAR(191) NULL,
    MODIFY `backgroundColorType` VARCHAR(191) NULL,
    MODIFY `backgroundColor` VARCHAR(191) NULL,
    MODIFY `downloadedImageKey` VARCHAR(191) NULL,
    MODIFY `outerBorderColor` VARCHAR(191) NULL,
    MODIFY `outerBorderOpacity` VARCHAR(191) NULL,
    MODIFY `outerBorderWidth` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Controler` ADD CONSTRAINT `Controler_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Controler` ADD CONSTRAINT `Controler_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
