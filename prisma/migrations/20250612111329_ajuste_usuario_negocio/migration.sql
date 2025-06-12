-- DropForeignKey
ALTER TABLE "Negocio" DROP CONSTRAINT "Negocio_propietarioId_fkey";

-- AddForeignKey
ALTER TABLE "Negocio" ADD CONSTRAINT "Negocio_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
