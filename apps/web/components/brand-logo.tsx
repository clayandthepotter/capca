import Link from "next/link";

type BrandMarkSize = "sm" | "md" | "lg";

const markSizes: Record<BrandMarkSize, string> = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-9 w-9 rounded-lg",
  lg: "h-10 w-10 rounded-xl",
};

const ringSizes: Record<BrandMarkSize, string> = {
  sm: "h-2.5 w-2.5 border-2",
  md: "h-3 w-3 border-[2.5px]",
  lg: "h-3.5 w-3.5 border-[3px]",
};

export function BrandMark({
  size = "sm",
  className = "",
}: {
  size?: BrandMarkSize;
  className?: string;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center bg-blue-600 text-white shadow-sm ${markSizes[size]} ${className}`}
      aria-hidden
    >
      <span className={`rounded-full border-white ${ringSizes[size]}`} />
    </span>
  );
}

export function BrandLogo({
  href,
  size = "sm",
  className = "",
  textClassName = "",
}: {
  href?: string;
  size?: BrandMarkSize;
  className?: string;
  textClassName?: string;
}) {
  const content = (
    <>
      <BrandMark size={size} />
      <span
        className={`font-semibold tracking-tight text-slate-950 ${
          size === "lg" ? "text-[18px]" : "text-[15px]"
        } ${textClassName}`}
      >
        Capca
      </span>
    </>
  );

  const classes = `inline-flex items-center gap-2.5 ${className}`;
  if (!href) return <span className={classes}>{content}</span>;

  return (
    <Link href={href} aria-label="Capca home" className={classes}>
      {content}
    </Link>
  );
}
