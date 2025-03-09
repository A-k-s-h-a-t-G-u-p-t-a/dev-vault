// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@thirdweb-dev/contracts/extension/PermissionsEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VotingSystem is PermissionsEnumerable {
    struct Proposal {
        uint256 id;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 endTime;
        bool finalized;
        address creator;
    }

    IERC20 public votingToken;
    Proposal[] public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 id, string description, uint256 endTime, address creator);
    event Voted(uint256 id, address voter, bool vote, uint256 weight);
    event ProposalFinalized(uint256 id, bool passed);

    constructor(address _tokenAddress) {
        votingToken = IERC20(_tokenAddress);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @notice Returns the total number of proposals
    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }

    /// @notice Creates a new proposal
    function createProposal(string memory _description, uint256 _duration) external {
        uint256 proposalId = proposals.length;
        proposals.push(Proposal({
            id: proposalId,
            description: _description,
            yesVotes: 0,
            noVotes: 0,
            endTime: block.timestamp + _duration,
            finalized: false,
            creator: msg.sender
        }));

        emit ProposalCreated(proposalId, _description, block.timestamp + _duration, msg.sender);
    }

    /// @notice Votes on a proposal
    function vote(uint256 _proposalId, bool _vote) external {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];

        require(block.timestamp < proposal.endTime, "Voting period over");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");

        uint256 voterBalance = votingToken.balanceOf(msg.sender);
        require(voterBalance > 0, "No tokens to vote");

        // Weighted voting based on token balance
        if (_vote) {
            proposal.yesVotes += voterBalance;
        } else {
            proposal.noVotes += voterBalance;
        }

        hasVoted[_proposalId][msg.sender] = true;
        emit Voted(_proposalId, msg.sender, _vote, voterBalance);
    }

    /// @notice Finalizes a proposal after the voting period
    function finalizeProposal(uint256 _proposalId) external {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];

        require(block.timestamp >= proposal.endTime, "Voting still in progress");
        require(!proposal.finalized, "Already finalized");

        proposal.finalized = true;
        bool passed = proposal.yesVotes > proposal.noVotes;

        emit ProposalFinalized(_proposalId, passed);
    }

    /// @notice Fetches details of a specific proposal
    function getProposal(uint256 _proposalId) external view returns (
        uint256 id,
        string memory description,
        uint256 yesVotes,
        uint256 noVotes,
        uint256 endTime,
        bool finalized,
        address creator
    ) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal memory proposal = proposals[_proposalId];

        return (
            proposal.id,
            proposal.description,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.endTime,
            proposal.finalized,
            proposal.creator
        );
    }
}
