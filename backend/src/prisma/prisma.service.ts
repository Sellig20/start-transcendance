import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super({
                    datasources: {
                        db: {
                            url: "postgresql://example:example@postgre:5432/baby?schema=public"
                    }
                }
            })
    }
}
