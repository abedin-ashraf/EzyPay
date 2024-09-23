import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import { OnRampTransactions } from "../../../components/OnRampTransaction"

async function getOnRampTransactions(status: any) {
    const session = await getServerSession(authOptions)
    //@ts-ignore
    const userId = Number(session?.user?.id)
    if (!userId || userId == null) {
        return {
            time: "No recent Transaction"
        }
    }
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: userId,
            status: status,
        },
    })
    return txns.map((t) => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider,
    }))
}

async function getsentP2PTransactions() {
    const session = await getServerSession(authOptions)
    //@ts-ignore
    const userId = Number(session?.user?.id)
    if (!userId || userId == null) {
        return {
            time: "No recent Transaction"
        }
    }
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: userId,
        },
    })

    return txns.map((t) => ({
        time: t.timestamp,
        amount: t.amount,
        status: "Success",
        provider: t.toUserId,
    }))
}

async function getreceiveP2PTransactions() {
    const session = await getServerSession(authOptions)
    //@ts-ignore
    const userId = Number(session?.user?.id)
    if (!userId || userId == null) {
        return {
            time: "No recent Transaction"
        }
    }
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            toUserId: userId,
        },
    })

    return txns.map((t) => ({
        time: t.timestamp,
        amount: t.amount,
        status: "Success",
        provider: t.fromUserId,
    }))
}

export default async function () {
    const successTransactions = await getOnRampTransactions("Success")
    const processingTransactions = await getOnRampTransactions("Processing")
    const failureTransactions = await getOnRampTransactions("Failure")
    const sentTransactions: any = await getsentP2PTransactions()
    const receivedTransactions: any = await getreceiveP2PTransactions()

    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                Transactions
            </h1>

            <div className="w-[80vw] grid grid-cols-1 md:grid-cols-2 px-10 gap-3">
                <h1 className="text-2xl text-[#6a51a6] pt-2 font-bold col-span-2">
                    P2P Transactions
                </h1>
                <div>
                    <OnRampTransactions
                        title={"Sent transactions"}
                        transactions={sentTransactions}
                    />
                </div>
                <div>
                    <OnRampTransactions
                        title={"Received transactions"}
                        transactions={receivedTransactions}
                    />
                </div>
            </div>

            <div className="w-[80vw] grid grid-cols-1 md:grid-cols-2 px-10 gap-3">
                <h1 className="text-2xl text-[#6a51a6] pt-2 font-bold col-span-2">
                    Wallet Transactions
                </h1>
                <div>
                    <OnRampTransactions
                        title={"Successfull transactions"}
                        //@ts-ignore
                        transactions={successTransactions}
                    />
                </div>

                <div>
                    <OnRampTransactions
                        title={"Processing Transactions"}
                        //@ts-ignore
                        transactions={processingTransactions}
                    />
                </div>

                <div>
                    <OnRampTransactions
                        title={"Failure Transactions"}
                        //@ts-ignore
                        transactions={failureTransactions}
                    />
                </div>
            </div>
        </div>
    )
}
