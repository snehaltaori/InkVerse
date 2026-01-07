import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useUser } from "./context/UserContext";

import PageTransition from "./components/PageTransition";
import Navbar from "./components/Navbar";

import Homep from "./pages/Homep";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NovelDetails from "./pages/NovelDetails";
import Profile from "./pages/Profile";
import Emails from "./pages/Emails";
import Forums from "./pages/Forums";
import Settings from "./pages/Settings";
import TagNovels from "./pages/TagNovels";
import SearchResults from "./pages/SearchResults";
import ReadPage from "./pages/ReadPage";
import Studio from "./pages/Studio";

const PrivateRoute = ({ children }) => {
    const { user } = useUser();
    return user ? children : <Navigate to="/login" />;
};

export default function App() {
    const location = useLocation();

    return (
        <>
            {/* Navbar stays static (important for smoothness) */}
            <Navbar />

            {/* Animated page transitions */}
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageTransition> <Homep /> </PageTransition>} />
                    <Route path="/login" element={<PageTransition> <Login/> </PageTransition>} />
                    <Route path="/signup" element={ <PageTransition> <Signup/> </PageTransition>}/>

                    <Route
                        path="/tags/:tagName"
                        element={
                            <PageTransition>
                                <TagNovels />
                            </PageTransition>
                        }
                    />

                    <Route
                        path="/search"
                        element={
                            <PageTransition>
                                <SearchResults />
                            </PageTransition>
                        }
                    />

                    <Route
                        path="/read/:chapterId"
                        element={
                            <PageTransition>
                                <ReadPage />
                            </PageTransition>
                        }
                    />

                    <Route
                        path="/novel/:id"
                        element={
                            <PageTransition>
                                <NovelDetails />
                            </PageTransition>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <PageTransition>
                                    <Profile />
                                </PageTransition>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/profile/:userId"
                        element={
                            <PrivateRoute>
                                <PageTransition>
                                    <Profile />
                                </PageTransition>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/studio"
                        element={
                            <PrivateRoute>
                                <PageTransition>
                                    <Studio />
                                </PageTransition>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/emails"
                        element={
                            <PrivateRoute>
                                <PageTransition>
                                    <Emails />
                                </PageTransition>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/forums"
                        element={
                            <PrivateRoute>
                                <PageTransition>
                                    <Forums />
                                </PageTransition>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <PrivateRoute>
                                <PageTransition>
                                    <Settings />
                                </PageTransition>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </>
    );
}
