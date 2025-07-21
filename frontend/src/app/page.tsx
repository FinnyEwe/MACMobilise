import DotBackground from "@/components/dot-background";
import Link from "next/link"
import Image from "next/image"

export default function Home() {

  return (
    <>
      <DotBackground />
      <main className="flex justify-center items-center flex-col gap-10 min-h-screen">
        <h1 className="font-bold text-5xl">Plan any retreat with MACMobilise</h1>
          <p className="text-gray-400">Because HR spends too much time planning transport</p>
          <Link href={'/drivers'}>
              <button className="bg-amber-300 rounded-md pt-2 pb-2 p-4 font-bold text-black hover:scale-105 transition-all ease-in-out">Start Planning</button>
          </Link>
          <Image src={"/macLogo.svg"} alt={"penis"} className="size-1/12" width={0} height={0}></Image>
      </main>
    </>
  );
}
