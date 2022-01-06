import './App.css';
import React from 'react';

class Header extends React.Component {

  render() {
    return(
      <div className="header">
        <h1>ShortURL</h1>
        <p className="desc">An open source and privacy friendly URL shortener.</p>
      </div>
    );
  }
}

class Footer extends React.Component {
  
  render() {
    return(
      <div className="footer">
        <footer>
          <p>Made with ❤️ 2022. Check out my Github profile with other awesome projects <a href="https://github.com/m-GDEV">here.</a></p>
        </footer>
      </div>
    );
  }
}

class Input extends React.Component {

  constructor(props) {
    super(props);
    this.onURLChange = this.onURLChange.bind(this);
    this.onValidChange = this.onValidChange.bind(this);
    this.onReadyChange = this.onReadyChange.bind(this);
    this.state = {url: '', valid: false, ready: false};
  }

  onURLChange(url) {
    this.setState({url: url});
  }

  onValidChange(valid) {
    this.setState({valid: valid});
  }

  onReadyChange(ready) {
    this.setState({ready: ready});
  }

  render() {
    return(
      <div>
        <Validate url={this.state.url} valid={this.state.valid} onURLChange={this.onURLChange} onValidChange={this.onValidChange} onReadyChange={this.onReadyChange}/>
        <Shorten url={this.state.url} valid={this.state.valid} ready={this.state.ready}/>
      </div>
    );
  }
}

class Validate extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.props.onURLChange(e.target.value);
    this.props.onReadyChange(false);
    let r = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
    r.test(this.props.url) ? this.props.onValidChange(true) : this.props.onValidChange(false);
  }

  handleSubmit(e) {
    this.props.onReadyChange(true);
    let r = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
    r.test(this.props.url) ? this.props.onValidChange(true) : this.props.onValidChange(false);
  }

  render() {
    return(
      <div>
        <input className="input" type="text" placeholder="Enter a URL to Shorten" value={this.props.url} onChange={this.handleChange} autoFocus />
        <button className="submit" onClick={this.handleSubmit}><b>Shorten!</b></button>
      </div>
    );
  }
}

class Shorten extends React.Component {

  shortenURL() {
    let url = this.props.url;
    let random_string = Math.random().toString(32).substring(2, 5) + Math.random().toString(32).substring(2, 5);

    // getting existing json to update it
    let headers = {'Content-Type' : 'application/json'}

    fetch("https://api.jsonstorage.net/v1/json/cc93bc6b-9f01-49e6-b6a5-c50b46c97b69")
      .then((response) => response.json())
      .then((json) => {
        // updating existing json with new url hash info
        json[`${random_string}`] = url;
        console.log(json);
        fetch("https://api.jsonstorage.net/v1/json/cc93bc6b-9f01-49e6-b6a5-c50b46c97b69", {headers: headers, method: 'PUT', body: JSON.stringify(json)})
      });

      return random_string;
  }

  render() {

    let message;

    if (this.props.ready && this.props.valid) {
      let hash = this.shortenURL();
      let url = `https://m-gdev.github.io/ShortURL#${hash}`
      message = <p className="shortened">URL Shortened! - <a href={url}>{url}</a></p>
    }
    else if (!this.props.valid && this.props.ready) {
      message = <p className="invalid">Invalid URL. Please Retry.</p>
    }

    return(
      <div>
        {message}
      </div>
    );
  }
}

class App extends React.Component {

  render() {    
    // if hash is not empty (someone is using the shortened url) then redirect 
    if (window.location.hash !== "") {
      fetch("https://api.jsonstorage.net/v1/json/cc93bc6b-9f01-49e6-b6a5-c50b46c97b69")
        .then((response) => response.json())
        .then((json) => {
          window.location.href = json[window.location.hash.substring(1)]
      });
    }

      return(
        <div className="app">
          <Header />
          <Input />
          <Footer />
        </div>
      );
    }
    }

export default App;