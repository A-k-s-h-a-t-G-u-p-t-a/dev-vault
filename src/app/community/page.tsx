"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const projects = [
  {
    title: "Eclair UI",
    description: "A beautiful UI kit for React.js developers.",
    logo: "/Ecliar.jpg",
    technologies: [{ name: "Python" }, { name: "TensorFlow" }],
    issues: 3,
    cryptoReward: 1.8,
    owner: "GopalVerma1303",
    repo: "EclairUI",
  },
  {
    title: "TextToSpeechAssistant",
    description: "A simple React.js project that converts text into speech.",
    logo: "/Texttos.jpg",
    technologies: [{ name: "React.js" }, { name: "Web Speech API" }],
    issues: 2,
    cryptoReward: 0.5,
    owner: "sparsh44",
    repo: "TextToSpeechAssistant",
  },
  {
    title: "Pathora",
    description: "A comprehensive career guidance platform for aspiring tech professionals.",
    logo: "/Pathora.jpg",
    technologies: [{ name: "React.js" }, { name: "Node.js" }],
    issues: 5,
    cryptoReward: 2.0,
    owner: "SUGAM-ARORA",
    repo: "Pathora",
  },
  {
    title: "ToolVa",
    description: "The ultimate AI tools directory with over 80 curated tools.",
    logo: "/Toolva.jpg",
    technologies: [{ name: "React" }, { name: "TypeScript" }, { name: "Supabase" }],
    issues: 4,
    cryptoReward: 1.2,
    owner: "SUGAM-ARORA",
    repo: "Toolva",
  },
];

const messages = [
  { text: "Excited to be part of this community!", author: "0xA1B2C3D4..." },
  { text: "Blockchain is the future!", author: "0xE5F6G7H8..." },
  { text: "Let's build something amazing together.", author: "0xI9J0K1L2..." },
];

export default function Community() {
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState(messages);
  const router = useRouter();

  const handlePostMessage = () => {
    if (message.trim()) {
      setLocalMessages([...localMessages, { text: message, author: "You" }]);
      setMessage("");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-1/4 p-6 bg-gray-800 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-violet-400">Projects</h2>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <Card key={index} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <CardContent>
                <img src={project.logo} alt={project.title} className="h-12 w-12 mb-2 rounded-md" />
                <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                <p className="text-gray-300 text-sm">{project.description}</p>
                <p className="text-gray-400 text-xs mt-2">Issues: {project.issues} | Reward: {project.cryptoReward} CTKR</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </aside>
      {/* Main Content */}
      <div className="w-3/4 p-6">
        <h1 className="text-2xl font-bold mb-6 text-violet-400">Community</h1>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-3 bg-gray-800 border border-gray-700 text-white rounded-lg"
            />
            <Button onClick={handlePostMessage} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg">
              Post
            </Button>
          </div>
          <div className="space-y-4">
            {localMessages.map((msg, index) => (
              <Card key={index} className="bg-gray-800 border border-gray-700 text-white rounded-lg p-4">
                <CardContent>
                  <p className="font-semibold text-violet-400">{msg.author}</p>
                  <p className="text-gray-300">{msg.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Voting Section */}
        <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <h2 className="text-xl font-bold text-violet-400 mb-4">Voting</h2>
          <p className="text-gray-300">Participate in governance by voting on project proposals.</p>
          <Button onClick={() => router.push("/voting/allproposals")} className="mt-4 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg">
            Go to Voting
          </Button>
        </div>
      </div>
    </div>
  );
}
