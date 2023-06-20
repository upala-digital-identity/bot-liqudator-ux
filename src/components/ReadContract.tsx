'use client'

import { useEffect, useState } from "react";
import { BaseError } from 'viem'
import { type Address, useNetwork, useContractRead, useWalletClient, usePrepareContractWrite, useAccount, useContractWrite, useWaitForTransaction} from 'wagmi'
import { wagmiContractConfig } from './contracts'
import contracts from './constants'
import { signerAPIurl, bundleId } from "../app.config.js";
import { stringify } from '../utils/stringify'

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
  "cheque": ""
}

function TotalSupply() {
  const { data: walletClient} = useWalletClient()
  const { chain } = useNetwork()
  const { address } = useAccount()
  const [liquidationCheque, setData] = useState(defaultLiquidationCheque);
  const [isLoadingCheque, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let data: any = {};
      try {
        const apiKey = "sdaf";
        const url = signerAPIurl.dev + "?stamp=Discord&address=" + address;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "X-API-KEY": apiKey,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
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
      setData(null);
    }
  }, [address]);


  // check Upala ID
  const { data: upalaID, isRefetching, refetch } = useContractRead({
    address: contracts[31337][0].contracts.Upala.address,
    abi: contracts[31337][0].contracts.Upala.abi,
    functionName: 'myId',
    account: walletClient?.account
  })
  const gotUpalaID = !Boolean(upalaID) || upalaID === "0x0" || upalaID === "0x0000000000000000000000000000000000000000"


  // register Upala ID
  const { config: newIdentityConfig } = usePrepareContractWrite({
    address: contracts[31337][0].contracts.Upala.address,
    abi: contracts[31337][0].contracts.Upala.abi,
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
    address: contracts[31337][0].contracts.SignedScoresPool.address,
    abi: contracts[31337][0].contracts.SignedScoresPool.abi,
    functionName: "attack",
    args: [ 
      upalaID as Address,
      address as Address,
      liquidationCheque?.score,
      bundleId.discord as Address, // TODO not an address, actually (long hash)
      liquidationCheque?.cheque as Address,
     ],
    // enabled: !gotUpalaID,  // no Upala ID TODO 
  })
  console.log(liquidateConfig)
  const { write: liquidate, data: liquidationData, error: liquidationError, isLoading: isLiqLoading, isError: isLiqError } = useContractWrite(newIdentityConfig)
  const {
    data: liqReceipt,
    isLoading: isLiqPending,
    isSuccess: isLiqSuccess,
  } = useWaitForTransaction({ hash: newIDdata?.hash })

  return (
    <div>
      <h2>Data from API: {isLoadingCheque}</h2>
      <pre>{JSON.stringify(liquidationCheque, null, 2)}</pre>
      Upala ID: {upalaID?.toString()}
      <button
          disabled={isRefetching}
          onClick={() => refetch()}
          style={{ marginLeft: 4 }}
        >
          {isRefetching ? 'loading...' : 'refetch'}
        </button>

        <button
          disabled={!newId}
          onClick={() => newId && newId()}
          style={{ marginLeft: 4 }}
        >
          {isNewIdLoading ? 'loading...' : 'New Upala ID'}
        </button>

      <button
          disabled={!liquidate}
          onClick={() => liquidate && liquidate()}
          style={{ marginLeft: 4 }}
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
