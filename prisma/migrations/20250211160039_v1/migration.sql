/*
  Warnings:

  - Added the required column `outerBorderColor` to the `Controler` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outerBorderOpacity` to the `Controler` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outerBorderWidth` to the `Controler` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Controler` ADD COLUMN `outerBorderColor` VARCHAR(191) NOT NULL,
    ADD COLUMN `outerBorderOpacity` VARCHAR(191) NOT NULL,
    ADD COLUMN `outerBorderWidth` VARCHAR(191) NOT NULL;
