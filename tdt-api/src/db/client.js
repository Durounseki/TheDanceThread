import { PrismaClient } from '@prisma/client';
import { PrismaD1 }	from '@prisma/adapter-d1';
import * as queries from './queries.js'

export default function createPrismaClient(env){
    const adapter = new PrismaD1(env.DB);
    const prisma = new PrismaClient({ adapter }).$extends({
        model:{
            event:{
                getEvents: queries.getEvents,
                createEvent: queries.createEvent
            }
        }
    });
    return prisma;
}