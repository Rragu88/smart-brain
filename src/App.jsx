import { Component } from 'react';
import ParticlesBg from 'particles-bg';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

// this is the initial state of the app. It is used to reset the app when the user signs out.
const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'SignIn',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    // we use super so that we can use the "this"s keyword to refer to the App component.
    super();
    // here we set the state of the app to the initial state.
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    // this is the image that lives in FaceRecognition.jsx
    const image = document.getElementById('inputimage');
    // the number() function converts the string to a number.
    const width = Number(image.width);
    const height = Number(image.height);
    // here we are return an object that contains the coordinates of the face.
    // this object will be what goes inside of the box property of the state object.
    return {
      // this is the math to calculate how to draw the box around the face.
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    // this will set the box property of the state object to the box object that is passed in.
    this.setState({box: box});
  }

  // when the input chages, we set the state of the input to the value of the input.
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://protected-island-67426.herokuapp.com/imageurl', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://protected-island-67426.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    // if route is signout, we reset the state of the app to the initial state.
    if (route === 'signout') {
      this.setState(initialState);
      // else if route is home, we set isSignedIn to true.
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    // here we set the route property of the state object to the route that is passed in.
    this.setState({route: route});
  }

  render() {
    // here we destructure the state object to get the isSignedIn, imageUrl, route, and box properties.
    const { isSignedIn, imageUrl, route, box, user } = this.state;
    return (
      <div className="App">
        <ParticlesBg
          className="particles"
          type="cobweb"
          color='#00ff00'
          bg={true}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {/* if route is home display the home screen, else if route is SignIn display the signin screen else display the register screen */}
        { route === 'home'
          ? <div>
              <Logo />
              <Rank name={user.name} entries={user.entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : ( route === 'SignIn'
              ? <div>
                  <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                </div>
              : <div>
                  <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                </div>
          )
        }
      </div>
    );
  }
}

export default App;
