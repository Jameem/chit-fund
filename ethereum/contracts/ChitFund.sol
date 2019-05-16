pragma solidity ^0.4.17;

contract ChitFundFactory {
    address[] public deployedFunds;

    function createFund(string name, uint amount, uint installments, uint participants) public {
        address newFund = new ChitFund(name, amount, installments, participants, msg.sender);
        deployedFunds.push(newFund);
    }

    function getDeployedFunds() public returns (address[]) {
        return deployedFunds;
    }
}

contract ChitFund {

    string public fundName;
    uint public installmentAmount;
    uint public noOfInstallments;
    uint public noOfParticipants;
    uint public currentNoOfContributors;
    address public manager;
    mapping(address => bool) public participants;
    uint public noOfParticipantsJoined;
    uint public fundBalance;
    mapping(address => uint) public contributedParticipants;
    uint public currentInstallment = 1;
    bool public status = true;
    mapping(address => bool) public paidParticipants;
    address[] public participantsArray;
    address[] public participantsToBePaid;
	address public lastWinner;

    modifier isManager() {
        require(msg.sender == manager);
        _;
    }

    modifier isParticipant() {
        require(participants[msg.sender] == true);
        _;
    }

    modifier isEnoughParticipants() {
        require(noOfParticipantsJoined == noOfParticipants);
        _;
    }

    function ChitFund(string _name, uint _amount, uint _installments, uint _noOfParticipants, address creator) public {
        fundName = _name;
        installmentAmount = _amount;
        noOfInstallments = _installments;
        noOfParticipants = _noOfParticipants;
        manager = creator;
    }

    function joinFund() public {
        require(noOfParticipantsJoined < noOfParticipants);
        require(participants[msg.sender] != true);
        require(status);

        // participants.push(msg.sender);
        participants[msg.sender] = true;
        participantsArray.push(msg.sender);
        participantsToBePaid.push(msg.sender);
        noOfParticipantsJoined++;
    }

    function contribute() public isParticipant payable {
        require(msg.value == installmentAmount);
        require(contributedParticipants[msg.sender] != currentInstallment);
        require(status);

        fundBalance += msg.value;
        currentNoOfContributors ++;
        contributedParticipants[msg.sender] = currentInstallment;
    }

    function releaseFund() public isManager {
        require(currentNoOfContributors == noOfParticipants);
        require(status);

		// Pick a winner
        uint index = random() % participantsToBePaid.length;
		lastWinner = participantsToBePaid[index];
        participantsToBePaid[index].transfer(this.balance);
        delete participantsToBePaid[index];
        if (participantsToBePaid.length > 1) {
            participantsToBePaid[index] = participantsToBePaid[participantsToBePaid.length-1];
        }
        participantsToBePaid.length--;
        paidParticipants[msg.sender] = true;

        currentInstallment ++;
        fundBalance = this.balance;
        currentNoOfContributors = 0;

        if(currentInstallment == noOfInstallments) {
            status = false;
        }
    }

    // Generating pseudo random number
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, participantsToBePaid.length));
    }

    function participantsToBePaidLength() public view returns(uint) {
        return participantsToBePaid.length;
    }

    function getSummary() public view returns (
		string, uint, uint, uint, uint, uint, uint, uint, address, bool, address
		) {
		return (
			fundName,
			this.balance,
			installmentAmount,
			noOfInstallments,
			noOfParticipants,
			currentNoOfContributors,
			noOfParticipantsJoined,
			currentInstallment,
			manager,
			status,
			lastWinner
		);
	}
}
