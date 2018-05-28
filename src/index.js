import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import registerServiceWorker from './registerServiceWorker';

let state ={};
window.setState = (changes) => {
    state = Object.assign({ }, state, changes);

    ReactDOM.render(<App {...state}/>, document.getElementById('root'));

};

let initialState = {
    name: "Your Name"
};

window.setState(initialState)

registerServiceWorker();
