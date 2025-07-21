"use client"
import Stepper from "@/components/Stepper";
export default function Home() {

    return (
        <body className="min-h-screen w-full overflow-y-hidden">
        <main className="flex items-center flex-col">
            <div className="mt-[5%]">
                <Stepper id={2}/>
                <h1 className="font-bold text-5xl mt-5">Passenger Information</h1>
            </div>
        </main>
        </body>
    );
}