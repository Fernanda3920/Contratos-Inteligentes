import React, { Component } from 'react';

export default class Restricted extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quote: undefined,
            author: undefined,
            eth_connected: false,
            account: null
        };
        this.connectWallet = this.connectWallet.bind(this);
    }

    componentDidMount() {
        this.fetchQuote();
    }

    async fetchQuote() {
        try {
            const res = await fetch('/api/random.json');
            const text = await res.text();
            console.log('Response text:', text); // Log the response text
            if (res.headers.get('content-type') && res.headers.get('content-type').includes('application/json')) {
                const data = JSON.parse(text);
                if (data && 'quote' in data) {
                    this.setState({
                        quote: data.quote,
                        author: data.author
                    });
                }
            } else {
                console.error('Received non-JSON response:', text);
            }
        } catch (error) {
            console.error('Error fetching the quote:', error);
        }
    }

    async connectWallet() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    this.setState({ eth_connected: true, account: accounts[0] });
                }
            } catch (error) {
                console.error('User rejected the request.');
            }
        } else {
            console.error('MetaMask is not installed.');
        }
    }

    render() {
        return (
            <div className="page-wrapper">
                <div className="page-content">
                    <div className="nothing-to-show d-flex align-items-center justify-content-center">
                        <div className="card shadow-none bg-transparent">
                            <div className="card-body text-center">
                                <h1 className="display-4 mt-5">{this.state.author}</h1>
                                <p>{this.state.quote}</p>
                                <div className="row">
                                    <div className="col-12 col-lg-12 mx-auto">
                                        {!this.state.eth_connected ? (
                                            <button onClick={this.connectWallet} className="btn btn-primary mt-3">
                                                Connect Wallet
                                            </button>
                                        ) : (
                                            <div>
                                                <h6 className="mt-3">Connected with address:</h6>
                                                <p>{this.state.account}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
