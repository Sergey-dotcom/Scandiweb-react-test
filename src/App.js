import Navbar from "./components/navbar/Navbar";
import React from "react";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import ProductsContainer from "./components/products/ProductsContainer";
import ProductDescription from "./components/products/ProductDescription";
import Bag from "./components/Bag/Bag";
import "./App.css"
import {CurrencySwitcherAction, CartSwitcherAction} from "./actions";
import {connect} from "react-redux";


const mapStateToProps = (props) => {
    return {
        currency: props.currency,
        currencySwitcherState: props.currencySwitcherReducer,
        cartSwitcherReducer: props.cartSwitcherReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        currencySwitcherAction:()=> dispatch(CurrencySwitcherAction()),
        cartSwitcherAction:()=> dispatch(CartSwitcherAction()),
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            client: new ApolloClient({
                uri: 'http://localhost:4000/',
                cache: new InMemoryCache()
            }),
            currency: 'USD'
        }
        this.setCurrencyCartSwitcherState = this.setCurrencyCartSwitcherState.bind(this);
    }


    setCurrencyCartSwitcherState() {
        if (this.props.currencySwitcherState) {
            this.props.currencySwitcherAction();
        }

        if (this.props.cartSwitcherReducer) {
            this.props.cartSwitcherAction();
        }
    }

    render() {
        return (
            <Router>
                <div className="App" onClick={this.setCurrencyCartSwitcherState}>
                    <Navbar client={this.state.client} />
                    <Switch>
                        <Route path="/:category" exact render={(props) => <ProductsContainer {...props} client={this.state.client} />}>
                        </Route>
                        <Route path="/product/:id" exact render={(props) => <ProductDescription {...props} client={this.state.client}  />}>
                        </Route>
                        <Route path="/view/bag" exact>
                            <Bag />
                        </Route>
                        <Route path="/" exact>
                            <Redirect to="/home"/>
                        </Route>
                        <Route exact path="/home">
                            <ProductsContainer client={this.state.client} />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
