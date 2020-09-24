import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
//redux thunk berfungsi bisa menghandle asynchronus function sehingga bisa dipanggil pada dispatch
//redux hanya bersifat synchronus yaitu langsung melakukan action tanpa jeda waktu
import reducer from '../reducer';

export const Store = createStore(reducer, applyMiddleware(thunk)); 