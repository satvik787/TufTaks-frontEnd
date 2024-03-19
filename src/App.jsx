import EditorPage from './pages/EditorPage'
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import {Toaster} from "sonner";
import SubmissionPage from "./pages/SubmissionPage.jsx";

const router = createBrowserRouter([
	{
		path:'/',
		element:<EditorPage/>
	},
	{
		path:"/submission",
		element:<SubmissionPage/>
	}
])
function App() {
	return (
		<>
			<Toaster richColors position="top-right" />
			<RouterProvider router={router}/>
		</>
	)
}

export default App
