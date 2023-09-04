import { useState, useEffect } from 'react'

const signerAPIurl = process.env.NEXT_PUBLIC_SIGNER_URL

const defaultLiquidationCheque = {
  "address": "",
  "warning": "",
  "score": 0,
  "isLiquidated": false,
  "cheque": "",
  "bundleId": ""
}

export function useChequeFetcher(address: any) {

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
                // console.log("liquidationCheque:", JSON.stringify(data, null, 2))
                setliquidationCheque(data);
                setLoading(false);
            }
        };

        if (address) {
            fetchData();
            console.log(`useChequeFetcher: fetching for address ${address}`);
        } else {
            setliquidationCheque(defaultLiquidationCheque);
        }
    }, [address]);
    return ({liquidationCheque, isLoadingCheque})
}
