import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import { Navigation } from '../components/Navigation/Navigation';
import {
  Home,
  Instructor,
  Login,
  Room,
  Student,
  Subject,
} from '@pages';
import Test from 'src/pages/test/Test';


const Router = () => {
  return (
    <BrowserRouter>
      <Navigation></Navigation>
      <Routes>
        <Route path="*" element={< Home />}></Route> */
        <Route path='/room' element={< Room />} />
        <Route path='/instructor' element={< Instructor />} />
        <Route path='/student' element={< Student />} />
        <Route path='/subject' element={< Subject />} />
        <Route path='/login' element={< Login />} />
        <Route path='/test' element={< Test />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router;