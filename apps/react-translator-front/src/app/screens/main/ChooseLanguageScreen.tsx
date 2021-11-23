import { useState } from "react";
import FlagList from "../../components/FlagList";

const ChooseLanguageScreen = () => {
  const [ flagSelected, setFlagSelected ] = useState<string>();

  return (
    <div className="flex-1 h-full">
      <FlagList
        flagSelected={flagSelected}
        onClickFlag={(ctk) => setFlagSelected(ctk)}
      />
    </div>
  );
}

export default ChooseLanguageScreen
