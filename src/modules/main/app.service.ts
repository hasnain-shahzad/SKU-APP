import { HttpException, Injectable } from "@nestjs/common";
import { NodeEnv, ResponseCode, ResponseMessage } from "../../utils/enum";
import { EnTxType } from "./common/app.enum";
import { StockObj, TxObj } from "./common/app.types";
import * as stockData from './stock.json';
import * as txsData from './transactions.json';

@Injectable()
export class AppService {
  constructor() { }

  /**
   * Configures The App Environment
   * @returns
   */
  static envConfiguration(): string {
    switch (process.env.NODE_ENV) {
      case NodeEnv.TEST:
        return `_${NodeEnv.TEST}.env`;

      default:
        return `.env`;
    }
  }

  async getDataFromFiles(): Promise<{ stock: StockObj[], transactions: TxObj[] }> {
    const stock: StockObj[] = require('./stock.json');
    const transactions: TxObj[] = require('./transactions.json');
    return { stock, transactions };
  }

  async checkSkuExist(
    sku: string,
    stock: StockObj[],
    transactions: TxObj[]
  ): Promise<{
    stock: Partial<{ exist: boolean, index: number }>,
    txs: { exist: boolean }
  }> {
    let exists: {
      stock: Partial<{ exist: boolean, index: number }>,
      txs: { exist: boolean }
    } = {
      stock: { exist: false },
      txs: { exist: false }
    };
    const stockIndex = stock.findIndex(sotckObj => sotckObj.sku === sku);
    if (stockIndex >= 0) {
      exists.stock = { exist: true, index: stockIndex };
    }
    const txIndex = transactions.findIndex(sotckObj => sotckObj.sku === sku);
    if (txIndex >= 0) {
      exists.txs = { exist: true };
    }
    return exists;
  }


  async calculateCurrentStock(sku: string, initialStock: number, txs: TxObj[]): Promise<number> {
    let currentStock: number = initialStock;
    txs.map((tx) => {
      if (tx.sku === sku) {
        switch (tx.type) {
          case EnTxType.ORDER:
            if (currentStock !== 0) {
              currentStock -= tx.qty;
            }
            break;
          case EnTxType.REFUND:
            currentStock += tx.qty;
            break;
        }
      }
    });
    return currentStock < 0 ? 0 : currentStock;
  }


  getCurrentStockBySku = async (sku: string): Promise<{ sku: string, qty: number }> => {
    let intialStockCount: number;
    const { stock, transactions } = await this.getDataFromFiles();
    const checkRes = await this.checkSkuExist(sku, stock, transactions);
    if (!checkRes.stock.exist && !checkRes.txs.exist) {
      throw new HttpException(
        ResponseMessage.SKU_DOES_NOT_EXIST,
        ResponseCode.BAD_REQUEST
      );
    }
    if (!checkRes.stock.exist && checkRes.txs.exist) {
      intialStockCount = 0;
    }
    if (checkRes.stock.exist && !checkRes.txs.exist) {
      return { sku, qty: stock[checkRes.stock.index].stock };
    }
    intialStockCount = stock[checkRes.stock.index].stock;
    const currentStock = await this.calculateCurrentStock(sku, intialStockCount, transactions);
    return { sku, qty: currentStock };
  }
}
