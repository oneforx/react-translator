import { useRequest } from "@oneforx/poseidon";
import { useCallback, useEffect, useMemo, useState } from "react";
import FlagComponent from "./FlagComponent";
import Tag from "./Tag";

const AdjustIconComponent = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
)

interface IFlagList {
  flagCodesUsedInSentence?: string[],
  flagSelected?: string,
  onClickDeleteLanguage: ((ctk: string) => void),
  onClickFlag: (( ctk: string) => void)
}

const FlagList = ({
  flagCodesUsedInSentence,
  onClickDeleteLanguage,
  flagSelected,
  onClickFlag
}: IFlagList) => {
  const [ response ] = useRequest( "https://flagcdn.com/en/codes.json", { mode: "cors", method: "GET" }, true );
  const [ searchFlag, setSearchFlag ] = useState("");
  const [ tags, setTags ] = useState<Array<string>>([]);

  useEffect(() => { console.log(flagSelected, flagCodesUsedInSentence)}, [flagSelected, flagCodesUsedInSentence]);

  const flagList = useMemo(() => response.data ? Object.keys(response.data)
  .filter((v) => searchFlag.length > 0 ? v.includes(searchFlag) || response.data[v].toLocaleLowerCase().includes(searchFlag.toLocaleLowerCase()) : true)
  .map(
    (ctk: string, idx: number) => {
      return (
        <div
          key={idx}
          className={["m-2 p-2 relative"].concat([typeof flagCodesUsedInSentence !== "undefined" && flagCodesUsedInSentence.includes(ctk) ? "border border-black" : "", flagSelected === ctk ? "bg-gray-200" : ""]).join(" ").trimEnd()}
          onClick={() => onClickFlag(flagSelected === ctk ? "" : ctk)}>
            { flagCodesUsedInSentence !== undefined  && flagCodesUsedInSentence.includes(ctk) ? <span onClick={() => onClickDeleteLanguage(ctk)} className="absolute top-0 left-0 bg-red-600 cursor-pointer px-1 w-5 h-5 text-center items-center justify-items-center text-white text-xs rounded-full">x</span> : null }
          <FlagComponent lang={{ code: ctk, name: response.data[ctk] }} size="64x48" />
        </div>
      );
    }) : null,
    [response.data, searchFlag, flagCodesUsedInSentence, flagSelected, onClickFlag, onClickDeleteLanguage]
  );

  const handleSearchFlagChange = useCallback((e) => {
    setSearchFlag(e.target.value)
  }, []);


  if ( response.isLoading ) return <p>FlagList is loading</p>
  else return (
    <div className="p-2 flex flex-1 flex-col h-full flex-wrap flex-grow overflow-auto scrollbar scrollbar-thumb-teal-500 scrollbar-track-teal-50">
      <div className="p-2 absolute top-0 left-4 flex items-center">
        <input className="p-2 border" placeholder="fr,france" value={searchFlag} onChange={handleSearchFlagChange}></input>
        <Tag id="used" bgColor="red" bgOpacity="900" onClick={(tag) => tags.filter(tag => tag !== "used").length > 0 ? tags.filter(tag => tag !== "used") : setTags([...tags, tag])}>Used</Tag>
      </div>
      {flagList}
    </div>
  )
}

export default FlagList
