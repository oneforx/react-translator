import { ISentences } from "apps/react-translator-front/src/types";
import { useCallback, useContext, useState } from "react";
import { EditorContext } from "../../contexts/EditorContext";

export const EditorCreateProjectScreen = () => {
    const [ projectId, setProjectId ] = useState<string>("");
    const [ importedSentences, setImportedSentences ] = useState<ISentences>({});
    const { addProject } = useContext(EditorContext);
    const [ fileName, setFileName] = useState("");
    const importTraductionFile = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute('type', 'file');
        input.setAttribute('accept', '.json');
    
        input.addEventListener('change', (e) => {
          const target = e.target as HTMLInputElement
          if (target) {
            if (target.files) {
              if (target.files.length > 0) {
                const file = target.files[0]
                const reader = new FileReader()
                reader.readAsText(file, "utf-8");
                reader.onload = (e) => {
                  // console.log(JSON.parse(e.target?.result as string));
                  setImportedSentences(JSON.parse(e.target?.result as string))
                }
              }
            }
          }
        })
    
        input.click()
    }, []);
    return (
        <div className="flex flex-1 items-center justify-items-center justify-center dark:bg-gray-900">
          <div className="dark:bg-gray-800 px-4 py-4 pb-8 rounded flex flex-col">
            <h2 className="text-2xl text-center dark:text-white py-2">Create</h2>
            <label className="dark:text-white py-1" htmlFor="projectId">Project Id</label>
            <input name="projectId" className="rounded p-2" type={"text"} onChange={(e) => setProjectId(e.currentTarget.value)} value={projectId} placeholder="ProjectName"></input>
            <div className="flex flex-row items-center justify-items-between my-3">
              <button className="bg-teal-100 dark:text-teal-500 fond-bold rounded dark:text-white py-1 hover:text-underline px-2" onClick={importTraductionFile}>Import</button>
              <div className="truncate dark:text-white px-2">{fileName || "Aucun fichier sélectionné"}</div>
            </div>
            <button className="bg-teal-400 rounded py-2 text-white" onClick={() => addProject(projectId, { sentences: importedSentences })}>Create Project</button>
          </div>
        </div>
    );
}

export default EditorCreateProjectScreen