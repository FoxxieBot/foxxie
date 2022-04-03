import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            {
                const { id } = req.query;

                await prisma.$connect();

                const user = await prisma.user.findFirst({
                    where: {
                        userId: id as string
                    }
                });

                // eslint-disable-next-line no-negated-condition
                if (!user) {
                    res.json({
                        error: 'User not found',
                        code: 10001
                    });
                } else {
                    res.json({ pronouns: user.pronouns });
                }

                await prisma.$disconnect();
            }
            break;
        default:
            {
                res.json({
                    error: 'Method Not Allowed',
                    code: 405
                });
            }
            break;
    }
}