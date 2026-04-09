import Book from "./components/Book"
import "./App.css"

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-white text-slate-900">
      <div className="w-full max-w-[1180px]">
        <Book />
      </div>
    </div>
  )
}