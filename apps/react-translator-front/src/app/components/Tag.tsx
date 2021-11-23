import { useMemo, useState } from "react";

type TwOpacity = "50" | "100" | "150" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"
type TwColor =  "red" | "green" | "blue" | "yellow" |
                "teal" | "black" | "white" | "gray" |
                "orange" | "pink" | "purple" | "sky"|
                "cyan" | "indigo"

interface ITagProps {
  bgColor?: TwColor,
  bgOpacity?: TwOpacity,
  textColor?: TwColor,
  textOpacity?: TwOpacity,
  textValue?: string,
  children: string
}

function Tag ({
  textValue,
  bgColor = "red",
  bgOpacity = "500",
  textColor = "red",
  textOpacity = "900",
  children
}: ITagProps) {
  const tagCn = useMemo(() => {
    const txtColor = (textColor === "white" ? "text-white" : "text-"+textColor+"-"+textOpacity)
    const backgroundColor = `bg-${bgColor}-${bgOpacity}`
    const cn = "rounded-full cursor-pointer px-2 py-1 text-sm bg-black text-white items-center".concat([ "text-"+textColor+"-"+textOpacity, backgroundColor ].join(" "))
    return cn
  }, [ textColor, textOpacity, bgColor, bgOpacity ]);

  return (
    <span className={tagCn}>
      {textValue || children} x
    </span>
  );
}

export default Tag
