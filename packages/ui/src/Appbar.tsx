import { Button } from "./button";
import { Bell } from "lucide-react";

interface AppbarProps {
    user?: {
        name?: string | null;
    }
    onSignin: any,
    onSignout: any
}

export const Appbar = ({
    user,
    onSignin,
    onSignout
}: AppbarProps) => {
    return <div className="flex justify-between border-b px-4">
        {/* <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">MyBank</h1>
                    <div className="flex items-center">
                        <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <Bell className="h-6 w-6" />
                        </button>
                        <button className="ml-3 bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="sr-only">Open user menu</span>
                            <img
                                className="h-8 w-8 rounded-full"
                                src="/placeholder.svg?height=32&width=32"
                                alt="User avatar"
                            />
                        </button>
                    </div>
                </div>
            </header> */}
        <div className="text-lg flex flex-col justify-center">
            EzyPay
        </div>
        <div className="flex pt-2">
            <Button onClick={user ? onSignout : onSignin}>{user ? "Logout" : "Login"}</Button>
            <div className="flex">
                <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Bell className="h-6 w-6" />
                </button>
                {/* <button className="ml-3 bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    <img
                        className="h-8 w-8 rounded-full"
                        src="/placeholder.svg?height=32&width=32"
                        alt="User avatar"
                    />
                </button> */}
            </div>

        </div>
    </div>
}