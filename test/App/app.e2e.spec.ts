import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/modules/main/app.module';
import { LoggerMock, } from '../mocks/provider.mock';
import { LoggerService } from '../../src/utils/logger/logger.service';
import * as stock from '../../src/modules/main/stock.json';
import * as txs from '../../src/modules/main/transactions.json';
import request from 'supertest';
import { ResponseCode, ResponseMessage } from '../../src/utils/enum';

describe('Sku App Test Cases', () => {
    let app: INestApplication;
    let server: any;
    let expectedRes: { sku: string, qty: number } = {
        sku: stock[3].sku,
        qty: 1442
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(LoggerService)
            .useValue(LoggerMock)
            .compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
        server = app.getHttpServer();
    });

    it(`Should get sku and current stock`, async () => {
        await request(server)
            .get(`/sku?sku=${stock[3].sku}`)
            .expect(ResponseCode.SUCCESS)
            .expect(({ body }) => {
                expect(body.data).toEqual(expectedRes);
            })
    });

    it(`Should give 400 when sku not found`, async () => {
        await request(server)
            .get(`/sku?sku=asdf`)
            .expect(ResponseCode.BAD_REQUEST)
            .expect(({ body }) => {
                expect(body.message).toEqual(ResponseMessage.SKU_DOES_NOT_EXIST);
            })
    });

    afterAll(async () => {
        await app.close();
    })
});
