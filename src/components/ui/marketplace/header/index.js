import { useAccount } from "@/components/hooks/web3";
import { Breadcrumbs } from "../../common";
import { EthRates, WalletBar } from "../../web3";

export default function Header() {
    const { account } = useAccount()

    const LINKS = [{
        href: '/marketplace/courses/buy',
        value: 'Buy'
    }, {
        href: '/marketplace/courses/owned',
        value: 'Owned'
    }, {
        href: '/marketplace/courses/managed',
        value: 'Manage',
        requireAdmin: true
    }]

    return (
        <>
            <div className="pt-4">
                <WalletBar />
            </div>
            <EthRates />
            <div className='flex flex-row-reverse p-4 sm:px-6 lg:px-8 justify-center fontTurrentRoad'>
                <Breadcrumbs
                    isAdmin={account.isAdmin}
                    items={LINKS}
                />
            </div>
        </>
    )
}