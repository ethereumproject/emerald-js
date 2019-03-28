import {JsonRpcError, JsonRpcRequest, JsonRpcResponse, Transport} from './JsonRpc';

export class RawBatchResponse {
  private readonly _results: Array<any> = [];
  private readonly _batch: Batch;

  constructor(results: Array<any>, batch: Batch) {
    this._results = results;
    this._batch = batch;
  }

  get results(): Array<any> {
    return this._results;
  }

  get batch(): Batch {
    return this._batch;
  }

  resolve(): Promise<any> {
    return Promise.all(this._batch.resolve());
  }
}

/**
 * Batch of JSON RPC calls
 */
export interface Batch {
  /**
   * Add new call to current batch
   *
   * @param method
   * @param params
   * @returns promise for the method execution result
   */
  addCall(method: string, params: any): Promise<any>;

  /**
   * @returns raw JSON RPC data in that batch
   */
  getItems(): Array<BatchItem>;

  /**
   * Resolves all promises in current batch. Please note that 'resolve' is in terms of batch, and any particular
   * promise may still be rejected, depending on the state of the response.
   */
  resolve(): Array<Promise<any>>;

  /**
   * Rejects all promises, regardless state
   *
   * @param reason optional error to pass to reject
   */
  reject(reason?: any);
}

export type BatchItem = {
  request: JsonRpcRequest,
  response?: JsonRpcResponse,
  resolve?: (value?: any | PromiseLike<any>) => void,
  reject?: (reason?: any) => void,
  promise?: Promise<any>
}

export class DefaultBatch implements Batch {
  calls: Array<BatchItem> = [];

  constructor() {
  }

  addCall(method: string, params: any): Promise<any> {
    const request = {
      jsonrpc: '2.0',
      method,
      params,
      id: 0,
    };
    let item: BatchItem = {
      request: request,
    };
    item.promise = new Promise(function (resolve, reject) {
      item.resolve = resolve;
      item.reject = reject;
    });
    this.calls.push(item);
    return item.promise;
  }

  processResponse(item: BatchItem): Promise<any> {
    const json = item.response;
    if (typeof json == 'undefined' || json === null) {
      item.reject(new Error(`JSON RPC response wasn't received,
                     method: ${item.request.method},
                     params: ${JSON.stringify(item.request.params)}`))
    } else if (json.error) {
      item.reject(new JsonRpcError(json.error));
    } else if (json.result || json.result === false || json.result === null || json.result === '') {
      item.resolve(json.result);
    } else {
      item.reject(new Error(`Unknown JSON RPC response: ${JSON.stringify(json)},
                     method: ${item.request.method},
                     params: ${JSON.stringify(item.request.params)}`));
    }
    return item.promise;
  }

  resolve(): Array<Promise<any>> {
    return this.calls.map(this.processResponse);
  }

  reject(reason?: any) {
    this.calls.forEach((item) => item.reject(reason))
  }

  getItems(): Array<BatchItem> {
    return this.calls;
  }
}

/**
 * Joins few separate batches into one batch
 */
export class JoinedBatch implements Batch {
  batches: Array<Batch>;

  constructor(...batches: Array<Batch>) {
    this.batches = batches;
  }

  addCall(method: string, params: any): Promise<any> {
    throw new Error('Not Supported by JoinedBatch');
  }

  getItems(): Array<BatchItem> {
    let items = [];
    this.batches.forEach((batch) =>
      batch.getItems().forEach((item) => items.push(item))
    );
    return items;
  }

  resolve(): Array<Promise<any>> {
    let results = [];
    this.batches.forEach((item) => results.push(item.resolve()));
    return results;
  }

  reject(reason?: any) {
    this.batches.forEach((item) => item.reject(reason))
  }
}

/**
 * Batch wrapper that ignores calls for resolve/reject.
 */
export class UnresolvableBatch implements Batch {
  delegate: Batch;

  constructor(delegate: Batch) {
    this.delegate = delegate;
  }

  addCall(method: string, params: any): Promise<any> {
    return this.delegate.addCall(method, params);
  }

  getItems(): Array<BatchItem> {
    return this.delegate.getItems();
  }

  reject(reason?: any) {
  }

  resolve(): Array<Promise<any>> {
    return [];
  }

}