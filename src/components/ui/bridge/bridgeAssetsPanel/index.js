import { ChevronDownIcon } from '@heroicons/react/solid'
import NumericalInput from '../../common'
import Typography from '../../common'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
//import BridgeModal from 'app/modals/BridgeModal/BridgeModal'
import { Button } from '../../common'
import { LoaderSmall } from '../../common/loader'
import { escapeRegExp } from '../../common/container'

const BridgeAssetPanel = (
    {
    error,
    header,
    walletToggle,
    currency,
    value,
    onChange,
    selected,
    onSelect,
    spendFromWallet,
    priceImpact,
    priceImpactCss,
    disabled,
    currencies,
    inputType,
    amountToParaswap,
    isParaswap,
    priceRate,
}
) => {
    // console.log('###################', currency);
    return (
        <div className="rounded-[14px] bg-[#1D2231] p-2 pl-3 pr-3 pt-3 flex flex-col gap-4 swap_prnt">
            {/* original className="rounded-[14px] bg-[#1D2231] p-3 flex flex-col gap-4 swap_prnt" */}
            {header(
                {
                disabled,
                onChange,
                value,
                currency,
                currencies,
                onSelect,
                walletToggle,
                spendFromWallet,
                inputType,
                amountToParaswap,
                isParaswap,
                priceRate
            }
            )}
            <div className="flex gap-1 justify-between px-1.5 float-right flex-row-reverse pb-2 items-start">

            </div>
        </div>
    )
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

const defaultClassName = 'w-0 p-0 text-2xl bg-transparent'

export const InputPanel = ({ currency,
    value,
    onUserInput,
    placeholder,
    className = defaultClassName,
    ...rest
  }) => {
    //const usdcValue = useUSDCValue(tryParseAmount(value || '1', currency))
    const span = useRef(null)
    const [width, setWidth] = useState(0)

    const enforcer = (nextUserInput) => {
        if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
          onUserInput(nextUserInput)
        }
      }



    return (
        <>
            {/* <Typography weight={700} variant="h3" className="relative flex items-baseline flex-grow gap-3">
                    <>
                        <NumericalInput
                            disabled={disabled}
                            value={amount || ''}
                            onUserInput={onChange}
                            placeholder="0.00"
                            className="leading-[36px] bannerBridgeInput focus:placeholder:text-low-emphesis flex-grow w-full text-left bg-transparent text-inherit disabled:cursor-not-allowed"
                        />
                    </>
                <Typography
                    variant="sm"
                    className="absolute mt-8 text-secondary top-margin" // original className="absolute mt-8 text-secondary top-1"
                    component="span"
                    style={{ left: width }}
                >
                    <div className='pt-1'>
                        {/* // ^ original className='mt-1' */}
                        {/* <span onClick={() => { setAmount(selectedTokenBalance) }} className='balance_brdg'>Balance:&nbsp;
                            {selectedTokenBalance != '' ?
                                parseFloat(selectedTokenBalance).toFixed(4)
                                :
                                < div className='relative bottom-4 ml-14' >
                                    <LoaderSmall size='12px' stroke='#7F7F7F' />
                                </div>
                            }

                        </span> */}
                   {/*  </div>
                </Typography >
            </Typography > */}
            <div className='text-2xl leading-7 tracking-[-0.01em] relative flex items-baseline flex-grow gap-3 font-bold'>
                <>
                <input
                    value={value}
                    onChange={(event) => {
                    // replace commas with periods, because uniswap exclusively uses period as the decimal separator
                    enforcer(event.target.value.replace(/,/g, '.'))
                    }}
                    // universal input options
                    inputMode="decimal"
                    title="Token Amount"
                    autoComplete="off"
                    autoCorrect="off"
                    // text-specific options
                    type="text"
                    pattern="^[0-9]*[.,]?[0-9]*$"
                    placeholder='0.0'
                    min={0}
                    minLength={1}
                    maxLength={79}
                    spellCheck="false"
                    className=
                    'relative font-bold outline-none border-none flex-auto overflow-hidden overflow-ellipsis placeholder-low-emphesis focus:placeholder-primary'
                />
                </>
            </div>
        </>
    )
}

export const BridgeAssetPanelHeader = ({ bridgedTo, chainId, tokens, setTokens, selectedToken, setSelectedToken, account, anyToken, setAnyToken, underlyingToken, setUnderlyingToken, routerContract, setRouterContract, chainTo, chainFrom, amount, setAmount }) => {

    let [isOpen, setIsOpen] = useState(false)
    const [pops, setPops] = useState('')

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    const bridgeURL = `https://bridgeapi.anyswap.exchange/v4/tokenlistv4/${chainId}`

    // async function getBridge() {
    //     try {
    //         const { data, status } = await axios.get<GetBridgeResponse>(
    //             bridgeURL,
    //             {
    //                 headers: {
    //                     Accept: 'application/json',
    //                 }
    //             },
    //         )

    //         //console.log(JSON.stringify(data, null, 4))

    //         //console.log('response staus is: ', status)

    //         return data
    //     } catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             //console.log('error message: ', error.message)
    //             return error.message
    //         } else {
    //             //console.log('unexpected error: ', error)
    //             return 'An unexpected error occurred'
    //         }
    //     }
    // }

    // async function getData() {
    //     const res = await getBridge()
    //     const data = {}
    //     const tokens = Object.keys(res);
    //     for (let i = 0; i < tokens.length; i++) {
    //         const currTokenData = res[tokens[i]];
    //         const currDestChains = Object.keys(currTokenData.destChains);

    //         if (currDestChains.includes(bridgedTo)) {
    //             const logoUrl = res[tokens[i]].logoUrl
    //             const isNative = res[tokens[i]].tokenType
    //             const srcAddress = res[tokens[i]].address
    //             const originalSymbol = res[tokens[i]].symbol
    //             const originalDecimals = res[tokens[i]].decimals
    //             const newTokenData = currTokenData.destChains[bridgedTo][Object.keys(currTokenData.destChains[bridgedTo])[0]];
    //             newTokenData.srcAddress = srcAddress
    //             newTokenData.logoUrl = logoUrl;
    //             newTokenData.isNative = isNative
    //             newTokenData.originalDecimals = originalDecimals
    //             newTokenData.originalSymbol = originalSymbol
    //             data[tokens[i]] = newTokenData;
    //             if (selectedToken == '' && pops == '') {
    //                 if (res[tokens[i]].symbol == 'POPS') {
    //                     setSelectedToken(tokens[i])
    //                     setPops(tokens[i])
    //                 }
    //             } else if (selectedToken != '') {
    //                 if (res[tokens[i]].symbol == tokens[selectedToken]?.symbol) {
    //                     setSelectedToken(selectedToken)
    //                 }
    //             }
    //         }
    //     }
    //     setTokens(data)
    // }

    // useEffect(() => {
    //     setAnyToken(tokens[selectedToken]?.fromanytoken.address)
    //     setUnderlyingToken(tokens[selectedToken]?.underlying.address)
    //     setRouterContract(tokens[selectedToken]?.router)
    // }, [selectedToken, tokens])

    // useEffect(() => {
    //     if (tokens[selectedToken]?.symbol == undefined) {
    //         setSelectedToken(pops)
    //     }
    // }, [bridgedTo, chainId, tokens[selectedToken]])

    // useEffect(() => {
    //     setPops('')
    //     setSelectedToken('')
    // }, [chainId])

    // useEffect(() => {
    //     getBridge()
    //     getData()

    // }, [bridgedTo, chainId, amount, pops])


    return (
        <>
            <div className="flex flex-row-reverse items-end justify-between float-right gap-2">
                {account == null || chainId.toString() == bridgedTo ?
                    <Button
                        color="blue"
                        variant="filled"
                        size="sm"
                        className="bannerSwapCurrency flex items-center gap-2 px-2 py-1 shadow-md cursor-pointer text-high-emphesis bg-[#292D3C] hover:bg-dark-700 pb-1 mt-1"
                        // original className="bannerSwapCurrency flex items-center gap-2 px-2 py-1 shadow-md cursor-pointer text-high-emphesis bg-[#292D3C] hover:bg-dark-700 pb-1"
                        style={{ zIndex: '1' }}
                        disabled
                        type='button'
                    >
                        <img src='https://assets.coingecko.com/coins/images/11939/large/SHIBLOGO.png' width='24px' height='24px' alt='' />
                        <span>SHIB</span>
                        <ChevronDownIcon width={18} />
                    </Button> :
                    selectedToken == '' || tokens[selectedToken] == undefined ?
                        <Button
                            color="blue"
                            variant="filled"
                            size="sm"
                            className="bannerSwapCurrency flex items-center gap-2 px-2 py-1 shadow-md cursor-pointer text-high-emphesis bg-[#292D3C] hover:bg-dark-700 pb-1 mt-1"
                            // original className="bannerSwapCurrency flex items-center gap-2 px-2 py-1 shadow-md cursor-pointer text-high-emphesis bg-[#292D3C] hover:bg-dark-700 pb-1"
                            style={{ zIndex: '1' }}
                            onClick={openModal}
                            type='button'
                        >
                            <LoaderSmall />
                            <ChevronDownIcon width={18} />
                        </Button> :
                        <Button
                            color="blue"
                            variant="filled"
                            size="sm"
                            className="bannerSwapCurrency flex items-center gap-2 px-2 py-1 shadow-md cursor-pointer text-high-emphesis bg-[#292D3C] hover:bg-dark-700 pb-1 mt-1"
                            // original className="bannerSwapCurrency flex items-center gap-2 px-2 py-1 shadow-md cursor-pointer text-high-emphesis bg-[#292D3C] hover:bg-dark-700 pb-1"
                            style={{ zIndex: '1' }}
                            onClick={openModal}
                            type='button'
                        >
                            <img src={tokens[selectedToken]?.logoUrl} width='24px' height='24px' alt='' />
                            <span>{tokens[selectedToken]?.originalSymbol}</span>
                            {/* {i18n._(t`${tokens[selectedToken]?.symbol}`)} */}
                            <ChevronDownIcon width={18} />
                        </Button>
                }
            </div>
            {/* <BridgeModal
                isOpen={isOpen}
                tokens={tokens}
                setIsOpen={setIsOpen}
                setSelectedToken={setSelectedToken}
            /> */}
        </>
    )
}

BridgeAssetPanel.Header = BridgeAssetPanelHeader
BridgeAssetPanel.Panel = InputPanel

export default BridgeAssetPanel