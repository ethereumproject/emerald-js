import { JsonRpc } from '@emeraldplatform/rpc';
import format from '../format';
import { DefaultBatch } from "@emeraldplatform/rpc";

/**
 * Extended API
 */
export default class ExtApi {
    rpc: JsonRpc;

    constructor(jsonRpc: JsonRpc) {
      this.rpc = jsonRpc;
    }

    getBlocks(from: number, to: number): Promise<Array<any>> {
      let batch = new DefaultBatch();
      let results: Array<Promise<any>> = [];

      for (let i = from; i <= to; i += 1) {
        results.push(batch.addCall('eth_getBlockByNumber', [format.toHex(i), false]));
      }

      return this.rpc.execute(batch)
        .then((_) => Promise.all(results))
        .then((data) => data.map(format.block));
    }

    getBlocksByNumbers(number: number | string | Array<any>): Promise<Array<any>> {
      let formattedNumber = number;
      if (typeof number === 'number') {
        formattedNumber = format.toHex(number);
      }
      let batch = new DefaultBatch();

      const requests = (formattedNumber as Array<any>).map((blockNumber) =>
        batch.addCall('eth_getBlockByNumber', [blockNumber, false])
      );

      return this.rpc.execute(batch)
        .then((_) =>  Promise.all(requests))
        .then((blocks) => blocks.map(format.block));
    }

    getBalances(addresses: Array<string>, blockNumber: number | string = 'latest'): Promise<{ [key:string]: any }> {
      const balances: { [key:string]: any } = {};
      let batch = new DefaultBatch();

      const requests = addresses.map(a =>
        batch.addCall('eth_getBalance', [a, blockNumber])
          .then((resp) => { balances[a] = resp; })
      );
      return this.rpc.execute(batch)
        .then((_) => Promise.all(requests))
        .then((_) => balances);
    }

    /**
     * Batch request transactions by hashes
     * @param hashes
     * @returns {Promise.<any>}
     */
    getTransactions(hashes: Array<string>): Promise<Array<any>> {
      let batch = new DefaultBatch();

      const requests = hashes.map(h =>
        batch.addCall('eth_getTransactionByHash', [h])
      );

      return this.rpc.execute(batch)
        .then((_) => Promise.all(requests));
    }

    /**
     * Many calls in one request
     */
    batchCall(calls: Array<{id: string, to: string, data: string}>, blockNumber: number | string = 'latest'): Promise<any> {
      let batch = new DefaultBatch();
      calls.forEach((c) => {
        batch.addCall("eth_call", [{to: c.to, data: c.data}, blockNumber])
      });
      return this.rpc.execute(batch).then((_) => {
        return Promise.all(batch.resolve());
      });
    }

}