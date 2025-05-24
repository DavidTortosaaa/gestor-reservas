/*
  Warnings:

  - You are about to drop the column `fecha` on the `Reserva` table. All the data in the column will be lost.
  - You are about to drop the column `hora` on the `Reserva` table. All the data in the column will be lost.
  - Added the required column `fechaHora` to the `Reserva` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reserva" DROP COLUMN "fecha",
DROP COLUMN "hora",
ADD COLUMN     "fechaHora" TIMESTAMP(3) NOT NULL;
