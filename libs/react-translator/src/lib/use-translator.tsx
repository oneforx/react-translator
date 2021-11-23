import { useContext } from "react"
import { ReactTranslatorContext } from ".."

export const useTranslator = ( key?: string ) => {
  const { translated } = useContext(ReactTranslatorContext);
  return key !== undefined ? translated[key] !== undefined ? translated[key] : translated : translated;
}
