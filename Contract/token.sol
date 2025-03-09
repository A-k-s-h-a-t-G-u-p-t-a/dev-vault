// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import OpenZeppelin contracts for ERC20 and Ownable functionalities.
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProjectToken
 * @dev ERC20 token contract for a project. The project owner receives the initial supply
 * and can call a function to reward contributors.
 */
contract ProjectToken is ERC20, Ownable {
    /**
     * @dev Constructor that gives `projectOwner` all of the initial supply.
     * @param name The name of the token.
     * @param symbol The symbol of the token.
     * @param initialSupply The initial supply (in whole tokens, decimals will be applied).
     * @param projectOwner The owner of the project and the token.
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address projectOwner
    ) ERC20(name, symbol) Ownable(projectOwner) {
        // Mint tokens to the project owner
        _mint(projectOwner, initialSupply * (10 ** decimals()));
    }

    /**
     * @dev Allows the owner to reward a contributor with tokens.
     * @param contributor Address of the contributor.
     * @param amount Number of tokens to reward (including decimals).
     */
    function rewardContributor(address contributor, uint256 amount) external onlyOwner {
        _transfer(owner(), contributor, amount);
    }
}

/**
 * @title ProjectTokenFactory
 * @dev Factory contract to deploy and track ProjectToken contracts.
 */
contract ProjectTokenFactory {
    // Array to store addresses of all deployed tokens
    address[] public allTokens;

    // Mapping from project owner address to an array of their deployed token addresses
    mapping(address => address[]) public tokensByOwner;

    // Event emitted when a new token is created
    event TokenCreated(
        address indexed owner,
        address tokenAddress,
        string name,
        string symbol,
        uint256 initialSupply
    );

    /**
     * @dev Creates a new ProjectToken contract.
     * @param name The name of the token.
     * @param symbol The symbol of the token.
     * @param initialSupply The initial supply of tokens (in whole tokens).
     * @return tokenAddress The address of the newly deployed token contract.
     */
    function createProjectToken(
        string calldata name,
        string calldata symbol,
        uint256 initialSupply
    ) external returns (address tokenAddress) {
        // Deploy a new ProjectToken contract with msg.sender as the project owner
        ProjectToken token = new ProjectToken(name, symbol, initialSupply, msg.sender);
        tokenAddress = address(token);

        // Record the new token in storage
        allTokens.push(tokenAddress);
        tokensByOwner[msg.sender].push(tokenAddress);

        // Emit an event for off-chain tracking
        emit TokenCreated(msg.sender, tokenAddress, name, symbol, initialSupply);

        return tokenAddress;
    }

    /**
     * @dev Returns the number of tokens created on the platform.
     */
    function getTokenCount() external view returns (uint256) {
        return allTokens.length;
    }

    /**
     * @dev Returns an array of token addresses created by a specific owner.
     * @param owner The address of the project owner.
     */
    function getTokensByOwner(address owner) external view returns (address[] memory) {
        return tokensByOwner[owner];
    }
}
