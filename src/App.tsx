import { Route, Routes, useNavigate } from "react-router-dom";
import PageLayout from "./components/layouts/PageLayout";
import Labs from "./modules/labs/Labs";
import { useEffect } from "react";
import Whoop from "./modules/whoop/Whoop";
import Oura from "./modules/oura/Oura";
import Settings from "./modules/settings/Settings";
import Journal from "./modules/journal/Journal";
import Chat from "./modules/chat/Chat";
import { getSelectedAIConfiguration } from "./helpers/storage";
import Supplements from "./modules/supplements/Supplements";
import Therapies from "./modules/therapies/Therapies";
import Videos from "./modules/videos/Videos";
import Tests from "./modules/tests/Tests";
import Organs from "./modules/organs/Organs";
import Insights from "./modules/insights/Insights";
import { Toaster } from "./components/ui/toaster";

const initAiConfig = () => {
  if (!getSelectedAIConfiguration()) {
    localStorage.setItem("selectedAIConfiguration", "sequelsOpenAI");
    console.log(process.env.REACT_APP_OPENAI_API_KEY);
    // @ts-ignore

    localStorage.setItem("AIKey", process.env.REACT_APP_OPENAI_API_KEY);
  }
};

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/sheets");
    initAiConfig();
  }, []);

  return (
    <>
    <Toaster/>
      <div className="App flex flex-col px-4 pt-2 h-[100vh] bg-[rgba(0,0,0,0.24)] noDrag font-satoshi">
        <Routes>
          <Route element={<PageLayout />}>
            <Route
              path="/sheets"
              element={<Labs />}
            />
            <Route path="/whoop" element={<Whoop />} />
            <Route path="/oura" element={<Oura />} /> 
            <Route
              path="/settings"
              element={<Settings />}
            />
            <Route
              path="/journal"
              element={<Journal />}
            />
            <Route
              path="/chat"
              element={<Chat />}
            />
            <Route
              path="/supplements"
              element={<Supplements />}
            />
            <Route
              path="/therapies"
              element={<Therapies />}
            />
            <Route
              path="/videos"
              element={<Videos />}
            />
            <Route
              path="/tests"
              element={<Tests />}
            />
            <Route
              path="/organs"
              element={<Organs />}
            />
            <Route
              path="/insights"
              element={<Insights />}
            />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
