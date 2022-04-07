import { useMemo } from "react";

type flagComponentSize = "16x12" | "20x15" | "24x18" | "28x21" | "32x24" | "36x27" | "40x30" |
"48x36" | "56x42" | "60x45" | "64x48" | "72x54" | "80x60" | "84x63" |
"96x72" | "108x81"| "112x84"| "120x90"| "128x96"| "144x108" | "160x120" | "192x144" | "224x168" |
"256x192" | "w20" | "w40" | "w80" | "w160" | "w320" | "w640" | "w1280" | "w2560" |
"h20" | "h24" | "h40" | "h60" | "h80" | "h120" | "h240" | "h20w20"

interface flagComponentProps {
  size: flagComponentSize,
  lang: string | {
    code: string,
    name: string
  }
}

const FlagComponent = ({ size, lang }: flagComponentProps) => {
  const settings = useMemo(() => {
    const sizeArray = size.split("x").map(s => Number.parseInt(s));

    return (
      <div className="flex flex-col items-center dark:text-white">
        <img
        alt={typeof lang === "object" ? lang.name : "fr"}
        src={`https://flagcdn.com/${size}/${typeof lang === "object" ? lang.code : "fr" }.png`}
        width={ sizeArray[0] }
        height={ sizeArray[1] }></img>
        {typeof lang === "object" ? lang.name : ""}
      </div>
    )
  }, [size, lang])
  return settings;
}

export default FlagComponent;
