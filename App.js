import { registerRootComponent } from "expo";
import LoginSignupView from "./src/views/LoginSignupView";

function App() {
    return <LoginSignupView />; // for testing
}

registerRootComponent(App);