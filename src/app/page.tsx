import Link from "next/link";
export default function Home() {
  return <main className="min-h-screen px-6 py-10 sm:px-12 sm:py-16">
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#bd985d]/40 pb-6">
        <span className="font-semibold tracking-widest text-[#123c34]">INDORE PRIME PROPERTIES</span>
        <span className="rounded-full border border-[#bd985d] px-3 py-1 text-xs font-medium">SHUVI 360 · DEMO</span>
      </header>
      <section className="mt-12 rounded-3xl bg-[#123c34] px-7 py-14 text-[#f7f4ed] sm:px-16 sm:py-24">
        <p className="text-sm tracking-widest text-[#e4c995]">INDORE · MADHYA PRADESH</p>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">A better way to explore property.</h1>
        <p className="mt-6 max-w-xl leading-relaxed">A fictional real-estate platform by Shuvi 360. The application foundation is being developed; listings, tours and enquiries are not yet available.</p>
        <Link href="/about" className="mt-8 inline-flex rounded-lg bg-[#f7f4ed] px-5 py-3 font-semibold text-[#123c34]">About this demo</Link>
      </section>
      <footer className="mt-8 text-sm text-[#435751]">Portfolio demonstration only. No actual sale or rental offers.</footer>
    </div>
  </main>;
}
