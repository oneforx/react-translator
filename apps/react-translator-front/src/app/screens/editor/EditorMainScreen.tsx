import { ReactTranslatorContext } from "@oneforx/react-translator";
import { useContext, useMemo, useState } from "react";
import { EditorContext } from "../../contexts/EditorContext";

const EditorMainScreen = () => {
  const { translated } = useContext(ReactTranslatorContext);
  const { projects, addProject } = useContext(EditorContext);
  const [ projectName, setProjectName ] = useState("");
  
  const errors = useMemo(() => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!!projectName) {
      return translated["projectName_field_empty_error"]
    } else {
      if (projects && Object.keys(projects).filter(project => project === projectName).length > 0) {
        return translated["projectName_already_taken"]
      } else {
        return ""
      }
    }
  }, [projectName])
  
  return (
    <div className="flex-1 flex flex-col items-center content-center justify-items-center justify-self-center justify-center">
      <h1 className="text-9xl py-10">React Translator</h1>

      <div className="bg-gray-700 text-white rounded px-5 py-2">
        <pre lang="bash" className="text-xl">
          npm install @oneforx/react-translator
        </pre>
        <div>
          <i className="fad fa-copy"></i>
        </div>
      </div>

      <div className="text-gray-500 my-10" onClick={() => {}}>
        <input className="border p-2 rounded" placeholder={translated["name_of_the_project_placeholder"]} onChange={(e) => setProjectName(e.target.value)} value={projectName}></input>
        {/* eslint-disable-next-line no-extra-boolean-cast */}
        <button className="rounded ml-2 p-2 bg-teal-500 text-white font-bold disabled:bg-gray-100" disabled={!!!projectName} onClick={() => addProject(projectName)}>
          {translated["click_here_to_create_a_project"] || "Click here to start a new project"}
        </button>
        {
          errors ? <div className="text-red-500 py-1">
          {errors}
          </div> : null
        }
      </div>
    </div>
  );
}

export default EditorMainScreen
