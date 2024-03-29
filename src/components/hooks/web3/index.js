import { useHooks } from "@/components/providers/web3"
import { useRouter } from "next/router"
import { useEffect } from "react"

const _isEmpty = data => {

    return (
        data == null ||
        data === '' ||
        (Array.isArray(data) && data.length === 0) ||
        (data.constructor === Object && Object.keys(data).length === 0)
    )
}

const enhanceHook = (swrRes) => {

    const { data, error } = swrRes
    const hasInitialResponse = !!(data || error)
    const isEmpty = hasInitialResponse && _isEmpty(data)

    return {
        ...swrRes,
        isEmpty,
        hasInitialResponse
    }
}

export const useAccount = () => {
    const swrRes = enhanceHook(useHooks(hooks => hooks.useAccount)())
    return {
        account: swrRes
    }
}

export const useAdmin = ({redirectTo}) => {
    const { account } = useAccount()
    const router = useRouter()

    useEffect(() => {
        if( 
            (account.hasInitialResponse && !account.isAdmin) || account.isEmpty 
        ) {
            router.push(redirectTo || '/')
            alert('Only admin address can access this page')
        }

    }, [account.data])

    return { account }
}

export const useNetwork = () => {
    const swrRes = enhanceHook(useHooks(hooks => hooks.useNetwork)())
    return {
        network: swrRes
    }
}

export const useOwnedCourses = (...args) => {
    const swrRes = enhanceHook(useHooks(hooks => hooks.useOwnedCourses)(...args))
  
    return {
      ownedCourses: swrRes
    }
}

export const useManagedItems = (...args) => {
    const swrRes = enhanceHook(useHooks(hooks => hooks.useManagedItems)(...args))
  
    return {
      managedItems: swrRes
    }
}

export const useOwnedCourse = (...args) => {
    const swrRes = enhanceHook(useHooks(hooks => hooks.useOwnedCourse)(...args))
  
    return {
      ownedCourse: swrRes
    }
}

export const useWalletInfo = () => {
    const { account } = useAccount()
    const { network } = useNetwork()

    const canPurchase = !!(account.data && network.data === 5)

    return {
        account,
        network,
        canPurchase
    }
}
