import { useParams } from "react-router-dom";

const EditorIdScreen = () => {
    const { id } = useParams()
    
    return (
        <div className="">
            Editor {id} screen
        </div>
    );
}

export default EditorIdScreen