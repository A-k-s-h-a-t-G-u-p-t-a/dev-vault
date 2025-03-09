"use client";

import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ProposalForm({ contract }: { contract: any }) {
  const { mutate: sendTransaction, status } = useSendTransaction();
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");

  const handleCreateProposal = () => {
    if (!description || !duration) {
      setError("All fields are required.");
      return;
    }
    setError("");

    try {
      const transaction = prepareContractCall({
        contract,
        method: "function createProposal(string _description, uint256 _duration)",
        params: [description, BigInt(duration)],
      });
      sendTransaction(transaction);
    } catch (err) {
      setError("Failed to create proposal. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md p-6 bg-gray-950 text-white rounded-2xl shadow-lg border border-violet-600">
      <CardHeader>
        <CardTitle className="text-violet-400 text-lg font-semibold">Create Proposal</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <Input
          className="mb-3 bg-gray-800 text-white focus:ring-violet-500"
          placeholder="Proposal Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          type="number"
          className="mb-3 bg-gray-800 text-white focus:ring-violet-500"
          placeholder="Duration (in seconds)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <Button
          onClick={handleCreateProposal}
          className={cn(
            "w-full bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-all",
            status === "pending" && "opacity-50 cursor-not-allowed"
          )}
          disabled={status === "pending"}
        >
          {status === "pending" ? "Creating..." : "Submit Proposal"}
        </Button>
      </CardContent>
    </Card>
  );
}