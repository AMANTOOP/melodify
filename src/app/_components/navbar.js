import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="p-4 bg-[#638CBE] top-0 w-full sticky">
      <Link href="/" className="text-white text-xl font-bold">
        <Image
          src="/logo.svg"
          alt="iodify"
          width={200}
          height={200}
          className="mx-auto rounded-md"
        />
      </Link>
    </nav>
  );
}
