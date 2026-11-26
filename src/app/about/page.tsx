import Link from "next/link";
export default function About() {
  return <main className="mx-auto max-w-3xl px-6 py-16">
    <Link href="/" className="underline">Back to home</Link>
    <h1 className="mt-8 font-serif text-4xl text-[#123c34]">About the demo</h1>
    <p className="mt-4 leading-relaxed">Indore Prime Properties is a fictional brand created by Shuvi 360 to demonstrate real-estate technology. No actual listings or transactions are available. Interactive models, tours, CRM and AI features will be added in later phases.</p>
  </main>;
}
