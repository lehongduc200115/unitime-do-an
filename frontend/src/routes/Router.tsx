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
  Main,
  Register,
  Room,
  Student,
  Subject,
} from '@pages';
import Test from 'src/pages/test/Test';
import { BKDrawer } from '@components';


const Router = () => {
  return (
    <BKDrawer></BKDrawer>
    // <BrowserRouter>
    //   {/* <Navigation></Navigation> */}
    //   <BKDrawer></BKDrawer>

    //   <Routes>
    //     <Route path="*" element={< Home />}></Route> */
    //     <Route path='/room' element={< Room />} />
    //     <Route path='/instructor' element={< Instructor />} />
    //     <Route path='/student' element={< Student />} />
    //     <Route path='/subject' element={< Subject />} />
    //     <Route path='/login' element={< Login />} />
    //     <Route path='/test' element={< Test />} />
    //     <Route path='/register' element={< Register />} />
    //   </Routes>

    // </BrowserRouter>
  )
}

export default Router;