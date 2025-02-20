import { Route, Routes } from "react-router-dom";

import GlobalLayout from "./components/global-layout";
import QuestionAttempt from "./pages/attempt-question";
import LoginPage from "./pages/login-page";
import Practices from "./pages/practices";
import Problems from "./pages/problems";
import Profile from "./pages/profile";
import QuestionArtboard from "./pages/question-artboard";
import QuestionSolution from "./pages/question-solution";

const App = () => {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route
        element={
          // <RouteGuard>
          <GlobalLayout />
          // </RouteGuard>
        }
      >
        <Route path="/problems" element={<Problems />} />
        <Route path="/practices" element={<Practices />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/question-attempt/:id" element={<QuestionAttempt />} />
        <Route path="/question-solution/:id" element={<QuestionSolution />} />
        <Route path="/question-artboard/:id" element={<QuestionArtboard />} />
      </Route>
    </Routes>
  );
};

export default App;
