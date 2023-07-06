'use client'

import { useEffect, useState } from "react";
import { BaseError } from 'viem'
import { type Address, useNetwork, useContractRead, useWalletClient, usePrepareContractWrite, useAccount, useContractWrite, useWaitForTransaction} from 'wagmi'
import { signerAPIurl, poolAddress } from "../app.config.js";
import { stringify } from '../utils/stringify'
const { UpalaConstants } = require('@upala/constants')

export function ReadContract() {
  return (
    <div>
      <div>
        <TotalSupply />
      </div>
    </div>
  )
}
const defaultLiquidationCheque = {
  "address": "",
  "warning": "",
  "score": 0,
  "isLiquidated": false,
  "cheque": "",
  "bundleId": ""
}

function TotalSupply() {
  const { data: walletClient} = useWalletClient()
  const { chain } = useNetwork()
  const { address } = useAccount()
  const [liquidationCheque, setData] = useState(defaultLiquidationCheque);
  const [isLoadingCheque, setLoading] = useState(true);

  // check if address got a liquidation cheque
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let data: any = {};
      try {
        const url = signerAPIurl.dev + "?stamp=Discord&address=" + address;
        const apiKey = process.env.NEXT_PUBLIC_GC_KEY || undefined
        if (!apiKey) {
          throw new Error("Cheque signer: No api key provided");
        }
        const response = await fetch(url, {
          method: "GET",
          headers: {
            'X-API-KEY': apiKey,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) {
          throw new Error("Cheque signer: Failed to fetch data");
        }

        const responseData = await response.json();
        data = responseData;

        // setData(responseData);
      } catch (error: any) {
        console.log(error);
        data.error = error.message;
      } finally {
        setData(data);
        setLoading(false);
      }
    };

    if (address) {
      fetchData();
      console.log(`DataFetcher: fetching for address ${address}`);
    } else {
      setData({});
    }
  }, [address]);

  // console.log("chainnnn:", chain?.id)
  // check Upala ID
  let upConst
  if (chain?.id) {
    upConst = new UpalaConstants(chain?.id)
  }
  const upalaAbi: ReadonlyArray<Object> = upConst?.getAbi('Upala');

  const { data: upalaID, isRefetching, refetch } = useContractRead({
    address: upConst?.getAddress("Upala"),
    abi: upalaAbi,
    functionName: 'myId',
    account: walletClient?.account
  })
  const gotUpalaID = !Boolean(upalaID) || upalaID === "0x0" || upalaID === "0x0000000000000000000000000000000000000000"


  // register Upala ID
  const { config: newIdentityConfig } = usePrepareContractWrite({
    address: upConst?.getAddress("Upala"),
    abi: upalaAbi,
    functionName: 'newIdentity',
    args: [address as Address],
    enabled: gotUpalaID,
  })
  const { write: newId, data: newIDdata, error, isLoading: isNewIdLoading, isError } = useContractWrite(newIdentityConfig)
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
  } = useWaitForTransaction({ hash: newIDdata?.hash })


  // liqudate
  const { config: liquidateConfig } = usePrepareContractWrite({
    address: poolAddress as Address,
    abi: upConst?.getAbi("SignedScoresPool"),
    functionName: "attack",
    args: [ 
      upalaID as Address,
      address as Address,
      liquidationCheque?.score,
      liquidationCheque?.bundleId as Address,
      liquidationCheque?.cheque as Address,
     ],
    // enabled: !gotUpalaID,  // no Upala ID TODO 
  })
  console.log(liquidateConfig)
  const { write: liquidate, data: liquidationData, error: liquidationError, isLoading: isLiqLoading, isError: isLiqError } = useContractWrite(liquidateConfig)
  const {
    data: liqReceipt,
    isLoading: isLiqPending,
    isSuccess: isLiqSuccess,
  } = useWaitForTransaction({ hash: newIDdata?.hash })

  return (
    <div>
      

      <b>Liqudation cheque: {isLoadingCheque}</b>
      <pre>{JSON.stringify(liquidationCheque, null, 2)}</pre>

      <p><b>Upala ID:</b> {upalaID?.toString()}
      {/* <button
          disabled={isRefetching}
          onClick={() => refetch()}
          style={{ marginLeft: 4 }}
        >
          {isRefetching ? 'loading...' : 'refetch'}
        </button> */}
        <button
          disabled={!newId}
          onClick={() => newId && newId()}
          style={{ marginLeft: 4 }}
        >
          {isNewIdLoading ? 'loading...' : 'New Upala ID'}
        </button>
        </p> 


      <button
          disabled={!liquidate}
          onClick={() => liquidate && liquidate()}
        >
          {isNewIdLoading ? 'loading...' : 'Liquidate'}
        </button>


      {isNewIdLoading && <div>Check wallet...</div>}
      {isPending && <div>Transaction pending...</div>}
      {isSuccess && (
        <>
          <div>Transaction Hash: {newIDdata?.hash}</div>
          <div>
            Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
          </div>
        </>
      )}
      {isError && <div>{(error as BaseError)?.shortMessage}</div>}
      </div>
    )
}
