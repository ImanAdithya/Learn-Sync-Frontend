import { useState } from "react";

export const ELearn = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [videos, setVideos] = useState([]);

    const API_KEY = "AIzaSyBjvrG-7lyDEV9smRwK3CX7MCjh05R1o_g"; // Replace with your YouTube API key

    const fetchVideos = async () => {
        if (!searchQuery.trim()) return;
        
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${encodeURIComponent(searchQuery)}&key=${API_KEY}`
        );
        const data = await response.json();
        setVideos(data.items || []);
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            fetchVideos();
        }
    };

    return (
        <div className="flex flex-col font-anek p-5 gap-5">
            {/* Header */}
            <div className="flex border border-gray-300 rounded-xl p-3 items-center">
                <div className="flex flex-col border-r border-gray-400 pr-10">
                    <h1 className="text-[20px] font-semibold">May</h1>
                    <h4 className="text-[15px] font-medium text-gray-700">
                        Today is {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </h4>
                </div>
                <div className="flex pl-5 items-center gap-2 flex-1">
                    <h1 className="text-[23px] font-semibold">Channel</h1>
                    <div className="text-[19px] font-medium text-gray-700">-</div>
                    <h4 className="text-[19px] font-medium text-gray-700">Using Browser</h4>
                </div>
                <div>
                    <button
                        className="text-[19px] font-semibold bg-black text-white rounded-xl w-[124px] justify-center pt-2"
                        onClick={fetchVideos}
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col border border-gray-300 rounded-md h-[590px] items-center p-5">
                <div className="flex w-full justify-center">
                    <input
                        type="text"
                        placeholder="Search Any Thing...."
                        className="border border-gray-300 rounded-2xl p-3 w-[700px] focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button
                        className="ml-3 bg-black text-white px-4 py-1 rounded-md"
                       onClick={fetchVideos} 
                        
                    >
                        Search
                    </button>
                </div>

                {/* Videos Grid */}
                <div className="grid grid-cols-3 gap-10 p-10">
                    {videos.map((video) => (
                        <div
                            key={video.id.videoId}
                            className="flex flex-col border border-gray-300 rounded-xl h-[250px] w-[400px] p-3"
                        >
                            <iframe
                                width="100%"
                                height="180"
                                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                                title={video.snippet.title}
                                allowFullScreen
                                className="rounded-xl"
                            ></iframe>
                            <h1 className="text-[17px] font-medium text-gray-700 mt-2">
                                {video.snippet.title}
                            </h1>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
