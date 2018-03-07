import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {mount} from "enzyme";
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

var mock = new MockAdapter(axios);
mock.onGet(`/api/v1/mapPosition`).reply(200, 
  { id: 2, userId: 0, lat: 32.923149037476044, lng: 73.31456768476619 });
mock.onPost(`/api/v1/mapPosition/21.22/12.223`).reply(200, 
  {id: 2, userId:0, lat: 21.22, lng: 12.223 });

it('renders without crashing', () => {
  Enzyme.configure({ adapter: new Adapter() });

  const div = document.createElement('div');
  const app = mount(<App />);
  ReactDOM.render(<App />, div);

  console.log('app.state', app, app.state());
  console.log(App.prototype.componentDidMount().then(c => 
      setTimeout(console.log('app.state', app, app.state()), 85000)));
  expect(app.length).toEqual(1);
});
