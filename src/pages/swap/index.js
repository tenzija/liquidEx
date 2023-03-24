import { useWalletInfo } from "@/components/hooks/web3";
import useParaswapSwap, { getSwapTransaction } from "@/components/providers/web3/hooks/useParaswapSwap"
import useParaswapTokens from "@/components/providers/web3/hooks/useParaswapTokens"
import { BridgeLayout } from "@/components/ui/layout"
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Head from "next/head";
import { Button } from "@/components/ui/common";

export default function Swap() {
    const [srcToken, setSrcToken] = useState(null);
    const [destToken, setDestToken] = useState(null);
    const [srcAmount, setSrcAmount] = useState('');
    const [srcDecimals, setSrcDecimals] = useState(0);
    const [destDecimals, setDestDecimals] = useState(0);
    const [transactionData, setTransactionData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { tokens } = useParaswapTokens();
    const { account, network } = useWalletInfo();
  
    const handleSubmit = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const transactionParams = await getSwapTransaction({
          srcToken,
          destToken,
          srcAmount,
          networkID: network?.data, // Polygon Network
          userAddress: account?.data,
          srcDecimals,
          destDecimals,
        })
        if(transactionParams !== null) {
          setTransactionData(transactionParams);
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const handleTx = async () => {
      try{
        if(transactionData != null) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const tx = signer.sendTransaction({
            to: transactionData?.to,
            data: transactionData?.data,
            value: transactionData?.value,
            from: transactionData?.from
          });
          tx.then((tx) => {
            console.log(tx);
          });
          setTransactionData(null);
        }
      } catch (err) {
        console.log(err);
      }
    }

    function getToken(address) {
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].address === address) {
          const token = tokens[i]
          console.log('token: ', token)
          return token;
        }
      }
    }

    useEffect(() => {
      setSrcDecimals(getToken(srcToken)?.decimals)
      setDestDecimals(getToken(destToken)?.decimals)
    }, [srcToken, destToken])

    useEffect(() => {
      handleSubmit()
    }, [srcToken, destToken, account.data, network.data, srcAmount])

    return (
        <>
          <Head><title>Swap</title></Head>
            <div className="flex justify-center">
              <div className="lightBlueGlassLessBlur mt-36 rounded-lg container fade-in-slide-up">
                <div className="w-full p-6 pb-2">
                  <div className="rounded-md h-full">
                    
                    <div>
                      <label htmlFor="srcToken">Source Token:</label>
                        <select value={srcToken} onChange={(e) => setSrcToken(e.target.value)}>
                          <option value="">Select token</option>
                          {tokens.map((token) => (
                              <option key={token.address} value={token.address}>
                              {token.symbol}
                              </option>
                          ))}
                        </select>
                    </div>
                    <div>
                      <label htmlFor="destToken">Destination Token:</label>
                        <select value={destToken} onChange={(e) => setDestToken(e.target.value)}>
                          <option value="">Select token</option>
                          {tokens.map((token) => (
                              <option key={token.address} value={token.address}>
                              {token.symbol}
                              </option>
                          ))}
                        </select>
                    </div>

                    <div>
                      <label htmlFor="srcAmount">Amount:</label>
                      <input
                          type="text"
                          id="srcAmount"
                          value={srcAmount}
                          onChange={(e) => setSrcAmount(e.target.value)}
                      />
                    </div>
                    {/* <button type="submit"
                      ///onClick={handleTx}
                    >Get TX Data</button> */}
                        
                    {isLoading && <p>Loading...</p>}
                    {transactionData && (
                        <div>
                        <h2>Transaction Data</h2>
                        <pre>{JSON.stringify(transactionData, null, 2)}</pre>
                        </div>
                    )}
                    {error && <p>Error: {error}</p>}
                    <Button
                      onClick={handleTx}
                      className='w-full border-indigo-600 text-lg fontTurrentRoad font-bold'
                    >Swap Tokens</Button>

                  </div>
                </div>
              </div>
            </div>
        </>
    )
}

Swap.Layout = BridgeLayout
