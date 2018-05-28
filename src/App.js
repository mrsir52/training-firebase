import React, {Component} from 'react';
import './App.css';

import {Button, Card, Navbar, NavbarBrand } from 'mdbreact';
import firebase, {auth, provider} from './firebase'

class App extends Component {
    constructor() {
        super();
        this.state = {
            currentItem: '',
            username: '',
            items: [],
            user: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    login() {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                this.setState({
                    user
                });
            });
    }

    logout() {
        auth.signOut()
            .then(() => {
                this.setState({
                    user: null
                });
            });
    }

    handleSubmit(e) {
        e.preventDefault();
        const itemsRef = firebase.database().ref('items');
        const item = {
            title: this.state.currentItem,
            user: this.state.user.displayName || this.state.user.email
        }
        itemsRef.push(item);
        this.setState({
            currentItem: '',
            username: ''
        });
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user});
            }
        });
        const itemsRef = firebase.database().ref('items');
        itemsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            let newState = [];
            for (let item in items) {
                newState.push({
                    id: item,
                    title: items[item].title,
                    user: items[item].user
                });
            }
            this.setState({
                items: newState
            });
        });

    }

    removeItem(itemId) {
        const itemRef = firebase.database().ref(`/items/${itemId}`);
        itemRef.remove();
    }

    render() {
        console.log("all state:", this.state)
        console.log("some state:", this.state.user)
        return (

            <div>
                <header>
                    <Navbar light color="purple">
                        <NavbarBrand>
                            <h1>Pot Luck Planner</h1>
                        </NavbarBrand>

                        {this.state.user ?
                            <Button size="sm" color="elegant" onClick={this.logout}>Log Out</Button>
                            :
                            <Button size="sm" color="elegant" onClick={this.login}>Log In</Button>
                        }
                    </Navbar>

                </header>
                {this.state.user ?
                    <div>
                        <div className='user-profile'>
                            <img src={this.state.user.photoURL}/>
                        </div>
                        <div className='container'>

                            <section className='add-item'>
                                <h2>{this.state.user.displayName || this.state.user.email}</h2>

                                <form onSubmit={this.handleSubmit}>

                                    <input type="text" name="currentItem" placeholder="What are you bringing?"
                                           onChange={this.handleChange} value={this.state.currentItem}/>
                                    <button>Add Item</button>
                                </form>

                            </section>

                            <section className='display-item'>
                                <Card className="purple white-text">
                                    <table className="table-style">

                                        <thead>
                                        <tr>
                                            <th>Food</th>
                                            <th>Brought By</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.items.map((item) => {
                                            return (

                                                <tr key={item.id}>
                                                    <td >{item.title}</td>
                                                    <td className="white-text">{item.user}</td>
                                                    <td>{item.user === this.state.user.displayName || item.user === this.state.user.email ?
                                                        <button
                                                            onClick={() => this.removeItem(item.id)}>Remove
                                                            Item</button>
                                                        : null}</td>
                                                </tr>

                                            )
                                        })}
                                        </tbody>
                                    </table>
                                </Card>

                            </section>
                        </div>
                    </div>
                    :
                    <div className="login-err">
                        <h4>You must be logged in to see the potluck list and sign up to bring an item.</h4>
                    </div>
                }

            </div>
        );
    }
}

export default App;
