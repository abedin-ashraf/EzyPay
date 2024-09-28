import React from 'react'
import {
    CreditCard,
    Plus,
    Send
} from 'lucide-react'
import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { authOptions } from "../../lib/auth";
import { use } from "react";


async function getBalance() {
    const session = await getServerSession(authOptions);
    //@ts-ignore
    const userId = Number(session?.user?.id)
    if (!userId || userId == null) {
        return {
            amount: 0,
            locked: 0
        }
    }

    const balance = await prisma.balance.findFirst({
        where: {
            userId: userId
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

export default async function () {
    const balance = await getBalance();
    return (
        <div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row">
                    {/* Sidebar */}


                    {/* Main content */}
                    <main className="flex-1 lg:ml-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Summary</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <AccountCard
                                    title="Checking Account"
                                    balance={balance.amount}
                                    accountNumber="**** 1234"
                                />
                                <AccountCard
                                    title="Savings Account"
                                    balance="$15,245.00"
                                    accountNumber="**** 5678"
                                />
                                <AccountCard
                                    title="Credit Card"
                                    balance="$350.00"
                                    accountNumber="**** 9012"
                                    isCredit
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
                                <div className="bg-white shadow rounded-lg">
                                    <TransactionList />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                                <div className="bg-white shadow rounded-lg p-4 space-y-4">
                                    <QuickActionButton icon={<Send />} label="Transfer Money" />
                                    <QuickActionButton icon={<Plus />} label="Add Account" />
                                    <QuickActionButton icon={<CreditCard />} label="Pay Credit Card" />
                                </div>

                                <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Financial Insights</h2>
                                <div className="bg-white shadow rounded-lg p-4">
                                    <p className="text-sm text-gray-600">Your spending this month is 15% lower than last month. Great job on saving!</p>
                                    <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                        View Full Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}



function AccountCard({ title, balance, accountNumber, isCredit = false }: any) {
    return (
        <div className="bg-gray-50 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className={`text-2xl font-semibold ${isCredit ? 'text-red-600' : 'text-green-600'}`}>
                {balance}
            </p>
            <p className="text-sm text-gray-500">Account: {accountNumber}</p>
        </div>
    )
}

function TransactionList() {
    const transactions = [
        { id: 1, description: 'Grocery Store', amount: -85.32, date: '2024-09-27' },
        { id: 2, description: 'Salary Deposit', amount: 2500.00, date: '2024-09-26' },
        { id: 3, description: 'Electric Bill', amount: -120.50, date: '2024-09-25' },
        { id: 4, description: 'Online Shopping', amount: -64.99, date: '2024-09-24' },
    ]

    return (
        <ul className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
                <li key={transaction.id} className="px-6 py-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                        <p className={`text-sm font-semibold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                            {transaction.amount.toFixed(2)}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    )
}

function QuickActionButton({ icon, label }: any) {
    return (
        <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {React.cloneElement(icon, { className: 'mr-2 h-5 w-5' })}
            {label}
        </button>
    )
}