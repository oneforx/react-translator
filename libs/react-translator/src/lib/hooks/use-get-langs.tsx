import { useContext } from "react";
import { ReactTranslatorContext } from "../react-translator";

export default function useGetLangs () {
    return useContext(ReactTranslatorContext).availableLangs;
}