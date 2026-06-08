import Link from "next/link";

export function Masthead() {
  return (
    <div className="w-full bg-background py-8 flex flex-col items-center border-b-2 border-foreground">
      <Link href="/">
        <h1 className="font-editorial text-5xl md:text-7xl font-bold tracking-tight text-foreground uppercase tracking-widest text-center">
          IndoTimes<span className="text-primary">Media</span>
        </h1>
      </Link>
      <p className="mt-3 font-editorial italic text-muted-foreground text-sm md:text-base text-center">
        “The Truth, Unfiltered and Unbiased”
      </p>
    </div>
  );
}
