import { registerRootComponent } from "expo";
import SignupView from "./src/views/SignupView";

function App() {
    return <SignupView />; // for testing
}

registerRootComponent(App);