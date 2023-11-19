import { useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "../lib/firebase";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";

const TeamsPage = () => {
    const [teamName, setTeamName] = useState<string>("");
    const [user] = useAuthState(auth);


    /**
     * Generates a random string of the specified length.
     *
     * @param {number} length - The length of the random string to generate.
     * @return {string} The random string generated.
     */
    function generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters.charAt(randomIndex);
        }
      
        return result;
      }

    /**
     * Handles the form submission event.
     *
     * @param {React.FormEvent} e - The form event.
     * @return {Promise<void>} Promise that resolves when the function completes.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (teamName === "") return;

        try {
            await set(ref(database, "teams/" + teamName), {
                name: teamName,
                opponentName: "",
                timeLeft: 10,
                timerCheck: false,
                isReady: false,
                opId: 0,
                fightTime: 600,
                fightStart: false,
                password: generateRandomString(5)
            });
            setTeamName("");
        } catch (error) {
            console.error("Error creating team:", error);
        }
    };


    if (user) {
        return (
            <div className="p-8">
                <div className="bg-gray-100 p-4">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-5xl text-gray-500">Teams</h1>
                        <Link to="/fights">Go to fights</Link>
                    </div>
                    <div className="space-x-4 mt-4">
                        <form onSubmit={handleSubmit}>
                            <input
                                className="border-2 border-gray-400 rounded-sm py-2 px-4"
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                placeholder="Enter team name"
                            />
                            <button
                                className="bg-green-500 p-2 uppercase px-8"
                                type="submit"
                            >
                                Create
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
};

export default TeamsPage;