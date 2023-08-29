'use client'

import { useEffect, useState } from "react";
import { BaseError } from 'viem'
import { use } from 'react'
import { type Address, useNetwork, useContractRead, useWalletClient, usePrepareContractWrite, useAccount, useContractWrite, useWaitForTransaction} from 'wagmi'
import { stringify } from '../utils/stringify'
import { UpalaConstants } from '@upala/constants';

export function UpalaIDRead({ params }: { params: any }) {
    console.log("address: ", params.account?.address)
    // check Upala ID
    const readUpalaIDParams = {
      ...params, 
      functionName: 'myId',
    }
    const { data: upalaID, isRefetching, refetch } 
      = useContractRead({
        ...readUpalaIDParams, 
        onSettled(data, error) {
          console.log('Settled', { data, error })
        },
        onError(error) {
          console.log('Error', error)
        },})
  
    const gotUpalaID = Boolean(upalaID) && upalaID !== "0x0" && upalaID !== "0x0000000000000000000000000000000000000000"
    console.log(upalaID)
    console.log("upalaID", upalaID)
    console.log("gotUpalaID", gotUpalaID)
    console.log("params", params)

    return (
      
      <div>
        <div>
  <b>2. Create an Upala ID</b>
  {gotUpalaID ? '[✓]' : '[_]'}

  <br />
  Your Upala ID: { upalaID ? upalaID.toString() : 'notfff yet registered or already liquidated'}
 
  <br />
  <br />
        </div>
      </div>
    )
  }
  

