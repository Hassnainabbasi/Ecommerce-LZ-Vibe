import { useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <div className="w-full min-h-[60vh] flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100">
            <button
                onClick={handleLogout}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md 
                           hover:bg-blue-700 transition-all duration-200 shadow-md 
                           border border-blue-600 active:scale-95"
            >
                Logout
            </button>
        </div>
    );
}

export default Settings;
