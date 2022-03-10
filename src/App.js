import './App.css';
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MapComponent } from './component/MapComponent';

const render = (status) => {
  switch(status) {
    case Status.FAILURE:
      return <h1>Error...</h1>
    default:
      return <h1>Loading...</h1>
  }
};

function App() {
  const center = { lat: -34.397, lng: 150.644 };
  const zoom = 12;

  return (
    <Wrapper apiKey={`key`} render={render} libraries={[`places`]}>
        <MapComponent center={center} zoom={zoom} />
    </Wrapper>
  );
}

export default App;
