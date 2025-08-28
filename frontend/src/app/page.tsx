import DotBackground from '@/components/dot-background';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <DotBackground />
      <main className="flex min-h-screen flex-col items-center justify-center gap-10">
        <h1 className="text-5xl font-bold">Plan any retreat with MACMobilise</h1>
        <p className="text-gray-400">Because HR spends too much time planning transport</p>
        <Link href={'/details/drivers'}>
          <button className="rounded-md bg-amber-300 p-4 pb-2 pt-2 font-bold text-black transition-all ease-in-out hover:scale-105">
            Start Planning
          </button>
        </Link>
        <Image
          src={'/macLogo.svg'}
          alt={'penis'}
          className="size-1/12"
          width={0}
          height={0}
        ></Image>
      </main>
    </>
  );
}
