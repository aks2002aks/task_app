import AuthProvider from "./provider/authProvider";
import Routes from "./routes";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </div>
  );
}

export default App;
