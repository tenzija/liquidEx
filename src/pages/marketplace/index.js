import { useWalletInfo } from '@components/hooks/web3'
import { CourseCard, CourseList } from "@components/ui/course"
import { BaseLayout, BridgeLayout } from "@components/ui/layout"
import { getAllCourses } from "@content/courses/fetcher"
import { Button } from '@/components/ui/common'
import { OrderModal } from '@/components/ui/order'
import { useState } from 'react'
import { MarketHeader } from '@/components/ui/marketplace'
import { useWeb3 } from '@/components/providers'
import { ethers } from 'ethers'
import Head from 'next/head'

export function getStaticProps() {
    const { data } = getAllCourses()
    return {
        props: {
            courses: data
        }
    }
}

export default function Marketplace({courses}) {
    const { contract } = useWeb3()
    const { canPurchase, account } = useWalletInfo()
    
    const [selectedCourse, setSelectedCourse] = useState(null)

    const purchaseItem = async (order) => {
        const hexItemId = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(selectedCourse.id));
        const hexItemIdWithPadding = ethers.utils.hexZeroPad(hexItemId, 16)
        const value = ethers.utils.parseEther((order.price).toString())

        const orderHash = ethers.utils.solidityKeccak256(
            ["bytes16", "address"],
            [hexItemIdWithPadding, account.data] 
        )

        const emailHash = ethers.utils.solidityKeccak256(
            ['string'], [order.email]
        )

        const proof = ethers.utils.solidityKeccak256(
            ['bytes32', 'bytes32'],
            [emailHash, orderHash]
        )

        try{
            await contract.purchaseItem(hexItemIdWithPadding, proof, {from: account.data, value})
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Head><title>Marketplace</title></Head>
            <MarketHeader />

            <CourseList
                courses={courses}
            >
                {
                    (course) => 
                        <CourseCard 
                            disabled={!canPurchase}
                            key={course.id} 
                            course={course}
                            Footer={() => 
                            <div className='mt-4'>
                                <Button 
                                    variant='light'
                                    disabled={!canPurchase}
                                    onClick={() => setSelectedCourse(course)}
                                >
                                    Purchase
                                </Button>
                            </div>}
                        />
                }
            </CourseList>
            { selectedCourse &&
            <OrderModal 
                onSubmit={purchaseItem}
                course={selectedCourse}
                setSelectedCourse={setSelectedCourse}
            />
            }
        </>
  )
}

Marketplace.Layout = BridgeLayout
