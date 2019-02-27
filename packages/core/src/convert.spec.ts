import BigNumber from 'bignumber.js';
import * as convert from './convert';

const {
  toNumber, toHex, toBigNumber,
} = convert;

test('toNumber should convert hex string to number', () => {
  expect(toNumber('0x01')).toBe(1);
  expect(toNumber('0x')).toBe(0);
  expect(toNumber('0xF')).toBe(15);
});

test('toNumber should convert number to number', () => {
  expect(toNumber(1)).toBe(1);
  expect(toNumber(0)).toBe(0);
  expect(toNumber(15)).toBe(15);
});

describe('toHex', () => {
  it('convert decimal number to hex', () => {
    expect(toHex(10000000000)).toEqual('0x02540be400');
    expect(toHex('21000')).toEqual('0x5208');
    expect(toHex('100000000000000000000')).toEqual('0x056bc75e2d63100000');
  });

  it('convert BigNumber to hex', () => {
    expect(toHex(new BigNumber(21000))).toEqual('0x5208');
  });

  it('convert hex to hex', () => {
    expect(toHex('0x01')).toEqual('0x01');
  });
});

describe('toBigNumber', () => {
  it('convert 0x to zero', () => {
    expect(toBigNumber('0x')).toEqual(new BigNumber(0));
    expect(toBigNumber(undefined)).toEqual(new BigNumber(0));
  });

  it('convert hex string to BigNumber', () => {
    expect(toBigNumber('0xA')).toEqual(new BigNumber(10));
    expect(toBigNumber('0x0A')).toEqual(new BigNumber(10));
    expect(toBigNumber('0x1A')).toEqual(new BigNumber(26));
  });
});
