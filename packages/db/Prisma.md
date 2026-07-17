# edit schema.prisma

bun x prisma format

bun x prisma migrate dev --name add_pending_user

bun x prisma db push

bun x prisma generate
