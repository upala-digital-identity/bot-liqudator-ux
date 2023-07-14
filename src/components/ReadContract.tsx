'use client'

import { useEffect, useState } from "react";
import { BaseError } from 'viem'
import { type Address, useNetwork, useContractRead, useWalletClient, usePrepareContractWrite, useAccount, useContractWrite, useWaitForTransaction} from 'wagmi'
import { stringify } from '../utils/stringify'
import { UpalaConstants } from '@upala/constants';

export function ReadContract() {
  return (
    <div>
      <div>
        <TotalSupply />
      </div>
    </div>
  )
}

const signerAPIurl = process.env.NEXT_PUBLIC_SIGNER_URL
const poolAddress = process.env.NEXT_PUBLIC_POOL_ADDRESS

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
  const [liquidationCheque, setliquidationCheque] = useState(defaultLiquidationCheque);
  const [isLoadingCheque, setLoading] = useState(true);

  // check if address got a liquidation cheque
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let data: any = {};
      try {
        const url = signerAPIurl + "?stamp=Discord&address=" + address;
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

        // setliquidationCheque(responseData);
      } catch (error: any) {
        console.log(error);
        data.error = error.message;
      } finally {
        console.log("liquidationCheque:", JSON.stringify(data, null, 2))
        setliquidationCheque(data);
        setLoading(false);
      }
    };

    if (address) {
      fetchData();
      console.log(`DataFetcher: fetching for address ${address}`);
    } else {
      setliquidationCheque(defaultLiquidationCheque);
    }
  }, [address]);

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
  const gotUpalaID = Boolean(upalaID) && upalaID !== "0x0" && upalaID !== "0x0000000000000000000000000000000000000000"


  // register Upala ID
  const { config: newIdentityConfig } = usePrepareContractWrite({
    address: upConst?.getAddress("Upala"),
    abi: upalaAbi,
    functionName: 'newIdentity',
    args: [address as Address],
    enabled: !gotUpalaID,
  })
  const { write: newId, data: newIDdata, error, isLoading: isNewIdLoading, isError } = useContractWrite(newIdentityConfig)
  const {
    data: receipt,
    isLoading: isPending,
    isSuccess,
  } = useWaitForTransaction({ hash: newIDdata?.hash })


  // prepare liquidation
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
    enabled: gotUpalaID,
  })
  // liquidate
  const { 
      write: liquidate,
      data: liquidationData,
      error: liquidationError,
      isLoading: isLiqLoading,
      isError: isLiqError 
    } = useContractWrite(liquidateConfig)
  // wait for transaction 
  const {
    data: liqReceipt,
    isLoading: isLiqPending,
    isSuccess: isLiqSuccess,
  } = useWaitForTransaction({ hash: newIDdata?.hash })

  return (
    <div>
      

      <b>1. Verifiy discord stamp for your address at <a href="https://passport.gitcoin.co">Gitcoin Passport</a></b>
      {liquidationCheque?.score > 0 ? '[✓]' : '[_]'}
      {isLoadingCheque ? 'loading...' : ''}
      <br />
      <br />
      <b>2. Create an Upala ID</b>
      {gotUpalaID ? '[✓]' : '[_]'}
      <button
          disabled={!newId}
          onClick={() => newId && newId()}
          style={{ marginLeft: 4 }}
        >
          {isNewIdLoading ? 'loading...' : 'New Upala ID'}
        </button>
      <br />
      Your Upala ID: { upalaID ? upalaID.toString() : 'not yet registered or already liquidated'}
      {/* <button
          disabled={isRefetching}
          onClick={() => refetch()}
          style={{ marginLeft: 4 }}
        >
          {isRefetching ? 'loading...' : 'refetch'}
        </button> */}


      <br />
      <br />
      <b>3. Liquidate your Upala ID </b>
      <button
          disabled={!liquidate}
          onClick={() => liquidate && liquidate()}
        >
          {isLiqLoading ? 'loading...' : 'Liquidate'}
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
