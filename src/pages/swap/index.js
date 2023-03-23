import { useWalletInfo } from "@/components/hooks/web3";
import useParaswapSwap, { getSwapTransaction } from "@/components/providers/web3/hooks/useParaswapSwap"
import useParaswapTokens from "@/components/providers/web3/hooks/useParaswapTokens"
import { BridgeLayout } from "@/components/ui/layout"
import { useState } from "react";
import { ethers } from "ethers";

export default function Swap() {
    const [srcToken, setSrcToken] = useState(null);
    const [destToken, setDestToken] = useState(null);
    const [srcAmount, setSrcAmount] = useState('');
    const [transactionData, setTransactionData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { tokens } = useParaswapTokens();
    const { account, network } = useWalletInfo();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      console.log('handleSubmit 1')
  
      try {
        console.log('handleSubmit 2')
        const transactionParams = await getSwapTransaction({
          srcToken,
          destToken,
          srcAmount,
          networkID: network?.data, // Polygon Network
          userAddress: account?.data,
        });
        console.log('handleSubmit 3')
        console.log('transactionData: ', transactionParams)
        setTransactionData(transactionParams);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // const handleTx = () => {
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   const signer = provider.getSigner();
    //   const tx = signer.sendTransaction({
    //     to: transactionData?.to,
    //     data: transactionData?.data,
    //     value: transactionData?.value,
    //     from: transactionData?.from
    //   });
    //   tx.then((tx) => {
    //     console.log(tx);
    //   });
    // }

    function getToken(symbol) {
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].symbol === symbol) {
          const token = tokens[i]
          console.log('token: ', token)
          if (!token)
            throw new Error(`Token ${symbol} not available`);
          return token;
        }
      }
    }

    return (
        <>
          {/* {console.log('srcToken: ', srcToken)}
          {console.log('destToken: ', destToken)}
          {console.log('tokens', tokens.length)} */}
            <div className="flex justify-center">
                <div className="lightBlueGlassLessBlur mt-36 rounded-lg container fade-in-slide-up">
                <h1>Token Swap</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                    <label htmlFor="srcToken">Source Token:</label>
                    {/* <input
                        type="text"
                        id="srcToken"
                        value={srcToken}
                        onChange={(e) => setSrcToken(e.target.value)}
                    /> */}
                     <select value={srcToken} onChange={(e) => setSrcToken(e.target.value)}>
                        <option value="">Select token</option>
                        {tokens.map((token) => (
                            <option key={token.address} value={token.symbol}>
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
                            <option key={token.address} value={token.symbol}>
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
                    <button type="submit"
                      onClick={() => {getToken(srcToken); getToken(destToken)}}
                    >Swap</button>
                </form>
                {isLoading && <p>Loading...</p>}
                {transactionData && (
                    <div>
                    <h2>Transaction Data</h2>
                    <pre>{JSON.stringify(transactionData, null, 2)}</pre>
                    </div>
                )}
                {error && <p>Error: {error}</p>}
                </div>
            </div>
        </>
    )
}

Swap.Layout = BridgeLayout
