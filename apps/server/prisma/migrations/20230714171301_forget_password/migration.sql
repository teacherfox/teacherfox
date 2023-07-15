-- CreateTable
CREATE TABLE "forget_passwords" (
    "id" UUID NOT NULL,
    "token" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forget_passwords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forget_passwords_token_key" ON "forget_passwords"("token");

-- AddForeignKey
ALTER TABLE "forget_passwords" ADD CONSTRAINT "forget_passwords_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
