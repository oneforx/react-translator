import { Routes, Route, HashRouter } from 'react-router-dom';

import EditorController from '../controllers/EditorController';
import MainController from '../controllers/MainController';
import CreateTraductionScreen from '../screens/CreateTraductionScreen';
import EditorIdScreen from '../screens/editor/EditorIdScreen';
import EditorMainScreen from '../screens/editor/EditorMainScreen';
import MainScreen from '../screens/main/MainScreen';

const IndexRouter = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={ <MainController /> }>
          <Route path="" element={ <MainScreen /> } />
          <Route path="settings" element={ <div>Settings</div> } />
        </Route>
        <Route path="/editor" element={ <EditorController /> }>
          <Route path="" element={ <EditorMainScreen /> } />
          <Route path="last" element={ <CreateTraductionScreen /> } />
          <Route path=":id" element={ <EditorIdScreen /> } />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default IndexRouter
