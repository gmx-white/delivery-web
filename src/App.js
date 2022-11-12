import './App.css';
import { Routes, Route } from 'react-router-dom'
import Login from './components/login'
import RecordList from './components/recordList';
import Register from './components/register';
import NoFoundPage from './components/404'
import React from 'react';
class App extends React.Component {
  // history = createBrowserRouter()
  render(){
    return (
    <div className="App">
      <Routes >
        <Route path='/login' element={<Login/>}>
        </Route>
        <Route path='/list' element={<RecordList/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='*' element={<NoFoundPage/>}></Route>

      </Routes>
    </div>
  )}
}

export default App;
