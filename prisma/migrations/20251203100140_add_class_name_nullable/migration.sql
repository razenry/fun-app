/*
  Warnings:

  - You are about to drop the column `class` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `class`,
    ADD COLUMN `class_name` VARCHAR(191) NULL;
