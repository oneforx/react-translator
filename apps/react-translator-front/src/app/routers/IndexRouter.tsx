import { BrowserRouter, Routes, Route } from 'react-router-dom';

import EditorController from '../controllers/EditorController';
import MainController from '../controllers/MainController';
import EditorIdScreen from '../screens/editor/EditorIdScreen';
import EditorMainScreen from '../screens/editor/EditorMainScreen';

const IndexRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <MainController /> }>
          <Route path="" element={<div>MainScreen</div>} />
          <Route path="settings" element={<div>MainScreen</div>} />
        </Route>
        <Route path="/editor" element={ <EditorController /> }>
          <Route path="" element={ <EditorMainScreen /> } />
          <Route path=":id" element={ <EditorIdScreen /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default IndexRouter
