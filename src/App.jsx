import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Editor from "@/components/pages/Editor"

function App() {
  return (
    <div className="min-h-screen bg-surface-900 text-surface-100 font-inter">
      <Routes>
        <Route path="/" element={<Editor />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App