import { Route, Routes } from "react-router-dom";

import GlobalLayout from "./components/global-layout";
import RouteGuard from "./components/route-guard";
import AttemptQuestion from "./pages/attempt-question";
import Login from "./pages/login";
import Practice from "./pages/practice";
import Problems from "./pages/problems";
import Profile from "./pages/profile";
import QuestionArtboard from "./pages/question-artboard";
import QuestionSolution from "./pages/question-solution";

const App = () => {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route
        element={
          <RouteGuard>
            <GlobalLayout />
          </RouteGuard>
        }
      >
        <Route path="/problems" element={<Problems />} />
        <Route path="/practices" element={<Practice />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/question-attempt/:id" element={<AttemptQuestion />} />
        <Route path="/question-solution/:id" element={<QuestionSolution />} />
        <Route path="/question-artboard/:id" element={<QuestionArtboard />} />
      </Route>
    </Routes>
  );
};

export default App;
